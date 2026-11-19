<?php

namespace Database\Seeders;

use App\Modules\Catalog\Models\AgeGroup;
use App\Modules\Catalog\Models\Category;
use App\Modules\Catalog\Models\Content;
use App\Modules\Catalog\Models\Skill;
use App\Modules\Catalog\Models\Subject;
use App\Modules\Games\Models\Game;
use App\Modules\Learning\Models\Lesson;
use App\Modules\Stories\Models\Story;
use App\Modules\Worksheets\Models\Worksheet;
use Illuminate\Database\Seeder;

/**
 * محتوای نمونه از همان منبعی که Frontend استفاده می‌کند
 * (database/seeders/data/*.json که از apps/web/lib/data تولید شده است).
 */
class CatalogSeeder extends Seeder
{
    /** @var array<string,int> نگاشت شناسه‌ی Seed فرانت به شناسه‌ی دیتابیس */
    public static array $ids = [];

    public function run(): void
    {
        $tax = json_decode(file_get_contents(__DIR__.'/data/taxonomy.json'), true);
        $content = json_decode(file_get_contents(__DIR__.'/data/content.json'), true);

        foreach ($tax['ageGroups'] as $i => $g) {
            self::$ids[$g['id']] = AgeGroup::updateOrCreate(['min_age' => $g['minAge'], 'max_age' => $g['maxAge']], ['title' => $g['title'], 'sort_order' => $i])->id;
        }

        foreach ($tax['categories'] as $c) {
            self::$ids[$c['id']] = Category::updateOrCreate(['slug' => $c['slug']], [
                'title' => $c['title'], 'title_en' => $c['titleEn'], 'description' => $c['description'],
                'icon' => $c['icon'], 'tone' => $c['tone'], 'sort_order' => $c['sortOrder'], 'status' => 'active',
            ])->id;
        }

        foreach ($tax['subjects'] ?? [] as $i => $s) {
            self::$ids[$s['id']] = Subject::updateOrCreate(
                ['category_id' => self::$ids[$s['categoryId']], 'slug' => $s['slug']],
                ['title' => $s['title'], 'sort_order' => $i],
            )->id;
        }

        foreach ($tax['skills'] as $s) {
            self::$ids[$s['id']] = Skill::updateOrCreate(['slug' => $s['slug']], ['title' => $s['title'], 'skill_category' => $s['category']])->id;
        }

        foreach ($content['worksheets'] as $i => $w) {
            $c = $this->content($w, $i);
            Worksheet::updateOrCreate(['content_id' => $c->id], [
                'template' => $w['template'], 'params' => $w['params'], 'page_count' => $w['pageCount'],
                'paper_size' => $w['paperSize'], 'orientation' => $w['orientation'], 'download_count' => $w['downloadCount'],
            ]);
        }

        foreach ($content['games'] as $i => $g) {
            $c = $this->content($g, $i);
            $game = Game::updateOrCreate(['content_id' => $c->id], ['game_type' => $g['gameType'], 'engine' => $g['engine']]);
            foreach ($g['levels'] as $l) {
                $game->levels()->updateOrCreate(['level_number' => $l['levelNumber']], ['difficulty' => $l['difficulty'], 'configuration' => $l['configuration']]);
            }
        }

        foreach ($content['stories'] as $i => $s) {
            $c = $this->content($s, $i);
            $story = Story::updateOrCreate(['content_id' => $c->id], ['story_type' => $s['storyType']]);
            $chapters = [];
            foreach ($s['chapters'] as $order => $ch) {
                $chapters[$ch['id']] = $story->chapters()->updateOrCreate(['key' => $ch['id']], [
                    'title' => $ch['title'], 'body' => $ch['body'], 'scene' => $ch['scene'],
                    'chapter_order' => $order, 'is_ending' => $ch['isEnding'] ?? false,
                ]);
            }
            foreach ($s['chapters'] as $ch) {
                $chapters[$ch['id']]->choices()->delete();
                foreach ($ch['choices'] as $k => $choice) {
                    $chapters[$ch['id']]->choices()->create([
                        'choice_text' => $choice['text'], 'next_chapter_id' => $chapters[$choice['nextChapterId']]->id, 'sort_order' => $k,
                    ]);
                }
            }
        }

        $this->lessons();
    }

    /** درس‌های آکادمی (data/lessons.json) – بعد از سایر محتواها تا پیش‌نیازها حل شوند */
    private function lessons(): void
    {
        $data = json_decode(file_get_contents(__DIR__.'/data/lessons.json'), true)['lessons'];
        $models = [];
        foreach ($data as $i => $l) {
            $c = $this->content($l, $i);
            $lesson = Lesson::updateOrCreate(['content_id' => $c->id], ['objectives' => $l['objectives']]);
            foreach ($l['steps'] as $order => $step) {
                $lesson->steps()->updateOrCreate(['key' => $step['id']], [
                    'step_type' => $step['type'], 'title' => $step['title'], 'body' => $step['body'],
                    'visual' => $step['visual'] ?? null, 'question' => $step['question'] ?? null, 'step_order' => $order,
                ]);
            }
            $models[$l['id']] = [$lesson, $l['prerequisiteIds']];
        }
        foreach ($models as [$lesson, $prereqs]) {
            $lesson->prerequisites()->sync(array_map(fn ($id) => self::$ids[$id], $prereqs));
        }
    }

    private function content(array $d, int $order): Content
    {
        $c = Content::withTrashed()->updateOrCreate(['slug' => $d['slug']], [
            'category_id' => self::$ids[$d['categoryId']],
            'subject_id' => isset($d['subjectId']) ? self::$ids[$d['subjectId']] : null,
            'content_type' => $d['type'],
            'title' => $d['title'],
            'description' => $d['description'],
            'difficulty' => $d['difficulty'],
            'min_age' => $d['minAge'],
            'max_age' => $d['maxAge'],
            'estimated_minutes' => $d['estimatedMinutes'],
            'access_level' => $d['access'],
            'status' => 'published',
            'tone' => $d['tone'],
            'sort_order' => $order,
            'published_at' => $d['publishedAt'],
            'seo' => ['title' => $d['title'], 'description' => $d['description']],
        ]);
        $c->skills()->sync(collect($d['skills'])->mapWithKeys(fn ($s) => [self::$ids[$s['skillId']] => ['weight' => $s['weight']]])->all());
        self::$ids[$d['id']] = $c->id;

        return $c;
    }
}
