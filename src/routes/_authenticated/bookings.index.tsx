import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState, RowSkeleton, StatusPill } from "@/components/ui-states";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, formatDateTime } from "@/lib/logiflow";

export const Route = createFileRoute("/_authenticated/bookings/")({
  head: () => ({
    meta: [
      { title: "My Bookings — LogiFlow" },
      { name: "description", content: "Track every LogiFlow booking from request through delivery." },
      { property: "og:title", content: "My Bookings — LogiFlow" },
      { property: "og:description", content: "Every booking from request through delivery." },
    ],
  }),
  component: BookingsPage,
});

function BookingsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["bookings", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">My bookings</h1>
      {isLoading ? (
        <RowSkeleton />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No bookings yet"
          body="Your consignments will appear here once you request a vehicle."
          action={
            <Button variant="hero" asChild>
              <Link to="/vehicles">Find a vehicle</Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {data.map((b) => (
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
  );
}
