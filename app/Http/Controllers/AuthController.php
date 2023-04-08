<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\WebPush\WebNotification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\UploadedFile;

class AuthController extends Controller
{
    public function login(Request $request) {
        $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $credentials = $request->only('email', 'password');

        $user = User::where('email', $credentials['email'])->first();

        if(is_null($user)){
            return response([
                'message' => 'invalid email'
            ], 401);
        }

        if(isset($user) && $user->login_attempt === 3){
            return response([
                'message' => 'you have exceed the login attempt, please reset your password'
            ], 401);
        }

        if (Auth::attempt($credentials)) {
            $user->update([
                'login_attempt' => 0
            ]);

            $request->session()->regenerate();

            $token = auth()->user()->createToken('access_token')->plainTextToken;
            $notifications = auth()->user()->notifications;
            $count = auth()->user()->unreadNotifications->count();

            $response = [
                'user' => auth()->user()->load(['roles', 'profile']),
                'notifications' => [
                    'data' => $notifications,
                    'count' => $count
                ],
                'token' => $token
            ];

            return $response;
        }

        $user->update([
            'login_attempt' => $user->login_attempt + 1
        ]);

        $user->refresh();

        return response([
            'message' => 'invalid credentials, ' . (3 - $user->login_attempt) . ' more attempts left'
        ], 401);
    }

    public function me() {
        $user = auth()->user()->load(['roles', 'profile']);
        $notifications = auth()->user()->notifications;
        $count = auth()->user()->unreadNotifications->count();

        $response = [
            'user' => $user,
            'notifications' => [
                'data' => $notifications,
                'count' => $count
            ],
        ];
        return $response;
    }

    public function saveToken(Request $request) {
        $user = auth()->user();

        return WebNotification::storeToken($user, $request->input('token'));
    }

    public function logout(Request $request) {
        auth()->user()->tokens()->delete();

        WebNotification::removeToken(auth()->user());

        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $fields = $request->validate([
            'name' => 'required|string',
        ]);

        $username = str_replace(' ', '', trim($fields['name']));

        //$user = User::find($user);
        $user->update([
            'name' =>  $fields['name'],
            'username' => strtolower($username),
        ]);

        $user->profile()->update($request->except(['avatar', '_method' ]));

        if ($request->hasFile('avatar')) {
            $user->clearMediaCollection('avatars');

            $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
    
            $mediaUrl = $user->getFirstMediaUrl('avatars');
    
            $user->update([
                'avatar' => $mediaUrl,
            ]);
        }

        $user->refresh()->load(['profile','roles']);

        $response = [
            'user' => $user,
        ];

        return $response;
    }

    public function changePass(Request $request)
    {
        $user = auth()->user();

        $fields = $request->validate([
            'password' => 'required|string',
            'new_password' => 'required|string|confirmed'
        ]);

        if(!Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'wrong password'
            ], 401);
        }

        if(!$user->email_verified_at) {
            $user->markEmailAsVerified();
        }
        $user->update([
            'password' => bcrypt($fields['new_password']),
        ]);

        return response([
            'message' => 'password update successful'
        ]);
    }

    public function forgotPass(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
                    ? back()->with(['status' => __($status)])
                    : back()->withErrors(['email' => __($status)]);
    }

    public function resetPass(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);
    
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) use ($request) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'login_attempt' => 0
                ])->setRememberToken(Str::random(60));
    
                $user->save();
    
                event(new PasswordReset($user));
            }
        );
    
        return $status == Password::PASSWORD_RESET
                    ? redirect()->route('home')->with('status', __($status))
                    : back()->withErrors(['email' => [__($status)]]);
    }

}