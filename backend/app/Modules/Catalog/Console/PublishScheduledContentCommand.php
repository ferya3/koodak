<?php

namespace App\Modules\Catalog\Console;

use App\Modules\Catalog\Enums\ContentStatus;
use App\Modules\Catalog\Models\Content;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

/** انتشار زمان‌بندی‌شده: هر دقیقه توسط Scheduler اجرا می‌شود */
class PublishScheduledContentCommand extends Command
{
    protected $signature = 'content:publish-scheduled';

    protected $description = 'Publish scheduled content whose publish time has arrived';

    public function handle(): int
    {
        $items = Content::where('status', ContentStatus::Scheduled)->where('published_at', '<=', now())->get();
        foreach ($items as $content) {
            $content->update(['status' => ContentStatus::Published]);
            $content->snapshotVersion(note: 'scheduled publish');
        }
        if ($items->isNotEmpty()) {
            Cache::forget('catalog:categories:fa');
            Cache::forget('catalog:categories:en');
        }
        $this->info("Published {$items->count()} item(s).");

        return self::SUCCESS;
    }
}
