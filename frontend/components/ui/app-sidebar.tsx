import { DoorOpen, File, Home, Plus, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const items = [
  {
    title: "Home",
    url: "/~",
    icon: Home,
  },
  {
    title: "Files",
    url: "/~/files",
    icon: File,
  },
  {
    title: "Settings",
    url: "/~/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>
            <Image src="/favicon.png" alt="noto" height={40} width={40} />
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={
                      pathname == item.url ? "bg-primary hover:bg-primary" : ""
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
