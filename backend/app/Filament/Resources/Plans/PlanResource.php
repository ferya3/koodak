<?php

namespace App\Filament\Resources\Plans;

use App\Filament\Resources\Plans\Pages\ManagePlans;
use App\Modules\Subscriptions\Models\Plan;
use BackedEnum;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PlanResource extends Resource
{
    protected static ?string $model = Plan::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCreditCard;

    protected static string|\UnitEnum|null $navigationGroup = 'تجاری';

    protected static ?string $modelLabel = 'پلن اشتراک';

    protected static ?string $pluralModelLabel = 'پلن‌های اشتراک';

    public static function canViewAny(): bool
    {
        return (bool) auth()->user()?->hasRole('admin');
    }

    public static function form(Schema $schema): Schema
    {
        return $schema->components([
            Grid::make(3)->schema([
                TextInput::make('name')->label('نام')->required(),
                TextInput::make('slug')->label('نامک')->required()->unique(ignoreRecord: true),
                Select::make('audience')->label('مخاطب')->options(['family' => 'خانواده', 'school' => 'مدرسه'])->required(),
            ]),
            TextInput::make('tagline')->label('شعار')->columnSpanFull(),
            Grid::make(3)->schema([
                TextInput::make('price_monthly')->label('قیمت ماهانه (ریال)')->numeric()->required(),
                TextInput::make('price_yearly')->label('قیمت سالانه (ریال)')->numeric()->required(),
                Select::make('currency')->label('ارز')->options(['IRR' => 'ریال', 'USD' => 'دلار'])->default('IRR'),
            ]),
            TagsInput::make('features')->label('ویژگی‌های قابل نمایش')->columnSpanFull(),
            Section::make('محدودیت‌ها (منبع حقیقت دسترسی)')->schema([
                TextInput::make('limits.max_children')->label('حداکثر پروفایل کودک')->numeric()->required(),
                Toggle::make('limits.premium_content')->label('دسترسی به محتوای ویژه'),
            ])->columns(2)->columnSpanFull(),
            Grid::make(3)->schema([
                Toggle::make('highlighted')->label('برجسته'),
                Select::make('status')->label('وضعیت')->options(['active' => 'فعال', 'archived' => 'بایگانی'])->default('active'),
                TextInput::make('sort_order')->label('ترتیب')->numeric()->default(0),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table->defaultSort('sort_order')->columns([
            TextColumn::make('name')->label('نام'),
            TextColumn::make('audience')->label('مخاطب')->badge(),
            TextColumn::make('price_monthly')->label('ماهانه')->numeric(),
            TextColumn::make('limits.max_children')->label('کودک'),
            IconColumn::make('highlighted')->label('برجسته')->boolean(),
            TextColumn::make('status')->label('وضعیت')->badge(),
        ])->recordActions([EditAction::make()]);
    }

    public static function getPages(): array
    {
        return ['index' => ManagePlans::route('/')];
    }
}
