<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('name')->label('نام')->searchable(),
                TextColumn::make('email')->label('ایمیل')->searchable(),
                TextColumn::make('roles.name')->label('نقش')->badge(),
                TextColumn::make('children_count')->label('فرزندان')->counts('children'),
                TextColumn::make('status')->label('وضعیت')->badge()->color(fn ($state) => $state === 'active' ? 'success' : 'danger'),
                TextColumn::make('created_at')->label('عضویت')->since()->sortable(),
            ])
            ->filters([SelectFilter::make('roles')->label('نقش')->relationship('roles', 'name')])
            ->recordActions([EditAction::make()]);
    }
}
