<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'restaurant_id',
        'name', 
        'description', 
        'price',
        'category',
        'image_url',
        'is_available',
    ];

    // Relation : Un plat appartient à un restaurant
    public function restaurant(){
        return $this->belongsTo(Users::class, 'restaurant_id');
    }

    // Relation : Un plat peut appartenir à plusieurs commandes

    public function orderItems(){
        return $this->hasMany(OrderItem::class);
    }

}
