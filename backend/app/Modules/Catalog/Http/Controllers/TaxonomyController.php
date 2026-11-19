<?php

namespace App\Modules\Catalog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Models\AgeGroup;
use App\Modules\Catalog\Models\Skill;
use Illuminate\Http\JsonResponse;

class TaxonomyController extends Controller
{
    public function ageGroups(): JsonResponse
    {
        return response()->json(['data' => AgeGroup::orderBy('min_age')->get()->map(fn ($g) => [
            'id' => (string) $g->id, 'title' => $g->title, 'minAge' => $g->min_age, 'maxAge' => $g->max_age,
        ])]);
    }

    public function skills(): JsonResponse
    {
        return response()->json(['data' => Skill::orderBy('id')->get()->map(fn ($s) => [
            'id' => (string) $s->id, 'slug' => $s->slug, 'title' => $s->title, 'category' => $s->skill_category,
        ])]);
    }
}
