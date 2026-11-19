<?php

namespace App\Modules\Parent;

use App\Modules\Parent\Pdf\ChromiumRenderer;
use App\Modules\Parent\Pdf\GotenbergRenderer;
use App\Modules\Parent\Pdf\HtmlOnlyRenderer;
use App\Modules\Parent\Pdf\PdfRenderer;
use App\Modules\Shared\ModuleServiceProvider;
use RuntimeException;

class ParentServiceProvider extends ModuleServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PdfRenderer::class, fn () => match (config('kidsworld.reports.driver')) {
            'chromium' => new ChromiumRenderer((string) config('kidsworld.reports.chromium_path')),
            'gotenberg' => new GotenbergRenderer((string) config('kidsworld.reports.gotenberg_url')),
            'html' => new HtmlOnlyRenderer,
            default => throw new RuntimeException('Unknown REPORTS_PDF_DRIVER.'),
        });
    }

    protected function bootModule(): void
    {
        $this->loadViewsFrom($this->moduleDir().'/resources/views', 'parent');
    }
}
