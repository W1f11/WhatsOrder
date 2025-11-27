<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\User;

class StatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'totalReservationsToday' => Reservation::whereDate('start_time', today())->count(),
            'totalOrders' => Reservation::count(),
            'totalClients' => User::count(),
        ]);
    }
}
