<?php

namespace App\Modules\Catalog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Http\Resources\CategoryResource;
use App\Modules\Catalog\Http\Resources\ContentResource;
use App\Modules\Catalog\Models\Category;
use App\Modules\Catalog\Models\Content;
use App\Modules\Shared\Http\Paginated;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $categories = Cache::remember('catalog:categories:'.app()->getLocale(), 600, fn () => Category::active()
            ->whereNull('parent_id')->with(['children', 'subjects'])->orderBy('sort_order')->get());

        return CategoryResource::collection($categories);
    }

    public function show(Category $category): CategoryResource
    {
        abort_unless($category->status === 'active', 404);

        return CategoryResource::make($category->load(['children', 'subjects']));
    }

    public function contents(Request $request, Category $category): JsonResponse
    {
        $ids = $category->children()->pluck('id')->push($category->id);
        $page = Content::published()->whereIn('category_id', $ids)
            ->filter($request->only(['q', 'age', 'difficulty', 'access']))
            ->with(['skills', 'ageGroups'])
            ->orderBy('sort_order')->orderByDesc('published_at')
            ->paginate(min((int) $request->integer('perPage', 24), 60));

        return Paginated::response($page, ContentResource::class);
    }
}
