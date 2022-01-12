<?php

namespace App\Http\Controllers;

//require_once '/path/to/vendor/autoload.php'; // Loads the library

use App\Events\AgentConnected;
use OpenTok\OpenTok;
use Twilio\Rest\Client;
use App\Events\LivecallUpdate;
use App\Models\LiveCall as ModelsLiveCall;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class LiveCallController extends Controller
{

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

    public function remove_participant(Request $request)
    {
        $fields = $request->validate([
            'roomName' => 'required|string',
            'participant' => 'required|string'
        ]);

        $api_key = getenv('TWILIO_API_KEY');
        $api_secret = getenv('TWILIO_API_SECRET');
        $client = new Client($api_key, $api_secret);

        
        $participant = $client->video->rooms($fields['roomName'])->participants($fields['participant'])->update(array("status" => "disconnected"));

        return $participant;
    }

    public function connect($id)
    {
        $user = auth()->user();
        $roomName = 'call_'.$id;
        $identity = $user->username;
        $token = $user->createToken('access_token')->plainTextToken;
        $baseUrl = getenv('APP_URL');

        $livecall = ModelsLiveCall::find($id);

        if($livecall->answered_at || $livecall->left_at){
            $response = [
                'msg' => 'Livecall request no longer available'
            ];
            return response($response, 400);
        }

        $livecall->update([
            'agent_id' => $user->id,
            'answered_at' => Carbon::now()
        ]);

        LivecallUpdate::dispatch($livecall);

        $data = Http::withToken($token)->post($baseUrl.'/twilio/connect', ['roomName' => $roomName, 'identity' => $identity, 'role' => 'host'])->throw()->json();

        return $data;
    }

    public function on_connected(Request $request, $id)
    {
        $fields = $request->validate([
            'roomName' => 'required|string',
            'identity' => 'required|string'
        ]);
        $livecall = ModelsLiveCall::find($id);

        $data = Http::post('http://localhost:5000/twilio/connect', $fields)->throw()->json();

        AgentConnected::dispatch($livecall, $data);

        return response('', 200);
    }

    public function con($id) 
    {
        $user = auth()->user();   
        $roomName = 'call_'.$id;
        $api_key = getenv('OPENTOK_API_KEY');
        $api_secret = getenv('OPENTOK_API_SECRET');
    
        $opentok = new OpenTok($api_key, $api_secret);

        $livecall = ModelsLiveCall::find($id);

        // if($livecall->answered_at || $livecall->left_at){
        //     $response = [
        //         'msg' => 'Livecall request no longer available'
        //     ];
        //     return response($response, 400);
        // }

            $session = $opentok->createSession();
            $sessionId = $session->getSessionId();
            $token = $opentok->generateToken($sessionId);

            $livecall->update([
                'agent_id' => $user->id,
                'answered_at' => Carbon::now(),
                'session_id' => $sessionId
            ]);
    
            LivecallUpdate::dispatch($livecall); 

            return [
                'apiKey' => $api_key,
                'sessionId' => $sessionId,
                'token' => $token,
                'room' => $roomName,
                'id' => $user->username
            ];
        
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