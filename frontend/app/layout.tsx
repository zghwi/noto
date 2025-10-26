import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Noto",
  description: "Turn notes into interactive tools.",
  icons: {
    icon: "/favicon.png",
  },
};

const poppins = Poppins({ subsets: ['latin'], weight: ['600']})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`dark ${poppins.className}`}>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
