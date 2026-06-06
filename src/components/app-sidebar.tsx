import { NavLink, useLocation } from "react-router-dom";
import {
  FileTextIcon,
  UsersIcon,
  UserIcon,
  LayoutDashboard,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import bLogo from "@/assets/b-logo.svg";

const navItems = [
  { title: "Přehled", url: "/", icon: LayoutDashboard, end: true },
  { title: "Smlouvy", url: "/contracts", icon: FileTextIcon, end: false },
  { title: "Klienti", url: "/clients", icon: UsersIcon, end: false },
  { title: "Poradci", url: "/advisors", icon: UserIcon, end: false },
];

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation();
  const { open } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row items-center gap-2 p-4">
        <img src={bLogo} alt="BLogic" className="size-6 shrink-0" />
        {open && <span className="font-semibold text-sm">Blogic CRM</span>}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigace</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={pathname === item.url}
                >
                  <NavLink
                    to={item.url}
                    end={item.end}
                    className={({ isActive }) =>
                      isActive ? "font-medium" : ""
                    }
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
