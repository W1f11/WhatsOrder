<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    //  Créer une réservation
    public function store(Request $request)
    {
        $data = $request->validate([
            'restaurant_id' => 'required|exists:users,id',
            'table_number' => 'nullable|integer',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $data['user_id'] = Auth::id();
        $data['status'] = 'pending';

        $reservation = Reservation::create($data);

        return response()->json(['message' => 'Reservation created', 'reservation' => $reservation]);
    }

    //  Lister les réservations de l'utilisateur actuel
    public function index()
    {
        $reservations = Reservation::where('user_id', Auth::id())->get();
        return response()->json($reservations);
    }

    //  Annuler une réservation
    public function cancel($id)
    {
        $reservation = Reservation::where('user_id', Auth::id())->findOrFail($id);
        $reservation->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Reservation cancelled']);
    }

    //  Expirer automatiquement les réservations passées
    public function expireOld()
    {
        $expired = Reservation::where('end_time', '<', Carbon::now())
            ->where('status', '!=', 'expired')
            ->update(['status' => 'expired']);

        return response()->json(['message' => "$expired reservations expired"]);
    }
}
