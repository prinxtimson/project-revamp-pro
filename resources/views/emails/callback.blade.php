@component('mail::message')
# Callback Request

Hi {{ $name }},

Your callback request on Tritek Live Support channel received.

Thanks,<br>
{{ config('app.name') }}
@endcomponent