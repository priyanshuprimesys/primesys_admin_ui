# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server on port 8061 (opens browser automatically)
npm run build     # Type-check (tsc) + Vite production build
npm run lint      # ESLint across src/ (0 max-warnings — must be clean)
npm start         # Serve dist/ on port 8080 (preview built output)
```

Node >=22.9.0 <25, npm >=11.3.0 required. There are no test scripts configured in this project.

## Environment

Copy `.env` and set:

-
- `VITE_USER_API_URL` — user service base URL
- `VITE_WEBSOCKET_URL` — WebSocket endpoint

Dev server proxies `/api` → `http://mykiddytracker.com:8000` (see [vite.config.ts](vite.config.ts)).

## Deployment

The [Dockerfile](Dockerfile) builds with Node 18 and serves via nginx on port 80. Production hosts are allowlisted in `vite.config.ts` under `preview.allowedHosts`.

## Architecture

**Stack:** React 18, TypeScript, Vite, TanStack Query v5, React Router v6, Tailwind CSS, MUI v6, Chakra UI v2, Leaflet/OpenLayers for maps, Highcharts for charts, Axios for HTTP.

No TypeScript path aliases are configured — all imports use relative paths.

### Entry point

[src/main.tsx](src/main.tsx) mounts the app in this exact order:

```
CombineContextProvider → ChakraProvider → QueryClientProvider → RenderRoutes
```

**Critical constraint:** `CombineContextProvider` (and all ~44 providers inside it) sits **outside** `QueryClientProvider`. This means no provider in `CombineContextProvider` can use TanStack Query hooks internally — they can only hold local React state.

### Routing

- All routes are declared in [src/routes/RouteNavigation.tsx](src/routes/RouteNavigation.tsx) as a `RouteNavigationInterface[]` array. Each entry carries `isSidebarMenu` (controls sidebar visibility) and `isPrivate` (controls auth guard).
- [src/routes/RenderRoutes.tsx](src/routes/RenderRoutes.tsx) is the active router — it reads `isAuthenticated` from context, wraps everything in `<BrowserRouter>`, and recursively maps the array to `<Route>` elements. Private routes redirect to `/` when unauthenticated.
- [src/routes/AppRouteNavigation.tsx](src/routes/AppRouteNavigation.tsx) is an **alternative router** (not currently wired into `main.tsx`) — kept as a reference but unused.
- Layout shells live in [src/views/auth/layouts/](src/views/auth/layouts/): `auth/AuthLayout.tsx` (login) and `app/AppLayout.tsx` (admin shell). They are loaded with `React.lazy` + `<Suspense>` in `RouteNavigation.tsx`. All admin page components use **static imports** — lazy-loading for those was tried but is commented out.
- Nested routes use `<Outlet />` in the parent component. The parent conditionally hides its own UI based on `useParams()` (see `ReportConfiguration/index.tsx` which hides the dashboard when `id` param is present).
- The `ReportDivisionConfig` module (`admin/report_configuration/:id`) is a tabbed view driven by a `ReportTabType` union (`REPORT_LOG` | `SUMMARY_REPORT` | `REPORT_MODULE` | `DEVICE_CONFIG` | `TRIP_CONFIG`). The active tab is read from the `?tab=` search param on mount. Tab definitions live in `modules/report_division_config/data/sidebarItems.ts`; each tab renders a dedicated sub-feature from `features/ReportConfiguration/features/`.
- `ReportConfiguration` route is wrapped with `ReportDivisionConfigProvider` at the route level in `RouteNavigation.tsx` (not inside the component tree). This context exposes `divisionId`, `deviceTypeId`, and `reportDate` shared across tabs.

Active sidebar routes:

- `admin/` — Dashboard (currently renders `IssueLLMPage`)
- `admin/all_devices` — Division Devices
- `admin/operations` — Operations
- `admin/device_configuration` — Device Configuration
- `admin/beat_module` — Beat Module (Keyman)
- `admin/device_exchange` — Device Exchange
- `admin/hirearchy_module` — Hierarchy Module
- `admin/device_subscription` — Device Subscription
- `admin/admin_utility` — Admin Utility (nested child: `rdps`)
- `admin/location_utility` — Location Utility (map-based)
- `admin/admin_iot_data` — IOT Data
- `admin/device_inspection` — Device Inspection
- `admin/report_configuration` — Report Configuration (nested child: `:id` → division config)
- `admin/report_email` — Report Email (EmailDashboard — grouped by division, shows mail sent status per device type)
- `admin/logout` — Logout

### Feature modules

All business features live under [src/Admin/features/](src/Admin/features/) and their corresponding page shells under [src/Admin/pages/](src/Admin/pages/). The pattern is: a page in `pages/` composes one or more feature components from `features/`.

Complex features follow this internal structure (not all layers are always present):

```
features/<FeatureName>/
  components/     # UI components local to this feature
  context/        # Feature-level React context providers
  data/           # API functions, TypeScript schemas, and TanStack Query hooks
  features/       # Sub-features (nested feature folders)
  modules/        # Standalone sub-modules with their own routes
  services/       # Alternative location for API functions (older features use this)
  hooks/          # Custom hooks
  utils/          # Helper functions
  interfaces/     # TypeScript interfaces
  index.tsx       # Public export entry point
```

### API layer

Two co-existing patterns:

