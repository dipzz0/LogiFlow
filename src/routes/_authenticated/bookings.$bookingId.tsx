import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Receipt as ReceiptIcon, Wallet } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { RowSkeleton, StatusPill } from "@/components/ui-states";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatCurrency, formatDateTime, type BookingStatus } from "@/lib/logiflow";

export const Route = createFileRoute("/_authenticated/bookings/$bookingId")({
  head: () => ({
    meta: [
      { title: "Booking Tracking — LogiFlow" },
      { name: "description", content: "Live tracking, payment and digital receipt for this LogiFlow booking." },
      { property: "og:title", content: "Booking Tracking — LogiFlow" },
      { property: "og:description", content: "Live tracking, payment and digital receipt." },
    ],
  }),
  component: BookingDetail,
});

function BookingDetail() {
  const { bookingId } = Route.useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, vehicles(title, city)")
        .eq("id", bookingId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: trail } = useQuery({
    queryKey: ["tracking", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tracking")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: receipt } = useQuery({
    queryKey: ["receipt", bookingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("receipts")
        .select("*")
        .eq("booking_id", bookingId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const advance = useMutation({
    mutationFn: async (status: BookingStatus) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", bookingId);
      if (error) throw error;
      await supabase.from("tracking").insert({ booking_id: bookingId, status });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["booking", bookingId] });
      qc.invalidateQueries({ queryKey: ["tracking", bookingId] });
      toast.success("Status updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const pay = useMutation({
    mutationFn: async () => {
      if (!data || !user) throw new Error("Not available");
      const total = Number(data.amount);
      const tax = Math.round(total * 0.05);
      const { error } = await supabase.from("payments").insert({
        booking_id: data.id,
        customer_id: user.id,
        amount: total + tax,
        status: "paid",
        method: "card",
      });
      if (error) throw error;
      const { error: rErr } = await supabase.from("receipts").insert({
        booking_id: data.id,
        customer_id: user.id,
        subtotal: total,
        tax,
        total: total + tax,
      });
      if (rErr) throw rErr;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["receipt", bookingId] });
      toast.success("Payment recorded", { description: "Your digital receipt is ready." });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <RowSkeleton count={3} />;
  if (!data) return <p className="text-muted-foreground">Booking not found.</p>;

  const isOwner = user?.id === data.owner_id;
  const isCustomer = user?.id === data.customer_id;

  return (
    <div className="space-y-6">
      <Link
        to="/bookings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All bookings
      </Link>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="surface-card p-6">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-extrabold">{data.reference}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.vehicles?.title} · {formatDateTime(data.pickup_at)}
                </p>
              </div>
              <StatusPill status={data.status} />
            </div>

            <div className="mt-6 space-y-3 rounded-2xl bg-muted p-5 text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="min-w-0">{data.pickup_address}</span>
              </p>
              <p className="pl-6 text-xs text-muted-foreground">↓ {data.distance_km} km</p>
              <p className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-highlight" />
                <span className="min-w-0">{data.drop_address}</span>
              </p>
            </div>

            <dl className="mt-5 grid gap-4 sm:grid-cols-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Goods</dt>
                <dd className="font-semibold">{data.goods_type || "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Weight</dt>
                <dd className="font-semibold">{data.weight_kg} kg</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Fare</dt>
                <dd className="font-semibold">{formatCurrency(Number(data.amount))}</dd>
              </div>
            </dl>
          </div>

          <div className="surface-card p-6">
            <h2 className="font-bold">Tracking</h2>
            <ol className="mt-5 space-y-5">
              {(trail ?? []).map((t) => (
                <li key={t.id} className="flex gap-4">
                  <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                  <div className="min-w-0">
                    <StatusPill status={t.status} />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {formatDateTime(t.created_at)}
                      {t.note ? ` · ${t.note}` : ""}
                    </p>
                  </div>
                </li>
              ))}
              {(trail ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No updates yet.</p>
              )}
            </ol>
          </div>
        </div>

        <aside className="h-fit space-y-4 surface-card p-6">
          {isOwner && data.status === "pending" && (
            <div className="flex gap-3">
              <Button variant="hero" className="flex-1" onClick={() => advance.mutate("accepted")}>
                Accept
              </Button>
              <Button variant="outline" onClick={() => advance.mutate("rejected")}>
                Reject
              </Button>
            </div>
          )}
          {isOwner && data.status === "accepted" && (
            <Button variant="hero" className="w-full" onClick={() => advance.mutate("in_transit")}>
              Start trip
            </Button>
          )}
          {isOwner && data.status === "in_transit" && (
            <Button variant="hero" className="w-full" onClick={() => advance.mutate("delivered")}>
              Mark delivered
            </Button>
          )}
          {isCustomer && ["pending", "accepted"].includes(data.status) && (
            <Button variant="outline" className="w-full" onClick={() => advance.mutate("cancelled")}>
              Cancel booking
            </Button>
          )}

          {receipt ? (
            <div className="rounded-2xl border border-border p-5">
              <p className="flex items-center gap-2 text-sm font-bold">
                <ReceiptIcon className="h-4 w-4 text-primary" /> {receipt.receipt_number}
              </p>
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(Number(receipt.subtotal))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span>{formatCurrency(Number(receipt.tax))}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 font-display font-extrabold">
                  <span>Total</span>
                  <span>{formatCurrency(Number(receipt.total))}</span>
                </div>
              </div>
            </div>
          ) : (
            isCustomer && (
              <Button
                variant="highlight"
                className="w-full"
                disabled={pay.isPending}
                onClick={() => pay.mutate()}
              >
                <Wallet className="h-4 w-4" />
                {pay.isPending ? "Processing…" : "Pay & generate receipt"}
              </Button>
            )
          )}
        </aside>
      </div>
    </div>
  );
}
