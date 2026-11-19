<?php

namespace App\Modules\Progress\Support;

use App\Modules\Catalog\Models\Content;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Progress\Models\ActivityAttempt;
use App\Modules\Progress\Models\ChildProgress;
use App\Modules\Progress\Models\PointsTransaction;
use App\Modules\Progress\Models\SkillObservation;
use Illuminate\Support\Carbon;

/** تنها نقطه‌ی نوشتن در جداول پیشرفت */
class ProgressRecorder
{
    /** ضریب یادگیری میانگین متحرک نمایی برای مشاهده‌ی مهارت */
    private const ALPHA = 0.3;

    public function logActivity(ChildProfile $child, ?Content $content, string $type, string $title, int $durationSeconds, array $result = [], ?string $sourceType = null, ?string $sourceId = null, ?Carbon $startedAt = null): ActivityAttempt
    {
        return ActivityAttempt::create([
            'child_id' => $child->id,
            'content_id' => $content?->id,
            'activity_type' => $type,
            'title' => $title,
            'tone' => $content?->tone ?? match ($type) {
                'drawing' => 'berry', 'story' => 'lilac', default => 'sky'
            },
            'started_at' => $startedAt ?? now()->subSeconds($durationSeconds),
            'completed_at' => now(),
            'duration_seconds' => $durationSeconds,
            'result' => $result,
            'source_type' => $sourceType,
            'source_id' => $sourceId,
        ]);
    }

    public function updateProgress(ChildProfile $child, Content $content, int $percent, int $stars = 0): ChildProgress
    {
        $p = ChildProgress::firstOrNew(['child_id' => $child->id, 'content_id' => $content->id]);
        $p->progress_percent = max($p->progress_percent ?? 0, min(100, $percent));
        $p->completion_status = $p->progress_percent >= 100 ? 'completed' : 'in_progress';
        $p->best_stars = max($p->best_stars ?? 0, $stars);
        $p->attempts = ($p->attempts ?? 0) + 1;
        $p->last_activity_at = now();
        $p->save();

        return $p;
    }

    public function awardPoints(ChildProfile $child, int $points, string $reason, ?string $refType = null, ?string $refId = null): int
    {
        if ($points <= 0) {
            return 0;
        }
        PointsTransaction::create(['child_id' => $child->id, 'points' => $points, 'reason' => $reason, 'reference_type' => $refType, 'reference_id' => $refId]);

        return $points;
    }

    /**
     * یک نمونه‌ی عملکرد (۰ تا ۱۰۰) برای همه‌ی مهارت‌های محتوا ثبت می‌شود؛ وزن مهارت سرعت تأثیر را تعیین می‌کند.
     * previous_score هفته‌ای یک‌بار به‌روز می‌شود تا «روند» معنادار باشد.
     */
    public function observeSkills(ChildProfile $child, Content $content, float $sample): void
    {
        foreach ($content->skills as $skill) {
            $weight = (float) $skill->pivot->weight;
            $obs = SkillObservation::firstOrNew(['child_id' => $child->id, 'skill_id' => $skill->id]);

            if (! $obs->exists) {
                $obs->observation_score = round($sample, 2);
                $obs->sample_count = 1;
                $obs->observed_at = now();
                $obs->save();

                continue;
            }

            if ($obs->observed_at->lt(now()->subDays(7)) || $obs->previous_score === null) {
                $obs->previous_score = $obs->observation_score;
            }
            $obs->observation_score = round($obs->observation_score + ($sample - $obs->observation_score) * self::ALPHA * $weight, 2);
            $obs->sample_count++;
            $obs->observed_at = now();
            $obs->save();
        }
    }
}
