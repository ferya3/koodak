<?php

namespace App\Modules\Games;

use App\Modules\Catalog\Models\Content;
use App\Modules\Children\Contracts\ChildDataSection;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Games\Models\Game;
use App\Modules\Games\Models\GameSession;
use App\Modules\Shared\ModuleServiceProvider;

class GamesServiceProvider extends ModuleServiceProvider
{
    public function register(): void
    {
        $this->app->bind('games.child-data', fn () => new class implements ChildDataSection
        {
            public function key(): string
            {
                return 'gameSessions';
            }

            public function export(ChildProfile $child): array
            {
                return GameSession::where('child_id', $child->id)->with('game.content:id,slug,title')->orderBy('started_at')->get()
                    ->map(fn ($s) => [
                        'game' => $s->game->content->title, 'level' => $s->level_number, 'status' => $s->status,
                        'stars' => $s->stars, 'score' => $s->score, 'mistakes' => $s->mistakes,
                        'durationSeconds' => $s->duration_seconds, 'startedAt' => $s->started_at?->toIso8601String(),
                    ])->all();
            }
        });
        $this->app->tag('games.child-data', 'child-data-sections');
    }

    protected function bootModule(): void
    {
        Content::resolveRelationUsing('game', fn (Content $content) => $content->hasOne(Game::class));
    }
}
