import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await fetchAuthQuery(api.users.isAdmin, {}).catch(() => false);
  if (!isAdmin) {
    redirect("/catalog");
  }

  return <>{children}</>;
}
