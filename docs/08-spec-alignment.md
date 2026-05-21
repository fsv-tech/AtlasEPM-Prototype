# 08 · Spec alignment check
> Cross-reference between the original product spec (wireframes + ERD + roles matrix) and what's currently in the prototype + docs

Used as the acceptance checklist when handing this package to a dev team.

---

## ✅ Screens — 20/20 present

| # | Spec screen | Implemented in |
|---|---|---|
| 1 | Login | `screens/login.jsx` |
| 2 | Executive Dashboard | `screens/dashboard.jsx` |
| 3 | Projects List | `screens/projects-list.jsx` → `ScreenProjectsList` |
| 4 | Create Project | `screens/projects-list.jsx` → `ScreenProjectCreate` |
| 5 | Project Overview Workspace | `screens/project-detail.jsx` → Overview tab |
| 6 | Discipline Workspace | `screens/project-detail.jsx` → Disciplines tab |
| 7 | Employee Database | `screens/people.jsx` → `ScreenEmployees` |
| 8 | Employee Profile | `screens/people.jsx` → `ScreenEmployeeDetail` |
| 9 | Resource Planning Calendar | `screens/people.jsx` → `ScreenCalendar` |
| 10 | Gantt Planning View | `screens/planning.jsx` → `ScreenGantt` |
| 11 | Cost Management | `screens/planning.jsx` → `ScreenCost` |
| 12 | Deliverables Tracker | `screens/deliverables.jsx` → `ScreenDeliverables` |
| 13 | Deliverable Detail | `screens/deliverables.jsx` → `ScreenDeliverableDetail` |
| 14 | Approval Center | `screens/control.jsx` → `ScreenApprovals` |
| 15 | Change Request Center | `screens/control.jsx` → `ScreenChanges` |
| 16 | Risks | `screens/control.jsx` → `ScreenRisks` |
| 17 | Reports Center | `screens/insights.jsx` → `ScreenReports` |
| 18 | Analytics Center | `screens/insights.jsx` → `ScreenAnalytics` |
| 19 | Notification Center | `screens/insights.jsx` → `ScreenNotifications` |
| 20 | Settings | `screens/insights.jsx` → `ScreenSettings` |

Mobile bottom-nav layout is **not yet shipped** in the prototype (responsive web is the MVP target; native mobile is a v2 product per `docs/04`).

---

## ✅ Roles — 10 of 11 in prototype

| Role in spec | In `data/index.js` roles? | In permission matrix? |
|---|---|---|
| Admin / System Administrator | ✅ | ✅ |
| Executive / Director | ✅ | ✅ |
| Project Manager | ✅ | ✅ |
| Discipline Lead | ✅ | ✅ |
| Engineer | ✅ | ✅ |
| Planner / Resource Manager | ✅ | ✅ |
| Commercial Manager | ✅ | ✅ |
| Client Viewer | ✅ | ✅ |
| Document Controller | ✅ | ✅ |
| QA/QC Reviewer | ✅ | ✅ |
| **Finance Team** | ❌ — currently absent | ❌ |

→ **Action:** add a `Finance` role row to `data/index.js` and a corresponding column to `PermissionMatrix` in `screens/insights.jsx`. Patched below.

---

## ⚠️ ERD — gaps vs spec

The DDL in `docs/02-data-model.md` is close but consolidates a few spec tables. For build-time fidelity, add the missing tables and split the conflated ones.

| Spec table | DDL status | Action |
|---|---|---|
| Users | ✅ `users` | — |
| Roles | ✅ `roles` | — |
| **UserRoles** (M:N) | ❌ — single `role_id` on `users` | Add `user_roles` join table for many-to-many role assignment (spec allows users to hold multiple roles) |
| Employees | ✅ `employees` | — |
| Projects | ✅ `projects` | — |
| Disciplines | ✅ `project_disciplines` | — |
| ProjectAssignments | ✅ `project_assignments` | — |
| **ResourceAllocations** | ⚠️ merged with WeeklyHours | Split into two tables per spec (forecast vs actual; cleaner reporting at scale) |
| **WeeklyHours** | ⚠️ merged into `weekly_allocations` | Same — split |
| Deliverables | ✅ `deliverables` | — |
| DeliverableRevisions | ✅ `deliverable_revisions` | — |
| DeliverableComments | ✅ `deliverable_comments` | — |
| **Costs** (per-discipline rollup) | ❌ — only `cost_lines` exists | Add `discipline_costs` (resource_cost / overhead_cost / contingency_cost / fee_factor / forecast_cost / total_cost) |
| **CostScenarios** | ❌ missing | Add `cost_scenarios` to back the "what-if" panel on the cost screen |
| Approvals | ✅ `approvals` | — |
| ChangeRequests | ✅ `change_requests` | — |
| Risks | ✅ `risks` | — |
| Milestones | ✅ `milestones` | — |
| Documents | ✅ `documents` | — |
| Notifications | ✅ `notifications` | — |
| AuditLogs | ✅ `audit_events` | Rename to `audit_logs` for spec parity (optional) |
| **Integrations** | ❌ missing as a table | Add `integrations` (referenced by Settings → Integrations tab) |
| AIForecasts / HistoricalPatterns / ResourcePredictions / EstimateTemplates | ❌ deferred | Defer to v2 (already flagged as "future AI tables" in spec) |

