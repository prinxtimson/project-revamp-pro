<?php

namespace App\Exports;

use App\Models\Survey;
use App\Models\User;
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

class LeaderboardExport implements FromArray, WithMapping, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle, WithStyles
{
    use Exportable;

    private $from;
    private $to;
    private $leaderboard;

    public function __construct($from, $to)
    {
        $this->from = $from;
        $this->to = $to;
        $this->leaderboard;
    }

    public function array(): array
    {
        $from = $this->from;
        $to = $this->to;
        $reviews = [];

        if(isset($from) && isset($to)){
            $agents = User::role('agent')->get();
            $agents = $agents->toArray();
            foreach ($agents as $agent) {
                $review = Survey::whereBetween('created_at', [$from, $to])->select('data')->where('user_id', $agent['id'])->get();
                $review = array_column($review->toArray(), 'data');            
                $review = array_column(array_merge(...$review), 'rating');
                $total = count($review);
                $review = $total > 0 ? round((array_reduce($review, function($a, $b) {
                                    return $a+$b;
                            }, 0)/$total), 1) : 0;
                $agent['review'] = (string)$review;
                array_push($reviews, $agent);
            }
        }else { 
            $agents = User::role('agent')->get();
            $agents = $agents->toArray();
            foreach ($agents as $agent) {
                $review = Survey::select('data')->where('user_id', $agent['id'])->get();
                $review = array_column($review->toArray(), 'data');            
                $review = array_column(array_merge(...$review), 'rating');
                $total = count($review);
                $review = $total > 0 ? round((array_reduce($review, function($a, $b) {
                                    return $a+$b;
                            }, 0)/$total), 1) : 0;
                $agent['review'] = (string)$review;
                array_push($reviews, $agent);
            }
        }
        usort($reviews, function($a, $b) { return $a['review'] < $b['review'];});
        $this->leaderboard = $reviews;

        return $this->leaderboard;
    }

    public function map($user): array
    {

        return [
            $user['id'],
            $user['name'],
            $user['email'],
            $user['phone'],
            $user['review'],
        ];
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Email',
            'Phone',
            'Rating'
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('B3:F3')->applyFromArray([
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
        return 'Leaderboard Report';
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
        ];
    }
}
