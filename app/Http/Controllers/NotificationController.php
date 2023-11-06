<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    
    public function index(Request $request)
    {
        $notifications = [
            'data' => auth()->user()->notifications,
            'count' => auth()->user()->unreadNotifications->count()
        ];
        return response()->json($notifications);
    }

    public function markNotification()
    {

        auth()->user()->unreadNotifications->markAsRead();
        $notifications = [
            'data' => auth()->user()->notifications,
            'count' => auth()->user()->unreadNotifications->count()
        ];
        return response()->json($notifications);
    }
}
