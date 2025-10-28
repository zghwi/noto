import { Folder, Home, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/~",
    icon: Home,
  },
  {
    title: "Files",
    url: "/~/files",
    icon: Folder,
  },
  {
    title: "Settings",
    url: "/~/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const r = pathname.split("/");
  let ppath = "";
  if (pathname == "/~") ppath = pathname;
  else ppath = "/"+r[1]+"/"+r[2];
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      ppath == item.url ? "bg-primary hover:bg-primary" : ""
                    }
                  >
                    <Link href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
