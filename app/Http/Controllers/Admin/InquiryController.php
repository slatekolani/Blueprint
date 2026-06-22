<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InquiryController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => Inquiry::with(['company:id,name', 'service:id,name'])
                ->when(!$request->user()->isSuperAdmin(), fn ($query) => $query->where('company_id', $request->user()->company_id))
                ->latest()->get(),
        ]);
    }

    public function destroy(Request $request, Inquiry $inquiry): RedirectResponse
    {
        abort_unless($request->user()->isSuperAdmin() || $request->user()->company_id === $inquiry->company_id, 403);
        $inquiry->delete();

        return back()->with('success', 'Inquiry deleted.');
    }

    public function update(Request $request, Inquiry $inquiry): RedirectResponse
    {
        abort_unless($request->user()->isSuperAdmin() || $request->user()->company_id === $inquiry->company_id, 403);
        $data = $request->validate([
            'status' => ['required', 'in:new,in_progress,responded,closed'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);
        $data['read_at'] = $inquiry->read_at ?? now();
        $inquiry->update($data);

        return back()->with('success', 'Inquiry updated.');
    }
}
