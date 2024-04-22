<?php

namespace App\Http\Controllers;

use App\Exports\AllReportExport;
use App\Exports\ReportExport;
use App\Mail\ReportShare;
use App\Models\LiveCall;
use App\Models\ReportTemplate;
use App\Models\Survey;
use App\Models\Ticket;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Excel;

class ReportTemplateController extends Controller
{
    private $excel;

    public function __construct(Excel $excel)
    {
        $this->excel = $excel;
    }

    public function generate(Request $request)
    {
        try {
            $fields = $request->validate([
                'category' => 'required|string',
                'performance_indicators' => 'required|array',
                'start_date' => 'required',
                'end_date' => 'required',
                'format' => 'required|string'
            ]);

            $format = $fields['format'];
            $start_date = $fields['start_date'];
            $end_date = $fields['end_date'];
            $date = Carbon::now()->getTimestamp();

            $filename = 'live_support_report_'.$date.'.'.$format;

            $payload = array();

            if($fields['category'] == 'agent'){
                $agents = User::role('agent')->get();

                foreach ($agents as $agent) {
                    $res = [
                        'id' => $agent->id,
                        'name' => $agent->name
                    ];
                    if(in_array('Customer Satisfaction', $fields['performance_indicators'])){
                        $surveys = Survey::select('data')->where('user_id', $agent->id)->whereBetween('created_at', [$start_date, $end_date])->get();
                        $surveys = array_column($surveys->toArray(), 'data');
                        
                        $surveys = array_column(array_merge(...$surveys), 'rating');
                        $total = count($surveys);
                        $surveys = $total > 0 ? round(((array_reduce($surveys, function($a, $b) {
                                    return $a+$b;
                            }, 0)/($total*10))*100), 1) : 0;

                            $res['customer_satisfaction'] = $surveys;
                    }

                    if(in_array('Average Handle Time', $fields['performance_indicators'])){
                        $tickets = Ticket::where('user_id', $agent->id)->whereBetween('created_at', [$start_date, $end_date])->where('status', 'close')->get();
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

                        $res['average_handle_time'] = $tickets;
                    }

                    if(in_array('Average Response Time', $fields['performance_indicators'])){
                        $livecalls = LiveCall::where('agent_id', $agent->id)->whereBetween('created_at', [$start_date, $end_date])->whereNotNull('answered_at')->get();
                        $livecalls = $livecalls->toArray();
                        $total = count($livecalls);
                        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
                            $startTime = new Carbon($b['created_at']);
                            $endTime = new Carbon($b['answered_at']);
                            $diff = $startTime->diffInMinutes($endTime);
                            return $a+$diff;
                        }, 0)/$total), 1) : 0;
                        $res['average_response_time'] = $livecalls;
                    }

                    if(in_array('Abandonment Rate', $fields['performance_indicators'])){
                        $total_abandon = LiveCall::whereNotNull('left_at')->whereBetween('created_at', [$start_date, $end_date])->count();
                        $total_livecalls = LiveCall::count();
                        $rate = $total_livecalls > 0 ? round((($total_abandon/$total_livecalls)*100), 1) : 0;
                        $res['abandonment_rate'] = $rate;
                    }

