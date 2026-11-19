<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Modules\Catalog\Models\Content;
use App\Modules\Children\Models\ChildProfile;
use App\Modules\Games\Models\GameSession;
use App\Modules\Worksheets\Models\WorksheetDownload;
use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PlatformOverview extends StatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $week = now()->subDays(7);
        $sessions = collect(range(6, 0))->map(fn ($d) => GameSession::whereDate('started_at', now()->subDays($d)->toDateString())->count())->all();

        return [
            Stat::make('محتوای منتشرشده', Content::published()->count())
                ->description(Content::where('status', 'review')->count().' مورد در انتظار بازبینی')
                ->color('success')->icon('heroicon-o-squares-2x2'),
            Stat::make('خانواده‌ها', User::whereHas('roles', fn ($q) => $q->where('name', 'parent'))->count())
                ->description(ChildProfile::active()->count().' پروفایل کودک فعال')->icon('heroicon-o-users'),
            Stat::make('جلسه‌های بازی (۷ روز)', GameSession::where('started_at', '>=', $week)->count())
                ->chart($sessions)->color('primary')->icon('heroicon-o-puzzle-piece'),
            Stat::make('دانلود کاربرگ (۷ روز)', WorksheetDownload::where('downloaded_at', '>=', $week)->count())
                ->icon('heroicon-o-printer'),
        ];
    }
}
