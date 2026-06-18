# Dashboard UI

Shared Bootstrap dashboard shell for Dueno **admin** (`/admin/*`) and **agent** (`/agent/*`) portals.

The public marketing site in `src/feature-module/` does not use this package.

## Import alias

```ts
import { ThemeProvider } from "@dashboard-ui/common/context";
import "@dashboard-ui/assets/scss/app.scss";
import AppMenu from "@dashboard-ui/Layouts/Menu";
```

Vite maps `@dashboard-ui` → `src/dashboard-ui` (see `vite.config.ts`).

## What Dueno uses

| Module | Purpose |
|--------|---------|
| `assets/scss/app.scss` | Layout, sidebar, topbar, components |
| `common/context` | Theme provider |
| `Layouts/Menu.tsx` | Sidebar navigation |
| `constants/menu.ts` | `MenuItemTypes` interface |
| `hooks/useViewPort.ts` | Responsive sidebar |
| `utils/layout.ts` | DOM attribute helpers |

Menu items are defined in `src/admin/constants/adminMenu.ts` and `src/agent/constants/agentMenu.ts`.

## Note

Most files in this folder are unused template demo code from the original Velonic theme. Only the modules above are required at runtime.
