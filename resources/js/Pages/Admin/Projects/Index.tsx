import AdminLayout from '@/Layouts/AdminLayout';
import { confirmDelete, confirmSave } from '@/lib/swal';
import { Company, Project, mediaUrl } from '@/types/content';
import { Head, router, useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

const empty = { company_id: '', title: '', slug: '', category: '', summary: '', description: '', client: '', location: '', completed_at: '', cover_image: null as File | null, is_featured: false, is_published: true, sort_order: 0 };

export default function Index({ projects, companies }: { projects: Project[]; companies: Pick<Company, 'id' | 'name'>[] }) {
    const [editing, setEditing] = useState<Project | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const form = useForm<any>(empty);

    const select = (project?: Project) => {
        setEditing(project || null);
        form.clearErrors();
        form.setData(project ? { ...project, completed_at: project.completed_at?.slice(0, 10) || '', cover_image: null } : empty);
        if (project) formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!await confirmSave(editing ? 'update this project' : 'add this project')) return;
        const url = editing ? route('admin.projects.update', editing.id) : route('admin.projects.store');
        form.transform(data => editing ? { ...data, _method: 'put' } : data);
        form.post(url, { forceFormData: true, preserveScroll: true, onSuccess: () => select() });
    };

    const handleDelete = async (project: Project) => {
        if (!await confirmDelete(project.title)) return;
        router.delete(route('admin.projects.destroy', project.id), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Projects">
            <Head title="Manage projects" />
            <div className="grid gap-7 xl:grid-cols-[.72fr_1.28fr]">
                <form ref={formRef} onSubmit={submit} className="admin-card h-fit self-start xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
                    <div className="flex items-center justify-between"><h2 className="text-lg font-black">{editing ? 'Edit project' : 'Add project'}</h2>{editing && <button type="button" className="text-xs font-bold text-slate-500" onClick={() => select()}>Cancel</button>}</div>
                    <div className="mt-6 space-y-4">
                        <Label text="Company" error={form.errors.company_id}><select className="admin-input" value={form.data.company_id} onChange={e => form.setData('company_id', e.target.value)}><option value="">Select company</option>{companies.map(company => <option value={company.id} key={company.id}>{company.name}</option>)}</select></Label>
                        <Label text="Project title" error={form.errors.title}><input className="admin-input" value={form.data.title} onChange={e => form.setData('title', e.target.value)} /></Label>
                        <div className="grid gap-4 sm:grid-cols-2"><Label text="Category"><input className="admin-input" value={form.data.category || ''} onChange={e => form.setData('category', e.target.value)} /></Label><Label text="Sort order"><input type="number" className="admin-input" value={form.data.sort_order} onChange={e => form.setData('sort_order', Number(e.target.value))} /></Label></div>
                        <Label text="Summary"><textarea className="admin-input min-h-24" value={form.data.summary || ''} onChange={e => form.setData('summary', e.target.value)} /></Label>
                        <Label text="Description"><textarea className="admin-input min-h-28" value={form.data.description || ''} onChange={e => form.setData('description', e.target.value)} /></Label>
                        <div className="grid gap-4 sm:grid-cols-2"><Label text="Client"><input className="admin-input" value={form.data.client || ''} onChange={e => form.setData('client', e.target.value)} /></Label><Label text="Location"><input className="admin-input" value={form.data.location || ''} onChange={e => form.setData('location', e.target.value)} /></Label></div>
                        <Label text="Completion date"><input type="date" className="admin-input" value={form.data.completed_at || ''} onChange={e => form.setData('completed_at', e.target.value)} /></Label>
                        <Label text={editing ? 'Replace cover image' : 'Cover image'} error={form.errors.cover_image}>
                            {editing?.cover_image_path && <img src={mediaUrl(editing.cover_image_path)} alt={editing.title} className="mb-2 h-32 w-full rounded-xl object-cover" />}
                            <input type="file" accept="image/*" required={!editing} className="admin-input" onChange={e => form.setData('cover_image', e.target.files?.[0] || null)} />
                        </Label>
                        <div className="flex gap-6"><Toggle label="Featured" checked={form.data.is_featured} set={value => form.setData('is_featured', value)} /><Toggle label="Published" checked={form.data.is_published} set={value => form.setData('is_published', value)} /></div>
                        <button className="admin-button w-full" disabled={form.processing}>{form.processing ? 'Saving…' : editing ? 'Update project' : 'Add project'}</button>
                    </div>
                </form>
                <div className="grid gap-5 md:grid-cols-2">
                    {projects.map(project => (
                        <article key={project.id} className="admin-card overflow-hidden p-0">
                            {project.cover_image_path && <img src={mediaUrl(project.cover_image_path)} alt="" className="h-44 w-full object-cover" />}
                            <div className="p-5">
                                <p className="text-xs font-black uppercase tracking-wider text-blueprint-600">{project.company?.name} · {project.category}</p>
                                <h3 className="mt-2 text-lg font-black">{project.title}</h3>
                                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{project.summary}</p>
                                <div className="mt-5 flex gap-2">
                                    <button className="admin-button-muted" onClick={() => select(project)}>Edit</button>
                                    <button className="rounded-lg px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50" onClick={() => handleDelete(project)}>Delete</button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

function Label({ text, error, children }: { text: string; error?: string; children: React.ReactNode }) { return <label className="admin-label">{text}{children}{error && <span className="field-error">{error}</span>}</label>; }
function Toggle({ label, checked, set }: { label: string; checked: boolean; set: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={checked} onChange={e => set(e.target.checked)} className="rounded text-blueprint-700 focus:ring-blueprint-500" />{label}</label>; }
