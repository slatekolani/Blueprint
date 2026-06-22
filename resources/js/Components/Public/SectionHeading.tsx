export default function SectionHeading({ eyebrow, title, copy, light = false }: { eyebrow: string; title: string; copy?: string; light?: boolean }) {
    return (
        <div className="max-w-2xl">
            <p className={`eyebrow ${light ? 'text-blue-200' : ''}`}>{eyebrow}</p>
            <h2 className={`section-title mt-3 ${light ? 'text-white' : ''}`}>{title}</h2>
            {copy && <p className={`mt-5 text-base leading-7 ${light ? 'text-blue-100' : 'text-slate-600'}`}>{copy}</p>}
        </div>
    );
}
