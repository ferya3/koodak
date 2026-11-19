<?php

namespace App\Filament\Resources\Skills;

use App\Filament\Resources\Skills\Pages\ManageSkills;
use App\Modules\Catalog\Models\Skill;
use BackedEnum;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SkillResource extends Resource
{
    protected static ?string $model = Skill::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedLightBulb;

    protected static string|\UnitEnum|null $navigationGroup = 'محتوا';

    protected static ?string $modelLabel = 'مهارت';

    protected static ?string $pluralModelLabel = 'مهارت‌ها';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->label('عنوان')->required(),
            TextInput::make('slug')->label('نامک')->required()->unique(ignoreRecord: true),
            Select::make('skill_category')->label('حوزه')->options(Skill::CATEGORIES)->required(),
            Textarea::make('description')->label('توضیحات')->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('title')->label('عنوان')->searchable(),
            TextColumn::make('skill_category')->label('حوزه')->badge()->formatStateUsing(fn ($state) => Skill::CATEGORIES[$state] ?? $state),
            TextColumn::make('slug')->label('نامک')->color('gray'),
        ])->recordActions([EditAction::make(), DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageSkills::route('/')];
    }
}
