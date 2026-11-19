<?php

namespace App\Modules\Parent\Support;

use App\Modules\Children\Http\Resources\ChildResource;
use App\Modules\Children\Http\Resources\SettingsResource;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Progress\Http\Resources\ActivityLogResource;
use App\Modules\Progress\Models\ActivityAttempt;
use App\Modules\Progress\Models\SkillObservation;
use App\Modules\Progress\Support\ChildStats;
use App\Modules\Recommendations\Support\ContentPresenter;
use App\Modules\Recommendations\Support\RecommendationEngine;

/** داده‌ی کامل داشبورد والدین برای یک کودک در یک درخواست */
class DashboardBuilder
{
    public function __construct(private RecommendationEngine $engine) {}

    public function build(ChildProfile $child): array
    {
        $child->loadMissing(['preferences', 'settings', 'parent']);
        $stats = ChildStats::for($child);
        $week = $stats->weeklyMinutes();
        $limit = $child->settings?->daily_limit_minutes ?? 45;
        $minutes = array_column($week, 'minutes');
        $since = now()->subDays(7);

        return [
            'child' => ChildResource::make($child)->resolve(),
            'settings' => $child->settings ? SettingsResource::make($child->settings)->resolve() : null,
            'kpis' => [
                'totalMinutes' => array_sum($minutes),
                'avgMinutesPerDay' => (int) round(array_sum($minutes) / 7),
                'activitiesCompleted' => ActivityAttempt::where('child_id', $child->id)->where('started_at', '>=', $since)->count(),
                'activitiesPrevWeek' => ActivityAttempt::where('child_id', $child->id)->whereBetween('started_at', [now()->subDays(14), $since])->count(),
                'streakDays' => $stats->streakDays(),
                'points' => $stats->totalPoints(),
                'daysOverLimit' => count(array_filter($minutes, fn ($m) => $m > $limit)),
            ],
            'weeklyMinutes' => $week,
            'minutesByType' => $stats->minutesByType(),
            'skills' => SkillObservation::where('child_id', $child->id)->with('skill')->orderByDesc('observation_score')->get()->map(fn ($o) => [
                'skillId' => (string) $o->skill_id, 'title' => $o->skill->title, 'score' => (int) round($o->observation_score),
                'sampleCount' => $o->sample_count, 'trend' => $o->trend(),
            ])->all(),
            'recentActivity' => ActivityLogResource::collection(ActivityAttempt::where('child_id', $child->id)->latest('started_at')->limit(8)->get())->resolve(),
            'recommendations' => $this->engine->for($child, 3)->map(fn ($r) => [
                'content' => ContentPresenter::make($r['content'])->resolve(), 'reason' => $r['reason'],
            ])->all(),
        ];
    }
}
