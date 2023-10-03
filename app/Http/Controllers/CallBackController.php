<?php

namespace App\Http\Controllers;

use App\Exports\CallbackExport;
use Maatwebsite\Excel\Excel;
use App\Mail\Callback;
use App\Mail\SubmitFeedback;
use App\Models\CallBack as ModelsCallBack;
use App\WebPush\WebNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class CallBackController extends Controller
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
        $callbacks = ModelsCallBack::orderBy('id', 'DESC')->paginate(20);

        return $callbacks;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function summary()
    {
        $callbacks = ModelsCallBack::count();
        $successful = ModelsCallBack::whereNotNull('called_at')->where('status', 'SUCCESSFUL')->count();
        $failed = ModelsCallBack::whereNotNull('called_at')->where('status', 'FAILED')->count();
        $waiting = ModelsCallBack::whereNull('called_at')->count();

        return response([
            'total_callbacks' => $callbacks,
            'total_successful' => $successful,
            'total_failed' => $failed,
            'total_waiting' => $waiting
        ]);
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
            'name' => 'required|string',
            'query_type' => 'required|string',
            'phone' => 'required',
            'email' => 'required',
            'time' => 'required',
            'date' => 'required'
        ]);

        $response = ModelsCallBack::create($fields);

        WebNotification::sendWebNotification(['title' => 'Callback Request', 'body' => 'A new callback request had been submitted.']);

        // Carbon::createFromDate($fields['date'], $fields['time'])

        Mail::to($fields['email'])->send(new Callback($response)); 

        return response($response, 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(ModelsCallBack $callback)
    {
        return $callback;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function success($id)
    {
        $user = auth()->user();
        $callback = ModelsCallBack::find($id);
        $callback->update([
            'agent_id' => $user->id,
            'called_at' => Carbon::now(),
            'status' => 'SUCCESSFUL'
        ]);
        $callback->toArray();
        $callback->support_type = 'callback';
        Mail::to($callback->email)->send(new SubmitFeedback($callback));
    
        return $callback;
    }

    public function fail($id)
    {
        $user = auth()->user();
        $callback = ModelsCallBack::find($id);
        $callback->update([
            'agent_id' => $user->id,
            'called_at' => Carbon::now(),
            'status' => 'FAILED'
        ]);

        return $callback;
    }

    public function cancel($id)
    {
        $callback = ModelsCallBack::find($id);
        $callback->update([
            
            'status' => 'CANCELED'
        ]);

        return $callback;
    }

    public function download(Request $request)
    {
        $from = $request->from;
        $to = $request->to;

        return $this->excel->download(new CallbackExport($from, $to), 'live_support_call.xlsx');
    }

    public function search($query)
    {
        $search = collect();

        foreach(ModelsCallBack::where('name', 'like', '%'.$query.'%')->get() as $q) {
            $search->push($q);
        }
        foreach(ModelsCallBack::where('email', 'like', '%'.$query.'%')->get() as $q) {
            $search->push($q);
        }
        foreach(ModelsCallBack::where('date', $query)->get() as $q) {
            $search->push($q);
        }

        $result = [];

        foreach($search->unique('id')->values()->all() as $val){
            $result[] = $val;
        }

        return response()->json($result);
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

        if($callback->status == 'CANCELED' || isset($callback->called_at)){
            return response('You are not permitted to edit this booking', 400);
        }

        $callback->update($request->all());

        Mail::to($callback->email)->send(new Callback($callback)); 

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