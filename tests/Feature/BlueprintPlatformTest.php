<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Inquiry;
use App\Models\Project;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BlueprintPlatformTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_company_pages_are_database_driven(): void
    {
        $this->seed(DatabaseSeeder::class);

        $this->get('/companies/blue-access-insurance')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Public/Company')
                ->where('company.short_name', 'Blue Access')
                ->has('company.services', 7));
    }

    public function test_visitors_can_submit_an_inquiry(): void
    {
        $this->seed(DatabaseSeeder::class);
        $company = Company::where('slug', 'access-logistics')->firstOrFail();

        $this->post('/inquiries', [
            'company_id' => $company->id,
            'type' => 'supply',
            'name' => 'Project Manager',
            'phone' => '+255 700 000 000',
            'email' => 'manager@example.com',
            'message' => 'Please quote for a delivery of building materials.',
        ])->assertRedirect();

        $this->assertDatabaseHas('inquiries', [
            'company_id' => $company->id,
            'type' => 'supply',
            'status' => 'new',
        ]);
    }

    public function test_company_managers_only_see_their_company_content(): void
    {
        $this->seed(DatabaseSeeder::class);
        $company = Company::where('slug', 'access-logistics')->firstOrFail();
        $manager = User::factory()->create([
            'company_id' => $company->id,
            'role' => 'company_manager',
            'is_active' => true,
        ]);

        $this->actingAs($manager)
            ->get('/admin/companies')
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Companies/Index')
                ->has('companies', 1)
                ->where('companies.0.id', $company->id));
    }

    public function test_unassigned_accounts_cannot_enter_the_cms(): void
    {
        $user = User::factory()->create(['company_id' => null, 'role' => 'company_manager']);

        $this->actingAs($user)->get('/admin')->assertForbidden();
    }

    public function test_service_images_are_uploaded_and_replaced(): void
    {
        Storage::fake('public');
        $this->seed(DatabaseSeeder::class);
        $admin = User::where('role', 'super_admin')->firstOrFail();
        $company = Company::where('slug', 'wisevision')->firstOrFail();

        $this->actingAs($admin)->post('/admin/services', [
            'company_id' => $company->id,
            'name' => 'Exhibition Branding',
            'slug' => '',
            'category' => 'Branding',
            'summary' => 'Complete exhibition branding.',
            'description' => 'Complete exhibition branding and display production.',
            'image' => UploadedFile::fake()->image('service.jpg', 1200, 800),
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 20,
        ])->assertRedirect();

        $service = Service::where('name', 'Exhibition Branding')->firstOrFail();
        Storage::disk('public')->assertExists($service->image_path);
        $oldPath = $service->image_path;

        $this->actingAs($admin)->post("/admin/services/{$service->id}", [
            '_method' => 'put',
            'company_id' => $company->id,
            'name' => $service->name,
            'slug' => $service->slug,
            'category' => $service->category,
            'summary' => $service->summary,
            'description' => $service->description,
            'image' => UploadedFile::fake()->image('replacement.jpg', 1200, 800),
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 20,
        ])->assertRedirect();

        $service->refresh();
        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($service->image_path);
    }

    public function test_project_cover_images_are_required_and_uploaded(): void
    {
        Storage::fake('public');
        $this->seed(DatabaseSeeder::class);
        $admin = User::where('role', 'super_admin')->firstOrFail();
        $company = Company::where('slug', 'access-logistics')->firstOrFail();

        $this->actingAs($admin)->post('/admin/projects', [
            'company_id' => $company->id,
            'title' => 'Institutional Supply Delivery',
            'slug' => '',
            'category' => 'Supply',
            'summary' => 'A coordinated supply and delivery project.',
            'description' => 'A coordinated supply and delivery project for an institution.',
            'client' => 'Institutional client',
            'location' => 'Dar es Salaam',
            'completed_at' => '2026-06-01',
            'cover_image' => UploadedFile::fake()->image('project.jpg', 1200, 800),
            'is_featured' => true,
            'is_published' => true,
            'sort_order' => 20,
        ])->assertRedirect();

        $project = Project::where('title', 'Institutional Supply Delivery')->firstOrFail();
        Storage::disk('public')->assertExists($project->cover_image_path);
    }
}
