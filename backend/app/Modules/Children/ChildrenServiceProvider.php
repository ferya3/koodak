<?php

namespace App\Modules\Children;

use App\Modules\Children\Console\PurgeChildrenCommand;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Children\Policies\ChildProfilePolicy;
use App\Modules\Shared\ModuleServiceProvider;

class ChildrenServiceProvider extends ModuleServiceProvider
{
    protected array $policies = [ChildProfile::class => ChildProfilePolicy::class];

    protected function bootModule(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([PurgeChildrenCommand::class]);
        }
    }
}
