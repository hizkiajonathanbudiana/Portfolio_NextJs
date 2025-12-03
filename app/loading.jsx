'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulasi loading 0% -> 100%
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 10) + 1; // Random increment biar natural
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f0f0f0] flex flex-col justify-between p-6 md:p-12 text-black">
      {/* Top Corners */}
      <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
        <span>System_Boot</span>
        <span>v2.5.0</span>
      </div>

      {/* Center Counter */}
      <div className="flex flex-col items-center">
        <div className="text-[15vw] leading-none font-medium tracking-tighter">
          {progress}%
        </div>
        <div className="w-64 h-[1px] bg-black/20 mt-4 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-black transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Bottom Corners */}
      <div className="flex justify-between font-mono text-xs uppercase tracking-widest">
        <span>Loading Assets...</span>
        <span>Please Wait</span>
      </div>
    </div>
  );
}