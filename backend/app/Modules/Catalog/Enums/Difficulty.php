<?php

namespace App\Modules\Catalog\Enums;

use Filament\Support\Contracts\HasLabel;

enum Difficulty: string implements HasLabel
{
    case Beginner = 'beginner';
    case Easy = 'easy';
    case Intermediate = 'intermediate';
    case Advanced = 'advanced';

    public function label(): string
    {
        return match ($this) {
            self::Beginner => 'شروع',
            self::Easy => 'آسان',
            self::Intermediate => 'متوسط',
            self::Advanced => 'پیشرفته',
        };
    }

    public function rank(): int
    {
        return array_search($this, self::cases(), true);
    }

    public function getLabel(): string
    {
        return $this->label();
    }

    /** @return array<string,string> */
    public static function options(): array
    {
        return collect(self::cases())->mapWithKeys(fn ($c) => [$c->value => $c->label()])->all();
    }
}
