<?php

namespace App\Modules\Identity;

use App\Modules\Identity\Console\CreateAdminCommand;
use App\Modules\Shared\ModuleServiceProvider;

class IdentityServiceProvider extends ModuleServiceProvider
{
    protected function bootModule(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([CreateAdminCommand::class]);
        }
    }
}
