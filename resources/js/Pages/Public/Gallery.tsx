import PageHero from '@/Components/Public/PageHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { GalleryItem, mediaUrl } from '@/types/content';
import { Head, Link } from '@inertiajs/react';

export default function Gallery({ items }: { items: GalleryItem[] }) {
    return (
        <PublicLayout>
            <Head title="Gallery" />
            <PageHero
                eyebrow="Gallery"
                title="Service work in pictures and motion"
                copy="Photos and videos from BluePrint Group services, with notes that explain the work behind each piece."
                crumbs={[{ label: 'Home', href: route('home') }, { label: 'Gallery' }]}
            />

            <section className="site-section">
                <div className="site-container">
                    {items.length > 0 ? (
                        <div className="grid gap-x-7 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
                            {items.map((item, index) => (
                                <article key={item.id} data-reveal style={{ transitionDelay: `${(index % 3) * 80}ms` }} className="flex flex-col">
                                    <div className="overflow-hidden rounded-3xl bg-slate-100">
                                        {item.media_type === 'video' ? (
                                            <video
                                                src={mediaUrl(item.media_path)}
                                                className="aspect-[4/3] w-full object-cover"
                                                controls
                                                playsInline
                                                preload="metadata"
                                            />
                                        ) : (
                                            <img src={mediaUrl(item.media_path)} alt={item.title} className="aspect-[4/3] w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="mt-5">
                                        {item.service && (
                                            <Link
                                                href={route('services.show', item.service.slug)}
                                                className="text-xs font-black uppercase tracking-wider"
                                                style={{ color: item.service.company?.primary_color || '#0B3B78' }}
                                            >
                                                {item.service.company?.short_name || item.service.company?.name || 'BluePrint'} - {item.service.name}
                                            </Link>
                                        )}
                                        <h2 className="mt-2 text-xl font-extrabold">{item.title}</h2>
                                        <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
                            <h2 className="text-2xl font-black text-slate-900">Gallery coming soon</h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
                                The team is preparing service photos and videos for this section.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}
