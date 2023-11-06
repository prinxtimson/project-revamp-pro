@component('mail::message')
# Thank You!

Hello {{$payload['name']}},

Thank you for using our Live Support Platform. Please click the link below to complete a short feedback survey, it'll take less than a minute. Your feedback is important to us.

@component('mail::button', ['url' => config('app.url').'/feedback/'.$payload['support_type'].'/'.$payload['id']])
Submit Feedback
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
