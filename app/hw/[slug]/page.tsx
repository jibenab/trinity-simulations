import { HwRunnerClient } from "@/components/HwRunnerClient";
import { verifyLaunchToken } from "@/lib/trinity-hw";

// Public homework launch page. No login: the ?th= token carries the student's
// identity (minted + signed by the Trinity parent app). This route deliberately
// sits outside the middleware's PROTECTED_PREFIXES so it is reachable signed-out.
export default async function HwPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ th?: string }>;
}) {
  const { slug } = await params;
  const { th } = await searchParams;

  const secret = process.env.ONLINE_HW_SECRET;
  const claims = th && secret ? verifyLaunchToken(th, secret) : null;

  if (!claims) {
    return (
      <main className="shell flex min-h-[60dvh] flex-col items-center justify-center py-20 text-center">
        <div className="eyebrow text-ink-mute">Trinity Homework</div>
        <h1 className="display mt-4 text-[40px] font-semibold">Link expired</h1>
        <p className="mt-4 max-w-md text-[17px] text-ink-soft">
          This homework link is no longer valid. Please reopen it from the Trinity app
          to get a fresh link.
        </p>
      </main>
    );
  }

  return <HwRunnerClient slug={slug} token={th!} maxScore={claims.maxScore} />;
}
