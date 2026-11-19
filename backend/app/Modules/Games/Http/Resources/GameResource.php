<?php

namespace App\Modules\Games\Http\Resources;

use App\Modules\Catalog\Http\Resources\ContentResource;
use Illuminate\Http\Request;

/** آینه‌ی Game در @kidsworld/types */
class GameResource extends ContentResource
{
    public function toArray(Request $request): array
    {
        $g = $this->game;

        return [
            ...parent::toArray($request),
            'gameType' => $g->game_type,
            'engine' => $g->engine,
            'levels' => $g->levels->map(fn ($l) => [
                'levelNumber' => $l->level_number,
                'difficulty' => $l->difficulty,
                'configuration' => (object) $l->configuration,
            ])->values(),
        ];
    }
}
