@component('mail::message')
# Account Temporary Deleted

Hello {{$user['name']}},

Your account had been temporarily deleted.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
