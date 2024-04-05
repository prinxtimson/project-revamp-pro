<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment; 

class ChatTranscript implements FromCollection, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle
{
    private array $payload;

    public function __construct(array $payload)
    {
        $this->payload = $payload;
    } 

    public function collection()
    {
        return $this->payload;
    }

    public function map($payload): array
    {
        return [
            $payload['created_at'],
            $payload['chat_id'],
            $payload['sender_name'],
            $payload['message'],
        ];
    }

    public function headings(): array
    {
        $_headings = ['Date', 'Chat ID', 'Name', 'Message'];
        
        return $_headings;
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('B3:E3')->applyFromArray([
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
        return 'Chat Transcript';
    }

}
