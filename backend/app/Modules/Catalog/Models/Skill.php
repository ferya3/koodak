<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    public const CATEGORIES = [
        'cognitive' => 'شناختی', 'logical' => 'منطقی', 'creative' => 'خلاقانه', 'linguistic' => 'زبانی',
        'auditory' => 'شنیداری', 'spatial' => 'فضایی', 'fine_motor' => 'حرکتی ظریف', 'social_emotional' => 'اجتماعی-هیجانی',
    ];

    protected $fillable = ['slug', 'title', 'description', 'skill_category'];
}
