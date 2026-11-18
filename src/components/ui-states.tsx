import { Skeleton } from "@/components/ui/skeleton";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { BOOKING_STATUS_META, type BookingStatus } from "@/lib/logiflow";

export function StatusPill({ status }: { status: BookingStatus }) {
  const meta = BOOKING_STATUS_META[status];
  const tones: Record<string, string> = {
    pending: "bg-warning/15 text-warning-foreground border-warning/30",
    positive: "bg-success/15 text-success border-success/30",
    negative: "bg-destructive/12 text-destructive border-destructive/30",
    active: "bg-primary/12 text-primary border-primary/30",
    neutral: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${tones[meta.tone]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {meta.label}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: string;
}) {
  return (
    <div className="surface-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  body,
  action,
}: {
  icon: LucideIcon;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card flex flex-col items-center px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-primary">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-5 text-lg font-bold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card p-5">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="mt-4 h-5 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/2" />
          <Skeleton className="mt-5 h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export function RowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="surface-card p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-3 h-4 w-full max-w-md" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
      ))}
    </div>
  );
}
