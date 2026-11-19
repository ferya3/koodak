<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('content_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('game_type', 32)->index(); // کلید Game Registry در Frontend
            $table->string('engine', 16)->default('react-svg'); // react-svg | phaser
            $table->jsonb('configuration')->default('{}');
            $table->jsonb('settings')->default('{}');
            $table->string('status', 16)->default('active');
            $table->timestamps();
        });

        Schema::create('game_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('level_number');
            $table->string('difficulty', 16)->default('easy');
            $table->jsonb('configuration')->default('{}');
            $table->timestamps();
            $table->unique(['game_id', 'level_number']);
        });

        Schema::create('game_sessions', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->foreignId('child_id')->constrained('child_profiles')->cascadeOnDelete();
            $table->foreignId('game_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('level_number');
            $table->string('status', 16)->default('in_progress'); // in_progress | completed | abandoned
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->unsignedInteger('score')->default(0);
            $table->unsignedTinyInteger('stars')->default(0);
            $table->unsignedSmallInteger('correct_count')->default(0);
            $table->unsignedSmallInteger('mistakes')->default(0);
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->jsonb('client_meta')->nullable();
            $table->timestamps();

            $table->index(['child_id', 'completed_at']);
            $table->index(['child_id', 'game_id', 'level_number']);
        });

        Schema::create('game_events', function (Blueprint $table) {
            $table->id();
            $table->foreignUlid('session_id')->constrained('game_sessions')->cascadeOnDelete();
            $table->string('event_type', 24);
            $table->jsonb('event_data')->nullable();
            $table->unsignedInteger('occurred_at_ms'); // میلی‌ثانیه از شروع جلسه
            $table->index('session_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('game_events');
        Schema::dropIfExists('game_sessions');
        Schema::dropIfExists('game_levels');
        Schema::dropIfExists('games');
    }
};
