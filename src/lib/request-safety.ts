import { createHmac } from "node:crypto";

const buckets = new Map<string, { hour: string; count: number }>();

export function hashedActor(request: Request, secret: string): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const identifier = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHmac("sha256", secret).update(identifier).digest("hex");
}

export function takeLocalRateLimit(actor: string, limit: number, now = new Date()): boolean {
  const hour = now.toISOString().slice(0, 13);
  if (buckets.size > 10_000) {
    for (const [key, bucket] of buckets) if (bucket.hour !== hour) buckets.delete(key);
  }
  const current = buckets.get(actor);
  if (!current || current.hour !== hour) {
    buckets.set(actor, { hour, count: 1 });
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}

export async function readBoundedJson(request: Request, maxBytes = 8_192): Promise<unknown> {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");
  return JSON.parse(text);
}

export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
