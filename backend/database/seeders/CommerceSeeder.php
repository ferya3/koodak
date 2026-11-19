<?php

namespace Database\Seeders;

use App\Modules\Progress\Models\Achievement;
use App\Modules\Subscriptions\Models\Plan;
use Illuminate\Database\Seeder;

class CommerceSeeder extends Seeder
{
    /** قواعد کسب هر مدال (در CMS قابل تغییر است) */
    private const RULES = [
        'ach-first' => ['first-step', 'first_activity', 1],
        'ach-memory' => ['elephant-mind', 'three_star_games', 1],
        'ach-artist' => ['little-artist', 'drawings_saved', 5],
        'ach-reader' => ['story-reader', 'stories_completed', 3],
        'ach-streak' => ['seven-day-streak', 'streak_days', 7],
        'ach-math' => ['mathematician', 'correct_answers', 20],
    ];

    /** محدودیت‌های هر پلن – منبع حقیقت دسترسی‌ها */
    private const LIMITS = [
        'p-free' => ['free', ['max_children' => 1, 'premium_content' => false]],
        'p-family' => ['family', ['max_children' => 4, 'premium_content' => true]],
        'p-school' => ['school', ['max_children' => 60, 'premium_content' => true]],
    ];

    public function run(): void
    {
        $data = json_decode(file_get_contents(__DIR__.'/data/commerce.json'), true);

        foreach ($data['plans'] as $i => $p) {
            [$slug, $limits] = self::LIMITS[$p['id']];
            Plan::updateOrCreate(['slug' => $slug], [
                'name' => $p['name'], 'tagline' => $p['tagline'], 'audience' => $p['audience'],
                'price_monthly' => $p['priceMonthly'], 'price_yearly' => $p['priceYearly'], 'currency' => $p['currency'],
                'features' => $p['features'], 'limits' => $limits, 'highlighted' => $p['highlighted'] ?? false, 'sort_order' => $i,
            ]);
        }

        foreach ($data['achievements'] as $i => $a) {
            [$slug, $rule, $threshold] = self::RULES[$a['id']];
            Achievement::updateOrCreate(['slug' => $slug], [
                'title' => $a['title'], 'description' => $a['description'], 'icon' => $a['icon'], 'points' => $a['points'],
                'rule_type' => $rule, 'rule_threshold' => $threshold, 'sort_order' => $i,
            ]);
        }
    }
}
