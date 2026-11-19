<?php

namespace App\Filament\Resources\Achievements;

use App\Filament\Resources\Achievements\Pages\ManageAchievements;
use App\Modules\Progress\Models\Achievement;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AchievementResource extends Resource
{
    protected static ?string $model = Achievement::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedTrophy;

    protected static string|\UnitEnum|null $navigationGroup = 'گیمیفیکیشن';

    protected static ?string $modelLabel = 'مدال';

    protected static ?string $pluralModelLabel = 'مدال‌ها';

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->schema([
                TextInput::make('title')->label('عنوان')->required(),
                TextInput::make('slug')->label('نامک')->required()->unique(ignoreRecord: true),
                TextInput::make('icon')->label('آیکون')->default('trophy'),
            ]),
            TextInput::make('description')->label('توضیح برای کودک')->required()->columnSpanFull(),
            Grid::make(4)->schema([
                Select::make('rule_type')->label('قاعده')->options(Achievement::RULES)->required(),
                TextInput::make('rule_threshold')->label('آستانه')->numeric()->default(1)->required(),
                TextInput::make('points')->label('امتیاز')->numeric()->default(10),
                Select::make('status')->label('وضعیت')->options(['active' => 'فعال', 'hidden' => 'غیرفعال'])->default('active'),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('sort_order')->reorderable('sort_order')->columns([
            TextColumn::make('title')->label('عنوان')->description(fn ($record) => $record->description),
            TextColumn::make('rule_type')->label('قاعده')->formatStateUsing(fn ($state, $record) => (Achievement::RULES[$state] ?? $state)." ≥ {$record->rule_threshold}"),
            TextColumn::make('points')->label('امتیاز'),
            TextColumn::make('status')->label('وضعیت')->badge(),
        ])->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageAchievements::route('/')];
    }
}
