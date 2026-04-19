"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";

import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

import { Button } from "./Button";
import { Icon } from "./Icon";

const NAV_ITEMS = [
  { key: "home", label: "Home", href: "/" },
  { key: "catalog", label: "Simulations", href: "/catalog" },
] as const;

export function TopNav({ current }: { current?: string }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const viewer = useQuery(api.users.viewer, {});

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <nav className="topnav">
      <Link href="/" className="logo">
        <span className="logo-mark swing" aria-hidden="true" />
        <span>
          Trinity
          <span className="ml-2 font-mono text-[11px] tracking-[0.12em] text-ink-mute">
            SIM LAB
          </span>
        </span>
      </Link>

      <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-ink-soft">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={cn(
              "relative px-1 py-1",
              current === item.key && "text-ink after:absolute after:bottom-[-6px] after:left-0 after:right-0 after:h-[1.5px] after:bg-ink",
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button className="iconbtn" aria-label="Search">
          <Icon name="search" size={16} />
        </button>
        {!isLoading && !isAuthenticated ? (
          <Link href="/login" className="btn ghost">
            Student login
          </Link>
        ) : null}
        {viewer?.isAdmin ? (
          <Link href="/admin" className="btn ghost">
            Admin
          </Link>
        ) : null}
        {!isLoading && isAuthenticated ? (
          <Button onClick={handleSignOut}>
            {viewer?.name ?? "Sign out"} <Icon name="logout" size={15} />
          </Button>
        ) : null}
      </div>
    </nav>
  );
}
