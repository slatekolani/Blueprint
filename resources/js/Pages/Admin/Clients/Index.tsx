import AdminLayout from '@/Layouts/AdminLayout';
import { confirmDelete, confirmSave } from '@/lib/swal';
import { Client, mediaUrl } from '@/types/content';
import { Head, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

const empty = { name: '', description: '', website: '', sort_order: 0, is_published: true, logo: null as File | null };

export default function Index({ clients }: { clients: Client[] }) {
    const [editing, setEditing] = useState<Client | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<any>(empty);

    const select = (client?: Client) => {
        setEditing(client || null);
        form.clearErrors();
        form.setData(client ? { ...client, logo: null } : empty);
        if (client) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!await confirmSave(editing ? 'update this client' : 'add this client')) return;
        const url = editing ? route('admin.clients.update', editing.id) : route('admin.clients.store');
        form.transform(data => editing ? { ...data, _method: 'put' } : data);
        form.post(url, { forceFormData: true, preserveScroll: true, onSuccess: () => select() });
    };

    const handleDelete = async (client: Client) => {
        if (!await confirmDelete(client.name)) return;
        router.delete(route('admin.clients.destroy', client.id), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Clients">
            <Head title="Manage clients" />
            <div className="grid gap-7 xl:grid-cols-[.72fr_1.28fr]">
                <form ref={formRef} onSubmit={submit} className="admin-card h-fit self-start xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black">{editing ? 'Edit client' : 'Add client'}</h2>
                        {editing && <button type="button" className="text-xs font-bold text-slate-500" onClick={() => select()}>Cancel</button>}
                    </div>
                    <div className="mt-6 space-y-4">
                        <Field label="Client name" error={form.errors.name}>
                            <input className="admin-input" value={form.data.name} onChange={e => form.setData('name', e.target.value)} />
                        </Field>
                        <Field label="Description" error={form.errors.description}>
                            <textarea
                                className="admin-input min-h-28"
                                placeholder="What did BluePrint do for this client?"
                                value={form.data.description || ''}
                                onChange={e => form.setData('description', e.target.value)}
                            />
                        </Field>
                        <Field label="Website (optional)" error={form.errors.website}>
                            <input className="admin-input" placeholder="https://" value={form.data.website || ''} onChange={e => form.setData('website', e.target.value)} />
                        </Field>
                        <Field label="Sort order">
                            <input type="number" className="admin-input" value={form.data.sort_order} onChange={e => form.setData('sort_order', Number(e.target.value))} />
                        </Field>
                        <Field label={editing ? 'Replace logo' : 'Logo'} error={form.errors.logo}>
                            {editing?.logo_path && (
                                <img src={mediaUrl(editing.logo_path)} alt={editing.name} className="mb-2 h-16 rounded-xl object-contain bg-slate-50 p-2 border border-slate-200" />
                            )}
                            <input type="file" accept="image/*" required={!editing} className="admin-input" onChange={e => form.setData('logo', e.target.files?.[0] || null)} />
                        </Field>
                        <label className="flex items-center gap-2 text-sm font-bold">
                            <input type="checkbox" checked={form.data.is_published} onChange={e => form.setData('is_published', e.target.checked)} className="rounded text-blueprint-700 focus:ring-blueprint-500" />
                            Published
                        </label>
                        <button className="admin-button w-full" disabled={form.processing}>
                            {form.processing ? 'Saving…' : editing ? 'Update client' : 'Add client'}
                        </button>
                    </div>
                </form>

                <div className="grid gap-4 sm:grid-cols-2">
                    {clients.map(client => (
                        <article key={client.id} className="admin-card flex items-center gap-4">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
                                {client.logo_path
                                    ? <img src={mediaUrl(client.logo_path)} alt={client.name} className="h-full w-full object-contain" />
                                    : <div className="flex h-full items-center justify-center text-xs text-slate-400">No logo</div>
                                }
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-extrabold truncate">{client.name}</p>
                                {client.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{client.description}</p>}
                                <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${client.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {client.is_published ? 'Published' : 'Draft'}
                                </span>
                            </div>
                            <div className="flex shrink-0 flex-col gap-1.5">
                                <button className="admin-button-muted" onClick={() => select(client)}>Edit</button>
                                <button className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50" onClick={() => handleDelete(client)}>
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))}
                    {!clients.length && (
                        <p className="col-span-2 py-16 text-center text-slate-400">No clients yet — add your first one.</p>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <label className="admin-label">
            {label}
            {children}
            {error && <span className="field-error">{error}</span>}
        </label>
    );
}
