<?php

namespace App\Modules\Progress\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Models\Content;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Children\Support\ChildAccess;
use App\Modules\Progress\Http\Resources\ActivityLogResource;
use App\Modules\Progress\Models\Achievement;
use App\Modules\Progress\Models\ActivityAttempt;
use App\Modules\Progress\Models\ChildAchievement;
use App\Modules\Progress\Models\ChildProgress;
use App\Modules\Progress\Models\SkillObservation;
use App\Modules\Progress\Support\AchievementEngine;
use App\Modules\Progress\Support\ChildStats;
use App\Modules\Progress\Support\ProgressRecorder;
use App\Modules\Shared\Http\Paginated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class ProgressController extends Controller
{
    public function summary(Request $request, ChildProfile $child): JsonResponse
    {
        ChildAccess::authorize($request, $child);
        $stats = ChildStats::for($child);
        $items = ChildProgress::where('child_id', $child->id)->with('content:id,slug,title,content_type,tone')->latest('last_activity_at')->limit(50)->get();

        return response()->json([
            'points' => $stats->totalPoints(),
            'stars' => (int) $items->sum('best_stars'),
            'streakDays' => $stats->streakDays(),
            'completedCount' => $items->where('completion_status', 'completed')->count(),
            'items' => $items->map(fn ($p) => [
                'contentId' => (string) $p->content_id,
                'slug' => $p->content?->slug,
                'title' => $p->content?->title,
                'type' => $p->content?->content_type->value,
                'progressPercent' => $p->progress_percent,
                'completionStatus' => $p->completion_status,
                'bestStars' => $p->best_stars,
                'lastActivityAt' => $p->last_activity_at?->toIso8601String(),
            ]),
        ]);
    }

    public function achievements(Request $request, ChildProfile $child): JsonResponse
    {
        ChildAccess::authorize($request, $child);
        $earned = ChildAchievement::where('child_id', $child->id)->pluck('earned_at', 'achievement_id');

        return response()->json(['data' => Achievement::where('status', 'active')->orderBy('sort_order')->get()->map(fn ($a) => [
            'id' => (string) $a->id,
            'slug' => $a->slug,
            'title' => $a->title,
            'description' => $a->description,
            'icon' => $a->icon,
            'points' => $a->points,
            'earnedAt' => isset($earned[$a->id]) ? Carbon::parse($earned[$a->id])->toIso8601String() : null,
        ])]);
    }

    public function history(Request $request, ChildProfile $child): JsonResponse
    {
        ChildAccess::authorize($request, $child);
        $page = ActivityAttempt::where('child_id', $child->id)->latest('started_at')->paginate(min($request->integer('perPage', 20), 100));

        return Paginated::response($page, ActivityLogResource::class);
    }

    public function skills(Request $request, ChildProfile $child): JsonResponse
    {
        ChildAccess::authorize($request, $child);

        return response()->json(['data' => SkillObservation::where('child_id', $child->id)->with('skill')->orderByDesc('observation_score')->get()->map(fn ($o) => [
            'skillId' => (string) $o->skill_id,
            'title' => $o->skill->title,
            'score' => (int) round($o->observation_score),
            'sampleCount' => $o->sample_count,
            'trend' => $o->trend(),
        ])]);
    }

    /**
     * ثبت فعالیت‌های غیربازی: پایان قصه، ذخیره‌ی نقاشی، چاپ کاربرگ، پایان درس
     */
    public function storeActivity(Request $request, ChildProfile $child, ProgressRecorder $recorder, AchievementEngine $engine): JsonResponse
    {
        ChildAccess::authorize($request, $child);
        $data = $request->validate([
            'type' => ['required', 'in:story,drawing,worksheet,lesson'],
            'contentId' => ['nullable', 'integer'],
            'title' => ['nullable', 'string', 'max:160'],
            'durationSeconds' => ['required', 'integer', 'between:1,7200'],
            'result' => ['nullable', 'array'],
        ]);
        $content = isset($data['contentId']) ? Content::published()->with('skills')->find($data['contentId']) : null;
        abort_if(isset($data['contentId']) && ! $content, 422, 'محتوای نامعتبر.');

        $response = DB::transaction(function () use ($child, $content, $data, $recorder, $engine) {
            $title = $content?->title ?? $data['title'] ?? match ($data['type']) {
                'drawing' => 'نقاشی آزاد', default => 'فعالیت'
            };
            $attempt = $recorder->logActivity($child, $content, $data['type'], $title, $data['durationSeconds'], $data['result'] ?? []);
            $points = 0;
            if ($content) {
                $recorder->updateProgress($child, $content, 100);
                $recorder->observeSkills($child, $content, 100);
                $points += $recorder->awardPoints($child, 10, $data['type'], 'activity', (string) $attempt->id);
            } elseif ($data['type'] === 'drawing') {
                $points += $recorder->awardPoints($child, 10, 'drawing', 'activity', (string) $attempt->id);
            }
            $new = $engine->evaluate($child);

            return ['activityId' => (string) $attempt->id, 'awards' => ['points' => $points + array_sum(array_column($new, 'points')), 'achievements' => $new]];
        });

        return response()->json($response, 201);
    }
}
