<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RatingController extends Controller
{
    public function rate_faq(Request $request)
    {
        $fields = $request->validate([
            'category' => 'required|integer',
            'question' => 'required|integer',
            'rating' => 'required|integer'
        ]);

        $category = $fields['category'];
        $question = $fields['question'];
        $rating = $fields['rating'];

        $contents = \File::get(base_path('resources/js/faq.json'));
        $json = json_decode($contents);

        array_push($json[$category]->items[$question]->ratings, (int)$rating);
        
        \File::put(base_path('resources/js/faq.json'), json_encode($json));

        return $json;
    }
}
