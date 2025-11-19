<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureCorsHeaders
{
    /**
     * Handle an incoming request and add permissive CORS headers (development only).
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // In development, allow the frontend origin to access backend assets and routes.
        // Adjust the origin below if your frontend runs on a different host/port.
        $frontendOrigin = env('FRONTEND_ORIGIN', 'http://localhost:5173');

        $response->headers->set('Access-Control-Allow-Origin', $frontendOrigin);
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization, X-XSRF-TOKEN, X-CSRF-TOKEN');

        return $response;
    }
}
