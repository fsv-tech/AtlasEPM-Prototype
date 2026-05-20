# 01 · Architecture & tech stack

## Recommended stack (single best path)

```
┌────────────────────────────────────────────────────────────────────┐
│                        BROWSER (responsive)                         │
│  Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS    │
│  TanStack Query · Zustand · Recharts · react-hook-form · zod        │
└────────────────────────────────────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                        EDGE / CDN (Azure Front Door)                │
└────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                      APP TIER (Azure Container Apps)                │
│  Next.js SSR + API routes (Node 20 LTS)                             │
│  - REST + small GraphQL gateway for dashboards                      │
│  - Background workers for notifications, exports, AI digests        │
└────────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
┌──────────────────┐  ┌────────────────┐  ┌────────────────┐
│  PostgreSQL 16   │  │  Azure Blob     │  │  Azure Service │
│  (Azure Flex.)   │  │  Storage        │  │  Bus (queue)   │
│  + read replica  │  │  (documents)    │  │                │
└──────────────────┘  └────────────────┘  └────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│              INTEGRATIONS (Microsoft Graph + others)                 │
│  Entra ID (auth) · Outlook (notifications) · SharePoint (docs)      │
│  Power BI Embedded (analytics) · SAP (CSV import for POs)           │
└────────────────────────────────────────────────────────────────────┘
```

## Why this stack

**Next.js 14 + TypeScript** — same React you've already prototyped in, so the screens port screen-for-screen. App Router gives you SSR for SEO + faster first paint. API routes co-locate REST endpoints with the UI for the MVP; you can extract them later if needed.

**PostgreSQL 16 on Azure Flexible Server** — proven relational engine, JSON columns where flexibility is needed (e.g. `metadata` on documents). Single-AZ HA + a read replica is enough for MVP. Engineering data is small (< 100GB even after 5 years).

**Microsoft ecosystem alignment** — the customer already pays for M365. Use Entra ID for SSO, Microsoft Graph for Outlook/SharePoint, and Power BI Embedded for analytics. Saves $50–100K of build effort vs rolling your own.

**Azure Container Apps** — serverless containers, scales to zero on weekends. Cheaper than App Service for spiky engineering-firm usage patterns. Ships with Dapr if you want event-driven later.

**Tailwind CSS** — the prototype already uses utility-style CSS variables. Tailwind makes the design tokens in `assets/styles.css` enforceable across the codebase. Use the `theme.extend` block to import the token values.

## Alternative stacks (when this default doesn't fit)

| Alternative | When to pick it |
|---|---|
| **.NET 8 + Blazor + SQL Server** | Customer is Microsoft-mandated and has .NET developers in-house |
| **Django + Postgres + HTMX** | Smaller team (3–4 people), no SPA complexity needed, on-prem deploy |
| **Remix + Postgres** | Want forms-first server-rendered patterns; lighter than Next.js |
| **Hasura + Postgres + React** | Want auto-generated GraphQL and minimal backend code |

## Key architectural decisions

### 1. Monolith first, services later

Build one Next.js app with the API routes co-located. Engineering firms have 20–500 users — not 20,000. A monolith handles this comfortably and ships 3 months faster than a microservice architecture.

### 2. Server-side rendering for read-heavy screens

The Dashboard, Projects List, Employee Database and Reports Center are read-heavy. SSR them with `force-cache` + short TTLs. Use TanStack Query on the client for the interactive screens (Resource Calendar, Gantt, Deliverable Detail).

### 3. Database = source of truth for permissions

Don't put permission logic in the client. Use a `WHERE` clause filter via Postgres Row-Level Security (RLS) so a `SELECT * FROM projects` automatically returns only projects the user can see. This makes the permission matrix bulletproof.

### 4. File storage is *not* the database

Documents and deliverable attachments go to Azure Blob Storage. The database holds the metadata + blob URL. Generate **time-limited SAS URLs** when the client requests a download.

### 5. Real-time = polling for MVP, websockets in v2

Approval-count badges in the sidebar update on a 30-second polling interval for MVP. Real-time websockets (via Azure SignalR) are a v2 feature.

### 6. Background jobs

Three job types:
- **Email** (notification digests) — Azure Service Bus + a worker container
- **Exports** (PDF/Excel) — same worker
- **Scheduled reports** — Azure Functions on a Cron trigger

### 7. Multi-tenancy

MVP is **single-tenant**. The customer is one consultancy. Don't pay the multi-tenant tax (tenant_id on every row, tenant-scoped RLS, etc.) until there's a sales pipeline of more customers.

## Repository layout (Next.js 14 App Router)

```
atlas-epm/
├─ app/
│  ├─ (auth)/login/page.tsx
│  ├─ (app)/
│  │  ├─ layout.tsx              # Sidebar + Topbar
│  │  ├─ dashboard/page.tsx
│  │  ├─ projects/
│  │  │  ├─ page.tsx              # List
│  │  │  ├─ new/page.tsx          # Create
│  │  │  └─ [id]/
│  │  │     ├─ page.tsx           # Overview tab
│  │  │     ├─ team/page.tsx
│  │  │     ├─ disciplines/page.tsx
│  │  │     ├─ deliverables/page.tsx
│  │  │     └─ ... (10 tabs)
│  │  ├─ employees/
│  │  ├─ calendar/
│  │  ├─ gantt/
│  │  ├─ cost/
│  │  ├─ deliverables/
│  │  ├─ approvals/
│  │  ├─ changes/
│  │  ├─ risks/
│  │  ├─ reports/
│  │  ├─ analytics/
│  │  ├─ notifications/
│  │  └─ settings/
│  └─ api/
│     ├─ projects/route.ts
│     ├─ projects/[id]/route.ts
│     ├─ employees/route.ts
│     └─ ... (one folder per resource)
├─ components/
│  ├─ ui/                          # Buttons, badges, KPI, Donut, Bars...
│  ├─ shell/                       # Sidebar, Topbar, Tabs
│  ├─ modals/                      # CreateRecordModal, ExportModal...
│  └─ charts/                      # Sparkline, LineChart, Bars, Donut
├─ lib/
│  ├─ db.ts                        # Postgres client
│  ├─ auth.ts                      # Entra/JWT
│  ├─ permissions.ts               # Role → permission resolver
│  └─ types.ts                     # Shared TS types
├─ prisma/                          # OR drizzle/
│  └─ schema.prisma
├─ jobs/                            # Background workers
├─ tests/                           # Vitest + Playwright
├─ infra/                           # Bicep / Terraform
└─ docs/
```
