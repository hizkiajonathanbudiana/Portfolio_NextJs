'use client';

// Helper component untuk render HTML break line (<br/>) dari CMS
const BrutalHeading = ({ text }) => {
    if (!text) return null;
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

// Helper untuk New Line (\n) di corner text
const CornerText = ({ text }) => {
    if (!text) return null;
    return (
        <>
            {text.split('\n').map((line, i) => (
                <span key={i} className="block">{line}</span>
            ))}
        </>
    );
};

export default function HeroOverlay({ content }) {
    // Default fallback biar gak crash kalo content null (Client Side safety)
    const c = content || {};

    return (
        <div className="absolute top-0 left-0 w-full h-screen pointer-events-none z-50 flex flex-col justify-between p-6 md:p-12 select-none overflow-hidden">

            {/* === TOP BAR === */}
            <div className="flex justify-between items-start animate-brutal-enter">
                <div className="flex flex-col font-mono text-xs gap-1">
                    {/* DYNAMIC TOP LEFT */}
                    <span className="font-bold"><CornerText text={c.cornerTopLeft} /></span>
                    <span className="text-gray-500">{c.subHeading}</span>
                </div>
                <div className="font-mono text-xs text-right hidden md:block">
                    {/* DYNAMIC TOP RIGHT */}
                    <CornerText text={c.cornerTopRight} />
                </div>
            </div>

            {/* === CENTER TITLE === */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full z-10">
                <div className="animate-brutal-enter delay-200 flex flex-col items-center">
                    <h1 className="text-6xl md:text-[10vw] leading-[0.85] font-black tracking-tighter text-black mb-10 drop-shadow-sm uppercase">
                        {/* DYNAMIC HEADING */}
                        <BrutalHeading text={c.heading} />
                    </h1>

                    {/* DYNAMIC SCROLL INSTRUCTION */}
                    <div className="mt-2 px-8 py-3 bg-white/60 backdrop-blur-md border border-black/20 rounded-full">
                        <p className="font-mono text-sm md:text-xl font-bold tracking-[0.15em] text-black animate-pulse">
                            {c.scrollText || "(SCROLL TO ENTER) ↓"}
                        </p>
                    </div>
                </div>
            </div>

            {/* === BOTTOM BAR === */}
            <div className="flex justify-between items-end animate-brutal-enter delay-500">

                <div className="hidden md:block font-mono text-xs">
                    {/* DYNAMIC BOTTOM LEFT */}
                    <CornerText text={c.cornerBottomLeft} />
                </div>

                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-0 flex gap-2 items-end opacity-30">
                    <div className="w-[1px] h-12 bg-black"></div>
                    <div className="w-[1px] h-8 bg-black"></div>
                    <div className="w-[1px] h-24 bg-black"></div>
                </div>

                <div className="font-mono text-xs text-right">
                    {/* DYNAMIC BOTTOM RIGHT */}
                    <CornerText text={c.cornerBottomRight} />
                </div>
            </div>

        </div>
    );
}