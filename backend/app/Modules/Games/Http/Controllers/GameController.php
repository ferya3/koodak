<?php

namespace App\Modules\Games\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Enums\ContentType;
use App\Modules\Catalog\Models\Content;
use App\Modules\Games\Http\Resources\GameResource;
use App\Modules\Shared\Http\Paginated;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public static function query(): Builder
    {
        return Content::published()->ofType(ContentType::Game)
            ->whereHas('game', fn ($g) => $g->where('status', 'active'))
            ->with(['game.levels', 'skills', 'ageGroups']);
    }

    public function index(Request $request): JsonResponse
    {
        $page = self::query()
            ->filter($request->only(['q', 'age', 'difficulty', 'access', 'categoryId', 'category']))
            ->when($request->input('gameType'), fn ($q, $t) => $q->whereHas('game', fn ($g) => $g->where('game_type', $t)))
            ->orderBy('sort_order')->orderByDesc('published_at')
            ->paginate(min($request->integer('perPage', 24), 60));

        return Paginated::response($page, GameResource::class);
    }

    public function show(string $slug): GameResource
    {
        return GameResource::make(self::query()->where('slug', $slug)->firstOrFail());
    }

    public function levels(string $slug): JsonResponse
    {
        $game = self::query()->where('slug', $slug)->firstOrFail()->game;

        return response()->json(['data' => $game->levels->map(fn ($l) => [
            'levelNumber' => $l->level_number, 'difficulty' => $l->difficulty, 'configuration' => (object) $l->configuration,
        ])]);
    }
}
