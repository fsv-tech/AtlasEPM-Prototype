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
  tweaks-panel.jsx              (starter) tweaks UI primitives
data/
  index.js                      All mock data, mirrors ERD tables
                                Exposes window.DB.{users, employees, projects,
                                disciplines, deliverables, allocations,
                                weeklyHours, costs, approvals, changes, risks,
                                milestones, documents, notifications}
components/
  shell.jsx                     Sidebar + topbar + role switcher
  widgets.jsx                   KPI cards, charts, sparklines, donuts
  tables.jsx                    DataTable, FilterBar, Drawer, Stat, Field
screens/
  login.jsx                     Screen 1 — Sign in
  dashboard.jsx                 Screen 2 — Executive dashboard
  projects-list.jsx             Screen 3 — Projects list
  project-create.jsx            Screen 4 — Create project
  project-detail.jsx            Screen 5 — Project workspace (with tabs)
  discipline.jsx                Screen 6 — Discipline workspace
  employees.jsx                 Screen 7 — Employee database
  employee-detail.jsx           Screen 8 — Employee profile
  resource-calendar.jsx         Screen 9 — Resource planning calendar
  gantt.jsx                     Screen 10 — Gantt planning view
  cost.jsx                      Screen 11 — Cost management
  deliverables.jsx              Screen 12 — Deliverables tracker
  deliverable-detail.jsx        Screen 13 — Deliverable detail
  approvals.jsx                 Screen 14 — Approval center
  changes.jsx                   Screen 15 — Change request center
  risks.jsx                     Screen 16 — Risks
  reports.jsx                   Screen 17 — Reports center
  analytics.jsx                 Screen 18 — Analytics
  notifications.jsx             Screen 19 — Notification center
  settings.jsx                  Screen 20 — Settings
archive/                        Previous Helix-PM prototype (kept as reference)
```

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
