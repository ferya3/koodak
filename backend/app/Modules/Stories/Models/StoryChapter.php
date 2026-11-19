<?php

namespace App\Modules\Stories\Models;

use App\Modules\Catalog\Models\MediaAsset;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoryChapter extends Model
{
    protected $fillable = ['story_id', 'key', 'title', 'body', 'scene', 'image_asset_id', 'audio_asset_id', 'chapter_order', 'is_ending'];

    protected function casts(): array
    {
        return ['is_ending' => 'boolean'];
    }

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }

    public function choices(): HasMany
    {
        return $this->hasMany(StoryChoice::class, 'chapter_id')->orderBy('sort_order');
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'image_asset_id');
    }

    public function audio(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'audio_asset_id');
    }
}
