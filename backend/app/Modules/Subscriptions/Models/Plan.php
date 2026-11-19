<?php

namespace App\Modules\Subscriptions\Models;

use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    protected $fillable = ['slug', 'name', 'tagline', 'audience', 'price_monthly', 'price_yearly', 'currency', 'features', 'limits', 'highlighted', 'status', 'sort_order'];

    protected $attributes = ['features' => '[]', 'limits' => '{}'];

    protected function casts(): array
    {
        return ['features' => 'array', 'limits' => 'array', 'highlighted' => 'boolean', 'price_monthly' => 'integer', 'price_yearly' => 'integer'];
    }

    public function priceFor(string $period): int
    {
        return $period === 'yearly' ? $this->price_yearly : $this->price_monthly;
    }

    public function toApi(): array
    {
        return [
            'id' => (string) $this->id,
            'slug' => $this->slug,
            'name' => $this->name,
            'tagline' => $this->tagline,
            'priceMonthly' => $this->price_monthly,
            'priceYearly' => $this->price_yearly,
            'currency' => $this->currency,
            'features' => $this->features,
            'highlighted' => $this->highlighted,
            'audience' => $this->audience,
        ];
    }
}
