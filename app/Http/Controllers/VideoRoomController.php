<?php

namespace App\Http\Controllers;

use App\Events\AgentConnected;
use App\Events\BreakoutRoomCreated;
use App\Events\LivecallUpdate;
use App\Models\BreakoutRoom;
use App\Models\LiveCall;
use App\Models\VideoRoom;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Crypt;
use Twilio\Rest\Client;

class VideoRoomController extends Controller
{
    private $accout_sid;
    private $api_key;
    private $api_secret;
    private $auth_token;

    public function __construct()
    {
        $this->accout_sid = getenv('TWILIO_ACCOUNT_SID');
        $this->api_key = getenv('TWILIO_API_KEY');
        $this->api_secret = getenv('TWILIO_API_SECRET');
        $this->auth_token = getenv('TWILIO_AUTH_TOKEN');
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return VideoRoom::with('breakouts')->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function create_room(Request $request)
    {
        $user = auth()->user();
        $fields = $request->validate([
            'roomName' => 'required|string',
            'livecall' => 'required|string'
        ]);

        $livecall = LiveCall::find($fields['livecall']);

        if(!$livecall){
            $response = [
                'msg' => 'Invalid ID'
            ];
            return response($response, 400);
        }

        if($livecall->answered_at || $livecall->left_at){
            $response = [
                'msg' => 'Livecall request no longer available'
            ];
            return response($response, 400);
        }

        $twilio = new Client($this->accout_sid, $this->auth_token);

        $room = $twilio->video->v1->rooms->create([
                                       "type" => "group",
                                       "uniqueName" => $fields['roomName']
                                   ]);

        $password = rand(100000, 999999);

        $hashPassword = Hash::make($password);

        $encrptPassword = Crypt::encryptString($password);

        $videoRoom = $livecall->video_room()->create([
            'id' => $room->sid,
            'name' => $room->uniqueName,
            'host' => $user->id,
            'password' => $hashPassword
        ]);

        $videoRoom->toArray();

        $videoRoom->pwd = $encrptPassword;
        
        $livecall->update([
            'agent_id' => $user->id,
            'answered_at' => Carbon::now()
        ]);

        LivecallUpdate::dispatch($livecall);
        AgentConnected::dispatch($livecall, $videoRoom, $encrptPassword);

        return response($videoRoom, 201);
    }

    public function create_breakout_room(Request $request, $id)
    {
        $fields = $request->validate([
            'roomName' => 'required|string',
            'participants' => 'required|array'
        ]);

        $videoRoom = VideoRoom::find($id);

        $twilio = new Client($this->accout_sid, $this->auth_token);

        $room = $twilio->video->v1->rooms->create([
                                       "type" => "group",
                                       "uniqueName" => $fields['roomName']
                                   ]);

        $videoRoom->breakouts()->create([
            'id' => $room->sid,
            'name' => $room->uniqueName,
            'participants' => $fields['participants']
        ]);

        $videoRoom->refresh()->load('breakouts');

        BreakoutRoomCreated::dispatch($videoRoom);

        return response('', 201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        return VideoRoom::find($id)->load('breakouts');
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function get_access_token(Request $request)
    {
        $fields = $request->validate([
            'room' => 'required|string',
            'password' => 'required|string',
            'identity' => 'required|string'
        ]);

        $room = $fields['room'];

        $videoRoom = VideoRoom::find($fields['room']);

        if(!$videoRoom){
            return response([
                'msg' => 'Invalid ID'
            ], 401);
        }

        $password = Crypt::decryptString($fields['password']);

        //Check password
        if(!Hash::check($password, $videoRoom->password)) {
            return response([
                'msg' => 'Invalid password'
            ], 401);
        }

        if($request->filled('breakoutRoom')){
            $breakoutRoomArr = $videoRoom->breakouts()->where('id', $request->breakoutRoom)->get();

            $breakoutRoom = $breakoutRoomArr[0];

            if(!$breakoutRoom){
                return response([
                    'msg' => 'Invalid breakout room ID'
                ], 401);
            }
            
            if(!in_array($fields['identity'], $breakoutRoom->participants)){
                return response([
                    'msg' => 'Unthorized to join this room'
                ], 401);
            }

            $data = Http::post('http://127.0.0.1:5000/twilio/connect', ['roomId' => $request->breakoutRoom, 'identity' => $fields['identity']])->throw()->json();

            return $data;
        }

        $data = Http::post('http://127.0.0.1:5000/twilio/connect', ['roomId' => $room, 'identity' => $fields['identity']])->throw()->json();

        return $data;
    }
 
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function remove_participant(Request $request)
    {
        $fields = $request->validate([
            'roomName' => 'required|string',
            'participant' => 'required|string'
        ]);

        $client = new Client($this->api_key, $this->api_secret);

        
        $participant = $client->video->rooms($fields['roomName'])->participants($fields['participant'])->update(array("status" => "disconnected"));

        return $participant;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function end($id)
    {
        $videoRoom =VideoRoom::find($id);

        $client = new Client($this->api_key, $this->api_secret);
        $room = $client->video->v1->rooms($id)->update('completed');

        if($videoRoom){
            $breakouts = $videoRoom->breakouts;         

            foreach ($breakouts as $breakout) {
                $client->video->v1->rooms($breakout->id)->update('completed');
            }
        }

        return $room;
    }
}