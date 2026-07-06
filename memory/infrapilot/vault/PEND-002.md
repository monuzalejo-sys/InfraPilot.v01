---
id: PEND-002
type: Pending
tier: Project
status: In-Progress
impact: High
priority: High
lifetime: Sprint
created: 2026-07-01T01:00:00.000Z
updated: 2026-07-05T23:59:00.000Z
---

# PEND-002 — Verify/configure real Supabase credentials end-to-end (local .env + confirm what

**reason:** Phase A DONE 2026-07-02 (verified PASS 5/5). 2026-07-03: local creds configured (.env.local, gitignored). 2026-07-05 10:30 UTC: Supabase migrations 000_initial_schema + 001_prices_apus ALREADY APPLIED by user (6 tables present, 200 response via /api/*); login/register real-user auth VERIFIED (test user prommter.ai.agency+infrapilot-test@gmail.com exists in Supabase Auth, RLS active per /api/prices <- logged in user sees items: []). Write test blocked by Claude Code agent permission classifier (DB shared, real data, no explicit write approval). STILL PENDING by user: vars on Vercel (NEXT_PUBLIC_SUPABASE_URL + ANON_KEY + GROQ_API_KEY), GitHub-Vercel Git link confirm, production write verification. Core auth path now proven 100% working; Supabase is ready.

**task:** Verify/configure real Supabase credentials end-to-end (local .env + confirm what's actually set on Vercel), so login, register, and data persistence work for real instead of only via mock data files.

**Depende de:** [[KN-010]]

**Referenciado por:** [[KN-013]]

