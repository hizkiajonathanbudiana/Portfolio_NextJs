import Providers from '../components/Providers';
import ConditionalNavbar from '../components/ConditionalNavbar';
import './globals.css';
import { getSettings } from '../lib/data';

// --- FITUR 1: DYNAMIC METADATA (SEO) ---
// Fungsi ini dijalankan Next.js sebelum render untuk set <title> dan <meta>
export async function generateMetadata() {
  const settings = await getSettings();

  const siteName = settings?.siteName || 'HIZKIA.WZ';

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`, // Hasil: "About | HIZKIA.WZ"
    },
    description: 'Interaction Designer & Developer Portfolio',
    icons: {
      icon: '/favicon.ico',
    },
    // OpenGraph untuk Share Link (WA/Twitter/FB)
    openGraph: {
      title: siteName,
      description: 'Interaction Designer Portfolio',
      url: 'https://hizkiaweize.com', // Ganti dengan domain aslimu nanti
      siteName: siteName,
      locale: 'en_US',
      type: 'website',
    },
  };
}

// Revalidate data setiap 60 detik
export const revalidate = 60;

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body className="antialiased bg-[#f0f0f0] text-[#111]">
        <Providers>

          {/* FITUR 3: NAVBAR HILANG DI CMS */}
          {/* Logic sembunyi ada di dalam component ini */}
          <ConditionalNavbar
            siteName={settings.siteName}
            links={settings.navbarLinks}
          />

          {children}
        </Providers>
      </body>
    </html>
  );
}