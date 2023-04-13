@component('mail::message')
# Account lock

Hi {{ $name }},

You are receiving this email because we have received an account reset request as your account has been locked

@component('mail::button', ['url' => "$url"])
Unlock Account
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
