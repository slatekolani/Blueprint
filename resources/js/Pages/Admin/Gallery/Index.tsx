import AdminLayout from '@/Layouts/AdminLayout';
import { confirmDelete, confirmSave } from '@/lib/swal';
import { GalleryItem, Service, mediaUrl } from '@/types/content';
import { Head, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

type GalleryService = Pick<Service, 'id' | 'name' | 'company_id'> & {
    company?: { id: number; name: string };
};

type Limits = {
    imageMb: number;
    videoMb: number;
};

const empty = {
    service_id: '',
    title: '',
    description: '',
    media: null as File | null,
    is_published: true,
    sort_order: 0,
};

export default function Index({ items, services, limits }: { items: GalleryItem[]; services: GalleryService[]; limits: Limits }) {
    const [editing, setEditing] = useState<GalleryItem | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<any>(empty);

    const select = (item?: GalleryItem) => {
        setEditing(item || null);
        form.clearErrors();
        form.setData(item ? { ...item, media: null } : empty);
        if (item) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!await confirmSave(editing ? 'update this gallery item' : 'add this gallery item')) return;
        const url = editing ? route('admin.gallery.update', editing.id) : route('admin.gallery.store');
        form.transform(data => editing ? { ...data, _method: 'put' } : data);
        form.post(url, { forceFormData: true, preserveScroll: true, onSuccess: () => select() });
    };

    const handleDelete = async (item: GalleryItem) => {
        if (!await confirmDelete(item.title)) return;
        router.delete(route('admin.gallery.destroy', item.id), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Gallery">
            <Head title="Manage gallery" />
            <div className="grid gap-7 xl:grid-cols-[.72fr_1.28fr]">
                <form ref={formRef} onSubmit={submit} className="admin-card h-fit self-start xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black">{editing ? 'Edit gallery item' : 'Add gallery item'}</h2>
                        {editing && <button type="button" className="text-xs font-bold text-slate-500" onClick={() => select()}>Cancel</button>}
                    </div>
                    <div className="mt-6 space-y-4">
                        <Field label="Service" error={form.errors.service_id}>
                            <select className="admin-input" value={form.data.service_id} onChange={e => form.setData('service_id', e.target.value)}>
                                <option value="">Select service</option>
                                {services.map(service => (
                                    <option value={service.id} key={service.id}>
                                        {service.company?.name ? `${service.company.name} - ` : ''}{service.name}
                                    </option>
                                ))}
                            </select>
                        </Field>
                        <Field label="Title" error={form.errors.title}>
                            <input className="admin-input" value={form.data.title} onChange={e => form.setData('title', e.target.value)} />
                        </Field>
                        <Field label="Description" error={form.errors.description}>
                            <textarea className="admin-input min-h-28" value={form.data.description} onChange={e => form.setData('description', e.target.value)} />
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Sort order" error={form.errors.sort_order}>
                                <input type="number" className="admin-input" value={form.data.sort_order} onChange={e => form.setData('sort_order', Number(e.target.value))} />
                            </Field>
                            <div className="flex items-end">
                                <Toggle label="Published" checked={form.data.is_published} set={value => form.setData('is_published', value)} />
                            </div>
                        </div>
                        <Field label={editing ? 'Replace media' : 'Media'} error={form.errors.media}>
                            {editing && <MediaPreview item={editing} className="mb-2 h-36 w-full rounded-xl object-cover" />}
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                                required={!editing}
                                className="admin-input"
                                onChange={e => form.setData('media', e.target.files?.[0] || null)}
                            />
                            <span className="mt-1 block text-xs font-semibold text-slate-500">
                                Images up to {limits.imageMb} MB. Videos up to {limits.videoMb} MB.
                            </span>
                        </Field>
                        <button className="admin-button w-full" disabled={form.processing}>{form.processing ? 'Saving...' : editing ? 'Update item' : 'Add item'}</button>
                    </div>
                </form>

                <div className="grid gap-5 md:grid-cols-2">
                    {items.map(item => (
                        <article key={item.id} className="admin-card overflow-hidden p-0">
                            <MediaPreview item={item} className="h-48 w-full object-cover" />
                            <div className="p-5">
                                <p className="text-xs font-black uppercase tracking-wider text-blueprint-600">
                                    {item.service?.company?.name || 'Service'} - {item.service?.name}
                                </p>
                                <h3 className="mt-2 text-lg font-black">{item.title}</h3>
                                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{item.description}</p>
                                <div className="mt-5 flex gap-2">
                                    <button className="admin-button-muted" onClick={() => select(item)}>Edit</button>
                                    <button className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50" onClick={() => handleDelete(item)}>Delete</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

function MediaPreview({ item, className }: { item: GalleryItem; className: string }) {
    if (item.media_type === 'video') {
        return <video src={mediaUrl(item.media_path)} className={className} controls playsInline preload="metadata" />;
    }

    return <img src={mediaUrl(item.media_path)} alt={item.title} className={className} />;
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return <label className="admin-label">{label}{children}{error && <span className="field-error">{error}</span>}</label>;
}

function Toggle({ label, checked, set }: { label: string; checked: boolean; set: (value: boolean) => void }) {
    return <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={checked} onChange={e => set(e.target.checked)} className="rounded text-blueprint-700 focus:ring-blueprint-500" />{label}</label>;
}
