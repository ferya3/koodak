<?php

namespace App\Modules\Stories\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Enums\ContentType;
use App\Modules\Catalog\Models\Content;
use App\Modules\Shared\Http\Paginated;
use App\Modules\Stories\Http\Resources\StoryResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StoryController extends Controller
{
    private function query(): Builder
    {
        return Content::published()->ofType(ContentType::Story)
            ->with(['story.audio', 'story.chapters.choices', 'story.chapters.image', 'story.chapters.audio', 'skills', 'ageGroups']);
    }

    public function index(Request $request): JsonResponse
    {
        $page = $this->query()
            ->filter($request->only(['q', 'age', 'difficulty', 'access', 'categoryId', 'category']))
            ->when($request->input('storyType'), fn ($q, $t) => $q->whereHas('story', fn ($s) => $s->where('story_type', $t)))
            ->orderBy('sort_order')->orderByDesc('published_at')
            ->paginate(min($request->integer('perPage', 24), 60));

        return Paginated::response($page, StoryResource::class);
    }

    public function show(string $slug): StoryResource
    {
        return StoryResource::make($this->query()->where('slug', $slug)->firstOrFail());
    }

    public function chapters(string $slug): JsonResponse
    {
        $story = StoryResource::make($this->query()->where('slug', $slug)->firstOrFail())->resolve();

        return response()->json(['data' => $story['chapters']]);
    }
}
