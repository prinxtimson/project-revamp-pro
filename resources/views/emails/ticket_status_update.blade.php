@component('mail::message')
# Ticket Update

Your ticket with ticket ref no. {{$payload['ticket_id']}} @if($payload['status'] == 'close') has been closed @else is {{$payload['status']}}. @endif

Thanks,<br>
{{ config('app.name') }}
@endcomponent
