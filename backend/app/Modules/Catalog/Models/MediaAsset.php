<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

/** فایل‌ها همیشه در Object Storage (S3-compatible) نگهداری می‌شوند؛ دیتابیس فقط متادیتا دارد */
class MediaAsset extends Model
{
    protected $fillable = ['storage_disk', 'storage_path', 'original_name', 'mime_type', 'file_size', 'width', 'height', 'duration', 'checksum', 'alt_text', 'status', 'uploaded_by'];

    /** آدرس امضاشده و موقت (Signed URL) برای فایل‌های غیرعمومی */
    public function temporaryUrl(int $minutes = 15): string
    {
        $disk = Storage::disk($this->storage_disk);

        if (method_exists($disk, 'providesTemporaryUrls') && $disk->providesTemporaryUrls()) {
            return $disk->temporaryUrl($this->storage_path, now()->addMinutes($minutes));
        }

        return URL::temporarySignedRoute('media.show', now()->addMinutes($minutes), ['media' => $this->id]);
    }

    public function publicUrl(): string
    {
        return Storage::disk($this->storage_disk)->url($this->storage_path);
    }
}
