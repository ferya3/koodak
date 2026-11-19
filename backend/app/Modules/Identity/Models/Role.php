<?php

namespace App\Modules\Identity\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * نقش‌ها: parent (والد) · teacher (مربی) · editor (کارشناس محتوا) · admin (مدیر)
 */
class Role extends Model
{
    public const PARENT = 'parent';

    public const TEACHER = 'teacher';

    public const EDITOR = 'editor';

    public const ADMIN = 'admin';

    protected $fillable = ['name', 'guard_name'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}
