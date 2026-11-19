<?php

namespace App\Modules\Shared;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use ReflectionClass;

/**
 * پایه‌ی همه‌ی ماژول‌ها (Modular Monolith).
 *
 * هر ماژول مالک جداول (Database/Migrations)، مسیرها (routes.php)، مدل‌ها و
 * Policyهای خودش است. این Provider آن‌ها را به‌صورت خودکار ثبت می‌کند تا
 * افزودن یک ماژول جدید فقط یک خط در bootstrap/providers.php باشد.
 */
abstract class ModuleServiceProvider extends ServiceProvider
{
    /** @var array<class-string, class-string> */
    protected array $policies = [];

    public function boot(): void
    {
        $dir = $this->moduleDir();

        if (is_dir($dir.'/Database/Migrations')) {
            $this->loadMigrationsFrom($dir.'/Database/Migrations');
        }

        if (file_exists($dir.'/routes.php')) {
            Route::prefix('api/v1')
                ->middleware(['api', 'throttle:api'])
                ->group($dir.'/routes.php');
        }

        foreach ($this->policies as $model => $policy) {
            Gate::policy($model, $policy);
        }

        $this->bootModule();
    }

    protected function bootModule(): void
    {
        //
    }

    protected function moduleDir(): string
    {
        return dirname((new ReflectionClass($this))->getFileName());
    }
}
