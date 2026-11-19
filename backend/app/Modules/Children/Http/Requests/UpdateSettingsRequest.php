<?php

namespace App\Modules\Children\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'daily_limit_minutes' => ['sometimes', 'integer', 'between:10,240'],
            'allowed_content_types' => ['sometimes', 'array'],
            'allowed_content_types.*' => ['in:lesson,game,worksheet,story,activity,quiz,drawing'],
            'sound_enabled' => ['sometimes', 'boolean'],
            'screen_time_enabled' => ['sometimes', 'boolean'],
            'bedtime_lock.enabled' => ['sometimes', 'boolean'],
            'bedtime_lock.from' => ['sometimes', 'date_format:H:i'],
            'bedtime_lock.to' => ['sometimes', 'date_format:H:i'],
        ];
    }
}
