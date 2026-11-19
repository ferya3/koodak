<?php

namespace App\Modules\Children\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Children\Http\Resources\ChildResource;
use App\Modules\Children\Http\Resources\SettingsResource;
use App\Modules\Children\Models\ChildProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

/**
 * «کی داره بازی می‌کنه؟» – والد روی دستگاه، برای کودک یک توکن محدود صادر می‌کند.
 * کودک رمز ندارد؛ توکن فقط به داده‌های همان کودک دسترسی دارد و کوتاه‌عمر است.
 */
class ChildSessionController extends Controller
{
    public function store(ChildProfile $child): JsonResponse
    {
        Gate::authorize('view', $child);

        $token = $child->parent->createToken(
            "child:{$child->id}",
            ['child', "child:{$child->id}"],
            now()->addMinutes(config('kidsworld.children.session_token_ttl')),
        );

        return response()->json([
            'token' => $token->plainTextToken,
            'expiresAt' => $token->accessToken->expires_at?->toIso8601String(),
            'child' => ChildResource::make($child->load('preferences')),
            'settings' => SettingsResource::make($child->settings()->firstOrCreate([], ['parent_user_id' => $child->parent_user_id])),
        ], 201);
    }
}
