<?php

namespace App\Listeners;

use App\Events\LivecallUpdate;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendLivecallNotification
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  \App\Events\LivecallUpdate  $event
     * @return void
     */
    public function handle(LivecallUpdate $event)
    {
        //broadcast(new LivecallUpdate($event->livecall));
    }
}