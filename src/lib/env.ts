import "server-only";
import { z } from "zod";

const optionalSecret = z
  .string()
  .optional()
  .transform((value) => (value ? value : undefined));

const ServerEnv = z
  .object({
    DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    OAUTH_PROXY_SECRET: z.string().min(32),
    AUTH_PREVIEW_HOST_PATTERN: optionalSecret,
    GOOGLE_CLIENT_ID: optionalSecret,
    GOOGLE_CLIENT_SECRET: optionalSecret,
    GITHUB_CLIENT_ID: optionalSecret,
    GITHUB_CLIENT_SECRET: optionalSecret,
    VERCEL: z.string().optional(),
  })
  .refine(
    (env) =>
      Boolean(env.GOOGLE_CLIENT_ID) === Boolean(env.GOOGLE_CLIENT_SECRET),
    {
      error: "Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, or neither",
    },
  )
  .refine(
    (env) =>
      Boolean(env.GITHUB_CLIENT_ID) === Boolean(env.GITHUB_CLIENT_SECRET),
    {
      error: "Set both GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET, or neither",
    },
  )
  .refine((env) => !env.VERCEL || Boolean(env.AUTH_PREVIEW_HOST_PATTERN), {
    error: "AUTH_PREVIEW_HOST_PATTERN is required on Vercel",
  });

export const env = ServerEnv.parse(process.env);
