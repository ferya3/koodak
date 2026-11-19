<?php

namespace App\Modules\Learning\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Enums\ContentType;
use App\Modules\Catalog\Models\Category;
use App\Modules\Catalog\Models\Content;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Children\Support\ChildAccess;
use App\Modules\Learning\Http\Resources\LessonResource;
use App\Modules\Learning\Support\LessonScoring;
use App\Modules\Progress\Models\ChildProgress;
use App\Modules\Progress\Support\AchievementEngine;
use App\Modules\Progress\Support\ProgressRecorder;
use App\Modules\Shared\Http\Paginated;
use App\Modules\Subscriptions\Support\Entitlements;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LessonController extends Controller
{
    public static function query(): Builder
    {
        return Content::published()->ofType(ContentType::Lesson)
            ->whereHas('lesson')
            ->with(['lesson.steps.audio', 'lesson.prerequisites', 'skills', 'ageGroups']);
    }

    /** موضوع‌های آکادمی با تعداد درس منتشرشده */
    public function subjects(): JsonResponse
    {
        $academy = Category::where('slug', 'learning-academy')->firstOrFail();
        $counts = Content::published()->ofType(ContentType::Lesson)->whereNotNull('subject_id')
            ->selectRaw('subject_id, count(*) as c')->groupBy('subject_id')->pluck('c', 'subject_id');

        return response()->json(['data' => $academy->subjects()->get()->map(fn ($s) => [
            'id' => (string) $s->id, 'categoryId' => (string) $s->category_id, 'slug' => $s->slug, 'title' => $s->title,
            'lessonCount' => (int) ($counts[$s->id] ?? 0),
        ])]);
    }

    public function index(Request $request): JsonResponse
    {
        $request->validate(['subject' => ['nullable', 'string', 'max:80'], 'age' => ['nullable', 'integer', 'between:1,12']]);

        $page = self::query()
            ->filter($request->only(['q', 'age', 'difficulty', 'access']))
            ->when($request->input('subject'), fn ($q, $s) => is_numeric($s)
                ? $q->where('subject_id', $s)
                : $q->whereHas('subject', fn ($sq) => $sq->where('slug', $s)))
            ->orderBy('sort_order')->orderBy('min_age')
            ->paginate(min($request->integer('perPage', 24), 60));

        return Paginated::response($page, LessonResource::class);
    }

    public function show(string $slug): LessonResource
    {
        return LessonResource::make(self::query()->where('slug', $slug)->firstOrFail());
    }

    /**
     * پایان درس برای یک کودک: نمره در سرور، ثبت پیشرفت، مشاهده‌ی مهارت، امتیاز و مدال.
     * body: { childId, answers: { stepKey: optionId }, durationSeconds }
     */
    public function complete(Request $request, string $slug, ProgressRecorder $recorder, AchievementEngine $engine, Entitlements $entitlements): JsonResponse
    {
        $data = $request->validate([
            'childId' => ['required', 'integer'],
            'answers' => ['present', 'array', 'max:50'],
            'answers.*' => ['string', 'max:32'],
            'durationSeconds' => ['required', 'integer', 'between:1,7200'],
        ]);

        $content = self::query()->where('slug', $slug)->firstOrFail();
        $child = ChildProfile::active()->findOrFail($data['childId']);
        ChildAccess::authorize($request, $child);
        if ($content->isPremium()) {
            abort_unless($entitlements->for($child->parent)->canAccessPremium(), 402, 'این درس مخصوص اشتراک خانواده است.');
        }

        $result = LessonScoring::score($content->lesson, $data['answers']);

        $awards = DB::transaction(function () use ($child, $content, $result, $data, $recorder, $engine) {
            $first = ! ChildProgress::where('child_id', $child->id)->where('content_id', $content->id)->where('completion_status', 'completed')->exists();

            $recorder->logActivity($child, $content, 'lesson', $content->title, $data['durationSeconds'],
                ['stars' => $result['stars'], 'score' => $result['score'], 'correct' => $result['correct'], 'total' => $result['total']]);
            $recorder->updateProgress($child, $content, 100, $result['stars']);
            $recorder->observeSkills($child, $content, $result['score']);

            $points = $recorder->awardPoints($child, $result['stars'] * (int) config('kidsworld.gamification.points_per_star') + ($first ? 5 : 0), 'lesson', 'content', (string) $content->id);
            $new = $engine->evaluate($child);

            return ['points' => $points + array_sum(array_column($new, 'points')), 'achievements' => $new];
        });

        return response()->json(['result' => $result, 'awards' => $awards]);
    }
}
