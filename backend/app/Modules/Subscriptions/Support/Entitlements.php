<?php

namespace App\Modules\Subscriptions\Support;

use App\Models\User;
use App\Modules\Subscriptions\Models\Plan;

/**
 * «چه چیزی برای این کاربر مجاز است؟» – تنها نقطه‌ای که ماژول‌های دیگر درباره‌ی اشتراک می‌پرسند.
 * محدودیت‌ها از ستون limits پلن خوانده می‌شوند (قابل تغییر از CMS).
 * اگر ماژول اشتراک غیرفعال باشد، همه‌چیز آزاد است.
 */
class Entitlements
{
    private const FREE_DEFAULTS = ['max_children' => 1, 'premium_content' => false];

    private array $limits = self::FREE_DEFAULTS;

    private bool $unrestricted = false;

    public function for(User $user): static
    {
        $clone = clone $this;

        if (! config('kidsworld.features.subscriptions')) {
            $clone->unrestricted = true;

            return $clone;
        }

        $plan = $user->activeSubscription?->plan ?? Plan::where('slug', 'free')->first();
        $clone->limits = array_merge(self::FREE_DEFAULTS, $plan?->limits ?? []);

        return $clone;
    }

    public function maxChildren(): int
    {
        return $this->unrestricted
            ? (int) config('kidsworld.children.max_per_parent')
            : min((int) $this->limits['max_children'], (int) config('kidsworld.children.max_per_parent'));
    }

    public function canAccessPremium(): bool
    {
        return $this->unrestricted || (bool) $this->limits['premium_content'];
    }
}
