import AdminLayout from '@/Layouts/AdminLayout';
import { confirmDelete, confirmSave } from '@/lib/swal';
import { Inquiry } from '@/types/content';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    new:         { label: 'New',         color: 'bg-blue-50 text-blue-700' },
    in_progress: { label: 'In Progress', color: 'bg-amber-50 text-amber-700' },
    responded:   { label: 'Responded',   color: 'bg-emerald-50 text-emerald-700' },
    closed:      { label: 'Closed',      color: 'bg-slate-100 text-slate-500' },
};

export default function Index({ inquiries }: { inquiries: Inquiry[] }) {
    const [filter, setFilter] = useState<string>('all');
    const [selected, setSelected] = useState<Inquiry | null>(inquiries[0] || null);

    const filtered = filter === 'all' ? inquiries : inquiries.filter(i => i.status === filter);

    const counts = inquiries.reduce((acc, i) => {
        acc[i.status] = (acc[i.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const handleDelete = async (inquiry: Inquiry) => {
        if (!await confirmDelete(`inquiry from ${inquiry.name}`)) return;
        router.delete(route('admin.inquiries.destroy', inquiry.id), {
            preserveScroll: true,
            onSuccess: () => {
                if (selected?.id === inquiry.id) setSelected(null);
            },
        });
    };

    return (
        <AdminLayout title="Inquiries">
            <Head title="Customer inquiries" />

            <div className="mb-6 flex flex-wrap gap-2">
                {[
                    { key: 'all', label: 'All', count: inquiries.length },
                    { key: 'new', label: 'New', count: counts.new || 0 },
                    { key: 'in_progress', label: 'In Progress', count: counts.in_progress || 0 },
                    { key: 'responded', label: 'Responded', count: counts.responded || 0 },
                    { key: 'closed', label: 'Closed', count: counts.closed || 0 },
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setFilter(tab.key)}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition ${
                            filter === tab.key
                                ? 'bg-blueprint-700 text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-blueprint-300 hover:text-blueprint-700'
                        }`}
                    >
                        {tab.label}
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            <div className="grid gap-7 xl:grid-cols-[1fr_1.4fr]">
                <div className="space-y-2">
                    {filtered.length === 0 && (
                        <div className="admin-card py-16 text-center text-sm text-slate-400">No inquiries found.</div>
                    )}
                    {filtered.map(item => {
                        const badge = STATUS_LABELS[item.status] ?? STATUS_LABELS.new;
                        return (
                            <div
                                key={item.id}
                                className={`group flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition cursor-pointer ${
                                    selected?.id === item.id
                                        ? 'border-blueprint-400 bg-blueprint-50'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                                onClick={() => setSelected(item)}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-black truncate">{item.name}</p>
                                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase ${badge.color}`}>
                                            {badge.label}
                                        </span>
                                    </div>
                                    <p className="mt-1 text-xs font-bold text-slate-500">
                                        {item.company?.name || 'Group inquiry'} · {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.message}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={e => { e.stopPropagation(); handleDelete(item); }}
                                    className="shrink-0 mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                                    title="Delete inquiry"
                                >
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {selected
                    ? <InquiryPanel key={selected.id} inquiry={selected} onDelete={() => handleDelete(selected)} />
                    : <div className="admin-card py-20 text-center text-sm text-slate-400">Select an inquiry to view details.</div>
                }
            </div>
        </AdminLayout>
    );
}

function InquiryPanel({ inquiry, onDelete }: { inquiry: Inquiry; onDelete: () => void }) {
    const form = useForm({ status: inquiry.status, admin_notes: inquiry.admin_notes || '' });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!await confirmSave('update this inquiry')) return;
        form.put(route('admin.inquiries.update', inquiry.id), { preserveScroll: true });
    };

    const badge = STATUS_LABELS[inquiry.status] ?? STATUS_LABELS.new;

    return (
        <div className="admin-card self-start xl:sticky xl:top-6 xl:max-h-[calc(100vh-3rem)] xl:overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-black uppercase tracking-wider text-blueprint-600">{inquiry.type} inquiry</p>
                    <h2 className="mt-1 text-2xl font-black">{inquiry.name}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${badge.color}`}>{badge.label}</span>
                    <button
                        type="button"
                        onClick={onDelete}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50"
                        title="Delete inquiry"
                    >
                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 text-sm sm:grid-cols-2">
                <div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone</p><p className="mt-1 font-semibold">{inquiry.phone}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email</p><p className="mt-1 font-semibold">{inquiry.email || '—'}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Organisation</p><p className="mt-1 font-semibold">{inquiry.organization || '—'}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Company requested</p><p className="mt-1 font-semibold">{inquiry.company?.name || 'General'}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Service</p><p className="mt-1 font-semibold">{inquiry.service?.name || 'Not selected'}</p></div>
                <div><p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Date received</p><p className="mt-1 font-semibold">{new Date(inquiry.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
            </div>

            {inquiry.subject && (
                <div className="mt-5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Subject</p>
                    <p className="mt-1 font-semibold text-sm">{inquiry.subject}</p>
                </div>
            )}

            <div className="mt-5">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Message</p>
                <p className="mt-2 rounded-xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">{inquiry.message}</p>
            </div>

            <form onSubmit={submit} className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <label className="admin-label">
                    Update status
                    <select className="admin-input" value={form.data.status} onChange={e => form.setData('status', e.target.value)}>
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="responded">Responded</option>
                        <option value="closed">Closed</option>
                    </select>
                </label>
                <label className="admin-label">
                    Internal notes
                    <textarea className="admin-input min-h-28" placeholder="Add notes visible only to your team…" value={form.data.admin_notes} onChange={e => form.setData('admin_notes', e.target.value)} />
                </label>
                <button className="admin-button w-full" disabled={form.processing}>
                    {form.processing ? 'Saving…' : 'Save changes'}
                </button>
            </form>
        </div>
    );
}
