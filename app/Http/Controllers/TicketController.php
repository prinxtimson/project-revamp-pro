<?php

namespace App\Http\Controllers;

use App\Exports\TicketExport;
use App\Mail\SubmitFeedback;
use App\Mail\TicketRaised;
use App\Mail\TicketStatusUpdate;
use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Excel;

class TicketController extends Controller
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
        $tickets = Ticket::with('user')->orderBy('id', 'DESC')->get();

        return $tickets;
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
            'email' => 'string|required|email',
            'description' => 'required|string',
            'phone' => 'required|string',
            'query_type' => 'required|string',
        ]);

        $ticket = Ticket::create($fields);

        Mail::to($fields['email'])->send(new TicketRaised($ticket));

        return response()->json([
            'msg' => 'Your Ticket ID number ' . $ticket->ticket_id . ' has been successfully submitted, please allow 48hrs for our team to get back to you',
            'data' => $ticket
        ]);
    }

    public function download(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $type = $request->type;
        $date = Carbon::now()->getTimestamp();

        if(isset($type) && $type == 'csv'){
            $filename =  'live_support_ticket'.$date.'.'.$type;
            return $this->excel->download(new TicketExport($from, $to), $filename, Excel::CSV); 
        }

        if(isset($type) && $type == 'pdf'){
            $filename =  'live_support_ticket'.$date.'.'.$type;
            return $this->excel->download(new TicketExport($from, $to), $filename, Excel::MPDF);
        }
        
        $filename =  'live_support_ticket'.$date.'.xlsx';
        return $this->excel->download(new TicketExport($from, $to), $filename, Excel::XLSX);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Ticket $ticket)
    {
        return  response()->json([
            'msg' => 'successful',
            'data' => $ticket->load(['user', 'ticket_comments'])
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Ticket $ticket)
    {
        $user = auth()->user();
        $currentStatus = $ticket->status;
        $fields = $request->all();

        if(!isset($ticket->user_id)){
            $fields['user_id'] = $user->id;
        }

        $ticket->update($fields);
        $ticket->refresh();

        if($currentStatus != $ticket->status){
            Mail::to($ticket->email)->send(new TicketStatusUpdate($ticket));
        }

        $ticket->toArray();
        if($request['status'] == 'close'){
            $ticket->support_type = 'ticket';
            Mail::to($ticket->email)->send(new SubmitFeedback($ticket));
        }

        return  response()->json([
            'msg' => 'successful',
            'data' => $ticket->load(['user', 'ticket_comments'])
        ]);
    }

    public function add_comment(Request $request, Ticket $ticket)
    {
        $fields = $request->validate([
            'name' => 'string|nullable',
            'comment' => 'string|required'
        ]);
        $user = auth()->user();
        if(isset($user))
            $fields['user_id'] = $user->id;

        $ticket->ticket_comments()->create($fields);

         return  response()->json([
            'msg' => 'successful',
            'data' => $ticket->load(['user', 'ticket_comments'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return  response()->json([
            'msg' => 'Ticket has benn deleted successfully',
            'data' => $ticket
        ]);
    }
}
