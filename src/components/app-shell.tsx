import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  LayoutDashboard,
  LogOut,
  Moon,
  Package,
  Receipt,
  Search,
  Sun,
  Truck,
  User2,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";

const CUSTOMER_NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/vehicles", label: "Find vehicles", icon: Search },
  { to: "/bookings", label: "My bookings", icon: Package },
  { to: "/receipts", label: "Receipts", icon: Receipt },
  { to: "/profile", label: "Profile", icon: User2 },
];

const OWNER_NAV = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/fleet", label: "My fleet", icon: Truck },
  { to: "/requests", label: "Requests", icon: Bell },
  { to: "/earnings", label: "Earnings", icon: Wallet },
  { to: "/profile", label: "Profile", icon: User2 },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { role, user } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const nav = role === "owner" ? OWNER_NAV : CUSTOMER_NAV;

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const NavLinks = () => (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-primary-soft text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto flex max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-sidebar px-4 py-5 lg:flex">
          <Link to="/" className="flex items-center gap-2.5 px-1.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
              <Truck className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-extrabold">LogiFlow</span>
          </Link>

          <p className="mt-8 px-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {role === "owner" ? "Fleet owner" : "Shipper"}
          </p>
          <div className="mt-3 flex-1">
            <NavLinks />
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="truncate text-xs text-muted-foreground">Signed in as</p>
            <p className="mt-0.5 truncate text-sm font-semibold">{user?.email}</p>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={signOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <span className="truncate font-display text-base font-bold">
                {nav.find((n) => n.to === pathname)?.label ?? "LogiFlow"}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:inline-flex" asChild>
                <Link to="/">Back to site</Link>
              </Button>
            </div>
          </header>

          {open && (
            <div className="border-b border-border bg-background px-4 py-3 lg:hidden">
              <NavLinks />
              <Button variant="outline" size="sm" className="mt-3 w-full" onClick={signOut}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </div>
          )}

          <main className="px-4 py-6 sm:px-6 sm:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
