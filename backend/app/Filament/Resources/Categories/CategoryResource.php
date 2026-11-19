<?php

namespace App\Filament\Resources\Categories;

use App\Filament\Resources\Categories\Pages\ManageCategories;
use App\Modules\Catalog\Models\Category;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\Cache;

/** دنیاها و دسته‌ها – هیچ دسته‌ای در کد هاردکد نیست */
class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedGlobeAlt;

    protected static string|\UnitEnum|null $navigationGroup = 'محتوا';

    protected static ?string $modelLabel = 'دنیا / دسته';

    protected static ?string $pluralModelLabel = 'دنیاها و دسته‌ها';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->schema([
                TextInput::make('title')->label('عنوان')->required(),
                TextInput::make('title_en')->label('عنوان انگلیسی'),
                TextInput::make('slug')->label('نامک')->required()->unique(ignoreRecord: true)->rule('regex:/^[a-z0-9-]+$/'),
            ]),
            Textarea::make('description')->label('توضیحات')->rows(2)->columnSpanFull(),
            Grid::make(4)->schema([
                Select::make('parent_id')->label('دسته‌ی والد')->relationship('parent', 'title')->placeholder('— دنیای سطح اول —'),
                Select::make('icon')->label('آیکون')->required()->options(array_combine(self::ICONS, self::ICONS)),
                Select::make('tone')->label('رنگ')->required()->options(array_combine(Category::TONES, Category::TONES)),
                TextInput::make('sort_order')->label('ترتیب')->numeric()->default(0),
            ]),
            Select::make('status')->label('وضعیت')->options(['active' => 'فعال', 'hidden' => 'پنهان'])->default('active'),
            Repeater::make('subjects')->label('موضوع‌ها')->relationship()->orderColumn('sort_order')->defaultItems(0)
                ->schema([TextInput::make('title')->label('عنوان')->required(), TextInput::make('slug')->label('نامک')->required()])
                ->columns(2)->columnSpanFull(),
        ]);
    }

    private const ICONS = ['academy', 'brain', 'studio', 'worksheet', 'fun', 'discover', 'story', 'music', 'life', 'growth', 'rocket', 'dino', 'star'];

    public static function table(Table $table): Table
    {
        return $table->defaultSort('sort_order')->reorderable('sort_order')
            ->columns([
                TextColumn::make('title')->label('عنوان')->searchable()->description(fn ($record) => $record->title_en),
                TextColumn::make('parent.title')->label('والد')->placeholder('—'),
                TextColumn::make('tone')->label('رنگ')->badge(),
                TextColumn::make('contents_count')->label('محتوا')->counts('contents'),
                TextColumn::make('status')->label('وضعیت')->badge()->formatStateUsing(fn ($state) => $state === 'active' ? 'فعال' : 'پنهان')
                    ->color(fn ($state) => $state === 'active' ? 'success' : 'gray'),
            ])
            ->recordActions([EditAction::make()->after(fn () => Cache::forget('catalog:categories:fa')), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageCategories::route('/')];
    }
}
