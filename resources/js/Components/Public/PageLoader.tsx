import { useEffect, useState } from 'react';

export default function PageLoader() {
    const [brandVisible, setBrandVisible] = useState(false);
    const [exiting, setExiting]           = useState(false);
    const [gone, setGone]                 = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const t0 = setTimeout(() => setBrandVisible(true), 120);
        const t1 = setTimeout(() => setExiting(true),      1500);
        const t2 = setTimeout(() => {
            setGone(true);
            document.body.style.overflow = '';
        }, 2150);

        return () => {
            clearTimeout(t0);
            clearTimeout(t1);
            clearTimeout(t2);
            document.body.style.overflow = '';
        };
    }, []);

    if (gone) return null;

    return (
        <div
            aria-hidden="true"
            className={[
                'pointer-events-none fixed inset-0 z-[9999]',
                'flex flex-col items-center justify-center',
                'bg-blueprint-950',
                'transition-transform duration-700',
                'ease-[cubic-bezier(0.76,0,0.24,1)]',
                exiting ? '-translate-y-full' : 'translate-y-0',
            ].join(' ')}
        >
            {/* Brand mark */}
            <div
                className={[
                    'transition-all duration-500 ease-out',
                    brandVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
                ].join(' ')}
            >
                <img
                    src="/images/Logo/Blueprint.jpeg"
                    alt="Blue Print Group of Companies Ltd"
                    style={{
                        height: '160px',
                        width: 'auto',
                        borderRadius: '14px',
                        padding: '8px 16px',
                        background: 'rgba(255,255,255,0.12)',
                    }}
                />
            </div>

            {/* Progress bar */}
            <div className="mt-8 h-[2px] w-36 overflow-hidden rounded-full bg-white/15">
                {brandVisible && (
                    <div className="loader-bar h-full rounded-full bg-white/75" />
                )}
            </div>

            {/* Subtle tagline */}
            <p
                className={[
                    'mt-5 text-[11px] font-bold uppercase tracking-[0.3em] text-blue-300/60',
                    'transition-all duration-700 delay-300',
                    brandVisible ? 'opacity-100' : 'opacity-0',
                ].join(' ')}
            >
                Ideas designed. Brands built.
            </p>
        </div>
    );
}
