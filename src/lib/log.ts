type LogValue = string | number | boolean | undefined;

export function log(entry: { event: string } & Record<string, LogValue>): void {
  console.log(JSON.stringify(entry));
}

export function errorName(error: unknown): string {
  return error instanceof Error ? error.name : "unknown";
}
