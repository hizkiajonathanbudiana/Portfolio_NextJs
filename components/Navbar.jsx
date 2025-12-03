'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// TERIMA PROPS: siteName & links
export default function Navbar({ siteName = "HIZKIA.WZ", links = [] }) {
    const pathname = usePathname();

    // Default Links + Logic CMS Button
    const navItems = links.length > 0 ? links : [
        { label: 'ABOUT', path: '/about' },
        { label: 'EXPERIMENTS', path: '/experiments' },
        { label: 'RESUME', path: '/resume' },
        { label: 'CONTACT', path: '/contact' },
    ];

    // Tambahkan CMS ke list navigation
    // Kita cek dulu biar ga duplikat kalau user nambahin manual di CMS setting
    const hasCMS = navItems.find(item => item.path === '/cms');
    const finalNavItems = hasCMS ? navItems : [...navItems, { label: 'CMS', path: '/cms' }];

    return (
        <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 bg-transparent">
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
                <Link href="/" className="text-2xl font-black tracking-tighter text-black hover:italic transition-all uppercase">
                    {siteName}
                </Link>

                <div className="hidden md:flex gap-8">
                    {finalNavItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`text-sm font-bold tracking-widest text-black transition-all decoration-1 underline-offset-4 uppercase ${isActive ? 'underline' : 'hover:underline'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <button className="md:hidden font-black border border-black px-2 text-black">
                    MENU
                </button>
            </div>
        </nav>
    );
}