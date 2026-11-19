<?php

use App\Modules\Catalog\CatalogServiceProvider;
use App\Modules\Children\ChildrenServiceProvider;
use App\Modules\Games\GamesServiceProvider;
use App\Modules\Identity\IdentityServiceProvider;
use App\Modules\Learning\LearningServiceProvider;
use App\Modules\Parent\ParentServiceProvider;
use App\Modules\Progress\ProgressServiceProvider;
use App\Modules\Recommendations\RecommendationsServiceProvider;
use App\Modules\Stories\StoriesServiceProvider;
use App\Modules\Subscriptions\SubscriptionsServiceProvider;
use App\Modules\Worksheets\WorksheetsServiceProvider;
use App\Providers\AppServiceProvider;
use App\Providers\Filament\AdminPanelProvider;

return [
    AppServiceProvider::class,

    // ── ماژول‌ها (Modular Monolith) – هر ماژول مالک جداول، مسیرها و منطق خودش ──
    IdentityServiceProvider::class,
    ChildrenServiceProvider::class,
    CatalogServiceProvider::class,
    WorksheetsServiceProvider::class,
    GamesServiceProvider::class,
    StoriesServiceProvider::class,
    LearningServiceProvider::class,
    SubscriptionsServiceProvider::class,
    ProgressServiceProvider::class,
    RecommendationsServiceProvider::class,
    ParentServiceProvider::class,

    // ── پنل مدیریت محتوا (Filament) ──
    AdminPanelProvider::class,
];
