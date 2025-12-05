"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Scene3D from "./Scene3D";
import HeroOverlay from "./HeroOverlay";

export default function HomeClient({ content }) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  // Refs untuk menyimpan posisi touch (untuk swipe detection)
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  // Navigasi Function
  const triggerNavigation = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      router.push("/about");
    }
  };

  useEffect(() => {
    // --- 1. HANDLE MOUSE WHEEL (DESKTOP) ---
    const handleWheel = (e) => {
      // SENSITIVITAS MACBOOK / MOUSE:
      // DeltaY > 15 untuk menghindari trigger yang terlalu sensitif
      if (e.deltaY > 15) {
        triggerNavigation();
      }
    };

    // --- 2. HANDLE TOUCH SWIPE (MOBILE) ---
    const handleTouchStart = (e) => {
      touchStartY.current = e.changedTouches[0].screenY;
    };

    const handleTouchEnd = (e) => {
      touchEndY.current = e.changedTouches[0].screenY;
      handleSwipe();
    };

    const handleSwipe = () => {
      const distance = touchStartY.current - touchEndY.current;
      const threshold = 50; // Minimal jarak swipe pixel agar dianggap scroll

      // Jika jarak swipe ke atas (start > end) lebih besar dari threshold
      if (distance > threshold) {
        triggerNavigation();
      }
    };

    // --- REGISTER EVENTS ---
    // Passive: false penting agar kita bisa kontrol behavior scroll jika perlu
    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    // --- CLEANUP ---
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isNavigating, router]);

  return (
    <div
      className={`relative min-h-screen w-full overflow-hidden transition-opacity duration-1000 ease-in-out ${
        isNavigating ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 3D Scene */}
      <Scene3D />

      {/* Text Overlay dari CMS */}
      <HeroOverlay content={content} />
    </div>
  );
}
