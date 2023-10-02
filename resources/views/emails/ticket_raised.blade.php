@component('mail::message')
# Ticket ({{$payload['ticket_id']}}) Raised

Hello {{$payload['name']}},

Your ticket with ticket ref no. {{$payload['ticket_id']}} has been submitted, please allow 48hrs for our team to get back to you.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
