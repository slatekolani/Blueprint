<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Projects/Index', [
            'projects' => Project::with('company:id,name')
                ->when(!$request->user()->isSuperAdmin(), fn ($query) => $query->where('company_id', $request->user()->company_id))
                ->orderBy('company_id')->orderBy('sort_order')->get(),
            'companies' => Company::when(!$request->user()->isSuperAdmin(), fn ($query) => $query->whereKey($request->user()->company_id))
                ->orderByDesc('is_parent')->orderBy('sort_order')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $this->authorizeCompany($request, (int) $data['company_id']);
        $data = $this->prepare($request, $data);
        Project::create($data);

        return back()->with('success', 'Project created.');
    }

    public function update(Request $request, Project $project): RedirectResponse
    {
        $this->authorizeCompany($request, $project->company_id);
        $data = $this->validated($request, $project);
        $this->authorizeCompany($request, (int) $data['company_id']);
        $project->update($this->prepare($request, $data, $project));

        return back()->with('success', 'Project updated.');
    }

    public function destroy(Request $request, Project $project): RedirectResponse
    {
        $this->authorizeCompany($request, $project->company_id);
        $this->deleteManagedImage($project->cover_image_path);
        $project->delete();

        return back()->with('success', 'Project deleted.');
    }

    private function validated(Request $request, ?Project $project = null): array
    {
        return $request->validate([
            'company_id' => ['required', 'exists:companies,id'],
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'alpha_dash', 'max:190'],
            'category' => ['nullable', 'string', 'max:120'],
            'summary' => ['nullable', 'string', 'max:1000'],
            'description' => ['nullable', 'string'],
            'client' => ['nullable', 'string', 'max:160'],
            'location' => ['nullable', 'string', 'max:160'],
            'completed_at' => ['nullable', 'date'],
            'cover_image' => [$project ? 'nullable' : 'required', 'image', 'max:8192'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);
    }

    private function prepare(Request $request, array $data, ?Project $project = null): array
    {
        $data['slug'] = Str::slug($data['slug'] ?: $data['title']);
        if ($request->hasFile('cover_image')) {
            $data['cover_image_path'] = $request->file('cover_image')->store('projects', 'uploads');
            $this->deleteManagedImage($project?->cover_image_path);
        }
        unset($data['cover_image']);

        return $data;
    }

    private function authorizeCompany(Request $request, int $companyId): void
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
