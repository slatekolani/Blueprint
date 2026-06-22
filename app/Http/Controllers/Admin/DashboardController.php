<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Inquiry;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $companyId = $request->user()->isSuperAdmin() ? null : $request->user()->company_id;
        $scope = fn ($query) => $companyId ? $query->where('company_id', $companyId) : $query;

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'companies' => $request->user()->isSuperAdmin() ? Company::count() : 1,
                'services' => $scope(Service::query())->count(),
                'projects' => $scope(Project::query())->count(),
                'newInquiries' => $scope(Inquiry::query())->where('status', 'new')->count(),
            ],
            'recentInquiries' => $scope(Inquiry::query())
                ->with('company:id,name')
                ->latest()
                ->limit(8)
                ->get(),
        ]);
    }
}
