<?php

namespace Tests\Feature;

use App\Modules\Catalog\Models\Content;
use App\Modules\Subscriptions\Models\Plan;
use Tests\TestCase;

class ParentFeaturesTest extends TestCase
{
    public function test_dashboard_aggregates_activity_and_respects_limits(): void
    {
        // روزها بر اساس منطقه‌ی زمانی والد (Asia/Tehran) شمرده می‌شوند؛ ساعت را وسط روز ثابت می‌کنیم
        $this->travelTo(now('Asia/Tehran')->setTime(12, 0));
        $parent = $this->parent();
        $child = $this->child($parent);
        $t = $this->parentToken($parent);
        $story = Content::where('slug', 'little-cloud')->first();

        $this->postJson("/api/v1/children/{$child->id}/activities", ['type' => 'story', 'contentId' => $story->id, 'durationSeconds' => 420], $this->bearer($t))
            ->assertCreated()->assertJsonPath('awards.achievements.0.slug', 'first-step');
        $this->postJson("/api/v1/children/{$child->id}/activities", ['type' => 'drawing', 'durationSeconds' => 3000], $this->bearer($t))->assertCreated();

        $d = $this->getJson('/api/v1/parent/dashboard', $this->bearer($t))->assertOk()->json('selected');
        $this->assertSame(57, $d['kpis']['totalMinutes']);
        $this->assertSame(1, $d['kpis']['daysOverLimit']); // سقف پیش‌فرض ۴۵ دقیقه
        $this->assertSame(57, end($d['weeklyMinutes'])['minutes']);
        $this->assertSame('drawing', $d['minutesByType'][0]['type']);
        $this->assertNotEmpty($d['skills']);
        $this->assertCount(2, $d['recentActivity']);
    }

    public function test_recommendations_follow_age_parent_settings_and_plan(): void
    {
        $parent = $this->parent();
        $child = $this->child($parent, 8);
        $child->settings->update(['allowed_content_types' => ['game', 'story']]);

        $recs = $this->getJson("/api/v1/children/{$child->id}/recommendations?limit=6", $this->bearer($this->parentToken($parent)))->assertOk()->json('data');
        $this->assertNotEmpty($recs);
        foreach ($recs as $r) {
            $this->assertContains($r['content']['type'], ['game', 'story']);
            $this->assertLessThanOrEqual(8, $r['content']['minAge']);
            $this->assertGreaterThanOrEqual(8, $r['content']['maxAge']);
            $this->assertSame('free', $r['content']['access']);
            $this->assertNotEmpty($r['reason']);
        }
    }

    public function test_report_is_generated_on_the_queue_and_downloadable_only_by_owner(): void
    {
        $parent = $this->parent();
        $child = $this->child($parent);
        $t = $this->parentToken($parent);

        $id = $this->postJson('/api/v1/parent/reports/generate', ['childId' => $child->id], $this->bearer($t))->assertStatus(202)->json('data.id');
        $this->getJson('/api/v1/parent/reports', $this->bearer($t))->assertJsonPath('data.0.status', 'ready');
        $html = $this->get("/api/v1/parent/reports/$id/download", $this->bearer($t))->assertOk()->streamedContent();
        $this->assertStringContainsString('dir="rtl"', $html);

        $this->getJson("/api/v1/parent/reports/$id/download", $this->bearer($this->parentToken($this->parent())))->assertForbidden();
    }

    public function test_checkout_with_fake_gateway_activates_family_plan(): void
    {
        $parent = $this->parent();
        $t = $this->parentToken($parent);
        $plan = Plan::where('slug', 'family')->first();

        $this->getJson('/api/v1/subscriptions/current', $this->bearer($t))->assertJsonPath('entitlements.premiumContent', false);
        $redirect = $this->postJson('/api/v1/subscriptions/checkout', ['planId' => $plan->id, 'billingPeriod' => 'yearly'], $this->bearer($t))
            ->assertCreated()->json('redirectUrl');
        parse_str(parse_url($redirect, PHP_URL_QUERY), $query);

        $this->getJson('/api/v1/payments/callback?'.http_build_query($query))->assertOk()->assertJsonPath('status', 'paid');
        $this->getJson('/api/v1/subscriptions/current', $this->bearer($t))
            ->assertJsonPath('subscription.plan.slug', 'family')->assertJsonPath('entitlements.maxChildren', 4)->assertJsonPath('entitlements.premiumContent', true);
        $this->assertDatabaseHas('payments', ['user_id' => $parent->id, 'status' => 'paid', 'amount' => $plan->price_yearly]);
    }

    public function test_commercial_features_can_be_switched_off(): void
    {
        config(['kidsworld.features.subscriptions' => false]);
        $this->getJson('/api/v1/plans')->assertNotFound();
        // با خاموش بودن اشتراک، همه‌ی محتوا آزاد است
        $this->postJson('/api/v1/worksheets/maze-hard/download', [], $this->bearer($this->parentToken($this->parent())))->assertOk();
    }
}
