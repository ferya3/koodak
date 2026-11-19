<?php

namespace App\Modules\Shared\Support;

/** ابزارهای متن فارسی برای رشته‌هایی که سرور برای نمایش می‌سازد */
final class Fa
{
    public static function digits(int|string $value): string
    {
        return strtr((string) $value, ['0' => '۰', '1' => '۱', '2' => '۲', '3' => '۳', '4' => '۴', '5' => '۵', '6' => '۶', '7' => '۷', '8' => '۸', '9' => '۹']);
    }
}
