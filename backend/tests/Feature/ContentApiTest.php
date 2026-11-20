<?php

namespace Tests\Feature;

use App\Modules\Catalog\Enums\ContentStatus;
use App\Modules\Catalog\Models\Content;
use Illuminate\Support\Facades\Cache;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ContentApiTest extends TestCase
{
    public function test_categories_are_served_from_the_database(): void
    {
        $this->getJson('/api/v1/categories')->assertOk()->assertJsonCount(10, 'data')
            ->assertJsonPath('data.0.slug', 'learning-academy')->assertJsonPath('data.0.tone', 'sky');
    }

    /**
     * پاسخ دوم از کش خوانده می‌شود. با cache.serializable_classes = false، کش کردن مدل/Resource
     * باعث __PHP_Incomplete_Class و خطای ۵۰۰ می‌شد (فقط در production که کش واقعی دارد).
     */
    public function test_categories_are_served_identically_from_a_serializing_cache(): void
    {
        config(['cache.default' => 'file']);
        Cache::flush();

        $fresh = $this->getJson('/api/v1/categories')->assertOk()->json();
        $cached = $this->getJson('/api/v1/categories')->assertOk()->json();
        $this->assertSame($fresh, $cached);
        $sheets = collect($cached['data'])->firstWhere('slug', 'worksheets');
        $this->assertCount(9, $sheets['subjects']);
        Cache::flush();
    }

    public function test_worksheets_list_matches_frontend_contract_and_filters(): void
    {
        $res = $this->getJson('/api/v1/worksheets?age=5&template=maze')->assertOk();
        $res->assertJsonPath('meta.total', 9)->assertJsonPath('data.0.slug', 'maze-easy')
            ->assertJsonStructure(['data' => [['id', 'slug', 'type', 'title', 'categoryId', 'ageGroupIds', 'minAge', 'maxAge', 'difficulty',
                'estimatedMinutes', 'access', 'skills' => [['skillId', 'weight']], 'tone', 'template', 'params', 'pageCount', 'paperSize']], 'meta' => ['page', 'perPage', 'total']]);

        $this->getJson('/api/v1/worksheets?q=ماز')->assertJsonPath('meta.total', 27);
        $this->getJson('/api/v1/worksheets?access=premium')->assertJsonPath('meta.total', 93);

        // کتابخانه‌ی بزرگ: فرانت همه‌ی صفحه‌ها را (۶۰تایی) می‌گیرد؛ کاربرگ‌های تولیدی قفسه (subject) دارند
        $all = $this->getJson('/api/v1/worksheets?perPage=60&page=2')->assertOk()->assertJsonPath('meta.page', 2);
        $this->assertGreaterThan(450, $all->json('meta.total'));
        $this->assertNotNull($this->getJson('/api/v1/worksheets/fa-trace-be')->json('data.subjectId'));
        $this->getJson('/api/v1/worksheets?perPage=61')->assertUnprocessable();
    }

    public function test_unpublished_content_is_hidden(): void
    {
        Content::where('slug', 'maze-easy')->update(['status' => 'draft']);
        $this->getJson('/api/v1/worksheets/maze-easy')->assertNotFound();
        $this->getJson('/api/v1/worksheets?template=maze&age=5')->assertJsonPath('meta.total', 8);
    }

    public function test_premium_worksheet_download_requires_subscription(): void
    {
        $this->postJson('/api/v1/worksheets/maze-hard/download')->assertUnauthorized();
        $this->postJson('/api/v1/worksheets/maze-hard/download', [], $this->bearer($this->parentToken($this->parent())))->assertStatus(402);
        $this->postJson('/api/v1/worksheets/maze-hard/download', ['format' => 'png'], $this->bearer($this->parentToken($this->parent('family'))))
            ->assertOk()->assertJsonPath('template', 'maze');

        // کاربرگ رایگان برای مهمان هم آزاد است و شمارش می‌شود
        $before = $this->getJson('/api/v1/worksheets/maze-easy')->json('data.downloadCount');
        $this->postJson('/api/v1/worksheets/maze-easy/download')->assertOk()->assertJsonPath('downloadCount', $before + 1);
    }

    public function test_game_and_story_resources(): void
    {
        $this->getJson('/api/v1/games/memory-garden')->assertOk()
            ->assertJsonPath('data.gameType', 'memory')->assertJsonPath('data.levels.0.configuration.pairs', 3);

        $chapters = $this->getJson('/api/v1/stories/little-cloud')->assertOk()->json('data.chapters');
        $this->assertSame('c1', $chapters[0]['id']);
        $this->assertSame(['c2', 'c3'], array_column($chapters[0]['choices'], 'nextChapterId'));
        $this->assertTrue($chapters[3]['isEnding']);
    }

    public function test_english_translation_is_used_when_requested(): void
    {
        Content::where('slug', 'memory-garden')->first()->translations()->create(['locale' => 'en', 'title' => 'Memory Garden']);
        $this->getJson('/api/v1/games/memory-garden?locale=en')->assertJsonPath('data.title', 'Memory Garden')->assertHeader('Content-Language', 'en');
        $this->getJson('/api/v1/games/memory-garden')->assertJsonPath('data.title', 'باغ حافظه');
    }

    public function test_ai_content_cannot_be_published_without_review(): void
    {
        $c = Content::where('slug', 'maze-easy')->first();
        $this->expectException(ValidationException::class);
        $c->update(['ai_generated' => true, 'status' => ContentStatus::Published, 'reviewed_at' => null]);
    }

    public function test_scheduled_content_is_published_by_the_scheduler(): void
    {
        $c = Content::where('slug', 'maze-easy')->first();
        $c->update(['status' => ContentStatus::Scheduled, 'published_at' => now()->addHour()]);
        $this->artisan('content:publish-scheduled');
        $this->getJson('/api/v1/worksheets/maze-easy')->assertNotFound();

        $this->travel(2)->hours();
        $this->artisan('content:publish-scheduled');
        $this->getJson('/api/v1/worksheets/maze-easy')->assertOk();
        $this->assertSame(1, $c->versions()->count());
    }
}
