<?php

namespace App\Modules\Progress\Support;

use App\Modules\Children\Models\ChildProfile;
use App\Modules\Progress\Models\ActivityAttempt;
use App\Modules\Progress\Models\PointsTransaction;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

/** آمار خواندنی کودک: روزهای پیاپی، دقیقه‌ها، شمارنده‌ها */
class ChildStats
{
    public function __construct(private ChildProfile $child) {}

    public static function for(ChildProfile $child): self
    {
        return new self($child);
    }

    private function tz(): string
    {
        return $this->child->parent?->timezone ?? config('app.timezone');
    }

    public function streakDays(): int
    {
        $days = ActivityAttempt::where('child_id', $this->child->id)
            ->where('started_at', '>=', now()->subDays(60))
            ->pluck('started_at')
            ->map(fn (Carbon $d) => $d->copy()->setTimezone($this->tz())->toDateString())
            ->unique()->flip();

        $cursor = now($this->tz());
        if (! isset($days[$cursor->toDateString()])) {
            $cursor->subDay(); // اگر امروز هنوز فعالیتی نیست، از دیروز بشمار
        }
        $streak = 0;
        while (isset($days[$cursor->toDateString()])) {
            $streak++;
            $cursor->subDay();
        }

        return $streak;
    }

    /** دقیقه‌های ۷ روز اخیر، از قدیمی به جدید @return array<int, array{date:string, minutes:int}> */
    public function weeklyMinutes(): array
    {
        $start = now($this->tz())->startOfDay()->subDays(6);
        $byDay = ActivityAttempt::where('child_id', $this->child->id)->where('started_at', '>=', $start->copy()->utc())
            ->get(['started_at', 'duration_seconds'])
            ->groupBy(fn ($a) => $a->started_at->copy()->setTimezone($this->tz())->toDateString())
            ->map(fn (Collection $g) => (int) round($g->sum('duration_seconds') / 60));

        return collect(range(0, 6))->map(function ($i) use ($start, $byDay) {
            $d = $start->copy()->addDays($i)->toDateString();

            return ['date' => $d, 'minutes' => $byDay[$d] ?? 0];
        })->all();
    }

    /** @return array<int, array{type:string, minutes:int}> */
    public function minutesByType(int $days = 7): array
    {
        return ActivityAttempt::where('child_id', $this->child->id)->where('started_at', '>=', now()->subDays($days))
            ->selectRaw('activity_type, SUM(duration_seconds) as secs')->groupBy('activity_type')->orderByDesc('secs')->get()
            ->map(fn ($r) => ['type' => $r->activity_type, 'minutes' => (int) round($r->secs / 60)])->all();
    }

    public function totalPoints(): int
    {
        return (int) PointsTransaction::where('child_id', $this->child->id)->sum('points');
    }

    public function countActivities(string $type, ?array $resultWhere = null): int
    {
        $q = ActivityAttempt::where('child_id', $this->child->id)->where('activity_type', $type)->whereNotNull('completed_at');
        if (! $resultWhere) {
            return $q->count();
        }

        // فیلتر روی فیلدهای JSON در PHP تا مستقل از درایور دیتابیس باشد
        return $q->get(['result'])->filter(function ($a) use ($resultWhere) {
            foreach ($resultWhere as $k => $v) {
                if (($a->result[$k] ?? null) != $v) {
                    return false;
                }
            }

            return true;
        })->count();
    }

    public function sumResult(string $type, string $key): int
    {
        return (int) ActivityAttempt::where('child_id', $this->child->id)->where('activity_type', $type)->get(['result'])
            ->sum(fn ($a) => (int) ($a->result[$key] ?? 0));
    }
}
