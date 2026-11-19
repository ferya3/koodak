<?php

namespace App\Modules\Stories\Models;

use App\Modules\Catalog\Models\Content;
use App\Modules\Catalog\Models\MediaAsset;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Story extends Model
{
    public const TYPES = ['short' => 'کوتاه', 'picture' => 'تصویری', 'audio' => 'صوتی', 'interactive' => 'تعاملی', 'bedtime' => 'قبل از خواب'];

    protected $fillable = ['content_id', 'story_type', 'audio_asset_id'];

    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }

    public function chapters(): HasMany
    {
        return $this->hasMany(StoryChapter::class)->orderBy('chapter_order');
    }

    public function audio(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'audio_asset_id');
    }
}
