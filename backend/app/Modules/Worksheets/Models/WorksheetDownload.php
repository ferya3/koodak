<?php

namespace App\Modules\Worksheets\Models;

use Illuminate\Database\Eloquent\Model;

class WorksheetDownload extends Model
{
    public $timestamps = false;

    protected $fillable = ['worksheet_id', 'user_id', 'child_id', 'format', 'downloaded_at'];

    protected function casts(): array
    {
        return ['downloaded_at' => 'datetime'];
    }
}
