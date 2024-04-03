<?php

namespace App\Models;

use App\Mail\TwoFactorAuth;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Mail;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Twilio\Rest\Client;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, InteractsWithMedia, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'avatar',
        'email',
        'phone',
        'device_key',
        'login_attempt',
        'username',
        'password',
        'login_at'
    ];

    protected $guard_name = 'api';

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'login_at' => 'datetime'
    ];

    public function profile () 
    {
        return $this->hasOne(Profile::class);
    }

    public function settings () 
    {
        return $this->hasMany(Setting::class);
    }

    public function surveys () 
    {
        return $this->hasMany(Survey::class);
    }

    public function user_code ()
    {
        return $this->hasOne(UserCode::class);
    }

    public function callbacks()
    {
        return $this->hasMany(CallBack::class, 'agent_id');
    }

    public function livecalls()
    {
        return $this->hasMany(LiveCall::class, 'agent_id');
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function chat_messages()
    {
        return $this->hasMany(ChatMessage::class);
    }

    public function report_templates () 
    {
        return $this->hasMany(ReportTemplate::class);
    }

    public function generate_code ()
    {
        $code = rand(100000, 999999);

        $this->user_code()->updateOrCreate(['user_id' => $this->id], [
            'code' => $code
        ]);

        $receiverNum = $this->phone;
        $message = "Your Login OTP code is ". $code;

        try {
            // $account_sid = getenv("TWILIO_ACCOUNT_SID");
            // $auth_token = getenv("TWILIO_AUTH_TOKEN");
            // $number = getenv("TWILIO_FROM");
    
            // $client = new Client($account_sid, $auth_token);
            // $client->messages->create($receiverNum, [
            //     'from' => $number, 
            //     'body' => $message]);
            Mail::to($this)->send(new TwoFactorAuth($code, $this));
    
        } catch (\Exception $e) {
            error_log($e);
        }
    }
}