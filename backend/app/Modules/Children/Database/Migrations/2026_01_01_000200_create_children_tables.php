<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * اطلاعات کودک: حداقلی و تحت کنترل والد.
 * بدون نام کامل، بدون تاریخ تولد دقیق (فقط سال و ماه)، بدون عکس.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('child_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('display_name', 40);
            $table->char('birth_year_month', 7); // YYYY-MM
            $table->string('avatar', 16)->default('bunny');
            $table->string('preferred_language', 8)->default('fa');
            $table->string('status', 24)->default('active'); // active | pending_deletion
            $table->timestamp('deletion_scheduled_at')->nullable();
            $table->timestamps();

            $table->index(['parent_user_id', 'status']);
        });

        Schema::create('child_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('child_id')->unique()->constrained('child_profiles')->cascadeOnDelete();
            $table->jsonb('favorite_categories')->default('[]');
            $table->jsonb('preferred_content_types')->default('[]');
            $table->jsonb('accessibility_settings')->default('{}');
            $table->timestamps();
        });

        Schema::create('parent_settings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('child_id')->unique()->constrained('child_profiles')->cascadeOnDelete();
            $table->unsignedSmallInteger('daily_limit_minutes')->default(45);
            $table->jsonb('allowed_content_types')->default('["game","story","worksheet","lesson","drawing"]');
            $table->boolean('sound_enabled')->default(true);
            $table->boolean('screen_time_enabled')->default(true);
            $table->boolean('bedtime_lock_enabled')->default(false);
            $table->time('bedtime_from')->default('20:30');
            $table->time('bedtime_to')->default('07:00');
            $table->timestamps();
        });

        Schema::create('parental_consents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('child_id')->nullable()->constrained('child_profiles')->nullOnDelete();
            $table->string('policy_version', 16);
            $table->string('scope', 32)->default('child_profile');
            $table->timestamp('consented_at');
            $table->timestamp('revoked_at')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('parental_consents');
        Schema::dropIfExists('parent_settings');
        Schema::dropIfExists('child_preferences');
        Schema::dropIfExists('child_profiles');
    }
};
