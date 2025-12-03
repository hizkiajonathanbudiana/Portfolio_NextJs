import Link from 'next/link';
import Image from 'next/image';
import { getAbout } from '../../lib/data'; // Fetcher baru

export const revalidate = 60;

export default async function About() {
    const about = await getAbout();

    return (
        <main className="min-h-screen pt-32 px-4 md:px-12 pb-12 bg-[#f0f0f0] text-[#111]">

            {/* === TOP SECTION: PHOTO & BIO === */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-black/10 pb-16 mb-16">

                {/* KOLOM 1: FOTO */}
                <div className="md:col-span-5 relative h-[500px] md:h-[700px] bg-gray-200 grayscale hover:grayscale-0 transition-all duration-700 group">
                    <Image
                        src={about.profileImage || "https://placehold.co/800x1200/222/FFF/png?text=NO+IMAGE"}
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="font-mono text-[10px] uppercase tracking-widest">
                            {about.imageCaption || "Taipei, 2025"}
                        </p>
                    </div>
                </div>

                {/* KOLOM 2: PERKENALAN (BIO) */}
                <div className="md:col-span-7 flex flex-col justify-center">
                    <h1 className="text-4xl md:text-7xl font-medium leading-[0.95] tracking-tight mb-8 uppercase">
                        {/* DYNAMIC HEADING */}
                        <span dangerouslySetInnerHTML={{ __html: about.heroHeading || "HELLO, I'M<br/>HIZKIA WEIZE." }} />
                    </h1>

                    <div className="space-y-6 text-lg md:text-xl font-serif leading-relaxed text-gray-800 max-w-2xl whitespace-pre-wrap">
                        {/* DYNAMIC BIO */}
                        {about.heroBio || "Bio not configured in CMS."}
                    </div>

                    <div className="mt-12 pt-8 border-t border-black/10 flex justify-between items-center font-mono text-xs">
                        <div>
                            <span className="text-gray-400 block mb-1">
                                {about.statusLabel || "CURRENT STATUS"}
                            </span>
                            <span className="text-green-600 animate-pulse uppercase">
                                ● {about.statusText || "OPEN FOR COLLABORATION"}
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* === SECTION 2: SERVICES === */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                <div>
                    <h3 className="font-mono text-xs uppercase tracking-widest mb-8 text-gray-400">
                        {about.servicesTitle || "[01] What I Do"}
                    </h3>
                    <p className="text-2xl font-medium leading-tight mb-8">
                        {about.servicesDescription || "I help brands and artists build digital identities that stand out."}
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {about.services && about.services.length > 0 ? (
                        about.services.map((service, i) => (
                            <div key={i} className="border-b border-black/10 pb-6 group">
                                <h4 className="text-xl font-bold mb-2 group-hover:pl-4 transition-all">{service.title}</h4>
                                <p className="text-gray-500 font-serif">{service.description}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-xs text-gray-400">No services configured.</p>
                    )}
                </div>
            </section>

            {/* === FOOTER NAVIGASI === */}
            <div className="mt-20 border-t border-black/10 pt-12 flex flex-col md:flex-row justify-between items-end gap-8">
                <div className="text-left">
                    <p className="font-mono text-xs text-gray-400 mb-2">{about.navPrevLabel || "RETURN"}</p>
                    <Link href="/" className="text-xl md:text-2xl font-medium hover:italic transition-all inline-block">
                        {about.navPrevText || "← Cover"}
                    </Link>
                </div>
                <div className="text-right">
                    <p className="font-mono text-xs text-gray-400 mb-2">{about.navNextLabel || "NEXT CHAPTER"}</p>
                    <Link href="/experiments" className="text-4xl md:text-6xl font-medium hover:italic transition-all inline-block">
                        {about.navNextText || "See Experiments →"}
                    </Link>
                </div>
            </div>
        </main>
    );
}