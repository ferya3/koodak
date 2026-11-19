<?php

use App\Modules\Subscriptions\Http\Controllers\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::middleware('feature:subscriptions')->group(function () {
    Route::get('plans', [SubscriptionController::class, 'plans']);
    Route::match(['get', 'post'], 'payments/callback', [SubscriptionController::class, 'callback'])->middleware('throttle:30,1');

    Route::middleware(['auth:sanctum', 'abilities:parent'])->group(function () {
        Route::get('subscriptions/current', [SubscriptionController::class, 'current']);
        Route::post('subscriptions/checkout', [SubscriptionController::class, 'checkout'])->middleware('throttle:10,1');
        Route::get('payments', [SubscriptionController::class, 'payments']);
    });
});
