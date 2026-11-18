import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Filter, Gauge, MapPin, PackageSearch, Star, Truck, X } from "lucide-react";
import { z } from "zod";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardSkeletonGrid, EmptyState } from "@/components/ui-states";
import { Stagger, StaggerItem } from "@/components/motion-primitives";
import { supabase } from "@/integrations/supabase/client";
import { CITIES, VEHICLE_TYPES, formatCurrency, vehicleTypeLabel, type VehicleType } from "@/lib/logiflow";

const searchSchema = z.object({
  city: z.string().optional(),
  type: z.string().optional(),
  minCapacity: z.number().optional(),
});

export const Route = createFileRoute("/vehicles/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Find Trucks & Tempos — LogiFlow Marketplace" },
      {
        name: "description",
        content:
          "Browse verified trucks, tempos, trailers and refrigerated vehicles. Filter by city, vehicle type and payload capacity, and book in three steps.",
      },
      { property: "og:title", content: "Find Trucks & Tempos — LogiFlow Marketplace" },
      {
        property: "og:description",
        content: "Filter verified fleets by city, type and payload capacity.",
      },
    ],
  }),
  component: VehiclesPage,
});

function VehiclesPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["vehicles", search],
    queryFn: async () => {
      let q = supabase
        .from("vehicles")
        .select("*")
        .eq("is_available", true)
        .order("rating", { ascending: false });
      if (search.city) q = q.eq("city", search.city);
      if (search.type) q = q.eq("vehicle_type", search.type as VehicleType);
      if (search.minCapacity) q = q.gte("capacity_kg", search.minCapacity);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const update = (patch: Record<string, unknown>) =>
    navigate({ search: (prev: Record<string, unknown>) => ({ ...prev, ...patch }) });

  const hasFilters = Boolean(search.city || search.type || search.minCapacity);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-muted/40 px-4 py-10 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-3xl font-extrabold sm:text-4xl">Find your vehicle</h1>
            <p className="mt-2 text-muted-foreground">
              {isLoading
                ? "Loading verified fleets…"
                : `${data?.length ?? 0} verified vehicles available right now.`}
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit surface-card p-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-bold">
                <Filter className="h-4 w-4 text-primary" /> Filters
              </p>
              {hasFilters && (
                <button
                  onClick={() => navigate({ search: {} })}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              )}
            </div>

            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="city">Pickup city</Label>
                <select
                  id="city"
                  value={search.city ?? ""}
                  onChange={(e) => update({ city: e.target.value || undefined })}
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
                >
                  <option value="">All cities</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Vehicle type</Label>
                <select
                  id="type"
                  value={search.type ?? ""}
                  onChange={(e) => update({ type: e.target.value || undefined })}
                  className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm"
                >
                  <option value="">All types</option>
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cap">Minimum capacity (kg)</Label>
                <Input
                  id="cap"
                  type="number"
                  min={0}
                  placeholder="e.g. 2000"
                  value={search.minCapacity ?? ""}
                  onChange={(e) =>
                    update({ minCapacity: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="h-11"
                />
              </div>
            </div>
          </aside>

          <section>
            {isLoading ? (
              <CardSkeletonGrid />
            ) : !data || data.length === 0 ? (
              <EmptyState
                icon={PackageSearch}
                title="No vehicles match those filters"
                body="Try widening the city or capacity filter — new fleets join the marketplace every day."
                action={
                  <Button variant="outline" onClick={() => navigate({ search: {} })}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {data.map((v) => (
                  <StaggerItem key={v.id}>
                    <Link
                      to="/vehicles/$vehicleId"
                      params={{ vehicleId: v.id }}
                      className="group flex h-full flex-col surface-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                        {v.photos?.[0] ? (
                          <img
                            src={v.photos[0]}
                            alt={v.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center gradient-hero">
                            <Truck className="h-10 w-10 text-primary-foreground/60" />
                          </div>
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-card/90 px-2.5 py-1 text-xs font-semibold backdrop-blur">
                          {vehicleTypeLabel(v.vehicle_type)}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                          <h2 className="truncate font-bold">{v.title}</h2>
                          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold">
                            <Star className="h-3.5 w-3.5 fill-highlight text-highlight" />
                            {Number(v.rating).toFixed(1)}
                          </span>
                        </div>
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> {v.city}
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Gauge className="h-3.5 w-3.5" /> {v.capacity_kg.toLocaleString("en-IN")} kg
                          capacity
                        </p>

                        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground">from</p>
                            <p className="font-display text-lg font-extrabold">
                              {formatCurrency(Number(v.base_fare))}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              + {formatCurrency(Number(v.price_per_km))}/km
                            </p>
                          </div>
                          <span className="rounded-xl bg-primary-soft px-3 py-2 text-sm font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                            View
                          </span>
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
