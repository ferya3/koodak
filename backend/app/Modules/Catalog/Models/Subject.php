<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subject extends Model
{
    protected $fillable = ['category_id', 'slug', 'title', 'description', 'sort_order'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
