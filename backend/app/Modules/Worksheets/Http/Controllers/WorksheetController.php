<?php

namespace App\Modules\Worksheets\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Enums\ContentType;
use App\Modules\Catalog\Models\Content;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Shared\Http\Paginated;
use App\Modules\Subscriptions\Support\Entitlements;
use App\Modules\Worksheets\Http\Resources\WorksheetResource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorksheetController extends Controller
{
    private function query(): Builder
    {
        return Content::published()->ofType(ContentType::Worksheet)->with(['worksheet', 'skills', 'ageGroups']);
    }

    private function find(string $slug): Content
    {
        return $this->query()->where('slug', $slug)->firstOrFail();
    }

    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'age' => ['nullable', 'integer', 'between:1,12'],
            'difficulty' => ['nullable', 'in:beginner,easy,intermediate,advanced'],
            'access' => ['nullable', 'in:free,premium'],
            'template' => ['nullable', 'string', 'max:32'],
            'perPage' => ['nullable', 'integer', 'between:1,60'],
        ]);

        $page = $this->query()
            ->filter($request->only(['q', 'age', 'difficulty', 'access', 'categoryId', 'category']))
            ->when($request->input('template'), fn ($q, $t) => $q->whereHas('worksheet', fn ($w) => $w->where('template', $t)))
            ->orderBy('sort_order')->orderByDesc('published_at')
            ->paginate($request->integer('perPage', 24));

        return Paginated::response($page, WorksheetResource::class);
    }

    public function show(string $slug): WorksheetResource
    {
        return WorksheetResource::make($this->find($slug));
    }

    /** داده‌ی لازم برای رندر پیش‌نمایش (Template + Params) – رایگان برای همه، حتی محتوای ویژه */
    public function preview(string $slug): JsonResponse
    {
        $content = $this->find($slug);

        return response()->json([
            'template' => $content->worksheet->template,
            'params' => (object) $content->worksheet->params,
            'paperSize' => $content->worksheet->paper_size,
            'orientation' => $content->worksheet->orientation,
            'watermark' => $content->isPremium(),
        ])->setPublic()->setMaxAge(600);
    }

    /**
     * ثبت دانلود/چاپ. محتوای ویژه نیازمند اشتراک است.
     * اگر فایل PDF آماده در Object Storage باشد، آدرس امضاشده‌ی موقت برگردانده می‌شود؛
     * در غیر این صورت کلاینت از Template رندر می‌کند.
     */
    public function download(Request $request, string $slug, Entitlements $entitlements): JsonResponse
    {
        $request->validate(['format' => ['nullable', 'in:pdf,png,svg,print'], 'childId' => ['nullable', 'integer']]);
        $content = $this->find($slug);
        $user = $request->user('sanctum');

        if ($content->isPremium()) {
            abort_unless($user, 401, 'برای دانلود این کاربرگ وارد شوید.');
            abort_unless($entitlements->for($user)->canAccessPremium(), 402, 'این کاربرگ مخصوص اشتراک خانواده است.');
        }

        $childId = null;
        if ($user && $request->filled('childId')) {
            $child = ChildProfile::active()->whereKey($request->integer('childId'))->where('parent_user_id', $user->id)->first();
            $childId = $child?->id;
        }

        $worksheet = $content->worksheet;
        $worksheet->increment('download_count');
        $worksheet->downloads()->create([
            'user_id' => $user?->id,
            'child_id' => $childId,
            'format' => $request->input('format', 'pdf'),
            'downloaded_at' => now(),
        ]);

        return response()->json([
            'fileUrl' => $worksheet->file?->temporaryUrl(),
            'template' => $worksheet->template,
            'params' => (object) $worksheet->params,
            'downloadCount' => $worksheet->download_count,
        ]);
    }
}
