<?php

namespace App\Modules\Parent\Jobs;

use App\Modules\Parent\Models\Report;
use App\Modules\Parent\Pdf\PdfRenderer;
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
 * HTML راست‌به‌چپ با فونت جاسازی‌شده ساخته و با PdfRenderer به PDF تبدیل می‌شود
 * (درایور html = ذخیره‌ی همان HTML آماده‌ی چاپ).
 */
class GenerateChildReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;

    public function __construct(public Report $report) {}

    public int $timeout = 120;

    public function handle(DashboardBuilder $builder, PdfRenderer $pdf): void
    {
        $report = $this->report->load('child.parent');
        $data = $builder->build($report->child);
        $activities = ActivityAttempt::where('child_id', $report->child_id)
            ->whereBetween('started_at', [$report->period_start->copy()->startOfDay(), $report->period_end->copy()->endOfDay()])
            ->orderBy('started_at')->get();

        $font = base64_encode((string) file_get_contents(resource_path('fonts/Vazirmatn.woff2')));
        $html = view('parent::report', ['report' => $report, 'data' => $data, 'activities' => $activities, 'font' => $font])->render();

        $bytes = $pdf->render($html);
        $format = $bytes === null ? 'html' : 'pdf';
        $path = "reports/{$report->parent_user_id}/report-{$report->id}.{$format}";
        Storage::disk($report->storage_disk)->put($path, $bytes ?? $html);

        $report->update(['status' => 'ready', 'format' => $format, 'storage_path' => $path, 'generated_at' => now()]);
    }

    public function failed(?Throwable $e): void
    {
        $this->report->update(['status' => 'failed']);
    }
}
