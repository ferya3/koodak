<?php

namespace App\Modules\Children\Http\Resources;

use App\Modules\Children\Models\ParentSetting;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin ParentSetting – هم‌خوان با ParentSettings در @kidsworld/types */
class SettingsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'childId' => (string) $this->child_id,
            'dailyLimitMinutes' => $this->daily_limit_minutes,
            'allowedContentTypes' => $this->allowed_content_types,
            'soundEnabled' => $this->sound_enabled,
            'screenTimeEnabled' => $this->screen_time_enabled,
            'bedtimeLock' => [
                'enabled' => $this->bedtime_lock_enabled,
                'from' => substr((string) $this->bedtime_from, 0, 5),
                'to' => substr((string) $this->bedtime_to, 0, 5),
            ],
        ];
    }
}
