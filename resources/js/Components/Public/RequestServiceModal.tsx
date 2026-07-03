import { CompanyBrief, Service, formatServicePrice } from '@/types/content';
import { useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

interface Props {
    company: CompanyBrief;
    services?: Service[];
    initialServiceId?: number | null;
    open: boolean;
    onClose: () => void;
}

export default function RequestServiceModal({ company, services = [], initialServiceId, open, onClose }: Props) {
    const [submitted, setSubmitted] = useState(false);
    const firstFieldRef = useRef<HTMLInputElement>(null);

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
        service_id: '',
        type: 'quote',
        name: '',
        email: '',
        phone: '',
        organization: '',
        subject: `Service request — ${company.short_name || company.name}`,
        message: '',
    });

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
            if (initialServiceId) {
                const svc = services.find(s => s.id === initialServiceId);
                form.setData('service_id', initialServiceId);
                if (svc) form.setData('subject', `Service request — ${svc.name}`);
            }
            setTimeout(() => firstFieldRef.current?.focus(), 50);
        } else {
            document.body.style.overflow = '';
            setSubmitted(false);
            form.reset();
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, onClose]);

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value ? Number(e.target.value) : '';
        form.setData('service_id', id);
        const svc = services.find(s => s.id === id);
        form.setData('subject', svc
            ? `Service request — ${svc.name}`
            : `Service request — ${company.short_name || company.name}`
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

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5"
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal panel */}
            <div
                className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:rounded-3xl"
                style={{ maxHeight: '92dvh' }}
            >
                {/* Header — always visible */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6 sm:py-4">
                    <div className="min-w-0 pr-3">
                        <p className="truncate text-xs font-black uppercase tracking-widest" style={{ color: company.primary_color }}>
                            {company.short_name || company.name}
                        </p>
                        <h2 className="mt-0.5 text-base font-extrabold text-slate-900 sm:text-lg">Request a service</h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:bg-slate-50 hover:text-slate-700 sm:h-9 sm:w-9"
                    >
                        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                            <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {submitted ? (
                        <div className="px-5 py-10 text-center sm:px-7 sm:py-14">
                            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 sm:h-14 sm:w-14">
                                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-emerald-600 sm:h-7 sm:w-7" aria-hidden="true">
                                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                            <h3 className="mt-4 text-lg font-extrabold text-slate-900 sm:mt-5 sm:text-xl">Request received!</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500 sm:mt-3">
                                Thank you, <strong>{form.data.name || 'there'}</strong>. The team at{' '}
                                <strong>{company.short_name || company.name}</strong> will be in touch shortly.
                                {form.data.email && ' A confirmation has been sent to your email.'}
                            </p>
                            <button
                                type="button"
                                onClick={onClose}
                                className="mt-6 inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white transition hover:opacity-90 sm:mt-8 sm:px-7"
                                style={{ backgroundColor: company.primary_color }}
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-6 sm:py-5">

                            {services.length > 0 && (
                                <MField label="Service" error={form.errors.service_id as string | undefined}>
                                    <select className="field-input" value={form.data.service_id} onChange={handleServiceChange}>
                                        <option value="">All services / General enquiry</option>
                                        {services.map(svc => (
                                            <option key={svc.id} value={svc.id}>
                                                {svc.category ? `${svc.category} — ` : ''}{svc.name} ({formatServicePrice(svc.price)})
                                            </option>
                                        ))}
                                    </select>
                                </MField>
                            )}

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                                <MField label="Full name" required error={form.errors.name}>
                                    <input
                                        ref={firstFieldRef}
                                        className="field-input"
                                        placeholder="Your full name"
                                        value={form.data.name}
                                        onChange={e => form.setData('name', e.target.value)}
                                        required
                                    />
                                </MField>
                                <MField label="Phone number" required error={form.errors.phone}>
                                    <input
                                        className="field-input"
                                        placeholder="+255 7XX XXX XXX"
                                        value={form.data.phone}
                                        onChange={e => form.setData('phone', e.target.value)}
                                        required
                                    />
                                </MField>
                                <MField label="Email address" error={form.errors.email}>
                                    <input
                                        type="email"
                                        className="field-input"
                                        placeholder="you@example.com"
                                        value={form.data.email}
                                        onChange={e => form.setData('email', e.target.value)}
                                    />
                                </MField>
                                <MField label="Organization" error={form.errors.organization}>
                                    <input
                                        className="field-input"
                                        placeholder="Company or organization"
                                        value={form.data.organization}
                                        onChange={e => form.setData('organization', e.target.value)}
                                    />
                                </MField>
                            </div>

                            <MField label="Subject" error={form.errors.subject}>
                                <input
                                    className="field-input"
                                    value={form.data.subject}
                                    onChange={e => form.setData('subject', e.target.value)}
                                />
                            </MField>

                            <MField label="Message" required error={form.errors.message}>
                                <textarea
                                    className="field-input min-h-24 resize-none sm:min-h-28"
                                    placeholder="Tell us what you need…"
                                    value={form.data.message}
                                    onChange={e => form.setData('message', e.target.value)}
                                    required
                                />
                            </MField>

                            <div className="pb-2 pt-1">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="w-full rounded-xl py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60 sm:py-3.5"
                                    style={{ backgroundColor: company.primary_color }}
                                >
                                    {form.processing ? 'Sending…' : 'Send request'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

function MField({ label, required, error, children }: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
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
