<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/** بازی‌های ساخت والدین: پیکربندی یک نوع بازی موجود (الگو، شمارش، حافظه) که فقط کودکان همان خانواده می‌بینند */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_games', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_user_id')->constrained('users')->cascadeOnDelete();
            $table->string('title', 80);
            $table->string('game_type', 24);
            $table->jsonb('config');
            $table->string('tone', 16)->default('sky');
            $table->jsonb('child_ids')->nullable(); // null = همه‌ی کودکان خانواده
            $table->timestamps();
            $table->index(['parent_user_id', 'updated_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_games');
    }
};
