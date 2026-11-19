<?php

use App\Modules\Stories\Http\Controllers\StoryController;
use Illuminate\Support\Facades\Route;

Route::get('stories', [StoryController::class, 'index']);
Route::get('stories/{slug}', [StoryController::class, 'show'])->name('stories.show');
Route::get('stories/{slug}/chapters', [StoryController::class, 'chapters']);
