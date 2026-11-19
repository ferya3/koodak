<?php

namespace App\Modules\Catalog\Enums;

use Filament\Support\Contracts\HasLabel;

enum ContentType: string implements HasLabel
{
    case Lesson = 'lesson';
    case Game = 'game';
    case Worksheet = 'worksheet';
    case Story = 'story';
    case Activity = 'activity';
    case Quiz = 'quiz';
    case Drawing = 'drawing';

    public function label(): string
    {
        return match ($this) {
            self::Lesson => 'درس',
            self::Game => 'بازی',
            self::Worksheet => 'کاربرگ',
            self::Story => 'قصه',
            self::Activity => 'فعالیت',
            self::Quiz => 'آزمونک',
            self::Drawing => 'نقاشی',
        };
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
