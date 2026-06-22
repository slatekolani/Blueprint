import Breadcrumb, { Crumb } from '@/Components/Public/Breadcrumb';

export default function PageHero({ eyebrow, title, copy, crumbs }: {
    eyebrow: string;
    title: string;
    copy?: string;
    crumbs?: Crumb[];
}) {
    return (
        <section className="bg-blueprint-950 py-28 text-white sm:py-40">
            <div className="site-container">
                {crumbs && crumbs.length > 0 && (
                    <div className="mb-8">
                        <Breadcrumb crumbs={crumbs} light />
                    </div>
                )}
                <p className="eyebrow text-blue-200">{eyebrow}</p>
                <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">{title}</h1>
                {copy && <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100">{copy}</p>}
            </div>
        </section>
    );
}
