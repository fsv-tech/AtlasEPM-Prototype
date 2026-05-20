# 02 · Data model

This is the **production database schema**, derived directly from the ERD and the prototype's `data/index.js`. Run this DDL on a fresh PostgreSQL 16 instance to provision the database.

## Naming conventions

- Tables: `snake_case`, plural (`projects`, `employees`)
- Primary keys: `id uuid`, default `gen_random_uuid()`
- Foreign keys: `<table_singular>_id` (`project_id`, `owner_id`)
- Timestamps: `created_at`, `updated_at` (with trigger), `deleted_at` (soft delete)
- Enums: declared as Postgres `CREATE TYPE … AS ENUM`

## Core DDL

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- Lookup enums
-- =========================================================
CREATE TYPE project_status AS ENUM (
  'Planning','Active','On Hold','Closeout','Completed','Cancelled'
);
CREATE TYPE project_health AS ENUM ('green','amber','red');
CREATE TYPE priority      AS ENUM ('Low','Medium','High','Critical');
CREATE TYPE seniority     AS ENUM ('Junior','Mid','Senior','Lead','Principal');
CREATE TYPE deliverable_status AS ENUM (
  'Draft','In Progress','In Review','Approved','Issued','Delayed'
);
CREATE TYPE change_status AS ENUM (
  'Submitted','In Review','Pending','Approved','Rejected','Cancelled'
);
CREATE TYPE risk_status   AS ENUM ('Open','Mitigated','Closed');
CREATE TYPE risk_trend    AS ENUM ('rising','stable','falling');
CREATE TYPE approval_status AS ENUM ('Pending','Approved','Rejected','Cancelled');

-- =========================================================
-- People
-- =========================================================
CREATE TABLE roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role_code   text UNIQUE NOT NULL,          -- 'PM', 'EXEC', 'ENGINEER'
  role_name   text NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '{}'::jsonb -- module → level map
);

CREATE TABLE employees (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_code   text UNIQUE NOT NULL,       -- 'EMP-001'
  first_name      text NOT NULL,
  last_name       text NOT NULL,
  email           citext UNIQUE NOT NULL,
  job_title       text,
  discipline      text NOT NULL,              -- denormalised for filtering
  location        text,
  hourly_rate     numeric(8,2) NOT NULL,
  capacity_hours  numeric(5,2) NOT NULL DEFAULT 40,
  seniority_level seniority NOT NULL,
  skills          text[] DEFAULT '{}',
  profile_photo   text,                       -- blob URL
  status          text NOT NULL DEFAULT 'Active',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX employees_discipline_idx ON employees(discipline);
CREATE INDEX employees_status_idx     ON employees(status);

CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         citext UNIQUE NOT NULL,
  microsoft_id  text UNIQUE,                  -- Entra OID
  employee_id   uuid REFERENCES employees(id),
  role_id       uuid NOT NULL REFERENCES roles(id),
  status        text NOT NULL DEFAULT 'Active',
  last_login    timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- =========================================================
-- Projects
-- =========================================================
CREATE TABLE projects (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_code    text UNIQUE NOT NULL,       -- 'GFB-101'
  project_name    text NOT NULL,
  client          text NOT NULL,
  country         text,
  project_type    text NOT NULL,              -- 'FEED Study', etc.
  status          project_status NOT NULL DEFAULT 'Planning',
  health          project_health NOT NULL DEFAULT 'green',
  priority        priority NOT NULL DEFAULT 'Medium',
  start_date      date NOT NULL,
  end_date        date NOT NULL,
  submission_date date,
  budget          numeric(14,2) NOT NULL,
  fee_factor      numeric(4,2) NOT NULL DEFAULT 2.75,
  contingency_pct numeric(4,2) NOT NULL DEFAULT 8,
  tender_fee      numeric(12,2),
  currency        char(3) NOT NULL DEFAULT 'USD',
  pm_id           uuid NOT NULL REFERENCES employees(id),
  progress        smallint NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  description     text,
  tags            text[] DEFAULT '{}',
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  deleted_at      timestamptz
);
CREATE INDEX projects_status_idx ON projects(status) WHERE deleted_at IS NULL;
CREATE INDEX projects_pm_idx     ON projects(pm_id);

CREATE TABLE project_disciplines (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name            text NOT NULL,
  lead_id         uuid REFERENCES employees(id),
  planned_hours   numeric(10,2) NOT NULL DEFAULT 0,
  actual_hours    numeric(10,2) NOT NULL DEFAULT 0,
  budget          numeric(12,2) NOT NULL DEFAULT 0,
  spent           numeric(12,2) NOT NULL DEFAULT 0,
  UNIQUE(project_id, name)
);

CREATE TABLE project_assignments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  employee_id     uuid NOT NULL REFERENCES employees(id),
  discipline      text NOT NULL,
  role_on_project text,
  allocation_pct  smallint NOT NULL CHECK (allocation_pct BETWEEN 0 AND 200),
  start_date      date NOT NULL,
  end_date        date NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX assignments_employee_idx ON project_assignments(employee_id);
CREATE INDEX assignments_project_idx  ON project_assignments(project_id);

-- =========================================================
-- Resource planning (weekly hours)
-- =========================================================
CREATE TABLE weekly_allocations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id     uuid NOT NULL REFERENCES employees(id),
  project_id      uuid NOT NULL REFERENCES projects(id),
  iso_year        smallint NOT NULL,
  iso_week        smallint NOT NULL CHECK (iso_week BETWEEN 1 AND 53),
  planned_hours   numeric(5,2) NOT NULL DEFAULT 0,
  actual_hours    numeric(5,2),
  approved_at     timestamptz,
  approved_by     uuid REFERENCES users(id),
  UNIQUE(employee_id, project_id, iso_year, iso_week)
);
CREATE INDEX weekly_emp_week_idx ON weekly_allocations(employee_id, iso_year, iso_week);

