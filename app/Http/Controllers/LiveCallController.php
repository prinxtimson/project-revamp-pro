<?php

namespace App\Http\Controllers;

//require_once '/path/to/vendor/autoload.php'; // Loads the library

use Maatwebsite\Excel\Excel;
use App\Events\LivecallUpdate;
use App\Exports\LiveCallExport;
use App\Models\LiveCall as ModelsLiveCall;
use App\WebPush\WebNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class LiveCallController extends Controller
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
        $livecall = ModelsLiveCall::orderBy('id', 'DESC')->paginate(20);

        return $livecall;
    }

    public function waiting_list_count()
    {
        $count = ModelsLiveCall::whereNull('answered_at')->whereNull('left_at')->count();

        return $count;
    }

    public function filter_waiting_list()
    {
        $livecalls = ModelsLiveCall::whereNull('answered_at')->whereNull('left_at')->orderBy('id', 'DESC')->paginate(20);

        return $livecalls;
    }

    public function search_by_query_type($query_type)
    {
        $livecalls = ModelsLiveCall::where(
            'query_type', '=', $query_type
        )->orderBy('id', 'DESC')->paginate(20);

        return $livecalls;
    }



    public function summary()
    {
        $livecalls = ModelsLiveCall::count();
        $answered = ModelsLiveCall::whereNotNull('answered_at')->count();
        $left = ModelsLiveCall::whereNotNull('left_at')->count();

        return response([
            'total_livecalls' => $livecalls,
            'total_answered' => $answered,
            'total_left' => $left,
        ]);
     }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function download(Request $request)
    {
        $from = $request->from;
        $to = $request->to;

        return $this->excel->download(new LiveCallExport($from, $to), 'live_support_call.xlsx');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'query_type' => 'required',
        ]);

        $livecall = ModelsLiveCall::create($request->all());

        LivecallUpdate::dispatch($livecall);

       WebNotification::sendWebNotification(['title' => 'Livecall Request', 'body' => 'A new livecall request had been submitted.']);

        return response($livecall, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return ModelsLiveCall::find($id);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function leave($id)
    {
        $livecall = ModelsLiveCall::find($id);
        $livecall->update([
            'left_at' => Carbon::now()
        ]);

        LivecallUpdate::dispatch($livecall);

        return $livecall;
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
        $livecall = ModelsLiveCall::find($id);

        $livecall->update($request->all());
        
        LivecallUpdate::dispatch($livecall);

        return $livecall;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $livecall = ModelsLiveCall::find($id);

        return $livecall->delete();
    }
}