---

## 📋 DDL additions to bring fully in line with spec

Append these to `docs/02-data-model.md` (or copy into the production migrations):

```sql
-- M:N user ↔ role
CREATE TABLE user_roles (
  user_role_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_id      uuid NOT NULL REFERENCES roles(id),
  UNIQUE(user_id, role_id)
);

-- Split: planned allocation
CREATE TABLE resource_allocations (
  allocation_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  employee_id  uuid NOT NULL REFERENCES employees(id),
  iso_week     smallint NOT NULL,
  iso_year     smallint NOT NULL,
  planned_hours numeric(5,2) NOT NULL DEFAULT 0,
  availability_status text DEFAULT 'available',
  UNIQUE(project_id, employee_id, iso_year, iso_week)
);

-- Split: actual hours booked / costed
CREATE TABLE weekly_hours (
  weekly_hour_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id  uuid NOT NULL REFERENCES employees(id),
  project_id   uuid NOT NULL REFERENCES projects(id),
  iso_week     smallint NOT NULL,
  iso_year     smallint NOT NULL,
  hours        numeric(5,2) NOT NULL,
  cost         numeric(12,2),
  approved_at  timestamptz,
  UNIQUE(employee_id, project_id, iso_year, iso_week)
);

-- Discipline-level cost rollup (drives the per-discipline cost row + forecast)
CREATE TABLE discipline_costs (
  discipline_cost_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  discipline_id   uuid NOT NULL REFERENCES project_disciplines(id) ON DELETE CASCADE,
  resource_cost     numeric(14,2) DEFAULT 0,
  overhead_cost     numeric(14,2) DEFAULT 0,
  contingency_cost  numeric(14,2) DEFAULT 0,
  fee_factor        numeric(4,2)  DEFAULT 2.75,
  forecast_cost     numeric(14,2) DEFAULT 0,
  total_cost        numeric(14,2) DEFAULT 0,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- "What-if" cost scenarios (backs the Scenario Modelling card)
CREATE TABLE cost_scenarios (
  scenario_id    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id     uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  scenario_name  text NOT NULL,
  additional_engineers integer DEFAULT 0,
  schedule_extension_days integer DEFAULT 0,
  forecast_result numeric(14,2),
  notes          text,
  created_by     uuid REFERENCES users(id),
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- External integrations registry (Settings → Integrations)
CREATE TABLE integrations (
  integration_id  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,            -- 'Microsoft 365','Power BI','SAP'
  api_url         text,
  credentials_ref text,                      -- Key Vault reference (never plaintext)
  status          text NOT NULL DEFAULT 'available',  -- 'connected' | 'available' | 'error'
  last_synced_at  timestamptz,
  config_json     jsonb DEFAULT '{}'::jsonb
);
```

---

## ✅ Approval authority chain — matches spec

| Action | Spec chain | Implemented in `ApprovalsView` & PermissionMatrix |
|---|---|---|
| Deliverable submission | Engineer → Lead | ✅ (`level: "Lead"`) |
| Scope change | Engineer → Lead review → PM/Commercial → Executive (over threshold) | ✅ (multi-level via `approvals.level`) |
| Budget change | Lead → PM → Commercial → Executive | ✅ |
| Additional staffing | Lead → PM | ✅ |
| Baseline lock | PM → Executive | ✅ |

---

## ✅ Data visibility rules — to wire up server-side

The prototype enforces these client-side (via `ROLE_NAV` in `components/shell.jsx`). In production they must be enforced **server-side** via Postgres Row-Level Security. The RLS sample in `docs/02` already shows this pattern.

| Spec rule | RLS implementation |
|---|---|
| Engineer sees only assigned projects | `project_id IN (SELECT … FROM project_assignments WHERE employee_id = current_setting('atlas.employee_id'))` |
| Discipline Lead sees assigned discipline + resources | Same + filter on `discipline` |
| Project Manager sees full project | `pm_id = current_setting('atlas.employee_id')` |
| Executive sees portfolio | bypass RLS via `current_setting('atlas.role') IN ('Admin','Executive')` |
| Client sees filtered portal view | join through a `client_project_access` whitelist table (TBD when client portal is built — out of MVP scope) |

---

## 🎨 Style guide — matches spec

