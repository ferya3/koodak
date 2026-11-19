<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Catalog\Models\Category;
use App\Modules\Catalog\Models\Content;
use App\Modules\Children\Models\ParentalConsent;
use App\Modules\Games\Events\GameSessionCompleted;
use App\Modules\Games\Models\GameSession;
use App\Modules\Games\Support\GameScoring;
use App\Modules\Identity\Models\Role;
use App\Modules\Progress\Support\ProgressRecorder;
use App\Modules\Subscriptions\Models\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

/**
 * حساب‌های نمایشی (فقط محیط توسعه):
 *   admin@kidsworld.test / password   → پنل مدیریت /admin
 *   editor@kidsworld.test / password  → کارشناس محتوا
 *   parent@kidsworld.test / password  → والد با دو فرزند و یک هفته سابقه‌ی فعالیت
 */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@kidsworld.test'], ['name' => 'مدیر سامانه', 'password' => 'password', 'email_verified_at' => now()])->assignRole(Role::ADMIN);
        User::updateOrCreate(['email' => 'editor@kidsworld.test'], ['name' => 'کارشناس محتوا', 'password' => 'password', 'email_verified_at' => now()])->assignRole(Role::EDITOR);

        $parent = User::updateOrCreate(['email' => 'parent@kidsworld.test'], ['name' => 'مریم', 'password' => 'password', 'email_verified_at' => now()])->assignRole(Role::PARENT);
        $parent->subscriptions()->firstOrCreate(['plan_id' => Plan::where('slug', 'family')->value('id')], [
            'status' => 'active', 'billing_period' => 'yearly', 'starts_at' => now()->subMonths(2), 'expires_at' => now()->addMonths(10),
        ]);
        if ($parent->children()->exists()) {
            return;
        }

        $cat = fn (string $slug) => Category::where('slug', $slug)->value('id');
        $kids = [
            ['نیلا', now()->subYears(6)->subMonths(7)->format('Y-m'), 'bunny', [$cat('creative-studio'), $cat('story-world')], 45],
            ['آرین', now()->subYears(4)->subMonths(3)->format('Y-m'), 'fox', [$cat('brain-games'), $cat('discovery-world')], 30],
        ];

        foreach ($kids as [$name, $birth, $avatar, $favs, $limit]) {
            $child = $parent->children()->create(['display_name' => $name, 'birth_year_month' => $birth, 'avatar' => $avatar]);
            $child->preferences()->create(['favorite_categories' => $favs]);
            $child->settings()->create(['parent_user_id' => $parent->id, 'daily_limit_minutes' => $limit, 'bedtime_lock_enabled' => true]);
            ParentalConsent::create(['parent_user_id' => $parent->id, 'child_id' => $child->id, 'policy_version' => ParentalConsent::CURRENT_POLICY_VERSION, 'consented_at' => now()->subMonths(2)]);
            $this->history($child);
        }
    }

    /** یک هفته فعالیت واقعی از طریق همان مسیر دامنه‌ای که API استفاده می‌کند */
    private function history($child): void
    {
        $recorder = app(ProgressRecorder::class);
        $games = Content::where('content_type', 'game')->with(['game.levels', 'skills'])->get()->filter(fn ($c) => $child->age() >= $c->min_age);
        $stories = Content::where('content_type', 'story')->with('skills')->get()->filter(fn ($c) => $child->age() >= $c->min_age);
        mt_srand($child->id * 97);
        $today = now()->startOfDay();

        foreach (range(6, 0) as $daysAgo) {
            Carbon::setTestNow($today->copy()->subDays($daysAgo)->setTime(mt_rand(9, 18), mt_rand(0, 50)));

            foreach ($games->random(min(2, $games->count())) as $content) {
                $level = $content->game->levels->random();
                $stats = ['correct' => mt_rand(4, 8), 'mistakes' => mt_rand(0, 4), 'duration' => mt_rand(150, 420)];
                $first = ! GameSession::where('child_id', $child->id)->where('game_id', $content->game->id)->where('level_number', $level->level_number)->exists();
                $session = GameSession::create([
                    'child_id' => $child->id, 'game_id' => $content->game->id, 'level_number' => $level->level_number,
                    'status' => 'completed', 'started_at' => now()->subSeconds($stats['duration']), 'completed_at' => now(),
                    'correct_count' => $stats['correct'], 'mistakes' => $stats['mistakes'], 'duration_seconds' => $stats['duration'],
                    'stars' => GameScoring::stars($content->game->game_type, $stats, $level), 'score' => GameScoring::score($stats),
                ]);
                event(new GameSessionCompleted($session->load('game.content', 'game.levels'), $first));
            }

            if ($daysAgo % 2 === 0 && $stories->isNotEmpty()) {
                $story = $stories->random();
                $recorder->logActivity($child, $story, 'story', $story->title, mt_rand(240, 480), ['completed' => true]);
                $recorder->updateProgress($child, $story, 100);
                $recorder->observeSkills($child, $story, 100);
            }
            if ($daysAgo % 3 === 0) {
                $recorder->logActivity($child, null, 'drawing', 'نقاشی آزاد', mt_rand(300, 900));
            }
        }
        Carbon::setTestNow();
    }
}
