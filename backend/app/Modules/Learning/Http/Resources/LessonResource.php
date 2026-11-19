<?php

namespace App\Modules\Learning\Http\Resources;

use App\Modules\Catalog\Http\Resources\ContentResource;
use Illuminate\Http\Request;

/**
 * آینه‌ی Lesson در @kidsworld/types.
 * پاسخ صحیح پرسش‌ها عمداً ارسال می‌شود تا بازخورد فوری و آفلاین ممکن باشد؛
 * نمره‌ی رسمی همیشه در سرور از روی پاسخ‌ها محاسبه می‌شود.
 */
class LessonResource extends ContentResource
{
    public function toArray(Request $request): array
    {
        $lesson = $this->lesson;

        return [
            ...parent::toArray($request),
            'objectives' => $lesson->objectives,
            'prerequisiteIds' => $lesson->prerequisites->pluck('id')->map(fn ($id) => (string) $id)->values(),
            'steps' => $lesson->steps->map(fn ($s) => [
                'id' => $s->key,
                'type' => $s->step_type,
                'title' => $s->title,
                'body' => (string) $s->body,
                'visual' => $s->visual,
                'question' => $s->question,
                'audioUrl' => $s->audio?->publicUrl(),
            ])->values(),
        ];
    }
}
