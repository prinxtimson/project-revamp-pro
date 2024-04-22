<?php

namespace App\Exports;

use App\Models\CallBack;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromCollection;
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

class CallbackExport implements FromCollection, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle, WithStyles
{
    use Exportable;

    private $from;
    private $to;
    private $callbacks;

    public function __construct($from = null, $to = null)
    {
        $this->from = $from;
        $this->to = $to;
        $this->callbacks;
    }

    public function collection()
    {
        $from = $this->from;
        $to = $this->to;

        if(isset($from) && isset($to)){
            $this->callbacks =  CallBack::whereBetween('created_at', [$from, $to])
            ->select('query_type', DB::raw('count(*) as total'))
            ->groupBy('query_type')
            ->get();
        }else {
            $this->callbacks =  CallBack::select('query_type', DB::raw('count(*) as total'))
            ->groupBy('query_type')
            ->get();
        }

        return $this->callbacks;
    }

    public function map($callback): array
    {

        return [
            $callback->query_type,
            $callback->total,
        ];
    }

    public function headings(): array
    {
        return [
        
            'Query Type',
            'Total',
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('B3:C3')->applyFromArray([
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

    public function styles(Worksheet $sheet)
    {
        return [
            // Styling a specific cell by coordinate.
            'C' => ['alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                ]],
        ];
    }
}
