import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, ArrowRight, Building2, Loader2, Mail, ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import type { AppRole } from "@/lib/logiflow";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in to LogiFlow — Secure Email Code Access" },
      {
        name: "description",
        content:
          "Sign in or create your LogiFlow account with a secure one-time email code, then choose whether you ship goods or own vehicles.",
      },
      { property: "og:title", content: "Sign in to LogiFlow" },
      { property: "og:description", content: "Secure one-time email code access to LogiFlow." },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);

type Step = "email" | "code" | "role";

function AuthPage() {
  const navigate = useNavigate();
  const { user, role, loading, refreshRole } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user && role) navigate({ to: "/dashboard", replace: true });
    else if (user && !role) setStep("role");
  }, [user, role, loading, navigate]);

  const sendCode = async () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid email");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Code sent", { description: `We emailed a 6-digit code to ${parsed.data}.` });
    setStep("code");
  };

  const verifyCode = async (value: string) => {
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: value,
      type: "email",
    });
    setBusy(false);
    if (error) {
      toast.error("That code did not work", { description: error.message });
      setCode("");
      return;
    }
    toast.success("Verified");
  };

  const chooseRole = async (selected: AppRole) => {
    if (!user) return;
    setBusy(true);
    if (fullName.trim()) {
      await supabase.from("profiles").update({ full_name: fullName.trim() }).eq("id", user.id);
    }
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: user.id, role: selected });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await refreshRole();
    toast.success(`Welcome to LogiFlow`);
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-40" />
        <div className="relative mx-auto flex max-w-lg flex-col px-4 py-16 sm:px-6">
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="surface-card p-8"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl gradient-primary text-primary-foreground shadow-glow">
                  <Mail className="h-5 w-5" />
                </span>
                <h1 className="mt-6 text-2xl font-extrabold">Sign in to LogiFlow</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  We'll email you a secure one-time code. No passwords to remember.
                </p>

                <div className="mt-7 space-y-2">
                  <Label htmlFor="email">Work email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendCode()}
                    className="h-12"
                  />
                </div>

                <Button
                  variant="hero"
                  size="lg"
                  className="mt-5 w-full"
                  onClick={sendCode}
                  disabled={busy}
                >
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Send secure code
                </Button>

                <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Codes expire in 10 minutes and can be used once.
                </p>
              </motion.div>
            )}

            {step === "code" && (
              <motion.div
                key="code"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="surface-card p-8"
              >
                <button
                  onClick={() => setStep("email")}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Change email
                </button>
                <h1 className="mt-5 text-2xl font-extrabold">Enter your code</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sent to <span className="font-semibold text-foreground">{email}</span>
                </p>

                <div className="mt-7 flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={code}
                    onChange={(v) => {
                      setCode(v);
                      if (v.length === 6) void verifyCode(v);
                    }}
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot key={i} index={i} className="h-14 w-12 text-lg" />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {busy && (
                  <p className="mt-5 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                  </p>
                )}

                <Button variant="ghost" className="mt-6 w-full" onClick={sendCode} disabled={busy}>
                  Resend code
                </Button>
              </motion.div>
            )}

            {step === "role" && (
              <motion.div
                key="role"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="surface-card p-8"
              >
                <h1 className="text-2xl font-extrabold">How will you use LogiFlow?</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  This sets up your dashboard and permissions. It cannot be changed later.
                </p>

                <div className="mt-6 space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    placeholder="Ananya Rao"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="mt-6 grid gap-4">
                  {[
                    {
                      role: "customer" as AppRole,
                      icon: Building2,
                      title: "I need to ship goods",
                      body: "Search fleets, book vehicles, track consignments and download receipts.",
                    },
                    {
                      role: "owner" as AppRole,
                      icon: Truck,
                      title: "I own vehicles",
                      body: "List trucks and tempos, manage requests, availability and earnings.",
                    },
                  ].map((option) => (
                    <button
                      key={option.role}
                      disabled={busy}
                      onClick={() => chooseRole(option.role)}
                      className="group flex items-start gap-4 rounded-2xl border border-border bg-card p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-lift disabled:opacity-60"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary transition-transform group-hover:scale-110">
                        <option.icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-bold">{option.title}</span>
                        <span className="mt-1 block text-sm text-muted-foreground">{option.body}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to the LogiFlow terms of service.{" "}
            <Link to="/" className="font-semibold text-primary hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
