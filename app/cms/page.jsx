'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function CMSDashboard() {
    const { data: session } = useSession();

    // Helper Card Component
    const DashboardCard = ({ number, icon, title, desc, href }) => (
        <Link href={href} className="group block bg-[#111] border border-[#333] p-6 hover:bg-white hover:text-black transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start mb-8 relative z-10">
                <span className="font-mono text-xs text-gray-500 group-hover:text-black font-bold">{number}</span>
                <span className="text-2xl grayscale group-hover:grayscale-0">{icon}</span>
            </div>
            <h3 className="font-bold text-lg mb-1 relative z-10 uppercase tracking-tight">{title}</h3>
            <p className="font-mono text-[10px] text-gray-500 group-hover:text-black/60 relative z-10 leading-relaxed">{desc}</p>
        </Link>
    );

    return (
        <div className="max-w-6xl pb-20">
            {/* HEADER DASHBOARD */}
            <div className="mb-12 border-b border-[#333] pb-6">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-2 text-white">
                    SYSTEM_OVERVIEW
                </h1>
                <h2 className="text-xl md:text-2xl font-mono text-gray-500 tracking-tight">
                    CONTENT MANAGEMENT SYSTEM
                </h2>
                <div className="flex items-center gap-3 font-mono text-xs mt-4">
                    <span className="text-gray-600">ACCESS_LEVEL:</span>
                    {session ? (
                        <span className="text-green-500 font-bold uppercase border border-green-900 bg-green-900/10 px-2 py-1">ADMINISTRATOR</span>
                    ) : (
                        <span className="text-yellow-500 font-bold uppercase border border-yellow-900 bg-yellow-900/10 px-2 py-1">READ ONLY GUEST</span>
                    )}
                </div>
            </div>

            {/* STATUS BANNER */}
            {!session && (
                <div className="bg-yellow-900/10 border border-yellow-600/50 p-6 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl text-yellow-500 select-none pointer-events-none">⚠</div>
                    <h3 className="text-yellow-500 font-bold mb-2 uppercase text-sm tracking-widest relative z-10">Showcase Mode Active</h3>
                    <p className="text-gray-400 text-xs font-mono leading-relaxed relative z-10 max-w-2xl">
                        You are exploring this CMS in <strong>Showcase Mode</strong>.
                        All features (Settings, Projects, Resume, Pages) are unlocked for visual inspection.
                        <br />
                        <span className="opacity-50">Write operations (Save/Delete) will be simulated and rejected by the server security layer.</span>
                    </p>
                </div>
            )}

            {/* DASHBOARD GRID */}
            <h3 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest">Page Editors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

                <DashboardCard
                    number="01"
                    icon="🏠"
                    title="Home / Cover"
                    desc="Edit Hero Text, Scroll Instructions & Corner Information."
                    href="/cms/home"
                />

                <DashboardCard
                    number="02"
                    icon="👨‍💻"
                    title="About Me"
                    desc="Manage Biography, Profile Image, and Service List."
                    href="/cms/about"
                />

                <DashboardCard
                    number="03"
                    icon="📂"
                    title="Projects"
                    desc="Add/Edit Portfolio Works, Upload Images & Descriptions."
                    href="/cms/projects"
                />

                <DashboardCard
                    number="04"
                    icon="📄"
                    title="Resume / CV"
                    desc="Manage Experience, Education, Skills & PDF Uploads."
                    href="/cms/resume"
                />

                <DashboardCard
                    number="05"
                    icon="✉️"
                    title="Contact Info"
                    desc="Update Email, Social Links, and Location details."
                    href="/cms/contact"
                />

            </div>

            <h3 className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest">System Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard
                    number="06"
                    icon="⚙️"
                    title="Global Config"
                    desc="Manage Navbar Logo, SEO Metadata Tags & Invite New Admins."
                    href="/cms/settings"
                />

                <DashboardCard
                    number="07"
                    icon="💾"
                    title="Backup / Sync"
                    desc="Download full Database backup as JSON file."
                    href="/cms/sync"
                />
            </div>

            {/* SERVER INFO */}
            <div className="mt-20 pt-6 border-t border-[#333] grid grid-cols-2 md:grid-cols-4 gap-8 font-mono text-[10px] text-gray-600 uppercase">
                <div>
                    <span className="block text-gray-400 mb-1">DATABASE</span>
                    <span className="text-white">MongoDB Atlas (Cloud)</span>
                </div>
                <div>
                    <span className="block text-gray-400 mb-1">FRAMEWORK</span>
                    <span className="text-white">Next.js 15 (App Router)</span>
                </div>
                <div>
                    <span className="block text-gray-400 mb-1">STORAGE</span>
                    <span className="text-white">Cloudinary (Assets)</span>
                </div>
                <div>
                    <span className="block text-gray-400 mb-1">SYSTEM STATUS</span>
                    <span className="text-green-500 animate-pulse">● ONLINE</span>
                </div>
            </div>

        </div>
    );
}