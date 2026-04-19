import { redirect } from "next/navigation";

import { LeaderboardClient } from "@/components/LeaderboardClient";
import { isAuthenticated } from "@/lib/auth-server";

export default async function LeaderboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const { slug } = await params;
  return <LeaderboardClient slug={slug} />;
}
