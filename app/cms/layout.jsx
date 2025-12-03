'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function CMSLayout({ children }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    // MENU STRUCTURE UPDATED (No 'Page Content', Added Specific Pages)
    const menu = [
        { name: 'Dashboard', path: '/cms' },
        { name: 'Global Settings', path: '/cms/settings' },

        // --- PAGE EDITORS ---
        { name: 'Home / Cover', path: '/cms/home' },
        { name: 'About Me', path: '/cms/about' },
        { name: 'Projects', path: '/cms/projects' },
        { name: 'Resume / CV', path: '/cms/resume' },
        { name: 'Contact Info', path: '/cms/contact' },

        // --- SYSTEM ---
        { name: 'System Backup', path: '/cms/sync' },
    ];

    return (
        <div className="min-h-screen bg-[#111] text-[#f0f0f0] font-mono flex flex-col md:flex-row pt-20 md:pt-0">

            {/* SIDEBAR */}
            <aside className="w-full md:w-64 border-r border-[#333] p-6 flex flex-col justify-between md:h-screen md:fixed top-0 left-0 bg-[#111] z-50">
                <div>
                    {/* BUTTON: BACK TO WEBSITE */}
                    <div className="mb-6">
                        <Link
                            href="/"
                            className="text-xs font-bold text-gray-500 hover:text-white flex items-center gap-2 transition-colors uppercase"
                        >
                            ← Back to Website
                        </Link>
                    </div>

                    <div className="mb-8 pb-4 border-b border-[#333]">
                        <h2 className="text-xl font-bold tracking-tighter">CMS_PANEL</h2>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${session ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                            {session ? `ADMIN: ${session.user.name || 'User'}` : 'MODE: GUEST VIEW'}
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menu.map(item => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`block px-4 py-2 border-l-2 transition-all text-sm mb-1 ${pathname === item.path
                                        ? 'bg-[#222] border-white text-white font-bold'
                                        : 'border-transparent text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="pt-4 border-t border-[#333]">
                    {session ? (
                        <button
                            onClick={() => signOut()}
                            className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-900/10 text-xs uppercase transition-colors"
                        >
                            [ Logout System ]
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            className="block w-full text-center px-4 py-3 bg-[#f0f0f0] text-black font-bold text-xs uppercase hover:bg-gray-300 transition-colors"
                        >
                            Login as Admin
                        </Link>
                    )}
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 md:ml-64 p-6 md:p-12 bg-[#0a0a0a] min-h-screen">
                {children}
            </main>
        </div>
    );
}