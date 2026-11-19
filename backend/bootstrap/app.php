<?php

use App\Modules\Shared\Http\Middleware\EnsureFeatureEnabled;
use App\Modules\Shared\Http\Middleware\SetLocaleFromRequest;
use App\Providers\AppServiceProvider;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Middleware\CheckAbilities;
use Laravel\Sanctum\Http\Middleware\CheckForAnyAbility;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
        // مسیرهای API توسط هر ماژول در app/Modules/*/routes.php ثبت می‌شوند (prefix: api/v1)
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // فقط پراکسی‌های داخلی (Caddy/Nginx، سرور Next) مجازند IP واقعی کاربر را در X-Forwarded-For بفرستند
        $middleware->trustProxies(at: AppServiceProvider::INTERNAL_NETWORKS);
        $middleware->appendToGroup('api', SetLocaleFromRequest::class);
        $middleware->alias([
            'abilities' => CheckAbilities::class,
            'ability' => CheckForAnyAbility::class,
            'feature' => EnsureFeatureEnabled::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
