# 09 · Build guide — prototype → live application
> Step-by-step implementation walkthrough. Read after `PROJECT_PLAN.md` and `01-architecture-and-stack.md`. Run these commands top-to-bottom on a fresh machine.

This doc assumes you've chosen the recommended stack: **Next.js 14 + TypeScript + PostgreSQL + Azure**. If you picked something else, the principles still apply — translate the commands.

---

## 0. Prerequisites

```bash
# Local development
node --version       # ≥ 20.10
pnpm --version       # ≥ 9.0  (or npm/yarn)
docker --version     # ≥ 24
psql --version       # ≥ 16

# Cloud
az --version         # Azure CLI
gh --version         # GitHub CLI (for repo setup)
```

You'll also need:
- An Azure subscription with Owner rights
- A GitHub organisation
- Customer's Microsoft Entra (Azure AD) tenant ID
- Domain registrar access for the final URL

---

## 1. Scaffold the repo (Day 1)

```bash
# Create the workspace
pnpm create next-app@latest atlas-epm \
  --typescript \
  --tailwind \
  --app \
  --src-dir=false \
  --eslint \
  --import-alias "@/*"

cd atlas-epm

# Core dependencies
pnpm add @microsoft/microsoft-graph-client @azure/msal-node \
  drizzle-orm pg postgres-types \
  @tanstack/react-query zustand \
  zod react-hook-form @hookform/resolvers \
  date-fns clsx \
  next-auth @auth/drizzle-adapter

pnpm add -D drizzle-kit @types/pg vitest @playwright/test \
  @types/node tsx

# Initialise git + GitHub
gh repo create <org>/atlas-epm --private --source=. --remote=origin
git add -A && git commit -m "scaffold"
git push -u origin main
```

---

## 2. Port the design tokens into Tailwind

Open the prototype's `assets/styles.css`. The `:root` block at the top contains every design token. Copy them into your new `tailwind.config.ts`:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink:     { DEFAULT: "#0F1729", 2:"#1F2937", 3:"#4B5563", 4:"#6B7280", 5:"#9CA3AF", 6:"#D1D5DB" },
        line:    { DEFAULT: "#E5E7EB", 2:"#D1D5DB" },
        surface: { DEFAULT: "#FFFFFF", 2:"#F9FAFB", 3:"#F2F4F7" },
        navy:    { DEFAULT: "#0F1729", 2:"#1E293B", soft: "#E2E8F0" },
        accent:  { DEFAULT: "#2563EB", hover: "#1D4ED8", 2: "#3B82F6", soft: "#DBEAFE" },
        // ...chart palette: cyan, teal, green, lime, amber, orange, red, pink, violet, indigo, slate
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', "system-ui", "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      borderRadius: { sm: "6px", md: "8px", lg: "12px", xl: "16px" },
      boxShadow: {
        sm: "0 1px 2px rgba(15,23,41,0.06), 0 1px 1px rgba(15,23,41,0.04)",
        md: "0 4px 12px rgba(15,23,41,0.06), 0 1px 2px rgba(15,23,41,0.04)",
        lg: "0 12px 32px rgba(15,23,41,0.10), 0 2px 4px rgba(15,23,41,0.04)",
      },
    },
  },
  plugins: [],
} satisfies Config;
```

Add the IBM Plex fonts to `app/layout.tsx`:

```tsx
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["300","400","500","600"] });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400","500"] });
```

---

## 3. Provision the database

```bash
# Local dev
docker run --name atlas-pg -e POSTGRES_PASSWORD=dev -p 5432:5432 -d postgres:16

# Production (Azure)
az group create --name atlas-prod --location qatarcentral
az postgres flexible-server create \
  --resource-group atlas-prod \
  --name atlas-pg-prod \
  --location qatarcentral \
  --tier Burstable --sku-name Standard_B2ms \
  --version 16 \
  --high-availability ZoneRedundant
