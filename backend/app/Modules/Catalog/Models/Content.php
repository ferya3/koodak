<?php

namespace App\Modules\Catalog\Models;

use App\Models\User;
use App\Modules\Catalog\Enums\ContentStatus;
use App\Modules\Catalog\Enums\ContentType;
use App\Modules\Catalog\Enums\Difficulty;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\ValidationException;

/**
 * محتوای پایه. جزئیات هر نوع در ماژول خودش است و رابطه‌اش در Provider همان ماژول
 * ثبت می‌شود (Content::resolveRelationUsing) تا Catalog به ماژول‌های دیگر وابسته نباشد:
 *   worksheet() ← Worksheets · game() ← Games · story() ← Stories
 */
class Content extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'category_id', 'subject_id', 'content_type', 'slug', 'title', 'description', 'difficulty', 'min_age', 'max_age',
        'estimated_minutes', 'access_level', 'status', 'tone', 'locale', 'cover_asset_id', 'seo', 'sort_order',
        'ai_generated', 'created_by', 'reviewed_by', 'reviewed_at', 'published_at',
    ];

    protected function casts(): array
    {
        return [
            'content_type' => ContentType::class,
            'status' => ContentStatus::class,
            'difficulty' => Difficulty::class,
            'seo' => 'array',
            'ai_generated' => 'boolean',
            'published_at' => 'datetime',
            'reviewed_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (Content $content) {
            // قانون سند: محتوای تولیدشده با هوش مصنوعی بدون بازبینی متخصص منتشر نمی‌شود
            if ($content->ai_generated && $content->status === ContentStatus::Published && ! $content->reviewed_at) {
                throw ValidationException::withMessages(['status' => 'محتوای تولیدشده با هوش مصنوعی پیش از انتشار باید توسط کارشناس بازبینی شود.']);
            }
            if ($content->status === ContentStatus::Published && ! $content->published_at) {
                $content->published_at = now();
            }
        });

        // گروه‌های سنی از بازه‌ی min/max همگام می‌شوند (منبع حقیقت = بازه)
        static::saved(function (Content $content) {
            if ($content->wasChanged(['min_age', 'max_age']) || $content->wasRecentlyCreated) {
                $content->syncAgeGroups();
            }
        });
    }

    /* ── روابط ── */

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function ageGroups(): BelongsToMany
    {
        return $this->belongsToMany(AgeGroup::class);
    }

    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class)->withPivot('weight');
    }

    public function translations(): HasMany
    {
        return $this->hasMany(ContentTranslation::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(ContentVersion::class)->orderByDesc('version');
    }

    public function cover(): BelongsTo
    {
        return $this->belongsTo(MediaAsset::class, 'cover_asset_id');
    }

    public function media(): BelongsToMany
    {
        return $this->belongsToMany(MediaAsset::class, 'content_media')->withPivot(['role', 'sort_order'])->orderByPivot('sort_order');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /* ── Scopeها ── */

    public function scopePublished(Builder $q): Builder
    {
        return $q->where('status', ContentStatus::Published)->where('published_at', '<=', now());
    }

    public function scopeOfType(Builder $q, ContentType $type): Builder
    {
        return $q->where('content_type', $type);
    }

    public function scopeForAge(Builder $q, int $age): Builder
    {
        return $q->where('min_age', '<=', $age)->where('max_age', '>=', $age);
    }

    /** جستجوی متنی ساده (در فاز ۲ با Meilisearch از طریق Laravel Scout جایگزین می‌شود) */
    public function scopeSearch(Builder $q, string $term): Builder
    {
        $like = '%'.str_replace(['%', '_'], ['\%', '\_'], trim($term)).'%';
        $op = $q->getConnection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';

        return $q->where(fn ($w) => $w->where('title', $op, $like)->orWhere('description', $op, $like));
    }

    /**
     * فیلترهای استاندارد لیست‌ها: q, age, category (id یا slug), difficulty, access
     *
     * @param  array<string, mixed>  $f
     */
    public function scopeFilter(Builder $q, array $f): Builder
    {
        return $q
            ->when($f['q'] ?? null, fn ($q, $v) => $q->search($v))
            ->when($f['age'] ?? null, fn ($q, $v) => $q->forAge((int) $v))
            ->when($f['difficulty'] ?? null, fn ($q, $v) => $q->where('difficulty', $v))
            ->when($f['access'] ?? null, fn ($q, $v) => $q->where('access_level', $v))
            ->when($f['categoryId'] ?? $f['category'] ?? null, fn ($q, $v) => is_numeric($v)
                ? $q->where('category_id', $v)
                : $q->whereHas('category', fn ($c) => $c->where('slug', $v)));
    }

    /* ── رفتارها ── */

    public function syncAgeGroups(): void
    {
        $ids = AgeGroup::where('min_age', '>=', $this->min_age)->where('min_age', '<', max($this->max_age, $this->min_age + 1))->pluck('id');
        $this->ageGroups()->sync($ids);
    }

    public function translation(?string $locale = null): ?ContentTranslation
    {
        $locale ??= app()->getLocale();
        if ($locale === $this->locale) {
            return null;
        }

        return $this->relationLoaded('translations')
            ? $this->translations->firstWhere('locale', $locale)
            : $this->translations()->where('locale', $locale)->first();
    }

    public function isPremium(): bool
    {
        return $this->access_level === 'premium';
    }

    /** ذخیره‌ی یک نسخه‌ی کامل (برای تاریخچه و بازگردانی در CMS) */
    public function snapshotVersion(?User $by = null, ?string $note = null): ContentVersion
    {
        $next = (int) $this->versions()->max('version') + 1;

        return $this->versions()->create([
            'version' => $next,
            'snapshot' => $this->load(['skills', 'translations'])->toArray(),
            'created_by' => $by?->id,
            'note' => $note,
        ]);
    }
}
