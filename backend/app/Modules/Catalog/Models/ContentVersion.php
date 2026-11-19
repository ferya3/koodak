<?php

namespace App\Modules\Catalog\Models;

use Illuminate\Database\Eloquent\Model;

class ContentVersion extends Model
{
    public const UPDATED_AT = null;

    protected $fillable = ['content_id', 'version', 'snapshot', 'created_by', 'note'];

    protected function casts(): array
    {
        return ['snapshot' => 'array'];
    }
}
