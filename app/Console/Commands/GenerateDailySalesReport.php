<?php

namespace App\Console\Commands;

use App\Mail\DailySalesReportMail;
use Illuminate\Console\Command;
use App\Models\Transaction;
use Illuminate\Support\Facades\Mail;

class GenerateDailySalesReport extends Command
{
    protected $signature = 'report:sales';
    protected $description = 'Generate daily sales statistics and send by email';

    public function handle(): int
    {
        $this->info('Generating daily sales report...');

        $transactions = Transaction::whereDate('created_at', now()->subDay()->toDateString())
            ->get();

        $totalSales = $transactions->sum(fn($t) => $t->amount * $t->product->price);

        $report = "Sales report for " . now()->subDay()->toDateString() . "\n";
        $report .= "Total transactions: " . $transactions->count() . "\n";
        $report .= "Total sales: $" . number_format($totalSales, 2) . "\n";

        $notifyEmail = env('NOTIFY_MAIL', 'default@example.com');

        Mail::to($notifyEmail)->send(new DailySalesReportMail($report));

        $this->info('Report sent to: ' . $notifyEmail);

        return 0;
    }
}
