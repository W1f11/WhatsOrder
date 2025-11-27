<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use App\Models\MenuItem;

class OrderController extends Controller
{
    /**
     * Créer une commande
     */
    public function store(Request $request)
    {
        // Valider les données envoyées depuis le front
        $data = $request->validate([
            'restaurant_id' => 'nullable',
            'items' => 'required|array',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'note' => 'nullable|string',
        ]);

        // Calculer le total de la commande
        $total = collect($data['items'])->sum(function ($item) {
            $menu = MenuItem::find($item['menu_item_id']);
            return $menu->price * $item['quantity'];
        });

        // Créer la commande principale
        $order = Order::create([
            'user_id' => auth()->id(),
            'restaurant_id' => 1,  // valeur par défaut
        ]);


        // Créer les OrderItems associés
        foreach ($data['items'] as $item) {
            $menu = MenuItem::find($item['menu_item_id']);

            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $menu->id,
                'quantity' => $item['quantity'], // corrigé ici
                'unit_price' => $menu->price,
                'total_price' => $menu->price * $item['quantity'],
            ]);
        }

        // Load items relation to return full checkout info
        $order->load('items.menuItem', 'user');

        // Map order to include item details (name, quantity, unit_price, total_price)
        $orderData = $order->toArray();

        return response()->json([
            'message' => 'Commande créée avec succès',
            'order' => $orderData,
        ]);
    }

    /**
     * Lister les commandes (pour Manager / Admin)
     */
    public function index()
    {
        // Return orders for the authenticated manager's restaurant
        $orders = Order::with(['items.menuItem', 'user'])
            ->where('restaurant_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        // Normalize orders to include checkout-friendly shape
        $normalized = $orders->map(function ($order) {
            $items = $order->items->map(function ($it) {
                return [
                    'id' => $it->id,
                    'menu_item_id' => $it->menu_item_id,
                    'name' => optional($it->menuItem)->name ?? 'Item',
                    'quantity' => $it->quantity,
                    'unit_price' => $it->unit_price,
                    'total_price' => $it->total_price,
                ];
            });

            return [
                'id' => $order->id,
                'user' => [
                    'id' => $order->user->id ?? null,
                    'name' => $order->user->name ?? null,
                    'email' => $order->user->email ?? null,
                ],
                'total_price' => $order->total_price,
                'status' => $order->status,
                'note' => $order->note,
                'created_at' => $order->created_at,
                'items' => $items,
            ];
        });

        return response()->json($normalized);
    }

    /**
     * Modifier le statut d'une commande
     */
    public function updateStatus(Request $request, $id)
    {
        $order = Order::where('restaurant_id', Auth::id())->findOrFail($id);

        $order->update([
            'status' => $request->input('status')
        ]);

        return response()->json([
            'message' => 'Statut de la commande mis à jour',
            'order' => $order
        ]);
    }
}
