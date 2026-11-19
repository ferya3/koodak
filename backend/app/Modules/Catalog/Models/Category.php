<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/** «دنیا»ها = دسته‌های سطح اول؛ زیر‌دسته‌ها با parent_id */
class Category extends Model
{
    public const TONES = ['sun', 'coral', 'sky', 'grass', 'grape', 'berry', 'ocean', 'peach', 'mint', 'lilac'];

    protected $fillable = ['parent_id', 'slug', 'title', 'title_en', 'description', 'icon', 'tone', 'image_asset_id', 'sort_order', 'status'];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(self::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('sort_order');
    }

    public function subjects(): HasMany
    {
        return $this->hasMany(Subject::class)->orderBy('sort_order');
    }

    public function contents(): HasMany
    {
        return $this->hasMany(Content::class);
    }

    public function scopeActive(Builder $q): Builder
    {
        return $q->where('status', 'active');
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }
}
