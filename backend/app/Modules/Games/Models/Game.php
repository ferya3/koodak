<?php

namespace App\Modules\Games\Models;

use App\Modules\Catalog\Models\Content;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Game extends Model
{
    public const TYPES = ['memory' => 'حافظه', 'pattern' => 'الگو', 'counting' => 'شمارش', 'maze' => 'ماز', 'sorting' => 'دسته‌بندی', 'puzzle' => 'پازل',
        'letter-sound' => 'صدای حرف', 'letter-hunt' => 'شکار حرف', 'odd-one-out' => 'کدام فرق دارد؟', 'number-order' => 'ترتیب اعداد', 'more-less' => 'بیشتر/کمتر'];

    protected $fillable = ['content_id', 'game_type', 'engine', 'configuration', 'settings', 'status'];

    protected $attributes = ['configuration' => '{}', 'settings' => '{}'];

    protected function casts(): array
    {
        return ['configuration' => 'array', 'settings' => 'array'];
    }

    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }

    public function levels(): HasMany
    {
        return $this->hasMany(GameLevel::class)->orderBy('level_number');
    }

    public function sessions(): HasMany
    {
        return $this->hasMany(GameSession::class);
    }
}
