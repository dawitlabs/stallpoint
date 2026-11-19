import { requireUser } from "@/features/auth/require-user";
import { DeleteAccountForm } from "./delete-account-form";

export async function AccountPanel() {
  const user = await requireUser();
  return (
    <div className="grid max-w-3xl gap-4">
      <section
        aria-labelledby="profile-title"
        className="rounded-panel border border-line bg-panel p-5 sm:p-6"
      >
        <h2 id="profile-title" className="font-semibold">
          Profile
        </h2>
        <p className="mt-2 text-[15px]">{user.name}</p>
        <p className="mt-1 text-sm text-muted">
          Your name and avatar come from the provider you signed in with.
        </p>
      </section>
      <section
        aria-labelledby="delete-account-title"
        className="rounded-panel border border-danger/40 p-5 sm:p-6"
      >
        <h2 id="delete-account-title" className="font-semibold text-danger">
          Delete account
        </h2>
        <p className="mt-1 mb-5 text-sm text-muted">
          Removes your account, every project, funnel and event, and your
          sign-in records. This can&apos;t be undone.
        </p>
        <DeleteAccountForm />
      </section>
    </div>
  );
}

export function AccountPanelSkeleton() {
  return (
    <div
      className="h-80 max-w-3xl animate-pulse rounded-panel border border-line bg-panel"
      aria-hidden="true"
    />
  );
}
