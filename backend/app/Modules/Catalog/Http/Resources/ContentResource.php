<?php

namespace App\Modules\Catalog\Http\Resources;

use App\Modules\Catalog\Models\Content;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * فیلدهای مشترک همه‌ی محتواها – آینه‌ی ContentBase در @kidsworld/types.
 * Resourceهای Worksheet / Game / Story این کلاس را گسترش می‌دهند.
 *
 * @mixin Content
 */
class ContentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $t = $this->translation();

        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'type' => $this->content_type->value,
            'title' => $t?->title ?? $this->title,
            'description' => $t?->description ?? $this->description,
            'categoryId' => (string) $this->category_id,
            'subjectId' => $this->subject_id ? (string) $this->subject_id : null,
            'ageGroupIds' => $this->whenLoaded('ageGroups', fn () => $this->ageGroups->pluck('id')->map(fn ($id) => (string) $id)->values(), []),
            'minAge' => $this->min_age,
            'maxAge' => $this->max_age,
            'difficulty' => $this->difficulty->value,
            'estimatedMinutes' => $this->estimated_minutes,
            'access' => $this->access_level,
            'status' => $this->status->value,
            'skills' => $this->whenLoaded('skills', fn () => $this->skills->map(fn ($s) => ['skillId' => (string) $s->id, 'weight' => (float) $s->pivot->weight])->values(), []),
            'tone' => $this->tone,
            'coverUrl' => $this->whenLoaded('cover', fn () => $this->cover?->publicUrl()),
            'publishedAt' => $this->published_at?->toDateString(),
            'seo' => $this->when($request->routeIs('*.show'), $this->seo),
        ];
    }
}
