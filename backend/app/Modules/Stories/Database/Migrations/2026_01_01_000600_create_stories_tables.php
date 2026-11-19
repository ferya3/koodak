<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('story_type', 16)->default('short'); // short|picture|audio|interactive|bedtime
            $table->foreignId('audio_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('story_chapters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('story_id')->constrained()->cascadeOnDelete();
            $table->string('key', 32); // شناسه‌ی پایدار در قصه (برای انتخاب مسیر)
            $table->string('title', 160);
            $table->text('body');
            $table->string('scene', 40)->nullable(); // کلید صحنه‌ی تصویرسازی پیش‌فرض
            $table->foreignId('image_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->foreignId('audio_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->unsignedSmallInteger('chapter_order')->default(0);
            $table->boolean('is_ending')->default(false);
            $table->timestamps();
            $table->unique(['story_id', 'key']);
        });

        Schema::create('story_choices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chapter_id')->constrained('story_chapters')->cascadeOnDelete();
            $table->string('choice_text', 160);
            $table->foreignId('next_chapter_id')->constrained('story_chapters')->cascadeOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('story_choices');
        Schema::dropIfExists('story_chapters');
        Schema::dropIfExists('stories');
    }
};
