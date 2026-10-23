"use client";
// Admin login: sends the email and password, saves the token, then opens the admin dashboard.
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Notice, { type NoticeMessage } from "@/components/ui/Notice";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { fieldClass, labelClass } from "@/components/ui/styles";
import { login } from "@/lib/api/admin";
import { getToken, saveToken } from "@/lib/auth";
import { getErrorMessage } from "@/lib/errors";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<NoticeMessage | null>(null);

  // Someone who is already logged in goes straight to the dashboard
  useEffect(() => {
    if (getToken()) router.replace("/admin");
  }, [router]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const result = await login(email.trim(), password);
      saveToken(result.token);
      router.replace("/admin");
    } catch (error) {
      setNotice({ type: "error", text: getErrorMessage(error) });
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm animate-fade-up">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl text-on-primary">🌿</span>
          <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight">FoodCast Admin</h1>
          <p className="text-sm text-muted">Sign in to manage the site.</p>
        </div>
        <Notice notice={notice} onDismiss={() => setNotice(null)} />
        <Card>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input id="email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass} />
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <input id="password" type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass} />
            </div>
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
