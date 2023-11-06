<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReportShare extends Mailable
{
    use Queueable, SerializesModels;

    private $attachment;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($attachment)
    {
        $this->attachment = $attachment;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $subject = 'Live Support Report';

        return $this->markdown('emails.report_share')
                    ->subject($subject)
                    ->attachFromStorage($this->attachment);
    }
}
