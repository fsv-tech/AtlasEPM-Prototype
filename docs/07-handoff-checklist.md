# 07 · Day-1 handoff checklist

For the engineering lead picking this prototype up and turning it into a real product.

## This week (Phase 0, week 1)

### Read

- [ ] `docs/PROJECT_PLAN.md` (the master plan)
- [ ] `docs/01-architecture-and-stack.md`
- [ ] `docs/02-data-model.md` — every column on every table
- [ ] `data/index.js` in this repo — the data shape your API must return
- [ ] `screens/*.jsx` — open one file at a time alongside the live prototype to map URL ↔ component ↔ data flow
- [ ] `screens/insights.jsx` → `PermissionMatrix` — what each role can do

### Decide & confirm with customer

- [ ] Hosting region (Azure recommendation: `qatarcentral` or `uaenorth` for Gulf customers; `northeurope` otherwise)
- [ ] Domain name (`atlas.<customer>.com`)
- [ ] Brand name (the prototype uses "Atlas" — rename freely)
- [ ] Currency baseline (USD recommended, multi-currency available)
- [ ] First three pilot projects (have the customer pick now — saves debate in Phase 6)

### Provision

- [ ] Azure subscription (production)
- [ ] Azure subscription (development) — separate billing keeps environments clean
- [ ] Entra app registration in customer's tenant (callback URLs for `dev.atlas...` and `atlas...`)
- [ ] GitHub organisation
- [ ] CI/CD secrets vault (GitHub Actions secrets or Azure Key Vault)

### Set up

- [ ] Empty Next.js 14 repo with the folder structure from `docs/01-architecture-and-stack.md`
- [ ] CI pipeline: install → lint → test → build → deploy to `dev`
- [ ] Postgres dev instance (cheap Burstable tier is fine for now)
- [ ] Copy `assets/styles.css` design tokens into `tailwind.config.ts` `theme.extend`
- [ ] Copy `assets/icons.jsx` into a typed icon component library

## Next two weeks (Phase 0, week 2–3)

### Engineering

- [ ] Port the design-system primitives from `components/widgets.jsx` and `components/tables.jsx`:
      `<Button>`, `<Badge>`, `<KPI>`, `<Avatar>`, `<AvatarStack>`, `<Donut>`, `<Bars>`, `<LineChart>`, `<Sparkline>`,
      `<Card>`, `<Modal>`, `<Drawer>`, `<Tabs>`, `<Status>`
- [ ] Port `<Sidebar>` and `<Topbar>` from `components/shell.jsx`
- [ ] Implement the auth flow (see `docs/03-api-design.md` § Auth flow)
- [ ] Run the SQL DDL from `docs/02-data-model.md` against the dev database
- [ ] Seed the database from `data/index.js` (convert JS arrays → SQL INSERTs)
- [ ] Wire `/me` endpoint and the role-aware navigation

### Product

- [ ] Walk every screen with the executive sponsor; mark anything they want to change. **Push back on changes** — the prototype is the spec. The cost of every modification is a sprint.
- [ ] Sign off the permission matrix in writing
- [ ] Sign off the data model in writing
- [ ] Set up a shared Linear / Jira project with one ticket per screen

## Things in this prototype that are deliberately fake

These are *placeholders for real work* in production:

| Fake | Real |
|---|---|
| The bottom-right "demo mode" toast on every click | Real backend mutation + optimistic UI |
| Deliverable Detail → revision history (templated from planned/actual dates) | Real upload-to-blob + version row per submission |
| AI insights cards (templated from current risks/utilization/variance) | Rules-based engine fed by live data; LLM-backed summarisation in v2 |
| Notifications (8 fixed items) | Real notification engine triggered by domain events |
| Resource auto-balance suggestions | Real optimisation algorithm (Phase 4 stretch) |
| Permission matrix (display only) | Real RLS + server checks |
| Microsoft sign-in button | Real OIDC flow with Entra ID |
| File uploads in the modal forms | Real multipart → Blob → DB metadata row |
| Employee skill proficiency bars (deterministic from seniority + employee ID) | Real skills assessment data feeding the bars |
| Employee time-off / training (deterministic placeholders) | Real leave/PTO module integrated with HR |

## Things in the prototype that are deliberately right

Keep these. They've been thought through and computed correctly from source.

- **Every KPI on every screen** derives from `data/index.js` helpers — no hardcoded numbers
- The 5×5 risk heat map with severity calculation (`probability × impact`)
- The status enums (project, deliverable, change, risk, approval)
- The 10 disciplines list
- The 10 roles with their permission classes
- The fee-factor + contingency-percent cost engine model
- The 14-week resource planning window
- The Gantt monthly grid with milestone diamonds
- The approval workflow chain (Engineer → Lead → PM → Commercial → Executive)
- The notification taxonomy (approval / deliverable / budget / risk / change / mention / system)
- The S-curve (planned/actual/forecast) for each project — derived from start_date, end_date, progress, health
- Weekly + monthly burn-rate distribution using S-curve (tanh) function across project lifetimes
- Best/worst performer identification by forecast variance / budget
- Open risk counts that match across dashboard, analytics, and risk register

## How to know you're on track

By **end of week 4** you should be able to:
- Sign in as Anders Vestergaard with real Microsoft credentials
- See his real face (or initials) in the user chip
- See the Dashboard with one real project pulled from Postgres
- Switch roles in Settings and watch the sidebar visibility change

If you can do that, the architecture is sound and the rest is execution.

## Who to call when something is unclear

- **"Why does the data shape look like that?"** → look at `data/index.js`. If still unclear, talk to the original product designer.
- **"What does this screen DO?"** → run the prototype, click around. The interactive behaviour is mostly correct (modals, navigation, filters, popovers).
- **"What's allowed for role X?"** → `screens/insights.jsx` → `PermissionMatrix`.
- **"What's the priority?"** → `docs/04-phases-and-roadmap.md` is the order to build in.

## Final note

The prototype is the *what*. The plan in these docs is the *how*. Together they should remove 80% of the back-and-forth that normally happens at project kickoff. Keep both alive — when scope changes, update the prototype first, then the docs, then the code.
