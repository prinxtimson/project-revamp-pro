@component('mail::message')
# Account Permanently Deleted

Hello {{$user['name']}},

Your account deleted permanently.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
