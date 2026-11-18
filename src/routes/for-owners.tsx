import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Images, LineChart, ShieldCheck, ToggleRight } from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Counter, Reveal, Stagger, StaggerItem } from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/for-owners")({
  head: () => ({
    meta: [
      { title: "For Fleet Owners — List Trucks & Tempos on LogiFlow" },
      {
        name: "description",
        content:
          "List your trucks and tempos on LogiFlow, manage your fleet, accept booking requests and track earnings from one owner dashboard.",
      },
      { property: "og:title", content: "For Fleet Owners — LogiFlow" },
      {
        property: "og:description",
        content: "Register vehicles, accept requests and track earnings from one dashboard.",
      },
    ],
  }),
  component: ForOwners,
});

const BENEFITS = [
  { icon: Images, title: "Rich listings", body: "Upload multiple photographs and supporting documents so shippers book with confidence." },
  { icon: CalendarCheck, title: "Request inbox", body: "Every incoming booking lands in one queue — accept or decline in a single tap." },
  { icon: ToggleRight, title: "Availability control", body: "Take a vehicle off the marketplace during servicing and switch it back instantly." },
  { icon: LineChart, title: "Earnings clarity", body: "Confirmed revenue, pending payouts and trip volume in a live earnings dashboard." },
];

function ForOwners() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden gradient-hero px-4 py-20 sm:px-6">
          <div className="absolute inset-0 grid-lines opacity-[0.08]" />
          <div className="relative mx-auto max-w-5xl">
            <h1 className="max-w-2xl font-display text-4xl font-extrabold text-primary-foreground sm:text-5xl">
              Keep your fleet earning, not idling
            </h1>
            <p className="mt-4 max-w-xl text-primary-foreground/80">
              List once, get matched with vetted shippers, and run the whole operation from an owner
              dashboard built for real fleets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="highlight" size="lg" asChild>
                <Link to="/auth">
                  List your vehicle <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/how-it-works">See how it works</Link>
              </Button>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-6 border-t border-primary-foreground/10 pt-8 lg:grid-cols-4">
              {[
                { v: 82, s: "%", l: "Average utilisation" },
                { v: 9, s: " min", l: "Median response time" },
                { v: 1200, s: "+", l: "Active shippers" },
                { v: 0, s: "₹0", l: "Listing fee", zero: true },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-3xl font-extrabold text-primary-foreground">
                    {s.zero ? "₹0" : <Counter value={s.v} suffix={s.s} />}
                  </p>
                  <p className="mt-1 text-sm text-primary-foreground/70">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              Owner toolkit
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Everything in one dashboard</h2>
          </Reveal>

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2">
            {BENEFITS.map((b) => (
              <StaggerItem key={b.title}>
                <div className="h-full surface-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                    <b.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-bold">{b.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{b.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal className="mt-12">
            <div className="surface-card flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck className="h-5 w-5 text-success" />
                Verified owners get priority placement in search results.
              </p>
              <Button variant="hero" asChild>
                <Link to="/auth">Create owner account</Link>
              </Button>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
