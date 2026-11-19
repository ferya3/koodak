<?php

namespace App\Modules\Games\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Children\Support\ChildAccess;
use App\Modules\Games\Events\GameSessionCompleted;
use App\Modules\Games\Models\GameEvent;
use App\Modules\Games\Models\GameSession;
use App\Modules\Games\Support\GameScoring;
use App\Modules\Subscriptions\Support\Entitlements;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

/**
 * چرخه‌ی جلسه‌ی بازی:
 *   POST /games/{slug}/sessions            → شروع (برای یک کودک و یک مرحله)
 *   POST /games/sessions/{id}/events       → ارسال دسته‌ای رویدادها
 *   POST /games/sessions/{id}/complete     → پایان، محاسبه‌ی ستاره در سرور، اعطای جوایز
 */
class GameSessionController extends Controller
{
    public function store(Request $request, string $slug, Entitlements $entitlements): JsonResponse
    {
        $data = $request->validate([
            'childId' => ['required', 'integer'],
            'level' => ['required', 'integer', 'min:1'],
        ]);

        $content = GameController::query()->where('slug', $slug)->firstOrFail();
        $child = ChildProfile::active()->findOrFail($data['childId']);
        ChildAccess::authorize($request, $child);

        if ($content->isPremium()) {
            abort_unless($entitlements->for($child->parent)->canAccessPremium(), 402, 'این بازی مخصوص اشتراک خانواده است.');
        }

        $level = $content->game->levels->firstWhere('level_number', $data['level']);
        abort_unless($level, 422, 'مرحله‌ی نامعتبر.');

        $session = GameSession::create([
            'child_id' => $child->id,
            'game_id' => $content->game->id,
            'level_number' => $level->level_number,
            'started_at' => now(),
            'client_meta' => ['ua' => substr((string) $request->userAgent(), 0, 120)],
        ]);

        return response()->json([
            'sessionId' => $session->id,
            'gameId' => (string) $content->id,
            'level' => ['levelNumber' => $level->level_number, 'difficulty' => $level->difficulty, 'configuration' => (object) $level->configuration],
            'startedAt' => $session->started_at->toIso8601String(),
        ], 201);
    }

    public function events(Request $request, GameSession $session): JsonResponse
    {
        $this->authorizeSession($request, $session);
        abort_if($session->status !== 'in_progress', 409, 'این جلسه بسته شده است.');

        $data = $request->validate([
            'events' => ['required', 'array', 'max:200'],
            'events.*.type' => ['required', Rule::in(GameEvent::TYPES)],
            'events.*.at' => ['required', 'integer', 'min:0', 'max:86400000'],
            'events.*.data' => ['nullable', 'array'],
        ]);

        GameEvent::insert(collect($data['events'])->map(fn ($e) => [
            'session_id' => $session->id,
            'event_type' => $e['type'],
            'event_data' => isset($e['data']) ? json_encode($e['data']) : null,
            'occurred_at_ms' => $e['at'],
        ])->all());

        return response()->json(['accepted' => count($data['events'])], 202);
    }

    public function complete(Request $request, GameSession $session): JsonResponse
    {
        $this->authorizeSession($request, $session);
        abort_if($session->status === 'completed', 409, 'این جلسه قبلاً ثبت شده است.');

        $data = $request->validate([
            'correct' => ['required', 'integer', 'between:0,1000'],
            'mistakes' => ['required', 'integer', 'between:0,1000'],
            'durationSeconds' => ['nullable', 'integer', 'between:0,86400'],
        ]);

        $session->load('game.content', 'game.levels');
        $level = $session->game->levels->firstWhere('level_number', $session->level_number);
        // مدت زمان: کمینه‌ی گزارش کلاینت و زمان واقعی سرور (جلوگیری از دستکاری)
        $serverDuration = (int) $session->started_at->diffInSeconds(now());
        $stats = [
            'correct' => $data['correct'],
            'mistakes' => $data['mistakes'],
            'duration' => min($data['durationSeconds'] ?? $serverDuration, max($serverDuration, 1)),
        ];

        $event = DB::transaction(function () use ($session, $level, $stats) {
            $firstClear = ! GameSession::where('child_id', $session->child_id)
                ->where('game_id', $session->game_id)->where('level_number', $session->level_number)
                ->where('status', 'completed')->exists();

            $session->update([
                'status' => 'completed',
                'completed_at' => now(),
                'correct_count' => $stats['correct'],
                'mistakes' => $stats['mistakes'],
                'duration_seconds' => $stats['duration'],
                'stars' => GameScoring::stars($session->game->game_type, $stats, $level),
                'score' => GameScoring::score($stats),
            ]);

            $event = new GameSessionCompleted($session, $firstClear);
            event($event);

            return $event;
        });

        return response()->json([
            'result' => [
                'sessionId' => $session->id,
                'gameId' => (string) $session->game->content_id,
                'childId' => (string) $session->child_id,
                'level' => $session->level_number,
                'score' => $session->score,
                'stars' => $session->stars,
                'durationSeconds' => $session->duration_seconds,
                'mistakes' => $session->mistakes,
                'completedAt' => $session->completed_at->toIso8601String(),
            ],
            'awards' => $event->awards,
        ]);
    }

    private function authorizeSession(Request $request, GameSession $session): void
    {
        ChildAccess::authorize($request, $session->child()->firstOrFail());
    }
}
