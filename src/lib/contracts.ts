import { z } from "zod";

export const PublicThesisSchema = z.object({
  offer: z.string().min(3).max(800),
  buyer: z.string().min(2).max(400),
  geography: z.string().min(2).max(200),
  price: z.string().max(120).optional().default(""),
  problems: z.string().min(3).max(1_200),
}).strict();

const PublicEvidenceSchema = z.object({
  claim: z.string().min(1).max(1_000),
  sourceUrl: z.string().url().refine((value) => value.startsWith("https://")),
  sourceDate: z.string().optional(),
  sourceType: z.enum(["x", "web", "job", "review", "procurement", "other"]),
  strength: z.number().min(0).max(1),
});

export const PublicOpportunitySchema = z.object({
  id: z.string().min(1).max(120),
  company: z.string().min(1).max(300),
  observedProblem: z.string().min(1).max(1_000),
  observedFacts: z.array(z.string().min(1).max(1_000)).max(20),
  inference: z.string().min(1).max(1_000),
  evidence: z.array(PublicEvidenceSchema).max(20),
  negativeEvidence: z.array(z.string().min(1).max(1_000)).max(20),
  whyNow: z.string().min(1).max(1_000),
  score: z.number().min(0).max(100),
  confidence: z.number().min(0).max(1),
  estimatedValue: z.string().max(200).optional(),
  estimatedValueIsEstimate: z.literal(true),
  suggestedNextAction: z.string().min(1).max(500),
  risks: z.array(z.string().min(1).max(1_000)).max(20),
  classification: z.enum(["REJECT", "WATCH", "QUALIFIED", "HIGH_INTENT", "EXPLICIT_BUYER_INTENT"]),
});

export const PublicEngineResponseSchema = z.object({
  requestId: z.string().uuid(),
  opportunities: z.array(PublicOpportunitySchema).max(8),
  rejectedCount: z.number().int().nonnegative().max(10_000),
});

export const PublicOutcomeSchema = z.object({
  requestId: z.string().uuid(),
  opportunityId: z.string().min(1).max(120),
  outcome: z.enum(["accepted", "rejected"]),
  failureReason: z.enum(["weak_evidence", "bad_fit", "stale", "unreachable", "no_budget", "competitor", "timing", "other"]).optional(),
}).strict();

export type PublicEngineResponse = z.infer<typeof PublicEngineResponseSchema>;
