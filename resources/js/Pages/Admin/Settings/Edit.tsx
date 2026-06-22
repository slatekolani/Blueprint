import AdminLayout from '@/Layouts/AdminLayout';
import { confirmSave } from '@/lib/swal';
import { Head, useForm } from '@inertiajs/react';

type Setting = { id: number; key: string; value: string; type: string; group: string; label: string };

export default function Edit({ settings }: { settings: Setting[] }) {
    const grouped = settings.reduce<Record<string, Setting[]>>((all, setting) => { (all[setting.group] ||= []).push(setting); return all; }, {});
    const form = useForm({ settings: Object.fromEntries(settings.map(setting => [setting.key, setting.value || ''])) });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!await confirmSave('update site settings')) return;
        form.put(route('admin.settings.update'), { preserveScroll: true });
    };

    return (
        <AdminLayout title="Site settings">
            <Head title="Site settings" />
            <form onSubmit={submit} className="space-y-6">
                {Object.entries(grouped).map(([group, items]) => (
                    <section key={group} className="admin-card">
                        <h2 className="text-lg font-black capitalize">{group}</h2>
                        <div className="mt-6 grid gap-5 md:grid-cols-2">
                            {items.map(setting => (
                                <label key={setting.id} className={`admin-label ${setting.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                                    {setting.label || setting.key}
                                    {setting.type === 'textarea'
                                        ? <textarea className="admin-input min-h-28" value={form.data.settings[setting.key]} onChange={e => form.setData('settings', { ...form.data.settings, [setting.key]: e.target.value })} />
                                        : <input type={setting.type === 'email' ? 'email' : 'text'} className="admin-input" value={form.data.settings[setting.key]} onChange={e => form.setData('settings', { ...form.data.settings, [setting.key]: e.target.value })} />
                                    }
                                </label>
                            ))}
                        </div>
                    </section>
                ))}
                <div className="flex justify-end">
                    <button className="admin-button px-8" disabled={form.processing}>Save settings</button>
                </div>
            </form>
        </AdminLayout>
    );
}
