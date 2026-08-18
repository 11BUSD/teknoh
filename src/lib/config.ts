import { z } from "zod";

const EnvSchema = z.object({
  TEKNOH_ENGINE_URL: z.string().url().refine((value) => {
    const url = new URL(value);
    return url.protocol === "https:" || ["localhost", "127.0.0.1"].includes(url.hostname);
  }, "Engine URL must use HTTPS outside local development."),
  TEKNOH_ENGINE_TOKEN: z.string().min(32),
  TEKNOH_PUBLIC_RATE_LIMIT_PER_HOUR: z.coerce.number().int().positive().max(100).default(10),
});

export type PublicConfig = z.infer<typeof EnvSchema>;

export function getConfig(environment: Record<string, string | undefined> = process.env): PublicConfig {
  return EnvSchema.parse(environment);
}
