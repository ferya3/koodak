<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * هسته‌ی محتوا: Category › Subject › Content (+ Worksheet / Game / Story در ماژول‌های خودشان)
 * هیچ دسته‌بندی در کد هاردکد نیست؛ همه از CMS مدیریت می‌شوند.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('age_groups', function (Blueprint $table) {
            $table->id();
            $table->string('title', 40);
            $table->unsignedTinyInteger('min_age');
            $table->unsignedTinyInteger('max_age');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('media_assets', function (Blueprint $table) {
            $table->id();
            $table->string('storage_disk', 32)->default('public');
            $table->string('storage_path');
            $table->string('original_name')->nullable();
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('file_size')->default(0);
            $table->unsignedInteger('width')->nullable();
            $table->unsignedInteger('height')->nullable();
            $table->unsignedInteger('duration')->nullable(); // ثانیه (صوت/ویدئو)
            $table->string('checksum', 64)->nullable()->index();
            $table->string('alt_text')->nullable();
            $table->string('status', 16)->default('ready');
            $table->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('slug', 80)->unique();
            $table->string('title', 120);
            $table->string('title_en', 120)->nullable();
            $table->text('description')->nullable();
            $table->string('icon', 40)->default('star');
            $table->string('tone', 16)->default('sky');
            $table->foreignId('image_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->string('status', 16)->default('active');
            $table->timestamps();
        });

        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('slug', 80);
            $table->string('title', 120);
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['category_id', 'slug']);
        });

        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 80)->unique();
            $table->string('title', 120);
            $table->text('description')->nullable();
            $table->string('skill_category', 32)->index();
            $table->timestamps();
        });

        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();
            $table->string('content_type', 16)->index(); // lesson|game|worksheet|story|activity|quiz|drawing
            $table->string('slug', 120)->unique();
            $table->string('title', 160);
            $table->text('description')->nullable();
            $table->string('difficulty', 16)->default('easy');
            $table->unsignedTinyInteger('min_age');
            $table->unsignedTinyInteger('max_age');
            $table->unsignedSmallInteger('estimated_minutes')->default(5);
            $table->string('access_level', 16)->default('free'); // free|premium
            $table->string('status', 16)->default('draft'); // draft|review|scheduled|published|archived
            $table->string('tone', 16)->default('sky');
            $table->string('locale', 8)->default('fa');
            $table->foreignId('cover_asset_id')->nullable()->constrained('media_assets')->nullOnDelete();
            $table->jsonb('seo')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('ai_generated')->default(false);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
            $table->index(['content_type', 'status', 'min_age', 'max_age']);
            $table->index(['category_id', 'status']);
        });

        Schema::create('content_translations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->constrained()->cascadeOnDelete();
            $table->string('locale', 8);
            $table->string('title', 160);
            $table->text('description')->nullable();
            $table->longText('body')->nullable();
            $table->timestamps();
            $table->unique(['content_id', 'locale']);
        });

        Schema::create('age_group_content', function (Blueprint $table) {
            $table->foreignId('content_id')->constrained()->cascadeOnDelete();
            $table->foreignId('age_group_id')->constrained()->cascadeOnDelete();
            $table->primary(['content_id', 'age_group_id']);
        });

        Schema::create('content_skill', function (Blueprint $table) {
            $table->foreignId('content_id')->constrained()->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->decimal('weight', 3, 2)->default(1);
            $table->primary(['content_id', 'skill_id']);
        });

        Schema::create('content_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->constrained()->cascadeOnDelete();
            $table->foreignId('media_asset_id')->constrained()->cascadeOnDelete();
            $table->string('role', 32)->default('gallery'); // cover|audio|video|gallery|file
            $table->unsignedSmallInteger('sort_order')->default(0);
        });

        // نسخه‌بندی محتوا: هر انتشار یک Snapshot کامل ذخیره می‌کند
        Schema::create('content_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('version');
            $table->jsonb('snapshot');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('note')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['content_id', 'version']);
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE contents ADD CONSTRAINT contents_age_range CHECK (min_age <= max_age)');
        }
    }

    public function down(): void
    {
        foreach (['content_versions', 'content_media', 'content_skill', 'age_group_content', 'content_translations', 'contents', 'skills', 'subjects', 'categories', 'media_assets', 'age_groups'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
