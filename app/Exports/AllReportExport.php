<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

use function Psy\debug;

class AllReportExport implements WithMultipleSheets
{
    use Exportable;

    private $category;

   
    public function __construct($category)
    {
        $this->category = $category;
    }

    public function sheets(): array
    {
       // var_dump($this->reports[0]);
        $sheets = array();

        if(in_array('livecalls', $this->category)){
            array_push($sheets, new LiveCallExport());
        }

        if(in_array('callbacks', $this->category)){
            array_push($sheets, new CallbackExport());
        }

        if(in_array('tickets', $this->category)){
            array_push($sheets, new TicketExport());
        }

        return $sheets;
    }
}
