<?php

namespace App\Modules\Progress\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    public const RULES = [
        'first_activity' => 'اولین فعالیت',
        'games_completed' => 'تعداد بازی‌های کامل‌شده',
        'three_star_games' => 'تعداد مرحله‌های ۳ ستاره',
        'stories_completed' => 'تعداد قصه‌های کامل‌شده',
        'drawings_saved' => 'تعداد نقاشی‌های ذخیره‌شده',
        'streak_days' => 'روزهای پیاپی',
        'correct_answers' => 'تعداد پاسخ درست',
    ];

    protected $fillable = ['slug', 'title', 'description', 'icon', 'points', 'rule_type', 'rule_threshold', 'status', 'sort_order'];
}
