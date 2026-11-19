<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 40)->unique();
            $table->string('name', 80);
            $table->string('tagline', 160)->nullable();
            $table->string('audience', 16)->default('family'); // family | school
            $table->unsignedBigInteger('price_monthly')->default(0); // ریال
            $table->unsignedBigInteger('price_yearly')->default(0);
            $table->string('currency', 3)->default('IRR');
            $table->jsonb('features')->default('[]'); // متن‌های قابل نمایش
            $table->jsonb('limits')->default('{}');  // {max_children, premium_content, ...} – منبع حقیقت دسترسی
            $table->boolean('highlighted')->default(false);
            $table->string('status', 16)->default('active');
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('plan_id')->constrained()->restrictOnDelete();
            $table->string('status', 16)->default('pending'); // pending|active|cancelled|expired
            $table->string('billing_period', 8)->default('monthly'); // monthly|yearly
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'status']);
        });

        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subscription_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('amount');
            $table->string('currency', 3)->default('IRR');
            $table->string('gateway', 32);
            $table->string('authority', 120)->nullable()->unique(); // شناسه‌ی درخواست نزد درگاه
            $table->string('transaction_id', 120)->nullable()->unique(); // کد پیگیری نهایی
            $table->string('status', 16)->default('pending'); // pending|paid|failed
            $table->jsonb('meta')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('plans');
    }
};
