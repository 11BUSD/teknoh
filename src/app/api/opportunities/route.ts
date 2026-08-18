import { NextResponse } from "next/server";
import { getConfig } from "@/lib/config";
import { PublicEngineResponseSchema, PublicThesisSchema } from "@/lib/contracts";
import { hashedActor, readBoundedJson, sameOrigin, takeLocalRateLimit } from "@/lib/request-safety";

export const maxDuration = 240;

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Request rejected." }, { status: 403 });
  let config;
  try { config = getConfig(); }
  catch { return NextResponse.json({ error: "Teknoh is not configured." }, { status: 503 }); }
  const actor = hashedActor(request, config.TEKNOH_ENGINE_TOKEN);
  if (!takeLocalRateLimit(actor, config.TEKNOH_PUBLIC_RATE_LIMIT_PER_HOUR)) {
    return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429, headers: { "retry-after": "3600" } });
  }
  let body: unknown;
  try { body = await readBoundedJson(request); }
  catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const parsed = PublicThesisSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({error:"Invalid request."},{status:400});
  try {
    const response = await fetch(`${config.TEKNOH_ENGINE_URL.replace(/\/$/,"")}/api/opportunities/search`, {
      method:"POST",
      headers:{"content-type":"application/json",authorization:`Bearer ${config.TEKNOH_ENGINE_TOKEN}`,"x-teknoh-actor":actor},
      body:JSON.stringify(parsed.data),
      cache:"no-store",
      redirect:"error",
      signal:AbortSignal.timeout(225_000),
    });
    if (!response.ok) {
      const status = response.status === 429 ? 429 : response.status === 401 ? 503 : 502;
      const message = status === 429 ? "Research capacity has been reached. Try again later." : "Research is temporarily unavailable.";
      return NextResponse.json({ error: message }, { status });
    }
    const text = await response.text();
    if (Buffer.byteLength(text, "utf8") > 1_000_000) throw new Error("ENGINE_RESPONSE_TOO_LARGE");
    const publicResult = PublicEngineResponseSchema.parse(JSON.parse(text));
    return NextResponse.json(publicResult,{headers:{"cache-control":"no-store"}});
  } catch {
    return NextResponse.json({ error: "Research is temporarily unavailable." }, { status: 502 });
  }
}
