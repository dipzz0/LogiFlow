import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Receipt } from "lucide-react";

import { EmptyState, RowSkeleton } from "@/components/ui-states";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, formatDateTime } from "@/lib/logiflow";

export const Route = createFileRoute("/_authenticated/receipts")({
  head: () => ({
    meta: [
      { title: "Receipts — LogiFlow" },
      { name: "description", content: "Download and review digital receipts for every completed LogiFlow shipment." },
      { property: "og:title", content: "Receipts — LogiFlow" },
      { property: "og:description", content: "Digital receipts for every completed shipment." },
    ],
  }),
  component: ReceiptsPage,
});

function ReceiptsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["receipts", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .order("issued_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Receipts</h1>
      {isLoading ? (
        <RowSkeleton />
      ) : !data || data.length === 0 ? (
        <EmptyState icon={Receipt} title="No receipts yet" body="Receipts are generated once a booking is paid." />
      ) : (
        <div className="space-y-3">
          {data.map((r) => (
            <Link
              key={r.id}
              to="/bookings/$bookingId"
              params={{ bookingId: r.booking_id }}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 surface-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{r.receipt_number}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(r.issued_at)}</p>
              </div>
              <span className="font-display font-extrabold">{formatCurrency(Number(r.total))}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
