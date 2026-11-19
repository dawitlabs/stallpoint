export function plural(count: number, singular: string): string {
  return `${count.toLocaleString("en-US")} ${count === 1 ? singular : `${singular}s`}`;
}
