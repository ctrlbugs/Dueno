# Store → API migration checklist

Quick reference while implementing the backend. Full plan: [BACKEND_PLAN.md](./BACKEND_PLAN.md).

## Feature flag

```env
VITE_USE_API=false   # localStorage (current default)
VITE_USE_API=true    # call /api/v1/* via apiClient.ts
```

Each store should branch:

```typescript
import { isApiEnabled, apiRequest } from "./apiClient";

export const getListings = async () => {
  if (!isApiEnabled()) return readListingsFromLocalStorage();
  return apiRequest("/listings", { auth: true });
};
```

---

## File-by-file

| # | Store / service | Storage key / event | API replacement | Done |
|---|-----------------|---------------------|-----------------|------|
| 1 | `publishedListingsStore.ts` | `_DUENO_PUBLISHED_LISTINGS` | `GET /listings?status=approved` | ⬜ |
| 2 | `listingQueueStore.ts` | `_DUENO_PENDING_LISTINGS` | Listing CRUD + queue | ⬜ |
| 3 | `listingPublishService.ts` | (calls above) | `POST /listings/:id/approve` | ⬜ |
| 4 | `buyerStore.ts` | `_DUENO_BUYERS` | `POST /auth/register/buyer` | ⬜ |
| 5 | `agentStore.ts` | `_DUENO_AGENTS` | `/agents`, `/auth/register/agent` | ⬜ |
| 6 | `authService.ts` | `_DUENO_SESSION` | `POST /auth/login`, JWT | ⬜ |
| 7 | `admin/services/adminAuth.ts` | `_DUENO_ADMIN_AUTH` | Same JWT, role=admin | ⬜ |
| 8 | `messageStore.ts` | `_DUENO_CONVERSATIONS` | `/conversations/*` | ⬜ |
| 9 | `propertyReviewStore.ts` | `_DUENO_PROPERTY_*` | `/properties/:id/reviews` | ⬜ |
| 10 | `ListingForm.tsx` | base64 images | `POST /uploads/presign` | ⬜ |
| 11 | `AgentRegistrationForm.tsx` | base64 KYC | `POST /uploads/presign` | ⬜ |

## UI subscribers to replace

| Event | Replace with |
|-------|--------------|
| `dueno-published-updated` | React Query refetch or SSE later |
| `dueno-agents-updated` | Refetch `/agents` |
| `dueno-messages-updated` | Refetch `/conversations` |
| `dueno-reviews-updated` | Refetch reviews endpoint |
| `dueno-session-updated` | Auth context from `/auth/me` |

## Static catalog

`estateProperties.ts` stays in the repo until you run a one-time seed script. API `GET /listings` should merge:

1. SQL rows where `status = approved`
2. Static catalog minus `static_listing_overrides.is_hidden`

Same logic as today’s `getMergedProperties()`.
