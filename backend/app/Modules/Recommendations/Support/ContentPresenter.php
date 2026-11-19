<?php

namespace App\Modules\Recommendations\Support;

use App\Modules\Catalog\Enums\ContentType;
use App\Modules\Catalog\Http\Resources\ContentResource;
use App\Modules\Catalog\Models\Content;
use App\Modules\Games\Http\Resources\GameResource;
use App\Modules\Learning\Http\Resources\LessonResource;
use App\Modules\Stories\Http\Resources\StoryResource;
use App\Modules\Worksheets\Http\Resources\WorksheetResource;

/** انتخاب Resource مناسب بر اساس نوع محتوا (خروجی هم‌خوان با union تایپ Content) */
final class ContentPresenter
{
    public static function make(Content $content): ContentResource
    {
        return match ($content->content_type) {
            ContentType::Game => GameResource::make($content),
            ContentType::Story => StoryResource::make($content),
            ContentType::Worksheet => WorksheetResource::make($content),
            ContentType::Lesson => LessonResource::make($content),
            default => ContentResource::make($content),
        };
    }

    public static function relations(): array
    {
        return ['skills', 'ageGroups', 'game.levels', 'worksheet', 'story.chapters.choices', 'lesson.steps', 'lesson.prerequisites'];
    }
}
