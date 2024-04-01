<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Carbon\Carbon;

class ActivityController extends Controller 
{

    public function index()
    {
        return response()->json(Activity::with('user')->orderBy('id', 'DESC')->get());
    }

    public function myActivities()
    {
        $activities = Activity::where('user_id', auth()->user()->id)->with('user')->orderBy('id', 'DESC')->get();

        return response()->json($activities);
    }

}
