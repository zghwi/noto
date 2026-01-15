"use client";

import Image from "next/image";

export function AuthLoadingScreen() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
      style={{
        background: "linear-gradient(135deg, oklch(0.141 0.005 285.823) 0%, oklch(0.21 0.006 285.885) 100%)",
      }}
    >
      <div className="relative flex flex-col items-center gap-6">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{
              background: "radial-gradient(circle, oklch(0.541 0.281 293.009) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative w-24 h-24 animate-pulse">
          <Image
            src="/logo_png.png"
            alt="Noto Logo"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin"
            style={{
              borderColor: "oklch(0.541 0.281 293.009)",
              borderTopColor: "transparent",
            }}
          />
        </div>
      </div>
    </div>
  );
}