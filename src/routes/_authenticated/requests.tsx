import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Inbox } from "lucide-react";

import { EmptyState, RowSkeleton, StatusPill } from "@/components/ui-states";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, formatDateTime } from "@/lib/logiflow";

export const Route = createFileRoute("/_authenticated/requests")({
  head: () => ({
    meta: [
      { title: "Booking Requests — LogiFlow" },
      { name: "description", content: "Accept or reject incoming shipper requests for your fleet." },
      { property: "og:title", content: "Booking Requests — LogiFlow" },
      { property: "og:description", content: "Accept or reject incoming shipper requests." },
    ],
  }),
  component: RequestsPage,
});

function RequestsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["requests", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Booking requests</h1>
      {isLoading ? (
        <RowSkeleton />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Inbox} title="No requests yet" body="Shipper requests for your vehicles land here." />
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
