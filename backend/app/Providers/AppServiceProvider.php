<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Symfony\Component\HttpFoundation\IpUtils;

class AppServiceProvider extends ServiceProvider
{
    /** شبکه‌های داخلی Docker / سرور (فرانت‌اند Next و پراکسی معکوس) */
    public const INTERNAL_NETWORKS = ['127.0.0.1/32', '10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16'];

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // در Production همه‌ی آدرس‌های مطلق (بازگشت درگاه، Signed URL، پنل مدیریت) از APP_URL ساخته می‌شوند،
        // حتی وقتی درخواست از شبکه‌ی داخلی (مثلاً caddy:8080) رسیده باشد.
        if ($this->app->isProduction() && config('app.url')) {
            URL::forceRootUrl(config('app.url'));
            if (str_starts_with((string) config('app.url'), 'https://')) {
                URL::forceScheme('https');
            }
        }

        // محدودیت نرخ درخواست. درخواست‌های داخلی بدون IP کاربر (SSR صفحات عمومی) محدود نمی‌شوند؛
        // درخواست‌های BFF آدرس واقعی کاربر را در X-Forwarded-For می‌فرستند و بر اساس آن محدود می‌شوند.
        $internal = fn (Request $r) => IpUtils::checkIp((string) $r->ip(), self::INTERNAL_NETWORKS);

        RateLimiter::for('api', fn (Request $request) => $internal($request) ? Limit::none() : Limit::perMinute(120)->by($request->user()?->id ?: $request->ip()));
        RateLimiter::for('auth', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));
        RateLimiter::for('game-events', fn (Request $request) => Limit::perMinute(240)->by($request->user()?->id ?: $request->ip()));
    }
}
