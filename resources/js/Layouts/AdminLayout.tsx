import BrandMark from '@/Components/BrandMark';
import { successToast } from '@/lib/swal';
import { Link, router, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect } from 'react';

const nav = [
    ['Overview', 'admin.dashboard'],
    ['Companies', 'admin.companies.index'],
    ['Services', 'admin.services.index'],
    ['Projects', 'admin.projects.index'],
    ['Clients', 'admin.clients.index'],
    ['Inquiries', 'admin.inquiries.index'],
];

export default function AdminLayout({ title, children }: PropsWithChildren<{ title: string }>) {
    const { auth } = usePage<any>().props;

    useEffect(() => {
        return router.on('success', (event) => {
            const flash = (event.detail.page.props as any).flash;
            if (flash?.success) successToast(flash.success);
        });
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
                <div className="p-6"><BrandMark /></div>
                <nav className="space-y-1 px-4 py-3">
                    {nav.map(([label, name]) => <Link key={name} href={route(name)} className={`block rounded-xl px-4 py-3 text-sm font-extrabold ${route().current(name) ? 'bg-blueprint-50 text-blueprint-800' : 'text-slate-600 hover:bg-slate-50'}`}>{label}</Link>)}
                    {auth.user.role === 'super_admin' && <Link href={route('admin.settings.edit')} className={`block rounded-xl px-4 py-3 text-sm font-extrabold ${route().current('admin.settings.edit') ? 'bg-blueprint-50 text-blueprint-800' : 'text-slate-600 hover:bg-slate-50'}`}>Site settings</Link>}
                </nav>
                <div className="absolute inset-x-4 bottom-5 rounded-xl bg-slate-50 p-4">
                    <p className="truncate text-sm font-extrabold">{auth.user.name}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">{auth.user.company?.name || 'All companies'}</p>
                    <Link href={route('logout')} method="post" as="button" className="mt-3 text-xs font-extrabold text-red-600">Sign out</Link>
                </div>
            </aside>
            <div className="lg:pl-64">
                <header className="border-b border-slate-200 bg-white">
                    <div className="flex min-h-20 items-center justify-between px-5 sm:px-8">
                        <div><p className="text-xs font-black uppercase tracking-wider text-blueprint-600">Content management</p><h1 className="mt-1 text-2xl font-black">{title}</h1></div>
                        <div className="flex gap-3"><Link href={route('home')} className="admin-button-muted">View website</Link><Link href={route('profile.edit')} className="admin-button-muted">Profile</Link></div>
                    </div>
                    <nav className="flex gap-2 overflow-x-auto px-5 pb-4 lg:hidden">{nav.map(([label, name]) => <Link key={name} href={route(name)} className="whitespace-nowrap rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold">{label}</Link>)}</nav>
                </header>
                <main className="p-5 sm:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
