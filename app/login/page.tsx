import { redirect } from "next/navigation";

import { LoginCard } from "@/components/LoginCard";
import { TopNav } from "@/components/TopNav";
import { isAuthenticated } from "@/lib/auth-server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  if (await isAuthenticated()) {
    redirect(params.next ?? "/catalog");
  }

  return (
    <div className="shell">
      <TopNav current="home" />
      <LoginCard />
    </div>
  );
}
