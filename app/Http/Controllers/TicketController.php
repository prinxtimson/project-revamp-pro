<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $tickets = Ticket::orderBy('id', 'DESC')->paginate(20);

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

        return response()->json([
            'msg' => 'Your Ticket ID number ' . $ticket->ticket_id . ' had been successfully submitted, please allow 48hrs for our team to get back to you',
            'data' => $ticket
        ]);
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
            'data' => $ticket
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
        $ticket->update($request->all());

        return  response()->json([
            'msg' => 'successful',
            'data' => $ticket
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
            'msg' => 'Ticket had benn deleted successfully',
            'data' => $ticket
        ]);
    }
}
