@component('mail::message')
# Callback Request

Hi {{ $name }},

Your callback request on Tritek Live Support channel received.

Thanks,<br>
Admin
{{ config('app.name') }}
@endcomponent