<?php

namespace App\Modules\Progress;

use App\Modules\Children\Contracts\ChildDataSection;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Games\Events\GameSessionCompleted;
use App\Modules\Progress\Listeners\RecordGameProgress;
use App\Modules\Progress\Models\ActivityAttempt;
use App\Modules\Progress\Models\ChildAchievement;
use App\Modules\Progress\Models\PointsTransaction;
use App\Modules\Progress\Models\SkillObservation;
use App\Modules\Progress\Support\ProgressRecorder;
use App\Modules\Shared\ModuleServiceProvider;
use Illuminate\Support\Facades\Event;

class ProgressServiceProvider extends ModuleServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(ProgressRecorder::class);

        $this->app->bind('progress.child-data', fn () => new class implements ChildDataSection
        {
            public function key(): string
            {
                return 'progress';
            }

            public function export(ChildProfile $child): array
            {
                return [
                    'activities' => ActivityAttempt::where('child_id', $child->id)->orderBy('started_at')->get(['activity_type', 'title', 'started_at', 'duration_seconds', 'result'])->toArray(),
                    'achievements' => ChildAchievement::where('child_id', $child->id)->get(['achievement_id', 'earned_at'])->toArray(),
                    'points' => PointsTransaction::where('child_id', $child->id)->get(['points', 'reason', 'created_at'])->toArray(),
                    'skills' => SkillObservation::where('child_id', $child->id)->with('skill:id,title')->get()->map(fn ($s) => ['skill' => $s->skill->title, 'score' => $s->observation_score, 'samples' => $s->sample_count])->all(),
                ];
            }
        });
        $this->app->tag('progress.child-data', 'child-data-sections');
    }

    protected function bootModule(): void
    {
        Event::listen(GameSessionCompleted::class, RecordGameProgress::class);
    }
}
