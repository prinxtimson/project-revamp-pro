<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function getSettings(Request $request)
    {
        $user = auth()->user();

        return response()->json($user->settings);
    }

    public function updateSettings(Request $request)
    {
        try {
            $user = auth()->user();
            $fields = $request->validate([
                '*.key' => 'string|required',
                '*.value' => 'required'
            ]);
    
            foreach ($fields as $item) {
                Setting::updateOrCreate(
                    ['key' => $item['key'], 'user_id' => $user->id ],
                    ['value' => $item['value']]
                );
            }
            $user->refresh();
    
            return response()->json($user->settings);
        } catch (\Exception $e) {
            return response($e->getMessage(), 400);
        }

    }
}
