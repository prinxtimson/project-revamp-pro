@component('mail::message')
# Welcome To Tritek Live Support

Hi {{ $user['firstname']}},

Welcome to Tritek Consulting Ltd. Find the following is your login details to the Tritek Live Support Platform,
Please be sure to change your password on your first login to the platform.

@component('mail::panel')
# Email: {{ $user['email'] }}
# Password: {{ $user['password'] }}
@endcomponent

@component('mail::button', ['url' => 'https://tritekexcel.herokuapp.com/admin', 'color' => 'success'])
Visit Website
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent