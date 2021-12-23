<?php

namespace App\Http\Controllers;

//require_once '/path/to/vendor/autoload.php'; // Loads the library
use Twilio\Rest\Client;
use Twilio\Jwt\AccessToken;
use Twilio\Jwt\Grants\VideoGrant;
use App\Events\LivecallUpdate;
use App\Models\LiveCall as ModelsLiveCall;
use Illuminate\Http\Request;
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

    public function connect($id)
    {
        $user = auth()->user();
        $twilioAccountSid = getenv('TWILIO_ACCOUNT_SID');
        $twilioAuthToken = getenv('TWILIO_AUTH_TOKEN');
        $twilioApiKey = getenv('TWILIO_API_KEY');
        $twilioApiSecret = getenv('TWILIO_API_KEY_SECRET');
        $roomName = 'call_'.$id;
        $identity = $user->username;

        $livecall = ModelsLiveCall::find($id);

        if($livecall->answered_at || $livecall->left_at){
            $response = [
                'msg' => 'Livecall request no longer available'
            ];

            return response($response, 400);
        }

        $client = new Client($twilioAccountSid, $twilioAuthToken);

        try {
            $client->video->v1->rooms($roomName)
            ->fetch();
          
          } catch (\Exception $e) {
          
            $client->video->v1->rooms
            ->create([
                "uniqueName" => $roomName,
                "type" => "go",
            ]);
          }

        $token = new AccessToken(
            $twilioAccountSid,
            $twilioApiKey,
            $twilioApiSecret,
            3600,
            $identity
        );

        // Create Video grant
        $videoGrant = new VideoGrant();
        $videoGrant->setRoom($roomName);

        // Add grant to token
        $token->addGrant($videoGrant);

        $livecall->update([
            'agent_id' => $user->id,
            'answered_at' => Carbon::now()
        ]);

        LivecallUpdate::dispatch($livecall);

        return [
            'token' => $token->toJWT(),
            'room' => $roomName,
            'identity' => $identity
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