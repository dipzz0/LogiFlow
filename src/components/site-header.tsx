import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, Moon, Sun, Truck, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/vehicles", label: "Find vehicles" },
  { to: "/how-it-works", label: "How it works" },
  { to: "/for-owners", label: "For fleet owners" },
];

export function SiteHeader() {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const signOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border border-border/70 bg-card/70 px-4 py-2.5 shadow-lift backdrop-blur-2xl sm:flex sm:justify-between sm:px-5">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-glow">
            <Truck className="h-5 w-5" />
          </span>
          <span className="truncate font-display text-lg font-extrabold tracking-tight">
            Logi<span className="text-gradient">Flow</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "text-foreground bg-accent" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
              <Button variant="hero" size="sm" asChild>
                <Link to="/auth">Get started</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-7xl rounded-3xl border border-border bg-card/95 px-4 py-3 shadow-lift backdrop-blur-2xl lg:hidden">
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/dashboard" onClick={() => setOpen(false)}>
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" onClick={signOut}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" asChild>
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button variant="hero" className="flex-1" asChild>
                    <Link to="/auth" onClick={() => setOpen(false)}>
                      Get started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
