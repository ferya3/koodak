<?php

namespace App\Filament\Resources\Contents\Tables;

use App\Modules\Catalog\Enums\ContentStatus;
use App\Modules\Catalog\Enums\ContentType;
use App\Modules\Catalog\Models\Category;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ContentsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('updated_at', 'desc')
            ->columns([
                TextColumn::make('title')->label('عنوان')->searchable()->limit(40)->description(fn ($record) => $record->slug),
                TextColumn::make('content_type')->label('نوع')->badge(),
                TextColumn::make('category.title')->label('دنیا')->toggleable(),
                TextColumn::make('age_range')->label('سن')->state(fn ($record) => "{$record->min_age}–{$record->max_age}"),
                TextColumn::make('difficulty')->label('سطح')->badge()->color('gray'),
                TextColumn::make('access_level')->label('دسترسی')->badge()
                    ->formatStateUsing(fn ($state) => $state === 'premium' ? 'ویژه' : 'رایگان')
                    ->color(fn ($state) => $state === 'premium' ? 'warning' : 'success'),
                TextColumn::make('status')->label('وضعیت')->badge(),
                IconColumn::make('ai_generated')->label('AI')->boolean()->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('published_at')->label('انتشار')->since()->sortable(),
                TextColumn::make('updated_at')->label('آخرین ویرایش')->since()->sortable()->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('content_type')->label('نوع')->options(ContentType::class),
                SelectFilter::make('status')->label('وضعیت')->options(ContentStatus::class),
                SelectFilter::make('category_id')->label('دنیا')->options(fn () => Category::pluck('title', 'id')),
                SelectFilter::make('access_level')->label('دسترسی')->options(['free' => 'رایگان', 'premium' => 'ویژه']),
                TrashedFilter::make(),
            ])
            ->recordActions([EditAction::make()])
            ->toolbarActions([
                BulkActionGroup::make([DeleteBulkAction::make(), ForceDeleteBulkAction::make(), RestoreBulkAction::make()]),
            ]);
    }
}
