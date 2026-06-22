import { Company, mediaUrl } from '@/types/content';
import { Link } from '@inertiajs/react';

export function CompanyLogo({ company, size = 'md' }: { company: Pick<Company, 'name' | 'short_name' | 'logo_path' | 'primary_color'>; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = size === 'sm' ? 'h-10 w-10 text-xs' : size === 'lg' ? 'h-20 w-20 text-xl' : 'h-12 w-12 text-sm';
    const initials = (company.short_name || company.name).slice(0, 2).toUpperCase();
    if (company.logo_path) {
        return <img src={mediaUrl(company.logo_path)} alt={`${company.short_name || company.name} logo`} className={`${sizeClass} shrink-0 rounded-xl bg-white object-contain p-1 ring-1 ring-slate-200`} />;
    }
    return (
        <span className={`${sizeClass} inline-flex shrink-0 items-center justify-center rounded-xl font-black text-white`} style={{ backgroundColor: company.primary_color }}>
            {initials}
        </span>
    );
}

export default function CompanyCard({ company }: { company: Company }) {
    return (
        <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <Link href={route('companies.show', company.slug)} className="block">
                <div className="relative h-56 overflow-hidden bg-slate-100">
                    {company.hero_image_path && (
                        <img src={mediaUrl(company.hero_image_path)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                    <span className="absolute bottom-5 left-5 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold uppercase tracking-wider" style={{ color: company.primary_color }}>
                        BluePrint Group
                    </span>
                </div>
                <div className="p-6 pb-4">
                    <div className="flex items-start gap-4">
                        <CompanyLogo company={company} size="md" />
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-950">{company.short_name || company.name}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">{company.summary}</p>
                        </div>
                    </div>
                    <span className="mt-5 inline-flex text-sm font-extrabold" style={{ color: company.primary_color }}>Explore company →</span>
                </div>
            </Link>
            <div className="px-6 pb-6">
                <Link
                    href={route('companies.show', company.slug) + '#request'}
                    className="block w-full rounded-xl border py-3 text-center text-sm font-bold transition hover:text-white"
                    style={{ borderColor: company.primary_color, color: company.primary_color }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.backgroundColor = company.primary_color; el.style.color = '#fff'; }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.backgroundColor = ''; el.style.color = company.primary_color; }}
                >
                    Request service
                </Link>
            </div>
        </article>
    );
}
