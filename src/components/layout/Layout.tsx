import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function Layout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 p-4">
          <SidebarTrigger className="mb-4" />
          <Toaster position="bottom-right" />
          <Outlet />
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
