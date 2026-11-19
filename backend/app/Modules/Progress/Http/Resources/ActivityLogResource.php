<?php

namespace App\Modules\Progress\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** آینه‌ی ActivityLogItem در @kidsworld/types */
class ActivityLogResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'childId' => (string) $this->child_id,
            'contentId' => $this->content_id ? (string) $this->content_id : null,
            'contentTitle' => $this->title,
            'contentType' => $this->activity_type,
            'tone' => $this->tone,
            'at' => $this->started_at->toIso8601String(),
            'durationMinutes' => max(1, (int) round($this->duration_seconds / 60)),
            'result' => match (true) {
                isset($this->result['stars']) => str_repeat('★', (int) $this->result['stars']),
                $this->activity_type === 'story' => 'پایان قصه',
                $this->activity_type === 'drawing' => 'ذخیره شد',
                $this->activity_type === 'worksheet' => 'چاپ شد',
                default => null,
            },
        ];
    }
}
