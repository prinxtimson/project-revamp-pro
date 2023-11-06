<?php

namespace App\Exports;

use App\Models\CallBack;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;

class CallbackExport implements FromQuery, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle
{
    use Exportable;

    private $from;
    private $to;
    private $callbacks;

    public function __construct($from, $to)
    {
        $this->from = $from;
        $this->to = $to;
        $this->callbacks;
    }

    public function query()
    {
        $from = $this->from;
        $to = $this->to;

        if(isset($from) && isset($to)){
            $this->callbacks =  CallBack::query()->when($from, function($q) use ($from) {
                return $q->whereDate('created_at', '>=', $from);
            })->when($to, function($q) use ($to) {
                return $q->whereDate('created_at', '<=', $to);
            })->with('user');
        }else {
            $this->callbacks =  CallBack::query()->with('user');
        }
        

        return $this->callbacks;
    }

    public function map($callback): array
    {

        return [
            $callback->id,
            $callback->name,
            $callback->email,
            $callback->phone,
            $callback->date,
            $callback->time,
            $callback->status,
            $callback->user ? $callback->user->name : '',
            $callback->created_at,
        ];
    }

    public function headings(): array
    {
        return [
        
            'ID',
            'Name',
            'Email',
            'Phone',
            'Date',
            'Time',
            'Status',
            'Call By',
            'Requested At'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('B3:J3')->applyFromArray([
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
        return 'Callback Report';
    }
}
