<?php

namespace App\Modules\Games\Support;

use App\Modules\Games\Models\GameLevel;

/**
 * قواعد امتیاز و ستاره – آینه‌ی Game Registry در Frontend
 * (apps/web/features/games/engine/registry.ts). سرور منبع نهایی است؛
 * عدد ستاره‌ی ارسالی کلاینت نادیده گرفته می‌شود.
 */
final class GameScoring
{
    /** @param array{correct:int,mistakes:int,duration:int} $s */
    public static function stars(string $gameType, array $s, GameLevel $level): int
    {
        if ($gameType === 'memory') {
            $pairs = (int) ($level->configuration['pairs'] ?? 6);

            return $s['mistakes'] <= (int) ceil($pairs / 2) ? 3 : ($s['mistakes'] <= $pairs + 1 ? 2 : 1);
        }

        return $s['mistakes'] === 0 ? 3 : ($s['mistakes'] <= 2 ? 2 : 1);
    }

    /** @param array{correct:int,mistakes:int,duration:int} $s */
    public static function score(array $s): int
    {
        return max(10, $s['correct'] * 20 - $s['mistakes'] * 5 + max(0, 120 - $s['duration']));
    }
}
