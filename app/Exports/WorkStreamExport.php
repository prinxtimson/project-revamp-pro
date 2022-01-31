<?php

namespace App\Exports;

use App\Models\LiveCall;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;

class WorkStreamExport implements FromQuery, ShouldAutoSize, WithHeadings, WithEvents, WithCustomStartCell, WithTitle
{
    use Exportable;

    private $livecalls;

    public function __construct()
    {
        $this->livecalls;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function query()
    {

        $this->livecalls =  LiveCall::query();

        return $this->livecalls;
    }

    public function headings(): array
    {
        $livecalls = $this->livecalls;
        $SecProject = 0;
        $mentor = 0;
        $reference = 0;
        $taster = 0;
        $enquiry = 0;
        $candidate = 0;
        $software = 0;
        $lms = 0;
        $access = 0;
        $other = 0;

        foreach($livecalls as $livecall){
            if(strtoupper($livecall->query_type) == 'SECOND PROJECT REQUEST'){

            }else if(strtoupper($livecall->query_type) == 'SECOND PROJECT REQUEST'){

            }else if(strtoupper($livecall->query_type) == 'SECOND PROJECT REQUEST'){
                
            }else if(strtoupper($livecall->query_type) == 'SECOND PROJECT REQUEST'){
                
            }else if(strtoupper($livecall->query_type) == 'SECOND PROJECT REQUEST'){
                
            }else if(strtoupper($livecall->query_type) == 'SECOND PROJECT REQUEST'){
                
            }else if(strtoupper($livecall->query_type) == 'SECOND PROJECT REQUEST'){
                
            }else if(strtoupper($livecall->query_type) == 'SECOND PROJECT REQUEST'){
                
            }
        }

        return [
           ["Second Project Request", 'First row'],
           ['Mentor Request', 'Second row'],
           ["Developer Request", ''],
           ['Referencing', ''],
           ["Taster Session", ''],
           ['Enquiry'],
           ['New Candidate Support'],
           ['Software issues'],
           ['LMS queries'],
           ['Access issue'],
           ['Other IT issues']
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getStyle('B2:C2')->applyFromArray([
                    'font' => [
                        'bold' => true,
                    ],
                ]);
            },
        ];
    }

    public function startCell(): string
    {
        return 'B2';
    }

    public function title(): string
    {
        return 'Live Support Call WorkStream';
    }
}