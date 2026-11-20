<?php

namespace App\Modules\Worksheets\Models;

use App\Modules\Catalog\Models\Content;
use App\Modules\Catalog\Models\MediaAsset;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Worksheet extends Model
{
    public const TEMPLATES = [
        'tracing' => 'ردگیری و نوشتن', 'counting' => 'شمارش', 'maze' => 'ماز', 'dot-to-dot' => 'نقطه به نقطه',
        'matching' => 'تطبیق', 'coloring' => 'رنگ‌آمیزی', 'addition' => 'جمع',
        'subtraction' => 'تفریق', 'letter-trace' => 'ردگیری حرف', 'find-letter' => 'پیدا کردن حرف',
        'beginning-sound' => 'صدای اول', 'missing-letter' => 'حرف جاافتاده', 'letter-match' => 'وصل کردن حرف',
        'word-search' => 'جدول کلمات', 'number-trace' => 'ردگیری عدد', 'missing-number' => 'عدد جاافتاده',
        'compare' => 'مقایسه', 'clock' => 'ساعت', 'pattern' => 'الگو', 'sudoku' => 'سودوکوی تصویری',
        'odd-one-out' => 'کدام فرق دارد؟', 'shapes' => 'شکل‌ها',
        'multiplication' => 'ضرب', 'multiplication-chart' => 'جدول ضرب', 'division' => 'تقسیم',
        'crossword' => 'جدول متقاطع', 'word-scramble' => 'کلمه‌ی درهم', 'flash-cards' => 'فلش‌کارت',
        'tracing-lines' => 'ردگیری خط', 'find-difference' => 'تفاوت‌ها', 'grid-drawing' => 'نقاشی شطرنجی',
        'word-trace' => 'نوشتن کلمه', 'body-parts' => 'اعضای بدن',
        self::UPLOAD => 'فایل آماده (آپلود PDF یا تصویر)',
    ];

    /** قالبی که به‌جای تولید خودکار، فایل آپلودشده را نشان می‌دهد */
    public const UPLOAD = 'upload';

    protected $fillable = ['content_id', 'template', 'params', 'file_asset_id', 'preview_asset_id', 'page_count', 'paper_size', 'orientation', 'printable', 'download_count'];

    protected $attributes = ['params' => '{}'];

    protected function casts(): array
    {
        return ['params' => 'array', 'printable' => 'boolean'];
    }

    public function content(): BelongsTo
    {
        return $this->belongsTo(Content::class);
    }

    public function file(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'file_asset_id');
    }

    public function preview(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'preview_asset_id');
    }

    public function isUpload(): bool
    {
        return $this->template === self::UPLOAD;
    }

    public function downloads(): HasMany
    {
        return $this->hasMany(WorksheetDownload::class);
    }
}
