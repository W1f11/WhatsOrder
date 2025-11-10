<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


// Admin : accés complet
Route::middleware(['auth', 'role:admin'])->group(function (){
    Route::get('/admin/dasboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/users', [AdminController::class, 'managerUsers'])->name('admin/users');
});

// Manager : gestion menu, commandes, réservations

Route::middleware(['auth', 'role:manager'])->group(function () {
    Route::get('/manager/menu', [ManagerController::class, 'menu'])->name('manager.menu');
    Route::get('/manager/orders', [ManagerController::class, 'orders'])->name('manager.orders');
});


// Client : consulter menu, commander, réserver

Route::middleware(['auth', 'role:client'])->group(function () {
    Route::get('/client/menu', [ClientController::class, 'menu'])->name('client.menu');
    Route::get('/client/orders', [ClientController::class, 'myorders'])->name('client.orders');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
