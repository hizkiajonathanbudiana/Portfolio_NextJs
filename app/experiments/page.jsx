import Link from "next/link";
import { getProjectsData } from "../../lib/data"; // Pake fetcher baru
import ProjectsList from "./ProjectsList";

export const revalidate = 60; // Pastikan selalu fresh

export default async function Experiments() {
  // Ambil data paket lengkap (meta + items)
  const { meta, items } = await getProjectsData();

  return (
    <main className="min-h-screen pt-32 px-4 md:px-12 pb-20 bg-[#f0f0f0]">
      {/* HEADER PAKE DATA META */}
      <div className="mb-12 border-b border-black/10 pb-8 flex flex-col md:flex-row justify-between items-end">
        <h1 className="text-6xl md:text-[8vw] leading-[0.9] font-medium tracking-tight text-black uppercase">
          <span
            dangerouslySetInnerHTML={{
              __html: meta.heading || "SELECTED<br/>WORKS",
            }}
          />
        </h1>
        <div className="text-right font-mono text-xs text-gray-500 mt-4 md:mt-0">
          <p className="uppercase">{meta.subHeading || "INTERACTION / DEV"}</p>
          <p>DATABASE ENTRIES: {items.length}</p>
          <p className="mt-2 text-black animate-pulse">
            {meta.metaText || "TAP ROW TO EXPAND [+]"}
          </p>
        </div>
      </div>

      {/* LIST PAKE DATA ITEMS */}
      <ProjectsList projects={items} />

      {/* FOOTER NAV PAKE DATA META */}
      <div className="mt-20 border-t border-black/10 pt-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="text-left">
          <p className="font-mono text-xs text-gray-400 mb-2">
            {meta.navPrevLabel || "PREVIOUS"}
          </p>
          <Link
            href="/about"
            className="text-xl md:text-2xl font-medium hover:italic transition-all inline-block"
          >
            {meta.navPrevText || "← About Me"}
          </Link>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-gray-400 mb-2">
            {meta.navNextLabel || "NEXT"}
          </p>
          <Link
            href="/resume"
            className="text-4xl md:text-6xl font-medium hover:italic transition-all inline-block"
          >
            {meta.navNextText || "View Resume →"}
          </Link>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata() {
  return {
    title: "Experiments · ITSWEI",
    description:
      "Experiments page — Portfolio of Chen Weize (陳偉澤) / Hizkia Jonathan Budiana.",
  };
}
