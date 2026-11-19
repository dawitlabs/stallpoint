import { CopyButton } from "@/components/copy-button";
import { installSnippet } from "@/lib/public-env";
import { getMyProject } from "./queries";

export async function InstallCard({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getMyProject(projectId);
  const snippet = installSnippet(project.writeKey);
  return (
    <section
      aria-labelledby="install-title"
      className="rounded-panel border border-line bg-panel p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="install-title" className="font-semibold">
            Install
          </h2>
          <p className="mt-1 text-sm text-muted">
            Paste this before{" "}
            <code className="font-mono text-paper">&lt;/head&gt;</code> on every
            page.
          </p>
        </div>
        <CopyButton value={snippet} label="Copy install snippet" />
      </div>
      <pre className="mt-4 overflow-x-auto rounded-2xl bg-panel-2 p-4 font-mono text-[13px] leading-relaxed whitespace-pre-wrap break-all text-muted">
        {snippet}
      </pre>
      <p className="mt-4 text-sm text-muted">
        Track a custom event with{" "}
        <code className="font-mono text-paper">
          stallpoint.track(&quot;signup_completed&quot;)
        </code>
        .
      </p>
    </section>
  );
}

export function InstallCardSkeleton() {
  return (
    <div
      className="h-[220px] animate-pulse rounded-panel border border-line bg-panel"
      aria-hidden="true"
    />
  );
}
