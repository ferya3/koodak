<?php

namespace App\Modules\Children\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Children\Contracts\ChildDataSection;
use App\Modules\Children\Http\Resources\ChildResource;
use App\Modules\Children\Http\Resources\SettingsResource;
use App\Modules\Children\Models\ChildProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

/** حق دسترسی والد به داده‌ها: خروجی کامل JSON از همه‌ی ماژول‌ها */
class ChildDataExportController extends Controller
{
    public function __invoke(ChildProfile $child): JsonResponse
    {
        Gate::authorize('view', $child);

        $sections = collect(app()->tagged('child-data-sections'))
            ->mapWithKeys(fn (ChildDataSection $s) => [$s->key() => $s->export($child)]);

        return response()->json([
            'exportedAt' => now()->toIso8601String(),
            'profile' => ChildResource::make($child->load('preferences'))->resolve(),
            'settings' => $child->settings ? SettingsResource::make($child->settings)->resolve() : null,
            'consents' => $child->consents()->get(['policy_version', 'scope', 'consented_at', 'revoked_at'])->toArray(),
            ...$sections->all(),
        ])->header('Content-Disposition', "attachment; filename=kidsworld-child-{$child->id}.json");
    }
}
