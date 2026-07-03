import PageHero from '@/Components/Public/PageHero';
import PublicLayout from '@/Layouts/PublicLayout';
import { Company, Service, formatServicePrice } from '@/types/content';
import { Head, useForm } from '@inertiajs/react';

export default function Contact({ companies, services, settings }: { companies: Company[]; services: Service[]; settings: Record<string, string> }) {
    const params = new URLSearchParams(window.location.search);
    const form = useForm({ company_id: params.get('company') || '', service_id: '', type: 'quote', name: '', email: '', phone: '', organization: '', subject: '', message: '' });
    const submit = (e: React.FormEvent) => { e.preventDefault(); form.post(route('inquiries.store'), { preserveScroll: true, onSuccess: () => form.reset('name', 'email', 'phone', 'organization', 'subject', 'message') }); };
    const visibleServices = services.filter(service => !form.data.company_id || service.company_id === Number(form.data.company_id));

    return (
        <PublicLayout>
            <Head title="Contact and request a quote" />
            <PageHero
                eyebrow="Contact us"
                title="Tell us what you need. We'll connect the right team."
                copy="Send one request to the group or select the company and service you already have in mind."
                crumbs={[{ label: 'Home', href: route('home') }, { label: 'Contact' }]}
            />
            <section className="site-section">
                <div className="site-container grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
                    <div>
                        <h2 className="text-3xl font-black">BluePrint Group</h2>
                        <div className="mt-7 space-y-5 text-slate-600"><p><strong className="block text-slate-950">Visit</strong>{settings.contact_address}</p><p><strong className="block text-slate-950">Call</strong>{settings.contact_phone}</p><p><strong className="block text-slate-950">Email</strong>{settings.contact_email}</p></div>
                        <div className="mt-10 rounded-3xl bg-blueprint-950 p-7 text-white"><p className="text-sm font-bold text-blue-200">Need a quick response?</p><p className="mt-2 text-2xl font-black">Call +255 754 444 010</p><p className="mt-3 text-sm leading-6 text-blue-100">Our team will direct your request to the appropriate company.</p></div>
                    </div>
                    <form onSubmit={submit} className="grid gap-5 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/40 sm:grid-cols-2 sm:p-9">
                        <label className="field-label">Your name<input className="field-input" value={form.data.name} onChange={e => form.setData('name', e.target.value)} required />{form.errors.name && <span className="field-error">{form.errors.name}</span>}</label>
                        <label className="field-label">Phone number<input className="field-input" value={form.data.phone} onChange={e => form.setData('phone', e.target.value)} required />{form.errors.phone && <span className="field-error">{form.errors.phone}</span>}</label>
                        <label className="field-label">Email<input type="email" className="field-input" value={form.data.email} onChange={e => form.setData('email', e.target.value)} /></label>
                        <label className="field-label">Organization<input className="field-input" value={form.data.organization} onChange={e => form.setData('organization', e.target.value)} /></label>
                        <label className="field-label">Company<select className="field-input" value={form.data.company_id} onChange={e => { form.setData('company_id', e.target.value); form.setData('service_id', ''); }}><option value="">BluePrint Group / not sure</option>{companies.map(company => <option key={company.id} value={company.id}>{company.name}</option>)}</select></label>
                        <label className="field-label">Service<select className="field-input" value={form.data.service_id} onChange={e => form.setData('service_id', e.target.value)}><option value="">Select a service</option>{visibleServices.map(service => <option key={service.id} value={service.id}>{service.name} ({formatServicePrice(service.price)})</option>)}</select></label>
                        <label className="field-label sm:col-span-2">Request type<select className="field-input" value={form.data.type} onChange={e => form.setData('type', e.target.value)}><option value="quote">Request a quote</option><option value="printing">Printing request</option><option value="supply">Supply request</option><option value="insurance">Insurance inquiry</option><option value="general">General inquiry</option></select></label>
                        <label className="field-label sm:col-span-2">How can we help?<textarea className="field-input min-h-36" value={form.data.message} onChange={e => form.setData('message', e.target.value)} required />{form.errors.message && <span className="field-error">{form.errors.message}</span>}</label>
                        <div className="sm:col-span-2"><button disabled={form.processing} className="btn-primary w-full justify-center disabled:opacity-50">{form.processing ? 'Sending…' : 'Send request'}</button></div>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}
