<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule)
{
    // Envoi d'un message 30 minutes avant la réservation
    $schedule->call(function () {
        $upcoming = \App\Models\Reservation::where('start_time', '<=', now()->addMinutes(30))
            ->where('status', 'confirmed')
            ->get();

        foreach ($upcoming as $reservation) {
            dispatch(new \App\Jobs\SendReservationReminder($reservation));
        }
    })->everyFifteenMinutes();
}


    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
