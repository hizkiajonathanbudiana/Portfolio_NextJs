import Providers from "../components/Providers";
import ConditionalNavbar from "../components/ConditionalNavbar";
import "./globals.css";
import { getSettings } from "../lib/data";

export async function generateMetadata() {
  const settings = await getSettings();
  const siteName = "ITSWEI";

  // Konfigurasi Base URL untuk fix warning metadataBase
  // Menggunakan environment variable atau fallback ke domain production
  const baseUrl = process.env.NEXTAUTH_URL
    ? process.env.NEXTAUTH_URL
    : "https://portfolio.itswei.com";

  return {
    metadataBase: new URL(baseUrl),

    title: {
      default: siteName,
      template: `%s · ${siteName}`,
    },
    description:
      "ITSWEI — Portfolio of Chen Weize (陳偉澤) / Hizkia Jonathan Budiana.",

    // Bagian 'icons' dihapus agar Next.js otomatis menggunakan file app/icon.png

    openGraph: {
      title: siteName,
      description:
        "ITSWEI — Portfolio of Chen Weize (陳偉澤) / Hizkia Jonathan Budiana.",
      url: "/",
      siteName: siteName,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: "/logo.png", // Pastikan ada file logo.png di folder public untuk fallback OpenGraph
          width: 800,
          height: 800,
          alt: "ITSWEI Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description:
        "ITSWEI — Portfolio of Chen Weize (陳偉澤) / Hizkia Jonathan Budiana.",
      images: ["/logo.png"],
    },
  };
}

export const revalidate = 60;

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className="antialiased bg-[#f0f0f0] text-[#111]">
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
