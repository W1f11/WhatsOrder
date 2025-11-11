@component('mail::message')
# Rappel de reservation

Bonjour {{ $reservation->user->name }},

Ceci est un rappel pour votre réservation chez **{{ $reservation->restaurant->name ?? 'le restaurant' }}**.

**Date / Heure:** {{ $reservation->start_time->format('d/m/Y H:i') }}  
**Table:** {{ $reservation->table_number ?? 'non attribuée' }}

Merci et à bientôt.

@endcomponent
