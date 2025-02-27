<?php

namespace App\Http\Controllers;

use App\Exports\CustomerReviewExport;
use App\Models\LiveCall;
use App\Models\Survey;
use App\Models\User;
use App\Notifications\NegativeFeedback;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Maatwebsite\Excel\Excel;

class SurveyController extends Controller
{
    private $excel;

    public function __construct(Excel $excel)
    {
        $this->excel = $excel;
    }

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

    public function filterSurvey(Request $request)
    {
        $user = $request->user_id;
        $from = $request->from;
        $to =  $request->to;
        $category = $request->has('category') ? strtolower($request->category) : null;

        $surveys = Survey::where(function ($q) use ($user){
            if($user != "undefined"){
                return $q->where('user_id', $user);
            }else {
                return $q;
            }
        })->where(function ($q) use ($category){
            if($category != "undefined"){
                return $q->where('support_type', $category);
            }else {
                return $q;
            }
        })->where(function ($q) use ($from, $to){
            if($from != "undefined" && $to != "undefined"){
                return $q->whereBetween('created_at', [$from, $to]);
            }else {
                return $q;
            }
        })->get();
       
        return response()->json($surveys);
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

    public function download(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $type = $request->type;
        $date = Carbon::now()->getTimestamp();

        if(isset($type) && $type == 'csv'){
            $filename =  'live_support_customer_review_'.$date.'.'.$type;
            return $this->excel->download(new CustomerReviewExport($from, $to), $filename, Excel::CSV); 
        }

        if(isset($type) && $type == 'pdf'){
            $filename =  'live_support_customer_review_'.$date.'.'.$type;
            return $this->excel->download(new CustomerReviewExport($from, $to), $filename, Excel::MPDF);
        }
        
        $filename =  'live_support_customer_review_'.$date.'.xlsx';
        return $this->excel->download(new CustomerReviewExport($from, $to), $filename, Excel::XLSX);
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
            'data' => 'required',
            'support_type' => 'required|string',
            'support_id' => 'required|integer',
            'comment' => 'string|nullable',
            'user_id' => 'nullable|integer' 
        ]);

        $survey = Survey::create($fields);

        $total_ratings = (array_reduce($fields['data'], function($a, $b) {
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