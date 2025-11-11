<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ExpireReservations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservations:expire';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark reservations as expired when end_time is past';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        $count = Reservation::where('end_time', '<', $now)
            ->where('status', '!=', 'expired')
            ->update(['status' => 'expired']);

        $this->info("Reservations expired: {$count}");
        return 0;
    }
}
