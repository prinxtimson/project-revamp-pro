@component('mail::message')
# Thank You!

Hello {{$payload['name']}},

Thank you for using our customer support platform, please we will love to have your feedback. Click the button below, It takes less than a minutes.

@component('mail::button', ['url' => config('app.url').'/feedback/'.$payload['support_type']])
Submit Feedback
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
