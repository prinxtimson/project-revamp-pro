@component('mail::message')
# OTP Authentication Code

Hi {{ $user['name']}},

Here is your login OTP verification code.

@component('mail::panel')
# {{$code}}
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
