<?php

namespace App\Modules\Games\Models;

use Illuminate\Database\Eloquent\Model;

class GameEvent extends Model
{
    public const TYPES = ['start', 'move', 'correct', 'wrong', 'hint', 'level_complete', 'quit'];

    public $timestamps = false;

    protected $fillable = ['session_id', 'event_type', 'event_data', 'occurred_at_ms'];

    protected function casts(): array
    {
        return ['event_data' => 'array'];
    }
}
