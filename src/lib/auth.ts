import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { oAuthProxy } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/lib/env";
import { publicEnv } from "@/lib/public-env";

const COOKIE_CACHE_SECONDS = 5 * 60;
const PRODUCTION_HOST = new URL(publicEnv.NEXT_PUBLIC_APP_URL).host;

function socialProviders() {
  return {
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account" as const,
          },
        }
      : {}),
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
          },
        }
      : {}),
  };
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL:
    env.VERCEL && env.AUTH_PREVIEW_HOST_PATTERN
      ? {
          allowedHosts: [PRODUCTION_HOST, env.AUTH_PREVIEW_HOST_PATTERN],
          protocol: "https",
          fallback: publicEnv.NEXT_PUBLIC_APP_URL,
        }
      : env.BETTER_AUTH_URL,
  socialProviders: socialProviders(),
  user: { deleteUser: { enabled: true } },
  session: { cookieCache: { enabled: true, maxAge: COOKIE_CACHE_SECONDS } },
  rateLimit: { enabled: true, storage: "database" },
  plugins: [
    oAuthProxy({
      productionURL: publicEnv.NEXT_PUBLIC_APP_URL,
      secret: env.OAUTH_PROXY_SECRET,
    }),
    nextCookies(),
  ],
});

export type AuthProviderId = "google" | "github";

export function enabledProviders(): AuthProviderId[] {
  const providers: AuthProviderId[] = [];
  if (env.GOOGLE_CLIENT_ID) providers.push("google");
  if (env.GITHUB_CLIENT_ID) providers.push("github");
  return providers;
}
