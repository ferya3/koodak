<?php

namespace App\Modules\Games\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameLevel extends Model
{
    protected $fillable = ['game_id', 'level_number', 'difficulty', 'configuration'];

    protected $attributes = ['configuration' => '{}'];

    protected function casts(): array
    {
        return ['configuration' => 'array'];
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }
}
