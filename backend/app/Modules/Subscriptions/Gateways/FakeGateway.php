<?php

namespace App\Modules\Subscriptions\Gateways;

use App\Modules\Subscriptions\Models\Payment;
use Illuminate\Support\Str;

/** درگاه آزمایشی برای توسعه و تست – در Production قابل استفاده نیست. پارامترهای بازگشت مثل زرین‌پال است. */
class FakeGateway implements PaymentGateway
{
    public function name(): string
    {
        return 'fake';
    }

    public function request(Payment $payment, string $callbackUrl): string
    {
        $payment->update(['authority' => 'FAKE'.Str::upper(Str::random(32))]);

        return $callbackUrl.'?'.http_build_query(['Authority' => $payment->authority, 'Status' => 'OK']);
    }

    public function verify(Payment $payment, array $callbackData): ?array
    {
        return ($callbackData['Status'] ?? null) === 'OK' ? ['ref_id' => (string) random_int(10000000, 99999999), 'card_pan' => '6037**********1234'] : null;
    }
}
