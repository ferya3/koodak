<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** پیشرفت، امتیاز، مدال و مشاهده‌ی مهارت – همه‌ی نتایج فعالیت‌ها با ساختار مشخص ذخیره می‌شوند */
return new class extends Migration
{
    public function up(): void
    {
        // لاگ یکپارچه‌ی همه‌ی فعالیت‌ها (بازی، قصه، کاربرگ، نقاشی، درس)
        Schema::create('activity_attempts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('child_profiles')->cascadeOnDelete();
            $table->foreignId('content_id')->nullable()->constrained()->nullOnDelete();
            $table->string('activity_type', 16); // game|story|worksheet|drawing|lesson
            $table->string('title', 160);
            $table->string('tone', 16)->default('sky');
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->jsonb('result')->nullable();
            $table->string('source_type', 40)->nullable(); // مثلاً game_session
            $table->string('source_id', 40)->nullable();
            $table->timestamps();
            $table->index(['child_id', 'started_at']);
        });

        Schema::create('child_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('child_profiles')->cascadeOnDelete();
            $table->foreignId('content_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('progress_percent')->default(0);
            $table->string('completion_status', 16)->default('in_progress'); // in_progress|completed
            $table->unsignedTinyInteger('best_stars')->default(0);
            $table->unsignedInteger('attempts')->default(0);
            $table->timestamp('last_activity_at')->nullable();
            $table->timestamps();
            $table->unique(['child_id', 'content_id']);
        });

        Schema::create('achievements', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 60)->unique();
            $table->string('title', 80);
            $table->string('description', 200);
            $table->string('icon', 40)->default('trophy');
            $table->unsignedInteger('points')->default(10);
            // قاعده‌ی کسب مدال (از CMS قابل تنظیم)
            $table->string('rule_type', 32); // first_activity|three_star_games|stories_completed|drawings_saved|streak_days|correct_answers|games_completed
            $table->unsignedInteger('rule_threshold')->default(1);
            $table->string('status', 16)->default('active');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('child_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('child_profiles')->cascadeOnDelete();
            $table->foreignId('achievement_id')->constrained()->cascadeOnDelete();
            $table->timestamp('earned_at');
            $table->unique(['child_id', 'achievement_id']);
        });

        Schema::create('points_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('child_profiles')->cascadeOnDelete();
            $table->integer('points');
            $table->string('reason', 40);
            $table->string('reference_type', 40)->nullable();
            $table->string('reference_id', 40)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['child_id', 'created_at']);
        });

        // مشاهده‌ی تمرین مهارت (نه سنجش استعداد): میانگین متحرک نمایی از نمونه‌ها
        Schema::create('child_skill_observations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->constrained('child_profiles')->cascadeOnDelete();
            $table->foreignId('skill_id')->constrained()->cascadeOnDelete();
            $table->decimal('observation_score', 5, 2)->default(0);
            $table->decimal('previous_score', 5, 2)->nullable();
            $table->unsignedInteger('sample_count')->default(0);
            $table->timestamp('observed_at');
            $table->timestamps();
            $table->unique(['child_id', 'skill_id']);
        });
    }

    public function down(): void
    {
        foreach (['child_skill_observations', 'points_transactions', 'child_achievements', 'achievements', 'child_progress', 'activity_attempts'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
