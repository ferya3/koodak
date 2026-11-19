<?php

namespace Tests\Feature;

use App\Modules\Subscriptions\Models\Payment;
use App\Modules\Subscriptions\Models\Plan;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/** درگاه زرین‌پال با پاسخ‌های شبیه‌سازی‌شده (Http::fake) – بدون تماس واقعی با شبکه */
class ZarinpalGatewayTest extends TestCase
{
    private const AUTHORITY = 'A000000000000000000000000000ydq5y838';

    protected function setUp(): void
    {
        parent::setUp();
        config([
            'services.payment.driver' => 'zarinpal',
            'services.payment.zarinpal.merchant_id' => '00000000-0000-0000-0000-000000000000',
            'services.payment.zarinpal.sandbox' => true,
        ]);
        Http::preventStrayRequests();
    }

    private function checkout(): array
    {
        $parent = $this->parent();
        $t = $this->parentToken($parent);
        $plan = Plan::where('slug', 'family')->first();
        $res = $this->postJson('/api/v1/subscriptions/checkout', ['planId' => $plan->id, 'billingPeriod' => 'monthly'], $this->bearer($t));

        return [$parent, $t, $plan, $res];
    }

    public function test_checkout_requests_payment_and_redirects_to_startpay(): void
    {
        Http::fake(['sandbox.zarinpal.com/pg/v4/payment/request.json' => Http::response(['data' => ['code' => 100, 'message' => 'Success', 'authority' => self::AUTHORITY, 'fee_type' => 'Merchant', 'fee' => 100], 'errors' => []])]);

        [$parent, , $plan, $res] = $this->checkout();
        $res->assertCreated()->assertJsonPath('redirectUrl', 'https://sandbox.zarinpal.com/pg/StartPay/'.self::AUTHORITY);

        Http::assertSent(fn ($r) => $r['amount'] === $plan->price_monthly && $r['currency'] === 'IRR'
            && $r['merchant_id'] === '00000000-0000-0000-0000-000000000000'
            && str_ends_with($r['callback_url'], '/api/v1/payments/callback') && $r['metadata']['email'] === $parent->email);
        $this->assertDatabaseHas('payments', ['authority' => self::AUTHORITY, 'gateway' => 'zarinpal', 'status' => 'pending']);
    }

    public function test_gateway_rejection_is_reported_and_order_cancelled(): void
    {
        Http::fake(['*/request.json' => Http::response(['data' => [], 'errors' => ['code' => -10, 'message' => 'Terminal is not valid']], 400)]);

        [, , , $res] = $this->checkout();
        $res->assertStatus(502)->assertJsonPath('message', 'کد پذیرنده یا IP سرور معتبر نیست.');
        $this->assertDatabaseHas('payments', ['status' => 'failed']);
        $this->assertDatabaseHas('subscriptions', ['status' => 'cancelled']);
    }

    public function test_successful_callback_verifies_with_stored_amount_and_activates_plan(): void
    {
        Http::fake([
            '*/request.json' => Http::response(['data' => ['code' => 100, 'authority' => self::AUTHORITY], 'errors' => []]),
            '*/verify.json' => Http::response(['data' => ['code' => 100, 'message' => 'Verified', 'ref_id' => 201, 'card_pan' => '502229******5995', 'card_hash' => 'x', 'fee_type' => 'Merchant', 'fee' => 100], 'errors' => []]),
        ]);
        [, $t, $plan] = $this->checkout();

        // مرورگر کاربر از درگاه برمی‌گردد → هدایت به پنل والدین
        $this->get('/api/v1/payments/callback?Authority='.self::AUTHORITY.'&Status=OK')
            ->assertRedirectContains('/parent/billing?payment=paid&ref=201');

        Http::assertSent(fn ($r) => str_ends_with($r->url(), 'verify.json') && $r['amount'] === $plan->price_monthly && $r['authority'] === self::AUTHORITY);
        $this->assertDatabaseHas('payments', ['status' => 'paid', 'transaction_id' => '201']);
        $this->getJson('/api/v1/subscriptions/current', $this->bearer($t))->assertJsonPath('subscription.plan.slug', 'family');

        // بازگشت تکراری: دوباره تأیید نمی‌شود و همان نتیجه برمی‌گردد
        $this->getJson('/api/v1/payments/callback?Authority='.self::AUTHORITY.'&Status=OK')->assertOk()->assertJsonPath('transactionId', '201');
        Http::assertSentCount(2);

        $this->getJson('/api/v1/payments', $this->bearer($t))->assertJsonPath('data.0.refId', '201')->assertJsonPath('data.0.status', 'paid');
    }

    public function test_cancelled_payment_is_not_verified(): void
    {
        Http::fake(['*/request.json' => Http::response(['data' => ['code' => 100, 'authority' => self::AUTHORITY], 'errors' => []])]);
        [, $t] = $this->checkout();

        $this->get('/api/v1/payments/callback?Authority='.self::AUTHORITY.'&Status=NOK')->assertRedirectContains('payment=failed');
        Http::assertNotSent(fn ($r) => str_ends_with($r->url(), 'verify.json'));
        $this->getJson('/api/v1/subscriptions/current', $this->bearer($t))->assertJsonPath('subscription', null);
    }

    public function test_failed_verification_marks_payment_failed(): void
    {
        Http::fake([
            '*/request.json' => Http::response(['data' => ['code' => 100, 'authority' => self::AUTHORITY], 'errors' => []]),
            '*/verify.json' => Http::response(['data' => [], 'errors' => ['code' => -51, 'message' => 'Session is not valid']], 400),
        ]);
        $this->checkout();
        $this->getJson('/api/v1/payments/callback?Authority='.self::AUTHORITY.'&Status=OK')->assertStatus(402)->assertJsonPath('status', 'failed');
        $this->assertSame('failed', Payment::first()->status);
    }

    public function test_unknown_authority_is_rejected(): void
    {
        $this->getJson('/api/v1/payments/callback?Authority=A0000000000000000000000000000000000X&Status=OK')->assertNotFound();
    }
}
