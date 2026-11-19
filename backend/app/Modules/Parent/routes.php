<?php

use App\Modules\Parent\Http\Controllers\ParentDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'abilities:parent'])->prefix('parent')->group(function () {
    Route::get('dashboard', [ParentDashboardController::class, 'dashboard']);
    Route::get('reports', [ParentDashboardController::class, 'reports']);
    Route::post('reports/generate', [ParentDashboardController::class, 'generate'])->middleware('throttle:10,1');
    Route::get('reports/{report}/download', [ParentDashboardController::class, 'download']);
});
