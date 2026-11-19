<?php

namespace App\Modules\Parent\Pdf;

use Illuminate\Support\Str;
use Symfony\Component\Process\Process;

/** Chromium headless: ‎--print-to-pdf‎ ؛ شبکه برای صفحه لازم نیست چون فونت داخل HTML جاسازی شده است */
class ChromiumRenderer implements PdfRenderer
{
    public function __construct(private readonly string $binary, private readonly int $timeout = 60) {}

    public function render(string $html): ?string
    {
        $dir = sys_get_temp_dir().'/kw-pdf-'.Str::random(12);
        mkdir($dir, 0700);
        $in = "$dir/report.html";
        $out = "$dir/report.pdf";
        file_put_contents($in, $html);

        try {
            $process = new Process([
                $this->binary, '--headless', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
                '--no-pdf-header-footer', '--hide-scrollbars', '--no-first-run',
                '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', "--user-data-dir=$dir/profile",
                "--print-to-pdf=$out", "file://$in",
            ]);
            $process->setTimeout($this->timeout)->run();

            if (! is_file($out) || filesize($out) === 0) {
                throw new PdfRenderException('Chromium could not render the report: '.Str::limit($process->getErrorOutput(), 500));
            }

            return file_get_contents($out);
        } finally {
            @exec('rm -rf '.escapeshellarg($dir));
        }
    }
}
