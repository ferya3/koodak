<?php

use App\Modules\Games\Http\Controllers\GameController;
use App\Modules\Games\Http\Controllers\GameSessionController;
use Illuminate\Support\Facades\Route;

Route::get('games', [GameController::class, 'index']);
Route::get('games/{slug}', [GameController::class, 'show'])->name('games.show')->where('slug', '^(?!sessions$)[a-z0-9-]+$');
Route::get('games/{slug}/levels', [GameController::class, 'levels']);

// والد یا کودک (توکن جلسه‌ی کودک)
Route::middleware(['auth:sanctum', 'throttle:game-events'])->group(function () {
    Route::post('games/{slug}/sessions', [GameSessionController::class, 'store']);
    Route::post('games/sessions/{session}/events', [GameSessionController::class, 'events']);
    Route::post('games/sessions/{session}/complete', [GameSessionController::class, 'complete']);
});
