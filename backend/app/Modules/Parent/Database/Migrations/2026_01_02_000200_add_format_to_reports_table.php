<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reports', function (Blueprint $table) {
            $table->string('format', 8)->default('html')->after('status'); // pdf | html
        });
    }

    public function down(): void
    {
        Schema::table('reports', fn (Blueprint $table) => $table->dropColumn('format'));
    }
};
