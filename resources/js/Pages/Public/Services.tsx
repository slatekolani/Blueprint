import { CompanyLogo } from '@/Components/Public/CompanyCard';
import PageHero from '@/Components/Public/PageHero';
import RequestServiceModal from '@/Components/Public/RequestServiceModal';
import PublicLayout from '@/Layouts/PublicLayout';
import { Company, Service, mediaUrl } from '@/types/content';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type ModalState = { company: Company; serviceId: number | null } | null;

export default function Services({ companies }: { companies: Company[] }) {
    const [modal, setModal] = useState<ModalState>(null);

    return (
        <PublicLayout>
            <Head title="Services" />
            <PageHero
                eyebrow="Group services"
                title="From ideas to delivery and protection"
                copy="Browse the complete range of services currently managed by BluePrint and its member companies."
                crumbs={[{ label: 'Home', href: route('home') }, { label: 'Services' }]}
            />

            <section className="site-section">
                <div className="site-container divide-y divide-slate-200">
                    {companies.map(company => (
                        <CompanySection
                            key={company.id}
                            company={company}
                            onRequest={(serviceId) => setModal({ company, serviceId })}
                        />
                    ))}
                </div>
            </section>

            {modal && (
                <RequestServiceModal
                    company={modal.company}
                    services={modal.company.services ?? []}
                    initialServiceId={modal.serviceId}
                    open
                    onClose={() => setModal(null)}
                />
            )}
        </PublicLayout>
    );
}

// ─── Per-company section with mobile sticky header ────────────────────────────

function CompanySection({ company, onRequest }: {
    company: Company;
    onRequest: (serviceId: number | null) => void;
}) {
    const [stuck, setStuck] = useState(false);
    const sentinelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        // Fires when the sentinel (placed after company info) exits/enters
        // the viewport top, accounting for the 80px sticky header
        const obs = new IntersectionObserver(
            ([entry]) => setStuck(!entry.isIntersecting),
            { rootMargin: '-82px 0px 0px 0px', threshold: 0 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <div className="relative py-16 first:pt-0">

            {/* ── Mobile: full company info (not sticky) ── */}
            <div className="mb-8 lg:hidden">
                <p className="eyebrow" style={{ color: company.primary_color }}>
                    {company.is_parent ? 'Parent company' : 'Member company'}
                </p>
                <h2 className="mt-3 text-3xl font-black">{company.short_name || company.name}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{company.summary}</p>
                <div className="mt-5 flex flex-wrap gap-4">
                    <Link href={route('companies.show', company.slug)} className="text-link">
                        Company profile →
                    </Link>
                    <button
                        type="button"
                        onClick={() => onRequest(null)}
                        className="text-sm font-extrabold transition hover:opacity-70"
                        style={{ color: company.primary_color }}
                    >
                        Request a service →
                    </button>
                </div>
            </div>

            {/* ── Sentinel: sits after the mobile company info ── */}
            <div ref={sentinelRef} className="pointer-events-none absolute left-0 right-0 h-px" aria-hidden="true" />

            {/* ── Mobile sticky compact bar ── */}
            <div
                className={[
                    // Base — always sticky in mobile, hidden on desktop
                    'sticky top-20 z-30 lg:hidden',
                    // Bleed to screen edges so the bg fills wall-to-wall
                    '-mx-5 px-5 sm:-mx-8 sm:px-8',
                    // Height always occupies space so layout is stable
                    'flex h-12 items-center gap-3',
                    // Smooth all visual changes
                    'transition-all duration-300 ease-out',
                    // Stuck state: show frosted bar
                    stuck
                        ? 'bg-white/90 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(15,23,42,0.12)] border-b border-slate-100 pointer-events-auto'
                        : 'pointer-events-none opacity-0',
                ].join(' ')}
            >
                {/* Company logo */}
                <span className={`shrink-0 transition-all duration-300 ${stuck ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                    <CompanyLogo company={company} size="sm" />
                </span>

                {/* Company name */}
                <span
                    className={`flex-1 text-sm font-extrabold text-slate-900 transition-all duration-300 ${stuck ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'}`}
                >
                    {company.short_name || company.name}
                </span>

                {/* Quick request CTA */}
                <button
                    type="button"
                    onClick={() => onRequest(null)}
                    className={`text-xs font-black uppercase tracking-wider transition-all duration-500 ${stuck ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}
                    style={{ color: company.primary_color }}
                >
                    Request →
                </button>

                {/* Accent line at bar bottom */}
                <span
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left transition-transform duration-500 ease-out ${stuck ? 'scale-x-100' : 'scale-x-0'}`}
                    style={{ backgroundColor: company.primary_color, opacity: 0.35 }}
                />
            </div>

            {/* ── Main layout: 2-col on desktop, single col on mobile ── */}
            <div className="grid gap-8 lg:grid-cols-[.36fr_.64fr] lg:items-start">

                {/* Desktop: full company info (sticky left column) */}
                <div data-reveal="left" className="hidden lg:sticky lg:top-36 lg:block lg:self-start">
                    <p className="eyebrow" style={{ color: company.primary_color }}>
                        {company.is_parent ? 'Parent company' : 'Member company'}
                    </p>
                    <h2 className="mt-3 text-3xl font-black">{company.short_name || company.name}</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{company.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link href={route('companies.show', company.slug)} className="text-link">
                            Company profile →
                        </Link>
                        <button
                            type="button"
                            onClick={() => onRequest(null)}
                            className="text-sm font-extrabold transition hover:opacity-70"
                            style={{ color: company.primary_color }}
                        >
                            Request a service →
                        </button>
                    </div>
                </div>

                {/* Services grid — both mobile and desktop */}
                <div className="grid gap-5 sm:grid-cols-2">
                    {company.services?.map((service, i) => (
                        <div key={service.id} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                            <ServiceCard
                                service={service}
                                company={company}
                                onRequest={() => onRequest(service.id)}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Service card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, company, onRequest }: {
    service: Service;
    company: Company;
    onRequest: () => void;
}) {
    return (
        <article id={`service-${service.slug}`} className="scroll-mt-36 flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <Link href={route('services.show', service.slug)} className="flex flex-1 flex-col overflow-hidden">
                <div className="overflow-hidden">
                    <img
                        src={mediaUrl(service.image_path || company.hero_image_path)}
                        alt={service.name}
                        className="aspect-[16/9] w-full bg-slate-100 object-cover transition duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="flex flex-1 flex-col p-6 pb-4">
                    <p className="text-xs font-black uppercase tracking-wider text-slate-400">{service.category}</p>
                    <h3 className="mt-2 text-lg font-extrabold">{service.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{service.summary}</p>
                </div>
            </Link>
            <div className="px-6 pb-6">
                <button
                    type="button"
                    onClick={onRequest}
                    className="w-full rounded-xl border py-2.5 text-sm font-bold transition"
                    style={{ borderColor: company.primary_color, color: company.primary_color }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.backgroundColor = company.primary_color; el.style.color = '#fff'; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.backgroundColor = ''; el.style.color = company.primary_color; }}
                >
                    Request this service
                </button>
            </div>
        </article>
    );
}
