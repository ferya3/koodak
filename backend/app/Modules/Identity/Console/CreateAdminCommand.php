<?php

namespace App\Modules\Identity\Console;

use App\Models\User;
use App\Modules\Identity\Models\Role;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

/** ساخت یا به‌روزرسانی حساب مدیر پنل: php artisan kidsworld:admin admin@example.com */
class CreateAdminCommand extends Command
{
    protected $signature = 'kidsworld:admin {email} {--name=مدیر سامانه} {--password= : در صورت خالی بودن، رمز تصادفی ساخته و نمایش داده می‌شود}';

    protected $description = 'Create or update an admin user for the Filament panel';

    public function handle(): int
    {
        $password = $this->option('password') ?: Str::password(16, symbols: false);
        $user = User::updateOrCreate(
            ['email' => strtolower($this->argument('email'))],
            ['name' => $this->option('name'), 'password' => $password, 'email_verified_at' => now(), 'status' => 'active'],
        )->assignRole(Role::ADMIN);

        $this->line("email: {$user->email}");
        if (! $this->option('password')) {
            $this->line("password: {$password}");
        }

        return self::SUCCESS;
    }
}
