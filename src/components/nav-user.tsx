import { useNavigate } from "react-router-dom"
import { LogOutIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { auth, logout } from "@/lib/firebase"

export function NavUser() {
  const navigate = useNavigate()
  const email = auth.currentUser?.email ?? ""

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="px-2 text-muted-foreground">{email}</span>
      <Separator />
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Odhlásit se" onClick={handleLogout}>
            <LogOutIcon />
            <span>Odhlásit se</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  )
}
