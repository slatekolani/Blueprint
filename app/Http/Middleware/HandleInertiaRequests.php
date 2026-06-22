<?php

namespace App\Http\Middleware;

use App\Models\Company;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user()?->load('company:id,name'),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
            ],
            'navigationCompanies' => fn () => Company::query()
                ->where('is_published', true)
                ->with(['services' => fn ($query) => $query
                    ->where('is_published', true)
                    ->orderBy('sort_order')])
                ->orderBy('sort_order')
                ->get([
                    'id',
                    'name',
                    'slug',
                    'short_name',
                    'tagline',
                    'summary',
                    'hero_image_path',
                    'primary_color',
                ]),
            'navigationServices' => fn () => Service::query()
                ->where('is_published', true)
                ->with('company:id,name,slug,short_name,hero_image_path,primary_color')
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->limit(8)
                ->get([
                    'id',
                    'company_id',
                    'name',
                    'slug',
                    'category',
                    'summary',
                    'image_path',
                ]),
            'navigationProjects' => fn () => Project::query()
                ->where('is_published', true)
                ->with('company:id,name,slug')
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->limit(6)
                ->get([
                    'id',
                    'company_id',
                    'title',
                    'slug',
                    'category',
                    'summary',
                    'cover_image_path',
                ]),
        ];
    }
}