-- =========================================================
-- Deliverables, milestones, documents
-- =========================================================
CREATE TABLE deliverables (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  deliverable_code    text NOT NULL,
  title               text NOT NULL,
  discipline          text NOT NULL,
  owner_id            uuid NOT NULL REFERENCES employees(id),
  status              deliverable_status NOT NULL DEFAULT 'Draft',
  revision            text NOT NULL DEFAULT 'A',
  planned_date        date,
  actual_date         date,
  completion_percent  smallint NOT NULL DEFAULT 0,
  estimated_hours     numeric(8,2),
  description         text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, deliverable_code)
);
CREATE INDEX deliverables_status_idx ON deliverables(status);
CREATE INDEX deliverables_owner_idx  ON deliverables(owner_id);

CREATE TABLE deliverable_revisions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_id  uuid NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
  revision        text NOT NULL,
  uploaded_by     uuid NOT NULL REFERENCES employees(id),
  uploaded_at     timestamptz NOT NULL DEFAULT now(),
  notes           text,
  blob_path       text NOT NULL,
  file_size_bytes bigint
);

CREATE TABLE deliverable_comments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deliverable_id  uuid NOT NULL REFERENCES deliverables(id) ON DELETE CASCADE,
  author_id       uuid NOT NULL REFERENCES employees(id),
  body            text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE milestones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  code        text NOT NULL,
  title       text NOT NULL,
  due_date    date NOT NULL,
  status      text NOT NULL DEFAULT 'Upcoming',
  UNIQUE(project_id, code)
);

CREATE TABLE documents (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  deliverable_id  uuid REFERENCES deliverables(id) ON DELETE SET NULL,
  file_name       text NOT NULL,
  title           text,
  discipline      text,
  file_type       text,
  version         text,
  size_bytes      bigint,
  blob_path       text NOT NULL,
  uploaded_by     uuid NOT NULL REFERENCES employees(id),
  uploaded_at     timestamptz NOT NULL DEFAULT now(),
  metadata        jsonb DEFAULT '{}'::jsonb
);

