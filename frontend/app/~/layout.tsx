"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { AppBottomBar } from "@/components/ui/app-bottom-bar";
import { AuthLoadingScreen } from "@/components/AuthLoadingScreen";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useIsMobile();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      redirect("/");
    }

    setIsClient(true);
  }, []);

  if (!isClient || isMobile === undefined) {
    return <AuthLoadingScreen />;
  }

  if (isMobile) {
    return (
      <div className="pb-16">
        <main className="w-full">
          <div className="px-6 py-4 max-w-7xl mx-auto">{children}</div>
        </main>
        <AppBottomBar />
      </div>
    );
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger className="m-2 sticky top-3 z-10" variant="outline" />
          <div className="px-6 py-4 max-w-7xl mx-auto">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}