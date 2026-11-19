<?php

namespace App\Modules\Recommendations\Support;

use App\Modules\Catalog\Models\Content;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Games\Models\GameSession;
use App\Modules\Progress\Models\ChildProgress;
use App\Modules\Subscriptions\Support\Entitlements;
use Illuminate\Support\Collection;

/**
 * Recommendation Engine v1 – Rule-Based و قابل توضیح.
 *   امتیاز = ۵۰ + علاقه‌مندی(۲۵) + تازگی(۱۵) | تکرار برای ستاره‌ی بیشتر(۸) | کامل‌شده(−۳۰)
 *           − ۱۰ × فاصله‌ی دشواری از سطح هدف
 *   سطح هدف از سن و میانگین ستاره‌ها تعیین می‌شود؛ ترجیحات والد (انواع مجاز) و اشتراک اعمال می‌شود.
 *   تنوع: حداکثر ۲ مورد از هر نوع.
 * نسخه‌ی ۲: جایگزینی امتیازدهی با مدل یادگیری ماشین، با همین خروجی.
 */
class RecommendationEngine
{
    public function __construct(private Entitlements $entitlements) {}

    /** @return Collection<int, array{content: Content, score: int, reason: string}> */
    public function for(ChildProfile $child, int $limit = 4, ?array $types = null): Collection
    {
        $age = $child->age();
        $favorites = collect($child->preferences?->favorite_categories ?? [])->map(fn ($id) => (int) $id);
        $allowed = $types ?? $child->settings?->allowed_content_types ?? ['game', 'story', 'worksheet'];
        $premium = $this->entitlements->for($child->parent)->canAccessPremium();

        $best = ChildProgress::where('child_id', $child->id)->pluck('best_stars', 'content_id');
        $avgStars = (float) (GameSession::where('child_id', $child->id)->where('status', 'completed')
            ->latest('completed_at')->limit(20)->avg('stars') ?? 2);
        $target = max(0, min(3, (int) round(($age - 3) / 2) + ($avgStars >= 2.5 ? 1 : ($avgStars < 1.5 ? -1 : 0))));

        $scored = Content::published()->forAge($age)
            ->whereIn('content_type', array_intersect($allowed, ['game', 'story', 'worksheet', 'lesson']))
            ->when(! $premium, fn ($q) => $q->where('access_level', 'free'))
            ->with(ContentPresenter::relations())
            ->limit(200)->get()
            ->map(function (Content $c) use ($favorites, $best, $target, $age) {
                $score = 50;
                $reason = "مناسب {$age} سالگی";
                if ($favorites->contains($c->category_id)) {
                    $score += 25;
                    $reason = 'از دنیای مورد علاقه';
                }
                if (! $best->has($c->id)) {
                    $score += 15;
                } elseif ($best[$c->id] < 3 && $c->content_type->value === 'game') {
                    $score += 8;
                    $reason = 'بیا ستاره‌ی بیشتری بگیریم!';
                } else {
                    $score -= 30;
                }
                $score -= abs($c->difficulty->rank() - $target) * 10;

                return ['content' => $c, 'score' => $score, 'reason' => $reason];
            })
            ->sortByDesc('score')->values();

        $perType = [];

        return $scored->filter(function ($r) use (&$perType) {
            $t = $r['content']->content_type->value;
            $perType[$t] = ($perType[$t] ?? 0) + 1;

            return $perType[$t] <= 2;
        })->take($limit)->values();
    }
}
