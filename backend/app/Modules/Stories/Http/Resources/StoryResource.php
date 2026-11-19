<?php

namespace App\Modules\Stories\Http\Resources;

use App\Modules\Catalog\Http\Resources\ContentResource;
use Illuminate\Http\Request;

/** آینه‌ی Story در @kidsworld/types – شناسه‌ی فصل‌ها کلید پایدار (key) است */
class StoryResource extends ContentResource
{
    public function toArray(Request $request): array
    {
        $story = $this->story;
        $keys = $story->chapters->pluck('key', 'id');

        return [
            ...parent::toArray($request),
            'storyType' => $story->story_type,
            'audioUrl' => $story->audio?->publicUrl(),
            'chapters' => $story->chapters->map(fn ($c) => [
                'id' => $c->key,
                'title' => $c->title,
                'body' => $c->body,
                'scene' => $c->scene,
                'imageUrl' => $c->image?->publicUrl(),
                'audioUrl' => $c->audio?->publicUrl(),
                'choices' => $c->choices->map(fn ($ch) => [
                    'id' => (string) $ch->id,
                    'text' => $ch->choice_text,
                    'nextChapterId' => $keys[$ch->next_chapter_id] ?? null,
                ])->values(),
                'isEnding' => $c->is_ending,
            ])->values(),
        ];
    }
}
