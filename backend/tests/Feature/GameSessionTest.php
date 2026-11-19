<?php

namespace Tests\Feature;

use App\Modules\Progress\Models\ChildAchievement;
use Tests\TestCase;

class GameSessionTest extends TestCase
{
    public function test_full_game_session_flow_with_child_token(): void
    {
        $parent = $this->parent();
        $child = $this->child($parent, 5);
        $ct = $this->postJson("/api/v1/children/{$child->id}/session", [], $this->bearer($this->parentToken($parent)))->json('token');

        $start = $this->postJson('/api/v1/games/memory-garden/sessions', ['childId' => $child->id, 'level' => 1], $this->bearer($ct))
            ->assertCreated()->assertJsonPath('level.configuration.pairs', 3);
        $id = $start->json('sessionId');

        $this->postJson("/api/v1/games/sessions/$id/events", ['events' => [
            ['type' => 'start', 'at' => 0], ['type' => 'correct', 'at' => 1200, 'data' => ['icon' => 'apple']], ['type' => 'wrong', 'at' => 2500],
        ]], $this->bearer($ct))->assertStatus(202)->assertJsonPath('accepted', 3);
        $this->assertDatabaseCount('game_events', 3);

        // کلاینت ادعای ۳ ستاره نمی‌کند؛ سرور از آمار محاسبه می‌کند (۳ جفت، ۱ اشتباه ← ۳ ستاره)
        $done = $this->postJson("/api/v1/games/sessions/$id/complete", ['correct' => 3, 'mistakes' => 1, 'durationSeconds' => 40], $this->bearer($ct))
            ->assertOk()->assertJsonPath('result.stars', 3);

        $awards = $done->json('awards');
        $this->assertGreaterThanOrEqual(35, $awards['points']); // ۳۰ برای ستاره‌ها + ۵ اولین بار + مدال‌ها
        $this->assertContains('first-step', array_column($awards['achievements'], 'slug'));
        $this->assertContains('elephant-mind', array_column($awards['achievements'], 'slug'));

        $this->postJson("/api/v1/games/sessions/$id/complete", ['correct' => 3, 'mistakes' => 0], $this->bearer($ct))->assertStatus(409);

        $progress = $this->getJson("/api/v1/children/{$child->id}/progress", $this->bearer($ct))->assertOk();
        $progress->assertJsonPath('items.0.bestStars', 3)->assertJsonPath('items.0.progressPercent', 33);
        $this->getJson("/api/v1/children/{$child->id}/skills", $this->bearer($ct))->assertJsonPath('data.0.score', 100);
        $this->getJson("/api/v1/children/{$child->id}/activity-history", $this->bearer($ct))->assertJsonPath('data.0.result', '★★★');
    }

    public function test_child_token_cannot_play_as_a_sibling(): void
    {
        $parent = $this->parent('family');
        $nila = $this->child($parent);
        $arian = $this->child($parent, 4);
        $ct = $this->postJson("/api/v1/children/{$nila->id}/session", [], $this->bearer($this->parentToken($parent)))->json('token');

        $this->postJson('/api/v1/games/memory-garden/sessions', ['childId' => $arian->id, 'level' => 1], $this->bearer($ct))->assertForbidden();
    }

    public function test_invalid_level_and_event_types_are_rejected(): void
    {
        $parent = $this->parent();
        $child = $this->child($parent);
        $t = $this->parentToken($parent);
        $this->postJson('/api/v1/games/memory-garden/sessions', ['childId' => $child->id, 'level' => 9], $this->bearer($t))->assertStatus(422);

        $id = $this->postJson('/api/v1/games/pattern-train/sessions', ['childId' => $child->id, 'level' => 1], $this->bearer($t))->json('sessionId');
        $this->postJson("/api/v1/games/sessions/$id/events", ['events' => [['type' => 'hack', 'at' => 1]]], $this->bearer($t))->assertUnprocessable();
    }

    public function test_mistakes_reduce_stars_for_round_based_games(): void
    {
        $parent = $this->parent();
        $child = $this->child($parent);
        $t = $this->parentToken($parent);
        $id = $this->postJson('/api/v1/games/count-the-fish/sessions', ['childId' => $child->id, 'level' => 1], $this->bearer($t))->json('sessionId');

        $this->postJson("/api/v1/games/sessions/$id/complete", ['correct' => 5, 'mistakes' => 4], $this->bearer($t))->assertJsonPath('result.stars', 1);
        $this->assertSame(0, ChildAchievement::where('child_id', $child->id)->whereHas('achievement', fn ($q) => $q->where('slug', 'elephant-mind'))->count());
    }
}
