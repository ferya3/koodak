<?php

namespace App\Models;

use App\Modules\Children\Models\ChildProfile;
use App\Modules\Identity\Models\Role;
use App\Modules\Subscriptions\Models\Subscription;
use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'phone', 'password', 'status', 'locale', 'timezone'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole(string ...$names): bool
    {
        return $this->roles->whereIn('name', $names)->isNotEmpty();
    }

    public function assignRole(string $name): static
    {
        $role = Role::firstOrCreate(['name' => $name]);
        $this->roles()->syncWithoutDetaching([$role->id]);
        $this->unsetRelation('roles');

        return $this;
    }

    public function children(): HasMany
    {
        return $this->hasMany(ChildProfile::class, 'parent_user_id');
    }

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function activeSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->ofMany(
            ['starts_at' => 'max'],
            fn ($q) => $q->where('status', 'active')->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now())),
        );
    }

    /** فقط مدیران و کارشناسان محتوا به پنل Filament دسترسی دارند */
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->status === 'active' && $this->hasRole(Role::ADMIN, Role::EDITOR);
    }
}
