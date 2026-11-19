<?php

namespace App\Modules\Children\Models;

use Illuminate\Database\Eloquent\Model;

class ParentSetting extends Model
{
    protected $fillable = [
        'parent_user_id', 'child_id', 'daily_limit_minutes', 'allowed_content_types', 'sound_enabled',
        'screen_time_enabled', 'bedtime_lock_enabled', 'bedtime_from', 'bedtime_to',
    ];

    protected $attributes = ['allowed_content_types' => '["game","story","worksheet","lesson","drawing"]'];

    protected function casts(): array
    {
        return [
            'allowed_content_types' => 'array',
            'sound_enabled' => 'boolean',
            'screen_time_enabled' => 'boolean',
            'bedtime_lock_enabled' => 'boolean',
            'daily_limit_minutes' => 'integer',
        ];
    }
}
