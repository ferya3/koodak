<?php

namespace App\Modules\Progress\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityAttempt extends Model
{
    protected $fillable = ['child_id', 'content_id', 'activity_type', 'title', 'tone', 'started_at', 'completed_at', 'duration_seconds', 'result', 'source_type', 'source_id'];

    protected function casts(): array
    {
        return ['started_at' => 'datetime', 'completed_at' => 'datetime', 'result' => 'array'];
    }
}
