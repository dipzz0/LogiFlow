import { Link } from "@tanstack/react-router";
import { Truck, Linkedin, Twitter, Github, ArrowUpRight } from "lucide-react";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Find vehicles", to: "/vehicles" },
      { label: "How it works", to: "/how-it-works" },
      { label: "For fleet owners", to: "/for-owners" },
      { label: "Dashboard", to: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About LogiFlow", to: "/how-it-works" },
      { label: "Trust & safety", to: "/how-it-works" },
      { label: "Careers", to: "/how-it-works" },
      { label: "Contact", to: "/how-it-works" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground">
                <Truck className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-extrabold">LogiFlow</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-foreground/70">
              Enterprise-grade freight matching. Verified fleets, transparent pricing and live
              visibility on every consignment.
            </p>
            <div className="mt-5 flex gap-2">
              {[Linkedin, Twitter, Github].map((Icon, i) => (
                <span
                  key={i}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-ink-foreground/15 text-ink-foreground/70 transition-colors hover:border-ink-foreground/40 hover:text-ink-foreground"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-ink-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group inline-flex items-center gap-1 text-sm text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="text-sm font-semibold">Ship smarter this week</h3>
            <p className="mt-3 text-sm text-ink-foreground/70">
              Create an account and get matched with verified fleets in minutes.
            </p>
            <Link
              to="/auth"
              className="mt-4 inline-flex h-11 items-center justify-center rounded-xl gradient-primary px-5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Get started free
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-foreground/10 pt-6 text-xs text-ink-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} LogiFlow Technologies. All rights reserved.</p>
          <p className="flex gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Security</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