```

Set up Drizzle ORM:

```bash
# drizzle.config.ts
cat > drizzle.config.ts <<EOF
import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
EOF
```

Copy the full DDL from `docs/02-data-model.md` + the additions from `docs/08-spec-alignment.md` into `db/schema.ts` (translated to Drizzle's TypeScript syntax — Drizzle has a `drizzle-kit introspect:pg` command that does it for you once the SQL is applied).

```bash
psql $DATABASE_URL -f db/01-init.sql        # the DDL
pnpm drizzle-kit generate                    # creates TS schema from SQL
pnpm drizzle-kit migrate
```

---

## 4. Seed the database from the prototype

The prototype's `data/index.js` is your seed file. Write a `db/seed.ts`:

```ts
import { db } from "./client";
import { employees, projects, /* … */ } from "./schema";
import { DB } from "../prototype-data";    // the prototype's data/index.js, copied here

await db.insert(employees).values(DB.employees);
await db.insert(projects).values(DB.projects);
// ...etc for every table

console.log("Seeded", DB.employees.length, "employees and", DB.projects.length, "projects");
```

```bash
pnpm tsx db/seed.ts
```

---

## 5. Set up Microsoft Entra authentication

In Azure Portal:
1. **Entra ID → App registrations → New registration**
2. Name: `Atlas EPM`
3. Redirect URIs: `http://localhost:3000/api/auth/callback/microsoft-entra-id` (and prod URL later)
4. Copy the **Application (client) ID** and **Directory (tenant) ID**
5. Certificates & secrets → New client secret → copy the value

Add to `.env.local`:

```
DATABASE_URL=postgres://postgres:dev@localhost:5432/atlas
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000
ENTRA_CLIENT_ID=...
ENTRA_CLIENT_SECRET=...
ENTRA_TENANT_ID=...
AZURE_STORAGE_CONNECTION_STRING=...
```

`app/api/auth/[...nextauth]/route.ts`:

```ts
import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    MicrosoftEntraID({
      clientId:     process.env.ENTRA_CLIENT_ID!,
      clientSecret: process.env.ENTRA_CLIENT_SECRET!,
      tenantId:     process.env.ENTRA_TENANT_ID!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Attach role + employee id from your `users` table
      const dbUser = await db.query.users.findFirst({
        where: (u, { eq }) => eq(u.email, session.user.email!),
        with: { employee: true, role: true },
      });
      session.user.id         = dbUser!.id;
      session.user.role       = dbUser!.role.role_name;
      session.user.employeeId = dbUser!.employee_id;
      return session;
    },
  },
});

export const { GET, POST } = handlers;
```

`middleware.ts` to gate every route except `/login`:

```ts
import { auth } from "@/app/api/auth/[...nextauth]/route";
export default auth((req) => {
  if (!req.auth && !req.nextUrl.pathname.startsWith("/login")) {
    return Response.redirect(new URL("/login", req.url));
  }
});
export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
```

---

## 6. Port the shell + first screen

Lift `components/shell.jsx`, `components/widgets.jsx`, `components/tables.jsx` from the prototype. Convert to TypeScript and split into one file per component under `components/ui/`.

`app/(app)/layout.tsx`:

```tsx
import { Sidebar } from "@/components/shell/Sidebar";
import { Topbar } from "@/components/shell/Topbar";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="grid grid-cols-[232px_1fr] min-h-screen bg-surface-2">
      <Sidebar role={session!.user.role} />
      <div className="flex flex-col min-w-0">
        <Topbar user={session!.user} />
        {children}
      </div>
    </div>
  );
}
```

`app/(app)/dashboard/page.tsx` — port the entire `screens/dashboard.jsx` from the prototype, swapping mock `DB.*` lookups for real `db.query.*` calls.

Run `pnpm dev` and sign in. The Dashboard should render with real data from Postgres.

---

## 7. Build out routes module by module

Follow the phase plan in `docs/04`. For each module:

1. **API route** under `app/api/<entity>/route.ts` — GET (list) + POST (create)
2. **Detail API route** under `app/api/<entity>/[id]/route.ts` — GET + PATCH + DELETE
3. **List page** under `app/(app)/<entity>/page.tsx` — port from the prototype
4. **Detail page** under `app/(app)/<entity>/[id]/page.tsx` — port from the prototype
5. **Row-level security** policy in Postgres for that entity
6. **Tests:** unit test the API route with Vitest; smoke test the page with Playwright

### 7a. Port the derivation helpers as analytics endpoints

