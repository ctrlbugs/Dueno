
# Dueno Backend Plan (lean, low-cost)

This plan matches the **current frontend** (`localStorage` stores, base64 uploads) and describes the smallest path to a real multi-user backend.

## Goals

- One source of truth for agents, listings, messages, and reviews
- Real file storage for photos and KYC documents (not base64 in the browser)
- Keep monthly cost under **~$15–30** at early traffic
- Avoid heavy AWS (no ECS, Lambda fleets, Aurora, etc.)

---

## Target architecture

```mermaid
flowchart TB
  subgraph client [Browser]
    React[React SPA]
  end

  subgraph host [Small VPS or Railway]
    Nginx[Nginx / Caddy]
    Node[Node API — extend server/]
    Static[dist/ static files]
  end

  subgraph data [Managed services]
    PG[(Postgres — Neon or VPS)]
    R2[Cloudflare R2 — images]
    Email[Resend — optional emails]
  end

  React --> Nginx
  Nginx --> Static
  React -->|/api/v1/*| Node
  Node --> PG
  Node --> R2
  Node --> Email
```

### Recommended stack (small)

| Layer | Choice | Why |
|-------|--------|-----|
| Database | **Postgres** (Neon free tier or Docker on VPS) | Fits listings, auth, messages, reviews |
| API | **Node** (extend `server/production.mjs`) | Already in repo; same language as frontend types |
| Files | **Cloudflare R2** | S3-compatible, cheap, no egress fees |
| Hosting | **Hetzner CPX11** (~€4.5/mo) or **Railway** | One box runs API + static site |
| CDN | **Cloudflare** (free) | SSL + caching |
| Email (later) | **Resend** free tier | Agent approved / enquiry alerts |

### Skip for now

- AWS (EC2 + RDS + S3 + CloudFront)
- Redis, Kafka, Elasticsearch
- Microservices
- Mobile push / SMS gateways

---

## Postgres schema

Full SQL: [`server/schema/001_initial.sql`](../server/schema/001_initial.sql)

### Core tables

| Table | Purpose |
|-------|---------|
| `users` | Buyers, agents, admins (single auth table) |
| `agent_profiles` | Agent status, agency, avatar URL, KYC JSON |
| `listings` | Sale/rent listings (agent + admin created) |
| `listing_images` | Gallery + floor plan URLs |
| `conversations` | Property enquiries |
| `messages` | Thread messages |
| `property_reviews` | Star reviews + reactions JSON |
| `property_review_replies` | Nested replies |
| `property_feedback` | General/issue/praise feedback |
| `property_engagement` | Saves, bookmarks, visit counts |
| `static_listing_overrides` | Hide/edit catalog properties from `estateProperties.ts` |
| `uploads` | Audit trail for R2 objects (KYC, listing media) |

### Design notes

- **Passwords**: `password_hash` only (bcrypt). Never store plain text.
- **KYC / registration**: `agent_profiles.registration_json` (JSONB) mirrors `AgentRegistrationDetails` — URLs inside JSON point to R2, not data URLs.
- **Listing features / FAQs / landmarks**: JSONB columns mirror current TypeScript shapes — fast to ship, normalize later if needed.
- **Static catalog**: Keep seed data in `estateProperties.ts` for v1; DB stores agent listings + overrides. Merge in API (same as today’s `getMergedProperties()`).
- **Guests**: Enquiries allow `buyer_id` NULL with `buyer_email` stored on conversation.

---

## API endpoints (`/api/v1`)

### Auth (replace `authService.ts`, `adminAuth.ts`)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/auth/login` | Returns JWT + user profile + redirect hint |
| POST | `/auth/register/buyer` | Buyer signup |
| POST | `/auth/register/agent` | Agent signup + `registration_json` |
| POST | `/auth/logout` | Client clears token; optional blocklist later |
| GET | `/auth/me` | Current user from JWT |

### Uploads (replace base64 in forms)

| Method | Path | Notes |
|--------|------|-------|
| POST | `/uploads/presign` | Returns R2 presigned PUT URL + public URL |
| POST | `/uploads/confirm` | Records `uploads` row after client PUT |

*Alternative v1:* multipart `POST /uploads` through API (simpler, slightly more server load).

### Agents (replace `agentStore.ts`)

| Method | Path | Role |
|--------|------|------|
| GET | `/agents` | Admin — list with `?status=` |
| GET | `/agents/:id` | Admin or self |
| PATCH | `/agents/:id/status` | Admin approve/reject/suspend |
| PATCH | `/agents/:id` | Admin notes, trust score |
| GET | `/agents/:id/public` | Public agent profile page |

### Listings (replace `listingQueueStore.ts` + `publishedListingsStore.ts`)

| Method | Path | Role |
|--------|------|------|
| GET | `/listings` | Public — `?type=sale|rent&location=&status=approved` |
| GET | `/listings/:slug` | Public detail |
| POST | `/listings` | Agent/admin create (pending) |
| PATCH | `/listings/:id` | Agent own draft; admin any |
| POST | `/listings/:id/submit` | Agent → pending review |
| POST | `/listings/:id/approve` | Admin → published |
| POST | `/listings/:id/reject` | Admin |
| DELETE | `/listings/:id` | Agent own or admin |
| GET | `/listings/queue` | Admin pending queue |

