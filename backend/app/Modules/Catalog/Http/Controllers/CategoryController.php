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
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * فقط آرایه‌ی ساده کش می‌شود، نه مدل Eloquent: با cache.serializable_classes = false
     * (پیش‌فرض امن Laravel) شیءها از کش به‌صورت __PHP_Incomplete_Class برمی‌گشتند و
     * از درخواست دوم به بعد خطای ۵۰۰ می‌دادند.
     */
    public function index(Request $request): JsonResponse
    {
        // رفت‌وبرگشت JSON تا لایه‌های تو در تو (children، subjects) هم آرایه‌ی خالص شوند
        $data = Cache::remember('catalog:categories:v3:'.app()->getLocale(), 600, fn () => json_decode(json_encode(CategoryResource::collection(
            Category::active()->whereNull('parent_id')->with(['children', 'subjects'])->orderBy('sort_order')->get()
        )->resolve($request)), true));

        return response()->json(['data' => $data]);
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
