import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, TrendingUp, Wallet } from "lucide-react";

import { RowSkeleton, StatCard } from "@/components/ui-states";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, formatDateTime } from "@/lib/logiflow";

export const Route = createFileRoute("/_authenticated/earnings")({
  head: () => ({
    meta: [
      { title: "Earnings — LogiFlow" },
      { name: "description", content: "Track delivered revenue and per-trip payouts across your LogiFlow fleet." },
      { property: "og:title", content: "Earnings — LogiFlow" },
      { property: "og:description", content: "Delivered revenue and per-trip payouts." },
    ],
  }),
  component: EarningsPage,
});

function EarningsPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["earnings", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("owner_id", user!.id)
        .eq("status", "delivered")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const rows = data ?? [];
  const total = rows.reduce((s, b) => s + Number(b.amount), 0);
  const avg = rows.length ? total / rows.length : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Earnings</h1>
      <div className="grid gap-5 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Total earned" value={formatCurrency(total)} />
        <StatCard icon={CheckCircle2} label="Trips delivered" value={rows.length} />
        <StatCard icon={TrendingUp} label="Average per trip" value={formatCurrency(Math.round(avg))} />
      </div>

      {isLoading ? (
        <RowSkeleton />
      ) : (
        <div className="space-y-3">
          {rows.map((b) => (
            <div
              key={b.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 surface-card p-5"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold">{b.reference}</p>
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(b.pickup_at)}</p>
              </div>
              <span className="font-display font-extrabold">{formatCurrency(Number(b.amount))}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
