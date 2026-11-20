<?php

namespace App\Modules\Worksheets\Support;

use App\Modules\Catalog\Models\MediaAsset;
use App\Modules\Worksheets\Models\Worksheet;
use Illuminate\Support\Facades\Storage;

/**
 * پل بین فرم Filament (مسیر فایل روی دیسک) و جدول media_assets.
 * فایل‌های کاربرگ آماده روی دیسک خصوصی «local» ذخیره می‌شوند و فقط از مسیر API
 * (با بررسی اشتراک برای محتوای ویژه) تحویل داده می‌شوند.
 */
class WorksheetUploads
{
    public const DISK = 'local';

    public const FILE_DIR = 'worksheets/files';

    public const PREVIEW_DIR = 'worksheets/previews';

    public const FILE_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];

    /** پر کردن فرم ویرایش از روی رکوردها */
    public static function toForm(array $data): array
    {
        $data['upload_file'] = isset($data['file_asset_id']) ? MediaAsset::find($data['file_asset_id'])?->storage_path : null;
        $data['upload_preview'] = isset($data['preview_asset_id']) ? MediaAsset::find($data['preview_asset_id'])?->storage_path : null;

        return $data;
    }

    /** تبدیل مسیرهای آپلودشده به MediaAsset پیش از ذخیره‌ی رابطه‌ی worksheet */
    public static function fromForm(array $data): array
    {
        $file = $data['upload_file'] ?? null;
        $preview = $data['upload_preview'] ?? null;
        $name = $data['upload_file_name'] ?? null;
        unset($data['upload_file'], $data['upload_preview'], $data['upload_file_name']);

        if (($data['template'] ?? null) !== Worksheet::UPLOAD) {
            return $data;
        }

        $data['params'] = [];
        $fileAsset = is_string($file) ? self::asset($file, is_string($name) ? $name : null) : null;
        $data['file_asset_id'] = $fileAsset?->id;
        $data['preview_asset_id'] = is_string($preview) ? self::asset($preview)?->id : null;
        if ($fileAsset?->mime_type === 'application/pdf') {
            $data['page_count'] = max(1, self::pdfPages($fileAsset->storage_path));
        }

        return $data;
    }

    public static function asset(string $path, ?string $originalName = null): ?MediaAsset
    {
        $disk = Storage::disk(self::DISK);
        if (! $disk->exists($path)) {
            return null;
        }
        $existing = MediaAsset::where('storage_disk', self::DISK)->where('storage_path', $path)->first();
        if ($existing) {
            return $existing;
        }

        $mime = $disk->mimeType($path) ?: 'application/octet-stream';
        [$w, $h] = str_starts_with($mime, 'image/') ? (@getimagesize($disk->path($path)) ?: [null, null]) : [null, null];

        return MediaAsset::create([
            'storage_disk' => self::DISK,
            'storage_path' => $path,
            'original_name' => $originalName ?? basename($path),
            'mime_type' => $mime,
            'file_size' => $disk->size($path),
            'width' => $w,
            'height' => $h,
            'checksum' => hash_file('sha256', $disk->path($path)),
            'uploaded_by' => auth()->id(),
        ]);
    }

    /** شمارش تقریبی صفحه‌های PDF بدون کتابخانه‌ی جانبی */
    public static function pdfPages(string $path): int
    {
        $raw = (string) Storage::disk(self::DISK)->get($path);

        return preg_match_all('/\/Type\s*\/Page(?!s)\b/', $raw);
    }
}