### Messages (replace `messageStore.ts`)

| Method | Path | Role |
|--------|------|------|
| GET | `/conversations` | Filter by role (buyer/agent/admin) |
| GET | `/conversations/:id` | Participant only |
| POST | `/conversations` | Create enquiry (buyer or guest) |
| POST | `/conversations/:id/messages` | Reply |
| POST | `/conversations/:id/read` | Clear unread flags |

### Reviews (replace `propertyReviewStore.ts`)

| Method | Path | Role |
|--------|------|------|
| GET | `/properties/:id/reviews` | Public list + summary |
| POST | `/properties/:id/reviews` | Logged-in buyer |
| POST | `/reviews/:id/reactions` | Toggle reaction |
| POST | `/reviews/:id/replies` | Reply thread |
| POST | `/properties/:id/feedback` | Feedback form |
| POST | `/properties/:id/engagement` | Save/bookmark/visit bump |

### Health

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | DB connectivity check |

---

## Store → API migration order

Migrate in this order so each phase is testable without breaking the site.

### Phase 1 — Foundation (week 1)

| Current file | Replace with | Priority |
|--------------|--------------|----------|
| — | Postgres + `001_initial.sql` | **First** |
| — | `GET /api/v1/health` | **First** |
| `publishedListingsStore.ts` | `GET/POST /listings` (approved only public) | High |
| `listingQueueStore.ts` | Listing CRUD + approve/reject | High |

**Frontend:** Add `src/services/apiClient.ts` + `listingApi.ts`. Feature-flag: `VITE_USE_API=true` falls back to localStorage when false.

### Phase 2 — Users & auth (week 2)

| Current file | Replace with |
|--------------|--------------|
| `buyerStore.ts` | `/auth/register/buyer`, users table |
| `agentStore.ts` | `/auth/register/agent`, `/agents/*` |
| `authService.ts` | `/auth/login`, JWT in memory + httpOnly cookie |
| `admin/services/adminAuth.ts` | Same auth, role = admin |

**Security:** Remove passwords from `devAccounts.ts` in production; seed via SQL migration only on staging.

### Phase 3 — Media (week 2–3)

| Current file | Replace with |
|--------------|--------------|
| `ListingForm.tsx` (base64) | Presign upload → R2 URL in payload |
| `AgentRegistrationForm.tsx` (base64) | Same |
| `listingPublishService.ts` | API builds `EstateProperty` from DB row |

### Phase 4 — Messaging & engagement (week 3)

| Current file | Replace with |
|--------------|--------------|
| `messageStore.ts` | `/conversations/*` |
| `propertyReviewStore.ts` | `/properties/:id/reviews`, engagement |

### Phase 5 — Polish (week 4+)

- Email on agent approval + new enquiry (Resend)
- Nightly Postgres backup (pg_dump → R2)
- Rate limiting on auth + upload routes
- Full-text search on `listings.title` + `address` (Postgres `tsvector`)

### Keep as-is initially

| File | Reason |
|------|--------|
| `estateProperties.ts` (static catalog) | Seed content; merge via API until optional SQL import |
| `propertyNewsService.ts` | Already uses server proxy; no DB needed |
| News API keys in `.env` | Unchanged |

---

## Environment variables

Add to `.env` (see `.env.example`):

```env
DATABASE_URL=postgresql://dueno:dueno@localhost:5432/dueno
JWT_SECRET=change-me-in-production
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=dueno-uploads
R2_PUBLIC_BASE_URL=https://pub-xxx.r2.dev
VITE_API_BASE_URL=/api/v1
VITE_USE_API=false
```

---

## Local development

```bash
# 1. Start Postgres
docker compose up -d

# 2. Apply schema
docker compose exec postgres psql -U dueno -d dueno -f /schema/001_initial.sql

# 3. Run app (unchanged until API routes land)
npm run dev
```

When API routes are added:

```bash
npm run build
npm run start   # server/production.mjs serves dist + /api/v1
```

---

## Deployment (small VPS)

1. Point domain to Cloudflare
2. VPS: install Node 20+, Docker (optional for Postgres), Caddy
3. Clone repo, `npm run build`, `npm run start` with systemd
4. Postgres: Neon (managed) **or** Postgres container on same VPS for lowest cost
5. R2 bucket for `dueno-uploads`; CORS for browser presigned PUT
6. Set `JWT_SECRET`, `DATABASE_URL` on server only — never `VITE_*` for secrets

**Estimated cost**

| Item | Monthly |
|------|---------|
| Hetzner CPX11 | ~€4.5 |
| Neon Postgres free tier | $0 |
| Cloudflare R2 (<10 GB) | ~$0–2 |
| Resend (optional) | $0 |
| **Total** | **~$5–15** |

---

## Next implementation steps (in repo)

1. ✅ `server/schema/001_initial.sql` — schema
2. ✅ `docker-compose.yml` — local Postgres
3. ⬜ `server/api/` — Express/Fastify router mounted in `production.mjs`
4. ⬜ `src/services/apiClient.ts` — fetch wrapper + JWT
5. ⬜ `listingApi.ts` — first migrated domain
6. ⬜ `VITE_USE_API` feature flag in `listingQueueStore.ts`

Start with **listings + health check** — that unlocks admin/agent workflows and public property pages without touching reviews yet.
