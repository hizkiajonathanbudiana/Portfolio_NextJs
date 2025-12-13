"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Helper to ensure Google Drive links are in preview mode
const getEmbedUrl = (url) => {
    if (!url) return "";
    let id = null;

    // Pattern 1: /file/d/ID
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match1) id = match1[1];

    // Pattern 2: id=ID (e.g. ?id=xxx or &id=xxx)
    if (!id) {
        const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (match2) id = match2[1];
    }

    if (id) {
        return `https://drive.google.com/file/d/${id}/preview`;
    }

    return url;
};

// KITA PISAH JADI KOMPONEN KECIL AGAR SETIAP ITEM PUNYA STATE SENDIRI
// Ini membuat satu project bisa dibuka tanpa menutup project lain (Smooth)
function ProjectItem({ project, index }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Fallback Media Logic
    const mediaList =
        project.media && project.media.length > 0
            ? project.media
            : project.image
                ? [{ url: project.image, type: "image" }]
                : [];

    const linksList = project.links || [];
    const currentMedia = mediaList[currentSlide];

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        // Reset slide ke 0 setiap kali dibuka (opsional, hapus baris ini kalau mau slide terakhir diingat)
        if (!isOpen) setCurrentSlide(0);
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev === mediaList.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setCurrentSlide((prev) => (prev === 0 ? mediaList.length - 1 : prev - 1));
    };

    return (
        <div className="border-b border-black/10">
            {/* 1. HEADER ROW */}
            <div
                onClick={toggleOpen}
                className={`
            group grid grid-cols-12 py-6 items-baseline cursor-pointer transition-all px-2 select-none
            ${isOpen
                        ? "bg-gray-50 text-black" // Warna saat aktif
                        : "hover:bg-gray-50" // Warna saat hover belum aktif
                    }
        `}
            >
                <div className="col-span-2 md:col-span-1 font-mono text-xs opacity-50">
                    {isOpen ? "[-]" : `0${index + 1}`}
                </div>
                <div className="col-span-8 md:col-span-8 text-xl md:text-5xl font-medium tracking-tight uppercase truncate pr-4">
                    {project.title}
                </div>
                <div className="col-span-2 md:col-span-3 text-right font-mono text-xs opacity-50 flex flex-col md:flex-row justify-end gap-2">
                    <span className="hidden md:inline">{project.category}</span>
                    <span className="hidden md:inline">—</span>
                    <span>{project.year}</span>
                </div>
            </div>

            {/* 2. EXPANDED CONTENT */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden bg-white"
                    >
                        <div className="p-4 md:p-8 lg:p-12 border-t border-black/5">
                            <div className="max-w-4xl mx-auto flex flex-col gap-8">
                                {/* A. MEDIA CAROUSEL */}
                                <div className="w-full">
                                    {mediaList.length > 0 ? (
                                        <div className="relative w-full aspect-video md:h-[600px] bg-[#f5f5f5] group flex items-center justify-center overflow-hidden border border-black/5">
                                            {/* Media Display */}
                                            {currentMedia.type === "video" ||
                                                currentMedia.url?.includes(".mp4") ||
                                                currentMedia.url?.includes("drive.google.com") ? (
                                                currentMedia.url?.includes("drive.google.com") ? (
                                                    <iframe
                                                        src={getEmbedUrl(currentMedia.url)}
                                                        className="w-full h-full border-0"
                                                        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
                                                        referrerPolicy="no-referrer"
                                                        title="Project Video"
                                                    />
                                                ) : (
                                                    <video
                                                        src={currentMedia.url}
                                                        controls
                                                        className="w-full h-full object-contain"
                                                    />
                                                )
                                            ) : (
                                                <Image
                                                    src={currentMedia.url}
                                                    alt="Project Media"
                                                    fill
                                                    className="w-full h-full object-contain"
                                                />
                                            )}

                                            {/* Nav Buttons (UPDATED STYLE) */}
                                            {mediaList.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={prevSlide}
                                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full z-10 
                            bg-white text-black border border-black 
                            hover:bg-black hover:text-white hover:border-white 
                            transition-all shadow-lg"
                                                    >
                                                        ←
                                                    </button>
                                                    <button
                                                        onClick={nextSlide}
                                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full z-10 
                            bg-white text-black border border-black 
                            hover:bg-black hover:text-white hover:border-white 
                            transition-all shadow-lg"
                                                    >
                                                        →
                                                    </button>
                                                    {/* Counter */}
                                                    <div className="absolute bottom-4 right-4 bg-black text-white text-[10px] px-2 py-1 font-mono uppercase tracking-wider">
                                                        Img {currentSlide + 1} / {mediaList.length}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="w-full h-[300px] bg-gray-100 flex items-center justify-center font-mono text-xs text-gray-400">
                                            NO MEDIA
                                        </div>
                                    )}
                                </div>

                                {/* B. LINKS SECTION */}
                                <div className="flex flex-col gap-2">
                                    {linksList.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex justify-between items-center px-4 py-3 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-all group"
                                        >
                                            <span>{link.text || "View Project"}</span>
                                            <span className="group-hover:translate-x-1 transition-transform">
                                                ↗
                                            </span>
                                        </a>
                                    ))}
                                    {linksList.length === 0 && (
                                        <span className="text-xs text-gray-400 italic">
                                            No External Link.
                                        </span>
                                    )}
                                </div>

                                {/* C. INFO & DESCRIPTION */}
                                <div className="flex flex-col gap-6">
                                    <div>
                                        <h2 className="text-3xl md:text-5xl font-medium uppercase tracking-tight mb-2">
                                            {project.title}
                                        </h2>
                                        <div className="flex gap-4 font-mono text-xs text-gray-500 uppercase tracking-widest">
                                            <span>{project.category}</span>
                                            <span>/</span>
                                            <span>{project.year}</span>
                                        </div>
                                    </div>

                                    <div className="prose prose-lg max-w-none">
                                        <p className="font-serif text-lg md:text-xl leading-relaxed whitespace-pre-wrap wrap-break-words text-gray-800">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ProjectsList({ projects }) {
    if (!projects || projects.length === 0) {
        return (
            <div className="py-20 text-center font-mono text-gray-400 border-t border-black/10">
                NO PROJECTS FOUND.
            </div>
        );
    }

    return (
        <div className="flex flex-col border-t border-black/10">
            {projects.map((project, index) => (
                <ProjectItem key={project._id} project={project} index={index} />
            ))}
        </div>
    );
}
