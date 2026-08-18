import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { PublicOutcomeSchema } from "@/lib/contracts";
import { hashedActor, readBoundedJson, sameOrigin, takeLocalRateLimit } from "@/lib/request-safety";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  let config;
  try { config = getConfig(); }
  catch { return NextResponse.json({ error: "Teknoh is not configured." }, { status: 503 }); }
  const actor = hashedActor(request, config.TEKNOH_ENGINE_TOKEN);
  if (!takeLocalRateLimit(`outcome:${actor}`, config.TEKNOH_PUBLIC_RATE_LIMIT_PER_HOUR * 4)) {
    return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  }
  let body: unknown;
  try { body = await readBoundedJson(request, 2_048); }
  catch { return NextResponse.json({ error: "Invalid outcome." }, { status: 400 }); }
  const parsed = PublicOutcomeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid outcome." }, { status: 400 });
  try {
    const response = await fetch(`${config.TEKNOH_ENGINE_URL.replace(/\/$/, "")}/api/outcomes`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${config.TEKNOH_ENGINE_TOKEN}` },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error("OUTCOME_REJECTED");
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Feedback could not be saved." }, { status: 502 });
  }
}
