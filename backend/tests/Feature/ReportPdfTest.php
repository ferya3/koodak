<?php

namespace Tests\Feature;

use App\Modules\Parent\Models\Report;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ReportPdfTest extends TestCase
{
    private function generate(): array
    {
        $parent = $this->parent();
        $child = $this->child($parent);
        $t = $this->parentToken($parent);
        $this->postJson("/api/v1/children/{$child->id}/activities", ['type' => 'drawing', 'durationSeconds' => 600], $this->bearer($t));
        $id = $this->postJson('/api/v1/parent/reports/generate', ['childId' => $child->id], $this->bearer($t))->assertStatus(202)->json('data.id');

        return [$t, Report::findOrFail($id)];
    }

    public function test_gotenberg_driver_stores_a_pdf(): void
    {
        Storage::fake('local');
        config(['kidsworld.reports.driver' => 'gotenberg', 'kidsworld.reports.gotenberg_url' => 'http://gotenberg:3000']);
        Http::fake(['gotenberg:3000/forms/chromium/convert/html' => Http::response('%PDF-1.7 fake', 200, ['Content-Type' => 'application/pdf'])]);

        [$t, $report] = $this->generate();
        $this->assertSame('pdf', $report->format);
        Http::assertSent(fn ($r) => str_contains($r->body(), 'dir="rtl"') && str_contains($r->body(), 'font/woff2;base64'));

        $res = $this->get("/api/v1/parent/reports/{$report->id}/download", $this->bearer($t))->assertOk();
        $this->assertSame('application/pdf', $res->headers->get('Content-Type'));
    }

    public function test_failed_conversion_marks_report_failed(): void
    {
        config(['kidsworld.reports.driver' => 'gotenberg']);
        Http::fake(['*' => Http::response('boom', 500)]);
        $parent = $this->parent();
        $child = $this->child($parent);

        // در تست، صف sync است: خطا به درخواست برمی‌گردد؛ در Production همین Job پس از ۳ تلاش failed() را صدا می‌زند
        $this->postJson('/api/v1/parent/reports/generate', ['childId' => $child->id], $this->bearer($this->parentToken($parent)))->assertServerError();
        $this->assertSame('failed', Report::where('child_id', $child->id)->sole()->status);
    }

    /** تبدیل واقعی با Chromium محلی (اگر روی این ماشین نصب باشد) */
    public function test_chromium_driver_renders_real_pdf(): void
    {
        $bin = collect([env('REPORTS_CHROMIUM_PATH'), '/opt/pw-browsers/chromium/chrome-linux64/chrome', '/usr/bin/chromium', '/usr/bin/google-chrome'])
            ->filter()->first(fn ($p) => is_executable($p));
        if (! $bin) {
            $this->markTestSkipped('Chromium is not installed.');
        }
        Storage::fake('local');
        config(['kidsworld.reports.driver' => 'chromium', 'kidsworld.reports.chromium_path' => $bin]);

        [, $report] = $this->generate();
        $this->assertSame('pdf', $report->format);
        $bytes = Storage::disk('local')->get($report->storage_path);
        $this->assertStringStartsWith('%PDF', $bytes);
        $this->assertGreaterThan(10_000, strlen($bytes));
    }
}
