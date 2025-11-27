<?php

use App\Http\Controllers\AdressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\StatsController;



Route::middleware(['web', 'auth:web'])->group(function () {

    // Menu - Manager et Admin uniquement
    Route::post('/menu', [MenuItemController::class, 'store'])->middleware('role:manager|admin');
    Route::put('/menu/{id}', [MenuItemController::class, 'update'])->middleware('role:manager|admin');
    Route::delete('/menu/{id}', [MenuItemController::class, 'destroy'])->middleware('role:manager|admin');

    // Réservations
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::patch('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);

    // Liste utilisateurs (dashboard manager)
    Route::get('/users', function () {
        return \App\Models\User::select('id','name','email','phone')->get();
    })->middleware('role:manager|admin');
    Route::delete('/users/{id}', function ($id) {
    $user = \App\Models\User::find($id);

    if (!$user) {
        return response()->json(['message' => 'Utilisateur non trouvé'], 404);
    }

    $user->delete();

    return response()->json(['message' => 'Utilisateur supprimé avec succès']);
})->middleware('role:manager|admin');


    // Stats manager
    Route::get('/stats', function (Request $request) {

        $user = $request->user();

        $managerId = $user->id;
        $today = \Carbon\Carbon::today();

        return response()->json([
            'totalReservationsToday' => \App\Models\Reservation::whereDate('start_time', $today)
                ->where('restaurant_id', $managerId)
                ->count(),
            'totalOrders' => \App\Models\Order::where('restaurant_id', $managerId)->count(),
            'totalClients' => \App\Models\Order::where('restaurant_id', $managerId)
                ->distinct('user_id')
                ->count('user_id'),
        ]);
    })->middleware('role:manager|admin');

});
Route::post('/orders', [OrderController::class, 'store']);
Route::get('/orders', [OrderController::class, 'index']);
Route::patch('/orders/{id}/status', [OrderController::class, 'updateStatus']);

// Public API routes (sans authentification)
Route::get('/menu', [MenuItemController::class, 'index']);

// Routes protégées





























Route::get('/adress', [AdressController::class,'index']);