import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Clock,
  FileCheck2,
  Gauge,
  MapPin,
  Quote,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Wallet,
} from "lucide-react";

import heroImage from "@/assets/hero-dock.jpg";
import routeNight from "@/assets/route-night.jpg";
import ownerTablet from "@/assets/owner-tablet.jpg";
import cargoBay from "@/assets/cargo-bay.jpg";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  Counter,
  Marquee,
  Parallax,
  Reveal,
  ScrollProgressBar,
  Stagger,
  StaggerItem,
} from "@/components/motion-primitives";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CITIES, VEHICLE_TYPES } from "@/lib/logiflow";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LogiFlow — Book Verified Trucks & Tempos On Demand" },
      {
        name: "description",
        content:
          "LogiFlow is the enterprise logistics marketplace connecting shippers with verified truck and tempo owners. Transparent pricing, live tracking and digital receipts.",
      },
      { property: "og:title", content: "LogiFlow — Book Verified Trucks & Tempos On Demand" },
      {
        property: "og:description",
        content:
          "Match with verified fleets in minutes. Transparent pricing, live tracking, digital receipts.",
      },
    ],
  }),
  component: LandingPage,
});

const STATS = [
  { value: 18500, suffix: "+", label: "Verified vehicles" },
  { value: 240, suffix: "K", label: "Shipments moved" },
  { value: 99.2, suffix: "%", label: "On-time delivery", decimals: 1 },
  { value: 320, suffix: "+", label: "Cities covered" },
];

const ROUTES = [
  "Mumbai → Pune",
  "Delhi → Jaipur",
  "Bengaluru → Chennai",
  "Ahmedabad → Surat",
  "Kolkata → Ranchi",
  "Hyderabad → Nagpur",
  "Kochi → Coimbatore",
];

const STEPS = [
  {
    icon: Search,
    title: "Search & compare",
    body: "Filter by city, vehicle type and payload. Compare verified fleets with transparent per-km pricing.",
  },
  {
    icon: FileCheck2,
    title: "Book in 3 steps",
    body: "Enter route, confirm consignment details, review your fare estimate and place the request.",
  },
  {
    icon: MapPin,
    title: "Track to delivery",
    body: "Live status updates from acceptance to delivery, with a digital receipt issued automatically.",
  },
];

const REASONS = [
  { icon: ShieldCheck, title: "Verified fleets only", body: "Every vehicle carries validated registration and document checks before it can be listed." },
  { icon: Wallet, title: "Transparent pricing", body: "Base fare plus per-km rate. No surge, no hidden handling charges at drop-off." },
  { icon: Gauge, title: "Built for scale", body: "From a single tempo run to a hundred containers a week — the same fast workflow." },
  { icon: Clock, title: "Minutes, not days", body: "Requests reach owner dashboards instantly. Most bookings are accepted in under 9 minutes." },
  { icon: Boxes, title: "Every load type", body: "Mini trucks, tempos, trailers and refrigerated cold chain, all in one marketplace." },
  { icon: BadgeCheck, title: "Audit-ready records", body: "Digital receipts, payment history and a full tracking trail for every consignment." },
];

const TESTIMONIALS = [
  {
    quote:
      "We cut our dispatch planning from three hours to twenty minutes. The owner acceptance rate on LogiFlow is unlike anything we saw with brokers.",
    name: "Ananya Rao",
    role: "Head of Supply Chain, Marut Foods",
  },
  {
    quote:
      "My four tempos used to idle two days a week. Since listing on LogiFlow, utilisation is above 80% and payouts are predictable.",
    name: "Imran Shaikh",
    role: "Fleet owner, Pune",
  },
  {
    quote:
      "The receipts and tracking trail made our quarterly audit effortless. Finance signs off without chasing anyone for paperwork.",
    name: "Deepak Menon",
    role: "Finance Controller, Nordwell Retail",
  },
];

