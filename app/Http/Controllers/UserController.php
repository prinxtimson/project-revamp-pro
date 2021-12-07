<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $users = User::withTrashed()->with(['roles'])->paginate(20);

        return $users;
    }

    /**
     * Display auth user resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function me() {
        $user = auth()->user()->load(['roles', 'profile']);
        //$notifications = auth()->user()->notifications;
        //$count = auth()->user()->unreadNotifications->count();

        $response = [
            'user' => $user,
            'notifications' => [
                //'data' => $notifications,
                //'count' => $count
            ],
        ];
        return $response;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $fields = $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'role' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string'
        ]);

        $hash = md5(strtolower(trim($fields['email'])));

        $user = User::create([
            'name' =>  $fields['firstname'].' '.$fields['lastname'],
            'email' => $fields['email'],
            'username' => strtolower($fields['firstname'].$fields['lastname']),
            'avatar' => 'https://www.gravatar.com/avatar/'.$hash,
            'password' => bcrypt($fields['password'])
        ]);

        $user->profile()->create([
            'firstname' => $fields['firstname'],
            'lastname' => $fields['lastname'],
        ]);

        $user->assignRole($fields['role']);

        //event(new NewUserAdded($fields));
        //Mail::to($user)->send(new NewUser($fields));

        $response = [
            'user' => $user,
            'msg' => 'User added successfully.'
        ];

        return response($response, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return User::find($id)
                    ->load(['profile', 'roles']);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        //
        $fields = $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
        ]);

        $user = Auth::user();
        
        $user->update([
            'name' =>  $fields['firstname'] .' '. $fields['lastname'],
            'username' => strtolower($fields['firstname'].$fields['lastname']),
        ]);

        $user->profile()->update($request->except(['avatar', '_method' ]));

        if ($request->hasFile('avatar')) {
            $user->clearMediaCollection('avatars');

            $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
    
            $mediaUrl = $user->getFirstMediaUrl('avatars');
    
            $user->update([
                'avatar' => $mediaUrl,
            ]);
        }

        $user->refresh()->load(['profile', 'roles', 'projects']);

        $response = [
            'user' => $user,
            'msg' => 'User updated successfully.'
        ];

        return response($response);
    }

    
    public function disable($id)
    {
        User::find($id)->delete();

        $user = User::withTrashed()->find($id)->load(['profile', 'roles']);

        //Mail::to($user)->send(new UserDeactivate($user->profile));

        return $user;
    }

    public function enable($id)
    {
        User::withTrashed()->find($id)->restore();

        $user = User::withTrashed()->find($id)->load(['profile', 'roles']);

        //Mail::to($user)->send(new UserReactivate($user->profile));

        return $user;
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
        $user = User::withTrashed()->find($id)->load(['profile', 'roles']);

        $deleted = $user->forceDelete($id);

        //Mail::to($user)->send(new UserDelete($user->profile));

        return $deleted;
    }

    public function delete()
    {
        //
        $user = Auth::user();

        $deleted = $user->forceDelete($id);

        //Mail::to($user)->send(new UserDelete($user->profile));

        return $deleted;
    }
}