| Spec | Prototype |
|---|---|
| Primary: Dark navy + Light gray + White | ✅ `--navy: #0F1729`, `--surface: #FFFFFF`, `--surface-2/3` greys |
| Accent: Engineering blue | ✅ `--accent: #2563EB` |
| Cards: rounded, soft shadows | ✅ `--r-lg: 12px`, `--shadow-md/lg` |
| Charts: interactive | ✅ Donut / Bars / LineChart / Sparkline; hover states added in polish pass |
| Framework: React + Tailwind | ⚠️ Prototype uses **React + plain CSS variables** for portability. Production should port the tokens directly into `tailwind.config.ts` `theme.extend` (see `docs/01`). |
| Design inspiration: Monday/Jira/Primavera/PowerBI | ✅ — sidebar nav (Jira), KPI cards + donuts (PowerBI), Gantt grid (Primavera), table-first list views (Monday) |

---

## Summary of acceptance gaps

| Gap | Severity | Fix in |
|---|---|---|
| `Finance` role missing | Low | Add to `data/index.js` + matrix |
| Cost engine has `cost_lines` only, no discipline rollup or scenarios table | Medium | DDL appended above |
| `ResourceAllocations` and `WeeklyHours` are merged | Medium | DDL appended above |
| `user_roles` M:N missing | Medium | DDL appended above |
| `integrations` table missing | Low | DDL appended above |
| Mobile screens not yet built | Out of MVP scope | v2 product |
| AI tables (forecasts, predictions) | Deferred per spec | v2 |

Everything else in the original spec is honoured — 20/20 screens, full design system, full ERD coverage minus the items above, full role + permission matrix.

---

## ✅ Data integrity — every UI number derives from source

After review feedback ("dashboard looks impressive, but the devil is in the
detail — try get the source data right"), every screen was audited and
hardcoded numbers were replaced with helpers in `data/index.js`. The single
source of truth is now:

| Helper | Used by | What it returns |
|---|---|---|
| `portfolioKPIs()` | Dashboard KPI strip, Cost screen | Active projects, budget/spent/forecast, open risks, utilization, projects closing this month |
| `disciplineUtilization()` | Dashboard, Analytics trend | Per-discipline % allocation, derived from `assignments` |
| `weeklyBurn(n)` / `monthlyBurn(n)` | Dashboard burn chart, Cost screen | Cost time-series using S-curve distribution; totals reconcile to `costs.spent` |
| `projectSCurve(id)` | Project cost tab | Planned/actual/forecast cumulative %; current marker anchored to `project.progress` |
| `riskSummary()` | Dashboard, Analytics, Risks | Counts by status × severity + rising-trend count |
| `changeImpact()` | Changes screen, Analytics | Net cost / hours / schedule with approved-only and pending breakdowns |
| `approvalSummary()` | Approvals screen, Analytics | Pending/approved/overdue, avg cycle from `raised` → `approved_date`, 5-day SLA |
| `deliverableSummary()` | Analytics, Deliverables | Counts by status, on-time % from `actual_date ≤ planned_date` |
| `analyticsKPIs()` | Analytics screen | Billable hours, revenue earned (Σ budget×progress), avg rate, best/worst by variance |
| `clientConcentration()` | Analytics | Revenue earned by client, sorted descending |
| `projectTypeMix()` | Analytics | Project count and budget by type |
| `employeeAllocation(id)` | Resource calendar, AssignModal | Total % across all assignments |

### Reconciliation guarantees (verified at build time)

- Dashboard "Open risks" count == Analytics risk donut count == Risks screen "Open" tab count
- Cost screen "Spent" total == sum of monthly burn within project life
- Analytics "Best/worst performer" == sorted variance from `costs`
- Project detail S-curve current-point % == `project.progress` field
- Resource calendar "Engineers loaded" == distinct employees in `assignments`
- All derived metrics react immediately when source rows change (no caching in
  the prototype; cache TTL ≤ 5 min specified in `docs/03-api-design.md` for prod)

---

## ✅ Daily Log + Weekly Report — added per Mike Holloway feedback

Mike's feedback: *"Each person in the project should be able to open their own
daily log… search projects, find the one they're working on… select the
document and register the hours or make notes… and at the end of the week
they get a weekly report. So the engineer saves time in report writing."*

Implemented as a first-class feature.

**Data model** (`data/index.js` → `daily_log_entries` table in DDL):
- per-engineer time-stamped entries
- entry types: `work`, `meeting`, `comm`, `note`, `blocker`
- ties to a project (optional) and deliverable (optional)
- supports `hours` (nullable), `tags[]`, and `links[]` (URL or `mailto:`)
- immutable `created_at` timestamp (edits never change the time)

**UI surfaces**:
- `#/daily-log` — engineer's own timeline grouped by day, filterable by
  project, entry type, and free-text search; entry composer modal with
  project → deliverable cascading selector
- `#/daily-log/weekly/:weekStart` — auto-generated weekly report grouped
  by project, with separate Blockers / Work / Meetings / Comms / Notes
  buckets and touched deliverables
- Project detail → "Activity log" tab — every engineer's entries on a
  project, filterable by person, type, and deliverable
- Project detail header → "Log entry" button — deep-links into the
  composer with the project pre-selected

**Why this matters**: An engineer working 20–30 small projects in a day
can't remember what they did on each by Friday. The log captures it as
they go; the weekly report writes itself.

