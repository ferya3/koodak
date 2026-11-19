<?php

namespace App\Modules\Progress\Models;

use Illuminate\Database\Eloquent\Model;

class PointsTransaction extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = ['child_id', 'points', 'reason', 'reference_type', 'reference_id'];
}
