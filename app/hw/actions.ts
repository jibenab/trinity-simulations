"use server";

import { signScore, verifyLaunchToken } from "@/lib/trinity-hw";

export interface ReportResult {
  ok: boolean;
  recorded: boolean;
  score: number;
  maxScore: number;
}

/**
 * Reports a homework score back to the Trinity parent app.
 *
 * Runs on the server: we re-verify the launch token (never trust a client-supplied
 * identity), clamp the score to the max the token authorizes, sign it, and POST to
 * the parent app's callback. The parent app keeps the best score.
 */
export async function reportHomeworkScore(token: string, rawScore: number): Promise<ReportResult> {
  const secret = process.env.ONLINE_HW_SECRET;
  const baseUrl = process.env.TRINITY_APP_URL;
  if (!secret) throw new Error("ONLINE_HW_SECRET is not configured.");
  if (!baseUrl) throw new Error("TRINITY_APP_URL is not configured.");

  const claims = verifyLaunchToken(token, secret);
  if (!claims) throw new Error("This homework link is invalid or has expired.");

  if (typeof rawScore !== "number" || !Number.isFinite(rawScore)) {
    throw new Error("Score must be a number.");
  }

  // Whole number, never below 0 or above the authorized max.
  const score = Math.max(0, Math.min(Math.round(rawScore), claims.maxScore));
  const signature = signScore(claims.homeworkId, claims.studentId, score, secret);

  const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/online-hw/callback`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      homework_id: claims.homeworkId,
      student_id: claims.studentId,
      score,
      max_score: claims.maxScore,
      signature,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Trinity callback failed (${res.status}). ${detail}`.trim());
  }

  const data = (await res.json().catch(() => ({}))) as { recorded?: boolean };
  return { ok: true, recorded: Boolean(data.recorded), score, maxScore: claims.maxScore };
}
