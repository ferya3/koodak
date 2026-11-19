<?php

namespace App\Modules\Progress\Support;

use App\Modules\Children\Models\ChildProfile;
use App\Modules\Progress\Models\Achievement;
use App\Modules\Progress\Models\ActivityAttempt;
use App\Modules\Progress\Models\ChildAchievement;

/** ارزیابی قواعد مدال‌ها پس از هر فعالیت؛ قواعد و آستانه‌ها از CMS می‌آیند */
class AchievementEngine
{
    public function __construct(private ProgressRecorder $recorder) {}

    /** @return array<int, array{id:string, slug:string, title:string, icon:string, points:int}> */
    public function evaluate(ChildProfile $child): array
    {
        $earned = ChildAchievement::where('child_id', $child->id)->pluck('achievement_id')->flip();
        $pending = Achievement::where('status', 'active')->orderBy('sort_order')->get()->reject(fn ($a) => isset($earned[$a->id]));
        if ($pending->isEmpty()) {
            return [];
        }

        $stats = ChildStats::for($child);
        $metric = fn (string $rule) => match ($rule) {
            'first_activity' => ActivityAttempt::where('child_id', $child->id)->count(),
            'games_completed' => $stats->countActivities('game'),
            'three_star_games' => $stats->countActivities('game', ['stars' => 3]),
            'stories_completed' => $stats->countActivities('story'),
            'drawings_saved' => $stats->countActivities('drawing'),
            'streak_days' => $stats->streakDays(),
            'correct_answers' => $stats->sumResult('game', 'correct'),
            default => 0,
        };

        $new = [];
        $cache = [];
        foreach ($pending as $a) {
            $value = $cache[$a->rule_type] ??= $metric($a->rule_type);
            if ($value >= $a->rule_threshold) {
                ChildAchievement::create(['child_id' => $child->id, 'achievement_id' => $a->id, 'earned_at' => now()]);
                $this->recorder->awardPoints($child, $a->points, 'achievement', 'achievement', (string) $a->id);
                $new[] = ['id' => (string) $a->id, 'slug' => $a->slug, 'title' => $a->title, 'icon' => $a->icon, 'points' => $a->points];
            }
        }

        return $new;
    }
}
