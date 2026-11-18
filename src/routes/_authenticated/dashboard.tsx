import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Search, Truck, Wallet, Clock, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState, RowSkeleton, StatCard, StatusPill } from "@/components/ui-states";
import { Reveal } from "@/components/motion-primitives";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, formatDateTime } from "@/lib/logiflow";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — LogiFlow" },
      { name: "description", content: "Your LogiFlow overview: bookings, fleet activity and earnings." },
      { property: "og:title", content: "Dashboard — LogiFlow" },
      { property: "og:description", content: "Bookings, fleet activity and earnings at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, role } = useAuth();
  const isOwner = role === "owner";

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["dashboard-bookings", user?.id, role],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, vehicles(title)")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
  });

  const { data: vehicles } = useQuery({
    queryKey: ["dashboard-vehicles", user?.id],
    enabled: Boolean(user) && isOwner,
    queryFn: async () => {
      const { data, error } = await supabase.from("vehicles").select("id").eq("owner_id", user!.id);
      if (error) throw error;
      return data;
    },
  });

  const all = bookings ?? [];
  const active = all.filter((b) => ["pending", "accepted", "in_transit"].includes(b.status));
  const delivered = all.filter((b) => b.status === "delivered");
  const revenue = delivered.reduce((sum, b) => sum + Number(b.amount), 0);

  return (
    <div className="space-y-8">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8">
          <div className="absolute inset-0 grid-lines opacity-10" />
          <div className="relative">
            <p className="text-sm text-primary-foreground/70">
              {isOwner ? "Fleet owner workspace" : "Shipper workspace"}
            </p>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-primary-foreground sm:text-3xl">
              Welcome back
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              {isOwner ? (
                <>
                  <Button variant="highlight" asChild>
                    <Link to="/fleet">Manage fleet</Link>
                  </Button>
                  <Button variant="glass" asChild>
                    <Link to="/requests">View requests</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="highlight" asChild>
                    <Link to="/vehicles">
                      <Search className="h-4 w-4" /> Find a vehicle
                    </Link>
                  </Button>
                  <Button variant="glass" asChild>
                    <Link to="/bookings">My bookings</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Package} label="Total bookings" value={all.length} />
        <StatCard icon={Clock} label="Active" value={active.length} hint="Pending, accepted or moving" />
        <StatCard icon={CheckCircle2} label="Delivered" value={delivered.length} />
        <StatCard
          icon={isOwner ? Wallet : Truck}
          label={isOwner ? "Delivered revenue" : "Delivered spend"}
          value={formatCurrency(revenue)}
        />
      </div>

      {isOwner && (
        <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-6">
          <p className="text-sm">
            <span className="font-bold">{vehicles?.length ?? 0}</span> vehicles listed on the
            marketplace
          </p>
          <Button variant="outline" size="sm" asChild>
            <Link to="/fleet">Add a vehicle</Link>
          </Button>
        </div>
      )}

      <section>
        <h2 className="text-lg font-bold">Recent activity</h2>
        <div className="mt-4">
          {isLoading ? (
            <RowSkeleton />
          ) : all.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Nothing here yet"
              body={
                isOwner
                  ? "Once shippers request your vehicles, those bookings appear here."
                  : "Book your first vehicle and it will show up right here."
              }
              action={
                <Button variant="hero" asChild>
                  <Link to={isOwner ? "/fleet" : "/vehicles"}>
                    {isOwner ? "List a vehicle" : "Find a vehicle"}
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {all.map((b) => (
                <Link
                  key={b.id}
                  to="/bookings/$bookingId"
                  params={{ bookingId: b.id }}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 surface-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{b.reference}</p>
                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {b.pickup_address} → {b.drop_address}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(b.pickup_at)} · {formatCurrency(Number(b.amount))}
                    </p>
                  </div>
                  <StatusPill status={b.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
