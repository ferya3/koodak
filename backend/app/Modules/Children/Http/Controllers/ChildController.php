<?php

namespace App\Modules\Children\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Children\Http\Requests\StoreChildRequest;
use App\Modules\Children\Http\Resources\ChildResource;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Children\Models\ParentalConsent;
use App\Modules\Subscriptions\Support\Entitlements;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ChildController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return ChildResource::collection(
            $request->user()->children()->active()->with('preferences')->orderBy('id')->get()
        );
    }

    public function store(StoreChildRequest $request, Entitlements $entitlements): JsonResponse
    {
        $user = $request->user();
        $limit = $entitlements->for($user)->maxChildren();
        abort_if($user->children()->active()->count() >= $limit, 422, "در اشتراک فعلی حداکثر {$limit} پروفایل کودک مجاز است.");

        $child = DB::transaction(function () use ($request, $user) {
            $data = $request->validated();
            $child = $user->children()->create([
                'display_name' => $data['display_name'],
                'birth_year_month' => $data['birth_year_month'],
                'avatar' => $data['avatar'],
                'preferred_language' => $data['preferred_language'] ?? $user->locale,
            ]);
            $child->preferences()->create(['favorite_categories' => $data['favorite_category_ids'] ?? []]);
            $child->settings()->create(['parent_user_id' => $user->id, 'daily_limit_minutes' => $child->age() <= 4 ? 30 : 45]);
            ParentalConsent::create([
                'parent_user_id' => $user->id,
                'child_id' => $child->id,
                'policy_version' => ParentalConsent::CURRENT_POLICY_VERSION,
                'consented_at' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => substr((string) $request->userAgent(), 0, 255),
            ]);

            return $child;
        });

        return ChildResource::make($child->load('preferences'))->response()->setStatusCode(201);
    }

    public function show(ChildProfile $child): ChildResource
    {
        Gate::authorize('view', $child);

        return ChildResource::make($child->load('preferences'));
    }

    public function update(StoreChildRequest $request, ChildProfile $child): ChildResource
    {
        Gate::authorize('update', $child);
        $data = $request->validated();
        $child->update(collect($data)->only(['display_name', 'birth_year_month', 'avatar', 'preferred_language'])->all());
        if (array_key_exists('favorite_category_ids', $data)) {
            $child->preferences()->updateOrCreate([], ['favorite_categories' => $data['favorite_category_ids']]);
        }

        return ChildResource::make($child->refresh()->load('preferences'));
    }

    /**
     * حذف به درخواست والد: پروفایل فوراً از دسترس خارج می‌شود و پس از مهلت
     * (پیش‌فرض ۳۰ روز) همه‌ی داده‌ها به‌صورت دائمی پاک می‌شوند (children:purge).
     */
    public function destroy(ChildProfile $child): JsonResponse
    {
        Gate::authorize('delete', $child);
        $child->update([
            'status' => 'pending_deletion',
            'deletion_scheduled_at' => now()->addDays(config('kidsworld.children.deletion_grace_days')),
        ]);
        $child->consents()->whereNull('revoked_at')->update(['revoked_at' => now()]);

        return response()->json([
            'message' => 'درخواست حذف ثبت شد.',
            'deletionScheduledAt' => $child->deletion_scheduled_at->toIso8601String(),
        ], 202);
    }
}
