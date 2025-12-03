'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; // Pastikan path import Navbar aslimu benar

export default function ConditionalNavbar({ siteName, links }) {
    const pathname = usePathname();

    // LOGIC: Jika url sedang di area CMS, jangan tampilkan Navbar Publik
    // Menggunakan startsWith biar kena ke /cms, /cms/about, /cms/settings, dll
    if (pathname && pathname.startsWith('/cms')) {
        return null;
    }

    // Jika bukan halaman CMS, tampilkan Navbar normal
    return <Navbar siteName={siteName} links={links} />;
}