<?php

return [
    /*
    | فعال/غیرفعال‌سازی بخش‌های تجاری و آزمایشی بدون تغییر کد
    */
    'features' => [
        'subscriptions' => env('KIDSWORLD_FEATURE_SUBSCRIPTIONS', true),
        'schools' => env('KIDSWORLD_FEATURE_SCHOOLS', false),
        'ai' => env('KIDSWORLD_FEATURE_AI', false),
    ],

    // زبان پیش‌فرض API (ثابت؛ برخلاف app.locale که در هر درخواست تغییر می‌کند)
    'default_locale' => env('APP_LOCALE', 'fa'),

    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),

    'children' => [
        // حداکثر تعداد پروفایل کودک برای هر والد (پلن رایگان در Subscriptions محدودتر است)
        'max_per_parent' => 6,
        // عمر توکن جلسه‌ی کودک (دقیقه)
        'session_token_ttl' => 12 * 60,
        // مهلت حذف کامل داده‌ها پس از درخواست والد (روز)
        'deletion_grace_days' => 30,
    ],

    'reports' => [
        // html | chromium | gotenberg
        'driver' => env('REPORTS_PDF_DRIVER', 'html'),
        'chromium_path' => env('REPORTS_CHROMIUM_PATH', 'chromium'),
        'gotenberg_url' => env('GOTENBERG_URL', 'http://gotenberg:3000'),
    ],

    'gamification' => [
        // امتیاز پایه برای هر ستاره
        'points_per_star' => 10,
    ],
];
