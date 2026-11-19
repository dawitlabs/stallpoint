import "server-only";
import { randomBytes } from "node:crypto";
import { WRITE_KEY_PREFIX } from "./limits";

const WRITE_KEY_BYTES = 18;

export function generateWriteKey(): string {
  return `${WRITE_KEY_PREFIX}${randomBytes(WRITE_KEY_BYTES).toString("base64url")}`;
}
