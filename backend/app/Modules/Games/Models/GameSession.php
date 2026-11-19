<?php

namespace App\Modules\Games\Models;

use App\Modules\Children\Models\ChildProfile;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameSession extends Model
{
    use HasUlids;

    protected $fillable = ['child_id', 'game_id', 'level_number', 'status', 'started_at', 'completed_at', 'score', 'stars', 'correct_count', 'mistakes', 'duration_seconds', 'client_meta'];

    protected function casts(): array
    {
        return ['started_at' => 'datetime', 'completed_at' => 'datetime', 'client_meta' => 'array'];
    }

    public function child(): BelongsTo
    {
        return $this->belongsTo(ChildProfile::class, 'child_id');
    }

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(GameEvent::class, 'session_id');
    }
}
