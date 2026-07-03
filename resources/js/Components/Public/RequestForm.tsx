import { CompanyBrief, Service, formatServicePrice } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Props {
    company: CompanyBrief;
    services?: Service[];
    initialServiceId?: number | null;
}

export default function RequestForm({ company, services = [], initialServiceId }: Props) {
    const [submitted, setSubmitted] = useState(false);

    const form = useForm<{
        company_id: number;
        service_id: number | '';
        type: string;
        name: string;
        email: string;
        phone: string;
        organization: string;
        subject: string;
        message: string;
    }>({
        company_id: company.id,
        service_id: initialServiceId ?? '',
        type: 'quote',
        name: '',
        email: '',
        phone: '',
        organization: '',
        subject: initialServiceId
            ? `Service request — ${services.find(s => s.id === initialServiceId)?.name ?? company.short_name ?? company.name}`
            : `Service request — ${company.short_name ?? company.name}`,
        message: '',
    });

    useEffect(() => {
        if (!initialServiceId) return;
        const svc = services.find(s => s.id === initialServiceId);
        form.setData('service_id', initialServiceId);
        if (svc) form.setData('subject', `Service request — ${svc.name}`);
    }, [initialServiceId]);

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value ? Number(e.target.value) : '';
        form.setData('service_id', id);
        const svc = services.find(s => s.id === id);
        form.setData('subject', svc
            ? `Service request — ${svc.name}`
            : `Service request — ${company.short_name ?? company.name}`
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(route('inquiries.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setSubmitted(true),
        });
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-emerald-100 bg-emerald-50 px-8 py-16 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
                    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-emerald-600" aria-hidden="true">
                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-slate-900">Request received!</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                    Thank you, <strong>{form.data.name || 'there'}</strong>. The team at{' '}
                    <strong>{company.short_name || company.name}</strong> will be in touch shortly.
                </p>
                <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-7 text-sm font-bold transition hover:opacity-70"
                    style={{ color: company.primary_color }}
                >
                    Send another request →
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {services.length > 0 && (
                <Field label="Service">
                    <select className="field-input" value={form.data.service_id} onChange={handleServiceChange}>
                        <option value="">All services / General enquiry</option>
                        {services.map(svc => (
                            <option key={svc.id} value={svc.id}>
                                {svc.category ? `${svc.category} — ` : ''}{svc.name} ({formatServicePrice(svc.price)})
                            </option>
                        ))}
                    </select>
                </Field>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required error={form.errors.name}>
                    <input
                        className="field-input"
                        placeholder="Your full name"
                        value={form.data.name}
                        onChange={e => form.setData('name', e.target.value)}
                        required
                    />
                </Field>
                <Field label="Phone number" required error={form.errors.phone}>
                    <input
                        className="field-input"
                        placeholder="+255 7XX XXX XXX"
                        value={form.data.phone}
                        onChange={e => form.setData('phone', e.target.value)}
                        required
                    />
                </Field>
                <Field label="Email address" error={form.errors.email}>
                    <input
                        type="email"
                        className="field-input"
                        placeholder="you@example.com"
                        value={form.data.email}
                        onChange={e => form.setData('email', e.target.value)}
                    />
                </Field>
                <Field label="Organization" error={form.errors.organization}>
                    <input
                        className="field-input"
                        placeholder="Company or organization"
                        value={form.data.organization}
                        onChange={e => form.setData('organization', e.target.value)}
                    />
                </Field>
            </div>

            <Field label="Subject" error={form.errors.subject}>
                <input
                    className="field-input"
                    value={form.data.subject}
                    onChange={e => form.setData('subject', e.target.value)}
                />
            </Field>

            <Field label="Message" required error={form.errors.message}>
                <textarea
                    className="field-input min-h-28 resize-none"
                    placeholder="Tell us what you need…"
                    value={form.data.message}
                    onChange={e => form.setData('message', e.target.value)}
                    required
                />
            </Field>

            <button
                type="submit"
                disabled={form.processing}
                className="w-full rounded-xl py-3.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: company.primary_color }}
            >
                {form.processing ? 'Sending…' : 'Send request'}
            </button>
        </form>
    );
}

function Field({ label, required, error, children }: {
    label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-bold text-slate-600">
                {label}{required && <span className="ml-0.5 text-red-500">*</span>}
            </span>
            {children}
            {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
        </label>
    );
}
