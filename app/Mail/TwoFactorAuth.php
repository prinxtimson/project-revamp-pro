<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TwoFactorAuth extends Mailable
{
    use Queueable, SerializesModels;

    public $code;

    public $user;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($code, $user)
    {
        $this->code = $code;
        $this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = 'OTP Authentication';

        return $this->markdown('emails.two_factor_auth')->subject($subject);
    }
}
