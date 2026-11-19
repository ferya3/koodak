<?php

use App\Modules\Catalog\Http\Controllers\CategoryController;
use App\Modules\Catalog\Http\Controllers\MediaController;
use App\Modules\Catalog\Http\Controllers\TaxonomyController;
use Illuminate\Support\Facades\Route;

Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{category}', [CategoryController::class, 'show']);
Route::get('categories/{category}/contents', [CategoryController::class, 'contents']);
Route::get('age-groups', [TaxonomyController::class, 'ageGroups']);
Route::get('skills', [TaxonomyController::class, 'skills']);
Route::get('media/{media}', MediaController::class)->name('media.show')->middleware('signed');
