<?php

namespace App\Modules\Children\Http\Resources;

use App\Modules\Children\Models\ChildProfile;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ChildProfile  – هم‌خوان با ChildProfile در @kidsworld/types */
class ChildResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'displayName' => $this->display_name,
            'birthYearMonth' => $this->birth_year_month,
            'age' => $this->age(),
            'avatar' => $this->avatar,
            'favoriteCategoryIds' => array_map('strval', $this->preferences?->favorite_categories ?? []),
            'preferredLanguage' => $this->preferred_language,
        ];
    }
}
