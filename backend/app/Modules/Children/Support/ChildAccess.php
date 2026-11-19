<?php

namespace App\Modules\Children\Support;

use App\Modules\Children\Models\ChildProfile;
use Illuminate\Http\Request;

/**
 * دسترسی به داده‌های یک کودک از دو مسیر ممکن است:
 *  ۱) توکن والد (ability: parent) + مالکیت کودک
 *  ۲) توکن جلسه‌ی کودک (ability: child:{id}) – فقط برای همان کودک
 */
final class ChildAccess
{
    public static function authorize(Request $request, ChildProfile $child): void
    {
        abort_unless(self::allows($request, $child), 403, 'به اطلاعات این کودک دسترسی ندارید.');
    }

    public static function allows(Request $request, ChildProfile $child): bool
    {
        $user = $request->user();
        if (! $user || $child->parent_user_id !== $user->id) {
            return false;
        }

        $token = $user->currentAccessToken();

        // توکن‌های موقت (TransientToken) = نشست وب (مثلاً پنل) → دسترسی والد
        if (! method_exists($token, 'can')) {
            return true;
        }

        return $token->can('parent') || $token->can("child:{$child->id}");
    }

    /** آیا درخواست با توکن والد آمده؟ (برای عملیات حساس مثل حذف یا تغییر تنظیمات) */
    public static function isParent(Request $request): bool
    {
        $token = $request->user()?->currentAccessToken();

        return $token && (! method_exists($token, 'can') || $token->can('parent'));
    }
}
