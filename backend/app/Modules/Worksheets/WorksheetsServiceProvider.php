<?php

namespace App\Modules\Worksheets;

use App\Modules\Catalog\Models\Content;
use App\Modules\Shared\ModuleServiceProvider;
use App\Modules\Worksheets\Models\Worksheet;

class WorksheetsServiceProvider extends ModuleServiceProvider
{
    protected function bootModule(): void
    {
        Content::resolveRelationUsing('worksheet', fn (Content $content) => $content->hasOne(Worksheet::class));
    }
}
