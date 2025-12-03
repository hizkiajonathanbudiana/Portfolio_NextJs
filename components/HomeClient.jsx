'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Scene3D from './Scene3D';
import HeroOverlay from './HeroOverlay';

export default function HomeClient({ content }) {
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false);

    useEffect(() => {
        const handleScroll = (e) => {
            // SENSITIVITAS MACBOOK:
            // Ubah 50 jadi 15 biar trackpad dikit aja langsung pindah
            if (e.deltaY > 15 && !isNavigating) {
                setIsNavigating(true);
                router.push('/about');
            }
        };

        // Tambahkan { passive: false } biar browser ga nge-block event-nya
        window.addEventListener('wheel', handleScroll, { passive: false });

        return () => window.removeEventListener('wheel', handleScroll);
    }, [router, isNavigating]);

    return (
        <div className={`relative min-h-screen w-full overflow-hidden transition-opacity duration-700 ${isNavigating ? 'opacity-0' : 'opacity-100'}`}>
            {/* 3D Scene */}
            <Scene3D />

            {/* Text Overlay dari CMS */}
            <HeroOverlay content={content} />
        </div>
    );
}