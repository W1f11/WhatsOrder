<?php

namespace App\Jobs;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Mail\ReservationReminderMail;
use Illuminate\Support\Facades\Mail;
class SendReservationReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(Reservation $reservation)
    {
         $this->reservation = $reservation;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $user = $this->reservation->user;

        $phone = $user->phone; // Format international ex: +2126XXXXXX
        $message = "Salut {$user->name}, ta réservation commence dans 30 minutes au restaurant.";

        $apiKey = env('CALLMEBOT_API_KEY'); // stockée dans ton .env
        $url = "https://api.callmebot.com/whatsapp.php?phone=$phone&text=" . urlencode($message) . "&apikey=$apiKey";

        Http::get($url); // envoie du message
    }
}

