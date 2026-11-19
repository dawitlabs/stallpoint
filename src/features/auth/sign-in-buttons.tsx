"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { GithubMark } from "@/components/brand";
import { authClient } from "@/lib/auth-client";
import { SITE } from "@/lib/site";

type ProviderId = "google" | "github";

const LABELS: Record<ProviderId, string> = {
  google: "Continue with Google",
  github: "Continue with GitHub",
};

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.66 4.1-5.5 4.1-3.31 0-6-2.74-6-6.2s2.69-6.2 6-6.2c1.88 0 3.15.8 3.87 1.5l2.64-2.55C16.82 3.2 14.62 2.2 12 2.2 6.6 2.2 2.2 6.6 2.2 12s4.4 9.8 9.8 9.8c5.66 0 9.4-3.98 9.4-9.58 0-.64-.07-1.13-.16-1.62H12Z"
      />
    </svg>
  );
}

export function SignInButtons({ providers }: { providers: ProviderId[] }) {
  const [pending, setPending] = useState<ProviderId | null>(null);
  const [hasError, setHasError] = useState(false);

  async function handleSignIn(provider: ProviderId): Promise<void> {
    setPending(provider);
    setHasError(false);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: SITE.dashboardPath,
    });
    if (error) {
      setPending(null);
      setHasError(true);
    }
  }

  return (
    <div className="grid gap-3">
      {providers.map((provider) => (
        <button
          key={provider}
          type="button"
          onClick={() => handleSignIn(provider)}
          disabled={pending !== null}
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-3 rounded-full border border-line bg-panel-2 px-5 text-[15px] font-semibold transition-colors hover:border-faint disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending === provider ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : provider === "google" ? (
            <GoogleMark />
          ) : (
            <GithubMark />
          )}
          {LABELS[provider]}
        </button>
      ))}
      <p aria-live="polite" className="min-h-5 text-sm text-alert">
        {hasError
          ? "Sign-in didn't start. Try again, or use the other provider."
          : ""}
      </p>
    </div>
  );
}
