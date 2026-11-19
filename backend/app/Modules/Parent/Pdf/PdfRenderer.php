<?php

namespace App\Modules\Parent\Pdf;

/**
 * تبدیل HTML گزارش به PDF. درایورها (config: kidsworld.reports.driver):
 *   chromium  – Chromium/Chrome محلی در حالت headless (سرور تک‌ماشینه یا توسعه)
 *   gotenberg – سرویس Gotenberg در Docker (پیشنهادی برای Production)
 *   html      – بدون تبدیل؛ همان HTML آماده‌ی چاپ ذخیره می‌شود
 */
interface PdfRenderer
{
    /** @return string|null بایت‌های PDF، یا null اگر درایور html باشد */
    public function render(string $html): ?string;
}
