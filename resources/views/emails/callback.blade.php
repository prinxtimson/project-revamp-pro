@component('mail::message')
# Callback Request

Hi {{ $name }},

Your call back on Tritek Live Support channel received.

Thanks,<br>
{{ config('app.name') }}
@endcomponent