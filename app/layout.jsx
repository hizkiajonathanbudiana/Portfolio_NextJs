import Providers from "../components/Providers";
import ConditionalNavbar from "../components/ConditionalNavbar";
import "./globals.css";
import { getSettings } from "../lib/data";

export async function generateMetadata() {
  const settings = await getSettings();

  const siteName = "ITSWEI";

  return {
    title: {
      default: siteName,
      template: `%s · ${siteName}`,
    },
    description:
      "ITSWEI — Portfolio of Chen Weize (陳偉澤) / Hizkia Jonathan Budiana.",
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: siteName,
      description:
        "ITSWEI — Portfolio of Chen Weize (陳偉澤) / Hizkia Jonathan Budiana.",
      url: "https://portfolio.itswei.com",
      siteName: siteName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description:
        "ITSWEI — Portfolio of Chen Weize (陳偉澤) / Hizkia Jonathan Budiana.",
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
          <ConditionalNavbar siteName="ITSWEI" links={settings.navbarLinks} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
