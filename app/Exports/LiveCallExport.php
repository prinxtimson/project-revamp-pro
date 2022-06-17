<?php

namespace App\Exports;

use App\Models\LiveCall;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;

class LiveCallExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle
{
    use Exportable;

    private $from;
    private $to;
    private $livecalls;

    public function __construct($from, $to)
    {
        $this->from = $from;
        $this->to = $to;
        $this->livecalls;
    }

    public function query()
    {
        $from = $this->from;
        $to = $this->to;

        $this->livecalls =  LiveCall::query()->when($from, function($q) use ($from) {
            return $q->whereDate('created_at', '>=', $from);
        })->when($to, function($q) use ($to) {
            return $q->whereDate('created_at', '<=', $to);
        })->with('user');

        return $this->livecalls;
    }

    public function map($livecall): array
    {
        $edate = $livecall->answered_at || $livecall->left_at;
        $date1 = Carbon::createFromTimestamp($livecall->created_at);
        $date2 = Carbon::createFromTimestamp($edate);
        $duration = $date2->diffInMinutes($date1);

        return [
            $livecall->id,
            $livecall->query_type,
            $duration,
            $livecall->answered_at,
            $livecall->left_at,
            $livecall->user ? $livecall->user->name : '',
            $livecall->created_at,
        ];
    }

    public function headings(): array
    {
        return [
        //    ["Second Project Request", 'First row'],
        //    ['Mentor Request', 'Second row'],
        //    ["Developer Request", ''],
        //    ['Referencing', ''],
        //    ["Taster Session", ''],
        //    ['Enquiry'],
        //    ['New Candidate Support'],
        //    ['Software issues'],
        //    ['LMS queries'],
        //    ['Access issue'],
        //    ['Other IT issues']
            'ID',
            'Query Type',
            'Duration (Mins)',
            'Answered At',
            'Left At',
            'Answered By',
            'Created At'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('A3:G3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
            },
        ];
    }

    public function startCell(): string
    {
        return 'A3';
    }

    public function title(): string
    {
        return 'Live Support Call Table';
    }
}