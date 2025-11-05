"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      redirect("/");
    }
  }, []);
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <SidebarTrigger className="m-2" variant="outline" />
          <div className="px-6 py-4 max-w-7xl mx-auto">{children}</div>
        </main>
      </SidebarProvider>
    </div>
  );
}