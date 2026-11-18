import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, CheckCircle2, Gauge, MapPin, Star, Truck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RowSkeleton } from "@/components/ui-states";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { estimateFare, formatCurrency, vehicleTypeLabel } from "@/lib/logiflow";

export const Route = createFileRoute("/vehicles/$vehicleId")({
  head: () => ({
    meta: [
      { title: "Vehicle Details & Booking — LogiFlow" },
      {
        name: "description",
        content:
          "Review capacity, pricing and owner rating for this vehicle, then complete the three-step LogiFlow booking flow.",
      },
      { property: "og:title", content: "Vehicle Details & Booking — LogiFlow" },
      { property: "og:description", content: "Review the vehicle and book it in three steps." },
    ],
  }),
  component: VehicleDetail,
});

const stepOne = z.object({
  pickup_address: z.string().trim().min(6, "Enter a pickup address").max(300),
  drop_address: z.string().trim().min(6, "Enter a drop address").max(300),
  pickup_at: z.string().min(1, "Choose a pickup date and time"),
});

function VehicleDetail() {
  const { vehicleId } = Route.useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    pickup_address: "",
    drop_address: "",
    pickup_at: "",
    goods_type: "",
    weight_kg: "",
    distance_km: "",
    notes: "",
  });

  const { data: vehicle, isLoading } = useQuery({
    queryKey: ["vehicle", vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const amount = vehicle
    ? estimateFare(Number(vehicle.base_fare), Number(vehicle.price_per_km), Number(form.distance_km))
    : 0;

  const book = useMutation({
    mutationFn: async () => {
      if (!vehicle || !user) throw new Error("Sign in to book this vehicle");
      const { data, error } = await supabase
        .from("bookings")
        .insert({
          customer_id: user.id,
          owner_id: vehicle.owner_id,
          vehicle_id: vehicle.id,
          pickup_address: form.pickup_address.trim(),
          drop_address: form.drop_address.trim(),
          pickup_at: new Date(form.pickup_at).toISOString(),
          goods_type: form.goods_type.trim() || null,
          weight_kg: Number(form.weight_kg) || 0,
          distance_km: Number(form.distance_km) || 0,
          amount,
          notes: form.notes.trim() || null,
        })
        .select("id")
        .single();
      if (error) throw error;
      await supabase.from("tracking").insert({
        booking_id: data.id,
        status: "pending",
        note: "Booking request created",
      });
      return data.id;
    },
    onSuccess: (id) => {
      toast.success("Booking requested", { description: "The fleet owner has been notified." });
      navigate({ to: "/bookings/$bookingId", params: { bookingId: id } });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const next = () => {
    if (step === 1) {
      const parsed = stepOne.safeParse(form);
      if (!parsed.success) {
        toast.error(parsed.error.issues[0]?.message ?? "Check the route details");
        return;
      }
    }
    if (step === 2 && (!form.distance_km || Number(form.distance_km) <= 0)) {
      toast.error("Enter the approximate trip distance in km");
      return;
    }
    setStep((s) => Math.min(3, s + 1));
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link
          to="/vehicles"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </Link>

        {isLoading ? (
          <div className="mt-6">
            <RowSkeleton count={3} />
          </div>
        ) : !vehicle ? (
          <p className="mt-10 text-muted-foreground">This vehicle is no longer listed.</p>
        ) : (
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <div className="overflow-hidden surface-card">
                <div className="aspect-[16/9] bg-muted">
                  {vehicle.photos?.[0] ? (
                    <img src={vehicle.photos[0]} alt={vehicle.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center gradient-hero">
                      <Truck className="h-14 w-14 text-primary-foreground/60" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <div className="min-w-0">
                      <h1 className="truncate text-2xl font-extrabold">{vehicle.title}</h1>
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" /> {vehicle.city}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Gauge className="h-4 w-4" /> {vehicle.capacity_kg.toLocaleString("en-IN")} kg
                        </span>
                        <span>{vehicleTypeLabel(vehicle.vehicle_type)}</span>
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary">
                      <Star className="h-4 w-4 fill-highlight text-highlight" />
                      {Number(vehicle.rating).toFixed(1)}
                    </span>
                  </div>

                  {vehicle.description && (
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                      {vehicle.description}
                    </p>
                  )}

                  <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                    {[
                      { k: "Base fare", v: formatCurrency(Number(vehicle.base_fare)) },
                      { k: "Per kilometre", v: formatCurrency(Number(vehicle.price_per_km)) },
                      { k: "Completed trips", v: String(vehicle.trips_count) },
                    ].map((row) => (
                      <div key={row.k} className="rounded-2xl bg-muted p-4">
                        <dt className="text-xs text-muted-foreground">{row.k}</dt>
                        <dd className="mt-1 font-display text-lg font-extrabold">{row.v}</dd>
                      </div>
                    ))}
                  </dl>

                  {vehicle.photos && vehicle.photos.length > 1 && (
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {vehicle.photos.slice(1, 7).map((p) => (
                        <img
                          key={p}
                          src={p}
                          alt={vehicle.title}
                          loading="lazy"
                          className="aspect-square w-full rounded-xl object-cover"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* BOOKING PANEL */}
            <aside className="h-fit surface-card p-6 lg:sticky lg:top-24">
              {!user ? (
                <div className="text-center">
                  <h2 className="text-lg font-bold">Sign in to book</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create a free shipper account to request this vehicle.
                  </p>
                  <Button variant="hero" className="mt-5 w-full" asChild>
                    <Link to="/auth">Sign in / Sign up</Link>
                  </Button>
                </div>
              ) : role === "owner" ? (
                <p className="text-sm text-muted-foreground">
                  You are signed in as a fleet owner. Bookings can only be created from a shipper
                  account.
                </p>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((s) => (
                      <div key={s} className="flex flex-1 items-center gap-2">
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors ${
                            step >= s
                              ? "gradient-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                        </span>
                        {s < 3 && (
                          <span
                            className={`h-0.5 flex-1 rounded-full ${step > s ? "bg-primary" : "bg-border"}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}>
                    {step === 1 && (
                      <div className="mt-6 space-y-4">
                        <h2 className="font-bold">Route & schedule</h2>
                        <div className="space-y-2">
                          <Label htmlFor="pickup">Pickup address</Label>
                          <Input
                            id="pickup"
                            value={form.pickup_address}
                            onChange={(e) => setForm({ ...form, pickup_address: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="drop">Drop address</Label>
                          <Input
                            id="drop"
                            value={form.drop_address}
                            onChange={(e) => setForm({ ...form, drop_address: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="when">Pickup date & time</Label>
                          <Input
                            id="when"
                            type="datetime-local"
                            value={form.pickup_at}
                            onChange={(e) => setForm({ ...form, pickup_at: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="mt-6 space-y-4">
                        <h2 className="font-bold">Consignment details</h2>
                        <div className="space-y-2">
                          <Label htmlFor="goods">Goods type</Label>
                          <Input
                            id="goods"
                            placeholder="Packaged FMCG"
                            value={form.goods_type}
                            onChange={(e) => setForm({ ...form, goods_type: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label htmlFor="weight">Weight (kg)</Label>
                            <Input
                              id="weight"
                              type="number"
                              min={0}
                              value={form.weight_kg}
                              onChange={(e) => setForm({ ...form, weight_kg: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dist">Distance (km)</Label>
                            <Input
                              id="dist"
                              type="number"
                              min={0}
                              value={form.distance_km}
                              onChange={(e) => setForm({ ...form, distance_km: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes for the owner</Label>
                          <Textarea
                            id="notes"
                            rows={3}
                            value={form.notes}
                            onChange={(e) => setForm({ ...form, notes: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="mt-6 space-y-4">
                        <h2 className="font-bold">Review & confirm</h2>
                        <div className="rounded-2xl bg-muted p-4 text-sm">
                          <p className="font-semibold">{form.pickup_address}</p>
                          <p className="my-1 text-muted-foreground">↓ {form.distance_km} km</p>
                          <p className="font-semibold">{form.drop_address}</p>
                        </div>
                        <div className="space-y-2 rounded-2xl border border-border p-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Base fare</span>
                            <span>{formatCurrency(Number(vehicle.base_fare))}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Distance · {form.distance_km || 0} km
                            </span>
                            <span>
                              {formatCurrency(
                                Number(vehicle.price_per_km) * Number(form.distance_km || 0),
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-border pt-2 font-display text-lg font-extrabold">
                            <span>Estimate</span>
                            <span>{formatCurrency(amount)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <div className="mt-6 flex gap-3">
                    {step > 1 && (
                      <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
                        Back
                      </Button>
                    )}
                    {step < 3 ? (
                      <Button variant="hero" className="flex-1" onClick={next}>
                        Continue <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="hero"
                        className="flex-1"
                        disabled={book.isPending}
                        onClick={() => book.mutate()}
                      >
                        {book.isPending ? "Requesting…" : "Confirm booking"}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </aside>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
