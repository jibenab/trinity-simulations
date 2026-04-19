"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import { Button } from "./Button";
import { Icon } from "./Icon";

export function LoginCard() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const callbackURL = useMemo(
    () => searchParams.get("next") ?? "/catalog",
    [searchParams],
  );

  async function handleGoogleSignIn() {
    try {
      setLoading(true);
      setError(null);
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        disableRedirect: true,
      });

      const redirectUrl = result?.data?.url;
      const responseError =
        result?.error?.message ||
        result?.error?.statusText ||
        result?.error?.status;

      if (redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }

      throw new Error(
        typeof responseError === "string"
          ? responseError
          : "Google sign-in did not return a redirect URL.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <section className="dark-section mx-auto mt-10 max-w-[760px]">
      <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="eyebrow">Google sign-in only</div>
          <h1 className="display mt-4 text-[clamp(42px,8vw,72px)] text-dark-ink">
            Enter the lab.
          </h1>
          <p className="mt-6 max-w-[360px] text-[15px] leading-7 text-dark-mute">
            Sign in with your Google account to browse simulations, launch
            games, and keep your leaderboard entries synced live.
          </p>
        </div>

        <div className="rounded-lg border border-[#2A2A2A] bg-[rgba(255,255,255,0.03)] p-6">
          <div className="label-mono text-dark-mute">Student access</div>
          <h2 className="mt-3 text-[28px] font-semibold leading-tight text-dark-ink">
            Continue with Google
          </h2>
          <p className="mt-3 text-sm leading-6 text-dark-mute">
            Admin access is handled automatically from the allowlisted email
            addresses in the environment.
          </p>
          {error ? (
            <div className="mt-4 rounded-md border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          ) : null}
          <Button
            className="mt-6 w-full justify-between bg-paper text-ink hover:bg-paper"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            {loading ? "Redirecting..." : "Sign in with Google"}
            <Icon name="arrow-right" size={16} />
          </Button>
        </div>
      </div>
    </section>
  );
}
