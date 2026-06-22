import BrandMark from '@/Components/BrandMark';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-slate-100 px-5 pt-12 sm:justify-center sm:pt-0">
            <BrandMark />
            <p className="mt-4 text-xs font-extrabold uppercase tracking-[.2em] text-slate-400">Staff administration</p>
            <div className="mt-7 w-full overflow-hidden rounded-2xl bg-white px-7 py-8 shadow-xl shadow-slate-200/60 sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
