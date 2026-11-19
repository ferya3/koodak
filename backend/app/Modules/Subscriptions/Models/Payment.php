<?php

namespace App\Modules\Subscriptions\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = ['user_id', 'subscription_id', 'amount', 'currency', 'gateway', 'authority', 'transaction_id', 'status', 'meta', 'paid_at'];

    protected function casts(): array
    {
        return ['meta' => 'array', 'paid_at' => 'datetime'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(Subscription::class);
    }
}
