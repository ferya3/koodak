<?php

use App\Modules\Progress\Http\Controllers\ProgressController;
use Illuminate\Support\Facades\Route;

// والد یا خود کودک (توکن جلسه‌ی کودک)
Route::middleware('auth:sanctum')->prefix('children/{child}')->group(function () {
    Route::get('progress', [ProgressController::class, 'summary']);
    Route::get('achievements', [ProgressController::class, 'achievements']);
    Route::get('activity-history', [ProgressController::class, 'history']);
    Route::get('skills', [ProgressController::class, 'skills']);
    Route::post('activities', [ProgressController::class, 'storeActivity'])->middleware('throttle:game-events');
});
