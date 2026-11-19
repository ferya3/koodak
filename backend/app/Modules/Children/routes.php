<?php

use App\Modules\Children\Http\Controllers\ChildController;
use App\Modules\Children\Http\Controllers\ChildDataExportController;
use App\Modules\Children\Http\Controllers\ChildSessionController;
use App\Modules\Children\Http\Controllers\ChildSettingsController;
use Illuminate\Support\Facades\Route;

// مدیریت پروفایل‌ها: فقط والد
Route::middleware(['auth:sanctum', 'abilities:parent'])->group(function () {
    Route::apiResource('children', ChildController::class);
    Route::put('children/{child}/settings', [ChildSettingsController::class, 'update']);
    Route::post('children/{child}/session', [ChildSessionController::class, 'store']);
    Route::get('children/{child}/export', ChildDataExportController::class);
});

// خواندن تنظیمات: والد یا خود کودک
Route::middleware('auth:sanctum')->get('children/{child}/settings', [ChildSettingsController::class, 'show']);
