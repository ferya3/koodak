<?php

namespace App\Modules\Progress\Models;

use App\Modules\Catalog\Models\Skill;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SkillObservation extends Model
{
    protected $table = 'child_skill_observations';

    protected $fillable = ['child_id', 'skill_id', 'observation_score', 'previous_score', 'sample_count', 'observed_at'];

    protected function casts(): array
    {
        return ['observed_at' => 'datetime', 'observation_score' => 'float', 'previous_score' => 'float'];
    }

    public function skill(): BelongsTo
    {
        return $this->belongsTo(Skill::class);
    }

    public function trend(): string
    {
        if ($this->previous_score === null) {
            return 'flat';
        }
        $d = $this->observation_score - $this->previous_score;

        return $d > 0.5 ? 'up' : ($d < -0.5 ? 'down' : 'flat');
    }
}
