import { redirect } from "next/navigation";

import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import { isAdminEmail } from "@/lib/isAdmin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchAuthQuery(api.auth.getCurrentUser, {}).catch(
    () => null,
  );
  if (!user?.email || !isAdminEmail(user.email)) {
    redirect("/catalog");
  }

  return <>{children}</>;
}
