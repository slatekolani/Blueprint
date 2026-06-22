import { CompanyLogo } from '@/Components/Public/CompanyCard';
import PageHero from '@/Components/Public/PageHero';
import RequestServiceModal from '@/Components/Public/RequestServiceModal';
import PublicLayout from '@/Layouts/PublicLayout';
import { CompanyBrief, Project, mediaUrl } from '@/types/content';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Projects({ projects }: { projects: Project[] }) {
    const [modalCompany, setModalCompany] = useState<CompanyBrief | null>(null);

    return (
        <PublicLayout>
            <Head title="Projects and capabilities" />
            <PageHero
                eyebrow="Our work"
                title="A practical portfolio of group capabilities"
                copy="Selected projects and service examples from across the BluePrint family."
                crumbs={[{ label: 'Home', href: route('home') }, { label: 'Projects' }]}
            />

            <section className="site-section">
                <div className="site-container grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, i) => (
                        <div key={project.id} data-reveal style={{ transitionDelay: `${(i % 3) * 80}ms` }}>
                            <ProjectCard
                                project={project}
                                onRequest={() => project.company && setModalCompany(project.company)}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {modalCompany && (
                <RequestServiceModal
                    company={modalCompany}
                    open
                    onClose={() => setModalCompany(null)}
                />
            )}
        </PublicLayout>
    );
}

function ProjectCard({ project, onRequest }: { project: Project; onRequest: () => void }) {
    const company = project.company;
    const accentColor = company?.primary_color ?? '#073B7A';

    return (
        <article id={`project-${project.slug}`} className="scroll-mt-36 flex flex-col">
            <Link href={route('projects.show', project.slug)} className="group flex flex-col">
                <div className="overflow-hidden rounded-3xl bg-slate-100">
                    <img
                        src={mediaUrl(project.cover_image_path)}
                        alt={project.title}
                        className="aspect-[4/3] h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                </div>

                <div className="mt-5">
                    {/* Company badge */}
                    {company && (
                        <div className="mb-3 flex items-center gap-2">
                            <CompanyLogo company={company} size="sm" />
                            <span className="text-xs font-black uppercase tracking-wider" style={{ color: accentColor }}>
                                {company.short_name || company.name}
                                {project.category && <> · {project.category}</>}
                            </span>
                        </div>
                    )}

                    {!company && project.category && (
                        <p className="mb-3 text-xs font-black uppercase tracking-wider text-blueprint-600">{project.category}</p>
                    )}

                    <h2 className="text-xl font-extrabold">{project.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{project.summary}</p>

                    {(project.client || project.location) && (
                        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                            {[project.client, project.location].filter(Boolean).join(' · ')}
                        </p>
                    )}
                </div>
            </Link>

            {company && (
                <button
                    type="button"
                    onClick={onRequest}
                    className="mt-5 w-full rounded-xl border py-2.5 text-sm font-bold transition"
                    style={{ borderColor: accentColor, color: accentColor }}
                    onMouseEnter={e => { const el = e.currentTarget; el.style.backgroundColor = accentColor; el.style.color = '#fff'; }}
                    onMouseLeave={e => { const el = e.currentTarget; el.style.backgroundColor = ''; el.style.color = accentColor; }}
                >
                    Request this service
                </button>
            )}
        </article>
    );
}