-- =========================================================
-- Costs
-- =========================================================
CREATE TABLE cost_lines (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  package_code text,
  category     text NOT NULL,             -- 'Labour','Materials','Subcontract',...
  description  text,
  vendor       text,
  amount       numeric(14,2) NOT NULL,
  currency     char(3) NOT NULL DEFAULT 'USD',
  committed_on date,
  spent_on     date,
  source       text,                       -- 'manual','sap','timesheet'
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX cost_project_idx ON cost_lines(project_id);

-- =========================================================
-- Risks, changes, approvals
-- =========================================================
CREATE TABLE risks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  risk_code   text NOT NULL,
  title       text NOT NULL,
  category    text,
  probability smallint NOT NULL CHECK (probability BETWEEN 1 AND 5),
  impact      smallint NOT NULL CHECK (impact      BETWEEN 1 AND 5),
  severity    text GENERATED ALWAYS AS (
    CASE WHEN probability*impact >= 15 THEN 'High'
         WHEN probability*impact >= 5  THEN 'Medium'
         ELSE 'Low' END) STORED,
  status      risk_status NOT NULL DEFAULT 'Open',
  trend       risk_trend  NOT NULL DEFAULT 'stable',
  owner_id    uuid REFERENCES employees(id),
  mitigation  text,
  due_date    date,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, risk_code)
);

CREATE TABLE change_requests (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id           uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  change_code          text NOT NULL,
  title                text NOT NULL,
  reason               text,
  initiator            text,
  requested_by         uuid REFERENCES employees(id),
  hours_impact         integer  DEFAULT 0,
  cost_impact          numeric(14,2) DEFAULT 0,
  schedule_impact_days integer  DEFAULT 0,
  status               change_status NOT NULL DEFAULT 'Submitted',
  raised_at            timestamptz NOT NULL DEFAULT now(),
  decided_at           timestamptz,
  UNIQUE(project_id, change_code)
);

CREATE TABLE approvals (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id      uuid REFERENCES projects(id) ON DELETE CASCADE,
  entity_type     text NOT NULL,              -- 'Deliverable','ChangeRequest','Cost'
  entity_id       uuid NOT NULL,
  approver_id     uuid NOT NULL REFERENCES employees(id),
  level           text NOT NULL,              -- 'Lead','PM','Commercial','Executive'
  status          approval_status NOT NULL DEFAULT 'Pending',
  priority        priority NOT NULL DEFAULT 'Medium',
  raised_at       timestamptz NOT NULL DEFAULT now(),
  decided_at      timestamptz,
  decision_notes  text
);
CREATE INDEX approvals_pending_idx ON approvals(status, approver_id) WHERE status='Pending';

-- =========================================================
-- Notifications
-- =========================================================
CREATE TABLE notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        text NOT NULL,                  -- 'approval','deliverable','budget','risk'
  title       text NOT NULL,
  message     text,
  link        text,                            -- in-app link
  read_at     timestamptz,
  priority    text DEFAULT 'medium',
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_unread_idx ON notifications(user_id) WHERE read_at IS NULL;

-- =========================================================
-- Audit log
-- =========================================================
CREATE TABLE audit_events (
  id          bigserial PRIMARY KEY,
  user_id     uuid REFERENCES users(id),
  entity_type text NOT NULL,
  entity_id   uuid NOT NULL,
  action      text NOT NULL,           -- 'create','update','delete','approve'
  before_data jsonb,
  after_data  jsonb,
  ip_address  inet,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX audit_entity_idx ON audit_events(entity_type, entity_id);
```

## Row-level security (RLS) example

```sql
-- Engineers only see projects they're assigned to
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY engineer_sees_assigned ON projects
  FOR SELECT
  USING (
    current_setting('atlas.role') IN ('Admin','Executive','Planner') OR
    id IN (
      SELECT project_id
      FROM project_assignments
      WHERE employee_id = current_setting('atlas.employee_id')::uuid
    )
  );
```

Set the session vars on every request from the app tier:

```sql
SET LOCAL atlas.role = 'Engineer';
SET LOCAL atlas.employee_id = 'b3f9...uuid';
```

## Migrations

Use **drizzle-kit** or **Prisma Migrate**. Every schema change is a versioned migration in `prisma/migrations/`. Never edit the DB by hand on production.

## Seed data

The prototype's `data/index.js` is the seed file. Convert each array into an `INSERT` statement (or use Prisma's `seed.ts` to load it programmatically). This gives the dev team realistic data on day one.
