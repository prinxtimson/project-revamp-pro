<?php

namespace App\Http\Controllers;

//require_once '/path/to/vendor/autoload.php'; // Loads the library

use Maatwebsite\Excel\Excel;
use App\Events\LivecallUpdate;
use App\Exports\LiveCallExport;
use App\Models\LiveCall as ModelsLiveCall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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

    public function on()
    {
        $livecalls = ModelsLiveCall::where('answered_at', '=', null)->where('left_at', '=', null)->get();

        return $livecalls;
    }

    public function search_by_query_type($query_type)
    {
        $livecalls = ModelsLiveCall::where(
            'query_type', '=', $query_type
        )->orderBy('id', 'DESC')->paginate(20);

        return $livecalls;
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