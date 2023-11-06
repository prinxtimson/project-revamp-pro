<?php

namespace App\Http\Controllers;

use App\Models\PerformanceTracking;
use Illuminate\Http\Request;

class PerformanceTrackingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $performance_trackings = PerformanceTracking::get();

        return response()->json($performance_trackings);
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
            'description' => 'required|string',
            'method' => 'string|required',
            'target_value' => 'integer|required'
        ]);

        $performance_tracking = PerformanceTracking::create($fields);

        return $performance_tracking;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(PerformanceTracking $performance_tracking)
    {
        return response()->json($performance_tracking);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, PerformanceTracking $performance_tracking)
    {
        $fields = $request->all();

        if(isset($fields['name'])){
            $performance_tracking->name = $fields['name'];
        }
        if(isset($fields['description'])){
            $performance_tracking->description = $fields['description'];
        }
        if(isset($fields['method'])){
            $performance_tracking->method = $fields['method'];
        }
        if(isset($fields['target_value'])){
            $performance_tracking->target_value = $fields['target_value'];
        }

        $performance_tracking->save();

        return response()->json($performance_tracking);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(PerformanceTracking $performance_tracking)
    {
        return $performance_tracking->delete();
    }
}
