"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"], weight: ["500"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [theme, setTheme] = useState<string>("dark");

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem("theme") || "system";
      
      if (savedTheme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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

    return () => {
      window.removeEventListener("themeChange", handleThemeChange);
      mediaQuery.removeEventListener("change", handleSystemChange);
    };
  }, []);

  return (
    <html lang="en">
      <body className={`${theme === "dark" ? "dark" : ""} ${inter.className}`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
