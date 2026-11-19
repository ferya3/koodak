<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * آکادمی یادگیری: درس = چند گام (توضیح / پرسش) + پیش‌نیازها.
 * خود درس یک Content از نوع lesson است (عنوان، سن، سطح، مهارت‌ها در Catalog).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->unique()->constrained()->cascadeOnDelete();
            $table->jsonb('objectives')->default('[]');
            $table->foreignId('video_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('lesson_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->string('key', 32); // شناسه‌ی پایدار گام (برای پاسخ‌ها)
            $table->string('step_type', 16); // explain | quiz
            $table->string('title', 160);
            $table->text('body')->nullable();
            $table->jsonb('visual')->nullable();   // {kind, value|icons|scene}
            $table->jsonb('question')->nullable(); // {prompt, options[{id,label,visual}], answerId}
            $table->foreignId('audio_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->unsignedSmallInteger('step_order')->default(0);
            $table->timestamps();
            $table->unique(['lesson_id', 'key']);
        });

        Schema::create('lesson_prerequisites', function (Blueprint $table) {
            $table->foreignId('lesson_id')->constrained()->cascadeOnDelete();
            $table->foreignId('prerequisite_content_id')->constrained('contents')->cascadeOnDelete();
            $table->primary(['lesson_id', 'prerequisite_content_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_prerequisites');
        Schema::dropIfExists('lesson_steps');
        Schema::dropIfExists('lessons');
    }
};
