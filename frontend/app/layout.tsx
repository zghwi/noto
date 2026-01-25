"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import React, { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { GlobalSplashScreen } from "@/components/GlobalSplashScreen";

const inter = Inter({ subsets: ["latin"], weight: ["500"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<string>("dark");
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem("theme") || "system";

      if (savedTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        setTheme(systemTheme);
      } else {
        setTheme(savedTheme);
      }
    };

    handleThemeChange();

    window.addEventListener("themeChange", handleThemeChange);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme") === "system") {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleSystemChange);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
      mediaQuery.removeEventListener("change", handleSystemChange);
      clearTimeout(timer);
    };
  }, []);

  return (
    <html lang="en">
      <body className={`${theme === "dark" ? "dark" : ""} ${inter.className}`}>
        {showSplash && <GlobalSplashScreen />}
        <main>{children}</main>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}