The prototype's `data/index.js` includes a set of helpers that serve as the
single source of truth for every aggregated number in the UI. Port each one
to a server-side analytics route. Implementations must read from source
tables — never from a denormalised KPI table — and may be cached for ≤ 5 min.

| Helper (prototype) | Endpoint (server) | Notes |
|---|---|---|
| `portfolioKPIs()` | `GET /api/analytics/portfolio` | Active project count, budget/spent/forecast totals, open risks, utilization |
| `disciplineUtilization()` | `GET /api/analytics/disciplines` | Sum of `project_assignments.allocation_pct` ÷ employee count, per discipline |
| `weeklyBurn(n)` / `monthlyBurn(n)` | `GET /api/analytics/burn-rate?period=&window=` | Distribute `costs.spent` across project lifetime using S-curve (tanh) function — see helper code |
| `projectSCurve(id)` | `GET /api/projects/:id/s-curve` | Anchor actual[currentIdx] = `projects.progress`; lag by health (-4pp amber, -8pp red); forecast linear to end |
| `riskSummary()` | `GET /api/analytics/risks` | Group by status × severity; status="Open" only for the "open" count |
| `changeImpact()` | `GET /api/analytics/changes` | Exclude `status='Rejected'` from net cost/schedule totals |
| `approvalSummary()` | `GET /api/analytics/approvals` | Avg cycle = mean(approved_date − raised) for status='Approved'; SLA = 5 days |
| `deliverableSummary()` | `GET /api/analytics/deliverables` | On-time % = count(actual_date ≤ planned_date) ÷ count(actual_date IS NOT NULL) |
| `analyticsKPIs()` | `GET /api/analytics/insights` | Revenue earned = Σ(budget × progress / 100); best/worst by variance / budget |
| `clientConcentration()` | `GET /api/analytics/clients` | Σ earned revenue grouped by client, sorted desc |
| `projectTypeMix()` | `GET /api/analytics/project-types` | Count + Σ budget grouped by project_type |
| `employeeAllocation(id)` | `GET /api/employees/:id/utilization` | Σ allocation_pct across all active assignments |

**Why this matters.** The prototype's reviewer feedback was: *"Dashboard looks
impressive, but the devil is in detail — try get the source data right."* That
feedback applies in production: if these helpers don't share a code path,
different screens will drift apart and report contradictory numbers. Build
each helper once on the server, expose via the routes above, and have every
client component consume from there. Never compute the same KPI in two places.

### 7b. Acceptance tests for analytics endpoints

Write Vitest tests that assert reconciliation between endpoints:

```ts
test("dashboard.openRisks equals analytics.risks.open", async () => {
  const portfolio = await GET("/api/analytics/portfolio");
  const risks     = await GET("/api/analytics/risks");
  expect(portfolio.openRisks).toBe(risks.open);
});

test("monthly burn sum matches portfolio.spentTotal within 5%", async () => {
  const portfolio = await GET("/api/analytics/portfolio");
  const burn      = await GET("/api/analytics/burn-rate?period=monthly&window=24");
  const sum       = burn.reduce((s, m) => s + m.value, 0) * 1e6;
  expect(Math.abs(sum - portfolio.spentTotal) / portfolio.spentTotal).toBeLessThan(0.05);
});

test("best/worst performer derives from costs.variance", async () => {
  const analytics = await GET("/api/analytics/insights");
  const costs     = await GET("/api/costs");
  const sorted = [...costs.data].sort((a,b) => a.variance/a.budget - b.variance/b.budget);
  expect(analytics.best.project_code).toBe(sorted[0].project_code);
  expect(analytics.worst.project_code).toBe(sorted.at(-1).project_code);
});
```

---

## 8. Background jobs

Three workers, all in `jobs/`:

```
jobs/
├─ email/digest.ts       # daily 08:00 — runs the notification digest
├─ exports/handler.ts     # consumes ExportRequest messages from Service Bus
└─ reports/scheduler.ts   # runs scheduled reports
```

Deploy each as an Azure Container App job with a Cron schedule (digest, scheduled reports) or queue trigger (exports).

---

## 9. Infrastructure as code

Don't click around the Azure portal. Use Bicep:

