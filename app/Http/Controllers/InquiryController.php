<?php

namespace App\Http\Controllers;

use App\Mail\InquiryNotification;
use App\Mail\InquiryReceived;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'company_id' => ['nullable', 'exists:companies,id'],
            'service_id' => ['nullable', 'exists:services,id'],
            'type' => ['required', 'in:general,quote,insurance,supply,printing'],
            'name' => ['required', 'string', 'max:120'],
            'email' => ['nullable', 'email', 'max:190'],
            'phone' => ['required', 'string', 'max:50'],
            'organization' => ['nullable', 'string', 'max:150'],
            'subject' => ['nullable', 'string', 'max:190'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $inquiry = Inquiry::create($data);
        $inquiry->load('company');

        try {
            // Notify the company/admin about the new request
            $recipientEmail = $inquiry->company?->email ?? config('mail.from.address');
            Mail::to($recipientEmail)->send(new InquiryNotification($inquiry));

            // Send confirmation to the client if they provided an email
            if ($inquiry->email) {
                Mail::to($inquiry->email)->send(new InquiryReceived($inquiry));
            }
        } catch (\Throwable) {
            // Mail failure must not block the inquiry from being saved
        }

        return back()->with('success', 'Thank you. Your request has been received and our team will contact you shortly.');
    }
}
