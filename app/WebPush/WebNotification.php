<?php

namespace App\WebPush;

use App\Models\User; 


class WebNotification
{
  
   
    public static function removeToken($user)
    {
      $user->update(['device_key' => null]);
        return response()->json(['Token removed successfully.']);
    }
  
    public static function storeToken($user, $token)
    {
        $user->update(['device_key' => $token]);
        return response()->json(['Token successfully stored.']);
    }
  
    public static function sendWebNotification($request)
    {
        $url = 'https://fcm.googleapis.com/fcm/send';
        $FcmToken = User::whereNotNull('device_key')->pluck('device_key')->all();
          
        $serverKey = env('FIREBASE_SERVER_KEY');
  
        $data = [
            "registration_ids" => $FcmToken,
            "notification" => [
                "title" => $request['title'],
                "body" => $request['body'],  
            ]
        ];
        $encodedData = json_encode($data);
    
        $headers = [
            'Authorization:key=' . $serverKey,
            'Content-Type: application/json',
        ];
    
        $ch = curl_init();
      
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
        // Disabling SSL Certificate support temporarly
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);        
        curl_setopt($ch, CURLOPT_POSTFIELDS, $encodedData);
        // Execute post
        $result = curl_exec($ch);
        if ($result === FALSE) {
            die('Curl failed: ' . curl_error($ch));
        }        
        // Close connection
        curl_close($ch);
        // FCM response
        error_log($result);        
    }
}