<?php

namespace App\Modules\Parent;

use App\Modules\Shared\ModuleServiceProvider;

class ParentServiceProvider extends ModuleServiceProvider
{
    protected function bootModule(): void
    {
        $this->loadViewsFrom($this->moduleDir().'/resources/views', 'parent');
    }
}
