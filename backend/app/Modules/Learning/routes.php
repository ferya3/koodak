<?php

use App\Modules\Learning\Http\Controllers\LessonController;
use Illuminate\Support\Facades\Route;

Route::prefix('learning')->group(function () {
    Route::get('subjects', [LessonController::class, 'subjects']);
    Route::get('lessons', [LessonController::class, 'index']);
    Route::get('lessons/{slug}', [LessonController::class, 'show'])->name('lessons.show');
    // والد یا کودک (توکن جلسه‌ی کودک)
    Route::post('lessons/{slug}/complete', [LessonController::class, 'complete'])->middleware(['auth:sanctum', 'throttle:game-events']);
});
