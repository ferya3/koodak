<?php

use App\Modules\Worksheets\Http\Controllers\WorksheetController;
use Illuminate\Support\Facades\Route;

Route::get('worksheets', [WorksheetController::class, 'index']);
Route::get('worksheets/{slug}', [WorksheetController::class, 'show'])->name('worksheets.show');
Route::get('worksheets/{slug}/preview', [WorksheetController::class, 'preview']);
Route::post('worksheets/{slug}/download', [WorksheetController::class, 'download'])->middleware('throttle:30,1');
