<?php

namespace App\Modules\Subscriptions\Gateways;

use App\Modules\Subscriptions\Models\Payment;

/**
 * قرارداد درگاه پرداخت. هر درگاه (زرین‌پال، و در بازار بین‌المللی Stripe و …) فقط همین دو متد را
 * پیاده می‌کند و با PAYMENT_DRIVER انتخاب می‌شود.
 */
interface PaymentGateway
{
    public function name(): string;

    /**
     * درخواست پرداخت؛ authority را روی Payment ذخیره و آدرس هدایت کاربر به درگاه را برمی‌گرداند.
     *
     * @throws PaymentGatewayException
     */
    public function request(Payment $payment, string $callbackUrl): string;

    /**
     * تأیید نهایی سمت سرور پس از بازگشت از درگاه.
     *
     * @param  array<string, mixed>  $callbackData  پارامترهای Query بازگشت (Authority, Status)
     * @return array{ref_id: string, card_pan?: string|null}|null null یعنی پرداخت ناموفق
     *
     * @throws PaymentGatewayException
     */
    public function verify(Payment $payment, array $callbackData): ?array;
}
