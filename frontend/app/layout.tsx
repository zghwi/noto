import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Noto",
  description: "Turn notes into interactive tools.",
  icons: {
    icon: "/favicon.png",
  },
};

const inter = Inter({ subsets: ["latin"], weight: ["500"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark ${inter.className}`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
