<?php

namespace App\Http\Controllers;

use App\Models\UserCode;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;

class TwoFactorAuthController extends Controller
{
    /**
     * index method for 2fa
     *
     * @return response()
     */
    public function index()
    {
        return view('welcome')->with('user', auth()->user());
    }

    /**
     * validate sms
     *
     * @return response()
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required',
        ]);
  
        $exists = UserCode::where('user_id', auth()->user()->id)
                ->where('code', $validated['code'])
                ->where('updated_at', '>=', now()->subSeconds(90))
                ->exists();
  
        if ($exists) {
            $request->session()->put('user_2fa', auth()->user()->id);
            
            return response()->json(['message' => 'Two factor token confirmed.']);
        }
  
        return response(['message' =>'You entered wrong OTP code., please request a new OTP'], 401);
    }
    /**
     * resend otp code
     *
     * @return response()
     */
    public function resend()
    {
        auth()->user()->generate_code();
  
        return back()
            ->with('success', 'We have resent OTP on your mobile number.');
    }
}
