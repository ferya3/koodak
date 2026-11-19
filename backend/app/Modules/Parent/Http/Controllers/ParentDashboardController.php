<?php

namespace App\Modules\Parent\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Children\Http\Resources\ChildResource;
use App\Modules\Parent\Jobs\GenerateChildReport;
use App\Modules\Parent\Models\Report;
use App\Modules\Parent\Support\DashboardBuilder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ParentDashboardController extends Controller
{
    public function dashboard(Request $request, DashboardBuilder $builder): JsonResponse
    {
        $request->validate(['childId' => ['nullable', 'integer']]);
        $children = $request->user()->children()->active()->with(['preferences', 'settings'])->orderBy('id')->get();
        $child = $request->filled('childId') ? $children->firstWhere('id', $request->integer('childId')) : $children->first();
        abort_if($request->filled('childId') && ! $child, 404);

        return response()->json([
            'children' => ChildResource::collection($children)->resolve(),
            'selected' => $child ? $builder->build($child) : null,
        ]);
    }

    public function reports(Request $request): JsonResponse
    {
        $request->validate(['childId' => ['nullable', 'integer']]);

        return response()->json(['data' => Report::where('parent_user_id', $request->user()->id)
            ->when($request->integer('childId'), fn ($q, $id) => $q->where('child_id', $id))
            ->latest('period_end')->limit(50)->get()->map->toApi()]);
    }

    public function generate(Request $request): JsonResponse
    {
        $data = $request->validate([
            'childId' => ['required', 'integer'],
            'type' => ['nullable', 'in:weekly,monthly,custom'],
            'from' => ['nullable', 'date'],
            'to' => ['nullable', 'date', 'after_or_equal:from'],
        ]);
        $child = $request->user()->children()->active()->findOrFail($data['childId']);
        $type = $data['type'] ?? 'weekly';
        $to = isset($data['to']) ? Carbon::parse($data['to']) : now();
        $from = isset($data['from']) ? Carbon::parse($data['from']) : ($type === 'monthly' ? $to->copy()->subMonth() : $to->copy()->subDays(6));

        $report = Report::create([
            'parent_user_id' => $request->user()->id,
            'child_id' => $child->id,
            'report_type' => $type,
            'period_start' => $from->toDateString(),
            'period_end' => $to->toDateString(),
        ]);
        GenerateChildReport::dispatch($report);

        return response()->json(['data' => $report->refresh()->toApi()], 202);
    }

    public function download(Request $request, Report $report): StreamedResponse
    {
        abort_unless($report->parent_user_id === $request->user()->id, 403);
        abort_unless($report->status === 'ready' && $report->storage_path, 409, 'گزارش هنوز آماده نیست.');

        return Storage::disk($report->storage_disk)->download($report->storage_path, "kidsworld-report-{$report->id}.html", ['Content-Type' => 'text/html; charset=utf-8']);
    }
}
