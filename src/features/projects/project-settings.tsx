import { CopyButton } from "@/components/copy-button";
import { getMyProject } from "./queries";
import { DeleteProjectForm, RotateKeyForm } from "./settings-forms";

export async function ProjectSettings({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getMyProject(projectId);
  return (
    <div className="grid max-w-3xl gap-4">
      <section
        aria-labelledby="key-title"
        className="rounded-panel border border-line bg-panel p-5 sm:p-6"
      >
        <h2 id="key-title" className="font-semibold">
          Write key
        </h2>
        <p className="mt-1 text-sm text-muted">
          Public by design: it can only add events to this project, never read
          them.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-panel-2 py-2 pr-2 pl-4">
          <code className="min-w-0 flex-1 truncate font-mono text-sm">
            {project.writeKey}
          </code>
          <CopyButton value={project.writeKey} label="Copy write key" />
        </div>
        <div className="mt-5">
          <RotateKeyForm projectId={project.id} />
        </div>
      </section>
      <section
        aria-labelledby="danger-title"
        className="rounded-panel border border-danger/40 p-5 sm:p-6"
      >
        <h2 id="danger-title" className="font-semibold text-danger">
          Delete project
        </h2>
        <p className="mt-1 mb-5 text-sm text-muted">
          Removes the project, its funnels and every event. This can&apos;t be
          undone.
        </p>
        <DeleteProjectForm projectId={project.id} projectName={project.name} />
      </section>
    </div>
  );
}

export function ProjectSettingsSkeleton() {
  return (
    <div
      className="h-[420px] max-w-3xl animate-pulse rounded-panel border border-line bg-panel"
      aria-hidden="true"
    />
  );
}
