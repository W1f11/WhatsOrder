<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdressController extends Controller
{
    public function index(Request $request){
        $data = $request->ip();
        return $data;
    }
}
