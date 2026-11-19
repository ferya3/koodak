<?php

namespace App\Modules\Progress\Models;

use App\Modules\Catalog\Models\Content;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChildProgress extends Model
{
    protected $table = 'child_progress';

    protected $fillable = ['child_id', 'content_id', 'progress_percent', 'completion_status', 'best_stars', 'attempts', 'last_activity_at'];

    protected function casts(): array
    {
        return ['last_activity_at' => 'datetime'];
    }

    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }
}
