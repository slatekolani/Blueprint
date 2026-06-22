<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $companies = Company::query()
            ->when(!$request->user()->isSuperAdmin(), fn ($query) => $query->whereKey($request->user()->company_id))
            ->withCount(['services', 'projects'])
            ->orderByDesc('is_parent')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Companies/Index', ['companies' => $companies]);
    }

    public function edit(Request $request, Company $company): Response
    {
        $this->authorizeCompany($request, $company);

        return Inertia::render('Admin/Companies/Edit', [
            'company' => $company,
            'parents' => Company::where('is_parent', true)->whereKeyNot($company->id)->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Company $company): RedirectResponse
    {
        $this->authorizeCompany($request, $company);
        $data = $this->validated($request, $company);
        $data = $this->storeImages($request, $data, $company);
        $company->update($data);

        return back()->with('success', 'Company profile updated.');
    }

    private function validated(Request $request, Company $company): array
    {
        return $request->validate([
            'parent_id' => ['nullable', 'exists:companies,id'],
            'name' => ['required', 'string', 'max:160'],
            'short_name' => ['nullable', 'string', 'max:80'],
            'slug' => ['required', 'alpha_dash', 'max:160', 'unique:companies,slug,'.$company->id],
            'tagline' => ['nullable', 'string', 'max:190'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'primary_color' => ['required', 'string', 'max:20'],
            'accent_color' => ['required', 'string', 'max:20'],
            'email' => ['nullable', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'max:190'],
            'address' => ['nullable', 'string', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:190'],
            'facebook' => ['nullable', 'string', 'max:190'],
            'linkedin' => ['nullable', 'string', 'max:190'],
            'meta_title' => ['nullable', 'string', 'max:190'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'logo' => ['nullable', 'image', 'max:4096'],
            'hero_image' => ['nullable', 'image', 'max:8192'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);
    }

    private function storeImages(Request $request, array $data, Company $company): array
    {
        unset($data['logo'], $data['hero_image']);

        if ($request->hasFile('logo')) {
            $data['logo_path'] = $request->file('logo')->store('companies/logos', 'uploads');
        }

        if ($request->hasFile('hero_image')) {
            $data['hero_image_path'] = $request->file('hero_image')->store('companies/heroes', 'uploads');
        }

        $data['slug'] = Str::slug($data['slug']);

        return $data;
    }

    public function destroy(Request $request, Company $company): RedirectResponse
    {
        abort_unless($request->user()->isSuperAdmin(), 403);

        // Delete child companies first (their services & projects cascade via DB)
        $company->children()->each(fn ($child) => $child->delete());

        // Delete the company itself (services & projects cascade via DB)
        $company->delete();

        return redirect()->route('admin.companies.index')->with('success', 'Company and all its data have been deleted.');
    }

    private function authorizeCompany(Request $request, Company $company): void
    {
        abort_unless($request->user()->isSuperAdmin() || $request->user()->company_id === $company->id, 403);
    }
}
