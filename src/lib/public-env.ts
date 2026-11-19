import { z } from "zod";

const PublicEnv = z.object({
  NEXT_PUBLIC_APP_URL: z.url(),
});

export const publicEnv = PublicEnv.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

export function installSnippet(writeKey: string): string {
  return `<script defer src="${publicEnv.NEXT_PUBLIC_APP_URL}/sdk.js" data-key="${writeKey}"></script>`;
}
