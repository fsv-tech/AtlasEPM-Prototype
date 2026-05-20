# 05 · Team & cost

## Team composition (build phase, months 1–8)

| Role | FTE | Skills | Stage they join |
|---|---|---|---|
| **Product manager / owner** | 1.0 | Product, engineering domain | Phase 0 |
| **Tech lead** (full-stack) | 1.0 | Next.js, TypeScript, Postgres, Azure | Phase 0 |
| **Senior backend engineer** | 1.0 | Node/Next API routes, Postgres, RLS | Phase 1 |
| **Senior frontend engineer** | 1.0 | React, Tailwind, accessibility | Phase 1 |
| **Mid frontend engineer** | 1.0 | React, forms, charts | Phase 1 |
| **DevOps / SRE** | 0.5 | Azure, Bicep/Terraform, CI/CD | Phase 0 |
| **Designer / QA** | 1.0 | Design system maintenance + manual+automated QA | Phase 1 |

**Total: ~6.5 FTE** during the build.

### After go-live (months 9+)

- 1 tech lead (50%)
- 1 backend engineer (full-time)
- 0.5 frontend
- 0.25 DevOps
- 0.25 PM

**Total: 2.0 FTE ongoing.**

## Ballpark budget (Western team)

### Build phase (months 1–8)

| Line | FTE | Months | Blended rate ($/h) | Cost |
|---|---|---|---|---|
| Tech lead | 1.0 | 8 | $135 | $187K |
| Senior backend | 1.0 | 8 | $115 | $159K |
| Senior frontend | 1.0 | 8 | $115 | $159K |
| Mid frontend | 1.0 | 7 | $90 | $109K |
| DevOps | 0.5 | 8 | $125 | $86K |
| Designer/QA | 1.0 | 8 | $95 | $131K |
| PM | 1.0 | 8 | $110 | $152K |
| **Subtotal labour** | | | | **~$985K** |
| Tools & licences (GitHub, Linear, Figma, Sentry) | | | | $12K |
| Penetration test (Phase 5) | | | | $25K |
| Contingency (10%) | | | | $102K |
| **Build total** | | | | **~$1.12M** |

### Infrastructure (year 1)

| Item | Monthly | Annual |
|---|---|---|
| Azure Container Apps (2 envs × 2 replicas) | $400 | $4.8K |
| PostgreSQL Flexible Server (Burstable B4ms + replica) | $550 | $6.6K |
| Azure Blob Storage (1 TB) | $25 | $300 |
| Azure Front Door + WAF | $250 | $3K |
| Azure Service Bus (Standard) | $20 | $240 |
| Backups + monitoring (App Insights) | $100 | $1.2K |
| Email (SendGrid 50K /mo) | $60 | $720 |
| Sentry, Datadog or similar | $200 | $2.4K |
| **Subtotal infra** | **~$1.6K** | **~$19K** |
| Microsoft 365 / Entra / Graph | included in customer's tenant | — |
| Power BI Embedded (P1 capacity) | $730 | $8.7K |
| **Year-1 infra total** | | **~$28K** |

### Year-1 maintenance

1.5 FTE × 4 months (post-go-live) at ~$110/h blended: **~$240K**

### **Year-1 grand total: ~$1.4M**

## If you go nearshore / offshore

For a competent team in Eastern Europe, India or Egypt, divide labour costs by ~2–2.5. Year-1 total lands closer to **$700–800K**.

You will pay this back in coordination overhead — expect to ship a month or two later than a fully co-located team and to invest more in written specs (which this prototype provides).

## Vendor selection checklist

When picking a delivery partner, ask them to demo:
- A Next.js 14 production app they shipped in the last 18 months
- A Postgres + RLS implementation (let them whiteboard one)
- A real Microsoft Entra integration (not just a demo)
- A custom Power BI embed they've built
- Pen-test and SOC 2 experience
- Engineering, energy or AEC vertical experience (nice-to-have)

## Customer-side time

The customer needs to commit ~0.5 FTE during the build:

- 1 executive sponsor (1 hr/week)
- 1 product champion / project manager (10–15 hr/week)
- IT contact for Entra + Azure provisioning (5 hr/week in Phase 0, 1 hr/week after)
- 2–3 SMEs (engineering PMs) available for 1-hr review sessions every other sprint