```bicep
// infra/main.bicep
param env string                    // 'dev' | 'prod'
param location string = 'qatarcentral'

resource postgres 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = { ... }
resource appEnv  'Microsoft.App/managedEnvironments@2023-05-01'                   = { ... }
resource appWeb  'Microsoft.App/containerApps@2023-05-01'                         = { ... }
resource storage 'Microsoft.Storage/storageAccounts@2023-05-01'                   = { ... }
resource frontDoor 'Microsoft.Cdn/profiles@2023-05-01'                            = { ... }
```

Deploy:

```bash
az deployment group create \
  --resource-group atlas-prod \
  --template-file infra/main.bicep \
  --parameters env=prod
```

---

## 10. CI/CD

`.github/workflows/deploy.yml`:

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm test
      - run: pnpm build
      - uses: docker/build-push-action@v5
        with:
          push: true
          tags: ${{ secrets.ACR }}/atlas:${{ github.sha }}
      - uses: azure/container-apps-deploy-action@v1
        with:
          containerAppName: atlas-web
          resourceGroup: atlas-prod
          imageToDeploy: ${{ secrets.ACR }}/atlas:${{ github.sha }}
```

Add `pnpm test` for Vitest, `pnpm exec playwright test` for E2E.

---

## 11. Monitoring & alerts

Install the Azure App Insights SDK in `instrumentation.ts`:

```ts
import { useAzureMonitor } from "@azure/monitor-opentelemetry";
useAzureMonitor({ connectionString: process.env.APPINSIGHTS_CONNECTION_STRING! });
```

In the Azure portal, set up alert rules per `docs/06-non-functional.md` (p95 latency, error rate, DB CPU, job DLQ).

Add Sentry for client-side errors:

```bash
pnpm add @sentry/nextjs
pnpm exec sentry-wizard -i nextjs
```

---

## 12. Production go-live checklist

1. **Domain & DNS** — point `atlas.<customer>.com` to Front Door
2. **SSL** — Front Door managed certificate (auto-renews)
3. **Backups** — verify Postgres point-in-time-recovery is on, do a test restore
4. **Pen-test** — schedule with a third-party firm, fix findings
5. **Load test** — k6 script hitting the dashboard at 100 RPS for 10 min
6. **Accessibility** — axe-core scan + manual keyboard test on every page
7. **Data migration** — import the customer's existing spreadsheets (provide a CSV import path under Admin → Import)
8. **Training** — three 2-hour sessions: Execs (1), PMs+Leads (1), Engineers (1)
9. **Cutover plan** — read-only access to old spreadsheets after go-live; full read-write on Atlas
10. **Hypercare** — daily standup with users for 2 weeks post go-live

---

## What lives where in this repo

| Prototype path | Production target |
|---|---|
| `index.html` | replaced by `app/layout.tsx` + screens |
| `app.jsx` (router) | replaced by Next.js App Router file conventions |
| `data/index.js` | converted to Drizzle schema + Postgres seed |
| `screens/*.jsx` | one Next.js page per screen under `app/(app)/...` |
| `components/widgets.jsx` | split into `components/ui/{KPI,Donut,Bars,...}.tsx` |
| `components/tables.jsx` | split into `components/ui/{DataTable,Modal,Drawer,...}.tsx` |
| `components/shell.jsx` | split into `components/shell/{Sidebar,Topbar,Router}.tsx` |
| `assets/styles.css` | tokens → `tailwind.config.ts`; rest deleted |
| `assets/icons.jsx` | port to typed `components/ui/Icon.tsx` |

---

## How long does each phase take?

See `docs/04-phases-and-roadmap.md` for sprint-by-sprint detail. TL;DR with a 6.5-FTE team:

- **Phase 0** (discovery, scaffold): 3 weeks
- **Phase 1** (foundation, auth, shell): 8 weeks
- **Phase 2** (projects, resources, cost): 8 weeks
- **Phase 3** (deliverables, approvals, changes, risks): 4 weeks
- **Phase 4** (reports, analytics): 4 weeks
- **Phase 5** (hardening, pen-test): 4 weeks
- **Phase 6** (pilot + rollout): 4 weeks

**Total: ~9–10 months. Year-1 budget ~$1.4M.** See `docs/05` for the breakdown.
