<?php

namespace App\Filament\Resources\Contents\Schemas;

use App\Modules\Catalog\Enums\ContentStatus;
use App\Modules\Catalog\Enums\ContentType;
use App\Modules\Catalog\Enums\Difficulty;
use App\Modules\Catalog\Models\Category;
use App\Modules\Catalog\Models\Subject;
use App\Modules\Games\Models\Game;
use App\Modules\Learning\Models\LessonStep;
use App\Modules\Stories\Models\Story;
use App\Modules\Stories\Models\StoryChapter;
use App\Modules\Worksheets\Models\Worksheet;
use App\Modules\Worksheets\Support\WorksheetUploads;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\ToggleButtons;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Schema;

/**
 * فرم ساخت محتوا بدون برنامه‌نویسی (Dynamic Activity Builder – نسخه‌ی ۱)
 * بخش «جزئیات» بر اساس نوع محتوا تغییر می‌کند: کاربرگ / بازی / قصه.
 */
class ContentForm
{
    private const TONES = [
        'sun' => 'خورشید', 'coral' => 'مرجان', 'sky' => 'آسمان', 'grass' => 'چمن', 'grape' => 'انگور',
        'berry' => 'توت', 'ocean' => 'اقیانوس', 'peach' => 'هلو', 'mint' => 'نعناع', 'lilac' => 'یاس',
    ];

    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Tabs::make('content')->columnSpanFull()->persistTabInQueryString()->tabs([
                Tab::make('اطلاعات اصلی')->icon('heroicon-o-document-text')->schema(self::basics()),
                Tab::make('جزئیات فعالیت')->icon('heroicon-o-puzzle-piece')->schema(self::details()),
                Tab::make('انتشار و سئو')->icon('heroicon-o-globe-alt')->schema(self::publishing()),
                Tab::make('ترجمه‌ها')->icon('heroicon-o-language')->schema([
                    Repeater::make('translations')->label('ترجمه‌ها')->relationship()->defaultItems(0)
                        ->schema([
                            Select::make('locale')->label('زبان')->options(['en' => 'English'])->required(),
                            TextInput::make('title')->label('عنوان')->required(),
                            Textarea::make('description')->label('توضیحات')->rows(2),
                        ])->columns(3)->itemLabel(fn (array $state) => $state['title'] ?? null),
                ]),
            ]),
        ]);
    }

    private static function basics(): array
    {
        return [
            Grid::make(3)->schema([
                Select::make('content_type')->label('نوع محتوا')->options(ContentType::class)->required()->live()
                    ->disabledOn('edit'),
                Select::make('category_id')->label('دنیا / دسته')->required()->live()->searchable()
                    ->options(fn () => Category::orderBy('sort_order')->pluck('title', 'id')),
                Select::make('subject_id')->label('موضوع')->searchable()
                    ->options(fn (Get $get) => Subject::where('category_id', $get('category_id'))->pluck('title', 'id')),
            ]),
            Grid::make(2)->schema([
                TextInput::make('title')->label('عنوان')->required()->maxLength(160)->live(onBlur: true),
                TextInput::make('slug')->label('نامک (URL)')->required()->maxLength(120)->unique(ignoreRecord: true)
                    ->rule('regex:/^[a-z0-9-]+$/')->helperText('فقط حروف انگلیسی کوچک، عدد و خط تیره'),
            ]),
            Textarea::make('description')->label('توضیحات کوتاه')->rows(3)->columnSpanFull(),
            Grid::make(4)->schema([
                TextInput::make('min_age')->label('حداقل سن')->numeric()->minValue(2)->maxValue(10)->required(),
                TextInput::make('max_age')->label('حداکثر سن')->numeric()->minValue(2)->maxValue(10)->required()->gte('min_age'),
                Select::make('difficulty')->label('سطح دشواری')->options(Difficulty::class)->default('easy')->required(),
                TextInput::make('estimated_minutes')->label('زمان تقریبی (دقیقه)')->numeric()->default(5)->required(),
            ]),
            Grid::make(2)->schema([
                ToggleButtons::make('access_level')->label('دسترسی')->inline()->required()->default('free')
                    ->options(['free' => 'رایگان', 'premium' => 'ویژه (اشتراکی)'])->colors(['free' => 'success', 'premium' => 'warning']),
                Select::make('tone')->label('رنگ (تُن دنیا)')->options(self::TONES)->default('sky')->required(),
            ]),
            Select::make('skills')->label('مهارت‌های مرتبط')->relationship('skills', 'title')->multiple()->preload()
                ->pivotData(['weight' => 1])->helperText('مهارت اول مهم‌ترین است؛ وزن‌ها در نسخه‌ی بعد قابل تنظیم می‌شوند.'),
        ];
    }

    private static function details(): array
    {
        $is = fn (string $type) => fn (Get $get) => ($get('content_type') instanceof ContentType ? $get('content_type')->value : $get('content_type')) === $type;

        return [
            // ── کاربرگ ──
            Section::make('کاربرگ (Worksheet Generator)')->relationship('worksheet')->visible($is('worksheet'))
                ->mutateRelationshipDataBeforeFillUsing(fn (array $data) => WorksheetUploads::toForm($data))
                ->mutateRelationshipDataBeforeCreateUsing(fn (array $data) => WorksheetUploads::fromForm($data))
                ->mutateRelationshipDataBeforeSaveUsing(fn (array $data) => WorksheetUploads::fromForm($data))
                ->schema([
                    Grid::make(4)->schema([
                        Select::make('template')->label('قالب')->options(Worksheet::TEMPLATES)->required()->live()
                            ->helperText('«فایل آماده» یعنی به‌جای تولید خودکار، PDF یا تصویری را که خودتان ساخته‌اید آپلود کنید.'),
                        TextInput::make('page_count')->label('تعداد صفحه')->numeric()->default(1),
                        Select::make('paper_size')->label('قطع')->options(['A4' => 'A4', 'Letter' => 'Letter'])->default('A4'),
                        Select::make('orientation')->label('جهت')->options(['portrait' => 'عمودی', 'landscape' => 'افقی'])->default('portrait'),
                    ]),
                    KeyValue::make('params')->label('پارامترهای قالب')->keyLabel('کلید')->valueLabel('مقدار')
                        ->visible(fn (Get $get) => $get('template') !== Worksheet::UPLOAD)
                        ->helperText('مثال ردگیری: letter = ب ، word = بادکنک ، rows = 4 | ماز: size = 11 ، seed = 42'),

                    // ── کاربرگ آماده (آپلود) ──
                    Grid::make(2)->visible(fn (Get $get) => $get('template') === Worksheet::UPLOAD)->schema([
                        FileUpload::make('upload_file')->label('فایل کاربرگ (PDF یا تصویر)')
                            ->disk(WorksheetUploads::DISK)->directory(WorksheetUploads::FILE_DIR)->visibility('private')
                            ->acceptedFileTypes(WorksheetUploads::FILE_TYPES)->maxSize(30720)
                            ->storeFileNamesIn('upload_file_name')->downloadable()
                            ->required(fn (Get $get) => $get('template') === Worksheet::UPLOAD)
                            ->helperText('حداکثر ۳۰ مگابایت. فایل خصوصی ذخیره می‌شود؛ کاربرگ ویژه فقط برای مشترک‌ها دانلود می‌شود.'),
                        FileUpload::make('upload_preview')->label('تصویر پیش‌نمایش (کاور)')
                            ->disk(WorksheetUploads::DISK)->directory(WorksheetUploads::PREVIEW_DIR)->visibility('private')
                            ->image()->imageEditor()->maxSize(4096)
                            ->helperText('برای PDF لازم است تا کارت کاربرگ تصویر داشته باشد. برای کاربرگ ویژه نسخه‌ی کم‌کیفیت یا واترمارک‌دار بگذارید.'),
                        Hidden::make('upload_file_name'),
                    ]),
                ]),

            // ── بازی ──
            Section::make('بازی')->relationship('game')->visible($is('game'))->schema([
                Grid::make(2)->schema([
                    Select::make('game_type')->label('نوع بازی (Game Registry)')->options(Game::TYPES)->required(),
                    Select::make('engine')->label('موتور')->options(['react-svg' => 'React + SVG', 'phaser' => 'Phaser.js'])->default('react-svg'),
                ]),
                Repeater::make('levels')->label('مراحل')->relationship()->orderColumn('level_number')->reorderable()
                    ->schema([
                        Select::make('difficulty')->label('سطح')->options(Difficulty::options())->default('easy')->required(),
                        KeyValue::make('configuration')->label('پیکربندی مرحله')->helperText('حافظه: pairs، cols | الگو: rounds | شمارش: max، rounds'),
                    ])->columns(2)->itemLabel(fn (array $state) => isset($state['level_number']) ? "مرحله {$state['level_number']}" : 'مرحله‌ی جدید')
                    ->mutateRelationshipDataBeforeSaveUsing(fn (array $data) => self::castNumbers($data))
                    ->mutateRelationshipDataBeforeCreateUsing(fn (array $data) => self::castNumbers($data)),
            ]),

            // ── درس (آکادمی یادگیری) ──
            Section::make('درس')->relationship('lesson')->visible($is('lesson'))->schema([
                TagsInput::make('objectives')->label('اهداف یادگیری')->placeholder('مثلاً: شناخت شکل حرف «ب»'),
                Select::make('prerequisites')->label('پیش‌نیازها')->relationship('prerequisites', 'title',
                    fn ($query) => $query->where('content_type', 'lesson'))->multiple()->preload(),
                Repeater::make('steps')->label('گام‌های درس')->relationship()->orderColumn('step_order')->collapsible()
                    ->schema([
                        Grid::make(3)->schema([
                            Select::make('step_type')->label('نوع گام')->options(['explain' => 'توضیح', 'quiz' => 'پرسش'])->required()->live(),
                            TextInput::make('key')->label('شناسه')->required()->maxLength(32)->placeholder('s1'),
                            TextInput::make('title')->label('عنوان')->required(),
                        ]),
                        Textarea::make('body')->label('متن (با صدای بلند خوانده می‌شود)')->rows(2),
                        Grid::make(2)->schema([
                            Select::make('visual.kind')->label('تصویر')->options(LessonStep::VISUAL_KINDS)->placeholder('بدون تصویر'),
                            TextInput::make('visual.value')->label('مقدار تصویر')
                                ->helperText('حرف: ب | عدد: 3 | صحنه: night-sky | آیکون‌ها و شکل‌های حرف در فیلد زیر'),
                        ]),
                        TagsInput::make('visual.icons')->label('آیکون‌ها')->placeholder('apple, star, circle, square, triangle, plus'),
                        Section::make('پرسش')->visible(fn (Get $get) => $get('step_type') === 'quiz')->schema([
                            TextInput::make('question.prompt')->label('صورت پرسش')->required(),
                            Repeater::make('question.options')->label('گزینه‌ها')->minItems(2)->maxItems(4)->defaultItems(3)
                                ->schema([
                                    TextInput::make('id')->label('شناسه')->required()->maxLength(8),
                                    TextInput::make('label')->label('متن')->required(),
                                    TextInput::make('visual.icons.0')->label('آیکون (اختیاری)'),
                                ])->columns(3),
                            TextInput::make('question.answerId')->label('شناسه‌ی گزینه‌ی درست')->required(),
                        ]),
                    ])->itemLabel(fn (array $state) => trim(($state['key'] ?? '').' · '.($state['title'] ?? ''), ' ·'))
                    ->mutateRelationshipDataBeforeFillUsing(fn (array $data) => self::stepToForm($data))
                    ->mutateRelationshipDataBeforeSaveUsing(fn (array $data) => self::normalizeStep($data))
                    ->mutateRelationshipDataBeforeCreateUsing(fn (array $data) => self::normalizeStep($data)),
            ]),

            // ── قصه ──
            Section::make('قصه')->relationship('story')->visible($is('story'))->schema([
                Select::make('story_type')->label('نوع قصه')->options(Story::TYPES)->default('short')->required(),
                Repeater::make('chapters')->label('فصل‌ها')->relationship()->orderColumn('chapter_order')->collapsible()
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('key')->label('شناسه‌ی فصل')->required()->maxLength(32)->helperText('مثلاً c1'),
                            TextInput::make('title')->label('عنوان فصل')->required(),
                            TextInput::make('scene')->label('صحنه‌ی تصویرسازی')->placeholder('night-sky'),
                        ]),
                        Textarea::make('body')->label('متن')->rows(4)->required(),
                        Toggle::make('is_ending')->label('پایان قصه'),
                        Repeater::make('choices')->label('انتخاب‌ها (مسیر بعدی)')->relationship()->orderColumn('sort_order')->defaultItems(0)
                            ->schema([
                                TextInput::make('choice_text')->label('متن انتخاب')->required(),
                                Select::make('next_chapter_id')->label('فصل بعدی')->required()
                                    ->options(fn ($record, $livewire) => StoryChapter::query()
                                        ->whereHas('story', fn ($q) => $q->where('content_id', $livewire->record?->id))
                                        ->pluck('title', 'id')),
                            ])->columns(2)
                            ->helperText('ابتدا فصل‌ها را ذخیره کنید، سپس مسیرها را وصل کنید.'),
                    ])->itemLabel(fn (array $state) => trim(($state['key'] ?? '').' · '.($state['title'] ?? ''), ' ·')),
            ]),
        ];
    }

    private static function publishing(): array
    {
        return [
            Grid::make(3)->schema([
                Select::make('status')->label('وضعیت')->options(ContentStatus::class)->default('draft')->required()
                    ->helperText('انتشار نهایی با دکمه‌ی «تأیید و انتشار» در بالای صفحه انجام می‌شود.'),
                DateTimePicker::make('published_at')->label('زمان انتشار')->helperText('برای زمان‌بندی، وضعیت «زمان‌بندی‌شده» را انتخاب کنید.'),
                TextInput::make('sort_order')->label('ترتیب نمایش')->numeric()->default(0),
            ]),
            Grid::make(2)->schema([
                Toggle::make('ai_generated')->label('تولیدشده با هوش مصنوعی')->helperText('این محتوا بدون بازبینی کارشناس منتشر نمی‌شود.'),
                Select::make('locale')->label('زبان اصلی')->options(['fa' => 'فارسی', 'en' => 'English'])->default('fa'),
            ]),
            Group::make()->schema([
                KeyValue::make('seo')->label('SEO Metadata')->keyLabel('کلید')->valueLabel('مقدار')
                    ->default(['title' => '', 'description' => '']),
            ]),
        ];
    }

    /** قرارداد LessonVisual ← فیلدهای فرم (برعکس normalizeStep) */
    private static function stepToForm(array $data): array
    {
        $v = $data['visual'] ?? null;
        if (is_array($v)) {
            $data['visual'] = match ($v['kind'] ?? null) {
                'scene' => ['kind' => 'scene', 'value' => $v['scene'] ?? ''],
                'number' => ['kind' => 'number', 'value' => $v['value'] ?? '', 'icons' => [$v['icon'] ?? 'star']],
                'forms' => ['kind' => 'forms', 'icons' => $v['forms'] ?? []],
                default => $v,
            };
        }

        return $data;
    }

    /** تصویر گام را به قرارداد LessonVisual تبدیل می‌کند و گزینه‌های بی‌تصویر را تمیز می‌کند */
    private static function normalizeStep(array $data): array
    {
        $v = $data['visual'] ?? [];
        $data['visual'] = match ($v['kind'] ?? null) {
            'letter' => ['kind' => 'letter', 'value' => (string) ($v['value'] ?? '')],
            'number' => ['kind' => 'number', 'value' => (int) ($v['value'] ?? 0), 'icon' => $v['icons'][0] ?? 'star'],
            'icons' => ['kind' => 'icons', 'icons' => array_values(array_filter($v['icons'] ?? []))],
            'scene' => ['kind' => 'scene', 'scene' => (string) ($v['value'] ?? 'night-sky')],
            'forms' => ['kind' => 'forms', 'forms' => array_values(array_filter($v['icons'] ?? []))],
            default => null,
        };
        if (($data['step_type'] ?? '') !== 'quiz') {
            $data['question'] = null;
        } elseif (isset($data['question']['options'])) {
            $data['question']['options'] = array_values(array_map(function ($o) {
                $icon = $o['visual']['icons'][0] ?? null;

                return ['id' => (string) $o['id'], 'label' => $o['label']] + ($icon ? ['visual' => ['kind' => 'icons', 'icons' => [$icon]]] : []);
            }, $data['question']['options']));
        }

        return $data;
    }

    /** KeyValue همه‌چیز را رشته ذخیره می‌کند؛ اعداد را به عدد برمی‌گردانیم */
    private static function castNumbers(array $data): array
    {
        if (isset($data['configuration']) && is_array($data['configuration'])) {
            $data['configuration'] = array_map(fn ($v) => is_numeric($v) ? $v + 0 : $v, $data['configuration']);
        }

        return $data;
    }
}
