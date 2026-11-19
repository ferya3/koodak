<?php

namespace App\Modules\Catalog;

use App\Modules\Catalog\Console\PublishScheduledContentCommand;
use App\Modules\Shared\ModuleServiceProvider;

class CatalogServiceProvider extends ModuleServiceProvider
{
    protected function bootModule(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([PublishScheduledContentCommand::class]);
        }
    }
}
