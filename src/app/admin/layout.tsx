"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Car,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/vehicules", label: "Véhicules", icon: Car },
  { href: "/admin/leads", label: "Leads", icon: MessageSquare },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't apply admin layout to login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between bg-neutral-900 text-white p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-red-600 text-white text-sm font-bold">
            TM
          </div>
          <span className="font-semibold">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Menu">
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "block" : "hidden"
          } lg:block w-64 bg-neutral-900 text-white min-h-screen fixed lg:sticky top-0 z-40`}
        >
          <div className="p-6 hidden lg:block">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-600 text-white font-bold text-lg">
                TM
              </div>
              <div>
                <span className="font-bold">TM AUTO</span>
                <span className="font-light text-red-400 ml-1">Admin</span>
              </div>
            </div>
          </div>

          <nav className="px-3 py-4 space-y-1">
            {ADMIN_NAV.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-red-600 text-white"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-neutral-800">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 text-neutral-400 hover:text-white hover:bg-neutral-800"
                asChild
              >
                <Link href="/" target="_blank">
                  Voir le site
                </Link>
              </Button>
              <form action="/api/auth/signout" method="POST">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-neutral-400 hover:text-white hover:bg-neutral-800"
                  type="submit"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
