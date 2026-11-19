<?php

namespace App\Modules\Subscriptions\Gateways;

use App\Modules\Subscriptions\Models\Payment;
use Illuminate\Support\Str;

/** درگاه آزمایشی برای توسعه و تست – در Production فعال نمی‌شود */
class FakeGateway implements PaymentGateway
{
    public function name(): string
    {
        return 'fake';
    }

    public function request(Payment $payment, string $callbackUrl): string
    {
        $payment->update(['authority' => 'FAKE-'.Str::upper(Str::random(16))]);

        return $callbackUrl.'?'.http_build_query(['authority' => $payment->authority, 'status' => 'OK']);
    }

    public function verify(Payment $payment, array $callbackData): ?string
    {
        return ($callbackData['status'] ?? null) === 'OK' ? 'TRX-'.Str::upper(Str::random(10)) : null;
    }
}
