<?php

namespace App\Modules\Catalog\Http\Resources;

use App\Modules\Catalog\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Category – هم‌خوان با Category در @kidsworld/types */
class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'parentId' => $this->parent_id ? (string) $this->parent_id : null,
            'slug' => $this->slug,
            'title' => app()->getLocale() === 'en' && $this->title_en ? $this->title_en : $this->title,
            'titleEn' => $this->title_en,
            'description' => $this->description,
            'icon' => $this->icon,
            'tone' => $this->tone,
            'sortOrder' => $this->sort_order,
            'children' => self::collection($this->whenLoaded('children')),
            'subjects' => $this->whenLoaded('subjects', fn () => $this->subjects->map(fn ($s) => ['id' => (string) $s->id, 'slug' => $s->slug, 'title' => $s->title])),
        ];
    }
}
