// Trinity parent-app homework integration (server-only).
//
// A student arrives at /hw/<slug>?th=<token>. The token is minted by the Trinity
// parent app and carries the student + homework identity, signed with a secret
// shared by both apps. We verify it here (no login needed — the token IS the
// identity), and after the quiz we sign + report the score back.
//
// The HMAC scheme MUST match the parent app exactly:
//   token     = base64url(JSON(claims)) + "." + base64url(HMAC_SHA256(secret, payloadB64))
//   scoreSig  = base64url(HMAC_SHA256(secret, "homeworkId:studentId:score"))

import { createHmac, timingSafeEqual } from "node:crypto";

export interface LaunchClaims {
  homeworkId: string;
  studentId: string;
  maxScore: number;
  exp: number; // epoch seconds
}

function isLaunchClaims(value: unknown): value is LaunchClaims {
  if (!value || typeof value !== "object") return false;
  const claims = value as Record<string, unknown>;
  return (
    typeof claims.homeworkId === "string" &&
    typeof claims.studentId === "string" &&
    typeof claims.maxScore === "number" &&
    Number.isFinite(claims.maxScore) &&
    typeof claims.exp === "number" &&
    Number.isFinite(claims.exp)
  );
}

/** Verifies the ?th= launch token. Returns the claims, or null if invalid/expired. */
export function verifyLaunchToken(
  token: string,
  secret: string,
  nowSeconds: () => number = () => Math.floor(Date.now() / 1000),
): LaunchClaims | null {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadB64, sig] = parts;
  if (!payloadB64 || !sig) return null;

  const expected = createHmac("sha256", secret).update(payloadB64).digest("base64url");
  const received = Buffer.from(sig);
  const expectedBuffer = Buffer.from(expected);
  if (received.length !== expectedBuffer.length || !timingSafeEqual(received, expectedBuffer)) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (!isLaunchClaims(parsed)) return null;
  if (parsed.exp < nowSeconds()) return null;
  return parsed;
}

/** Signs a score the way the parent app's callback expects. */
export function signScore(
  homeworkId: string,
  studentId: string,
  score: number,
  secret: string,
): string {
  return createHmac("sha256", secret)
    .update(`${homeworkId}:${studentId}:${score}`)
    .digest("base64url");
}
