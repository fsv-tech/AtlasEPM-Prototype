# Atlas EPM — Project Plan
> From clickable prototype to production application

This folder contains the complete plan for turning the Atlas EPM prototype (in this repo) into a real, deployed engineering project-management platform. It is sized for a single mid-sized engineering consultancy with ~50–500 engineers and ~10–50 active projects.

---

## How to use these docs

| # | Document | What's in it |
|---|---|---|
| 00 | **[PROJECT_PLAN.md](./PROJECT_PLAN.md)** *(this file)* | Executive summary, scope, and reading order |
| 01 | [architecture-and-stack.md](./01-architecture-and-stack.md) | Recommended tech stack, system diagram, key decisions |
| 02 | [data-model.md](./02-data-model.md) | PostgreSQL schema (DDL), table-by-table notes, indexing |
| 03 | [api-design.md](./03-api-design.md) | REST endpoint catalogue, auth, pagination, sample contracts |
| 04 | [phases-and-roadmap.md](./04-phases-and-roadmap.md) | 6-phase delivery plan with milestones and exit criteria |
| 05 | [team-and-cost.md](./05-team-and-cost.md) | Team composition, role definitions, ballpark budget |
| 06 | [non-functional.md](./06-non-functional.md) | Security, compliance, performance, monitoring, backup |
| 07 | [handoff-checklist.md](./07-handoff-checklist.md) | Day-1 checklist for the dev team picking this up |
| 08 | [spec-alignment.md](./08-spec-alignment.md) | Cross-reference: prototype vs original spec (gaps + DDL patches) |
| 09 | [build-guide.md](./09-build-guide.md) | Step-by-step walkthrough with commands and sample code |

---

## Executive summary

**The problem.** Engineering consultancies run multi-million-dollar, multi-discipline projects on spreadsheets. The handoffs between cost engineers, planners, PMs, discipline leads and clients are e-mail-driven and version-fragile. Risk registers, deliverable trackers, approval chains and resource plans all live in separate workbooks that drift apart.

**The product.** Atlas EPM consolidates **project, resource, deliverable, cost, risk, change, approval, and reporting management** for engineering services firms into a single web application. Microsoft Entra SSO; Power BI-style dashboards; role-based access for executives, PMs, discipline leads, engineers, planners, commercial, clients, document control and QA/QC.

**The prototype** (this repo) demonstrates all 20 screens, the full ERD, the permission matrix, and realistic mock data shaped exactly like the production database. **Treat the prototype as the specification.** Every endpoint the backend builds should return JSON shaped like `data/index.js`. Every screen the production frontend builds should match the visual hierarchy in `screens/*.jsx`.

---

## Scope

### In-scope (MVP)

- **Project workspace** with 10 tabs (Overview, Team, Disciplines, Deliverables, Cost, Risks, Changes, Approvals, Documents, Schedule)
- **Resource planning** (rolling 14-week calendar with allocations and capacity alerts)
- **Cost engine** (budget, committed, spent, forecast, contingency drawdown, S-curve, scenarios)
- **Deliverables tracker** with revision history, comments, approval workflow
- **Risk register** (5×5 heat map, mitigation tracking, trend monitoring)
- **Change request center** (hours/cost/schedule impact, approval chain)
- **Approval center** (multi-level routing per the permission matrix)
- **Reports center** (templates, scheduled distribution, multi-format export)
- **Executive analytics** (utilization, win rate, client concentration, AI insights)
- **Settings** (users, roles, disciplines, templates, integrations)
- **Microsoft Entra ID** (Azure AD) single sign-on
- **Notifications** (in-app + email digest)

### Out-of-scope for MVP

- Mobile-native applications (responsive web is in-scope)
- Direct integration with Primavera P6 (importer for MVP+1)
- Direct SAP financial integration beyond CSV ingest
- Time-sheet capture UI (basic record only; full UI in MVP+1)
- AI-generated reports / chat-with-data
- White-labelling for multiple tenants (single-tenant MVP)

---

## Source-of-truth artefacts in this repo

| Artefact | Where | Use it for |
|---|---|---|
| Visual spec for every screen | `screens/*.jsx` | What the production UI must look like; component naming, copy, layout |
| Database schema | `data/index.js` | The exact shape of every entity; column names; relationships |
| Permission matrix | `screens/insights.jsx` → `PermissionMatrix` | What each role can do per module |
| Design system | `assets/styles.css` | Tokens (colours, type, spacing, radii, shadows); copy as-is into the production CSS |
| Icon library | `assets/icons.jsx` | Lucide-style stroke-1.6 SVGs already inlined |
| Mock workflows | "Approval centre", "Change requests", project tabs | Exact step-order for production workflows |

---

## Critical success factors

1. **Don't rewrite the design.** The prototype is the design spec. Engineers using it for reference will save 2–3 sprints of UX rework.
2. **Match the data shape exactly.** `data/index.js` is the API contract. If a backend endpoint returns differently shaped data, the screens won't render.
3. **Ship the permission matrix on day 1.** Role-based UI hiding is in the prototype. Replicate it in production from the start — retrofitting auth is expensive.
4. **Defer AI features until phase 4.** The "AI insights" panel in Analytics is the only AI surface area, and it's fine to ship hard-coded copy on launch.
5. **Use Microsoft Entra from the start.** The customer is in the Microsoft ecosystem (M365, Teams, SharePoint, Power BI). Local-auth-first is wasted effort.

---

## High-level timeline

```
Month 0          Discovery & detailed design
Month 1–2        Phase 1 — Foundation (auth, schema, core CRUD, shell)
Month 3–4        Phase 2 — Projects + Resources + Cost
Month 5          Phase 3 — Deliverables + Approvals + Changes + Risks
Month 6          Phase 4 — Reports + Analytics + Notifications
Month 7          Phase 5 — UAT, security review, performance hardening
Month 8          Phase 6 — Pilot rollout (3 projects, 20 users)
Month 9–10       Full rollout to all users
```

Total: **~9–10 months from kickoff to full deployment** with a team of 6–7 (1 PM, 2 backend, 2 frontend, 1 DevOps, 1 designer/QA combined).

See [phases-and-roadmap.md](./04-phases-and-roadmap.md) for the detailed plan.

---

## Ballpark budget

For a Western-European or US dev team:

| Item | Cost |
|---|---|
| Build (6.5 FTE × 10 months, blended ~$110/h) | **$1.0–1.3M** |
| Infrastructure (Azure, year 1) | **$24–48K** |
| Microsoft licences (Entra, Graph, Power BI) | included in M365 |
| 3rd-party services (Sentry, monitoring, email) | **$8–15K /yr** |
| Year-1 maintenance (1.5 FTE for bug fixes + small features) | **$240K** |
| **Year-1 total** | **~$1.3–1.6M** |

For Gulf / nearshore (India / Eastern Europe) teams the build cost typically lands at 0.4–0.6× of the above.

See [team-and-cost.md](./05-team-and-cost.md) for breakdown.

---

## What to do this week

Open [`07-handoff-checklist.md`](./07-handoff-checklist.md) — it lists the concrete first steps:
provision Azure subscription, register the Entra app, scaffold the repo, freeze the data model, and pick the framework.
