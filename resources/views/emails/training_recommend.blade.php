@component('mail::message')
# Training Recommendation

Hello {{$payload['name']}},

The following training had been recommended for you.

@component('mail::panel')
# Course Title: 
{{$payload['course']}}
<br>
# Reason:
{{$payload['reason']}}
<br>
# Expected Complete Date: 
{{$payload['expected_end_date']}}
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
