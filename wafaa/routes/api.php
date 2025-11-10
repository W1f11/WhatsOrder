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
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Menu - Manager et Admin uniquement
    Route::post('/menu', [MenuItemController::class, 'store'])->middleware('role:manager|admin');
    Route::put('/menu/{id}', [MenuItemController::class, 'update'])->middleware('role:manager|admin');
    Route::delete('/menu/{id}', [MenuItemController::class, 'destroy'])->middleware('role:manager|admin');
});

// Routes publiques supplémentaires (développement - à protéger en production)
Route::post('/menu', [MenuItemController::class, 'store']);
Route::put('/menu/{id}', [MenuItemController::class, 'update']);
Route::delete('/menu/{id}', [MenuItemController::class, 'destroy']);
Route::post('/orders', [OrderController::class, 'store']);
Route::post('/reservations', [ReservationController::class, 'store']);
