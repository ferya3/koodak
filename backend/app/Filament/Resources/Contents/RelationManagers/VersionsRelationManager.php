<?php

namespace App\Filament\Resources\Contents\RelationManagers;

use App\Models\User;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

/** تاریخچه‌ی نسخه‌ها (فقط خواندنی) */
class VersionsRelationManager extends RelationManager
{
    protected static string $relationship = 'versions';

    protected static ?string $title = 'تاریخچه‌ی نسخه‌ها';

    public function isReadOnly(): bool
    {
        return true;
    }

    public function table(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('version')->label('نسخه')->prefix('v'),
            TextColumn::make('note')->label('توضیح'),
            TextColumn::make('created_by')->label('توسط')->formatStateUsing(fn ($state) => User::find($state)?->name),
            TextColumn::make('created_at')->label('زمان')->since(),
        ])->defaultSort('version', 'desc');
    }
}
