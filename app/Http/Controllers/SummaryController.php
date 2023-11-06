<?php

namespace App\Http\Controllers;

use App\Models\CallBack;
use App\Models\LiveCall;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SummaryController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $category = $request->category;

        if(isset($from) && isset($to)){
        $callbacks = CallBack::whereBetween('created_at', [$from, $to])->count();
        $livecalls = LiveCall::whereBetween('created_at', [$from, $to])->count();
        $tickets = Ticket::whereBetween('created_at', [$from, $to])->count();

        $unresolve_cb = Callback::whereBetween('created_at', [$from, $to])->whereNull('called_at')->count();
        $unresolve_lc = LiveCall::whereBetween('created_at', [$from, $to])->whereNull('left_at')->orWhereNull('answered_at')->count();
        $unresolve_tk = Ticket::whereBetween('created_at', [$from, $to])->where('status', 'open')->count();

        return response()->json([
            "total_callbacks" => $callbacks,
            "total_livecalls" => $livecalls,
            "total_tickets" => $tickets,
            "total_unresolve_query" => $unresolve_cb + $unresolve_lc + $unresolve_tk
        ]);
    }else if(isset($category)){
        $callbacks = CallBack::where('query_type', $category)->count();
        $livecalls = LiveCall::where('query_type', $category)->count();
        $tickets = Ticket::where('query_type', $category)->count();

        $unresolve_cb = Callback::where('query_type', $category)->whereNull('called_at')->count();
        $unresolve_lc = LiveCall::where('query_type', $category)->whereNull('left_at')->orWhereNull('answered_at')->count();
        $unresolve_tk = Ticket::where('query_type', $category)->where('status', 'open')->count();

        return response()->json([
            "total_callbacks" => $callbacks,
            "total_livecalls" => $livecalls,
            "total_tickets" => $tickets,
            "total_unresolve_query" => $unresolve_cb + $unresolve_lc + $unresolve_tk
        ]);
    }else {
        $callbacks = CallBack::count();
        $livecalls = LiveCall::count();
        $tickets = Ticket::count();

        $unresolve_cb = Callback::whereNull('called_at')->count();
        $unresolve_lc = LiveCall::whereNull('left_at')->orWhereNull('answered_at')->count();
        $unresolve_tk = Ticket::where('status', 'open')->count();

        return response()->json([
            "total_callbacks" => $callbacks,
            "total_livecalls" => $livecalls,
            "total_tickets" => $tickets,
            "total_unresolve_query" => $unresolve_cb + $unresolve_lc + $unresolve_tk
        ]); 
    }
    }

    public function callback(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $category = $request->category;
        $callbacks = [];

        if(isset($from) && isset($to)){
            $callbacks = CallBack::whereBetween('created_at', [$from, $to])
                ->select('query_type', DB::raw('count(*) as total'))
                ->groupBy('query_type')
                ->get();
        }else if(isset($category)){
            $callbacks = CallBack::where('query_type', $category)
                ->select('query_type', DB::raw('count(*) as total'))
                ->groupBy('query_type')
                ->get();
        }else {
            $callbacks = CallBack::select('query_type', DB::raw('count(*) as total'))
                ->groupBy('query_type')
                ->get();
        }

        return $callbacks;
    }

    public function ticket(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $category = $request->category;
        $tickets = [];

        if(isset($from) && isset($to)){
            $tickets = Ticket::whereBetween('created_at', [$from, $to])
                ->select('query_type', DB::raw('count(*) as total'))
                ->groupBy('query_type')
                ->get();
        }else if(isset($category)){
            $tickets = Ticket::where('query_type', $category)
                ->select('query_type', DB::raw('count(*) as total'))
                ->groupBy('query_type')
                ->get();
        }else{
            $tickets = Ticket::select('query_type', DB::raw('count(*) as total'))
                ->groupBy('query_type')
                ->get();
        }

        return $tickets;
    }

    public function livecall(Request $request)
    {
        $from = $request->from;
        $to = $request->to;
        $category = $request->category;
        $livecalls = [];

        if(isset($from) && isset($to)){
            $livecalls = LiveCall::whereBetween('created_at', [$from, $to])
                ->select('query_type', DB::raw('count(*) as total'))
                ->groupBy('query_type')
                ->get();  
        }else if(isset($category)){
            $livecalls = LiveCall::where('query_type', $category)
                ->select('query_type', DB::raw('count(*) as total'))
                ->groupBy('query_type')
                ->get();  
        }else {
            $livecalls = LiveCall::select('query_type', DB::raw('count(*) as total'))
                ->groupBy('query_type')
                ->get();
        }
        
        return $livecalls;
    }
}
