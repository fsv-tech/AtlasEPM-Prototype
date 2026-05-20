# 06 · Non-functional requirements

## Security

### Authentication
- **Single sign-on only.** No local passwords. Microsoft Entra ID OIDC with mandatory MFA enforced at the tenant level.
- **JWT lifespan:** 15 minutes access, 7-day refresh (http-only secure cookie, SameSite=Lax).
- **Session revocation:** the `users.status` column gates token issuance — flipping to `Disabled` invalidates all future requests.

### Authorisation
- **Row-level security** in Postgres for every multi-tenant-style filter (project access, employee access).
- **Server-side permission checks** on every API route — never trust the client.
- **Permission matrix** lives in `roles.permissions` JSONB. Editable by admin in Settings → Permissions.

### Data protection
- All traffic over TLS 1.3. Azure Front Door enforces.
- PII at rest: Postgres has transparent disk encryption (Azure-managed key by default; bring your own key in year 2).
- Document blobs use server-side encryption + time-limited SAS download URLs (max 60 min).
- Email addresses and personal data flagged in the schema for GDPR/Subject Access requests.

### Audit logging
- Every create/update/delete on a primary entity writes a row to `audit_events`.
- Logs retained 7 years (industry standard for engineering projects).
- IP, user agent, before/after JSON snapshots captured.

### Penetration testing
- External pen-test in Phase 5.
- Annual re-test for the first 3 years, then biennial.
- SAST in CI: Snyk or GitHub Advanced Security.

### Compliance posture
- **SOC 2 Type II** readiness from go-live (most controls satisfied by Azure + Entra + the audit log).
- **ISO 27001** alignment via Azure's existing certifications + customer's internal policies.
- **GDPR** support: data export, right-to-be-forgotten, audit logs, subject access.

## Performance targets

| Page | Target p95 | Notes |
|---|---|---|
| Dashboard | < 800 ms TTI | SSR + cached for 60 s |
| Projects list | < 500 ms | Server-fetched + pagination |
| Project detail (Overview tab) | < 700 ms | Several aggregations |
| Resource calendar (14 weeks × 40 employees) | < 1 s | Precomputed view |
| Deliverable detail | < 600 ms | |
| Gantt (12-month) | < 1.5 s | |
| API endpoints (read) | < 200 ms | |
| API endpoints (write) | < 500 ms | |

**Load profile:** ~500 daily active users, ~5,000 requests/minute peak. Comfortably handled by 2 container replicas + 1 Postgres primary.

## Availability

- **SLA target:** 99.5% during business hours (Sun–Thu 07:00–19:00 customer time), 99.0% nights/weekends.
- **Planned maintenance window:** Friday 22:00–02:00 customer time.
- **RPO (data loss):** ≤ 1 hour (Postgres point-in-time recovery enabled).
- **RTO (recovery):** ≤ 4 hours.

## Backup & disaster recovery

- Postgres: automated daily backups, 35-day retention, geo-redundant copies in a secondary Azure region.
- Blob storage: GRS (geo-redundant storage), soft-delete enabled (14 days).
- Quarterly DR drill: restore production into staging from yesterday's backup.

## Monitoring & observability

| Concern | Tool | Alert threshold |
|---|---|---|
| App errors | Sentry | > 10 errors / 5 min |
| API latency | Application Insights | p95 > 1s for 5 min |
| Database health | Azure Postgres metrics | > 80% CPU 10 min, free storage < 20% |
| Background jobs | Service Bus dead-letter | > 0 messages 5 min |
| SSL certificate expiry | Azure Key Vault notifications | 30 days before |
| Uptime | Pingdom / Better Uptime | 3 consecutive failed checks |

On-call: 1 engineer rotation; phone alerts via PagerDuty.

## Accessibility

- **WCAG 2.1 AA** compliance is non-negotiable.
- Keyboard navigable everywhere (tested every sprint).
- Colour contrast ratio ≥ 4.5:1 for body text — verify the prototype's tokens still pass when reused in Tailwind.
- Screen-reader friendly tables (use `<th scope>`, ARIA grids on the heat map and Gantt).
- Form labels, error messages, and live-region announcements implemented.

## Internationalisation

- Strings in `messages/en.json`; `next-intl` for the lookup.
- Number/date formatting via `Intl.*`.
- For MVP, only English is shipped — but every string is externalised so adding Arabic / Danish / French is a single sprint.

## Browser support

- Latest 2 versions of Chrome, Edge, Safari, Firefox.
- No IE11. No legacy.
- Tablet support: iPad Pro and Surface in landscape.

## Mobile

Responsive web works on phone for read-only views (notifications, approval queue, deliverable status checks). Editing workflows are desktop only for MVP. A native iOS/Android app is a future product.

## Logging hygiene

- No PII or document contents in app logs.
- Structured JSON logs (pino).
- 90-day retention in Application Insights for live logs; cold storage for older.

## Data retention

- Active records: forever (this is a system of record).
- Audit logs: 7 years.
- Notifications: read-after-30-days are archived to cold storage; deleted after 1 year.
- Deleted records (soft-deleted): retained 90 days for accidental-delete recovery, then hard-purged.
