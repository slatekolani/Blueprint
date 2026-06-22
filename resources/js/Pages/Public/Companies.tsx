import CompanyCard from '@/Components/Public/CompanyCard';
import PageHero from '@/Components/Public/PageHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Company } from '@/types/content';
import { Head } from '@inertiajs/react';

export default function Companies({ companies }: { companies: Company[] }) {
    return (
        <PublicLayout>
            <Head title="Our Companies" />
            <PageHero
                eyebrow="Our companies"
                title="Different expertise. One standard of service."
                copy="Explore BluePrint and the specialist companies that make up our growing business group."
                crumbs={[{ label: 'Home', href: route('home') }, { label: 'Companies' }]}
            />
            <section className="site-section">
                <div className="site-container grid gap-7 md:grid-cols-2 xl:grid-cols-3">
                    {companies.map(company => <CompanyCard key={company.id} company={company} />)}
                </div>
            </section>
        </PublicLayout>
    );
}
