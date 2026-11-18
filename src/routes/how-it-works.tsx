import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, FileCheck2, MapPin, Search, ShieldCheck, Wallet } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How LogiFlow Works — From Search to Digital Receipt" },
      {
        name: "description",
        content:
          "See how LogiFlow moves a consignment: search verified fleets, book in three guided steps, track live status and download an audit-ready digital receipt.",
      },
      { property: "og:title", content: "How LogiFlow Works" },
      {
        property: "og:description",
        content: "Search, book in three steps, track live and settle with digital receipts.",
      },
    ],
  }),
  component: HowItWorks,
});

const FLOW = [
  {
    icon: Search,
    title: "1 · Discover the right fleet",
    body: "Filter the marketplace by pickup city, vehicle type and payload capacity. Every listing shows the base fare, per-kilometre rate, rating and completed trips so you can compare like for like.",
  },
  {
    icon: FileCheck2,
    title: "2 · Book in three guided steps",
    body: "Step one captures your route and pickup time. Step two records consignment details — goods type and weight. Step three shows the calculated fare estimate before you confirm.",
  },
  {
    icon: MapPin,
    title: "3 · Track every movement",
    body: "The owner accepts or declines from their dashboard. Once accepted, each status change is written to an immutable tracking trail you can follow to delivery.",
  },
  {
    icon: Wallet,
    title: "4 · Pay and archive",
    body: "Record the payment against the booking and LogiFlow issues a numbered digital receipt with subtotal, tax and total, stored permanently in your history.",
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden gradient-hero px-4 py-20 sm:px-6">
          <div className="absolute inset-0 grid-lines opacity-[0.08]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="font-display text-4xl font-extrabold text-primary-foreground sm:text-5xl">
              How LogiFlow works
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-primary-foreground/80">
              A single, transparent workflow from the first search to the archived receipt — for
              shippers and fleet owners alike.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <Stagger className="grid gap-6 md:grid-cols-2">
            {FLOW.map((s) => (
              <StaggerItem key={s.title}>
                <div className="h-full surface-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 text-lg font-bold">{s.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12">
            <div className="surface-card flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <ShieldCheck className="h-5 w-5 text-success" /> Verified on both sides
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Owners submit registration details and documents. Shippers operate under named
                  accounts. Every action is attributable.
                </p>
              </div>
              <Button variant="hero" size="lg" asChild>
                <Link to="/auth">
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
