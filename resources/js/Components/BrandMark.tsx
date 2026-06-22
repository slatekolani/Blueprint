import { Link } from '@inertiajs/react';

export default function BrandMark({ light = false, compact = false, src }: { light?: boolean; compact?: boolean; src?: string }) {
    return (
        <Link href={route('home')} aria-label="Blue Print Group of Companies Ltd — home">
            <img
                src={src ?? '/images/Logo/Blueprint logo.jpg'}
                alt="Blue Print Group of Companies Ltd"
                className="w-auto object-contain"
                style={{
                    height: compact ? '96px' : '120px',
                    transition: 'height 0.35s cubic-bezier(0.4,0,0.2,1)',
                    borderRadius: light ? '10px' : undefined,
                    padding: light ? '4px 8px' : undefined,
                    background: light ? 'rgba(255,255,255,0.12)' : undefined,
                }}
            />
        </Link>
    );
}
