<?php

namespace App\Modules\Parent\Jobs;

use App\Modules\Parent\Models\Report;
use App\Modules\Parent\Support\DashboardBuilder;
use App\Modules\Progress\Models\ActivityAttempt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Throwable;

/**
 * ساخت گزارش در صف (عملیات سنگین هرگز در درخواست HTTP انجام نمی‌شود).
 * خروجی فعلی: سند HTML آماده‌ی چاپ (راست‌به‌چپ). تبدیل به PDF با Chromium/Gotenberg
 * در همین Job قابل افزودن است بدون تغییر API.
 */
class GenerateChildReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public Report $report) {}

    public function handle(DashboardBuilder $builder): void
    {
        $report = $this->report->load('child.parent');
        $data = $builder->build($report->child);
        $activities = ActivityAttempt::where('child_id', $report->child_id)
            ->whereBetween('started_at', [$report->period_start->copy()->startOfDay(), $report->period_end->copy()->endOfDay()])
            ->orderBy('started_at')->get();

        $html = view('parent::report', ['report' => $report, 'data' => $data, 'activities' => $activities])->render();
        $path = "reports/{$report->parent_user_id}/report-{$report->id}.html";
        Storage::disk($report->storage_disk)->put($path, $html);

        $report->update(['status' => 'ready', 'storage_path' => $path, 'generated_at' => now()]);
    }

    public function failed(?Throwable $e): void
    {
        $this->report->update(['status' => 'failed']);
    }
}
