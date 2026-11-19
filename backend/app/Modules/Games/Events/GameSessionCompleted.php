<?php

namespace App\Modules\Games\Events;

use App\Modules\Games\Models\GameSession;

/**
 * رویداد دامنه: پایان یک جلسه‌ی بازی.
 * شنونده‌های ماژول Progress (پیشرفت، امتیاز، مدال، مشاهده‌ی مهارت) به آن واکنش نشان می‌دهند.
 * $awards توسط شنونده‌های هم‌زمان پر می‌شود تا پاسخ API جوایز تازه را برگرداند.
 */
class GameSessionCompleted
{
    /** @var array{points:int, achievements: array<int, array<string, mixed>>} */
    public array $awards = ['points' => 0, 'achievements' => []];

    public function __construct(public readonly GameSession $session, public readonly bool $firstClear) {}
}
