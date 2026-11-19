<?php

namespace App\Modules\Children\Models;

use Illuminate\Database\Eloquent\Model;

/** ثبت رضایت والد (نسخه‌ی سیاست، زمان، IP) – الزام COPPA / GDPR-K */
class ParentalConsent extends Model
{
    public const CURRENT_POLICY_VERSION = '1.2';

    protected $fillable = ['parent_user_id', 'child_id', 'policy_version', 'scope', 'consented_at', 'revoked_at', 'ip_address', 'user_agent'];

    protected function casts(): array
    {
        return ['consented_at' => 'datetime', 'revoked_at' => 'datetime'];
    }
}
