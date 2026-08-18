import { describe, expect, it } from "vitest";
import { getConfig } from "@/lib/config";
import { hashedActor, readBoundedJson, sameOrigin, takeLocalRateLimit } from "@/lib/request-safety";

describe("public request safety", () => {
  it("requires HTTPS for a remote engine", () => {
    expect(() => getConfig({TEKNOH_ENGINE_URL:"http://engine.example.com",TEKNOH_ENGINE_TOKEN:"a".repeat(32)})).toThrow();
  });

  it("hashes addresses instead of forwarding raw IP data", () => {
    const request = new Request("https://teknoh.tech/api/opportunities", {headers:{"x-forwarded-for":"203.0.113.7"}});
    const actor = hashedActor(request, "a".repeat(32));
    expect(actor).toMatch(/^[a-f0-9]{64}$/);
    expect(actor).not.toContain("203.0.113.7");
  });

  it("enforces the local hourly limit", () => {
    const now = new Date("2026-08-18T12:15:00Z");
    expect(takeLocalRateLimit("test-actor", 1, now)).toBe(true);
    expect(takeLocalRateLimit("test-actor", 1, now)).toBe(false);
  });

  it("rejects oversized bodies and cross-origin posts", async () => {
    const oversized = new Request("https://teknoh.tech/api/opportunities", {method:"POST",body:"x".repeat(20)});
    await expect(readBoundedJson(oversized, 10)).rejects.toThrow("PAYLOAD_TOO_LARGE");
    const crossOrigin = new Request("https://teknoh.tech/api/opportunities", {headers:{origin:"https://evil.example"}});
    expect(sameOrigin(crossOrigin)).toBe(false);
  });
});
