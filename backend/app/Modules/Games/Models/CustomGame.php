<?php

namespace App\Modules\Games\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** بازی ساخت والدین – فقط پیکربندی؛ اجرای بازی با همان موتور بازی‌های اصلی است */
class CustomGame extends Model
{
    public const TYPES = ['pattern' => 'قطار الگو', 'counting' => 'تنگ ماهی (شمارش)', 'memory' => 'کارت‌های حافظه'];

    /** سقف بازی برای هر خانواده */
    public const MAX_PER_PARENT = 50;

    public const SHAPES = ['circle', 'square', 'triangle', 'star', 'heart'];

    public const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'];

    public const TONES = ['sun', 'coral', 'sky', 'grass', 'grape', 'berry', 'ocean', 'peach', 'mint', 'lilac'];

    protected $fillable = ['parent_user_id', 'title', 'game_type', 'config', 'tone', 'child_ids'];

    protected function casts(): array
    {
        return ['config' => 'array', 'child_ids' => 'array'];
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_user_id');
    }

    /** آیا این کودک بازی را می‌بیند؟ */
    public function visibleTo(int $childId): bool
    {
        return $this->child_ids === null || $this->child_ids === [] || in_array($childId, array_map('intval', $this->child_ids), true);
    }

    public function toApi(): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'gameType' => $this->game_type,
            'config' => (object) $this->config,
            'tone' => $this->tone,
            'childIds' => $this->child_ids ? array_map('strval', $this->child_ids) : null,
            'updatedAt' => $this->updated_at?->toIso8601String(),
        ];
    }
}
