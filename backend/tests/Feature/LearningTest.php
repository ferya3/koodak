<?php

namespace Tests\Feature;

use App\Modules\Catalog\Models\Content;
use Tests\TestCase;

class LearningTest extends TestCase
{
    public function test_subjects_and_lessons_follow_the_shared_contract(): void
    {
        $this->getJson('/api/v1/learning/subjects')->assertOk()->assertJsonCount(5, 'data')->assertJsonPath('data.0.slug', 'alphabet');

        $lesson = $this->getJson('/api/v1/learning/lessons/letter-be')->assertOk()->json('data');
        $this->assertSame('lesson', $lesson['type']);
        $this->assertSame(['s1', 's2', 's3', 's4'], array_column($lesson['steps'], 'id'));
        $this->assertEquals(['kind' => 'letter', 'value' => 'ب', 'word' => 'برگ'], $lesson['steps'][0]['visual']); // jsonb ترتیب کلیدها را حفظ نمی‌کند
        $this->assertSame('a', $lesson['steps'][2]['question']['answerId']);

        $math = $this->getJson('/api/v1/learning/lessons?subject=math')->assertJsonPath('meta.total', 1)->json('data.0');
        $this->assertSame([(string) Content::where('slug', 'count-to-five')->value('id')], $math['prerequisiteIds']);
    }

    public function test_completion_is_scored_on_the_server_from_first_answers(): void
    {
        $parent = $this->parent();
        $child = $this->child($parent, 5);
        $ct = $this->postJson("/api/v1/children/{$child->id}/session", [], $this->bearer($this->parentToken($parent)))->json('token');

        $res = $this->postJson('/api/v1/learning/lessons/letter-be/complete', [
            'childId' => $child->id, 'answers' => ['s3' => 'a', 's4' => 'c'], 'durationSeconds' => 180,
        ], $this->bearer($ct))->assertOk();

        $res->assertJsonPath('result.correct', 1)->assertJsonPath('result.total', 2)->assertJsonPath('result.score', 50)->assertJsonPath('result.stars', 2);
        $this->assertContains('first-step', array_column($res->json('awards.achievements'), 'slug'));

        $this->getJson("/api/v1/children/{$child->id}/activity-history", $this->bearer($ct))
            ->assertJsonPath('data.0.contentType', 'lesson')->assertJsonPath('data.0.result', '★★');
        $this->getJson("/api/v1/children/{$child->id}/skills", $this->bearer($ct))->assertJsonPath('data.0.score', 50);
    }

    public function test_completion_requires_access_to_the_child(): void
    {
        $child = $this->child($this->parent());
        $this->postJson('/api/v1/learning/lessons/letter-be/complete', ['childId' => $child->id, 'answers' => [], 'durationSeconds' => 10], $this->bearer($this->parentToken($this->parent())))
            ->assertForbidden();
    }

    public function test_lessons_are_recommended_when_allowed(): void
    {
        $parent = $this->parent();
        $child = $this->child($parent, 5);
        $child->settings->update(['allowed_content_types' => ['lesson']]);
        $recs = $this->getJson("/api/v1/children/{$child->id}/recommendations?limit=4", $this->bearer($this->parentToken($parent)))->json('data');
        $this->assertNotEmpty($recs);
        $this->assertSame(['lesson'], array_values(array_unique(array_map(fn ($r) => $r['content']['type'], $recs))));
        $this->assertArrayHasKey('steps', $recs[0]['content']);
    }
}
