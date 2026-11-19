<?php

namespace App\Modules\Stories;

use App\Modules\Catalog\Models\Content;
use App\Modules\Shared\ModuleServiceProvider;
use App\Modules\Stories\Models\Story;

class StoriesServiceProvider extends ModuleServiceProvider
{
    protected function bootModule(): void
    {
        Content::resolveRelationUsing('story', fn (Content $content) => $content->hasOne(Story::class));
    }
}
