<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $companies = Company::where('is_published', true)->get(['slug', 'updated_at']);
        $services  = Service::where('is_published', true)->get(['slug', 'updated_at']);
        $projects  = Project::where('is_published', true)->get(['slug', 'updated_at']);

        $content = view('sitemap', compact('companies', 'services', 'projects'))->render();

        return response($content, 200)->header('Content-Type', 'application/xml');
    }
}
