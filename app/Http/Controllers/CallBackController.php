<?php

namespace App\Http\Controllers;

use App\Models\CallBack as ModelsCallBack;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CallBackController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $callbacks = ModelsCallBack::orderBy('id', 'DESC')->paginate(20);

        return $callbacks;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
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
            'name' => 'required',
            'phone' => 'required',
            'email' => 'required',
            'time' => 'required',
            'date' => 'required'
        ]);

        $response = ModelsCallBack::create([
            'name' => $fields['name'],
            'phone' => $fields['phone'],
            'email' => $fields['email'],
            'date' => $fields['date'],
            'time' => $fields['time']
        ]);

        // Carbon::createFromDate($fields['date'], $fields['time'])

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
        return ModelsCallBack::find($id);
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
    public function update(Request $request, $id)
    {
        $callback = ModelsCallBack::find($id);

        $callback->update($request->all());

        return $callback;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $callback = ModelsCallBack::find($id);

        return $callback->delete();
    }
}