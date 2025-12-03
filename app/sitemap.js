import { getSettings } from '../lib/data';
// Import fetcher project jika mau halaman detail project masuk sitemap juga
// import { getProjects } from '../lib/data'; 

export default async function sitemap() {
    // 1. Base URL website kamu (bisa dari env atau hardcode)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hizkiaweize.com'; // Ganti domain nanti

    // 2. Data dinamis (misal last modified dari settings)
    const settings = await getSettings();
    const lastModified = settings.updatedAt || new Date();

    // 3. List Halaman Statis Utama
    const routes = [
        '',
        '/about',
        '/experiments',
        '/resume',
        '/contact',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: lastModified,
        changeFrequency: 'monthly',
        priority: route === '' ? 1 : 0.8, // Home prioritas 1, sisanya 0.8
    }));

    // 4. (Optional) Jika mau nambahin halaman detail project dinamis:
    /*
    const projects = await getProjects();
    const projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/experiments/${project.slug}`,
      lastModified: project.updatedAt,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
    */

    // Gabungkan semua route
    return [
        ...routes,
        // ...projectRoutes (uncomment kalo udah ada logic slug)
    ];
}