<?php

namespace App\Modules\Progress\Listeners;

use App\Modules\Games\Events\GameSessionCompleted;
use App\Modules\Games\Models\GameSession;
use App\Modules\Progress\Support\AchievementEngine;
use App\Modules\Progress\Support\ProgressRecorder;
use App\Modules\Shared\Support\Fa;

/** واکنش ماژول Progress به پایان بازی (هم‌زمان، داخل همان تراکنش) */
class RecordGameProgress
{
    public function __construct(private ProgressRecorder $recorder, private AchievementEngine $achievements) {}

    public function handle(GameSessionCompleted $event): void
    {
        $s = $event->session;
        $child = $s->child;
        $content = $s->game->content->loadMissing('skills');
        $totalLevels = max(1, $s->game->levels->count());

        $this->recorder->logActivity($child, $content, 'game', "{$content->title} · مرحله ".Fa::digits($s->level_number), $s->duration_seconds,
            ['stars' => $s->stars, 'score' => $s->score, 'level' => $s->level_number, 'correct' => $s->correct_count, 'mistakes' => $s->mistakes],
            'game_session', $s->id, $s->started_at);

        $clearedLevels = GameSession::where('child_id', $child->id)->where('game_id', $s->game_id)
            ->where('status', 'completed')->distinct()->count('level_number');
        $this->recorder->updateProgress($child, $content, (int) round($clearedLevels / $totalLevels * 100), $s->stars);

        $points = $s->stars * (int) config('kidsworld.gamification.points_per_star') + ($event->firstClear ? 5 : 0);
        $event->awards['points'] += $this->recorder->awardPoints($child, $points, 'game_session', 'game_session', $s->id);

        $this->recorder->observeSkills($child, $content, $s->stars / 3 * 100);

        foreach ($this->achievements->evaluate($child) as $a) {
            $event->awards['achievements'][] = $a;
            $event->awards['points'] += $a['points'];
        }
    }
}
