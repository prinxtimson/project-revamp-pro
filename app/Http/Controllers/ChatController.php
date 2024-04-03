<?php

namespace App\Http\Controllers;

use App\Events\NewMessage;
use App\Models\Chat;
use App\Models\ChatMessage;
use App\Models\User;
use App\WebPush\WebNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ChatController extends Controller
{
    public function index()
    {
        $chats = Chat::get();
        return response()->json($chats);
    }

    public function get_chat(Chat $chat)
    {
        return response()->json($chat->load('messages'));
    }

    public function start_chat(Request $request)
    {
        $fields = $request->validate([
            'name' => 'string|required'
        ]);

        $chat = Chat::create($fields);
        return response()->json($chat);
    }

    public function save(Request $request, Chat $chat)
    {
        if ($request->has('id')) {
            return $this->update($request);
        }

        $fields = $request->validate([
            'sender_name' => 'string|required',
            'sender_avatar' => 'string|nullable',
            'message' => 'string|nullable'
        ]);

        $user = auth()->user();
        if($user){
            $fields['user_id'] = $user->id;
            $chat->status = 'active';
        }

        if($request->hasFile('media')){
            $fields['media_format'] = $request->file('media')->extension();
            $path = $request->file('media')->store('media');
            $fields['media'] = Storage::url($path);
        }

        $message = $chat->messages()->create($fields);

        $chat->last_message_at = $message->created_at;
        $chat->last_message = $message->message ?? "attachment";
        $chat->save();

        NewMessage::dispatch($message->load('user'));
        WebNotification::sendWebNotification(['title' => 'New Message', 'body' => $message->message]);

        return response()->json($message->load('user'));
    }

    public function searchChats(Request $request, Chat $chat)
    {
        $query = $request->get('query');
        if(isset($query)){
            $messages = $chat->messages()->where('text', 'like', '%'.$query.'%')->get();
        }else {
            $messages = $chat->messages;
        }
        
        return response()->json($messages);
    }

    private function update(Request $request)
    {
        $message = ChatMessage::findOrFail($request->get('id'));
        $message->message = $request->get('message');
        $message->is_edited = 1;
        $message->save();
        $message->chat()->update([
            'last_message' => $message->message
        ]);
        NewMessage::dispatch($message->load('user'));
        WebNotification::sendWebNotification(['title' => 'New Message', 'body' => $message->message]);
        return response()->json($message->load('user'));
    }

    public function markRead(Chat $chat)
    {
        $user = User::find(auth()->user()->id);

        $messages = $chat->messages()->where('sender_id', '!=', $user->id)->whereNull('read_at')->get();
        foreach ($messages as $message) {
            $message->read_at = Carbon::now();
            $message->save();
        }

        return response()->json($messages->load('user'));
    }

    public function deleteMessage(ChatMessage $message)
    {
        
        if($message->user_id != auth()->user()->id)
            return response(['message' => 'Not permitted to delete message'], 400);

        $message->delete();
        if($message->chat->last_message_at == $message->created_at)
            $message->chat()->update(['last_message' => '']);

        return response()->json($message);
    }

    // public function deleteChat(Chat $chat)
    // {
    //     $chat->participants()->detach(auth()->user()->id);

    //     return response()->json($chat->load('participants'));
    // }

}
