<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Company;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSetting;
use Inertia\Inertia;
use Inertia\Response;

class PublicSiteController extends Controller
{
    public function home(): Response
    {
        $group = Company::query()
            ->where('is_parent', true)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('Public/Home', [
            'group' => $group,
            'companies' => Company::query()
                ->where('is_parent', false)
                ->where('is_published', true)
                ->with(['services' => fn ($query) => $query->where('is_published', true)->limit(4)])
                ->orderBy('sort_order')
                ->get(),
            'featuredServices' => Service::query()
                ->where('is_featured', true)
                ->where('is_published', true)
                ->with('company:id,name,slug,hero_image_path,primary_color')
                ->orderBy('sort_order')
                ->limit(8)
                ->get(),
            'featuredProjects' => Project::query()
                ->where('is_featured', true)
                ->where('is_published', true)
                ->with('company:id,name,slug')
                ->orderBy('sort_order')
                ->limit(6)
                ->get(),
            'clients' => Client::where('is_published', true)->orderBy('sort_order')->orderBy('name')->get(['id', 'uuid', 'name', 'logo_path', 'description', 'website']),
            'settings' => SiteSetting::values(),
            'meta' => [
                'title'       => 'BluePrint Group Tanzania | Creative, Supply & Business Solutions',
                'description' => 'BluePrint Group is Tanzania\'s multi-sector business group delivering design, branding, printing, marketing, supply, logistics, insurance and ICT solutions from Dar es Salaam.',
                'structuredData' => [
                    '@context' => 'https://schema.org',
                    '@type'    => 'WebSite',
                    '@id'      => url('/') . '#website',
                    'name'     => 'BluePrint Group Tanzania',
                    'url'      => url('/'),
                    'description' => 'Tanzania\'s multi-sector creative and business solutions group.',
                    'publisher' => ['@id' => url('/') . '#organization'],
                ],
            ],
        ]);
    }

    public function about(): Response
    {
        $group = Company::where('is_parent', true)->where('is_published', true)->firstOrFail();

        return Inertia::render('Public/About', [
            'group' => $group,
            'companies' => Company::where('is_parent', false)->where('is_published', true)->orderBy('sort_order')->get(),
            'settings' => SiteSetting::values(),
            'meta' => [
                'title'       => 'About BluePrint Group | Tanzania Business Group',
                'description' => $group->meta_description ?: 'Learn about BluePrint Group — a Tanzanian business group combining creative, supply and professional services under one roof in Dar es Salaam.',
            ],
        ]);
    }

    public function companies(): Response
    {
        return Inertia::render('Public/Companies', [
            'companies' => Company::where('is_published', true)
                ->withCount(['services' => fn ($query) => $query->where('is_published', true)])
                ->orderByDesc('is_parent')
                ->orderBy('sort_order')
                ->get(),
            'meta' => [
                'title'       => 'Our Companies | BluePrint Group Tanzania',
                'description' => 'Explore the specialist companies that make up BluePrint Group — covering printing, supply, logistics, insurance and ICT services across Tanzania.',
            ],
        ]);
    }

