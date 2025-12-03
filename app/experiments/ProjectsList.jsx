'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function ProjectsList({ projects }) {
    const [expandedId, setExpandedId] = useState(null);

    const toggleProject = (id) => {
        if (expandedId === id) setExpandedId(null);
        else setExpandedId(id);
    };

    if (projects.length === 0) {
        return <div className="py-12 text-center font-mono text-gray-500">NO PROJECTS FOUND IN DATABASE.</div>;
    }

    return (
        <div className="flex flex-col border-t border-black/10">
            {projects.map((project) => (
                <div key={project._id} className="border-b border-black/10">
                    {/* Clickable Row */}
                    <div
                        onClick={() => toggleProject(project._id)}
                        className="group grid grid-cols-12 py-6 items-baseline cursor-pointer hover:bg-white transition-colors px-2 select-none"
                    >
                        {/* Toggle Icon */}
                        <div className="col-span-2 md:col-span-1 font-mono text-xs text-gray-400 group-hover:text-black">
                            {expandedId === project._id ? '[-]' : '[+]'}
                        </div>

                        {/* Project Title */}
                        <div className="col-span-8 md:col-span-8 text-xl md:text-4xl font-medium tracking-tight uppercase">
                            {project.title}
                        </div>

                        {/* Year */}
                        <div className="col-span-2 md:col-span-3 text-right font-mono text-xs text-gray-400 group-hover:text-black">
                            {project.year}
                        </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                        {expandedId === project._id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                className="overflow-hidden bg-white"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4 md:p-8">
                                    {/* Project Image */}
                                    <div className="md:col-span-8 relative h-[300px] md:h-[400px] w-full bg-gray-100 border border-black/5">
                                        <Image
                                            src={project.image || "https://placehold.co/800x400"}
                                            alt={project.title}
                                            fill
                                            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                                        />
                                    </div>

                                    {/* Description & Category */}
                                    <div className="md:col-span-4 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-mono text-xs uppercase mb-2 text-gray-400">Category</h4>
                                            <p className="font-mono text-sm mb-6 border-b border-black/10 pb-2 inline-block">
                                                {project.category}
                                            </p>

                                            <h4 className="font-mono text-xs uppercase mb-4 text-gray-400">Description</h4>
                                            <p className="font-serif text-lg leading-relaxed whitespace-pre-wrap text-gray-800">
                                                {project.description}
                                            </p>
                                        </div>

                                        <div className="mt-8">
                                            <button className="px-6 py-3 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors w-full md:w-auto">
                                                View Case Study
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}