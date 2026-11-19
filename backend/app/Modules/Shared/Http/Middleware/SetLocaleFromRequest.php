<?php

namespace App\Modules\Shared\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * زبان پاسخ به‌صورت صریح انتخاب می‌شود: ?locale=en یا هدر X-Locale.
 * Accept-Language مرورگر عمداً نادیده گرفته می‌شود، چون زبان سیستم‌عامل کاربر فارسی‌زبان
 * اغلب انگلیسی است؛ پیش‌فرض همیشه kidsworld.default_locale (fa) است؛ از config('app.locale') استفاده نمی‌شود چون setLocale آن را تغییر می‌دهد.
 */
class SetLocaleFromRequest
{
    private const SUPPORTED = ['fa', 'en'];

    public function handle(Request $request, Closure $next): Response
    {
        $locale = $request->query('locale') ?: $request->header('X-Locale');
        app()->setLocale(in_array($locale, self::SUPPORTED, true) ? $locale : config('kidsworld.default_locale'));

        $response = $next($request);
        $response->headers->set('Content-Language', app()->getLocale());

        return $response;
    }
}
