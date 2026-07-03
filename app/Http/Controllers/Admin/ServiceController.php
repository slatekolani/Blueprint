<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Services/Index', [
            'services' => Service::with(['company:id,name', 'servicePrice'])
                ->when(!$request->user()->isSuperAdmin(), fn ($query) => $query->where('company_id', $request->user()->company_id))
                ->orderBy('company_id')->orderBy('sort_order')->get(),
            'companies' => $this->companies($request),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $this->authorizeCompanyId($request, (int) $data['company_id']);
        $price = $data['price'];
        $data['slug'] = Str::slug($data['slug'] ?: $data['name']);
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('services', 'uploads');
        }
        unset($data['image'], $data['price']);
        $service = Service::create($data);
        $service->servicePrice()->create(['price' => $price]);

        return back()->with('success', 'Service created.');
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        $this->authorizeCompanyId($request, $service->company_id);
        $data = $this->validated($request, $service);
        $this->authorizeCompanyId($request, (int) $data['company_id']);
        $price = $data['price'];
        $data['slug'] = Str::slug($data['slug'] ?: $data['name']);
        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('services', 'uploads');
            $this->deleteManagedImage($service->image_path);
        }
        unset($data['image'], $data['price']);
        $service->update($data);
        $service->servicePrice()->updateOrCreate([], ['price' => $price]);

        return back()->with('success', 'Service updated.');
    }

    public function destroy(Request $request, Service $service): RedirectResponse
    {
        $this->authorizeCompanyId($request, $service->company_id);
        $this->deleteManagedImage($service->image_path);
        $service->delete();

        return back()->with('success', 'Service deleted.');
    }

    private function validated(Request $request, ?Service $service = null): array
    {
        return $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
            'name' => ['required', 'string', 'max:160'],
            'slug' => ['nullable', 'alpha_dash', 'max:160'],
            'category' => ['nullable', 'string', 'max:120'],
            'price' => ['required', 'string', 'max:120'],
            'icon' => ['nullable', 'string', 'max:80'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'image' => [$service ? 'nullable' : 'required', 'image', 'max:8192'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);
    }

    private function companies(Request $request)
    {
        return Company::when(!$request->user()->isSuperAdmin(), fn ($query) => $query->whereKey($request->user()->company_id))
            ->orderByDesc('is_parent')->orderBy('sort_order')->get(['id', 'name']);
    }

    private function authorizeCompanyId(Request $request, int $companyId): void
    {
        abort_unless($request->user()->isSuperAdmin() || $request->user()->company_id === $companyId, 403);
    }

    private function deleteManagedImage(?string $path): void
    {
        if ($path && !str_starts_with($path, '/') && !str_starts_with($path, 'http')) {
            Storage::disk('uploads')->delete($path);
        }
    }
}
