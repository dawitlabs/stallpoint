import { LogOut, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { signOutAction } from "@/features/auth/actions";
import { requireUser } from "@/features/auth/require-user";

export async function UserMenu() {
  const user = await requireUser();
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/dashboard/account"
        className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 text-sm transition-colors hover:bg-panel-2"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-full"
          />
        ) : (
          <span className="grid size-7 place-items-center rounded-full bg-lime font-mono text-[11px] font-semibold text-on-lime">
            {initials || <UserRound className="size-4" aria-hidden="true" />}
          </span>
        )}
        <span className="hidden max-w-[16ch] truncate sm:inline">
          {user.name}
        </span>
      </Link>
      <form action={signOutAction}>
        <button
          type="submit"
          aria-label="Sign out"
          className="grid size-9 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-panel-2 hover:text-paper"
        >
          <LogOut className="size-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

export function UserMenuSkeleton() {
  return (
    <div
      className="h-9 w-32 animate-pulse rounded-full bg-panel-2"
      aria-hidden="true"
    />
  );
}
