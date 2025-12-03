import Link from "next/link";
import { getResume } from '../../lib/data';

export const revalidate = 60;

export default async function CV() {
    const resume = await getResume();

    // Use resume object for everything now
    const educationSections = resume.sections?.filter(s => s.type === 'Education') || [];
    const experienceSections = resume.sections?.filter(s => s.type === 'Experience') || [];
    const skillsSection = resume.sections?.find(s => s.type === 'Skills');
    const languagesSection = resume.sections?.find(s => s.type === 'Languages');
    const downloads = resume.downloads || [];

    return (
        <main className="min-h-screen pt-32 px-4 md:px-12 pb-20 bg-[#f0f0f0] text-[#111]">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b border-black/10 pb-8">
                <div>
                    <h1 className="text-6xl md:text-[8vw] leading-[0.8] font-medium tracking-tight mb-4 uppercase">
                        <span dangerouslySetInnerHTML={{ __html: resume.heading || "CURRICULUM<br/>VITAE" }} />
                    </h1>
                    <p className="font-mono text-xs text-gray-500 uppercase tracking-widest mt-2">
                        {resume.subHeading || "Hizkia Weize — Interaction Designer"}
                    </p>
                </div>
                <div className="mt-8 md:mt-0 flex flex-col items-end gap-3">
                    {downloads.length > 0 ? (
                        downloads.map((dl, i) => (
                            <a key={i} href={dl.url} download target="_blank" className="group flex items-center gap-3 px-6 py-3 border border-black hover:bg-black hover:text-white transition-all duration-300">
                                <span className="font-mono text-xs font-bold uppercase">{dl.label}</span>
                                <span className="group-hover:translate-y-1 transition-transform duration-300">↓</span>
                            </a>
                        ))
                    ) : (
                        <button className="group flex items-center gap-3 px-6 py-3 border border-black opacity-50 cursor-not-allowed"><span className="font-mono text-xs font-bold uppercase">NO PDF AVAILABLE</span></button>
                    )}
                </div>
            </div>

            {/* CONTENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-4 space-y-12">
                    {educationSections.map((section, i) => (
                        <div key={i}>
                            <h3 className="font-mono text-xs text-gray-400 mb-6 uppercase border-b border-black/10 pb-2">[01] {section.title}</h3>
                            {section.items.map((item, idx) => (
                                <div key={idx} className="mb-6">
                                    <h4 className="text-xl font-medium">{item.title}</h4>
                                    <p className="text-gray-600 font-serif italic">{item.subtitle}</p>
                                    <p className="font-mono text-xs mt-2 text-gray-400">{item.date}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div>
                        <h3 className="font-mono text-xs text-gray-400 mb-6 uppercase border-b border-black/10 pb-2">[02] Technical Stack</h3>
                        <ul className="grid grid-cols-1 gap-2">
                            {skillsSection?.items.map((item, i) => (
                                <li key={i} className="font-mono text-sm flex items-center gap-2"><span className="w-1 h-1 bg-black rounded-full"></span>{item.title}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-mono text-xs text-gray-400 mb-6 uppercase border-b border-black/10 pb-2">[03] Languages</h3>
                        <ul className="space-y-2 font-mono text-sm">
                            {languagesSection?.items.map((item, i) => (
                                <li key={i} className="flex justify-between"><span>{item.title}</span><span className="text-gray-400">{item.subtitle}</span></li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="md:col-span-8">
                    {experienceSections.map((section, i) => (
                        <div key={i}>
                            <h3 className="font-mono text-xs text-gray-400 mb-8 uppercase border-b border-black/10 pb-2">[04] {section.title}</h3>
                            <div className="flex flex-col">
                                {section.items.map((exp, index) => (
                                    <div key={index} className="group py-8 first:pt-0 border-b border-black/10 hover:bg-white transition-colors px-4 -mx-4">
                                        <div className="flex flex-col md:flex-row justify-between items-baseline mb-2">
                                            <h4 className="text-3xl font-medium group-hover:pl-2 transition-all">{exp.title}</h4>
                                            <span className="font-mono text-xs text-gray-500">{exp.date}</span>
                                        </div>
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                                            <span className="font-mono text-xs uppercase tracking-wider text-black bg-gray-200 px-2 py-1">{exp.subtitle}</span>
                                        </div>
                                        <p className="text-lg text-gray-700 font-serif leading-relaxed max-w-2xl whitespace-pre-wrap">{exp.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* DYNAMIC BOTTOM CTA */}
                    <div className="mt-12 p-6 bg-gray-200 text-center">
                        <p className="font-mono text-xs text-gray-500 mb-2 uppercase">{resume.footerTitle || "LOOKING FOR FULL DETAILS?"}</p>
                        <p className="text-sm font-medium">{resume.footerText || "Download the PDF version above for the complete work history."}</p>
                    </div>
                </div>
            </div>

            {/* DYNAMIC FOOTER NAV */}
            <div className="mt-20 border-t border-black/10 pt-12 flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="text-left">
                    <p className="font-mono text-xs text-gray-400 mb-2">{resume.navPrevLabel || "PREVIOUS"}</p>
                    <Link href="/experiments" className="text-xl md:text-2xl font-medium hover:italic transition-all inline-block">
                        {resume.navPrevText || "← Experiments"}
                    </Link>
                </div>
                <div className="text-right">
                    <p className="font-mono text-xs text-gray-400 mb-2">{resume.navNextLabel || "INTERESTED?"}</p>
                    <Link href="/contact" className="text-4xl md:text-6xl font-medium hover:italic transition-all inline-block">
                        {resume.navNextText || "Initiate Contact →"}
                    </Link>
                </div>
            </div>
        </main>
    );
}