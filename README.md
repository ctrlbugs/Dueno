# Dueno Property

Public real estate site + admin/agent portals.

## Structure

```
src/                    Application source
  feature-module/       Public site pages & routes
  admin/                /admin/* portal
  agent/                /agent/* portal
  dashboard-ui/         Shared admin/agent dashboard shell (Bootstrap)
  core/                 Header, footer, shared UI
  data/                 Site content & listings
  services/             Client-side stores (messages, listings)
public/                 Static assets (images, favicon)
server/                 Production server
docs/                   Planning docs
```

## Dev

```bash
npm install
npm run dev
```

Home: `http://localhost:5173/home`

## Production routes

| Area | Paths |
|------|-------|
| Home | `/home` |
| Buy / Rent | `/buy-property`, `/rent-property`, `/buy-details/:slug`, `/rent-details/:slug` |
| Services | `/services`, `/services/:slug` |
| Agents | `/agent-list`, `/dueno-agent/:id` |
| Auth | `/signin`, `/signup` |
| Admin | `/admin/*` |
| Agent portal | `/agent/*` |

Legacy template demo routes (alternate home layouts, agency pages, checkout, etc.) were removed from the router.

## Cleanup note

Admin and agent portals import from `src/dashboard-ui/` via the `@dashboard-ui` alias.
