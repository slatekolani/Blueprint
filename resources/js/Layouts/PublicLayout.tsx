import BrandMark from '@/Components/BrandMark';
import PageLoader from '@/Components/Public/PageLoader';
import { Company, Project, Service, formatServicePrice, mediaUrl } from '@/types/content';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect, useState } from 'react';

const leadingLinks = [
    ['Home', 'home'],
    ['About', 'about'],
];

const footerLinks = [
    ...leadingLinks.slice(1),
    ['Companies', 'companies.index'],
    ['Services', 'services.index'],
    ['Projects', 'projects.index'],
    ['Gallery', 'gallery.index'],
    ['Contact', 'contact'],
];

export default function PublicLayout({ children }: PropsWithChildren) {
    const { auth, flash, navigationCompanies = [], navigationServices = [], navigationProjects = [] } = usePage<any>().props as {
        auth: any;
        flash: any;
        navigationCompanies: Company[];
        navigationServices: Service[];
        navigationProjects: Project[];
    };
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileSections, setMobileSections] = useState<Record<string, boolean>>({});
    const [activeCompanyId, setActiveCompanyId] = useState<number | null>(navigationCompanies[0]?.id ?? null);
    const [activeServiceId, setActiveServiceId] = useState<number | null>(navigationServices[0]?.id ?? null);
    const activeCompany = navigationCompanies.find(company => company.id === activeCompanyId) ?? navigationCompanies[0];
    const activeService = navigationServices.find(service => service.id === activeServiceId) ?? navigationServices[0];
    const toggleMobileSection = (section: string) => setMobileSections(current => ({ ...current, [section]: !current[section] }));

    useEffect(() => {
        if (!activeCompanyId && navigationCompanies.length) {
            setActiveCompanyId(navigationCompanies[0].id);
        }
        if (!activeServiceId && navigationServices.length) {
            setActiveServiceId(navigationServices[0].id);
        }
    }, [activeCompanyId, activeServiceId, navigationCompanies, navigationServices]);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setScrolled(prev => {
                if (!prev && y > 100) return true;
                if (prev && y < 60) return false;
                return prev;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    // Global scroll-reveal — re-runs on every Inertia page change
    const { url } = usePage();
    useEffect(() => {
        let observer: IntersectionObserver;
        const raf = requestAnimationFrame(() => {
            const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])');
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            (entry.target as HTMLElement).dataset.revealed = 'true';
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.12, rootMargin: '0px 0px -52px 0px' }
            );
            els.forEach(el => observer.observe(el));
        });
        return () => {
            cancelAnimationFrame(raf);
            observer?.disconnect();
        };
    }, [url]);

    const closeMenu = () => setOpen(false);

    return (
        <div className="min-h-screen bg-white text-slate-900">
            <PageLoader key={url} />
            <header
                className={[
                    'sticky top-0 z-50 border-b bg-white/95 backdrop-blur',
                    'transition-[border-color,box-shadow] duration-300',
                    scrolled
                        ? 'border-slate-200/80 shadow-md shadow-slate-900/[0.06]'
                        : 'border-transparent',
                ].join(' ')}
            >
                <div
                    className="site-container flex items-center justify-between"
                    style={{
                        height: scrolled ? '96px' : '130px',
                        transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)',
                    }}
                >
                    <BrandMark compact={scrolled} />
                    <nav className="hidden items-center gap-7 lg:flex">
                        {leadingLinks.map(([label, name]) => (
                            <Link key={name} href={route(name)} className={`nav-link ${route().current(name) ? 'nav-link-active' : ''}`}>
                                {label}
                            </Link>
                        ))}
                        <div className="group relative flex h-20 items-center">
                            <Link
                                href={route('companies.index')}
                                className={`nav-link inline-flex items-center gap-1.5 ${route().current('companies.*') ? 'nav-link-active' : ''}`}
                            >
                                Companies
                                <svg className="h-3.5 w-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                                    <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>

                            {!!navigationCompanies.length && (
                                <div className="invisible absolute left-1/2 top-full w-[900px] -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                                    <div className="grid grid-cols-[320px_1fr] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
                                        <div className="bg-slate-50 p-5">
                                            <div className="flex items-center justify-between px-3 pb-3 pt-1">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Our companies</p>
                                                <Link href={route('companies.index')} className="text-xs font-extrabold text-blueprint-700 hover:text-blueprint-900">
                                                    View all
                                                </Link>
                                            </div>
                                            <div className="space-y-1">
                                                {navigationCompanies.map(company => (
                                                    <Link
                                                        key={company.id}
                                                        href={route('companies.show', company.slug)}
                                                        onMouseEnter={() => setActiveCompanyId(company.id)}
                                                        onFocus={() => setActiveCompanyId(company.id)}
                                                        className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm font-extrabold transition ${
                                                            activeCompany?.id === company.id
                                                                ? 'bg-white text-blueprint-800 shadow-sm'
                                                                : 'text-slate-600 hover:bg-white hover:text-blueprint-800'
                                                        }`}
                                                    >
                                                        <span className="flex items-center gap-3">
                                                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: company.primary_color }} />
                                                            {company.short_name || company.name}
                                                        </span>
                                                        <span aria-hidden="true">→</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>

                                        {activeCompany && (
                                            <Link
                                                href={route('companies.show', activeCompany.slug)}
                                                className="group/preview relative min-h-[330px] overflow-hidden bg-blueprint-950 text-white"
                                            >
                                                {activeCompany.hero_image_path && (
                                                    <img
                                                        src={mediaUrl(activeCompany.hero_image_path)}
                                                        alt=""
                                                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover/preview:scale-105"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/10" />
                                                <div className="absolute inset-x-0 bottom-0 p-7">
                                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">
                                                        {activeCompany.services?.[0]?.category || 'Business solutions'}
                                                    </p>
                                                    <h3 className="mt-2 text-2xl font-black">{activeCompany.short_name || activeCompany.name}</h3>
                                                    {activeCompany.tagline && <p className="mt-2 text-sm font-bold text-white/90">{activeCompany.tagline}</p>}
                                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/70">{activeCompany.summary}</p>
                                                    <span className="mt-5 inline-flex text-sm font-extrabold text-white">
                                                        Explore company <span className="ml-2 transition group-hover/preview:translate-x-1">→</span>
                                                    </span>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="group relative flex h-20 items-center">
                            <Link href={route('services.index')} className={`nav-link inline-flex items-center gap-1.5 ${route().current('services.*') ? 'nav-link-active' : ''}`}>
                                Services <NavChevron />
                            </Link>
                            {!!navigationServices.length && (
                                <div className="invisible absolute left-1/2 top-full w-[920px] -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                                    <div className="grid grid-cols-[360px_1fr] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
                                        <div className="bg-slate-50 p-5">
                                            <div className="flex items-center justify-between px-3 pb-3 pt-1">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Popular services</p>
                                                <Link href={route('services.index')} className="text-xs font-extrabold text-blueprint-700">View all</Link>
                                            </div>
                                            <div className="grid gap-1">
                                                {navigationServices.map(service => (
                                                    <Link
                                                        key={service.id}
                                                        href={route('services.show', service.slug)}
                                                        onMouseEnter={() => setActiveServiceId(service.id)}
                                                        onFocus={() => setActiveServiceId(service.id)}
                                                        className={`rounded-xl px-3 py-2.5 transition ${activeService?.id === service.id ? 'bg-white shadow-sm' : 'hover:bg-white'}`}
                                                    >
                                                        <span className="block text-xs font-black uppercase tracking-wider text-slate-400">{service.category || 'Service'}</span>
                                                        <span className="mt-0.5 block text-sm font-extrabold text-slate-700">{service.name}</span>
                                                        <span className="mt-0.5 block text-xs font-bold text-blueprint-700">{formatServicePrice(service.price)}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                        {activeService && (
                                            <Link href={route('services.show', activeService.slug)} className="group/preview relative min-h-[420px] overflow-hidden bg-blueprint-950 text-white">
                                                <img src={mediaUrl(activeService.image_path || activeService.company?.hero_image_path)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover/preview:scale-105" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" />
                                                <div className="absolute inset-x-0 bottom-0 p-8">
                                                    <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-200">{activeService.category || 'Service'}</p>
                                                    <h3 className="mt-2 text-3xl font-black">{activeService.name}</h3>
                                                    <p className="mt-2 text-sm font-extrabold text-white">{formatServicePrice(activeService.price)}</p>
                                                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/75">{activeService.summary}</p>
                                                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-white/60">{activeService.company?.short_name || activeService.company?.name}</p>
                                                </div>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="group relative flex h-20 items-center">
                            <Link href={route('projects.index')} className={`nav-link inline-flex items-center gap-1.5 ${route().current('projects.*') ? 'nav-link-active' : ''}`}>
                                Projects <NavChevron />
                            </Link>
                            {!!navigationProjects.length && (
                                <div className="invisible absolute left-1/2 top-full w-[980px] -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                                    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.2)]">
                                        <div className="flex items-center justify-between px-2 pb-4">
                                            <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Selected projects</p><p className="mt-1 text-sm text-slate-500">Recent work from across the group.</p></div>
                                            <Link href={route('projects.index')} className="text-sm font-extrabold text-blueprint-700">View all projects →</Link>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            {navigationProjects.slice(0, 3).map(project => (
                                                <Link key={project.id} href={route('projects.show', project.slug)} className="group/card overflow-hidden rounded-2xl bg-slate-950 text-white">
                                                    <div className="relative h-52 overflow-hidden">
                                                        <img src={mediaUrl(project.cover_image_path)} alt="" className="h-full w-full object-cover transition duration-500 group-hover/card:scale-105" />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
                                                        <div className="absolute inset-x-0 bottom-0 p-5">
                                                            <p className="text-[10px] font-black uppercase tracking-wider text-blue-200">{project.category || project.company?.name}</p>
                                                            <h3 className="mt-1 text-base font-extrabold leading-snug">{project.title}</h3>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <Link href={route('gallery.index')} className={`nav-link ${route().current('gallery.*') ? 'nav-link-active' : ''}`}>Gallery</Link>
                        <Link href={route('contact')} className={`nav-link ${route().current('contact') ? 'nav-link-active' : ''}`}>Contact</Link>
                    </nav>
                    <div className="hidden items-center gap-3 lg:flex">
                        {auth?.user && <Link href={route('admin.dashboard')} className="btn-secondary">Dashboard</Link>}
                        <Link href={route('contact')} className="btn-primary">Request a quote</Link>
                    </div>

                    {/* Hamburger button — animates to × when open */}
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        aria-label={open ? 'Close menu' : 'Open menu'}
                        aria-expanded={open}
                        className="flex h-10 items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/70 px-3.5 shadow-sm backdrop-blur-sm transition hover:bg-white hover:shadow-md lg:hidden"
                    >
                        <span className="flex w-5 flex-col gap-[5px]">
                            <span className={`block h-0.5 origin-center bg-slate-800 transition duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
                            <span className={`block h-0.5 bg-slate-800 transition duration-200 ${open ? 'scale-x-0 opacity-0' : ''}`} />
                            <span className={`block h-0.5 origin-center bg-slate-800 transition duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
                        </span>
                        <span className="text-sm font-bold text-slate-800">{open ? 'Close' : 'Menu'}</span>
                    </button>
                </div>
            </header>

            {/* Backdrop overlay */}
            <div
                aria-hidden="true"
                onClick={closeMenu}
                className={`fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-[6px] transition-opacity duration-300 lg:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            />

            {/* Slide-in drawer */}
            <div
                className={`fixed inset-y-0 right-0 z-[60] flex w-[310px] flex-col overflow-hidden border-l border-white/10 bg-slate-950/90 shadow-[0_0_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-transform duration-300 ease-out lg:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}
                aria-modal="true"
                role="dialog"
                aria-label="Navigation menu"
            >
                {/* Decorative glows */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                    <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full bg-blueprint-600/25 blur-3xl" />
                    <div className="absolute -left-24 bottom-10 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
                </div>

                {/* Drawer header */}
                <div className="relative flex h-20 shrink-0 items-center justify-end border-b border-white/10 px-5">
                    <button
                        type="button"
                        onClick={closeMenu}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable nav links */}
                <nav className="relative flex-1 overflow-y-auto px-3 py-4">
                    {leadingLinks.map(([label, name]) => (
                        <Link
                            key={name}
                            href={route(name)}
                            onClick={closeMenu}
                            className="block rounded-xl px-4 py-3 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                            {label}
                        </Link>
                    ))}

                    <MobileToggle label="Companies" open={!!mobileSections.companies} onClick={() => toggleMobileSection('companies')} />
                    {mobileSections.companies && (
                        <div className="mb-2 ml-4 grid gap-0.5 border-l-2 border-white/15 pl-4">
                            <Link href={route('companies.index')} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-sm font-extrabold text-blue-300 transition hover:text-blue-200">View all companies</Link>
                            {navigationCompanies.map(company => (
                                <Link
                                    key={company.id}
                                    href={route('companies.show', company.slug)}
                                    onClick={closeMenu}
                                    className="block rounded-lg px-3 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
                                >
                                    <span className="inline-flex items-center gap-2.5">
                                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: company.primary_color }} />
                                        {company.short_name || company.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <MobileToggle label="Services" open={!!mobileSections.services} onClick={() => toggleMobileSection('services')} />
                    {mobileSections.services && (
                        <div className="mb-2 ml-4 grid gap-0.5 border-l-2 border-white/15 pl-4">
                            <Link href={route('services.index')} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-sm font-extrabold text-blue-300 transition hover:text-blue-200">View all services</Link>
                            {navigationServices.map(service => (
                                <Link key={service.id} href={route('services.show', service.slug)} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white">
                                    <span className="block">{service.name}</span>
                                    <span className="mt-0.5 block text-xs text-blue-200">{formatServicePrice(service.price)}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    <MobileToggle label="Projects" open={!!mobileSections.projects} onClick={() => toggleMobileSection('projects')} />
                    {mobileSections.projects && (
                        <div className="mb-2 ml-4 grid gap-0.5 border-l-2 border-white/15 pl-4">
                            <Link href={route('projects.index')} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-sm font-extrabold text-blue-300 transition hover:text-blue-200">View all projects</Link>
                            {navigationProjects.map(project => (
                                <Link key={project.id} href={route('projects.show', project.slug)} onClick={closeMenu} className="block rounded-lg px-3 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white">
                                    {project.title}
                                </Link>
                            ))}
                        </div>
                    )}

                    <Link href={route('gallery.index')} onClick={closeMenu} className="block rounded-xl px-4 py-3 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">Gallery</Link>
                    <Link href={route('contact')} onClick={closeMenu} className="block rounded-xl px-4 py-3 font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">Contact</Link>
                </nav>

                {/* CTA pinned at drawer bottom */}
                <div className="relative shrink-0 border-t border-white/10 p-4 space-y-2">
                    <Link href={route('contact')} onClick={closeMenu} className="btn-primary block text-center">Request a quote</Link>
                    {auth?.user && <Link href={route('admin.dashboard')} onClick={closeMenu} className="btn-secondary block text-center">Dashboard</Link>}
                </div>
            </div>

            {flash?.success && <div className="site-container mt-5 rounded-xl bg-emerald-50 px-5 py-4 font-semibold text-emerald-800">{flash.success}</div>}
            <main>{children}</main>

            {/* ── Floating WhatsApp widget ─────────────────────────────────── */}
            <a
                href="https://api.whatsapp.com/send?phone=255754444010"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="fixed bottom-6 right-6 z-50 flex h-14 items-center justify-center gap-2.5 overflow-hidden rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 transition-all duration-300 ease-out hover:brightness-110 active:scale-95"
                style={{ width: scrolled ? '56px' : '236px' }}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 shrink-0" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span
                    className="whitespace-nowrap text-sm font-bold transition-all duration-300"
                    style={{ opacity: scrolled ? 0 : 1, maxWidth: scrolled ? '0' : '180px', overflow: 'hidden' }}
                >
                    Let's Chat on WhatsApp
                </span>
            </a>

            <footer className="bg-blueprint-950 text-white">
                <div className="site-container grid gap-10 py-16 md:grid-cols-[1.35fr_1fr_1fr]">
                    <div>
                        <BrandMark light src="/images/Logo/Blueprint.jpeg" />
                        <p className="mt-6 max-w-md text-sm leading-7 text-blue-100">
                            Creative, supply, logistics and insurance expertise working together to move Tanzanian businesses forward.
                        </p>
                        <div className="mt-6 flex items-center gap-3">
                            <a
                                href="https://instagram.com/blueprinttanzania"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="BluePrint on Instagram"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/60 transition hover:border-white/40 hover:text-white"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            <a
                                href="https://x.com/blueprinttanzania"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="BluePrint on X"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/60 transition hover:border-white/40 hover:text-white"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                            <a
                                href="https://api.whatsapp.com/send?phone=255754444010"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Chat with BluePrint on WhatsApp"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 text-white/60 transition hover:border-white/40 hover:text-white"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div>
                        <h3 className="footer-title">Explore</h3>
                        <div className="mt-5 grid gap-3 text-sm text-blue-100">
                            {footerLinks.map(([label, name]) => <Link key={name} href={route(name)} className="hover:text-white">{label}</Link>)}
                        </div>
                    </div>
                    <div>
                        <h3 className="footer-title">Talk to us</h3>
                        <div className="mt-5 space-y-3 text-sm text-blue-100">
                            <p>Mbezi Beach, Tangi Bovu<br />Dar es Salaam, Tanzania</p>
                            <a className="block hover:text-white" href="tel:+255754444010">+255 754 444 010</a>
                            <a className="block hover:text-white" href="mailto:info@blueprintgroup.co.tz">info@blueprintgroup.co.tz</a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-white/10">
                    <div className="site-container flex flex-col gap-3 py-5 text-xs text-blue-200 sm:flex-row sm:items-center sm:justify-between">
                        <span>© {new Date().getFullYear()} BluePrint Group of Companies Ltd. All rights reserved.</span>
                        <div className="flex flex-wrap items-center gap-4">
                            <a href="#" className="hover:text-white transition">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition">Terms of Use</a>
                            <span className="text-blue-200/40">|</span>
                            <span>
                                Developed by{' '}
                                <a
                                    href="https://nextbyte.co.tz/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-semibold text-blue-300 hover:text-white transition"
                                >
                                    NextByte ICT Solutions
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function NavChevron() {
    return <svg className="h-3.5 w-3.5 transition group-hover:rotate-180 group-focus-within:rotate-180" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function MobileToggle({ label, open, onClick }: { label: string; open: boolean; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} aria-expanded={open} className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left font-semibold text-white/80 transition hover:bg-white/10 hover:text-white">
            {label}
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={`h-4 w-4 text-white/40 transition duration-200 ${open ? 'rotate-180' : ''}`}>
                <path d="m5 7.5 5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
    );
}
