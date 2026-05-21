# Atlas — Engineering Project Management Platform
> *Working name. Rename freely.*

A high-fidelity, multi-screen clickable prototype of the engineering PM platform spec'd in our earlier session — full UI wireframes, ERD, and roles matrix made interactive. Built as a front-end prototype for design review and developer handoff.

## What's here
Everything in this folder is **front-end only**. The "data" is in-memory mocks shaped like the ERD. There is no backend, no auth, no persistence — refreshing resets state.

## 🗺️ Turning this into a real product

The `docs/` folder contains the **full project plan** for converting this prototype into a production application — architecture, data model (PostgreSQL DDL), API design, phased delivery roadmap, team composition, budget, security/compliance, and a day-1 handoff checklist.

**Start here:** [`docs/PROJECT_PLAN.md`](./docs/PROJECT_PLAN.md)

## File structure

```
index.html                      Entry point — loads everything in order
app.jsx                         Top-level App component + hash router
assets/
  styles.css                    Design tokens + base styles + components
  icons.jsx                     Lucide-style icon library
  utils.jsx                     fmtDate, fmtMoney, statusClass, helpers
  tweaks-panel.jsx              Tweaks UI primitives
data/
  index.js                      All mock data + derived KPI helpers.
                                Source: projects, employees, disciplines, assignments,
                                deliverables, costs, risks, approvals, changes,
                                milestones, documents, notifications.
                                Derived (single source of truth):
                                  portfolioKPIs, disciplineUtilization, projectMetrics,
                                  riskSummary, changeImpact, approvalSummary,
                                  deliverableSummary, weeklyBurn, monthlyBurn,
                                  projectSCurve, analyticsKPIs, clientConcentration,
                                  projectTypeMix, employeeAllocation
components/
  shell.jsx                     Sidebar + topbar + role switcher
  widgets.jsx                   KPI cards, charts, sparklines, donuts
  tables.jsx                    DataTable, FilterBar, Drawer, Stat, Field
  tour.jsx                      Onboarding tour overlay
screens/
  login.jsx                     Sign in
  dashboard.jsx                 Executive dashboard
  projects-list.jsx             Projects list + new-project create flow
  project-detail.jsx            Project workspace (tabs: overview, discipline,
                                schedule, cost, deliverables, risks, change-log)
  people.jsx                    Employees list, employee profile,
                                resource calendar (3-screen file)
  planning.jsx                  Standalone Gantt + cross-project Cost mgmt
  deliverables.jsx              Deliverables tracker + detail view
  control.jsx                   Approvals centre + Change requests + Risks
  insights.jsx                  Reports centre + Analytics + Notifications +
                                Settings (4-screen file)
  daily-log.jsx                 Per-engineer daily log + auto-generated
                                weekly report (Mike Holloway feature request)
```

## Data integrity

Every KPI, chart, donut, badge, and percentage on every screen derives from
`data/index.js`. There are no hardcoded numbers that contradict the source.
If you change a project's progress, the dashboard, analytics, cost screen,
project detail S-curve, and burn rate trace all recompute consistently.

## Routing

Hash-based: every screen has a route like `#/projects`, `#/projects/NHM-02`, `#/employees/EMP-014`.
Open the file in a browser and use the sidebar or directly edit the URL hash.

## Role switching

The topbar has a "Viewing as" picker. Switching roles changes:
- Which sidebar items are visible
- Which buttons / approve actions appear
- Which data is filtered (e.g. an Engineer only sees their projects)

This demonstrates the permissions matrix interactively.

## Design system
- **Font:** IBM Plex Sans + IBM Plex Mono
- **Primary:** Deep navy `#0F1729`
- **Accent:** Engineering blue `#2563EB`
- **Surface:** White on warm-white `#F7F8FA`
- **Spacing:** 4-px grid
- **Radius:** soft (`14px` cards, `8px` controls)

## Dev handoff
This prototype matches the wireframes, ERD, and roles matrix one-to-one. To turn it into a real product:
1. Backend: PostgreSQL with the schema as specified
2. Auth: Microsoft Entra ID (SSO) — UI already has the button
3. Frontend: this code is plain React + Babel-in-browser; port to a Vite/Next setup with TypeScript
4. The mock data in `data/index.js` shows the exact shape every API endpoint must return
