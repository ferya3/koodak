<?php

namespace App\Modules\Children\Console;

use App\Modules\Children\Models\ChildProfile;
use Illuminate\Console\Command;

/** حذف دائمی کودکانی که مهلت حذفشان رسیده (روزانه توسط Scheduler) – جداول وابسته cascade می‌شوند */
class PurgeChildrenCommand extends Command
{
    protected $signature = 'children:purge';

    protected $description = 'Permanently delete child profiles whose deletion grace period has passed';

    public function handle(): int
    {
        $count = 0;
        ChildProfile::where('status', 'pending_deletion')
            ->where('deletion_scheduled_at', '<=', now())
            ->chunkById(100, function ($children) use (&$count) {
                foreach ($children as $child) {
                    $child->delete();
                    $count++;
                }
            });

        $this->info("Purged {$count} child profile(s).");

        return self::SUCCESS;
    }
}
