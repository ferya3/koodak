<?php

namespace App\Modules\Learning\Models;

use App\Modules\Catalog\Models\MediaAsset;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LessonStep extends Model
{
    public const VISUAL_KINDS = ['letter' => 'حرف', 'number' => 'عدد + آیکون', 'icons' => 'آیکون‌ها', 'scene' => 'صحنه'];

    protected $fillable = ['lesson_id', 'key', 'step_type', 'title', 'body', 'visual', 'question', 'audio_asset_id', 'step_order'];

    protected function casts(): array
    {
        return ['visual' => 'array', 'question' => 'array'];
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function audio(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'audio_asset_id');
    }

    public function isQuiz(): bool
    {
        return $this->step_type === 'quiz' && ! empty($this->question['answerId']);
    }
}
