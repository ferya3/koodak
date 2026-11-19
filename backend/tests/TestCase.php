<?php

namespace Tests;

use App\Models\User;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Identity\Models\Role;
use App\Modules\Subscriptions\Models\Plan;
use Database\Seeders\TestingSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    protected string $seeder = TestingSeeder::class;

    protected function parent(string $plan = 'free'): User
    {
        $user = User::factory()->create()->assignRole(Role::PARENT);
        if ($plan !== 'free') {
            $user->subscriptions()->create([
                'plan_id' => Plan::where('slug', $plan)->value('id'), 'status' => 'active',
                'starts_at' => now()->subDay(), 'expires_at' => now()->addMonth(),
            ]);
        }

        return $user;
    }

    protected function child(User $parent, int $age = 6): ChildProfile
    {
        $child = ChildProfile::factory()->for($parent, 'parent')->create(['birth_year_month' => now()->subYears($age)->subMonth()->format('Y-m')]);
        $child->settings()->create(['parent_user_id' => $parent->id]);

        return $child;
    }

    /** توکن والد (ability: parent) */
    protected function parentToken(User $user): string
    {
        return $user->createToken('test', ['parent'])->plainTextToken;
    }

    /** @return array<string,string> */
    protected function bearer(string $token): array
    {
        // گاردها بین درخواست‌ها کش می‌شوند؛ برای تعویض توکن در یک تست باید پاک شوند
        $this->app['auth']->forgetGuards();

        return ['Authorization' => "Bearer $token", 'Accept' => 'application/json'];
    }
}
