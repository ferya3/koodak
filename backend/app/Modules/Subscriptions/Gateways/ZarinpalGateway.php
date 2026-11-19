<?php

namespace App\Modules\Subscriptions\Gateways;

use App\Modules\Subscriptions\Models\Payment;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * درگاه زرین‌پال – REST API نسخه‌ی ۴
 *
 *   درخواست:  POST {base}/pg/v4/payment/request.json   → data.code = 100 ، data.authority
 *   هدایت:    {base}/pg/StartPay/{authority}
 *   بازگشت:   GET callback_url?Authority=…&Status=OK|NOK
 *   تأیید:    POST {base}/pg/v4/payment/verify.json    → data.code = 100 (موفق) یا 101 (قبلاً تأیید شده) ، data.ref_id
 *
 * base: https://payment.zarinpal.com  ·  sandbox: https://sandbox.zarinpal.com
 * (مطابق SDK رسمی zarinpal/zarinpal-php-sdk نسخه‌ی 2.0.0)
 * مبلغ به ریال ارسال می‌شود (currency = IRR) و در تأیید باید دقیقاً همان مبلغ ذخیره‌شده باشد.
 */
class ZarinpalGateway implements PaymentGateway
{
    /** پیام فارسی کدهای خطای رایج زرین‌پال */
    private const ERRORS = [
        -9 => 'اطلاعات ارسالی به درگاه معتبر نیست.',
        -10 => 'کد پذیرنده یا IP سرور معتبر نیست.',
        -11 => 'کد پذیرنده فعال نیست.',
        -12 => 'تلاش بیش از حد؛ کمی بعد دوباره امتحان کنید.',
        -15 => 'درگاه پذیرنده تعلیق شده است.',
        -18 => 'دامنه‌ی بازگشت با دامنه‌ی ثبت‌شده در زرین‌پال یکسان نیست.',
        -50 => 'مبلغ پرداخت‌شده با مبلغ سفارش یکسان نیست.',
        -51 => 'پرداخت ناموفق بود.',
        -53 => 'شناسه‌ی پرداخت متعلق به این پذیرنده نیست.',
        -54 => 'شناسه‌ی پرداخت نامعتبر است.',
    ];

    public function __construct(
        private readonly string $merchantId,
        private readonly bool $sandbox = false,
        private readonly string $description = 'اشتراک KidsWorld',
    ) {}

    public function name(): string
    {
        return 'zarinpal';
    }

    private function base(): string
    {
        return $this->sandbox ? 'https://sandbox.zarinpal.com' : 'https://payment.zarinpal.com';
    }

    private function post(string $path, array $body): array
    {
        try {
            $res = Http::acceptJson()->asJson()->timeout(15)->retry(2, 500, throw: false)
                ->post($this->base().'/pg/v4/payment/'.$path, ['merchant_id' => $this->merchantId, ...$body]);
        } catch (ConnectionException $e) {
            throw new PaymentGatewayException('ارتباط با درگاه پرداخت برقرار نشد. لطفاً دوباره تلاش کنید.', previous: $e);
        }

        $json = $res->json() ?? [];
        // زرین‌پال در خطا data را خالی و errors را پر می‌کند
        $code = (int) ($json['data']['code'] ?? $json['errors']['code'] ?? 0);

        return [$code, $json['data'] ?? [], $json['errors'] ?? []];
    }

    public function request(Payment $payment, string $callbackUrl): string
    {
        $user = $payment->user;
        [$code, $data, $errors] = $this->post('request.json', [
            'amount' => $payment->amount,
            'currency' => 'IRR',
            'callback_url' => $callbackUrl,
            'description' => $this->description." #{$payment->id}",
            'metadata' => array_filter(['email' => $user?->email, 'mobile' => $user?->phone, 'order_id' => (string) $payment->id]),
        ]);

        if ($code !== 100 || empty($data['authority'])) {
            Log::warning('Zarinpal request failed', ['payment' => $payment->id, 'code' => $code, 'errors' => $errors]);
            throw new PaymentGatewayException(self::ERRORS[$code] ?? 'درگاه پرداخت درخواست را نپذیرفت.');
        }

        $payment->update(['authority' => $data['authority'], 'meta' => [...($payment->meta ?? []), 'fee' => $data['fee'] ?? null]]);

        return $this->base().'/pg/StartPay/'.$data['authority'];
    }

    public function verify(Payment $payment, array $callbackData): ?array
    {
        if (($callbackData['Status'] ?? null) !== 'OK') {
            return null; // کاربر انصراف داده یا پرداخت ناموفق بوده
        }

        [$code, $data, $errors] = $this->post('verify.json', [
            'authority' => $payment->authority,
            'amount' => $payment->amount,
        ]);

        if (in_array($code, [100, 101], true) && ! empty($data['ref_id'])) {
            return ['ref_id' => (string) $data['ref_id'], 'card_pan' => $data['card_pan'] ?? null];
        }

        Log::warning('Zarinpal verify failed', ['payment' => $payment->id, 'code' => $code, 'errors' => $errors]);

        return null;
    }
}
