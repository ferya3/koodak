<?php

namespace Tests\Feature;

use App\Modules\Children\Models\ChildProfile;
use Tests\TestCase;

class ChildrenTest extends TestCase
{
    private function payload(array $over = []): array
    {
        return ['display_name' => 'نیلا', 'birth_year_month' => now()->subYears(6)->format('Y-m'), 'avatar' => 'bunny', 'consent' => true, ...$over];
    }

    public function test_parent_creates_child_with_consent_and_defaults(): void
    {
        $parent = $this->parent();
        $this->postJson('/api/v1/children', $this->payload(), $this->bearer($this->parentToken($parent)))
            ->assertCreated()->assertJsonPath('data.displayName', 'نیلا')->assertJsonPath('data.age', 6);

        $child = ChildProfile::first();
        $this->assertDatabaseHas('parental_consents', ['child_id' => $child->id, 'policy_version' => '1.2']);
        $this->assertDatabaseHas('parent_settings', ['child_id' => $child->id, 'daily_limit_minutes' => 45]);
    }

    public function test_consent_is_mandatory_and_age_is_validated(): void
    {
        $token = $this->parentToken($this->parent());
        $this->postJson('/api/v1/children', $this->payload(['consent' => false]), $this->bearer($token))->assertJsonValidationErrors('consent');
        $this->postJson('/api/v1/children', $this->payload(['birth_year_month' => now()->subYears(30)->format('Y-m')]), $this->bearer($token))
            ->assertJsonValidationErrors('birth_year_month');
    }

    public function test_free_plan_allows_one_child_family_plan_allows_more(): void
    {
        $free = $this->parent();
        $t = $this->parentToken($free);
        $this->postJson('/api/v1/children', $this->payload(), $this->bearer($t))->assertCreated();
        $this->postJson('/api/v1/children', $this->payload(['display_name' => 'آرین']), $this->bearer($t))->assertStatus(422);

        $family = $this->parent('family');
        $t = $this->parentToken($family);
        $this->postJson('/api/v1/children', $this->payload(), $this->bearer($t))->assertCreated();
        $this->postJson('/api/v1/children', $this->payload(['display_name' => 'آرین']), $this->bearer($t))->assertCreated();
    }

    public function test_parent_cannot_access_another_familys_child(): void
    {
        $child = $this->child($this->parent());
        $other = $this->parentToken($this->parent());

        $this->getJson("/api/v1/children/{$child->id}", $this->bearer($other))->assertForbidden();
        $this->getJson("/api/v1/children/{$child->id}/progress", $this->bearer($other))->assertForbidden();
        $this->putJson("/api/v1/children/{$child->id}/settings", ['daily_limit_minutes' => 120], $this->bearer($other))->assertForbidden();
    }

    public function test_settings_update_and_child_session_token_scope(): void
    {
        $parent = $this->parent('family');
        $nila = $this->child($parent);
        $arian = $this->child($parent, 4);
        $pt = $this->parentToken($parent);

        $this->putJson("/api/v1/children/{$nila->id}/settings", ['daily_limit_minutes' => 30, 'bedtime_lock' => ['enabled' => true, 'from' => '20:00']], $this->bearer($pt))
            ->assertOk()->assertJsonPath('data.dailyLimitMinutes', 30)->assertJsonPath('data.bedtimeLock.from', '20:00');

        $ct = $this->postJson("/api/v1/children/{$nila->id}/session", [], $this->bearer($pt))->assertCreated()->json('token');

        // کودک فقط داده‌های خودش را می‌بیند و به بخش والدین دسترسی ندارد
        $this->getJson("/api/v1/children/{$nila->id}/settings", $this->bearer($ct))->assertOk();
        $this->getJson("/api/v1/children/{$arian->id}/progress", $this->bearer($ct))->assertForbidden();
        $this->getJson('/api/v1/children', $this->bearer($ct))->assertForbidden();
        $this->getJson('/api/v1/parent/dashboard', $this->bearer($ct))->assertForbidden();
        $this->putJson("/api/v1/children/{$nila->id}/settings", ['daily_limit_minutes' => 240], $this->bearer($ct))->assertForbidden();
    }

    public function test_deletion_hides_child_immediately_and_purges_after_grace_period(): void
    {
        $parent = $this->parent();
        $child = $this->child($parent);
        $t = $this->parentToken($parent);

        $this->deleteJson("/api/v1/children/{$child->id}", [], $this->bearer($t))->assertStatus(202);
        $this->getJson("/api/v1/children/{$child->id}", $this->bearer($t))->assertNotFound();
        $this->getJson('/api/v1/children', $this->bearer($t))->assertJsonCount(0, 'data');

        $this->artisan('children:purge')->assertSuccessful();
        $this->assertDatabaseHas('child_profiles', ['id' => $child->id]); // هنوز در مهلت

        $this->travel(31)->days();
        $this->artisan('children:purge')->assertSuccessful();
        $this->assertDatabaseMissing('child_profiles', ['id' => $child->id]);
        $this->assertDatabaseMissing('parent_settings', ['child_id' => $child->id]);
    }

    public function test_parent_can_export_all_child_data(): void
    {
        $parent = $this->parent();
        $child = $this->child($parent);
        $this->getJson("/api/v1/children/{$child->id}/export", $this->bearer($this->parentToken($parent)))
            ->assertOk()->assertJsonStructure(['exportedAt', 'profile', 'settings', 'consents', 'gameSessions', 'progress' => ['activities', 'achievements', 'points', 'skills']]);
    }
}
