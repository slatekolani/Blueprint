<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Clients/Index', [
            'clients' => Client::orderBy('sort_order')->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'website'     => 'nullable|url|max:255',
            'sort_order'  => 'integer|min:0',
            'is_published'=> 'boolean',
            'logo'        => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('clients', 'uploads');
        }

        unset($data['logo']);
        Client::create($data);

        return back()->with('success', 'Client added.');
    }

    public function update(Request $request, Client $client): RedirectResponse
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'website'     => 'nullable|url|max:255',
            'sort_order'  => 'integer|min:0',
            'is_published'=> 'boolean',
            'logo'        => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            if ($client->logo_path) Storage::disk('uploads')->delete($client->logo_path);
            $data['logo_path'] = $request->file('logo')->store('clients', 'uploads');
        }

        unset($data['logo']);
        $client->update($data);

        return back()->with('success', 'Client updated.');
    }

    public function destroy(Client $client): RedirectResponse
    {
        if ($client->logo_path) Storage::disk('uploads')->delete($client->logo_path);
        $client->delete();

        return back()->with('success', 'Client deleted.');
    }
}