    public function company(Company $company): Response
    {
        abort_unless($company->is_published, 404);

        $company->load([
            'services' => fn ($query) => $query->where('is_published', true)->orderBy('sort_order'),
            'projects' => fn ($query) => $query->where('is_published', true)->orderBy('sort_order'),
        ]);

        $schemaAddress = $company->address ? [
            '@type'           => 'PostalAddress',
            'streetAddress'   => $company->address,
            'addressLocality' => 'Dar es Salaam',
            'addressCountry'  => 'TZ',
        ] : null;

        $schema = array_filter([
            '@context'           => 'https://schema.org',
            '@type'              => 'LocalBusiness',
            '@id'                => route('companies.show', $company->slug) . '#business',
            'name'               => $company->name,
            'description'        => $company->meta_description ?: $company->summary,
            'url'                => route('companies.show', $company->slug),
            'telephone'          => $company->phone,
            'email'              => $company->email,
            'address'            => $schemaAddress,
            'parentOrganization' => ['@id' => url('/') . '#organization'],
            'areaServed'         => 'Tanzania',
        ]);

        return Inertia::render('Public/Company', [
            'company' => $company,
            'siblings' => Company::where('is_published', true)
                ->whereKeyNot($company->id)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'short_name', 'primary_color', 'logo_path', 'hero_image_path']),
            'meta' => [
                'title'         => ($company->meta_title ?: $company->name) . ' | BluePrint Group Tanzania',
                'description'   => $company->meta_description ?: $company->summary,
                'image'         => $company->hero_image_path ? url($company->hero_image_path) : null,
                'ogType'        => 'business.business',
                'structuredData' => $schema,
                'breadcrumbs'   => [
                    ['label' => 'Home',      'href' => '/'],
                    ['label' => 'Companies', 'href' => '/companies'],
                    ['label' => $company->short_name ?: $company->name],
                ],
            ],
        ]);
    }

    public function services(): Response
    {
        return Inertia::render('Public/Services', [
            'companies' => Company::where('is_published', true)
                ->with(['services' => fn ($query) => $query->where('is_published', true)->orderBy('sort_order')])
                ->orderByDesc('is_parent')
                ->orderBy('sort_order')
                ->get(),
            'meta' => [
                'title'       => 'Services | BluePrint Group Tanzania',
                'description' => 'Browse the full range of business services from BluePrint Group companies — design, branding, printing, supply, logistics, insurance, ICT and events in Tanzania.',
            ],
        ]);
    }

    public function service(Service $service): Response
    {
        abort_unless($service->is_published, 404);

        $service->load('company');

        $related = Service::where('company_id', $service->company_id)
            ->where('is_published', true)
            ->whereKeyNot($service->id)
            ->orderBy('sort_order')
            ->limit(3)
            ->get();

        $companyName = $service->company->short_name ?: $service->company->name;

        return Inertia::render('Public/ServiceDetail', [
            'service' => $service,
            'related' => $related,
            'meta' => [
                'title'       => $service->name . ' — ' . $companyName . ' | BluePrint Group',
                'description' => $service->summary,
                'image'       => $service->image_path ? url($service->image_path) : null,
                'breadcrumbs' => [
                    ['label' => 'Home',     'href' => '/'],
                    ['label' => 'Services', 'href' => '/services'],
                    ['label' => $service->name],
                ],
                'structuredData' => [
                    '@context'    => 'https://schema.org',
                    '@type'       => 'Service',
                    'name'        => $service->name,
                    'description' => $service->description ?: $service->summary,
                    'url'         => route('services.show', $service->slug),
                    'provider'    => [
                        '@type' => 'Organization',
                        'name'  => $service->company->name,
                        '@id'   => url('/') . '#organization',
                    ],
                    'areaServed'  => 'Tanzania',
                    'serviceType' => $service->category,
                ],
            ],
        ]);
    }

    public function projects(): Response
    {
        return Inertia::render('Public/Projects', [
            'projects' => Project::where('is_published', true)
                ->with('company:id,name,slug,short_name,primary_color,accent_color,logo_path,email')
                ->orderByDesc('is_featured')
                ->orderBy('sort_order')
                ->get(),
            'meta' => [
                'title'       => 'Projects & Work | BluePrint Group Tanzania',
                'description' => 'Explore selected projects and capabilities from across BluePrint Group — printing, branding, supply, logistics and more delivered across Tanzania.',
            ],
        ]);
    }

    public function project(Project $project): Response
    {
        abort_unless($project->is_published, 404);

        $project->load('company');

        $related = Project::where('company_id', $project->company_id)
            ->where('is_published', true)
            ->whereKeyNot($project->id)
            ->orderBy('sort_order')
            ->limit(3)
            ->get();

        $companyName = $project->company->short_name ?: $project->company->name;

        return Inertia::render('Public/ProjectDetail', [
            'project' => $project,
            'related' => $related,
            'meta' => [
                'title'       => $project->title . ' | ' . $companyName . ' — BluePrint Group',
                'description' => $project->summary,
                'image'       => $project->cover_image_path ? url($project->cover_image_path) : null,
                'breadcrumbs' => [
                    ['label' => 'Home',     'href' => '/'],
                    ['label' => 'Projects', 'href' => '/projects'],
                    ['label' => $project->title],
                ],
                'structuredData' => [
                    '@context'    => 'https://schema.org',
                    '@type'       => 'CreativeWork',
                    'name'        => $project->title,
                    'description' => $project->description ?: $project->summary,
                    'url'         => route('projects.show', $project->slug),
                    'creator'     => [
                        '@type' => 'Organization',
                        'name'  => $project->company->name,
                        '@id'   => url('/') . '#organization',
                    ],
                    'locationCreated' => $project->location ? [
                        '@type' => 'Place',
                        'name'  => $project->location,
                    ] : null,
                    'dateCreated' => $project->completed_at,
                ],
            ],
        ]);
    }

    public function contact(): Response
    {
        return Inertia::render('Public/Contact', [
            'companies' => Company::where('is_published', true)->orderByDesc('is_parent')->orderBy('sort_order')->get(),
            'services'  => Service::where('is_published', true)->orderBy('name')->get(['id', 'company_id', 'name']),
            'settings'  => SiteSetting::values(),
            'meta' => [
                'title'       => 'Contact BluePrint Group Tanzania | Request a Quote',
                'description' => 'Get in touch with BluePrint Group in Dar es Salaam. Request a quote for printing, design, supply, logistics, insurance or ICT services in Tanzania.',
                'structuredData' => [
                    '@context' => 'https://schema.org',
                    '@type'    => 'ContactPage',
                    'name'     => 'Contact BluePrint Group',
                    'url'      => route('contact'),
                    'mainEntity' => ['@id' => url('/') . '#organization'],
                ],
            ],
        ]);
    }
}
