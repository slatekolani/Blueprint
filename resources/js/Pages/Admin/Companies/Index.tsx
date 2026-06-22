import AdminLayout from '@/Layouts/AdminLayout';
import { confirmDelete } from '@/lib/swal';
import { Company } from '@/types/content';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ companies }: { companies: Company[] }) {
    async function handleDelete(company: Company) {
        if (!await confirmDelete(company.name)) return;
        router.delete(route('admin.companies.destroy', company.id));
    }

    return (
        <AdminLayout title="Companies">
            <Head title="Manage companies" />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {companies.map(company => (
                    <article key={company.id} className="admin-card">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider" style={{ color: company.primary_color }}>
                                    {company.is_parent ? 'Parent company' : 'Member company'}
                                </p>
                                <h2 className="mt-2 text-xl font-black">{company.name}</h2>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs font-bold ${company.is_published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {company.is_published ? 'Published' : 'Draft'}
                            </span>
                        </div>
                        <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{company.summary}</p>
                        <div className="mt-5 flex gap-5 text-xs font-bold text-slate-500">
                            <span>{company.services_count} services</span>
                            <span>{(company as any).projects_count} projects</span>
                        </div>
                        <div className="mt-6 flex items-center gap-3">
                            <Link href={route('admin.companies.edit', company.id)} className="admin-button flex-1 text-center">
                                Edit company
                            </Link>
                            <button
                                type="button"
                                onClick={() => handleDelete(company)}
                                className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 hover:text-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </AdminLayout>
    );
}
