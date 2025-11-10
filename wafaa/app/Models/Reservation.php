<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'restaurant_id',
        'table_number',
        'start_time',
        'end_time',
        'status',
    ];

    // la personne qui a reservé
    public function user(){
        return $this->belongsTo(User::class);

    }

    // Le restaurant concerné

    public function restaurant(){
        return $this->belongsTo((User::class), 'restaurant_id');
    }
}
