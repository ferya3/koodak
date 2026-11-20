<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** کاربرگ آماده: فایل اصلی (file_asset_id) + تصویر پیش‌نمایش برای کارت‌ها */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('worksheets', function (Blueprint $table) {
            $table->foreignId('preview_asset_id')->nullable()->after('file_asset_id')->constrained('media_assets')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('worksheets', function (Blueprint $table) {
            $table->dropConstrainedForeignId('preview_asset_id');
        });
    }
};
