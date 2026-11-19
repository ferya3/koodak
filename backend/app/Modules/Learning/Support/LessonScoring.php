<?php

namespace App\Modules\Learning\Support;

use App\Modules\Learning\Models\Lesson;

/**
 * نمره‌دهی درس در سرور: فقط «اولین پاسخ» هر پرسش حساب می‌شود
 * (کودک می‌تواند دوباره امتحان کند تا یاد بگیرد، ولی نمره از اولین تلاش است).
 */
final class LessonScoring
{
    /**
     * @param  array<string, string>  $answers  stepKey => optionId (اولین پاسخ)
     * @return array{score:int, correct:int, total:int, stars:int, steps: array<int, array{stepId:string, correct:bool}>}
     */
    public static function score(Lesson $lesson, array $answers): array
    {
        $quiz = $lesson->steps->filter->isQuiz()->values();
        $steps = $quiz->map(fn ($s) => [
            'stepId' => $s->key,
            'correct' => isset($answers[$s->key]) && (string) $answers[$s->key] === (string) $s->question['answerId'],
        ])->all();

        $total = count($steps);
        $correct = count(array_filter($steps, fn ($s) => $s['correct']));
        $score = $total ? (int) round($correct / $total * 100) : 100;

        return [
            'score' => $score,
            'correct' => $correct,
            'total' => $total,
            'stars' => $score >= 100 ? 3 : ($score >= 50 ? 2 : 1),
            'steps' => $steps,
        ];
    }
}
