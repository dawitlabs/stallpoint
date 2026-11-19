import type { Metadata } from "next";
import { Suspense } from "react";
import { BrandLink } from "@/components/brand";
import { SignInButtons } from "@/features/auth/sign-in-buttons";
import { enabledProviders } from "@/lib/auth";

export const metadata: Metadata = { title: "Sign in" };

const ERROR_MESSAGES: Record<string, string> = {
  access_denied: "You cancelled the sign-in. Pick a provider to try again.",
  state_mismatch: "The sign-in link expired. Start again.",
};

async function SignInError({
  searchParams,
}: {
  searchParams: PageProps<"/sign-in">["searchParams"];
}) {
  const { error } = await searchParams;
  if (typeof error !== "string") return null;
  const message = ERROR_MESSAGES[error] ?? "Sign-in failed. Try again.";
  return (
    <p
      role="alert"
      className="rounded-2xl border border-alert/40 bg-alert/10 px-4 py-3 text-sm text-alert"
    >
      {message}
    </p>
  );
}

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  const providers = enabledProviders();
  return (
    <main className="grid min-h-dvh place-items-center px-4 py-16">
      <div className="w-full max-w-[400px]">
        <div className="mb-10 flex justify-center">
          <BrandLink />
        </div>
        <div className="grid gap-6 rounded-panel border border-line bg-panel p-7 sm:p-8">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.03em]">
              Sign in to Stallpoint
            </h1>
            <p className="mt-2 text-[15px] text-muted">
              New here? Signing in creates your account. Free during beta.
            </p>
          </div>
          <Suspense fallback={null}>
            <SignInError searchParams={searchParams} />
          </Suspense>
          {providers.length > 0 ? (
            <SignInButtons providers={providers} />
          ) : (
            <p className="rounded-2xl border border-line bg-panel-2 px-4 py-3 text-sm text-muted">
              No sign-in provider is set up yet. Add the Google or GitHub OAuth
              keys to the environment.
            </p>
          )}
        </div>
        <p className="mt-6 text-center text-xs text-faint">
          We only read your name, email and avatar from the provider.
        </p>
      </div>
    </main>
  );
}
