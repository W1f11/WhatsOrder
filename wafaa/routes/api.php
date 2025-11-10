<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReservationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth', 'role:manager|admin'])->group(function () {
    Route::get('/menu', [MenuItemController::class, 'index']);
    Route::post('/menu', [MenuItemController::class, 'store']);
    Route::put('/menu/{id}', [MenuItemController::class, 'update']);
    Route::delete('/menu/{id}', [MenuItemController::class, 'destroy']);
});

Route::middleware('auth')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index'])->middleware('role:manager|admin');
    Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus'])->middleware('role:manager|admin');
});

Route::middleware('auth')->group(function () {
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations', [ReservationController::class, 'index'])->middleware('role:manager|admin');
    Route::patch('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
    Route::post('/reservations/expire', [ReservationController::class, 'expireOld'])->middleware('role:manager|admin');
});
