import AdminLayout from '@/Layouts/AdminLayout';
import { Inquiry } from '@/types/content';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ stats, recentInquiries }: { stats: Record<string, number>; recentInquiries: Inquiry[] }) {
    return (
        <AdminLayout title="Overview">
            <Head title="Admin overview" />
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {[['Companies', stats.companies], ['Services', stats.services], ['Projects', stats.projects], ['New inquiries', stats.newInquiries]].map(([label, value]) => <div key={label} className="admin-card"><p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p><p className="mt-4 text-4xl font-black text-slate-950">{value}</p></div>)}
            </div>
            <div className="admin-card mt-7 overflow-hidden p-0">
                <div className="flex items-center justify-between border-b border-slate-200 p-6"><div><h2 className="text-lg font-black">Recent inquiries</h2><p className="mt-1 text-sm text-slate-500">Latest requests received from the public website.</p></div><Link href={route('admin.inquiries.index')} className="text-link">View all →</Link></div>
                <div className="divide-y divide-slate-100">{recentInquiries.length ? recentInquiries.map(item => <div key={item.id} className="grid gap-2 p-5 sm:grid-cols-[1fr_.7fr_.35fr]"><div><p className="font-extrabold">{item.name}</p><p className="mt-1 truncate text-sm text-slate-500">{item.message}</p></div><p className="text-sm font-semibold text-slate-600">{item.company?.name || 'Group inquiry'}</p><span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase text-blueprint-700">{item.status}</span></div>) : <p className="p-6 text-sm text-slate-500">No inquiries yet.</p>}</div>
            </div>
        </AdminLayout>
    );
}
