"use client";

const BrutalHeading = ({ text }) => {
  if (!text) return null;
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

const CornerText = ({ text }) => {
  if (!text) return null;
  return text.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line}
    </span>
  ));
};

export default function HeroOverlay({ content }) {
  const c = content || {};

  return (
    <div className="absolute inset-0 w-full h-screen z-50 pointer-events-none select-none overflow-hidden px-6 md:px-12 pt-16 md:pt-16">
      {/* TOP BAR */}
      <div className="flex justify-between items-start animate-brutal-enter">
        <div className="flex flex-col font-mono text-xs gap-1">
          <span className="font-bold">
            <CornerText text={c.cornerTopLeft} />
          </span>
          <span className="text-gray-500">{c.subHeading}</span>
        </div>

        <div className="font-mono text-xs text-right hidden md:block">
          <CornerText text={c.cornerTopRight} />
        </div>
      </div>

      {/* CENTER */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 z-10">
        <div className="animate-brutal-enter delay-200 flex flex-col items-center">
          <h1 className="text-5xl md:text-[10vw] leading-[0.85] font-black tracking-tighter text-black mb-8 md:mb-10 drop-shadow-sm uppercase">
            <BrutalHeading text={c.heading} />
          </h1>

          <div className="mt-2 px-6 py-2 md:px-8 md:py-3 bg-white/60 backdrop-blur-md border border-black/20 rounded-full">
            <p className="font-mono text-xs md:text-xl font-bold tracking-[0.15em] text-black animate-pulse whitespace-nowrap">
              {c.scrollText || "(SCROLL TO ENTER) ↓"}
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="absolute bottom-6 md:bottom-12 left-0 w-full flex justify-between items-end animate-brutal-enter delay-500 px-6 md:px-12">
        <div className="hidden md:block font-mono text-xs">
          <CornerText text={c.cornerBottomLeft} />
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mb-0 flex gap-2 items-end opacity-30 pointer-events-none">
          <div className="w-[1px] h-12 bg-black" />
          <div className="w-[1px] h-8 bg-black" />
          <div className="w-[1px] h-24 bg-black" />
        </div>

        <div className="font-mono text-xs text-right w-full md:w-auto">
          <CornerText text={c.cornerBottomRight} />
        </div>
      </div>
    </div>
  );
}
