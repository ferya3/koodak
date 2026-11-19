<?php

namespace App\Modules\Learning\Models;

use App\Modules\Catalog\Models\Content;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Lesson extends Model
{
    protected $fillable = ['content_id', 'objectives', 'video_asset_id'];

    protected $attributes = ['objectives' => '[]'];

    protected function casts(): array
    {
        return ['objectives' => 'array'];
    }

    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }

    public function steps(): HasMany
    {
        return $this->hasMany(LessonStep::class)->orderBy('step_order');
    }

    /** پیش‌نیازها = محتواهای دیگری که بهتر است قبل از این درس کامل شوند */
    public function prerequisites(): BelongsToMany
    {
        return $this->belongsToMany(Content::class, 'lesson_prerequisites', 'lesson_id', 'prerequisite_content_id');
    }
}
