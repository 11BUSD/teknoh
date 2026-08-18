import { describe, expect, it } from "vitest";
import { PublicEngineResponseSchema } from "@/lib/contracts";

describe("public response boundary", () => {
  it("strips private engine-only fields", () => {
    const result = PublicEngineResponseSchema.parse({
      requestId: "00000000-0000-4000-8000-000000000001",
      rejectedCount: 1,
      notes: ["private provider note"],
      opportunities: [{
        id: "op-1",
        company: "Example Co",
        observedProblem: "Public problem",
        observedFacts: ["Public fact"],
        inference: "Possible fit",
        evidence: [{claim:"Public claim",sourceUrl:"https://example.com",sourceType:"web",strength:0.8}],
        negativeEvidence: [],
        whyNow: "Recent",
        scoreBreakdown: { evidenceQuality: 25 },
        score: 70,
        confidence: 0.7,
        estimatedValueIsEstimate: true,
        suggestedNextAction: "Human review required: inspect source.",
        risks: [],
        classification: "QUALIFIED",
      }],
    });
    expect(result).not.toHaveProperty("notes");
    expect(result.opportunities[0]).not.toHaveProperty("scoreBreakdown");
  });

  it("rejects non-HTTPS evidence links", () => {
    expect(() => PublicEngineResponseSchema.parse({
      requestId: "00000000-0000-4000-8000-000000000001",
      rejectedCount: 0,
      opportunities: [{
        id:"x",company:"x",observedProblem:"x",observedFacts:["x"],inference:"x",
        evidence:[{claim:"x",sourceUrl:"http://example.com",sourceType:"web",strength:1}],
        negativeEvidence:[],whyNow:"x",score:1,confidence:0.1,estimatedValueIsEstimate:true,
        suggestedNextAction:"Human review required: inspect.",risks:[],classification:"REJECT",
      }],
    })).toThrow();
  });
});
