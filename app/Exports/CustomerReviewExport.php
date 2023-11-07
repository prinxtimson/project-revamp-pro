<?php

namespace App\Exports;

use App\Models\Survey;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromArray;
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

class CustomerReviewExport implements FromArray, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle, WithStyles
{
    use Exportable;

    private $from;
    private $to;
    private $feedbacks;

    public function __construct($from, $to)
    {
        $this->from = $from;
        $this->to = $to;
        $this->feedbacks;
    }

    public function array(): array
    {
        $from = $this->from;
        $to = $this->to;

        $positive = 0;
        $negative = 0;
        $neutral = 0;
        $total = 0;

        if(isset($from) && isset($to)){
            $surveys =  Survey::whereBetween('created_at', [$from, $to])
                                        ->select('data')->get();
            $total = count($surveys->toArray());
            $surveys = array_column($surveys->toArray(), 'data');
                                        
            foreach ($surveys as $value) {
                $rating = (array_reduce($value, function($a, $b) {
                                return $a+$b['rating'];
                            }, 0)/3);
                if($rating < 5) $negative++;
                if($rating > 5) $positive++;
                if($rating == 5) $neutral++;
            }
            
        }else {
            $surveys = Survey::select('data')->get();
            $total = count($surveys->toArray());
            $surveys = array_column($surveys->toArray(), 'data');
            
            foreach ($surveys as $value) {
                $rating = (array_reduce($value, function($a, $b) {
                                return $a+$b['rating'];
                            }, 0)/3);
                if($rating < 5) $negative++;
                if($rating > 5) $positive++;
                if($rating == 5) $neutral++;
            }
        }

        $this->feedbacks = [
            [
                'key' => 'Total Feedback Received',
                'value' => (string)$total,
            ],
            [
                'key' => 'Positive Feedback Received',
                'value' => (string)$positive,
            ],
            [
                'key' => 'Neutral Feedback Received',
                'value' => (string)$neutral,
            ],
            [
                'key' => 'Negative Feedback Received',
                'value' => (string)$negative,
            ],
        ];

        return $this->feedbacks;
    }

    public function map($feedback): array
    {

        return [
            $feedback['key'],
            $feedback['value'],
        ];
    }

    public function headings(): array
    {
        return [
            'Title',
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
        return 'Customer Review Report';
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
