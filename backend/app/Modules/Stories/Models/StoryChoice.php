<?php

namespace App\Modules\Stories\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoryChoice extends Model
{
    public $timestamps = false;

    protected $fillable = ['chapter_id', 'choice_text', 'next_chapter_id', 'sort_order'];

    public function nextChapter(): BelongsTo
    {
        return $this->belongsTo(StoryChapter::class, 'next_chapter_id');
    }
}
