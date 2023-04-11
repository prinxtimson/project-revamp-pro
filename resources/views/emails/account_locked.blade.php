@component('mail::message')
# Account lock

Hi {{ $name }},

Your account had been locked due to several login attempt, please reset your password to access your account.

@component('mail::button', ['url' => "$url"])
Reset Password
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
