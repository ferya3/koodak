<?php

namespace App\Modules\Children\Contracts;

use App\Modules\Children\Models\ChildProfile;

/**
 * هر ماژولی که داده‌ی کودک نگه می‌دارد، یک Section ثبت می‌کند (tag: child-data-sections)
 * تا «دریافت نسخه‌ی کامل داده‌ها» برای والد کامل باشد – بدون وابستگی ماژول Children به جداول دیگران.
 */
interface ChildDataSection
{
    public function key(): string;

    /** @return array<mixed> */
    public function export(ChildProfile $child): array;
}
