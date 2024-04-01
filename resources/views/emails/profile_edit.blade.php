@component('mail::message')
# Profile Updated

Hello {{$user['name']}},

Your profile update was successful.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
