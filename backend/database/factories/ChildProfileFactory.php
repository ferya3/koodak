<?php

namespace Database\Factories;

use App\Models\User;
use App\Modules\Children\Models\ChildProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<ChildProfile> */
class ChildProfileFactory extends Factory
{
    protected $model = ChildProfile::class;

    public function definition(): array
    {
        return [
            'parent_user_id' => User::factory(),
            'display_name' => fake()->randomElement(['نیلا', 'آرین', 'سارا', 'کیان', 'هستی', 'ماهان']),
            'birth_year_month' => now()->subYears(fake()->numberBetween(3, 9))->format('Y-m'),
            'avatar' => fake()->randomElement(ChildProfile::AVATARS),
            'preferred_language' => 'fa',
        ];
    }
}
