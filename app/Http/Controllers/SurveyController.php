<?php

namespace App\Http\Controllers;

use App\Models\LiveCall;
use App\Models\Survey;
use App\Models\User;
use App\Notifications\NegativeFeedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Survey::get();
    }

    public function getSurveyByUserId($id)
    {
        return Survey::where('user_id', $id)->get();
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
            'ratings' => 'required',
            'support_type' => 'required|string',
            'support_id' => 'required|integer',
            'comment' => 'string|nullable',
            'user_id' => 'required|integer' 
        ]);

        $survey = Survey::create([
            'data' => $fields['ratings'],
            'comment' => $fields['comment'],
            'support_type' => $fields['support_type'],
            'support_id' => $fields['support_id'],
            'user_id' => $fields['user_id']
        ]);

        $total_ratings = (array_reduce($fields['ratings'], function($a, $b) {
            return $a+$b['rating'];
        }, 0)/3);

        if($total_ratings < 5){
            $users = User::role('manager')->get();

            Notification::send($users, new NegativeFeedback($survey));
        }
        return response($survey, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Survey $survey)
    {
        return $survey;
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
    public function update(Request $request, Survey $survey)
    {

        $survey->update($request->all());

        $survey->refresh();

        return $survey;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey)
    {

        return $survey->delete();
    }
}