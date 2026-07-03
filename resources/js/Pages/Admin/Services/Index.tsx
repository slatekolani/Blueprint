import AdminLayout from '@/Layouts/AdminLayout';
import { confirmDelete, confirmSave } from '@/lib/swal';
import { Company, Service, formatServicePrice, mediaUrl } from '@/types/content';
import { Head, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

const empty = { company_id: '', name: '', slug: '', category: '', price: 'Price on request', icon: '', summary: '', description: '', image: null as File | null, is_featured: false, is_published: true, sort_order: 0 };

export default function Index({ services, companies }: { services: Service[]; companies: Pick<Company, 'id' | 'name'>[] }) {
    const [editing, setEditing] = useState<Service | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<any>(empty);

    const select = (service?: Service) => {
        setEditing(service || null);
        form.clearErrors();
        form.setData(service ? { ...service, image: null } : empty);
        if (service) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!await confirmSave(editing ? 'update this service' : 'add this service')) return;
        const url = editing ? route('admin.services.update', editing.id) : route('admin.services.store');
        form.transform(data => editing ? { ...data, _method: 'put' } : data);
        form.post(url, { forceFormData: true, preserveScroll: true, onSuccess: () => select() });
    };

    const handleDelete = async (service: Service) => {
        if (!await confirmDelete(service.name)) return;
        router.delete(route('admin.services.destroy', service.id), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Services">
            <Head title="Manage services" />
            <div className="grid gap-7 xl:grid-cols-[.72fr_1.28fr]">
                <form ref={formRef} onSubmit={submit} className="admin-card h-fit self-start xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
                    <div className="flex items-center justify-between"><h2 className="text-lg font-black">{editing ? 'Edit service' : 'Add service'}</h2>{editing && <button type="button" className="text-xs font-bold text-slate-500" onClick={() => select()}>Cancel</button>}</div>
                    <div className="mt-6 space-y-4">
                        <AdminField label="Company" error={form.errors.company_id}><select className="admin-input" value={form.data.company_id} onChange={e => form.setData('company_id', e.target.value)}><option value="">Select company</option>{companies.map(company => <option value={company.id} key={company.id}>{company.name}</option>)}</select></AdminField>
                        <AdminField label="Service name" error={form.errors.name}><input className="admin-input" value={form.data.name} onChange={e => form.setData('name', e.target.value)} /></AdminField>
                        <div className="grid gap-4 sm:grid-cols-2"><AdminField label="Category"><input className="admin-input" value={form.data.category || ''} onChange={e => form.setData('category', e.target.value)} /></AdminField><AdminField label="Price" error={form.errors.price}><input className="admin-input" value={form.data.price || ''} onChange={e => form.setData('price', e.target.value)} required /></AdminField></div>
                        <AdminField label="Sort order"><input type="number" className="admin-input" value={form.data.sort_order} onChange={e => form.setData('sort_order', Number(e.target.value))} /></AdminField>
                        <AdminField label="Short summary"><textarea className="admin-input min-h-24" value={form.data.summary || ''} onChange={e => form.setData('summary', e.target.value)} /></AdminField>
                        <AdminField label="Full description"><textarea className="admin-input min-h-32" value={form.data.description || ''} onChange={e => form.setData('description', e.target.value)} /></AdminField>
                        <AdminField label={editing ? 'Replace image' : 'Image'} error={form.errors.image}>
                            {editing?.image_path && <img src={mediaUrl(editing.image_path)} alt={editing.name} className="mb-2 h-32 w-full rounded-xl object-cover" />}
                            <input type="file" accept="image/*" required={!editing} className="admin-input" onChange={e => form.setData('image', e.target.files?.[0] || null)} />
                        </AdminField>
                        <div className="flex gap-6"><Toggle label="Featured" checked={form.data.is_featured} set={value => form.setData('is_featured', value)} /><Toggle label="Published" checked={form.data.is_published} set={value => form.setData('is_published', value)} /></div>
                        <button className="admin-button w-full" disabled={form.processing}>{form.processing ? 'Saving…' : editing ? 'Update service' : 'Add service'}</button>
                    </div>
                </form>
                <div className="space-y-4">
                    {services.map(service => (
                        <article key={service.id} className="admin-card overflow-hidden p-0">
                            <div className="grid sm:grid-cols-[180px_1fr]">
                                {service.image_path && <img src={mediaUrl(service.image_path)} alt={service.name} className="h-48 w-full object-cover sm:h-full" />}
                                <div className="flex flex-col justify-between gap-4 p-6 sm:flex-row">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-wider text-blueprint-600">{service.company?.name} · {service.category || 'Service'}</p>
                                        <h3 className="mt-2 text-lg font-black">{service.name}</h3>
                                        <p className="mt-2 text-sm font-extrabold text-slate-900">{formatServicePrice(service.price)}</p>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{service.summary}</p>
                                    </div>
                                    <div className="flex shrink-0 items-start gap-2">
                                        <button className="admin-button-muted" onClick={() => select(service)}>Edit</button>
                                        <button className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50" onClick={() => handleDelete(service)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

function AdminField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="admin-label">{label}{children}{error && <span className="field-error">{error}</span>}</label>; }
function Toggle({ label, checked, set }: { label: string; checked: boolean; set: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={checked} onChange={e => set(e.target.checked)} className="rounded text-blueprint-700 focus:ring-blueprint-500" />{label}</label>; }
