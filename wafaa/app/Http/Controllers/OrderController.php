<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use App\Models\MenuItem;


class OrderController extends Controller
{
    // Créer une commande

    public function store(Request $request){
        $data = $request->validate([
            'restaurant_id' => 'required|exists:users,id',
            'items' => 'required|array',
            'items.*.menu_item_id' => 'required|exists:menu_item,id',
            'items.*.quantity' => 'required|integer|min:1',
            'note' => 'nullable|string',
        ]);

        $total = 0;

        $total = collect($data['items'])->sum(function ($item) {
            return MenuItem::find($item['menu_item_id'])->price * $item['quantity'];
        });

        $order = Order::create([
            'user_id'=> Auth::id(),
            'restaurant_id' => $data['restaurant_id'],
            'total_price' => $total,
            'status' => 'pending',
            'note' => $data['note'] ?? null,
        ]);

        collect($data['items'])->each(function ($item) use ($order){
            $menu = MenuItem::find($item['menu_item_id']);

            OrderItem::create([
                'order_id' => $order->id,
                'menu_item_id' => $menu->id,
                'quantuty' => $item['quantity'],
                'unit_price' => $menu->price,
                'total_price' => $menu->price * $item['quantity'],
            ]);

            return response()->json(['message' => 'Order a été crée', 'order' => $order]);
        });
    }
    // Lister les commandes (Manager/Admin)
    public function index(){
        $orders = Order::with('restaurant_id', Auth::id())->width('items.menuItem')->get();
        return response()->json($orders);
    }

    // Modifie le statut d'une commande

    public function updateStatus(Request $request, $id){
        $order = Order::wher('restaurant_id', Authid())->findOrFail($id);
        $order->update(['status' => $request->input('status')]);
        return response()->json(['message' => 'Statut de la commande a été modifiée', 'order' => $order]);
    }
}
