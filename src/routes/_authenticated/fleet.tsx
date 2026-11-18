import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Truck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState, RowSkeleton } from "@/components/ui-states";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { CITIES, VEHICLE_TYPES, formatCurrency, vehicleTypeLabel } from "@/lib/logiflow";

export const Route = createFileRoute("/_authenticated/fleet")({
  head: () => ({
    meta: [
      { title: "My Fleet — LogiFlow" },
      { name: "description", content: "List and manage the trucks and tempos you rent out on LogiFlow." },
      { property: "og:title", content: "My Fleet — LogiFlow" },
      { property: "og:description", content: "List and manage your trucks and tempos." },
    ],
  }),
  component: FleetPage,
});

function FleetPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    vehicle_type: VEHICLE_TYPES[0]!.value,
    city: CITIES[0]!,
    registration_number: "",
    capacity_kg: "1000",
    base_fare: "500",
    price_per_km: "20",
    description: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["fleet", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Sign in first");
      if (form.title.trim().length < 3) throw new Error("Give the vehicle a title");
      const { error } = await supabase.from("vehicles").insert({
        owner_id: user.id,
        title: form.title.trim(),
        vehicle_type: form.vehicle_type,
        city: form.city,
        registration_number: form.registration_number.trim(),
        capacity_kg: Number(form.capacity_kg),
        base_fare: Number(form.base_fare),
        price_per_km: Number(form.price_per_km),
        description: form.description.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["fleet", user?.id] });
      setForm({ ...form, title: "", registration_number: "", description: "" });
      toast.success("Vehicle listed");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: async (v: { id: string; is_available: boolean }) => {
      const { error } = await supabase
        .from("vehicles")
        .update({ is_available: !v.is_available })
        .eq("id", v.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fleet", user?.id] }),
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <h1 className="text-2xl font-extrabold">My fleet</h1>
        {isLoading ? (
          <RowSkeleton />
        ) : !data || data.length === 0 ? (
          <EmptyState icon={Truck} title="No vehicles yet" body="Add your first vehicle to start receiving booking requests." />
        ) : (
          data.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 surface-card p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{v.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {vehicleTypeLabel(v.vehicle_type)} · {v.city} · {v.capacity_kg} kg
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatCurrency(Number(v.base_fare))} + {formatCurrency(Number(v.price_per_km))}/km
                </p>
              </div>
              <Button
                size="sm"
                variant={v.is_available ? "outline" : "hero"}
                onClick={() => toggle.mutate({ id: v.id, is_available: v.is_available })}
              >
                {v.is_available ? "Pause" : "Activate"}
              </Button>
            </div>
          ))
        )}
      </div>

      <aside className="h-fit space-y-4 surface-card p-6">
        <h2 className="font-bold">Add a vehicle</h2>
        <div className="space-y-2">
          <Label htmlFor="t">Title</Label>
          <Input id="t" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="ty">Type</Label>
            <select
              id="ty"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.vehicle_type}
              onChange={(e) => setForm({ ...form, vehicle_type: e.target.value as typeof form.vehicle_type })}
            >
              {VEHICLE_TYPES.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="c">City</Label>
            <select
              id="c"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reg">Registration number</Label>
          <Input
            id="reg"
            value={form.registration_number}
            onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <Label htmlFor="cap">Capacity</Label>
            <Input
              id="cap"
              type="number"
              value={form.capacity_kg}
              onChange={(e) => setForm({ ...form, capacity_kg: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bf">Base</Label>
            <Input
              id="bf"
              type="number"
              value={form.base_fare}
              onChange={(e) => setForm({ ...form, base_fare: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pk">Per km</Label>
            <Input
              id="pk"
              type="number"
              value={form.price_per_km}
              onChange={(e) => setForm({ ...form, price_per_km: e.target.value })}
            />
          </div>
        </div>
        <Button variant="hero" className="w-full" disabled={add.isPending} onClick={() => add.mutate()}>
          {add.isPending ? "Saving…" : "List vehicle"}
        </Button>
      </aside>
    </div>
  );
}
