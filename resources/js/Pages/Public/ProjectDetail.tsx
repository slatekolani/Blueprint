import { CompanyLogo } from '@/Components/Public/CompanyCard';
import Breadcrumb from '@/Components/Public/Breadcrumb';
import RequestServiceModal from '@/Components/Public/RequestServiceModal';
import PublicLayout from '@/Layouts/PublicLayout';
import { Company, Project, mediaUrl } from '@/types/content';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type FullProject = Project & { company: Company };

export default function ProjectDetail({ project, related }: { project: FullProject; related: Project[] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const company = project.company;
    const color = company.primary_color;

    const meta = [
        project.client     && { label: 'Client',    value: project.client },
        project.location   && { label: 'Location',  value: project.location },
        project.category   && { label: 'Category',  value: project.category },
        project.completed_at && {
            label: 'Completed',
            value: new Date(project.completed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        },
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <PublicLayout>
            <Head title={`${project.title} — ${company.short_name || company.name}`} />

            {/* Hero */}
            <section className="relative min-h-[780px] overflow-hidden text-white">
                {project.cover_image_path && (
                    <img src={mediaUrl(project.cover_image_path)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/50 to-slate-950/10" />
                <div className="absolute inset-x-0 top-0 z-10">
                    <div className="site-container pt-7">
                        <Breadcrumb light crumbs={[
                            { label: 'Home', href: route('home') },
                            { label: 'Projects', href: route('projects.index') },
                            { label: project.title },
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

                        {project.category && (
                            <p className="eyebrow mt-6 text-blue-200">{project.category}</p>
                        )}
                        <h1 className="mt-3 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
                            {project.title}
                        </h1>
                        {project.summary && (
                            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/80">{project.summary}</p>
                        )}

                        {/* Quick meta chips in hero */}
                        {(project.client || project.location || project.completed_at) && (
                            <div className="mt-6 flex flex-wrap gap-3">
                                {project.client && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                                        <span className="opacity-60">Client</span> {project.client}
                                    </span>
                                )}
                                {project.location && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                                        <span className="opacity-60">Location</span> {project.location}
                                    </span>
                                )}
                                {project.completed_at && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-sm">
                                        <span className="opacity-60">Completed</span>{' '}
                                        {new Date(project.completed_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Main content */}
            <section className="site-section">
                <div className="site-container grid gap-12 lg:grid-cols-[.42fr_1.58fr]">

                    {/* ── Left sidebar ── */}
                    <div data-reveal="left" className="space-y-6">

                        {/* Project details */}
                        {meta.length > 0 && (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <p className="eyebrow" style={{ color }}>Project details</p>
                                <dl className="mt-5 divide-y divide-slate-100">
                                    {meta.map(({ label, value }) => (
                                        <div key={label} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                                            <dt className="shrink-0 text-xs font-black uppercase tracking-wider text-slate-400">{label}</dt>
                                            <dd className="text-right text-sm font-semibold text-slate-800">{value}</dd>
                                        </div>
                                    ))}
                                </dl>
                            </div>
                        )}

                        {/* Delivered by */}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6">
                            <p className="eyebrow" style={{ color }}>Delivered by</p>
                            <Link
                                href={route('companies.show', company.slug)}
                                className="mt-4 flex items-center gap-3 transition hover:opacity-80"
                            >
                                <CompanyLogo company={company} size="md" />
                                <div>
                                    <p className="font-extrabold text-slate-900">{company.short_name || company.name}</p>
                                    {company.tagline && <p className="mt-0.5 text-xs text-slate-500">{company.tagline}</p>}
                                </div>
                            </Link>

                            {/* Company contact details */}
                            {(company.email || company.phone || company.address || company.website) && (
                                <dl className="mt-5 divide-y divide-slate-100 border-t border-slate-100 pt-5">
                                    {company.email && (
                                        <div className="py-2.5 first:pt-0 last:pb-0">
                                            <dt className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email</dt>
                                            <dd className="mt-1">
                                                <a href={`mailto:${company.email}`} className="text-sm font-semibold text-blueprint-700 hover:underline break-all">
                                                    {company.email}
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    {company.phone && (
                                        <div className="py-2.5 first:pt-0 last:pb-0">
                                            <dt className="text-[10px] font-black uppercase tracking-wider text-slate-400">Phone</dt>
                                            <dd className="mt-1">
                                                <a href={`tel:${company.phone}`} className="text-sm font-semibold text-blueprint-700 hover:underline">
                                                    {company.phone}
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                    {company.address && (
                                        <div className="py-2.5 first:pt-0 last:pb-0">
                                            <dt className="text-[10px] font-black uppercase tracking-wider text-slate-400">Address</dt>
                                            <dd className="mt-1 text-sm font-semibold text-slate-700">{company.address}</dd>
                                        </div>
                                    )}
                                    {company.website && (
                                        <div className="py-2.5 first:pt-0 last:pb-0">
                                            <dt className="text-[10px] font-black uppercase tracking-wider text-slate-400">Website</dt>
                                            <dd className="mt-1">
                                                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-blueprint-700 hover:underline">
                                                    {company.website}
                                                </a>
                                            </dd>
                                        </div>
                                    )}
                                </dl>
                            )}

                            <Link href={route('companies.show', company.slug)} className="mt-5 block text-center text-xs font-extrabold uppercase tracking-wider transition hover:opacity-70" style={{ color }}>
                                View company profile →
                            </Link>
                        </div>

                        {/* CTA button */}
                        <button
                            type="button"
                            onClick={() => setModalOpen(true)}
                            className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition hover:opacity-90"
                            style={{ backgroundColor: color }}
                        >
                            Request a similar service
                        </button>
                    </div>

                    {/* ── Right: description ── */}
                    <div data-reveal>
                        {project.description ? (
                            <>
                                <p className="eyebrow" style={{ color }}>About this project</p>
                                <h2 className="section-title mt-3">Project overview</h2>
                                <div className="mt-8 space-y-5 text-lg leading-9 text-slate-600">
                                    {project.description.split('\n').filter(Boolean).map((para, i) => (
                                        <p key={i}>{para}</p>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-slate-200 p-12 text-center">
                                <div>
                                    <p className="font-extrabold text-slate-500">Details coming soon</p>
                                    <p className="mt-2 text-sm text-slate-400">Full project information will be published shortly.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Related projects */}
            {related.length > 0 && (
                <section className="site-section bg-slate-50">
                    <div className="site-container">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="eyebrow" style={{ color }}>More work</p>
                                <h2 className="section-title mt-3">Related projects</h2>
                            </div>
                            <Link href={route('projects.index')} className="text-link hidden sm:inline-flex">
                                View all →
                            </Link>
                        </div>
                        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {related.map(p => (
                                <Link
                                    key={p.id}
                                    href={route('projects.show', p.slug)}
                                    className="group overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="overflow-hidden">
                                        <img
                                            src={mediaUrl(p.cover_image_path)}
                                            alt={p.title}
                                            className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-5">
                                        {p.category && (
                                            <p className="text-xs font-black uppercase tracking-wider text-blueprint-600">{p.category}</p>
                                        )}
                                        <h3 className="mt-2 font-extrabold">{p.title}</h3>
                                        {p.summary && (
                                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{p.summary}</p>
                                        )}
                                        {(p.client || p.location || p.completed_at) && (
                                            <p className="mt-3 text-xs font-bold text-slate-400">
                                                {[
                                                    p.client,
                                                    p.location,
                                                    p.completed_at && new Date(p.completed_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
                                                ].filter(Boolean).join(' · ')}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="site-section bg-blueprint-950 text-white">
                <div className="site-container flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="eyebrow text-blue-200">Interested in this work?</p>
                        <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                            Get a similar result for your business.
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="btn-light shrink-0"
                    >
                        Request a service
                    </button>
                </div>
            </section>

            <RequestServiceModal
                company={company}
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </PublicLayout>
    );
}
