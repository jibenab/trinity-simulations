import { redirect } from "next/navigation";

import { CatalogClient } from "@/components/CatalogClient";
import { isAuthenticated } from "@/lib/auth-server";

export default async function CatalogPage() {
  if (!(await isAuthenticated())) {
    redirect("/login?next=/catalog");
  }

  return <CatalogClient />;
}
