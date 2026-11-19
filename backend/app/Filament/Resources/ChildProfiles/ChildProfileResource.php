<?php

namespace App\Filament\Resources\ChildProfiles;

use App\Filament\Resources\ChildProfiles\Pages\ManageChildProfiles;
use App\Modules\Children\Models\ChildProfile;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

/**
 * نمای فقط‌خواندنی و حداقلی از پروفایل کودکان برای پشتیبانی.
 * عمداً امکان ویرایش ندارد؛ هر تغییری فقط توسط والد انجام می‌شود.
 */
class ChildProfileResource extends Resource
{
    protected static ?string $model = ChildProfile::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedFaceSmile;

    protected static string|\UnitEnum|null $navigationGroup = 'کاربران';

    protected static ?string $modelLabel = 'پروفایل کودک';

    protected static ?string $pluralModelLabel = 'پروفایل کودکان';

    public static function canViewAny(): bool
    {
        return (bool) auth()->user()?->hasRole('admin');
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('display_name')->label('نام نمایشی'),
                TextColumn::make('age')->label('سن')->state(fn ($record) => $record->age()),
                TextColumn::make('parent.email')->label('والد')->searchable(),
                TextColumn::make('status')->label('وضعیت')->badge()
                    ->color(fn ($state) => $state === 'active' ? 'success' : 'danger'),
                TextColumn::make('deletion_scheduled_at')->label('حذف دائمی')->since()->placeholder('—'),
                TextColumn::make('created_at')->label('ایجاد')->since(),
            ])
            ->filters([SelectFilter::make('status')->label('وضعیت')->options(['active' => 'فعال', 'pending_deletion' => 'در انتظار حذف'])]);
    }

    public static function getPages(): array
    {
        return ['index' => ManageChildProfiles::route('/')];
    }
}
