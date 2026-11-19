<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Illuminate\Support\Facades\Hash;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->label('نام')->required(),
            TextInput::make('email')->label('ایمیل')->email()->required()->unique(ignoreRecord: true),
            TextInput::make('phone')->label('موبایل')->tel()->unique(ignoreRecord: true),
            Select::make('status')->label('وضعیت')->options(['active' => 'فعال', 'suspended' => 'مسدود'])->default('active')->required(),
            Select::make('roles')->label('نقش‌ها')->relationship('roles', 'name')->multiple()->preload(),
            TextInput::make('password')->label('رمز عبور')->password()->revealable()
                ->dehydrated(fn ($state) => filled($state))->required(fn (string $operation) => $operation === 'create')
                ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                ->helperText('برای تغییر ندادن، خالی بگذارید.'),
        ])->columns(2);
    }
}
