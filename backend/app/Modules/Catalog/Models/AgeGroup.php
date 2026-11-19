<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Model;

class AgeGroup extends Model
{
    protected $fillable = ['title', 'min_age', 'max_age', 'sort_order'];
}
