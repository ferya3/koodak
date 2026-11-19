<?php

namespace App\Modules\Subscriptions\Gateways;

use App\Modules\Subscriptions\Models\Payment;

/**
 * قرارداد درگاه پرداخت. پیاده‌سازی واقعی (مثلاً زرین‌پال، IDPay یا Stripe برای بازار بین‌المللی)
 * فقط همین دو متد را پیاده می‌کند و در config/services.php انتخاب می‌شود.
 */
interface PaymentGateway
{
    public function name(): string;

    /** درخواست پرداخت؛ authority را روی Payment ذخیره و آدرس هدایت کاربر را برمی‌گرداند */
    public function request(Payment $payment, string $callbackUrl): string;

    /** تأیید نهایی پس از بازگشت از درگاه؛ در صورت موفقیت کد پیگیری را برمی‌گرداند */
    public function verify(Payment $payment, array $callbackData): ?string;
}
