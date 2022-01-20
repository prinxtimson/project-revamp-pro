<?php

namespace App\Events;

use App\Models\LiveCall;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AgentConnected implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $livecall;
    public $data;
    public $password;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(LiveCall $livecall, $data, $password)
    {
        $this->livecall = $livecall;
        $this->data = $data;
        $this->password = $password;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new Channel('livecall.'.$this->livecall->id);
    }
}