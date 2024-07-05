<?php

namespace App\Http\Middleware;

use Closure;
use Session;
use Illuminate\Http\Request;

class TwoFactorAuthApi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();
        if ($user->is_2fa_enable && !$request->session()->exists('user_2fa')) {
            return response(['message', 'Two factor verification required'], 400);
        }
 
        return $next($request);
    }
}
