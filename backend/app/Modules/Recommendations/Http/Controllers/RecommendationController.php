<?php

namespace App\Modules\Recommendations\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Children\Support\ChildAccess;
use App\Modules\Recommendations\Support\ContentPresenter;
use App\Modules\Recommendations\Support\RecommendationEngine;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function __invoke(Request $request, ChildProfile $child, RecommendationEngine $engine): JsonResponse
    {
        ChildAccess::authorize($request, $child);
        $data = $request->validate(['limit' => ['nullable', 'integer', 'between:1,12'], 'types' => ['nullable', 'array'], 'types.*' => ['in:game,story,worksheet,lesson']]);

        return response()->json(['data' => $engine->for($child->load(['preferences', 'settings', 'parent']), $data['limit'] ?? 4, $data['types'] ?? null)
            ->map(fn ($r) => ['content' => ContentPresenter::make($r['content'])->resolve(), 'score' => $r['score'], 'reason' => $r['reason']])]);
    }
}
