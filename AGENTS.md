<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Project: Rezify

**Product:** AI-powered Rezify Studio for print shops at **rezify.io**. Customers embed the Rezify Studio on their site, end users generate designs with AI, shop owners approve and download print-ready files using credits.

**Repos:**
- Frontend (Next.js / Vercel): `seanknightTYG/rezify`
- Backend (Express / Railway): `seanknightTYG/rezify-API`

**Local paths:**
- Frontend: `C:\webdev\rezify\rezify\`
- API: `C:\webdev\rezify\rezify-API\`

**Deployments:**
- Frontend: Vercel → `rezify.io`
- API: Railway → `api.rezify.io` (service: `99rezify-api`)

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Clerk auth, vanilla CSS (landing), Tailwind-style utility classes (dashboard) |
| Backend | Node.js / Express 5 on Railway |
| Database | Neon PostgreSQL (with Row-Level Security per tenant) |
| AI Model | `gemini-3-pro-image-preview` (Nano Banana Pro) — **DO NOT change this model string without explicit instruction** |
| Upscaler | Real-ESRGAN on RunPod Serverless |
| Storage | Google Cloud Storage bucket `rezify-files` |
| Billing | Stripe (subscriptions + one-time credit packs) |
| Email | Resend |

---

## Current Build State (as of April 19, 2026)

- Branch `feature/pricing-v2` is **complete** and awaiting browser QA before merge to `main`
- Migration `001_pricing_v2.sql` has been applied to production Neon database
- All 7 smoke tests passed (see `scripts/smoke-test.js` in API repo)
- 9 Stripe products created in test mode (4 subscriptions + 5 credit packs)

---

## Pricing Model (V2 — DO NOT revert to old prices)

### Subscriptions

| Plan | Monthly | Annual (billed upfront) | Free Month Credit |
|---|---|---|---|
| Shop | $19/mo (`STRIPE_PRICE_SHOP_MONTHLY`) | $209/yr (`STRIPE_PRICE_SHOP_ANNUAL`) | $19 credit on first annual payment |
| Studio | $29/mo (`STRIPE_PRICE_STUDIO_MONTHLY`) | $319/yr (`STRIPE_PRICE_STUDIO_ANNUAL`) | $29 credit on first annual payment |

Free month mechanic: Posted as `subscription_bonus` credit type in the `credits` table. Tracked by `tenants.subscription_bonus_credited` boolean to prevent duplicate credits on webhook retry.

### Credit Packs

| Pack | Downloads | Price | Per File | First-Time Bonus |
|---|---|---|---|---|
| Starter | 10 | $69.00 | $6.90 | None |
| Shop Pack | 25 | $149.00 | $5.96 | None |
| Pro Pack | 50 + 10 free | $229.00 | $3.82 effective | 10 bonus on first purchase |
| Bulk Pack | 100 + 25 free | $399.00 | $3.19 effective | 25 bonus on first purchase |
| Studio Pack | 250 + 50 free | $849.00 | $2.83 effective | 50 bonus on first purchase |

First-time bonus tracked in `tenant_pack_history`, applied once per tier per tenant.

### Cost Model (internal reference)
- Draft cost: ~$0.134/image at 2K (Nano Banana Pro)
- Upscale: ~$0.003 (Real-ESRGAN / RunPod)
- Total cost per unlock: ~$0.76–$1.43 depending on draft count

---

## Key Architecture Decisions

- **Tenant isolation**: Row-Level Security on all tables via `app.current_tenant_id` session variable
- **Subscription enforcement**: `/api/v1/generate` returns `402` when `subscription_status = 'canceled'` or `past_due` beyond 7-day grace period
- **Webhook idempotency**: All Stripe events logged to `webhook_events` with unique `stripe_event_id` — duplicates are skipped
- **Credit transactions**: All DB writes touching `credits` or `subscription_status` are wrapped in transactions with `BEGIN/COMMIT/ROLLBACK`
- **Rezify Studio messages**: Error messages on the Rezify Studio are customer-neutral — they never expose Rezify subscription details to end customers

---

## Known Issues / Next Steps

- `middleware.ts` deprecation warning — needs renaming to `proxy.ts` per Next.js 16 convention
- Browser QA walkthrough pending before merge to `main`
- Resend domain verification still pending (email notifications not sending in production)
- RunPod Real-ESRGAN endpoint needs production configuration
- Clerk auth middleware in API (`src/middleware/auth.js`) is still using stub mode — needs real JWT verification before production launch
- `STRIPE_WEBHOOK_SECRET` is not yet set — needs to be configured in Railway env vars and locally after running `stripe listen`

---

## Rules for AI Agents

1. **Never commit `.env` or `.env.local`** — only `.env.example` with blank values
2. **Always work on a feature branch** — never commit directly to `main`
3. **All DB writes touching credits or subscription_status must be in transactions** — `BEGIN` / `COMMIT` / `ROLLBACK` with proper error handling
4. **Never change the Gemini model string** without explicit instruction from Sean
5. **Rezify Studio error messages must be customer-neutral** — never expose Rezify subscription details to end customers
6. **Do not touch the RunPod / Real-ESRGAN upscale pipeline** unless explicitly asked
7. **Do not touch the lead capture system** unless explicitly asked
8. **Do not touch the watermarking logic** unless explicitly asked
9. **Do not touch the `pending_refunds` credit refund flow** unless explicitly asked
10. **Stripe webhook signature verification must remain on every webhook call** — never bypass it
11. **Pack keys in the API** are: `starter`, `shop_pack`, `pro_pack`, `bulk_pack`, `studio_pack` — do not rename without updating all references (API, frontend, Stripe metadata, webhook handler)
