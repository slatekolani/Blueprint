import { CompanyLogo } from '@/Components/Public/CompanyCard';
import Breadcrumb from '@/Components/Public/Breadcrumb';
import RequestForm from '@/Components/Public/RequestForm';
import PublicLayout from '@/Layouts/PublicLayout';
import { Company, Service, mediaUrl } from '@/types/content';
import { Head, Link } from '@inertiajs/react';

type FullService = Service & { company: Company };

const scrollToRequest = () =>
    document.getElementById('request')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

export default function ServiceDetail({ service, related }: { service: FullService; related: Service[] }) {
    const company = service.company;
    const color = company.primary_color;

    return (
        <PublicLayout>
            <Head title={`${service.name} — ${company.short_name || company.name}`} />

            {/* Hero */}
            <section className="relative min-h-[780px] overflow-hidden text-white" style={{ backgroundColor: color }}>
                {service.image_path && (
                    <img src={mediaUrl(service.image_path)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/50 to-slate-950/10" />
                <div className="absolute inset-x-0 top-0 z-10">
                    <div className="site-container pt-7">
                        <Breadcrumb light crumbs={[
                            { label: 'Home', href: route('home') },
                            { label: 'Services', href: route('services.index') },
                            { label: service.name },
                        ]} />
                    </div>
                </div>
                <div className="site-container relative flex min-h-[780px] items-end py-16">
                    <div className="max-w-3xl pb-4">
                        <Link
                            href={route('companies.show', company.slug)}
                            className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm transition hover:bg-white/20"
                        >
                            <CompanyLogo company={company} size="sm" />
                            <span className="text-xs font-extrabold">{company.short_name || company.name}</span>
                        </Link>
                        {service.category && (
                            <p className="eyebrow mt-6 text-blue-200">{service.category}</p>
                        )}
                        <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                            {service.name}
                        </h1>
                        {service.summary && (
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{service.summary}</p>
                        )}
                        <button type="button" onClick={scrollToRequest} className="btn-light mt-8">
                            Request this service
                        </button>
                    </div>
                </div>
            </section>

            {/* Description */}
            {service.description && (
                <section className="site-section">
                    <div className="site-container grid gap-12 lg:grid-cols-[.65fr_1.35fr]">
                        <div data-reveal="left">
                            <p className="eyebrow" style={{ color }}>About this service</p>
                            <h2 className="section-title mt-3">What we offer</h2>
                        </div>
                        <div data-reveal className="prose prose-slate max-w-none text-lg leading-9 text-slate-600">
                            {service.description.split('\n').filter(Boolean).map((para, i) => (
                                <p key={i}>{para}</p>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Related services */}
            {related.length > 0 && (
                <section className="site-section bg-slate-50">
                    <div className="site-container">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="eyebrow" style={{ color }}>More from {company.short_name || company.name}</p>
                                <h2 className="section-title mt-3">Related services</h2>
                            </div>
                            <Link href={route('companies.show', company.slug)} className="text-link hidden sm:inline-flex">
                                View all →
                            </Link>
                        </div>
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map((s, i) => (
                                <Link
                                    key={s.id}
                                    data-reveal
                                    style={{ transitionDelay: `${i * 80}ms` }}
                                    href={route('services.show', s.slug)}
                                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                                >
                                    <img
                                        src={mediaUrl(s.image_path || company.hero_image_path)}
                                        alt={s.name}
                                        className="aspect-[16/9] w-full bg-slate-100 object-cover transition duration-500 group-hover:scale-105"
                                    />
                                    <div className="p-5">
                                        {s.category && <p className="text-xs font-black uppercase tracking-wider text-slate-400">{s.category}</p>}
                                        <h3 className="mt-2 font-extrabold">{s.name}</h3>
                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{s.summary}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Request form — sticky panel on desktop ── */}
            <section id="request" className="site-section scroll-mt-28">
                <div className="site-container">
                    <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-start">

                        {/* Left — context */}
                        <div className="space-y-8">
                            <div>
                                <p className="eyebrow" style={{ color }}>Ready to get started?</p>
                                <h2 className="section-title mt-3">Request {service.name}</h2>
                                <p className="mt-5 text-lg leading-8 text-slate-600">
                                    Get in touch with the team at <strong>{company.short_name || company.name}</strong> and
                                    we'll put together the right solution for your needs.
                                </p>
                            </div>

                            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Contact details</p>
                                {company.phone && (
                                    <a href={`tel:${company.phone}`} className="flex items-center gap-3 text-sm font-semibold text-slate-700 transition hover:opacity-70">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                        {company.phone}
                                    </a>
                                )}
                                {company.email && (
                                    <a href={`mailto:${company.email}`} className="flex items-center gap-3 text-sm font-semibold text-slate-700 transition hover:opacity-70">
                                        <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                        {company.email}
                                    </a>
                                )}
                                <Link href={route('companies.show', company.slug)} className="flex items-center gap-2 text-sm font-extrabold transition hover:opacity-70" style={{ color }}>
                                    View all {company.short_name || company.name} services →
                                </Link>
                            </div>
                        </div>

                        {/* Right — sticky form */}
                        <div className="lg:sticky lg:top-28">
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                                <p className="text-xs font-black uppercase tracking-widest" style={{ color }}>
                                    {company.short_name || company.name}
                                </p>
                                <h3 className="mt-1 text-xl font-extrabold text-slate-900">{service.name}</h3>
                                <p className="mt-1 text-sm text-slate-500">We'll respond within one business day.</p>
                                <div className="mt-6">
                                    <RequestForm
                                        company={company}
                                        services={[service]}
                                        initialServiceId={service.id}
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
