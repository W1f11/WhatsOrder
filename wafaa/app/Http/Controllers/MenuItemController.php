<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
class MenuItemController extends Controller
{
    // ✅ Afficher tous les plats du restaurant connecté
    public function index()
    {
        $items = MenuItem::where('restaurant_id', Auth::id())->get();
        return response()->json($items);
    }


    // ✅ Créer un nouveau plat
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'category' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        $data['restaurant_id'] = Auth::id();

        $item = MenuItem::create($data);

        return response()->json(['message' => 'Menu item created successfully', 'item' => $item]);
    }


    // ✅ Modifier un plat existant
    public function update(Request $request, $id)
    {
        $item = MenuItem::where('restaurant_id', Auth::id())->findOrFail($id);

        $item->update($request->only('name', 'description', 'price', 'category', 'image_url', 'is_available'));

        return response()->json(['message' => 'Menu item updated', 'item' => $item]);
    }

    // ✅ Supprimer un plat
    public function destroy($id)
    {
        $item = MenuItem::where('restaurant_id', Auth::id())->findOrFail($id);
        $item->delete();

        return response()->json(['message' => 'Menu item deleted']);
    }



}
