import Link from "next/link";
import { getContact } from "../../lib/data";

export const revalidate = 0; // Biar update CMS langsung kelihat

export default async function Contact() {
  const contact = await getContact();

  return (
    <main className="min-h-screen pt-32 px-4 md:px-12 pb-12 bg-[#f0f0f0] text-[#111] flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <h1 className="text-6xl md:text-[10vw] leading-[0.8] font-medium tracking-tight mb-12 uppercase">
          <span
            dangerouslySetInnerHTML={{
              __html: contact.heading || "LET'S START<br/>A PROJECT.",
            }}
          />
        </h1>
      </div>

      {/* Bottom Grid Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-t border-black pt-8">
        {/* Kolom 1: Email (FIXED LAYOUT: Added break-all) */}
        <div className="md:col-span-4">
          <h3 className="font-mono text-xs text-gray-400 mb-4 uppercase">
            {contact.section1Title || "[01] Drop a line"}
          </h3>
          {/* PERBAIKAN DI SINI: Added 'break-all' agar tidak nabrak */}
          <a
            href={`mailto:${contact.email}`}
            className="text-2xl md:text-3xl font-medium underline decoration-1 underline-offset-4 hover:text-gray-600 transition-colors break-all block"
          >
            {contact.email || "email@example.com"}
          </a>
          <p className="mt-4 font-mono text-sm text-gray-500 max-w-xs">
            {contact.availability || "Available for freelance projects."}
          </p>
        </div>

        {/* Kolom 2: Socials */}
        <div className="md:col-span-4 mt-8 md:mt-0">
          <h3 className="font-mono text-xs text-gray-400 mb-4 uppercase">
            {contact.section2Title || "[02] On the web"}
          </h3>
          <div className="flex flex-col space-y-2">
            {contact.socials && contact.socials.length > 0 ? (
              contact.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  className="text-xl border-b border-black/10 pb-2 hover:pl-4 transition-all duration-300 flex justify-between group"
                >
                  <span>{social.platform}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                </a>
              ))
            ) : (
              <p className="text-sm text-gray-500">No socials added.</p>
            )}
          </div>
        </div>

        {/* Kolom 3: Timezone */}
        <div className="md:col-span-4 md:text-right mt-8 md:mt-0">
          <h3 className="font-mono text-xs text-gray-400 mb-4 uppercase">
            {contact.section3Title || "[03] Local Time"}
          </h3>
          <div className="text-4xl md:text-6xl font-mono">
            {contact.timezone || "GMT+8"}
          </div>
          <p className="font-mono text-xs mt-2 text-gray-500 uppercase">
            {contact.location || "TAIPEI, TAIWAN"}
          </p>
        </div>
      </div>

      {/* Footer Nav */}
      <div className="mt-20 border-t border-black/10 pt-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="text-left">
          <p className="font-mono text-xs text-gray-400 mb-2">
            {contact.navPrevLabel || "GO BACK"}
          </p>
          <Link
            href="/resume
                    "
            className="text-xl md:text-2xl font-medium hover:italic transition-all inline-block"
          >
            {contact.navPrevText || "← Resume"}
          </Link>
        </div>
        <div className="text-right">
          <p className="font-mono text-xs text-gray-400 mb-2">
            {contact.navNextLabel || "SYSTEM ACCESS"}
          </p>
          <Link
            href="/cms"
            className="text-4xl md:text-6xl font-medium hover:italic transition-all inline-block"
          >
            {contact.navNextText || "CMS Dashboard →"}
          </Link>
        </div>
      </div>
    </main>
  );
}
