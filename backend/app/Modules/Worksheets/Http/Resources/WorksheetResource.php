<?php

namespace App\Modules\Worksheets\Http\Resources;

use App\Modules\Catalog\Http\Resources\ContentResource;
use Illuminate\Http\Request;

/** آینه‌ی Worksheet در @kidsworld/types */
class WorksheetResource extends ContentResource
{
    public function toArray(Request $request): array
    {
        $w = $this->worksheet;

        return [
            ...parent::toArray($request),
            'template' => $w->template,
            'params' => (object) $w->params,
            'pageCount' => $w->page_count,
            'paperSize' => $w->paper_size,
            'orientation' => $w->orientation,
            'downloadCount' => $w->download_count,
            // کاربرگ آماده: مشخصات فایل (آدرس فایل فقط از مسیر /file با بررسی دسترسی)
            'file' => $w->isUpload() && $w->file ? [
                'name' => $w->file->original_name,
                'mime' => $w->file->mime_type,
                'size' => (int) $w->file->file_size,
            ] : null,
            'hasPreview' => $w->isUpload() && ($w->preview_asset_id !== null || str_starts_with((string) $w->file?->mime_type, 'image/')),
        ];
    }
}
