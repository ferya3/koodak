<?php

namespace App\Modules\Catalog\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Catalog\Models\MediaAsset;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** تحویل فایل با Signed URL برای دیسک‌هایی که خودشان URL موقت نمی‌سازند (مثل local) */
class MediaController extends Controller
{
    public function __invoke(MediaAsset $media): StreamedResponse
    {
        return Storage::disk($media->storage_disk)->response($media->storage_path, $media->original_name);
    }
}
