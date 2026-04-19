import { redirect } from "next/navigation";

import { RunnerClient } from "@/components/RunnerClient";
import { isAuthenticated } from "@/lib/auth-server";

export default async function SimulationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAuthenticated())) {
    redirect("/login");
  }

  const { slug } = await params;
  return <RunnerClient slug={slug} expectedType="simulation" />;
}
