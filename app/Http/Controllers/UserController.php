<?php

namespace App\Http\Controllers;

use App\Exports\LeaderboardExport;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\UploadedFile;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Carbon\Carbon;
use App\Models\User;
use App\Mail\NewUser;
use App\Mail\TrainingRecommend;
use App\Models\LiveCall;
use App\Models\Survey;
use App\Models\Ticket;
use Exception;
use Maatwebsite\Excel\Excel;

class UserController extends Controller
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
        $users = User::withTrashed()->with(['roles'])->paginate(20);

        return $users;
    }

    public function agents()
    {
        $agents = User::role('agent')->with(['roles'])->paginate(20);

        return $agents;
    }

    public function download(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $type = $request->type;
        $date = Carbon::now()->getTimestamp();

        if(isset($type) && $type == 'csv'){
            $filename =  'live_support_leaderboard'.$date.'.'.$type;
            return $this->excel->download(new LeaderboardExport($from, $to), $filename, Excel::CSV); 
        }

        if(isset($type) && $type == 'pdf'){
            $filename =  'live_support_leaderboard'.$date.'.'.$type;
            return $this->excel->download(new LeaderboardExport($from, $to), $filename, Excel::MPDF);
        }
        
        $filename =  'live_support_leaderboard'.$date.'.xlsx';
        return $this->excel->download(new LeaderboardExport($from, $to), $filename, Excel::XLSX);
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
            'phone' => 'max:255|unique:users,phone',
            'password' => 'required|string',
            'job_title' => 'string|required'
        ]);

        $user = User::create([
            'name' =>  $fields['firstname'].' '.$fields['lastname'],
            'email' => $fields['email'],
            'phone' => $fields['phone'],
            'username' => strtolower($fields['firstname'].$fields['lastname']),
            'avatar' => '/images/no_img.png',
            'password' => bcrypt($fields['password'])
        ]);

        $user->profile()->create([
            'firstname' => $fields['firstname'],
            'lastname' => $fields['lastname'],
            'phone' => $fields['phone'],
            'job_title' => $fields['job_title'],
        ]);

        $user->assignRole($fields['role']);

        //event(new NewUserAdded($fields));
        Mail::to($user)->send(new NewUser($fields));

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
        $user = User::find($id)
                    ->load(['profile', 'roles']);
        if($user->hasRole('agent')){
            $user->performance_indicators = [
                'customer_satisfaction' => $this->get_customer_satisfaction($user->id),
                'average_handle_time' => $this->get_average_handle_time($user->id),
                'average_response_time' => $this->get_average_response_time($user->id),
                'customer_wait_time' => $this->get_customer_wait_time($user->id),
                'call_wrap_up_time' => $this->get_call_wrap_up_time($user->id),
            ];
        }

        return $user;
    }

    private function get_customer_satisfaction($user_id){
        $surveys = Survey::select('data')->where('user_id', $user_id)->get();
        $surveys = array_column($surveys->toArray(), 'data');
                        
        $surveys = array_column(array_merge(...$surveys), 'rating');
        $total = count($surveys);
        $surveys = $total > 0 ? round(((array_reduce($surveys, function($a, $b) {
                                    return $a+$b;
                            }, 0)/($total*10))*100), 1) : 0;
        return $surveys;
    }

    private function get_average_handle_time($user_id)
    {
        $tickets = Ticket::where('user_id', $user_id)->where('status', 'close')->get();
        $tickets = $tickets->toArray();
        $total = count($tickets);
        $tickets = $total > 0 ? round((array_reduce($tickets, function($a, $b) {
            if($b['status'] == 'close'){
                $startTime = new Carbon($b['created_at']);
                $endTime = new Carbon($b['updated_at']);
                $diff = $startTime->diffInMinutes($endTime);
                return $a+$diff;
            }
            return $a;
        }, 0)/$total), 1) : 0;

        return $tickets;
    }

    private function get_average_response_time($user_id)
    {
        $livecalls = LiveCall::where('agent_id', $user_id)->whereNotNull('answered_at')->get();
        $livecalls = $livecalls->toArray();
        $total = count($livecalls);
        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
            $startTime = new Carbon($b['created_at']);
            $endTime = new Carbon($b['answered_at']);
            $diff = $startTime->diffInMinutes($endTime);
            return $a+$diff;
        }, 0)/$total), 1) : 0;

        return $livecalls;
    }

    private function get_abandonment_rate()
    {
        $total_abandon = LiveCall::whereNotNull('left_at')->count();
        $total_livecalls = LiveCall::count();
        $rate = $total_livecalls > 0 ? round((($total_abandon/$total_livecalls)*100), 1) : 0;

        return $rate;
    }

    private function get_customer_wait_time($user_id)
    {
        $livecalls = LiveCall::where('agent_id', $user_id)->whereNotNull('answered_at')->get();
        $livecalls = $livecalls->toArray();
        $total = count($livecalls);
        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
            $startTime = new Carbon($b['created_at']);
            $endTime = new Carbon($b['answered_at']);
            $diff = $startTime->diffInMinutes($endTime);
            return $a+$diff;
        }, 0)/$total), 1) : 0;

        return $livecalls;
    }

    private function get_call_wrap_up_time($user_id)
    {
        $livecalls = LiveCall::where('agent_id', $user_id)->whereNotNull('answered_at')->get();
        $livecalls = $livecalls->toArray();
        $total = count($livecalls);
        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
            $startTime = new Carbon($b['answered_at']);
            $endTime = new Carbon($b['ended_at']);
            $diff = $startTime->diffInMinutes($endTime);
            return $a+$diff;
        }, 0)/$total), 1) : 0;

        return $livecalls;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function search($query)
    {
        $search = collect();

        foreach(User::where('name', 'like', '%'.$query.'%')->with('role')->get() as $q) {
            $search->push($q);
        }
        foreach(User::where('username', 'like', '%'.$query.'%')->with('role')->get() as $q) {
            $search->push($q);
        }
        foreach(User::where('email', 'like', '%'.$query.'%')->with('role')->get() as $q) {
            $search->push($q);
        }

        $weight = $search->countBy('email')->all();
        $result = [];

        foreach($search->unique('id')->values()->all() as $val){
            $val['weight'] = $weight[$val['email']];
            $result[] = $val;
        }

        array_multisort(array_column($result, 'weight'), SORT_DESC, $result);

        return response()->json($result);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        //
        $fields = $request->validate([
            'firstname' => 'required|string',
            'lastname' => 'required|string',
            'phone' => 'max:255|nullable',
            'username' => 'string|nullable'
        ]);

        $user->name = $fields['firstname'] .' '. $fields['lastname'];

        if(isset($fields['username'])){
            $user->username = strtolower($fields['username']);
        }
        if(isset($fields['phone'])){
            $user->phone = $fields['phone'];
        }
        
        $user->save();

        $user->profile()->update($request->except(['avatar', '_method', 'email', 'username' ]));

        if ($request->hasFile('avatar')) {
            $user->clearMediaCollection('avatars');

            $user->addMediaFromRequest('avatar')->toMediaCollection('avatars');
    
            $mediaUrl = $user->getFirstMediaUrl('avatars');
    
            $user->update([
                'avatar' => $mediaUrl,
            ]);
        }

        $user->refresh()->load(['profile', 'roles']);

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

    public function recommend_training(Request $request)
    {
        $fields = $request->validate([
            'user_id' => 'required|integer',
            'course' => 'required|string',
            'reason' => 'required|string',
            'expected_end_date' => 'required|string'
        ]);

        try {
            $user = User::find($fields['user_id']);

            $fields['name'] = $user->name;
            $fields['expected_end_date'] = Carbon::parse($fields['expected_end_date'])->format('M d Y');

            Mail::to($user)->send(new TrainingRecommend($fields));

            return response()->json(['message' => 'Training recommended successful']);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()], 400);
        }
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
        $user = User::withTrashed()->find($id)->load(['roles']);

        $deleted = $user->forceDelete($id);

        //Mail::to($user)->send(new UserDelete($user->profile));

        return $deleted;
    }

    public function markNotification()
    {
        $user = auth()->user();

        $user->unreadNotifications->markAsRead();

        $response = [
            'data' => $user->notifications,
            'count' => $user->unreadNotifications->count(),
        ];

        return $response;
    }
}