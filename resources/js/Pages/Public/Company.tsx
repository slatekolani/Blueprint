import { CompanyLogo } from '@/Components/Public/CompanyCard';
import Breadcrumb from '@/Components/Public/Breadcrumb';
import RequestForm from '@/Components/Public/RequestForm';
import PublicLayout from '@/Layouts/PublicLayout';
import { Company as CompanyType, formatServicePrice, mediaUrl } from '@/types/content';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const scrollToRequest = () =>
    document.getElementById('request')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function Company({ company, siblings }: { company: CompanyType; siblings: CompanyType[] }) {
    const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);

    const requestService = (serviceId: number | null = null) => {
        setSelectedServiceId(serviceId);
        scrollToRequest();
    };

    return (
        <PublicLayout>
            <Head title={company.meta_title || company.name} />

            {/* Hero */}
            <section className="relative min-h-[780px] overflow-hidden text-white" style={{ backgroundColor: company.primary_color }}>
                {company.hero_image_path && <img src={mediaUrl(company.hero_image_path)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/10" />
                <div className="absolute inset-x-0 top-0 z-10">
                    <div className="site-container pt-7">
                        <Breadcrumb light crumbs={[
                            { label: 'Home', href: route('home') },
                            { label: 'Companies', href: route('companies.index') },
                            { label: company.short_name || company.name },
                        ]} />
                    </div>
                </div>
                <div className="site-container relative flex min-h-[780px] items-center py-20">
                    <div className="max-w-3xl">
                        <p className="eyebrow text-white/70">{company.is_parent ? 'Parent company' : 'A BluePrint Group company'}</p>
                        <div className="mt-5 flex items-center gap-5">
                            <CompanyLogo company={company} size="lg" />
                            <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">{company.short_name || company.name}</h1>
                        </div>
                        <p className="mt-6 text-2xl font-bold text-white/90">{company.tagline}</p>
                        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{company.summary}</p>
                        <button type="button" onClick={() => requestService()} className="btn-light mt-8">
                            Request a service
                        </button>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="site-section">
                <div className="site-container grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
                    <div data-reveal="left">
                        <p className="eyebrow" style={{ color: company.primary_color }}>About the company</p>
                        <h2 className="section-title mt-3">Focused expertise, dependable support</h2>
                    </div>
                    <p data-reveal className="text-lg leading-9 text-slate-600">{company.description}</p>
                </div>
            </section>

            {/* Services */}
            {!!company.services?.length && (
                <section className="site-section bg-slate-50">
                    <div className="site-container">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="eyebrow" style={{ color: company.primary_color }}>Services</p>
                                <h2 className="section-title mt-3">How we can help</h2>
                            </div>
                            <button type="button" onClick={() => requestService()} className="hidden text-sm font-extrabold transition hover:opacity-70 sm:block" style={{ color: company.primary_color }}>
                                Request any service →
                            </button>
                        </div>
                        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {company.services.map((service, index) => (
                                <article key={service.id} data-reveal style={{ transitionDelay: `${index * 70}ms` }} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-md">
                                    <Link href={route('services.show', service.slug)} className="flex flex-1 flex-col overflow-hidden">
                                        <div className="overflow-hidden">
                                            <img src={mediaUrl(service.image_path || company.hero_image_path)} alt={service.name} className="aspect-[16/9] w-full bg-slate-100 object-cover transition duration-500 hover:scale-105" />
                                        </div>
                                        <div className="flex flex-1 flex-col p-7 pb-4">
                                            <span className="text-sm font-black" style={{ color: company.primary_color }}>0{index + 1}</span>
                                            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">{service.category}</p>
                                            <h3 className="mt-2 text-xl font-extrabold">{service.name}</h3>
                                            <p className="mt-2 text-sm font-extrabold" style={{ color: company.primary_color }}>{formatServicePrice(service.price)}</p>
                                            <p className="mt-4 flex-1 text-sm leading-7 text-slate-600">{service.summary}</p>
                                        </div>
                                    </Link>
                                    <div className="px-7 pb-7">
                                        <button
                                            type="button"
                                            onClick={() => requestService(service.id)}
                                            className="w-full rounded-xl border py-2.5 text-sm font-bold transition"
                                            style={{ borderColor: company.primary_color, color: company.primary_color }}
                                            onMouseEnter={e => { const el = e.currentTarget; el.style.backgroundColor = company.primary_color; el.style.color = '#fff'; }}
                                            onMouseLeave={e => { const el = e.currentTarget; el.style.backgroundColor = ''; el.style.color = company.primary_color; }}
                                        >
                                            Request this service
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Projects */}
            {!!company.projects?.length && (
                <section className="site-section">
                    <div className="site-container">
                        <p className="eyebrow" style={{ color: company.primary_color }}>Selected work</p>
                        <h2 className="section-title mt-3">Recent capabilities</h2>
                        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {company.projects.map((project, i) => (
                                <Link key={project.id} href={route('projects.show', project.slug)} data-reveal style={{ transitionDelay: `${i * 80}ms` }} className="group block">
                                    <div className="overflow-hidden rounded-3xl bg-slate-100">
                                        <img src={mediaUrl(project.cover_image_path)} alt={project.title} className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-extrabold">{project.title}</h3>
                                    <p className="mt-2 text-sm text-slate-600">{project.summary}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Request / Contact — sticky form alongside contact info ── */}
            <section id="request" className="site-section bg-slate-50 scroll-mt-28">
                <div className="site-container">
                    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">

                        {/* Left — contact info (scrolls normally) */}
                        <div className="space-y-10">
                            <div>
                                <p className="eyebrow" style={{ color: company.primary_color }}>Get in touch</p>
                                <h2 className="section-title mt-3">Start a conversation with {company.short_name || company.name}</h2>
                                <p className="mt-5 text-slate-600 leading-7">Fill in the form and our team will get back to you as soon as possible.</p>
                            </div>

                            {(company.address || company.phone || company.email) && (
                                <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
                                    {company.address && (
                                        <div className="flex gap-3">
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.145 15.22 15.22 0 002.649-2.168C14.96 14.507 16.5 12.024 16.5 9a6.5 6.5 0 00-13 0c0 3.024 1.54 5.507 3.236 7.611a15.22 15.22 0 002.649 2.168 5.741 5.741 0 00.281.145l.018.008.006.003zM10 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" /></svg>
                                            </span>
                                            <span className="text-sm text-slate-700">{company.address}</span>
                                        </div>
                                    )}
                                    {company.phone && (
                                        <a href={`tel:${company.phone}`} className="flex gap-3 transition hover:opacity-70">
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                            </span>
                                            <span className="text-sm font-semibold text-slate-700">{company.phone}</span>
                                        </a>
                                    )}
                                    {company.email && (
                                        <a href={`mailto:${company.email}`} className="flex gap-3 transition hover:opacity-70">
                                            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                                <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                            </span>
                                            <span className="text-sm font-semibold text-slate-700">{company.email}</span>
                                        </a>
                                    )}
                                </div>
                            )}

                            {siblings.length > 0 && (
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Also in the group</p>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        {siblings.map(item => (
                                            <Link
                                                key={item.id}
                                                href={route('companies.show', item.slug)}
                                                className="group relative flex h-24 items-end overflow-hidden rounded-2xl bg-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg"
                                            >
                                                {item.hero_image_path && (
                                                    <img
                                                        src={mediaUrl(item.hero_image_path)}
                                                        alt=""
                                                        className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-105"
                                                    />
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                                                <div className="relative flex items-center gap-2.5 p-3.5">
                                                    <CompanyLogo company={item} size="sm" />
                                                    <div>
                                                        <p className="text-[10px] font-black uppercase tracking-wider text-white/60">BluePrint Group</p>
                                                        <p className="text-sm font-extrabold text-white leading-tight">{item.short_name || item.name}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right — sticky form panel */}
                        <div className="lg:sticky lg:top-28">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <p className="text-xs font-black uppercase tracking-widest" style={{ color: company.primary_color }}>
                                    {company.short_name || company.name}
                                </p>
                                <h3 className="mt-1 text-xl font-extrabold text-slate-900">Request a service</h3>
                                <p className="mt-1 text-sm text-slate-500">We'll respond within one business day.</p>
                                <div className="mt-6">
                                    <RequestForm
                                        company={company}
                                        services={company.services ?? []}
                                        initialServiceId={selectedServiceId}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
