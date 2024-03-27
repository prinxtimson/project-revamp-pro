<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Mail\AccountLocked;
use App\Mail\ProfileEditMail;
use App\Models\LiveCall;
use App\Models\Setting;
use App\Models\Survey;
use App\Models\Ticket;
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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

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
                'login_attempt' => 0,
                'login_at' => Carbon::now()
            ]);

            $request->session()->regenerate();

            $token = $user->createToken('access_token')->plainTextToken;
            $user->generate_token();

            $response = [
                'user' => $user->load(['roles', 'profile']),    
                'token' => $token
            ];

            return $response;
        }

        $user->update([
            'login_attempt' => $user->login_attempt + 1
        ]);

        $user->refresh();
        
        if($user->login_attempt == "3"){
            $passwordToken = Password::createToken($user);
            $url = env("APP_URL_ADMIN") . "/password/reset" . "/" . $passwordToken . "?email=" . $user->email;
            
            Mail::to($user)->send(new AccountLocked($url, $user->name));
        }

        return response([
            'message' => 'invalid credentials, ' . (3 - $user->login_attempt) . ' more attempts left'
        ], 401);
    }

    public function me() {
        $user = User::find(auth()->id());
        $user->load(['roles', 'profile']);
        $user->update([
            'login_at' => Carbon::now()
        ]);
        $user->refresh();

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

    private function get_customer_satisfaction($user_id){
        $surveys = Survey::select('data')->where('user_id', $user_id)->get();
        $surveys = array_column($surveys->toArray(), 'data');
                        
        $surveys = array_column(array_merge(...$surveys), 'rating');
        $total = count($surveys);
        $surveys = $total > 0 ? round(((array_reduce($surveys, function($a, $b) {
                                    return $a+$b;
                            }, 0)/($total*10))*100), 1) : 0;
        return $surveys;
    }

    private function get_average_handle_time($user_id)
    {
        $tickets = Ticket::where('user_id', $user_id)->where('status', 'close')->get();
        $tickets = $tickets->toArray();
        $total = count($tickets);
        $tickets = $total > 0 ? round((array_reduce($tickets, function($a, $b) {
            if($b['status'] == 'close'){
                $startTime = new Carbon($b['created_at']);
                $endTime = new Carbon($b['updated_at']);
                $diff = $startTime->diffInMinutes($endTime);
                return $a+$diff;
            }
            return $a;
        }, 0)/$total), 1) : 0;

        return $tickets;
    }

    private function get_average_response_time($user_id)
    {
        $livecalls = LiveCall::where('agent_id', $user_id)->whereNotNull('answered_at')->get();
        $livecalls = $livecalls->toArray();
        $total = count($livecalls);
        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
            $startTime = new Carbon($b['created_at']);
            $endTime = new Carbon($b['answered_at']);
            $diff = $startTime->diffInMinutes($endTime);
            return $a+$diff;
        }, 0)/$total), 1) : 0;

        return $livecalls;
    }

    private function get_abandonment_rate()
    {
        $total_abandon = LiveCall::whereNotNull('left_at')->count();
        $total_livecalls = LiveCall::count();
        $rate = $total_livecalls > 0 ? round((($total_abandon/$total_livecalls)*100), 1) : 0;

        return $rate;
    }

    private function get_customer_wait_time($user_id)
    {
        $livecalls = LiveCall::where('agent_id', $user_id)->whereNotNull('answered_at')->get();
        $livecalls = $livecalls->toArray();
        $total = count($livecalls);
        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
            $startTime = new Carbon($b['created_at']);
            $endTime = new Carbon($b['answered_at']);
            $diff = $startTime->diffInMinutes($endTime);
            return $a+$diff;
        }, 0)/$total), 1) : 0;

        return $livecalls;
    }

    private function get_call_wrap_up_time($user_id)
    {
        $livecalls = LiveCall::where('agent_id', $user_id)->whereNotNull('answered_at')->get();
        $livecalls = $livecalls->toArray();
        $total = count($livecalls);
        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
            $startTime = new Carbon($b['answered_at']);
            $endTime = new Carbon($b['ended_at']);
            $diff = $startTime->diffInMinutes($endTime);
            return $a+$diff;
        }, 0)/$total), 1) : 0;

        return $livecalls;
    }

    public function saveToken(Request $request) {
        $user = auth()->user();

        return WebNotification::storeToken($user, $request->input('token'));
    }

    public function logout(Request $request) {
        $user = User::find(auth()->id());
        $user->update([
            'login_at' => null
        ]);
        $user->tokens()->delete();

        WebNotification::removeToken($user);

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => "Logout successful"
        ]);
    }

    public function update(Request $request)
    {
        $fields = $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'username' => 'string|unique:users,username'
        ]);

        $user = User::find(auth()->id());
        $user->name = $fields['firstname'] .' '. $fields['lastname'];

        if(isset($fields['username'])){
            $user->username = strtolower($fields['username']);
        }
        
        $user->save();

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

        Mail::to($user)->send(new ProfileEditMail($user));
        $response = [
            'user' => $user,
        ];

        return $response;
    }

    public function changePass(Request $request)
    {
        $user = User::find(auth()->id());

        $fields = $request->validate([
            'password' => 'required|string ',
            'new_password' => [
                'required',
                'min:8',
                'regex:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/',
                'confirmed'
            ]
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
                    ? response()->json([
                        "status" => $status,
                        "message" => 'Please check your email and follow the directions to reset your password'
                    ])
                    : response([
                        "status" => $status,
                        "message" => "Password reset request failed!"
                    ], 401);
    }

    public function resetPass(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'security_question' => 'string|nullable',
            'security_answer' => 'string|nullable',
            'password' => [
                'required',
                'min:8',
                'regex:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/',
                'confirmed'
            ]
        ]);

        $user = User::where('email', $request->input("email"))->first();

        $security_question = Setting::where('user_id', $user->id)->where('key', 'security_question')->first();
        $security_answer = Setting::where('user_id', $user->id)->where('key', 'security_answer')->first();

        if(isset($security_question) && strtoupper($security_question->value) !== strtoupper($request->input('security_question')))
        {
            return response([
                'message' => 'Incorrect security question'
            ], 401);
        }

        if(isset($security_answer) && strtoupper($security_answer->value) !== strtoupper($request->input('security_answer')))
        {
            return response([
                'message' => 'Incorrect security answer'
            ], 401);
        }
    
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
    
        $status == Password::PASSWORD_RESET;

        if($status){
            return response([
                'message' => 'Password reset successful'
            ]);
        }else {
            Password::sendResetLink(
                $request->only('email')
            );

            return response([
                'message' => 'Password reset failed, a new password reset email had been sent'
            ], 401);
        }
    }

    public function unlockAccount(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email',
            'security_question' => 'string|nullable',
            'security_answer' => 'string|nullable',
            'password' => [
                'required',
                'min:8',
                'regex:/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/',
                'confirmed'
            ]
        ]);

        $user = User::where('email', $request->input("email"))->first();

        $security_question = Setting::where('user_id', $user->id)->where('key', 'security_question')->first();
        $security_answer = Setting::where('user_id', $user->id)->where('key', 'security_answer')->first();

        if(isset($security_question) && strtoupper($security_question->value) !== strtoupper($request->input('security_question')))
        {
            return response([
                'message' => 'Incorrect security question'
            ], 401);
        }

        if(isset($security_answer) && strtoupper($security_answer->value) !== strtoupper($request->input('security_answer')))
        {
            return response([
                'message' => 'Incorrect security answer'
            ], 401);
        }
    
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
    
        $status == Password::PASSWORD_RESET;

        if($status){
            return response([
                'message' => 'Account unlock successful'
            ]);
        }else {
            $passwordToken = Password::createToken($user);
            $url = env("APP_URL_ADMIN") . "/password/reset" . "/" . $passwordToken . "?email=" . $user->email;
            
            Mail::to($user)->send(new AccountLocked($url, $user->name));

            return response([
                'message' => 'Password reset failed, a new password reset email had been sent'
            ], 401);
        }

    }

    public function delete()
    {
        $user = User::find(auth()->id());

        $deleted = $user->forceDelete();

        //Mail::to($user)->send(new UserDelete($user->profile));

        return $deleted;
    }

}