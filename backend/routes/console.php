<?php

use Illuminate\Support\Facades\Schedule;

// انتشار زمان‌بندی‌شده‌ی محتوا
Schedule::command('content:publish-scheduled')->everyMinute()->withoutOverlapping();
// حذف دائمی داده‌ی کودکانی که مهلت حذفشان رسیده
Schedule::command('children:purge')->dailyAt('03:15')->onOneServer();
// پاک‌سازی توکن‌های منقضی (جلسه‌های کودک کوتاه‌عمرند)
Schedule::command('sanctum:prune-expired --hours=24')->daily();
