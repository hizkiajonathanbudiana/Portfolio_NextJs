'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative flex flex-col border-3 border-brutal-black bg-brutal-white h-full"
    >
      {/* Image Container with Hover Effect */}
      <div className="relative h-64 w-full overflow-hidden border-b-3 border-brutal-black">
        <div className="absolute inset-0 bg-brutal-accent opacity-0 group-hover:opacity-20 z-10 transition-opacity duration-300"></div>
        <Image 
          src={project.image} 
          alt={project.title}
          fill
          className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110"
        />
        
        {/* Floating ID Tag */}
        <div className="absolute top-2 left-2 bg-brutal-black text-brutal-white px-2 py-1 text-xs font-mono z-20">
          PROJECT_{project.id.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-bold bg-brutal-accent/20 px-2 py-1 border border-brutal-black">
              {project.category}
            </span>
            <span className="text-xs font-mono text-gray-500">
              [{project.year}]
            </span>
          </div>
          <h3 className="text-2xl font-black leading-tight mb-2 group-hover:text-brutal-accent transition-colors">
            {project.title}
          </h3>
          <p className="text-sm font-mono leading-relaxed text-gray-600">
            {project.description}
          </p>
        </div>

        <a 
          href={project.link}
          className="mt-4 w-full py-3 text-center border-2 border-brutal-black font-bold uppercase hover:bg-brutal-black hover:text-brutal-white transition-all shadow-[4px_4px_0px_0px_rgba(10,10,10,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          View Case Study
        </a>
      </div>
    </motion.div>
  );
}