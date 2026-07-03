<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class GalleryItemController extends Controller
{
    private const IMAGE_MAX_KB = 8192;
    private const VIDEO_MAX_KB = 51200;

    public function index(Request $request): Response
    {
        return Inertia::render('Admin/Gallery/Index', [
            'items' => GalleryItem::with('service.company:id,name')
                ->when(!$request->user()->isSuperAdmin(), fn ($query) => $query->whereHas('service', fn ($service) => $service->where('company_id', $request->user()->company_id)))
                ->orderBy('sort_order')
                ->latest()
                ->get(),
            'services' => Service::with('company:id,name')
                ->when(!$request->user()->isSuperAdmin(), fn ($query) => $query->where('company_id', $request->user()->company_id))
                ->orderBy('company_id')
                ->orderBy('sort_order')
                ->get(['id', 'company_id', 'name']),
            'limits' => [
                'imageMb' => self::IMAGE_MAX_KB / 1024,
                'videoMb' => self::VIDEO_MAX_KB / 1024,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $this->authorizeService($request, (int) $data['service_id']);
        $data = $this->prepareMedia($request, $data);
        GalleryItem::create($data);

        return back()->with('success', 'Gallery item created.');
    }

    public function update(Request $request, GalleryItem $gallery): RedirectResponse
    {
        $this->authorizeService($request, $gallery->service_id);
        $data = $this->validated($request, $gallery);
        $this->authorizeService($request, (int) $data['service_id']);
        $gallery->update($this->prepareMedia($request, $data, $gallery));

        return back()->with('success', 'Gallery item updated.');
    }

    public function destroy(Request $request, GalleryItem $gallery): RedirectResponse
    {
        $this->authorizeService($request, $gallery->service_id);
        $this->deleteManagedMedia($gallery->media_path);
        $gallery->delete();

        return back()->with('success', 'Gallery item deleted.');
    }

    private function validated(Request $request, ?GalleryItem $gallery = null): array
    {
        $validator = Validator::make($request->all(), [
            'service_id' => ['required', 'exists:services,id'],
            'title' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:1000'],
            'media' => [$gallery ? 'nullable' : 'required', 'file', 'mimes:jpg,jpeg,png,webp,mp4,mov,webm', 'max:' . self::VIDEO_MAX_KB],
            'is_published' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:0'],
        ]);

        $validator->after(function ($validator) use ($request) {
            $file = $request->file('media');
            if (!$file) {
                return;
            }

            $mime = (string) $file->getMimeType();
            if (str_starts_with($mime, 'image/') && $file->getSize() > self::IMAGE_MAX_KB * 1024) {
                $validator->errors()->add('media', 'Images must be 8 MB or smaller.');
            }
            if (str_starts_with($mime, 'video/') && $file->getSize() > self::VIDEO_MAX_KB * 1024) {
                $validator->errors()->add('media', 'Videos must be 50 MB or smaller.');
            }
        });

        return $validator->validate();
    }

    private function prepareMedia(Request $request, array $data, ?GalleryItem $gallery = null): array
    {
        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $data['media_path'] = $file->store('gallery', 'uploads');
            $data['media_type'] = str_starts_with((string) $file->getMimeType(), 'video/') ? 'video' : 'image';
            $data['mime_type'] = $file->getMimeType();
            $this->deleteManagedMedia($gallery?->media_path);
        }

        unset($data['media']);

        return $data;
    }

    private function authorizeService(Request $request, int $serviceId): void
    {
        if ($request->user()->isSuperAdmin()) {
            return;
        }

        abort_unless(Service::whereKey($serviceId)->where('company_id', $request->user()->company_id)->exists(), 403);
    }

    private function deleteManagedMedia(?string $path): void
    {
        if ($path && !str_starts_with($path, '/') && !str_starts_with($path, 'http')) {
            Storage::disk('uploads')->delete($path);
        }
    }
}
