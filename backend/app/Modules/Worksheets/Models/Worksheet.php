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
        'matching' => 'تطبیق', 'coloring' => 'رنگ‌آمیزی', 'addition' => 'جمع و تفریق',
    ];

    protected $fillable = ['content_id', 'template', 'params', 'file_asset_id', 'page_count', 'paper_size', 'orientation', 'printable', 'download_count'];

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

    public function downloads(): HasMany
    {
        return $this->hasMany(WorksheetDownload::class);
    }
}
