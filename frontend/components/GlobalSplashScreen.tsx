"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function GlobalSplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-opacity duration-500 ${
        !isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "linear-gradient(135deg, oklch(0.141 0.005 285.823) 0%, oklch(0.21 0.006 285.885) 100%)",
      }}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated glow effect */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-30 blur-3xl animate-pulse"
            style={{
              background: "radial-gradient(circle, oklch(0.541 0.281 293.009) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Logo with scale animation */}
        <div className="relative w-32 h-32 animate-[scaleIn_0.6s_ease-out]">
          <Image
            src="/logo_png.png"
            alt="Noto Logo"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        <div className="animate-[slideUp_0.6s_ease-out_0.4s_both]">
          <div className="flex gap-2">
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: "oklch(0.541 0.281 293.009)",
                animationDelay: "0ms",
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: "oklch(0.541 0.281 293.009)",
                animationDelay: "150ms",
              }}
            />
            <div
              className="w-2 h-2 rounded-full animate-bounce"
              style={{
                backgroundColor: "oklch(0.541 0.281 293.009)",
                animationDelay: "300ms",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}