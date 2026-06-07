import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

export default function Layout() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) navigate("/login");
      setChecking(false);
    });
    return unsubscribe;
  }, [navigate]);

  if (checking) return null;

  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 min-w-0 p-4">
          <SidebarTrigger className="mb-4" />
          <Toaster position="bottom-right" />
          <Outlet />
        </main>
      </SidebarProvider>
    </TooltipProvider>
  );
}
