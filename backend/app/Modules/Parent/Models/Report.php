<?php

namespace App\Modules\Parent\Models;

use App\Modules\Children\Models\ChildProfile;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $fillable = ['parent_user_id', 'child_id', 'report_type', 'period_start', 'period_end', 'status', 'format', 'storage_disk', 'storage_path', 'generated_at'];

    protected function casts(): array
    {
        return ['period_start' => 'date', 'period_end' => 'date', 'generated_at' => 'datetime'];
    }

    public function child(): BelongsTo
    {
        return $this->belongsTo(ChildProfile::class, 'child_id');
    }

    public function toApi(): array
    {
        return [
            'id' => (string) $this->id,
            'childId' => (string) $this->child_id,
            'type' => $this->report_type,
            'periodStart' => $this->period_start->toDateString(),
            'periodEnd' => $this->period_end->toDateString(),
            'status' => $this->status,
            'format' => $this->format,
            'generatedAt' => $this->generated_at?->toIso8601String(),
        ];
    }
}
