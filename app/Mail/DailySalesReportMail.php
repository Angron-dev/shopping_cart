<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DailySalesReportMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $report;

    public function __construct(string $report)
    {
        $this->report = $report;
    }

    public function build()
    {
        return $this->subject('Daily Sales Report')
            ->view('emails.daily_sales_report')
            ->with([
                'report' => $this->report,
            ]);
    }
}
