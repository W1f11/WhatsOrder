<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'restaurant_id',
        'total_price',
        'status',
    ];

    // le restaurant qui a passé la commande
    public function restaurant(){
        return $this->belongsTo(User::class, 'restaurant_id');
    }

    // les articles inclus dans cette commande

    public function items(){
        return $this->hasMany(OrderItem::class);
    }
}

