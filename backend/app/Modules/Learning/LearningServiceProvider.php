<?php

namespace App\Modules\Learning;

use App\Modules\Catalog\Models\Content;
use App\Modules\Learning\Models\Lesson;
use App\Modules\Shared\ModuleServiceProvider;

class LearningServiceProvider extends ModuleServiceProvider
{
    protected function bootModule(): void
    {
        Content::resolveRelationUsing('lesson', fn (Content $content) => $content->hasOne(Lesson::class));
    }
}
