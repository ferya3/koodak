<?php

namespace App\Modules\Shared\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * اصل ۱۲ سند: «تمام بخش‌های تجاری باید قابلیت فعال یا غیرفعال شدن داشته باشند».
 * استفاده: ->middleware('feature:subscriptions')
 */
class EnsureFeatureEnabled
{
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        abort_unless(config("kidsworld.features.$feature", false), 404);

        return $next($request);
    }
}
