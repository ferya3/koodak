<?php

namespace App\Modules\Children\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Children\Http\Requests\UpdateSettingsRequest;
use App\Modules\Children\Http\Resources\SettingsResource;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Children\Support\ChildAccess;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ChildSettingsController extends Controller
{
    /** کودک هم می‌تواند تنظیمات خودش را بخواند (برای اعمال سقف زمان و صدا) */
    public function show(Request $request, ChildProfile $child): SettingsResource
    {
        ChildAccess::authorize($request, $child);

        return SettingsResource::make($child->settings()->firstOrCreate([], ['parent_user_id' => $child->parent_user_id]));
    }

    /** تغییر تنظیمات فقط با توکن والد */
    public function update(UpdateSettingsRequest $request, ChildProfile $child): SettingsResource
    {
        Gate::authorize('update', $child);
        abort_unless(ChildAccess::isParent($request), 403);

        $data = $request->validated();
        $settings = $child->settings()->firstOrCreate([], ['parent_user_id' => $child->parent_user_id]);
        $settings->fill(collect($data)->except('bedtime_lock')->all());
        if (isset($data['bedtime_lock'])) {
            $b = $data['bedtime_lock'];
            $settings->fill(array_filter([
                'bedtime_lock_enabled' => $b['enabled'] ?? null,
                'bedtime_from' => $b['from'] ?? null,
                'bedtime_to' => $b['to'] ?? null,
            ], fn ($v) => $v !== null));
        }
        $settings->save();

        return SettingsResource::make($settings);
    }
}
