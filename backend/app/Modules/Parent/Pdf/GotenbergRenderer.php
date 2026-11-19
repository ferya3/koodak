<?php

namespace App\Modules\Parent\Pdf;

use Illuminate\Support\Facades\Http;

/** Gotenberg (Chromium داخل Docker): POST /forms/chromium/convert/html با فایل index.html */
class GotenbergRenderer implements PdfRenderer
{
    public function __construct(private readonly string $url, private readonly int $timeout = 60) {}

    public function render(string $html): ?string
    {
        $res = Http::timeout($this->timeout)
            ->attach('files', $html, 'index.html', ['Content-Type' => 'text/html'])
            ->post(rtrim($this->url, '/').'/forms/chromium/convert/html', [
                'printBackground' => 'true',
                'preferCssPageSize' => 'true',
            ]);

        if (! $res->successful() || ! str_starts_with($res->body(), '%PDF')) {
            throw new PdfRenderException("Gotenberg failed with HTTP {$res->status()}");
        }

        return $res->body();
    }
}
