"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// TERIMA PROPS: siteName & links
export default function Navbar({ siteName = "HIZKIA.WZ", links = [] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State untuk Menu Mobile

  // Default Links + Logic CMS Button
  const navItems =
    links.length > 0
      ? links
      : [
          { label: "ABOUT", path: "/about" },
          { label: "EXPERIMENTS", path: "/experiments" },
          { label: "RESUME", path: "/resume" },
          { label: "CONTACT", path: "/contact" },
        ];

  // Tambahkan CMS ke list navigation jika belum ada
  const hasCMS = navItems.find((item) => item.path === "/cms");
  const finalNavItems = hasCMS
    ? navItems
    : [...navItems, { label: "CMS", path: "/cms" }];

  return (
    <>
      {/* NAVBAR UTAMA */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-6 bg-transparent pointer-events-none">
        <div className="flex justify-between items-center w-full max-w-7xl mx-auto pointer-events-auto">
          {/* LOGO */}
          <Link
            href="/"
            className="text-2xl font-black tracking-tighter text-black hover:italic transition-all uppercase z-[101]"
          >
            {siteName}
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-8">
            {finalNavItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-bold tracking-widest text-black transition-all decoration-1 underline-offset-4 uppercase ${
                    isActive ? "underline" : "hover:underline"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* MOBILE TOGGLE BUTTON (FIXED) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden font-black border border-black bg-white px-3 py-1 text-black text-xs uppercase hover:bg-black hover:text-white transition-colors z-[101]"
          >
            {isOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </nav>

      {/* MOBILE FULLSCREEN MENU OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-[90] bg-[#f0f0f0] flex flex-col justify-center items-center md:hidden animate-in fade-in duration-200">
          <div className="flex flex-col gap-8 text-center">
            {finalNavItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setIsOpen(false)} // Tutup menu saat link diklik
                  className={`text-4xl font-black tracking-tighter uppercase transition-all ${
                    isActive
                      ? "text-black underline decoration-4 underline-offset-8"
                      : "text-gray-400 hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="absolute bottom-10 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
            {siteName} // NAVIGATION
          </div>
        </div>
      )}
    </>
  );
}
