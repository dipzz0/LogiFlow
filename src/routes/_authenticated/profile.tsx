import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile Settings — LogiFlow" },
      { name: "description", content: "Update your LogiFlow contact details, company name and account preferences." },
      { property: "og:title", content: "Profile Settings — LogiFlow" },
      { property: "og:description", content: "Update your contact details and preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, role } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ full_name: "", phone: "", company: "", city: "" });

  const { data } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        full_name: data.full_name ?? "",
        phone: data.phone ?? "",
        company: data.company ?? "",
        city: data.city ?? "",
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: form.full_name.trim() || null,
          phone: form.phone.trim() || null,
          company: form.company.trim() || null,
          city: form.city.trim() || null,
        })
        .eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Profile updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {user?.email} · {role === "owner" ? "Fleet owner" : "Shipper"}
        </p>
      </div>

      <div className="space-y-4 surface-card p-6">
        {(
          [
            ["full_name", "Full name"],
            ["phone", "Phone"],
            ["company", "Company"],
            ["city", "City"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key}>{label}</Label>
            <Input
              id={key}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}
        <Button variant="hero" disabled={save.isPending} onClick={() => save.mutate()}>
          {save.isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
