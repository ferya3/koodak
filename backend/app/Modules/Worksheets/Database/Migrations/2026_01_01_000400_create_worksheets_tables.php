<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('worksheets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->unique()->constrained()->cascadeOnDelete();
            // قالب Worksheet Generator + پارامترها (همان قرارداد WorksheetSheet در Frontend)
            $table->string('template', 32)->index();
            $table->jsonb('params')->default('{}');
            $table->foreignId('file_asset_id')->nullable()->constrained('media_assets')->nullOnDelete(); // PDF آماده (اختیاری)
            $table->unsignedSmallInteger('page_count')->default(1);
            $table->string('paper_size', 8)->default('A4');
            $table->string('orientation', 12)->default('portrait');
            $table->boolean('printable')->default(true);
            $table->unsignedInteger('download_count')->default(0);
            $table->timestamps();
        });

        Schema::create('worksheet_downloads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worksheet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('child_id')->nullable()->constrained('child_profiles')->cascadeOnDelete();
            $table->string('format', 8)->default('pdf');
            $table->timestamp('downloaded_at')->useCurrent();
            $table->index(['user_id', 'downloaded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('worksheet_downloads');
        Schema::dropIfExists('worksheets');
    }
};
