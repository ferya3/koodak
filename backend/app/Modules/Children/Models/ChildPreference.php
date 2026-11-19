<?php

namespace App\Modules\Children\Models;

use Illuminate\Database\Eloquent\Model;

class ChildPreference extends Model
{
    protected $fillable = ['child_id', 'favorite_categories', 'preferred_content_types', 'accessibility_settings'];

    protected $attributes = ['favorite_categories' => '[]', 'preferred_content_types' => '[]', 'accessibility_settings' => '{}'];

    protected function casts(): array
    {
        return [
            'favorite_categories' => 'array',
            'preferred_content_types' => 'array',
            'accessibility_settings' => 'array',
        ];
    }
}
