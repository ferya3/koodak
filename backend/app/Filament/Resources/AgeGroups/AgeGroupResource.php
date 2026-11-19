<?php

namespace App\Filament\Resources\AgeGroups;

use App\Filament\Resources\AgeGroups\Pages\ManageAgeGroups;
use App\Modules\Catalog\Models\AgeGroup;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class AgeGroupResource extends Resource
{
    protected static ?string $model = AgeGroup::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCake;

    protected static string|\UnitEnum|null $navigationGroup = 'محتوا';

    protected static ?string $modelLabel = 'گروه سنی';

    protected static ?string $pluralModelLabel = 'گروه‌های سنی';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('title')->label('عنوان')->required(),
            TextInput::make('min_age')->label('از سن')->numeric()->required(),
            TextInput::make('max_age')->label('تا سن')->numeric()->required()->gt('min_age'),
        ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('min_age')->columns([
            TextColumn::make('title')->label('عنوان'),
            TextColumn::make('min_age')->label('از'),
            TextColumn::make('max_age')->label('تا'),
        ])->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageAgeGroups::route('/')];
    }
}