const FAQS = [
  {
    q: "How quickly can I get a vehicle assigned?",
    a: "Most requests are accepted within 9 minutes during working hours. You will see the status change on your dashboard the moment an owner responds.",
  },
  {
    q: "How is the fare calculated?",
    a: "Each vehicle lists a base fare and a per-kilometre rate. Your estimate is base fare plus distance times the per-km rate, shown before you confirm the booking.",
  },
  {
    q: "What does verification involve for fleet owners?",
    a: "Owners upload registration details, vehicle photographs and supporting documents. Listings become bookable once those details are on file.",
  },
  {
    q: "Can I manage more than one vehicle?",
    a: "Yes. The owner dashboard supports an unlimited fleet with per-vehicle availability toggles, booking requests and an earnings view.",
  },
  {
    q: "Do I get an invoice for accounting?",
    a: "A digital receipt with a unique receipt number, subtotal, tax and total is generated for every completed booking and stored in your history.",
  },
];

const EARNINGS_BARS = [34, 52, 70, 46, 88, 62];

function LandingPage() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  const search = () => {
    navigate({ to: "/vehicles", search: { city: city || undefined, type: type || undefined } });
  };

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgressBar />
      <SiteHeader />

      <main>
        {/* HERO — cinematic dock + bento command center */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt="Cargo trucks backed into loading dock bays at dusk under warm sodium lamps"
              width={1920}
              height={1200}
              className="h-full w-full object-cover opacity-40"
            />
            <div className="absolute inset-0 gradient-hero opacity-90" />
            <div className="absolute inset-0 grid-lines opacity-[0.06]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
          </div>

          <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-16 sm:px-6 sm:pb-24 sm:pt-24 lg:grid-cols-12">
            {/* Left column */}
            <div className="flex flex-col justify-center lg:col-span-7">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 backdrop-blur"
              >
                <span className="ember-dot h-2 w-2 rounded-full bg-primary" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Live in 320+ cities
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.08 }}
                className="mt-7 font-display text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl"
              >
                Freight,
                <br />
                <span className="text-gradient">re-engineered.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.16 }}
                className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                Book verified trucks and tempos on demand, watch every consignment move live, and
                settle with audit-ready digital receipts — from one command center.
              </motion.p>

              {/* SEARCH BAR */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.24 }}
                className="mt-9 rounded-3xl border border-border bg-card/90 p-3 shadow-lift backdrop-blur-xl"
              >
                <div className="grid gap-3 md:grid-cols-[1.2fr_1.2fr_auto]">
                  <label className="flex min-w-0 items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    <span className="sr-only">Pickup city</span>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium outline-none"
                    >
                      <option value="">Pickup city</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex min-w-0 items-center gap-3 rounded-2xl bg-muted px-4 py-3">
                    <Truck className="h-4 w-4 shrink-0 text-primary" />
                    <span className="sr-only">Vehicle type</span>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-transparent text-sm font-medium outline-none"
                    >
                      <option value="">Any vehicle type</option>
                      {VEHICLE_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <Button variant="hero" size="lg" onClick={search} className="md:px-8">
                    <Search className="h-4 w-4" />
                    Search fleets
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.34 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <Button variant="highlight" size="lg" asChild>
                  <Link to="/auth">
                    Start shipping <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="glass" size="lg" asChild>
                  <Link to="/for-owners">List your vehicle</Link>
                </Button>
              </motion.div>
            </div>

            {/* Right bento column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="grid min-h-[520px] grid-cols-2 gap-4 lg:col-span-5"
            >
              {/* Live tracking card */}
              <div className="bento-card ember-glow col-span-2 flex flex-col p-6">
                <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                      Active shipments
                    </p>
                    <h3 className="mt-1 truncate text-xl font-bold">Real-time pulse</h3>
                  </div>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border bg-background">
                    <Boxes className="h-5 w-5" />
                  </span>
                </div>

                <div className="relative mt-4 flex-1 overflow-hidden rounded-3xl border border-border bg-background">
                  <img
                    src={routeNight}
                    alt="Aerial view of a cargo truck on a highway at night"
                    loading="lazy"
                    width={1200}
                    height={1200}
                    className="h-full w-full object-cover opacity-55"
                  />
                  <div className="scanline absolute inset-x-0 top-1/2 h-px" />
                  <div className="scanline absolute inset-y-0 left-1/2 w-px rotate-90 origin-center" />
                  <motion.span
                    className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-glow"
                    animate={{ scale: [1, 1.6, 1], opacity: [1, 0.55, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <span className="absolute bottom-2 right-3 font-mono text-[10px] text-muted-foreground">
                    TRK-9021-X
                  </span>
                </div>
              </div>

              {/* Earnings card */}
              <div className="bento-card flex flex-col p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Owner earnings
                </p>
                <h4 className="mt-1 font-display text-2xl font-bold">
                  ₹<Counter value={12.4} decimals={1} suffix="L" />
                </h4>
                <div className="mt-auto flex h-20 items-end gap-1.5 pt-4">
                  {EARNINGS_BARS.map((h, i) => (
                    <motion.span
                      key={i}
                      className="flex-1 rounded-sm bg-primary"
                      style={{ opacity: 0.3 + (h / 100) * 0.7 }}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.7, delay: 0.4 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </div>
              </div>

              {/* Fleet card */}
              <Link
                to="/for-owners"
                className="group relative flex flex-col justify-between overflow-hidden rounded-4xl gradient-primary p-6 text-primary-foreground shadow-glow transition-transform duration-500 hover:rotate-1"
              >
                <Truck className="h-8 w-8" />
                <div>
                  <h4 className="font-display text-lg font-bold leading-tight">
                    Manage
                    <br />
                    fleet
                  </h4>
                  <p className="mt-1 text-xs opacity-85">
                    <Counter value={24} /> online now
                  </p>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* STATS */}
          <div className="relative border-t border-border">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <Reveal key={s.label} delay={i * 0.08}>
                  <p className="font-display text-3xl font-bold sm:text-4xl">
                    <Counter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ROUTE MARQUEE */}
        <section className="border-y border-border bg-card/40">
          <Marquee items={ROUTES} />
        </section>

        {/* CATEGORIES */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Vehicle categories
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              The right vehicle for every consignment
            </h2>
            <p className="mt-4 text-muted-foreground">
              From last-mile tempos to 40-tonne trailers and temperature-controlled cold chain.
            </p>
          </Reveal>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {VEHICLE_TYPES.map((t) => (
              <StaggerItem key={t.value}>
                <Link
                  to="/vehicles"
                  search={{ type: t.value }}
                  className="group block h-full bento-card p-7"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary transition-transform duration-500 group-hover:scale-110">
                    <Truck className="h-6 w-6" />
                  </span>
                  <h3 className="mt-6 text-lg font-bold">{t.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    Browse
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        {/* SPLIT IMAGE / HOW IT WORKS */}
        <section className="border-y border-border bg-card/30 py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Reveal>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  How it works
                </p>
                <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                  Three steps from request to receipt
                </h2>
              </Reveal>

              <Stagger className="mt-10 space-y-4">
                {STEPS.map((step, i) => (
                  <StaggerItem key={step.title}>
                    <div className="bento-card grid grid-cols-[auto_minmax(0,1fr)] gap-4 p-6">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground">
                        <step.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] text-primary">0{i + 1}</p>
                        <h3 className="mt-0.5 text-lg font-bold">{step.title}</h3>
                        <p className="mt-1.5 text-sm text-muted-foreground">{step.body}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <div className="lg:col-span-7">
              <Parallax className="h-full overflow-hidden rounded-4xl border border-border" distance={40}>
                <img
                  src={cargoBay}
                  alt="Stacked cargo pallets in a dimly lit warehouse aisle"
                  loading="lazy"
                  width={1200}
                  height={912}
                  className="h-full min-h-[420px] w-full scale-110 object-cover"
                />
              </Parallax>
            </div>
          </div>
        </section>

        {/* WHY — bento */}
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Why LogiFlow</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              Built for teams that cannot afford a late truck
            </h2>
          </Reveal>

          <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {REASONS.map((r) => (
              <StaggerItem key={r.title}>
                <div className="group h-full bento-card p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-primary">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 font-bold">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          {/* OWNER SPOTLIGHT */}
          <Reveal className="mt-16">
            <div className="grid overflow-hidden rounded-4xl border border-border bg-card lg:grid-cols-2">
              <div className="relative min-h-[320px] overflow-hidden">
                <img
                  src={ownerTablet}
                  alt="Fleet owner checking bookings on a tablet next to a mini truck"
                  loading="lazy"
                  width={1200}
                  height={912}
                  className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  For fleet owners
                </p>
                <h3 className="mt-4 font-display text-2xl font-bold sm:text-4xl">
                  Keep every vehicle earning
                </h3>
                <p className="mt-4 text-muted-foreground">
                  List your trucks once, receive matched requests instantly, and track payouts with a
                  clear earnings view — no brokers, no idle days.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="font-display text-2xl font-bold">
                      <Counter value={82} suffix="%" />
                    </p>
                    <p className="text-xs text-muted-foreground">Avg. utilisation</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="font-display text-2xl font-bold">
                      <Counter value={9} suffix=" min" />
                    </p>
                    <p className="text-xs text-muted-foreground">Avg. acceptance</p>
                  </div>
                </div>
                <div className="mt-8">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/for-owners">
                      Become a partner <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* TRUST */}
          <Reveal className="mt-14">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 rounded-3xl border border-border bg-card px-6 py-6 text-sm font-semibold text-muted-foreground">
              <span className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> ISO 27001 aligned
              </span>
              <span className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-primary" /> KYC verified owners
              </span>
              <span className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-primary" /> GST-ready receipts
              </span>
              <span className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" /> Escrow-ready payments
              </span>
            </div>
          </Reveal>
        </section>

        {/* TESTIMONIALS */}
        <section className="border-y border-border bg-card/30 py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Customer stories
              </p>
              <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
                Shippers and owners, both better off
              </h2>
            </Reveal>

            <Stagger className="mt-12 grid gap-5 lg:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <StaggerItem key={t.name}>
                  <figure className="flex h-full flex-col bento-card p-7">
                    <Quote className="h-7 w-7 text-primary/40" />
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                      {t.quote}
                    </blockquote>
                    <div className="mt-5 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-highlight text-highlight" />
                      ))}
                    </div>
                    <figcaption className="mt-4 border-t border-border pt-4">
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </figcaption>
                  </figure>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
          <Reveal className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">FAQ</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">Questions, answered</h2>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <Accordion type="single" collapsible className="surface-card divide-y divide-border px-6">
              {FAQS.map((f) => (
                <AccordionItem key={f.q} value={f.q} className="border-none py-1">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-4xl border border-border px-8 py-20 text-center">
              <img
                src={heroImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                width={1920}
                height={1200}
                className="absolute inset-0 h-full w-full object-cover opacity-25"
              />
              <div className="absolute inset-0 gradient-hero opacity-85" />
              <div className="absolute inset-0 grid-lines opacity-10" />
              <div className="relative">
                <h2 className="font-display text-3xl font-bold sm:text-5xl">
                  Your next load is one search away
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                  Join shippers and fleet owners already running their freight on LogiFlow.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Button variant="highlight" size="xl" asChild>
                    <Link to="/auth">Create free account</Link>
                  </Button>
                  <Button variant="glass" size="xl" asChild>
                    <Link to="/vehicles">Browse vehicles</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
