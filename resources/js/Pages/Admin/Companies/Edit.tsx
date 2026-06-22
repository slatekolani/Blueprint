import AdminLayout from '@/Layouts/AdminLayout';
import { confirmSave } from '@/lib/swal';
import { Company, mediaUrl } from '@/types/content';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ company, parents }: { company: Company; parents: Pick<Company, 'id' | 'name'>[] }) {
    const form = useForm<any>({ ...company, logo: null, hero_image: null });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!await confirmSave('update this company')) return;
        form.transform(data => ({ ...data, _method: 'put' }));
        form.post(route('admin.companies.update', company.id), { forceFormData: true, preserveScroll: true });
    };

    return (
        <AdminLayout title={`Edit ${company.short_name || company.name}`}>
            <Head title={`Edit ${company.name}`} />
            <form onSubmit={submit} className="space-y-6">
                <div className="admin-card grid gap-5 md:grid-cols-2">
                    <h2 className="text-lg font-black md:col-span-2">Identity</h2>
                    <Field label="Company name" error={form.errors.name}><input className="admin-input" value={form.data.name} onChange={e => form.setData('name', e.target.value)} /></Field>
                    <Field label="Short name"><input className="admin-input" value={form.data.short_name || ''} onChange={e => form.setData('short_name', e.target.value)} /></Field>
                    <Field label="URL slug" error={form.errors.slug}><input className="admin-input" value={form.data.slug} onChange={e => form.setData('slug', e.target.value)} /></Field>
                    <Field label="Parent company"><select className="admin-input" value={form.data.parent_id || ''} onChange={e => form.setData('parent_id', e.target.value || null)}><option value="">None</option>{parents.map(parent => <option value={parent.id} key={parent.id}>{parent.name}</option>)}</select></Field>
                    <Field label="Tagline" wide><input className="admin-input" value={form.data.tagline || ''} onChange={e => form.setData('tagline', e.target.value)} /></Field>
                    <Field label="Summary" wide><textarea className="admin-input min-h-24" value={form.data.summary || ''} onChange={e => form.setData('summary', e.target.value)} /></Field>
                    <Field label="Full description" wide><textarea className="admin-input min-h-40" value={form.data.description || ''} onChange={e => form.setData('description', e.target.value)} /></Field>
                </div>
                <div className="admin-card grid gap-5 md:grid-cols-2">
                    <h2 className="text-lg font-black md:col-span-2">Contact and branding</h2>
                    {(['email', 'phone', 'website', 'address', 'instagram', 'facebook', 'linkedin'] as const).map(key => <Field label={key.replace('_', ' ')} key={key}><input className="admin-input" value={form.data[key] || ''} onChange={e => form.setData(key, e.target.value)} /></Field>)}
                    <Field label="Primary color"><input type="color" className="admin-input h-12" value={form.data.primary_color} onChange={e => form.setData('primary_color', e.target.value)} /></Field>
                    <Field label="Accent color"><input type="color" className="admin-input h-12" value={form.data.accent_color} onChange={e => form.setData('accent_color', e.target.value)} /></Field>
                    <Field label="Logo upload">{company.logo_path && <img src={mediaUrl(company.logo_path)} alt="" className="mb-2 h-16 w-16 rounded-xl bg-slate-100 object-contain p-2" />}<input type="file" accept="image/*" className="admin-input" onChange={e => form.setData('logo', e.target.files?.[0] || null)} /></Field>
                    <Field label="Hero image">{company.hero_image_path && <img src={mediaUrl(company.hero_image_path)} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />}<input type="file" accept="image/*" className="admin-input" onChange={e => form.setData('hero_image', e.target.files?.[0] || null)} /></Field>
                </div>
                <div className="admin-card grid gap-5 md:grid-cols-2">
                    <h2 className="text-lg font-black md:col-span-2">Publishing</h2>
                    <Field label="Sort order"><input type="number" min="0" className="admin-input" value={form.data.sort_order} onChange={e => form.setData('sort_order', Number(e.target.value))} /></Field>
                    <div className="flex items-center gap-7 pt-5"><Check label="Featured" checked={form.data.is_featured} onChange={value => form.setData('is_featured', value)} /><Check label="Published" checked={form.data.is_published} onChange={value => form.setData('is_published', value)} /></div>
                </div>
                <div className="flex justify-end"><button className="admin-button px-8" disabled={form.processing}>{form.processing ? 'Saving…' : 'Save company'}</button></div>
            </form>
        </AdminLayout>
    );
}

function Field({ label, error, wide, children }: { label: string; error?: string; wide?: boolean; children: React.ReactNode }) { return <label className={`admin-label ${wide ? 'md:col-span-2' : ''}`}>{label}{children}{error && <span className="field-error">{error}</span>}</label>; }
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" className="rounded border-slate-300 text-blueprint-700 focus:ring-blueprint-500" checked={checked} onChange={e => onChange(e.target.checked)} />{label}</label>; }
