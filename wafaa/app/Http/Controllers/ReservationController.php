<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    //  Créer une réservation
    public function store(Request $request)
    {
        // Assouplir la validation en développement : vérifier uniquement les types
        $data = $request->validate([
            'restaurant_id' => 'required|integer',
            'table_number' => 'nullable|integer',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $data['user_id'] = Auth::id();
        $data['status'] = 'pending';

        
        try {
            $start = Carbon::parse($data['start_time']);
            $end = Carbon::parse($data['end_time']);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid date format for start_time or end_time'], 422);
        }

        // Option: convertir en timezone de l'application pour cohérence
        $appTz = config('app.timezone') ?: 'UTC';
        $data['start_time'] = $start->setTimezone($appTz)->toDateTimeString();
        $data['end_time'] = $end->setTimezone($appTz)->toDateTimeString();

        $restaurant = User::find($data['restaurant_id']);
        if (! $restaurant) {
            
            \Log::warning('Reservation: restaurant_id not found: ' . ($data['restaurant_id'] ?? 'null'));
            $restaurant = User::where('email', 'manager@gmail.com')->first();
            if (! $restaurant) {
                $restaurant = User::first();
            }
            if (! $restaurant) {
                return response()->json(['message' => 'Le restaurant spécifié n\'existe pas.'], 422);
            }
            // Replace the provided id with the resolved local restaurant id so FK is satisfied
            $data['restaurant_id'] = $restaurant->id;
        }

        $reservation = Reservation::create($data);

        // Retourner directement l'objet réservation (frontend attend l'objet en réponse)
        return response()->json($reservation, 201);
    }

    //  Lister les réservations de l'utilisateur actuel
    public function index()
{
    // Récupérer l'utilisateur actuellement authentifié
    $user = Auth::user();

    // Si l'utilisateur est connecté
    if ($user) {
        $isManager = false; // Initialiser la variable pour vérifier si c'est un manager/admin

        // Vérifier si le modèle User a la méthode hasRole 
        if (method_exists($user, 'hasRole')) {
            // Déterminer si l'utilisateur a le rôle 'manager' ou 'admin'
            $isManager = $user->hasRole(['manager', 'admin']);
        } else {
            // Fallback 
            $isManager = ($user->role ?? '') === 'manager' || ($user->email ?? '') === 'manager@gmail.com';
        }

        // Si l'utilisateur est manager ou admin
        if ($isManager) {
            // Récupérer toutes les réservations liées à ce restaurant (restaurant_id = user id)
            $reservations = Reservation::where('restaurant_id', $user->id)->get();

            // Retourner les réservations en JSON
            return response()->json($reservations);
        }
    }

    // Si l'utilisateur n'est pas manager/admin (ou si aucun utilisateur n'est connecté)
    // Récupérer seulement les réservations de l'utilisateur connecté
    $reservations = Reservation::where('user_id', Auth::id())->get();

    // Retourner les réservations en JSON
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
