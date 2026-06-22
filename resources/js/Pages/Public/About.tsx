import CompanyCard from '@/Components/Public/CompanyCard';
import PageHero from '@/Components/Public/PageHero';
import SectionHeading from '@/Components/Public/SectionHeading';
import PublicLayout from '@/Layouts/PublicLayout';
import { Company, mediaUrl } from '@/types/content';
import { Head } from '@inertiajs/react';

export default function About({ group, companies }: { group: Company; companies: Company[] }) {
    return (
        <PublicLayout>
            <Head title="About BluePrint Group" />
            <PageHero
                eyebrow="About us"
                title="A Tanzanian business group built around practical delivery"
                copy={group.summary}
                crumbs={[{ label: 'Home', href: route('home') }, { label: 'About' }]}
            />
            <section className="site-section">
                <div className="site-container grid items-center gap-12 lg:grid-cols-2">
                    <div className="overflow-hidden rounded-[2rem] bg-slate-100"><img src={mediaUrl(group.hero_image_path)} alt="BluePrint services" className="aspect-[4/3] h-full w-full object-cover" /></div>
                    <div>
                        <SectionHeading eyebrow="Our story" title="Creativity, supply and service under one roof" />
                        <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">{group.description}</p>
                        <div className="mt-8 grid grid-cols-2 gap-4">
                            {['Customer-focused execution', 'Quality-led production', 'Reliable delivery', 'Connected expertise'].map(item => <div key={item} className="rounded-2xl bg-slate-50 p-5 text-sm font-bold">{item}</div>)}
                        </div>
                    </div>
                </div>
            </section>
            <section className="site-section bg-slate-50">
                <div className="site-container">
                    <SectionHeading eyebrow="Our structure" title="One parent company, four focused member companies" copy="Every company maintains its own services and customer relationships while sharing the standards and support of BluePrint Group." />
                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">{companies.map(company => <CompanyCard key={company.id} company={company} />)}</div>
                </div>
            </section>
        </PublicLayout>
    );
}
