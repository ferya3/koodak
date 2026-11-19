<?php

use App\Modules\Recommendations\Http\Controllers\RecommendationController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('children/{child}/recommendations', RecommendationController::class);
