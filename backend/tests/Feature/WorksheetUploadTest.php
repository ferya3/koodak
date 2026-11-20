<?php

namespace Tests\Feature;

use App\Modules\Catalog\Models\Content;
use App\Modules\Worksheets\Models\Worksheet;
use App\Modules\Worksheets\Support\WorksheetUploads;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

/** کاربرگ آماده: آپلود در پنل مدیریت، تحویل فایل با بررسی اشتراک، پیش‌نمایش عمومی */
class WorksheetUploadTest extends TestCase
{
    private function makeUpload(string $slug): Worksheet
    {
        $disk = Storage::disk(WorksheetUploads::DISK);
        $disk->put('worksheets/files/sheet.pdf', "%PDF-1.4\n1 0 obj << /Type /Pages /Count 2 >>\n2 0 obj << /Type /Page >>\n3 0 obj << /Type /Page >>\n%%EOF");
        UploadedFile::fake()->image('cover.png', 600, 848)->storeAs('worksheets/previews', 'cover.png', ['disk' => WorksheetUploads::DISK]);

        $data = WorksheetUploads::fromForm([
            'template' => Worksheet::UPLOAD, 'params' => ['size' => 9],
            'upload_file' => 'worksheets/files/sheet.pdf', 'upload_file_name' => 'my-sheet.pdf',
            'upload_preview' => 'worksheets/previews/cover.png',
        ]);
        $worksheet = Content::where('slug', $slug)->firstOrFail()->worksheet;
        $worksheet->update($data);

        return $worksheet->fresh();
    }

    public function test_form_data_becomes_media_assets_and_back(): void
    {
        Storage::fake(WorksheetUploads::DISK);
        $w = $this->makeUpload('maze-easy');

        $this->assertSame([], $w->params);
        $this->assertSame(2, $w->page_count);
        $this->assertSame('application/pdf', $w->file->mime_type);
        $this->assertSame('my-sheet.pdf', $w->file->original_name);
        $this->assertSame(600, $w->preview->width);

        $form = WorksheetUploads::toForm($w->only(['file_asset_id', 'preview_asset_id']));
        $this->assertSame('worksheets/files/sheet.pdf', $form['upload_file']);
        $this->assertSame('worksheets/previews/cover.png', $form['upload_preview']);

        // قالب‌های تولیدی دست نمی‌خورند
        $this->assertSame(['template' => 'maze', 'params' => ['size' => 9]], WorksheetUploads::fromForm(['template' => 'maze', 'params' => ['size' => 9], 'upload_file' => null]));
    }

    public function test_free_upload_is_served_and_counted_only_on_download(): void
    {
        Storage::fake(WorksheetUploads::DISK);
        $this->makeUpload('maze-easy');

        $this->getJson('/api/v1/worksheets/maze-easy')->assertOk()
            ->assertJsonPath('data.template', 'upload')->assertJsonPath('data.file.mime', 'application/pdf')
            ->assertJsonPath('data.hasPreview', true)->assertJsonMissingPath('data.file.path');
        $before = Content::where('slug', 'maze-easy')->first()->worksheet->download_count;

        $this->get('/api/v1/worksheets/maze-easy/file?inline=1')->assertOk()->assertHeader('content-type', 'application/pdf')
            ->assertHeader('content-disposition', 'inline; filename=kidsworld-maze-easy.pdf');
        $this->get('/api/v1/worksheets/maze-easy/file')->assertOk()
            ->assertHeader('content-disposition', 'attachment; filename=kidsworld-maze-easy.pdf');
        $this->assertSame($before + 1, Content::where('slug', 'maze-easy')->first()->worksheet->download_count);

        $this->get('/api/v1/worksheets/maze-easy/preview-image')->assertOk()->assertHeader('content-type', 'image/png');
    }

    public function test_premium_upload_requires_subscription(): void
    {
        Storage::fake(WorksheetUploads::DISK);
        $this->makeUpload('maze-hard');

        $this->getJson('/api/v1/worksheets/maze-hard/file')->assertUnauthorized();
        $this->getJson('/api/v1/worksheets/maze-hard/file', $this->bearer($this->parentToken($this->parent())))->assertStatus(402);
        $this->get('/api/v1/worksheets/maze-hard/file', $this->bearer($this->parentToken($this->parent('family'))))->assertOk();
        // پیش‌نمایش برای همه آزاد است
        $this->get('/api/v1/worksheets/maze-hard/preview-image')->assertOk();
    }

    public function test_generated_worksheets_have_no_file(): void
    {
        $this->getJson('/api/v1/worksheets/maze-medium')->assertJsonPath('data.file', null)->assertJsonPath('data.hasPreview', false);
        $this->get('/api/v1/worksheets/maze-medium/file')->assertNotFound();
        $this->get('/api/v1/worksheets/maze-medium/preview-image')->assertNotFound();
    }
}