1. **Central pattern** (older features): plain async functions in [src/api/queries/app/features/](src/api/queries/app/features/), one sub-folder per domain. Query keys centrally defined in [src/api/queries/app/queryKeys/queryKeys.ts](src/api/queries/app/queryKeys/queryKeys.ts).
2. **Feature-local pattern** (newer features like IssueLLM, ReportConfiguration, EmailDashboard): three co-located files:

   - `data/api.ts` — async functions using `axiosApi`
   - `data/schema.ts` — TypeScript interfaces (not Zod) for request/response shapes
   - `data/queryOptions.ts` — TanStack Query hooks (`useQuery`, `useMutation`) that wrap the API functions

   Prefer this pattern for new features.

**Two Axios instances — use the right one:**

| Instance                      | File                                           | Token key                               | Used for                      |
| ----------------------------- | ---------------------------------------------- | --------------------------------------- | ----------------------------- |
| `axiosApi` (default export) | `src/utils/axiosInstance/AxiosConfig.ts`     | `localStorage['auth_id']`             | All admin features            |
| `userAxiosApi`              | `src/services/axiosUser/axios-api-client.ts` | `localStorage['customer_auth_Token']` | Customer-facing features only |

Both instances share the same `VITE_ADMIN_API_URL` as `baseURL`. Admin users have no `customer_auth_Token` in localStorage — using `userAxiosApi` in an admin context sends no `Authorization` header and causes 403s. Always use `axiosApi` (and import `authToken` from `src/api/services/AuthService.ts`) for admin-side API calls.

`axiosApi` auto-refreshes on 401 via `/api/v1/auth/refresh-token`. On refresh failure it clears localStorage and redirects to `/`.

### Context

[src/contexts/CombineContext/CombineContextProvider.tsx](src/contexts/CombineContext/CombineContextProvider.tsx) composes ~44 providers into a single wrapper via a `CombineContexts` utility. Provider order matters — `ActivityTrackingProvider` must come after `UserDetailProvider`. Contexts are organized under:

- [src/contexts/AppLayout/](src/contexts/AppLayout/) — feature-level state
- [src/contexts/AuthLayout/](src/contexts/AuthLayout/) — auth state (`AuthenticationContext`, `AuthErrorContext`, `AuthLoaderContext`, `IsRememberContext`)

When adding a new global context provider, add it to the `providers` array in `CombineContextProvider.tsx`. Remember that providers in this array cannot use TanStack Query hooks (see entry point constraint above).

### Activity tracking

[src/hooks/useActivityTracking.ts](src/hooks/useActivityTracking.ts) manages admin session lifecycle (checkin → heartbeat every 30 s → checkout on tab close). It reads `userDetail` from `UserDetailContext` and calls `src/Admin/services/activity/activity-api.ts` which uses `axiosApi` with an explicit `authHeaders()` helper. The hook is consumed by `ActivityTrackingProvider`.

### Shared UI components

Located in [src/global/components/](src/global/components/):

- **DataTable** — wraps `@tanstack/react-table` with built-in pagination, global filter, add-row modal, and loading state. Accepts `columns: DataTableColumnInterface<T>[]` and `data: T[]`. Uses `DataTableContext` for modal and filter state.
- **Table** — separate lighter table component, distinct from DataTable.
- **search_Input** — searchable select components (`input-box-with-search-data/` folder).
- **FilterBox** — pre-built filter UI component for applying filterable criteria to lists/tables.
- **Alert**, **card**, **BreadCrumbs**, **button**, **input**, **loader**, **CustomModal**, **Modals** — additional shared primitives. Check the folder before building a new one.
- **Icons** — all icons accessed via `IconsStore` object from [src/global/Icons/IconsStore.tsx](src/global/Icons/IconsStore.tsx). Prefer adding icons through `IconsStore` in UI components rather than importing icon libraries directly in feature component files. Configuration/data files (e.g. `sidebarItems.ts`) may import from `react-icons` directly.

Chakra UI wrappers and component overrides live in [src/global/ChakraUIComponents/](src/global/ChakraUIComponents/).

### Device type mapping

Device types are numeric IDs throughout the API. Use `getDeviceNumberToTypeName(deviceTypeId: number): string` from [src/Admin/features/KeymanBeatModule/services/deviceNumberTypeToString.ts](src/Admin/features/KeymanBeatModule/services/deviceNumberTypeToString.ts) to convert them to display names (0 → "Default", 1 → "Keyman", 2 → "Patrolman", 3 → "USFD", 4 → "Mate", 5 → "Gatemitra", 6 → "Stationery Watchman", 7 → "TRD Patrolman"). Returns an empty string for unknown IDs — fall back to `Type ${id}`.

### Forms

Both `formik` and `react-hook-form` (with `@hookform/resolvers` and `yup`/`zod`) exist in the codebase. Prefer `react-hook-form` for new code.

### Notable libraries

- `@xyflow/react` — node-based flow/diagram UIs (used in IssueLLM)
- `lucide-react` — icon library (use via `IconsStore` in UI components; direct import acceptable in config/data files)
- `exceljs` — Excel file export
- `firebase` / `@firebase/messaging` — push notifications (FCM)
- `@turf/turf` — geospatial operations (used with Leaflet/OpenLayers maps)
- `react-hot-toast` + `react-toastify` — toast notifications (both present; prefer `react-hot-toast` for new code)
- `highcharts` + `recharts` — charts and data visualization
- `date-fns` — date utilities
- `pyodide` — Python runtime in browser (excluded from Vite dep optimization)

### Styling

Tailwind CSS is the primary styling tool. MUI and Chakra UI components are used alongside it. Global styles in [src/global/styles/GlobalCss.css](src/global/styles/GlobalCss.css).
