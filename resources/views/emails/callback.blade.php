@component('mail::message')
# Callback Request

Hello {{ $payload['name'] }},

Your callback request on Tritek Live Support channel received. Click <a href="{{config('app.url')}}/callback/{{$payload['id']}}">here</a> to edit or cancel your schedule.

Thanks,<br>
{{ config('app.name') }}
@endcomponent