import Providers from "../components/Providers";
import ConditionalNavbar from "../components/ConditionalNavbar";
import "./globals.css";
import { getSettings } from "../lib/data";

export async function generateMetadata() {
  const settings = await getSettings();
  const siteName = "ITSWEI";

  // Hard focus on names in the title for SEO ranking
  const masterTitle = "Chen Weize (Hizkia Jonathan Budiana) — ITSWEI Portfolio";

  const baseUrl = process.env.NEXTAUTH_URL
    ? process.env.NEXTAUTH_URL
    : "https://portfolio.itswei.com";

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: masterTitle, // Nama kamu sekarang jadi title utama halaman Home
      template: `%s · ${siteName}`, // Halaman lain tetap rapi: "Projects · ITSWEI"
    },

    description:
      "The professional portfolio of Chen Weize (陳偉澤), also known as Hizkia Jonathan Budiana. Interaction Design student at NTUT and Full Stack Developer.",

    keywords: [
      "Chen Weize",
      "Hizkia Jonathan Budiana",
      "陳偉澤",
      "ITSWEI",
      "NTUT Interaction Design",
      "Web Developer Taiwan",
      "Portfolio",
    ],

    authors: [{ name: "Chen Weize", url: baseUrl }],

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title: masterTitle,
      description:
        "ITSWEI — Portfolio of Chen Weize (陳偉澤) / Hizkia Jonathan Budiana.",
      url: "/",
      siteName: siteName,
      locale: "en_US",
      type: "profile", // Ganti website jadi profile untuk personal branding
      firstName: "Chen",
      lastName: "Weize",
      username: "itswei",
      images: [
        {
          url: "/logo.png",
          width: 800,
          height: 800,
          alt: "Chen Weize (ITSWEI) Profile",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: masterTitle,
      description:
        "ITSWEI — Portfolio of Chen Weize (陳偉澤) / Hizkia Jonathan Budiana.",
      images: ["/logo.png"],
    },
  };
}

export const revalidate = 60;

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  const baseUrl = process.env.NEXTAUTH_URL || "https://portfolio.itswei.com";

  // Structured Data for Google Rich Results (Knowledge Graph)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hizkia Jonathan Budiana",
    alternateName: ["Chen Weize", "陳偉澤", "ITSWEI"],
    url: baseUrl,
    image: `${baseUrl}/logo.png`,
    jobTitle: "Interaction Design Student & Developer",
    worksFor: {
      "@type": "Organization",
      name: "National Taipei University of Technology",
    },
    sameAs: [
      "https://github.com/itswei",
      "https://instagram.com/itswei__shop",
      "https://portfolio.itswei.com",
    ],
  };

  return (
    <html lang="en">
      <body className="antialiased bg-[#f0f0f0] text-[#111]">
        {/* Inject JSON-LD directly into body for crawler visibility */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <Providers>
          <ConditionalNavbar
            siteName={settings.siteName || "ITSWEI"}
            links={settings.navbarLinks}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
