import CompanyCard from '@/Components/Public/CompanyCard';
import SectionHeading from '@/Components/Public/SectionHeading';
import PublicLayout from '@/Layouts/PublicLayout';
import { Client, Company, Project, Service, mediaUrl } from '@/types/content';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const HERO_DURATION = 6500;

const VIDEO_SRCS = [
    '/Videos/Video 3 blueprint.mp4',
    '/Videos/Video 2 blueprint.mp4',
    '/Videos/Video of Blueprint.mp4',
];

export default function Home({ group, companies, featuredServices, featuredProjects, clients, settings }: {
    group: Company; companies: Company[]; featuredServices: Service[]; featuredProjects: Project[]; clients: Client[]; settings: Record<string, string>;
}) {
    const [activeCompanyIndex, setActiveCompanyIndex] = useState(0);
    const [cycle, setCycle] = useState(0);
    const activeCompany = companies[activeCompanyIndex] ?? group;

    useEffect(() => {
        if (companies.length < 2) return;

        const timer = window.setTimeout(() => {
            setActiveCompanyIndex(current => (current + 1) % companies.length);
            setCycle(current => current + 1);
        }, HERO_DURATION);

        return () => window.clearTimeout(timer);
    }, [activeCompanyIndex, companies.length, cycle]);

    const selectCompany = (index: number) => {
        setActiveCompanyIndex(index);
        setCycle(current => current + 1);
    };

    return (
        <PublicLayout>
            <Head title="Business solutions, built together" />
            <section className="relative overflow-hidden bg-blueprint-950 text-white">
                <div className="relative h-[52vh] min-h-[390px] sm:h-[58vh] lg:absolute lg:inset-0 lg:h-auto lg:min-h-0">
                    <div className="absolute inset-0 overflow-hidden">
                        {companies.map((company, index) => (
                            <img
                                key={company.id}
                                src={mediaUrl(company.hero_image_path || group.hero_image_path)}
                                alt=""
                                aria-hidden={index !== activeCompanyIndex}
                                className={`absolute inset-0 h-full w-full object-cover transition duration-1000 ease-out ${
                                    index === activeCompanyIndex ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
                                }`}
                            />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-blueprint-950 via-blueprint-950/5 to-transparent lg:bg-gradient-to-r lg:from-blueprint-950 lg:via-blueprint-950/90 lg:to-blueprint-950/15" />
                        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blueprint-950 to-transparent lg:hidden" />
                    </div>

                    <div className="absolute bottom-0 right-4 z-10 flex translate-y-1/2 gap-2 lg:hidden">
                        {companies.map((company, index) => {
                            const active = index === activeCompanyIndex;
                            const circumference = 113.1;

                            return (
                                <button
                                    type="button"
                                    key={company.id}
                                    onClick={() => selectCompany(index)}
                                    aria-label={`Show ${company.short_name || company.name}`}
                                    aria-pressed={active}
                                    className={`relative grid h-11 w-11 place-items-center rounded-full border text-[10px] font-black shadow-lg backdrop-blur-xl transition ${
                                        active ? 'border-white/60 bg-white/20 text-white' : 'border-white/25 bg-slate-950/20 text-white/75'
                                    }`}
                                >
                                    {active && (
                                        <svg key={cycle} className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 40 40" aria-hidden="true">
                                            <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,.2)" strokeWidth="2" />
                                            <circle
                                                className="hero-progress-circle"
                                                cx="20"
                                                cy="20"
                                                r="18"
                                                fill="none"
                                                stroke="white"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeDasharray={circumference}
                                                style={{ animationDuration: `${HERO_DURATION}ms` }}
                                            />
                                        </svg>
                                    )}
                                    <span>{(company.short_name || company.name).slice(0, 2).toUpperCase()}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="site-container relative grid items-center gap-12 pb-16 pt-10 sm:pb-20 sm:pt-12 lg:min-h-[720px] lg:grid-cols-[1.05fr_.95fr] lg:py-20">
                    <div className="max-w-3xl">
                        <p className="eyebrow text-blue-200">{activeCompany.short_name || activeCompany.name}</p>
                        <h1 className="mt-5 text-5xl font-black leading-[.98] tracking-[-0.045em] sm:text-6xl lg:text-8xl">{settings.hero_title}</h1>
                        <p key={`summary-${activeCompany.id}`} className="hero-copy-enter mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg sm:leading-8">
                            {activeCompany.summary || settings.hero_description}
                        </p>
                        <div key={`tagline-${activeCompany.id}`} className="hero-copy-enter mt-4 flex items-center gap-3 text-sm font-bold text-white/80">
                            <span className="h-px w-8" style={{ backgroundColor: activeCompany.accent_color || '#86c5ff' }} />
                            {activeCompany.tagline}
                        </div>
                        <div key={`cta-${activeCompany.id}`} className="hero-copy-enter mt-8 flex flex-wrap gap-3 sm:mt-9 sm:gap-4">
                            <Link href={route('companies.show', activeCompany.slug)} className="btn-light">Learn more about {activeCompany.short_name || activeCompany.name}</Link>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <div className="ml-auto max-w-md rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
                            <p className="text-sm font-extrabold uppercase tracking-[.2em] text-blue-200">Our group</p>
                            <div className="mt-4 space-y-2">
                                {companies.map((company, index) => (
                                    <button
                                        type="button"
                                        onClick={() => selectCompany(index)}
                                        key={company.id}
                                        aria-pressed={index === activeCompanyIndex}
                                        className={`relative w-full overflow-hidden rounded-2xl border px-5 py-4 text-left transition ${
                                            index === activeCompanyIndex
                                                ? 'border-white/30 bg-white/15'
                                                : 'border-transparent hover:border-white/10 hover:bg-white/5'
                                        }`}
                                    >
                                        {index === activeCompanyIndex && (
                                            <span className="absolute inset-x-0 top-0 h-0.5 bg-white/15">
                                                <span
                                                    key={cycle}
                                                    className="hero-progress-bar block h-full origin-left bg-white"
                                                    style={{ animationDuration: `${HERO_DURATION}ms`, backgroundColor: company.accent_color || '#ffffff' }}
                                                />
                                            </span>
                                        )}
                                        <span className="flex items-center justify-between gap-4">
                                            <span>
                                                <span className="block text-xs font-black uppercase tracking-wider text-blue-200">{company.services?.[0]?.category || 'Company'}</span>
                                                <span className="mt-1 block font-extrabold">{company.short_name || company.name}</span>
                                            </span>
                                            <span className={`transition ${index === activeCompanyIndex ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-40'}`}>→</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <Link href={route('companies.show', activeCompany.slug)} className="mt-3 inline-flex px-5 pb-2 text-xs font-extrabold uppercase tracking-wider text-blue-100 hover:text-white">
                                View {activeCompany.short_name || activeCompany.name} →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="site-section">
                <div className="site-container">
                    <div data-reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                        <SectionHeading eyebrow="The BluePrint family" title="Specialists in the work that keeps business moving" copy="Each company has a focused role. Together, they give customers one dependable group for creative, operational and protection needs." />
                        <Link href={route('companies.index')} className="text-link">View all companies →</Link>
                    </div>
                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                        {companies.map((company, i) => (
                            <div key={company.id} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                                <CompanyCard company={company} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="site-section bg-slate-50">
                <div className="site-container grid gap-12 lg:grid-cols-[.78fr_1.22fr] lg:items-start">
                    <div data-reveal="left" className="lg:sticky lg:top-36">
                        <SectionHeading eyebrow="What we do" title="A broad service network, managed with focus" copy="From the first design idea to delivery, insurance and ongoing business support, our services are organized around real customer outcomes." />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {featuredServices.map((service, index) => (
                            <div key={service.id} data-reveal style={{ transitionDelay: `${index * 60}ms` }}>
                                <Link href={route('services.show', service.slug)} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-blueprint-300 hover:shadow-lg">
                                    <div className="overflow-hidden">
                                        <img src={mediaUrl(service.image_path || service.company?.hero_image_path)} alt={service.name} className="aspect-[16/8] w-full bg-slate-100 object-cover transition duration-500 group-hover:scale-105" />
                                    </div>
                                    <div className="p-6">
                                        <span className="text-xs font-black text-blueprint-500">0{index + 1}</span>
                                        <h3 className="mt-4 text-lg font-extrabold">{service.name}</h3>
                                        <p className="mt-2 text-sm leading-6 text-slate-600">{service.summary}</p>
                                        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-blueprint-700">{service.company?.name}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Video showcase ────────────────────────────────────────────── */}
            <section className="site-section bg-slate-950">
                <div className="site-container">
                    <div data-reveal className="mb-10 text-center">
                        <p className="eyebrow text-blue-300">In action</p>
                        <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Watch the work in motion</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {VIDEO_SRCS.map((src, i) => (
                            <div key={i} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="overflow-hidden rounded-2xl bg-slate-900">
                                <video
                                    src={src}
                                    className="block w-full"
                                    style={{ aspectRatio: '16/9', objectFit: 'cover' }}
                                    controls
                                    playsInline
                                    preload="metadata"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="site-section bg-blueprint-950 text-white">
                <div className="site-container">
                    <div data-reveal="fade">
                        <SectionHeading light eyebrow="Why BluePrint" title={settings.about_title} copy={settings.about_description} />
                    </div>
                    <div className="mt-12 grid gap-5 sm:grid-cols-3">
                        <StatCounter raw={settings.group_companies}    label="Managed companies"   delay={0} />
                        <StatCounter raw={settings.service_categories} label="Service categories"  delay={150} />
                        <StatCounter raw={settings.years_experience}   label="Years of experience" delay={300} />
                    </div>
                </div>
            </section>

            <section className="site-section">
                <div className="site-container">
                    <div data-reveal>
                        <SectionHeading eyebrow="Selected work" title="Ideas delivered in the real world" copy="A growing view of products, campaigns, supply work and customer solutions delivered by the group." />
                    </div>
                    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {featuredProjects.map((project, i) => (
                            <div key={project.id} data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
                                <Link href={route('projects.show', project.slug)} className="group block">
                                    <div className="h-72 overflow-hidden rounded-3xl bg-slate-100">
                                        <img src={mediaUrl(project.cover_image_path)} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                    </div>
                                    <p className="mt-5 text-xs font-black uppercase tracking-wider text-blueprint-600">{project.company?.name}</p>
                                    <h3 className="mt-2 text-lg font-extrabold">{project.title}</h3>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Our Clients ───────────────────────────────────────────────── */}
            {clients.length > 0 && <ClientsSection clients={clients} />}

            <section className="pb-24">
                <div className="site-container">
                    <div data-reveal="scale" className="rounded-[2rem] bg-blueprint-600 px-7 py-14 text-white sm:px-14 lg:flex lg:items-center lg:justify-between">
                        <div><p className="eyebrow text-blue-100">Let's work together</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Tell us what your business needs next.</h2></div>
                        <Link href={route('contact')} className="btn-light mt-7 lg:mt-0">Request a quote</Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

// ─── Clients section ──────────────────────────────────────────────────────────

function ClientsSection({ clients }: { clients: Client[] }) {
    const [active, setActive] = useState<Client | null>(null);

    const half = Math.ceil(clients.length / 2);
    const row1 = clients.slice(0, half);
    const row2 = clients.slice(half);

    return (
        <section className="site-section overflow-hidden bg-slate-50">
            <div className="site-container">
                <div data-reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <SectionHeading
                        eyebrow="Trusted by the best"
                        title="Our Clients"
                        copy="We're proud to have worked with leading organisations, government bodies, and businesses across Tanzania and beyond."
                    />
                </div>
            </div>

            {/* Row 1 — scrolls left */}
            <div className="mt-12 overflow-hidden">
                <div className="marquee-left flex w-max gap-4">
                    {[...row1, ...row1].map((client, i) => (
                        <ClientLogo key={`r1-${i}`} client={client} onClick={() => setActive(client)} />
                    ))}
                </div>
            </div>

            {/* Row 2 — scrolls right */}
            {row2.length > 0 && (
                <div className="mt-4 overflow-hidden">
                    <div className="marquee-right flex w-max gap-4">
                        {[...row2, ...row2].map((client, i) => (
                            <ClientLogo key={`r2-${i}`} client={client} onClick={() => setActive(client)} />
                        ))}
                    </div>
                </div>
            )}

            <div className="site-container mt-8">
                <p className="text-xs text-slate-400">Click any logo to learn more about our work together.</p>
            </div>

            {active && <ClientModal client={active} onClose={() => setActive(null)} />}
        </section>
    );
}

function ClientLogo({ client, onClick }: { client: Client; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group flex h-24 w-40 shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-blueprint-300 hover:shadow-md"
            title={client.name}
        >
            {client.logo_path ? (
                <img src={mediaUrl(client.logo_path)} alt={client.name} className="h-12 w-full object-contain" loading="lazy" />
            ) : (
                <span className="text-xs font-extrabold text-blueprint-700">{client.name}</span>
            )}
        </button>
    );
}

function ClientModal({ client, onClose }: { client: Client; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Top accent */}
                <div className="h-1.5 w-full bg-gradient-to-r from-blueprint-500 to-blueprint-700" />

                <div className="p-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        aria-label="Close"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>

                    {/* Logo */}
                    {client.logo_path && (
                        <div className="mx-auto mb-6 flex h-24 w-40 items-center justify-center rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <img src={mediaUrl(client.logo_path)} alt={client.name} className="h-full w-full object-contain" />
                        </div>
                    )}

                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blueprint-600">Our Client</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-900">{client.name}</h3>

                    {client.description && (
                        <p className="mt-4 text-sm leading-7 text-slate-600">{client.description}</p>
                    )}

                    {client.website && (
                        <a
                            href={client.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-blueprint-700 hover:text-blueprint-900"
                        >
                            Visit website
                            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4"><path d="M7 13L13 7M13 7H7M13 7v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Animated stat counter ────────────────────────────────────────────────────

function StatCounter({ raw, label, delay }: { raw: string; label: string; delay: number }) {
    const ref                 = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);
    const [display, setDisplay] = useState(0);

    const match  = raw?.match(/^(\d+)(.*)$/);
    const target = match ? parseInt(match[1]) : 0;
    const suffix = match ? match[2] : '';

    // Trigger when in view
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
            { threshold: 0.5 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    // Count up animation
    useEffect(() => {
        if (!started || target === 0) return;
        const DURATION = 1800;
        const startTime = performance.now();
        const tick = (now: number) => {
            const t      = Math.min((now - startTime) / DURATION, 1);
            const eased  = 1 - Math.pow(1 - t, 4); // ease-out quart
            setDisplay(Math.round(eased * target));
            if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [started, target]);

    return (
        <div
            ref={ref}
            data-reveal
            style={{ transitionDelay: `${delay}ms` }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8"
        >
            <p className="tabular-nums text-5xl font-black tracking-tight">
                {display}{suffix}
            </p>
            <p className="mt-3 text-sm font-bold uppercase tracking-wider text-blue-200">{label}</p>
        </div>
    );
}
