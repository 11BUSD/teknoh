# Teknoh

Teknoh is an evidence-first opportunity intelligence interface for people who sell products or services.

A user describes what they sell, who buys it, where they operate, and what a good opportunity looks like. Teknoh returns a small set of evidence-backed opportunities with source references, confidence, and a recommended next step.

## What this repository contains

This repository contains only Teknoh's public-facing web experience and the narrow server-side proxy contract required to communicate with the private Teknoh engine.

It intentionally does **not** contain proprietary ranking logic, search strategies, signal taxonomies, economic controls, evaluation suites, private prompts, provider orchestration, or learning logic.

## Product principles

- Evidence over volume.
- Facts and inferences are visibly separated.
- No automated outreach by default.
- No hidden enrichment of private personal data.
- Users remain in control of consequential actions.
- Weak opportunities should be rejected rather than padded into a list.

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Set `TEKNOH_ENGINE_URL` and `TEKNOH_ENGINE_TOKEN` only on the server. Never expose the private engine token through a `NEXT_PUBLIC_` variable.

## Deployment

The public web application can be deployed independently of the private engine. Configure the two server-only environment variables in the hosting platform and point `teknoh.tech` to this public deployment.

## Security

See [SECURITY.md](./SECURITY.md). Do not submit credentials, API keys, private datasets, or personal information in issues.

## License

Copyright © 2026 Teknoh. All rights reserved. No license is granted to copy, modify, redistribute, or create derivative works from this repository unless Teknoh expressly provides one in writing.
