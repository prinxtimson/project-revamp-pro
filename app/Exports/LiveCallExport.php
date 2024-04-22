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
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class LiveCallExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle, WithStyles
{
    use Exportable;

    private $from;
    private $to;
    private $livecalls;

    public function __construct($from = null, $to = null)
    {
        $this->from = $from;
        $this->to = $to;
        $this->livecalls;
    }

    public function query()
    {
        $from = $this->from;
        $to = $this->to;

        if(isset($from) && isset($to)){
            $this->livecalls =  LiveCall::query()->when($from, function($q) use ($from) {
                return $q->whereDate('created_at', '>=', $from);
            })->when($to, function($q) use ($to) {
                return $q->whereDate('created_at', '<=', $to);
            })->with('user');
        }else{
            $this->livecalls =  LiveCall::query()->with('user');
        }

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
            Carbon::parse($livecall->answered_at)->toDayDateTimeString(),
            Carbon::parse($livecall->left_at)->toDayDateTimeString(),
            $livecall->user ? $livecall->user->name : '',
            Carbon::parse($livecall->created_at)->toFormattedDateString(),
        ];
    }

    public function headings(): array
    {
        return [
     
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
                $event->sheet->getStyle('B3:H3')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
            },
        ];
    }

    public function startCell(): string
    {
        return 'B3';
    }

    public function title(): string
    {
        return 'Live Support Call Report';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Styling a specific cell by coordinate.
            'B' => ['alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                ]],
            'D' => ['alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                ]],
            'E' => ['alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                ]],
            'F' => ['alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                ]],
            'G' => ['alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                ]],
            'H' => ['alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                ]],
        ];
    }
}