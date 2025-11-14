<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;

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

// === Authentication Routes (SPA/API) with Session Middleware ===
// These routes need session middleware to handle cookie-based auth for SPA
Route::middleware(['web'])->group(function () {
    Route::post('/register', [RegisteredUserController::class, 'store']);
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy']);
    Route::get('/user', function (Request $request) {
        return response()->json(['user' => $request->user()]);
    });
});

// Public API routes (sans authentification - développement facile)
Route::get('/menu', [MenuItemController::class, 'index']);

// Route TEST - À supprimer en production
Route::post('/menu/test', function (Request $request) {
    return response()->json([
        'message' => 'API fonctionne !',
        'data' => $request->all()
    ]);
});

// Routes protégées (nécessitent authentification via session Breeze)
Route::middleware('auth:web')->group(function () {
    // Menu - Manager et Admin uniquement
    Route::post('/menu', [MenuItemController::class, 'store'])->middleware('role:manager|admin');
    Route::put('/menu/{id}', [MenuItemController::class, 'update'])->middleware('role:manager|admin');
    Route::delete('/menu/{id}', [MenuItemController::class, 'destroy'])->middleware('role:manager|admin');
});

// Routes publiques supplémentaires (développement - à protéger en production)
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/reservations', [ReservationController::class, 'store']);

