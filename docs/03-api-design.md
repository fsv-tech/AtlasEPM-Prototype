# 03 · API design

REST first. Every endpoint returns JSON shaped like the prototype's mock data (in `data/index.js`).

## Conventions

- **Base URL:** `https://atlas.<customer>.com/api/v1`
- **Auth:** `Authorization: Bearer <jwt>` (issued by Entra ID exchange)
- **Date format:** ISO 8601 (`2026-05-19T08:14:00Z`)
- **IDs:** UUIDs in URLs; the prototype's `EMP-001` / `P-001` codes are *display codes* and live in their own field
- **Pagination:** `?page=1&limit=50`, response includes `{ data, meta: { page, limit, total } }`
- **Filtering:** query string (`?status=Active&discipline=Mechanical`)
- **Sorting:** `?sort=-created_at` (prefix `-` for desc)
- **Errors:** RFC 7807 problem+json shape

## Endpoint catalogue

### Auth

```
POST   /auth/exchange            # swap Entra access-token for Atlas JWT
POST   /auth/refresh
POST   /auth/logout
GET    /me                       # current user + role + permissions
```

### Projects

```
GET    /projects                              # list (filterable)
POST   /projects                              # create
GET    /projects/{id}                         # full record + nested counts
PATCH  /projects/{id}
DELETE /projects/{id}                         # soft delete

GET    /projects/{id}/team                    # assignments
POST   /projects/{id}/team                    # add member
DELETE /projects/{id}/team/{assignmentId}

GET    /projects/{id}/disciplines             # disciplines with progress
POST   /projects/{id}/disciplines

GET    /projects/{id}/deliverables
GET    /projects/{id}/cost
GET    /projects/{id}/risks
GET    /projects/{id}/changes
GET    /projects/{id}/approvals
GET    /projects/{id}/documents
GET    /projects/{id}/milestones
GET    /projects/{id}/schedule                # Gantt bars
```

### Employees

```
GET    /employees
POST   /employees
GET    /employees/{id}                        # profile + utilization + projects
PATCH  /employees/{id}
GET    /employees/{id}/timesheets
GET    /employees/{id}/calendar               # forward 14 weeks
```

### Resource planning

```
GET    /resources/calendar?from=2026-W18&to=2026-W31
       # → per-employee per-week allocations
POST   /resources/assign                      # add a single allocation
POST   /resources/balance                     # AI auto-balance suggestion
```

### Deliverables

```
GET    /deliverables                          # cross-project tracker
POST   /deliverables
GET    /deliverables/{id}                     # detail with revisions+comments
PATCH  /deliverables/{id}
POST   /deliverables/{id}/revisions           # upload new revision (multipart)
POST   /deliverables/{id}/comments
POST   /deliverables/{id}/submit              # submit for approval
```

### Cost

```
GET    /cost/portfolio                        # summary across all projects
GET    /cost/{projectId}                      # detail (S-curve data + breakdown)
POST   /cost/{projectId}/lines                # add cost line
POST   /cost/import                           # SAP CSV ingest (admin only)
```

### Risks / Changes / Approvals

```
GET    /risks
POST   /risks
PATCH  /risks/{id}

GET    /changes
POST   /changes
PATCH  /changes/{id}
POST   /changes/{id}/approve
POST   /changes/{id}/reject

GET    /approvals?status=Pending&approver=me  # queue for current user
POST   /approvals/{id}/decision               # { decision: 'approve'|'reject', notes? }
```

### Daily Log + Weekly Report
Per-engineer time-stamped activity log. Drives the auto-generated weekly
report so engineers don't have to write progress reports manually.

```
GET    /daily-log?employee_id=&project_id=&from=&to=&type=&q=    # list, filterable
POST   /daily-log                                                # create entry (created_at = now())
GET    /daily-log/{id}                                           # fetch single
PATCH  /daily-log/{id}                                           # edit body/title/tags; created_at is immutable
DELETE /daily-log/{id}                                           # soft-delete (audit-tracked)

GET    /daily-log/weekly?employee_id=&week=YYYY-MM-DD            # auto-generated weekly report grouped by project
GET    /projects/{id}/activity-log                               # all engineers' entries on a project (PM/Lead view)
POST   /daily-log/weekly/email                                   # email a weekly report to PM/self
```

The `weekly` endpoint normalises the week start to Monday and returns a
structured object: `{ employee, weekStart, weekEnd, isoWeek, projectGroups[],
summary{ totalHours, totalEntries, totalBlockers, ... } }` where each project
group contains separate buckets for `highlights` (work), `blockers`,
`communications`, `meetings`, `notes`, plus touched deliverables.

### Meetings / Minutes of Meeting
A meeting creates auto-log entries in each present attendee's daily log.
Engineers add personal notes on top of the auto-stub — those notes feed
into their weekly report.

