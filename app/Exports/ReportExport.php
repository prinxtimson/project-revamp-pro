<?php

namespace App\Exports;

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

class ReportExport implements FromArray, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle, WithStyles
{
    private array $payload;

    public function __construct(array $payload)
    {
        $this->payload = $payload;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function array(): array
    {
        return $this->payload;
    }

    public function map($payload): array
    {
        $map_data = [
            $payload['id'],
            $payload['name'],
        ];
        if(isset($payload['customer_satisfaction'])){
            array_push($map_data, (string)$payload['customer_satisfaction']);
        }
        if(isset($payload['average_handle_time'])){
            array_push($map_data, (string)$payload['average_handle_time']);
        }
        if(isset($payload['average_response_time'])){
            array_push($map_data, (string)$payload['average_response_time']);
        }
        if(isset($payload['abandonment_rate'])){
            array_push($map_data, (string)$payload['abandonment_rate']);
        }
        if(isset($payload['customer_wait_time'])){
            array_push($map_data, (string)$payload['customer_wait_time']);
        }
        if(isset($payload['call_wrap_up_time'])){
            array_push($map_data, (string)$payload['call_wrap_up_time']);
        }
        return $map_data;
    }

    public function headings(): array
    {
        $_headings = ['ID','Name'];
        if(isset($this->payload[0]['customer_satisfaction'])){
            array_push($_headings, 'Customer Satisfaction (%)');
        }
        if(isset($this->payload[0]['average_handle_time'])){
            array_push($_headings, 'Average Handle Time (min)');
        }
        if(isset($this->payload[0]['average_response_time'])){
            array_push($_headings, 'Average Response Time (min)');
        }
        if(isset($this->payload[0]['abandonment_rate'])){
            array_push($_headings, 'Abandonment Rate (%)');
        }
        if(isset($this->payload[0]['customer_wait_time'])){
            array_push($_headings, 'Customer Wait Time (min)');
        }
        if(isset($this->payload[0]['call_wrap_up_time'])){
            array_push($_headings, 'Call Wrap-Up Time (min)');
        }
        return $_headings;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('B3:I3')->applyFromArray([
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
        return 'Live Support Report';
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
            'I' => ['alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                ]],
            'J' => ['alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                ]],
        ];
    }
}
