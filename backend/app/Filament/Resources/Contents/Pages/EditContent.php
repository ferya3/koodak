<?php

namespace App\Filament\Resources\Contents\Pages;

use App\Filament\Resources\Contents\ContentResource;
use App\Modules\Catalog\Enums\ContentStatus;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

/** گردش کار تأیید محتوا: ارسال برای بازبینی → تأیید و انتشار (فقط کارشناس/مدیر) → نسخه‌ی ثبت‌شده */
class EditContent extends EditRecord
{
    protected static string $resource = ContentResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('submitForReview')->label('ارسال برای بازبینی')->icon('heroicon-o-paper-airplane')->color('warning')
                ->visible(fn () => $this->record->status === ContentStatus::Draft)
                ->action(function () {
                    $this->record->update(['status' => ContentStatus::Review]);
                    Notification::make()->title('برای بازبینی ارسال شد')->success()->send();
                }),
            Action::make('approveAndPublish')->label('تأیید و انتشار')->icon('heroicon-o-check-badge')->color('success')
                ->requiresConfirmation()->modalDescription('محتوا برای کودکان قابل مشاهده می‌شود و یک نسخه از آن ثبت می‌شود.')
                ->visible(fn () => in_array($this->record->status, [ContentStatus::Draft, ContentStatus::Review], true))
                ->authorize(fn () => auth()->user()?->hasRole('admin', 'editor'))
                ->action(function () {
                    $this->record->update([
                        'reviewed_by' => auth()->id(),
                        'reviewed_at' => now(),
                        'status' => ContentStatus::Published,
                        'published_at' => $this->record->published_at ?? now(),
                    ]);
                    $this->record->snapshotVersion(auth()->user(), 'approved & published');
                    $this->refreshFormData(['status', 'published_at']);
                    Notification::make()->title('منتشر شد')->success()->send();
                }),
            Action::make('preview')->label('پیش‌نمایش در سایت')->icon('heroicon-o-eye')->color('gray')
                ->url(fn () => rtrim(config('kidsworld.frontend_url'), '/').'/'.match ($this->record->content_type->value) {
                    'worksheet' => 'worksheets', 'game' => 'games', 'story' => 'stories', 'lesson' => 'learn', default => '',
                }.'/'.$this->record->slug, shouldOpenInNewTab: true),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }

    protected function afterSave(): void
    {
        if ($this->record->status === ContentStatus::Published) {
            $this->record->snapshotVersion(auth()->user(), 'edited');
        }
    }
}
