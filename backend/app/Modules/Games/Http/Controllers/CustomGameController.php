<?php

namespace App\Modules\Games\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Children\Support\ChildAccess;
use App\Modules\Games\Models\CustomGame;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

/**
 * بازی‌ساز والدین.
 *  - والد (توکن parent): ساخت، ویرایش، حذف و فهرست بازی‌های خانواده
 *  - کودک (توکن جلسه‌ی کودک) یا والد: فهرست بازی‌هایی که برای آن کودک قابل مشاهده است
 */
class CustomGameController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $games = CustomGame::where('parent_user_id', $request->user()->id)->latest('updated_at')->get();

        return response()->json(['data' => $games->map->toApi()->values()]);
    }

    public function store(Request $request): JsonResponse
    {
        abort_if(CustomGame::where('parent_user_id', $request->user()->id)->count() >= CustomGame::MAX_PER_PARENT, 422, 'حداکثر تعداد بازی ساخته شده است.');
        $game = CustomGame::create(['parent_user_id' => $request->user()->id, ...$this->validated($request)]);

        return response()->json(['data' => $game->toApi()], 201);
    }

    public function update(Request $request, CustomGame $customGame): JsonResponse
    {
        abort_unless($customGame->parent_user_id === $request->user()->id, 404);
        $customGame->update($this->validated($request));

        return response()->json(['data' => $customGame->fresh()->toApi()]);
    }

    public function destroy(Request $request, CustomGame $customGame): JsonResponse
    {
        abort_unless($customGame->parent_user_id === $request->user()->id, 404);
        $customGame->delete();

        return response()->json(null, 204);
    }

    /** بازی‌های قابل مشاهده برای یک کودک (برای محیط کودک) */
    public function forChild(Request $request, ChildProfile $child): JsonResponse
    {
        ChildAccess::authorize($request, $child);
        $games = CustomGame::where('parent_user_id', $child->parent_user_id)->latest('updated_at')->get()
            ->filter(fn (CustomGame $g) => $g->visibleTo($child->id));

        return response()->json(['data' => $games->map->toApi()->values()]);
    }

    /** @return array<string, mixed> */
    private function validated(Request $request): array
    {
        $type = $request->input('gameType');
        $token = 'regex:/^('.implode('|', CustomGame::SHAPES).')-('.implode('|', CustomGame::COLORS).')$/';
        $icon = ['string', 'max:24', 'regex:/^[a-z]+$/'];

        $rules = [
            'title' => ['required', 'string', 'max:60'],
            'gameType' => ['required', Rule::in(array_keys(CustomGame::TYPES))],
            'tone' => ['nullable', Rule::in(CustomGame::TONES)],
            'childIds' => ['nullable', 'array', 'max:10'],
            'childIds.*' => ['integer'],
            'config' => ['required', 'array'],
        ];
        $rules += match ($type) {
            // قطار: الگوی ۲ تا ۴ واگن، ۶ تا ۱۲ واگن، چند واگن اول نمایش داده می‌شود و بقیه را کودک می‌چیند
            'pattern' => [
                'config.unit' => ['required', 'array', 'min:2', 'max:4'],
                'config.unit.*' => ['required', 'string', $token],
                'config.wagons' => ['required', 'integer', 'between:6,12'],
                'config.shown' => ['required', 'integer', 'min:2'],
            ],
            // تنگ ماهی: هر دور یک تعداد (۱ تا ۱۵)
            'counting' => [
                'config.counts' => ['required', 'array', 'min:1', 'max:10'],
                'config.counts.*' => ['required', 'integer', 'between:1,15'],
                'config.icon' => ['nullable', ...$icon],
            ],
            'memory' => [
                'config.icons' => ['required', 'array', 'min:2', 'max:8'],
                'config.icons.*' => ['required', 'distinct', ...$icon],
            ],
            default => [],
        };
        $data = $request->validate($rules, [], ['title' => 'نام بازی', 'config.wagons' => 'تعداد واگن', 'config.shown' => 'واگن‌های نمایش‌داده‌شده']);

        if ($type === 'pattern') {
            $c = $data['config'];
            if ($c['shown'] >= $c['wagons'] || $c['shown'] < count($c['unit'])) {
                throw ValidationException::withMessages(['config.shown' => 'دست‌کم یک دور کامل الگو باید دیده شود و دست‌کم یک واگن خالی بماند.']);
            }
        }

        $own = ChildProfile::where('parent_user_id', $request->user()->id)->pluck('id')->all();
        $childIds = array_values(array_intersect(array_map('intval', $data['childIds'] ?? []), $own));

        $config = match ($type) {
            'pattern' => ['unit' => array_values($data['config']['unit']), 'wagons' => (int) $data['config']['wagons'], 'shown' => (int) $data['config']['shown']],
            'counting' => ['counts' => array_map('intval', $data['config']['counts']), 'icon' => $data['config']['icon'] ?? 'fish'],
            'memory' => ['icons' => array_values($data['config']['icons'])],
        };

        return [
            'title' => $data['title'],
            'game_type' => $type,
            'config' => $config,
            'tone' => $data['tone'] ?? 'sky',
            'child_ids' => $childIds ?: null,
        ];
    }
}
