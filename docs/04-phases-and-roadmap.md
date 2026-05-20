# 04 · Phases & roadmap

Six phases, ~9–10 months kickoff to full deployment.

## Phase 0 — Discovery & detailed design (3 weeks)

**Goal:** confirm prototype is the spec, freeze schema, set up the team.

| Activity | Owner | Output |
|---|---|---|
| Walk every screen with PM, executive, 2 engineers, 1 client rep | Product designer | Annotated screen list with sign-off |
| Confirm permission matrix per role | Product + customer | `roles.permissions` JSONB seeded |
| Confirm ERD and lock the schema | Lead backend | `02-data-model.md` finalised |
| Decide hosting region(s) | DevOps + customer IT | Azure region selected |
| Provision Entra app registration | Customer IT | Tenant + client IDs handed over |
| Set up GitHub org + CI/CD skeleton | DevOps | Empty repo with deploys to dev |

**Exit criteria:** schema locked, environments provisioned, design signed off, repo skeleton deploying.

## Phase 1 — Foundation (8 weeks)

**Goal:** the shell + auth + the simplest CRUD.

| Sprint | Deliverable |
|---|---|
| 1 | Next.js scaffold, Tailwind tokens imported from prototype, design-system components (Button, KPI, Badge, Avatar, Card) |
| 2 | Entra ID OIDC login flow, JWT issuance, `/me` endpoint, `users` + `employees` + `roles` tables |
| 3 | Sidebar + Topbar + role-aware nav, hash → URL routing port |
| 4 | Projects list + create + detail (Overview tab only) |
| 5 | Employees list + profile |
| 6 | RLS policies, permission matrix enforced server-side |
| 7 | Notification table + popover; in-app polling |
| 8 | Settings: users, disciplines, branding |

**Exit criteria:** a PM can sign in, create a project, see it, edit metadata, and the Engineer role is correctly limited.

## Phase 2 — Projects + resources + cost (8 weeks)

**Goal:** the operational core of the product.

| Sprint | Deliverable |
|---|---|
| 1 | Resource planning calendar (14-week view, allocation cells, capacity alerts) |
| 2 | Project tabs: Team, Disciplines |
| 3 | Discipline workspace, lead assignment, alerts panel |
| 4 | Cost engine: budget/committed/spent/forecast, S-curve, contingency drawdown |
| 5 | Cost-by-package table, cost line CRUD, SAP CSV importer |
| 6 | Scenario modelling card on the cost tab |
| 7 | Gantt: rendering, drag-to-reschedule, milestones rendering |
| 8 | Hardening + UX polish from internal demo feedback |

**Exit criteria:** a PM can plan resources, see live cost forecasts, and the schedule renders against real data.

## Phase 3 — Deliverables + workflows (4 weeks)

**Goal:** the work-tracking flows.

| Sprint | Deliverable |
|---|---|
| 1 | Deliverables tracker (global + per-project), filters, status |
| 2 | Deliverable detail: revisions, comments, attachment upload to Blob, "Submit for approval" |
| 3 | Approval centre: queue, multi-level routing per matrix, approve/reject |
| 4 | Risk register (heat map + register), change request centre |

**Exit criteria:** a deliverable can go from Draft → Issued through the full approval chain; risks and changes are tracked.

## Phase 4 — Reports + analytics + integrations (4 weeks)

| Sprint | Deliverable |
|---|---|
| 1 | Reports catalogue, PDF/Excel generation worker, scheduled runs |
| 2 | Analytics page: portfolio KPIs, utilization trend, win-rate, client-mix |
| 3 | AI insights panel (rules-based for v1, LLM-backed in v2) |
| 4 | Microsoft Graph: Outlook digest email, SharePoint document sync |

**Exit criteria:** Monday morning every PM gets an automated weekly report; executives can run the analytics page.

## Phase 5 — Hardening (4 weeks)

| Sprint | Deliverable |
|---|---|
| 1 | Security review (external pen-test), fix findings |
| 2 | Load testing — confirm < 500 ms p95 for dashboard / projects list |
| 3 | Accessibility audit (WCAG 2.1 AA), keyboard nav, screen-reader pass |
| 4 | Final UAT, training videos, user docs |

**Exit criteria:** sign-off from security, performance, accessibility; user docs published.

## Phase 6 — Pilot + rollout (4 weeks)

| Sprint | Activity |
|---|---|
| 1 | 3 pilot projects on production with 20 hand-picked users; daily standup with users |
| 2 | Triage feedback; ship blockers within 24h |
| 3 | All-hands training sessions (3 sessions, 2h each) |
| 4 | Open access to all users; spreadsheet → Atlas data migration completed |

**Exit criteria:** all in-flight projects migrated; spreadsheets read-only; 80% weekly active users.

## After go-live (ongoing)

- 1.5 FTE retained on the platform: bug fixes, small features, integrations
- Quarterly roadmap review with the customer
- Year-2 features: mobile app, Primavera P6 sync, AI-generated reports

## Risks & how we mitigate them

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Permission matrix changes mid-build | High | Medium | Capture as JSONB, not hard-coded |
| Customer wants on-prem deploy | Medium | High | Stack is portable to any K8s; lead time +4 weeks |
| Spreadsheet migration is messier than expected | High | Medium | Build a CSV import path early (Phase 2) |
| Entra ID tenant changes during build | Low | High | Multiple environments registered up front |
| Adoption stalls (people keep using spreadsheets) | Medium | High | Pilot phase, executive sponsorship, weekly digest email |
| Scope creep into mobile apps | Medium | Medium | Lock MVP scope contractually; mobile = phase 2 product |
