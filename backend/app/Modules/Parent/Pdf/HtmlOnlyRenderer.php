<?php

namespace App\Modules\Parent\Pdf;

class HtmlOnlyRenderer implements PdfRenderer
{
    public function render(string $html): ?string
    {
        return null;
    }
}
