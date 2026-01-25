"use client";

import { Folder, Home, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Files",
    url: "/home/files",
    icon: Folder,
  },
  {
    title: "Settings",
    url: "/home/settings",
    icon: Settings,
  },
];

export function AppBottomBar() {
  const pathname = usePathname();
  const r = pathname.split("/");
  let ppath = "";
  if (pathname == "/home") ppath = pathname;
  else ppath = "/" + r[1] + "/" + r[2];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <nav className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {items.map((item) => {
          const isActive = ppath === item.url;
          return (
            <Link
              key={item.title}
              href={item.url}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
