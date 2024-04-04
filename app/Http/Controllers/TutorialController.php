<?php

namespace App\Http\Controllers;

use App\Models\Tutorial;
use App\Models\User;
use App\Notifications\NewCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Notification;

class TutorialController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return response()->json(Tutorial::orderBy('id', 'DESC')->get());
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $fields = $request->validate([
            'title' => 'string|required',
            'description' => 'string|nullable',
            'video_url' => 'string|required'
        ]);
        $fields['user_id'] = auth()->id();

        if($request->hasFile('preview_image')){
            $path = $request->file('preview_image')->store('media');
            $fields['preview_image'] = Storage::url($path);
        }

        $tutorial = Tutorial::create($fields);

        $users = User::role(['agent', 'admin'])->get();
        Notification::send($users, new NewCourse($tutorial));

        return response()->json($tutorial->load('user'));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $tutorial = Tutorial::find($id);
        if(isset($tutorial)){
            return response()->json($tutorial->load('user'));
        }
        return response(['message' => 'Lesson Not Found!'], 400);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
