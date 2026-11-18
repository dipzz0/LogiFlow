import type { Database } from "@/integrations/supabase/types";

export type VehicleType = Database["public"]["Enums"]["vehicle_type"];
export type BookingStatus = Database["public"]["Enums"]["booking_status"];
export type AppRole = Database["public"]["Enums"]["app_role"];

export const VEHICLE_TYPES: { value: VehicleType; label: string; blurb: string }[] = [
  { value: "mini_truck", label: "Mini Truck", blurb: "Up to 1.5T · city runs" },
  { value: "tempo", label: "Tempo", blurb: "Up to 2.5T · intra-city" },
  { value: "pickup", label: "Pickup", blurb: "Up to 1T · quick loads" },
  { value: "container_truck", label: "Container Truck", blurb: "Up to 16T · long haul" },
  { value: "trailer", label: "Trailer", blurb: "Up to 40T · heavy freight" },
  { value: "refrigerated", label: "Refrigerated", blurb: "Cold chain · perishables" },
];

export const vehicleTypeLabel = (t: VehicleType) =>
  VEHICLE_TYPES.find((v) => v.value === t)?.label ?? t;

export const CITIES = [
  "Mumbai",
  "Delhi",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Ahmedabad",
  "Kolkata",
  "Jaipur",
  "Surat",
];

export const BOOKING_STATUS_META: Record<
  BookingStatus,
  { label: string; tone: "pending" | "positive" | "negative" | "active" | "neutral" }
> = {
  pending: { label: "Pending", tone: "pending" },
  accepted: { label: "Accepted", tone: "positive" },
  rejected: { label: "Rejected", tone: "negative" },
  in_transit: { label: "In transit", tone: "active" },
  delivered: { label: "Delivered", tone: "positive" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export const formatDate = (value: string | Date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export const formatDateTime = (value: string | Date) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));

export const estimateFare = (baseFare: number, pricePerKm: number, km: number) =>
  Math.round(Number(baseFare) + Number(pricePerKm) * (km || 0));
