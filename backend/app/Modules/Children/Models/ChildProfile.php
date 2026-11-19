<?php

namespace App\Modules\Children\Models;

use App\Models\User;
use Database\Factories\ChildProfileFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

class ChildProfile extends Model
{
    /** @use HasFactory<ChildProfileFactory> */
    use HasFactory;

    public const AVATARS = ['fox', 'bunny', 'bear', 'cat', 'panda', 'frog'];

    protected $fillable = ['parent_user_id', 'display_name', 'birth_year_month', 'avatar', 'preferred_language', 'status', 'deletion_scheduled_at'];

    protected function casts(): array
    {
        return ['deletion_scheduled_at' => 'datetime'];
    }

    protected static function newFactory(): ChildProfileFactory
    {
        return ChildProfileFactory::new();
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'parent_user_id');
    }

    public function preferences(): HasOne
    {
        return $this->hasOne(ChildPreference::class, 'child_id');
    }

    public function settings(): HasOne
    {
        return $this->hasOne(ParentSetting::class, 'child_id');
    }

    public function consents(): HasMany
    {
        return $this->hasMany(ParentalConsent::class, 'child_id');
    }

    public function scopeActive(Builder $q): Builder
    {
        return $q->where('status', 'active');
    }

    /** سن بر حسب سال کامل، از سال و ماه تولد */
    public function age(?Carbon $at = null): int
    {
        $birth = Carbon::createFromFormat('Y-m-d', $this->birth_year_month.'-01')->startOfDay();

        return (int) $birth->diffInYears($at ?? now());
    }

    /** فقط پروفایل‌های فعال از طریق مسیرها در دسترس‌اند */
    public function resolveRouteBinding($value, $field = null): ?Model
    {
        return $this->active()->where($field ?? 'id', $value)->first();
    }
}
