"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { ReactNode } from "react"
import {
  CalendarDays,
  ClipboardList,
  CreditCard,
  Home,
  LogOut,
  PlusCircle,
  Receipt,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { authClient, useSession } from "@/lib/auth-client"

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const ROLE_NAV: Record<string, NavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: Home },
    {
      label: "My bookings",
      href: "/dashboard/customer/bookings",
      icon: CalendarDays,
    },
    { label: "Payments", href: "/dashboard/customer/payments", icon: CreditCard },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: Home },
    { label: "Users", href: "/dashboard/admin/users", icon: Users },
    { label: "Services", href: "/dashboard/admin/services", icon: Wrench },
    { label: "Bookings", href: "/dashboard/admin/bookings", icon: CalendarDays },
    {
      label: "Transactions",
      href: "/dashboard/admin/transactions",
      icon: Receipt,
    },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: Home },
    {
      label: "Add a service",
      href: "/dashboard/technician/add-service",
      icon: PlusCircle,
    },
    { label: "My services", href: "/dashboard/technician/services", icon: Wrench },
    {
      label: "Repair requests",
      href: "/dashboard/technician/requests",
      icon: ClipboardList,
    },
  ],
}

function AppSidebar() {
  const { data: session, isPending } = useSession()
  const user = session?.user
  const pathname = usePathname()
  const router = useRouter()
  const { setOpenMobile } = useSidebar()

  const items = user ? ROLE_NAV[user.role] : undefined

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: { onSuccess: () => router.push("/") },
    })
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "?"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
       <Link 
        href="/"
       >
         <div  className="flex items-center gap-2.5 px-2 py-1.5">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
            <Wrench className="size-4" strokeWidth={2.4} />
          </span>
          <span className="text-base font-bold tracking-[-0.05em] group-data-[collapsible=icon]:hidden">
            Reparo<span className="text-[#8fb545]">.</span>
          </span>
        </div>
       </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isPending &&
                [0, 1, 2].map((i) => (
                  <SidebarMenuItem key={i}>
                    <div className="flex h-8 items-center gap-2 rounded-md px-2">
                      <Skeleton className="size-4 rounded-md" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  </SidebarMenuItem>
                ))}

              {!isPending &&
                items?.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={isActive}
                        tooltip={item.label}
                        onClick={() => setOpenMobile(false)}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {user && (
          <>
            <div className="flex items-center gap-3 rounded-md border border-sidebar-border bg-sidebar-accent px-2.5 py-2 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0">
              <Avatar className="size-9 shrink-0 group-data-[collapsible=icon]:size-8">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? ""}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-sidebar-foreground/70">
                  {user.email}
                </p>
                {user.role && (
                  <p className="mt-0.5 truncate text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
                    {user.role}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2 rounded-md p-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:justify-center"
            >
              <LogOut className="size-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">
                Sign out
              </span>
            </button>
          </>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4 md:px-6">
          <SidebarTrigger />
          <span className="text-sm font-medium text-muted-foreground">
            Dashboard
          </span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1 px-4 py-6 md:px-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
