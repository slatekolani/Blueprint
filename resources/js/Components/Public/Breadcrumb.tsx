import { Link } from '@inertiajs/react';

export type Crumb = { label: string; href?: string };

export default function Breadcrumb({ crumbs, light = false }: { crumbs: Crumb[]; light?: boolean }) {
    return (
        <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
                {crumbs.map((crumb, i) => (
                    <li key={i} className="flex items-center gap-2">
                        {i > 0 && (
                            <svg
                                className={`h-3 w-3 shrink-0 ${light ? 'text-white/30' : 'text-slate-300'}`}
                                viewBox="0 0 16 16" fill="none" aria-hidden="true"
                            >
                                <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                        {crumb.href ? (
                            <Link
                                href={crumb.href}
                                className={`text-xs font-semibold transition-colors ${
                                    light
                                        ? 'text-white/50 hover:text-white/90'
                                        : 'text-slate-400 hover:text-slate-700'
                                }`}
                            >
                                {crumb.label}
                            </Link>
                        ) : (
                            <span
                                aria-current="page"
                                className={`text-xs font-bold ${light ? 'text-white/80' : 'text-slate-700'}`}
                            >
                                {crumb.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