                    if(in_array('Customer Wait Time', $fields['performance_indicators'])){
                        $livecalls = LiveCall::where('agent_id', $agent->id)->whereBetween('created_at', [$start_date, $end_date])->whereNotNull('answered_at')->get();
                        $livecalls = $livecalls->toArray();
                        $total = count($livecalls);
                        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
                            $startTime = new Carbon($b['created_at']);
                            $endTime = new Carbon($b['answered_at']);
                            $diff = $startTime->diffInMinutes($endTime);
                            return $a+$diff;
                        }, 0)/$total), 1) : 0;
                        $res['customer_wait_time'] = $livecalls;
                    }

                    if(in_array('Call Wrap-Up Time', $fields['performance_indicators'])){
                        $livecalls = LiveCall::where('agent_id', $agent->id)->whereBetween('created_at', [$start_date, $end_date])->whereNotNull('answered_at')->get();
                        $livecalls = $livecalls->toArray();
                        $total = count($livecalls);
                        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
                            $startTime = new Carbon($b['answered_at']);
                            $endTime = new Carbon($b['ended_at']);
                            $diff = $startTime->diffInMinutes($endTime);
                            return $a+$diff;
                        }, 0)/$total), 1) : 0;
                        $res['call_wrap_up_time'] = $livecalls;
                    }
                    array_push($payload, $res);
                }
   
            }else {
                $request_categories = ["Second Project Request", "Mentor Request", "Developer Request", "Referencing", "Taster Session", "Course Enquiry", "New Candidate Support", "Software Issues", "LMS Queries","Access Issue","Other IT Issues",];

                foreach ($request_categories as $key => $item) {
                    $res = [
                        'id' => $key+1,
                        'name' => $item
                    ];
                    if(in_array('Customer Satisfaction', $fields['performance_indicators'])){
                        $surveys = Survey::select('data')->whereBetween('created_at', [$start_date, $end_date])->get();
                        $surveys = array_column($surveys->toArray(), 'data');
                        
                        $surveys = array_column(array_merge(...$surveys), 'rating');
                        $total = count($surveys);
                        $surveys = $total > 0 ? round(((array_reduce($surveys, function($a, $b) {
                                    return $a+$b;
                            }, 0)/($total*10))*100), 1) : 0;

                            $res['customer_satisfaction'] = $surveys;
                    }

                    if(in_array('Average Handle Time', $fields['performance_indicators'])){
                        $tickets = Ticket::where('query_type', $item)->whereBetween('created_at', [$start_date, $end_date])->where('status', 'close')->get();
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

                        $res['average_handle_time'] = $tickets;
                    }

                    if(in_array('Average Response Time', $fields['performance_indicators'])){
                        $livecalls = LiveCall::where('query_type', $item)->whereBetween('created_at', [$start_date, $end_date])->whereNotNull('answered_at')->get();
                        $livecalls = $livecalls->toArray();
                        $total = count($livecalls);
                        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
                            $startTime = new Carbon($b['created_at']);
                            $endTime = new Carbon($b['answered_at']);
                            $diff = $startTime->diffInMinutes($endTime);
                            return $a+$diff;
                        }, 0)/$total), 1) : 0;
                        $res['average_response_time'] = $livecalls;
                    }

                    if(in_array('Abandonment Rate', $fields['performance_indicators'])){
                        $total_abandon = LiveCall::whereNotNull('left_at')->whereBetween('created_at', [$start_date, $end_date])->count();
                        $total_livecalls = LiveCall::count();
                        $rate = $total_livecalls > 0 ? round((($total_abandon/$total_livecalls)*100), 1) : 0;
                        $res['abandonment_rate'] = $rate;
                    }

                    if(in_array('Customer Wait Time', $fields['performance_indicators'])){
                        $livecalls = LiveCall::where('query_type', $item)->whereBetween('created_at', [$start_date, $end_date])->whereNotNull('answered_at')->get();
                        $livecalls = $livecalls->toArray();
                        $total = count($livecalls);
                        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
                            $startTime = new Carbon($b['created_at']);
                            $endTime = new Carbon($b['answered_at']);
                            $diff = $startTime->diffInMinutes($endTime);
                            return $a+$diff;
                        }, 0)/$total), 1) : 0;
                        $res['customer_wait_time'] = $livecalls;
                    }

                    if(in_array('Call Wrap-Up Time', $fields['performance_indicators'])){
                        $livecalls = LiveCall::where('query_type', $item)->whereBetween('created_at', [$start_date, $end_date])->whereNotNull('answered_at')->get();
                        $livecalls = $livecalls->toArray();
                        $total = count($livecalls);
                        $livecalls = $total > 0 ? round((array_reduce($livecalls, function($a, $b) {
                            $startTime = new Carbon($b['answered_at']);
                            $endTime = new Carbon($b['ended_at']);
                            $diff = $startTime->diffInMinutes($endTime);
                            return $a+$diff;
                        }, 0)/$total), 1) : 0;
                        $res['call_wrap_up_time'] = $livecalls;
                    }
                    array_push($payload, $res);
                }
            }

            switch($format)
            {
                case 'csv':
                    $this->excel->store(new ReportExport($payload), $filename, null, Excel::CSV);
                    break;
                case 'pdf':
                    $this->excel->store(new ReportExport($payload), $filename, null, Excel::MPDF);
                    break;
                default:
                    $this->excel->store(new ReportExport($payload), $filename, null, Excel::XLSX);
                    break;
            }

            $file_url = Storage::url($filename);

            return response()->json([
                'data' =>[
                    'name' => $filename,
                    'category' => $fields['category'],
                    'performance_indicators' => $fields['performance_indicators'],
                    'file_url' => $file_url,
                    'start_date' => $start_date,
                    'end_date' => $end_date,
                    'format' => $format
                ]
        ]);
                    
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()], 400);
        }
    }

    public function download($filename)
    {  
        return Storage::download($filename);
    }

    public function save(Request $request)
    {
        $user = User::find(auth()->id());
        $fields = $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'file_url' =>'required|string',
            'performance_indicators' => 'required|array',
            'start_date' => 'required',
            'end_date' => 'required',
            'format' => 'required|string'
        ]);

        $fields['start_date'] = new Carbon($fields['start_date']);
        $fields['end_date'] = new Carbon($fields['end_date']);
        $report_template = $user->report_templates()->create($fields);

        return response()->json([
            'message' => 'report had been saved',
            'data' => $report_template
        ]);
    }

    public function share(Request $request)
    {
        try {
            $fields = $request->validate([
                'email' => 'required|string',
                'filename' => 'required|string'
            ]);
    
            Mail::to($fields['email'])->send(new ReportShare($fields['filename']));

            return response()->json(['message' => 'Report had been share']);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()], 400);
        }
    }

    public function download_report(Request $request)
    {
        try{
            
            $category = json_decode($request->category);
            $format = $request->format;
            $date = Carbon::now()->getTimestamp();

            switch($format)
            {
                case 'csv':
                    $filename =  'live_support_'.$date.'.csv';
                    return $this->excel->download(new AllReportExport($category), $filename, Excel::CSV);
                    break;
                case 'pdf':
                    $filename =  'live_support_'.$date.'.pdf';
                    return $this->excel->download(new AllReportExport($category), $filename, Excel::MPDF);
                    break;
                default:
                    $filename =  'live_support_'.$date.'.xlsx';
                    return $this->excel->download(new AllReportExport($category), $filename, Excel::XLSX);
                    break;
            }
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()], 400);
        }
    }

    public function share_report(Request $request)
    {
        try{
            $fields = $request->validate([
                'category' => 'required|array',
                'format' => 'required|string',
                'user_id' => 'required|integer'
            ]);
            $user = User::find($fields['user_id']);
            
            $date = Carbon::now()->getTimestamp();
            $filename = '';

            switch($fields['format'])
            {
                case 'csv':
                    $filename =  'live_support_'.$date.'.csv';
                    $this->excel->store(new AllReportExport($fields['category']), $filename, null,  Excel::CSV);
                    break;
                case 'pdf':
                    $filename =  'live_support_'.$date.'.pdf';
                    $this->excel->store(new AllReportExport($fields['category']), $filename, null, Excel::MPDF);
                    break;
                default:
                    $filename =  'live_support_'.$date.'.xlsx';
                    $this->excel->store(new AllReportExport($fields['category']), $filename, null, Excel::XLSX);
                    break;
            }

            Mail::to($user)->send(new ReportShare($filename));

            return response()->json(['message' => 'Report had been share']);
        } catch (Exception $e) {
            return response(['message' => $e->getMessage()], 400);
        }
    }
}
