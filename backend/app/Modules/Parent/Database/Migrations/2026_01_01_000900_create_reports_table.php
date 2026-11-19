<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('parent_user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('child_id')->constrained('child_profiles')->cascadeOnDelete();
            $table->string('report_type', 16)->default('weekly'); // weekly|monthly|custom
            $table->date('period_start');
            $table->date('period_end');
            $table->string('status', 16)->default('queued'); // queued|ready|failed
            $table->string('storage_disk', 32)->default('local');
            $table->string('storage_path')->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->timestamps();
            $table->index(['child_id', 'period_end']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