```
GET    /projects/{id}/meetings                                   # list MoMs on a project
POST   /projects/{id}/meetings                                   # create — triggers auto-log entries for present attendees
GET    /meetings/{id}                                            # fetch MoM with agenda, attendees, decisions, actions
PATCH  /meetings/{id}                                            # edit MoM — adds/removes attendees re-trigger auto-log
DELETE /meetings/{id}                                            # cascades to attendee auto-log stubs (preserves user-edited entries with meeting_id retained but soft-disconnected)

POST   /meetings/{id}/attendees                                  # add attendee — creates auto-log stub
DELETE /meetings/{id}/attendees/{employee_id}                    # remove attendee — removes auto-log stub
PATCH  /meetings/{id}/attendees/{employee_id}                    # change attendance (Present/Apologies/Absent)

POST   /meetings/{id}/actions                                    # add action item
PATCH  /actions/{action_id}                                      # update status (Open / In Progress / Done)
```

**Auto-logging behaviour:** when a meeting is created (or attendee added), a
`daily_log_entries` row is inserted with `auto_generated=true`, `meeting_id`
set, `entry_type='meeting'`, `hours = duration_minutes / 60`, and a
placeholder body. When the engineer opens the entry and saves personal notes,
the row's `auto_generated` flag flips to `false` and the body is replaced
with their own text. The `meeting_id` is preserved so the MoM detail view
can still surface their notes alongside the meeting.

### Reports & analytics

```
GET    /reports                               # catalogue
POST   /reports                               # define a new one
POST   /reports/{id}/run                      # generates a file, returns blob URL
GET    /reports/{id}/runs                     # history
POST   /reports/{id}/schedule                 # cron settings

GET    /analytics/portfolio                   # → portfolioKPIs()
GET    /analytics/disciplines                 # → disciplineUtilization()
GET    /analytics/burn-rate?period=weekly     # → weeklyBurn() | monthlyBurn()
GET    /analytics/burn-rate?period=monthly
GET    /analytics/risks                       # → riskSummary()
GET    /analytics/changes                     # → changeImpact()
GET    /analytics/approvals                   # → approvalSummary()
GET    /analytics/deliverables                # → deliverableSummary()
GET    /analytics/clients                     # → clientConcentration()
GET    /analytics/project-types               # → projectTypeMix()
GET    /projects/{id}/s-curve                 # → projectSCurve(): planned/actual/forecast
GET    /projects/{id}/metrics                 # → projectMetrics()
GET    /analytics/insights                    # AI panel data, derived from above
```

Every aggregation endpoint must be a pure read derived from source tables — no
denormalised KPI tables. Cache aggressively (5-min TTL) but never store derived
numbers as truth; recompute on demand so writes to projects/costs/risks update
the dashboard immediately.

### Notifications

```
GET    /notifications                         # current user only
POST   /notifications/read                    # body: { ids: [...] } or { all: true }
GET    /notifications/preferences
PATCH  /notifications/preferences
```

### Settings (Admin only)

```
GET    /admin/users
POST   /admin/users/invite                    # via Entra ID
PATCH  /admin/users/{id}                      # change role
GET    /admin/roles
PATCH  /admin/roles/{id}/permissions
GET    /admin/disciplines
POST   /admin/disciplines
GET    /admin/templates
POST   /admin/templates
GET    /admin/integrations
```

## Sample response shapes

### `GET /projects/{id}`

```json
{
  "id": "b3f8...",
  "project_code": "GFB-101",
  "project_name": "Green Fuel Bridging Study",
  "client": "QatarEnergy LNG",
  "country": "Qatar",
  "project_type": "FEED Study",
  "status": "Active",
  "priority": "High",
  "health": "amber",
  "start_date": "2025-09-01",
  "end_date":   "2026-08-31",
  "submission_date": "2026-07-15",
  "budget": 4850000,
  "fee_factor": 2.85,
  "contingency_pct": 8,
  "currency": "USD",
  "pm": { "id": "...", "full_name": "Anders Vestergaard", "employee_code": "EMP-001" },
  "progress": 74,
  "tags": ["Hydrogen","Ammonia","Bridging","FEED"],
  "counts": {
    "team": 22,
    "disciplines": 10,
    "deliverables": 24,
    "risks_open": 8,
    "changes_open": 3,
    "approvals_pending": 4
  }
}
```

### `GET /resources/calendar`

```json
{
  "weeks": [
    { "iso_year":2026,"iso_week":16,"start":"2026-04-13","is_current":false },
    ...
  ],
  "rows": [
    {
      "employee": { "id":"...","full_name":"Yusuf Korkmaz","discipline":"Mechanical" },
      "cells": [
        { "week":16, "planned_hours":28, "actual_hours":30, "projects":["GFB-101"] },
        ...
      ]
    },
    ...
  ]
}
```

## Auth flow

```
1. Browser  →  Microsoft login screen (OIDC, Entra ID)
2. Entra    →  redirects back with authorization code
3. Browser  →  POST /auth/exchange { code }
4. Backend  →  exchanges code for Microsoft tokens
            →  finds or creates user in `users` table
            →  signs an internal JWT with { sub:user_id, role, employee_id }
            →  returns JWT + sets refresh cookie
5. Browser  →  attaches JWT to every API call
```

JWT TTL: 15 minutes. Refresh cookie: 7 days, http-only, secure.

## Rate limits

Per-user: 200 req/min. Per-IP (unauthenticated): 20 req/min. Use Azure Front Door's rate-limiting rules or `next-rate-limit` middleware.
