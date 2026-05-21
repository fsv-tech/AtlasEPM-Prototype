// ============================================
// Atlas — Help Centre
// Role-aware documentation, getting-started guides, FAQ, shortcuts, about.
// Filters content using the same ROLE_NAV access map as the sidebar so a
// user never sees help for features they cannot use.
// ============================================

// ============================================
// Help content catalogue
// Each item declares: which feature it documents, the screens it covers,
// which roles can see it (via the "feature key" that maps to ROLE_NAV ids),
// and the actual content (title, summary, body, "try it" link).
// ============================================
const HELP_FEATURES = [
  // ——— Workspace ———
  {
    key: "dashboard", nav: "dashboard", section: "Workspace",
    icon: "dashboard", color: "var(--accent)",
    title: "Dashboard",
    summary: "Your portfolio at a glance — active projects, budget, risks, utilization, and weekly burn.",
    capabilities: [
      "5 KPI tiles update live from the source data",
      "Weekly burn-rate chart shows portfolio cash flow",
      "Top discipline utilization alert flags overloaded teams",
      "Upcoming milestones across all your projects",
      "Quick actions to drill into any KPI",
    ],
    try: { label: "Open dashboard", route: "dashboard" },
  },
  {
    key: "daily-log", nav: "daily-log", section: "Workspace",
    icon: "book", color: "var(--violet)",
    title: "My day · Daily log",
    summary: "Your personal time-stamped log. Capture work, meetings, blockers, communications and notes — auto-rolls up into a weekly report.",
    capabilities: [
      "Log entries against any project + optional deliverable",
      "Five entry types: Work, Meeting, Comms, Note, Blocker",
      "Drop in links and emails (mailto: opens your mail client)",
      "Filter by project, type, or text search",
      "Auto-generated weekly report — no manual report writing",
      "Project Activity Log tab shows all engineers' entries on a project",
    ],
    try: { label: "Open my log", route: "daily-log" },
  },

  // ——— Projects ———
  {
    key: "projects", nav: "projects", section: "Projects",
    icon: "folder", color: "var(--accent)",
    title: "Projects",
    summary: "All projects in the portfolio with status, progress, budget, and health.",
    capabilities: [
      "Card or table view (toggle in header)",
      "Filter by status, health, type, priority",
      "Search across name, code, client",
      "Each project links to a tabbed workspace",
      "Create a new project (PM+ only)",
    ],
    try: { label: "Browse projects", route: "projects" },
  },
  {
    key: "project-workspace", nav: "projects", section: "Projects",
    icon: "layers", color: "var(--accent)",
    title: "Project workspace",
    summary: "Eleven tabs covering everything about a single project: overview, team, disciplines, deliverables, cost, risks, changes, approvals, documents, schedule, and activity log.",
    capabilities: [
      "S-curve shows planned vs actual vs forecast progress",
      "Per-discipline cost and hours breakdown",
      "Risk register with 5×5 severity matrix",
      "Change request log with cost/schedule/hours impact",
      "Activity Log tab aggregates everyone's daily-log entries",
    ],
    try: { label: "Open first active project", route: "projects/P-001" },
  },
  {
    key: "calendar", nav: "calendar", section: "Projects",
    icon: "calendar", color: "var(--violet)",
    title: "Resource calendar",
    summary: "14-week planning view of every engineer's allocation across projects.",
    capabilities: [
      "See planned hours per engineer per week",
      "Over-allocation alert auto-detects engineers exceeding 40h/wk",
      "Filter by discipline",
      "Click a cell to see the allocation breakdown",
    ],
    try: { label: "Open calendar", route: "calendar" },
  },
  {
    key: "gantt", nav: "gantt", section: "Projects",
    icon: "gantt", color: "var(--violet)",
    title: "Gantt planning",
    summary: "Cross-project Gantt with milestones, dependencies, and progress bars.",
    capabilities: [
      "Switch between projects without leaving the view",
      "Milestone diamonds with overdue highlighting",
      "Discipline rows with bar progress",
      "Monthly grid spanning the active portfolio window",
    ],
    try: { label: "Open Gantt", route: "gantt" },
  },
  {
    key: "cost", nav: "cost", section: "Projects",
    icon: "coin", color: "var(--accent)",
    title: "Cost management",
    summary: "Portfolio-wide cost engine: budget, committed, spent, forecast, variance, contingency.",
    capabilities: [
      "Forecast vs budget variance per project, color-coded",
      "Monthly burn chart with cumulative S-curve",
      "Discipline-level cost breakdown",
      "Margin calculation from real revenue vs cost",
      "Contingency drawn percent per project",
    ],
    try: { label: "Open cost mgmt", route: "cost" },
  },

  // ——— Delivery ———
  {
    key: "deliverables", nav: "deliverables", section: "Delivery",
    icon: "layers", color: "var(--cyan)",
    title: "Deliverables",
    summary: "The deliverables register — everything being produced across the portfolio.",
    capabilities: [
      "Status pipeline: Draft → In Progress → In Review → Approved → Issued",
      "Revision tracking (Rev A, B, C...)",
      "Owner, discipline, planned vs actual dates",
      "Click into a detail view with revision history, comments, dependencies",
      "Linked items: changes, risks, approvals attached to each deliverable",
    ],
    try: { label: "Open deliverables", route: "deliverables" },
  },
  {
    key: "approvals", nav: "approvals", section: "Delivery",
    icon: "checkSquare", color: "var(--accent)",
    title: "Approvals",
    summary: "Approval workflow: pending decisions awaiting you, plus approved and rejected history.",
    capabilities: [
      "Filter by Pending / Approved / Rejected",
      "Each approval shows raised date, requester, entity (deliverable or change)",
      "Cycle time KPI tracks Submission → Decision against the 5-day SLA",
      "Overdue counter flags approvals past SLA",
    ],
    try: { label: "Open approvals", route: "approvals" },
  },
  {
    key: "changes", nav: "changes", section: "Delivery",
    icon: "git", color: "var(--amber)",
    title: "Change requests",
    summary: "Change log with cost, schedule, and hours impact analysis.",
    capabilities: [
      "Approved vs Pending vs Rejected value totals",
      "Net hour and schedule impact across the portfolio",
      "Each CR shows reason, cost delta, days delta, hours delta",
      "Pending CRs feed into the project scenario modeling tool",
    ],
    try: { label: "Open changes", route: "changes" },
  },
  {
    key: "risks", nav: "risks", section: "Delivery",
    icon: "shield", color: "var(--red)",
    title: "Risk register",
    summary: "Portfolio risk register with 5×5 heat map, severity classification, and mitigation tracking.",
    capabilities: [
      "Severity = probability × impact, classified High/Medium/Low",
      "Status: Open, Mitigated, Closed",
      "Trend: rising / steady / falling — surfaces escalating risks",
      "Owned by an employee, due-dated, with mitigation plan",
      "Heat map view for the visual triage",
    ],
    try: { label: "Open risks", route: "risks" },
  },

  // ——— People ———
  {
    key: "employees", nav: "employees", section: "People",
    icon: "users", color: "var(--accent)",
    title: "Employees",
    summary: "Engineer directory with profiles, skills, assignments, and timesheets.",
    capabilities: [
      "Card or table view",
      "Filter by discipline, seniority, location",
      "Profile shows current utilization, projects, owned deliverables, YTD hours",
      "Skills proficiency, certifications, time-off, training",
      "Timesheets derived from weekly allocations",
    ],
    try: { label: "Browse employees", route: "employees" },
  },

  // ——— Insights ———
  {
    key: "reports", nav: "reports", section: "Insights",
    icon: "report", color: "var(--accent)",
    title: "Reports centre",
    summary: "Scheduled and on-demand reports — exec summary, cost detail, risk snapshot, utilization.",
    capabilities: [
      "Pre-built report templates per role",
      "Schedule: weekly, fortnightly, monthly",
      "Auto-distribution to a recipient list",
      "Run history with regenerate option",
    ],
    try: { label: "Open reports", route: "reports" },
  },
  {
    key: "analytics", nav: "analytics", section: "Insights",
    icon: "brain", color: "var(--violet)",
    title: "Analytics",
    summary: "Cross-portfolio analytics: revenue, utilization, on-time delivery, variance, client mix, project type mix.",
    capabilities: [
      "Billable hours and revenue earned (YTD)",
      "On-time delivery rate from real deliverable dates",
      "Best vs worst performer by variance",
      "Client concentration and project type mix",
      "Staff demand forecast (next 6 months FTE)",
      "AI insights: top bottleneck, worst variance, rising risks",
    ],
    try: { label: "Open analytics", route: "analytics" },
  },
  {
    key: "notifications", nav: "notifications", section: "Insights",
    icon: "bell", color: "var(--amber)",
    title: "Notifications",
    summary: "Your activity feed: approvals, deliverable updates, budget alerts, risk changes, mentions.",
    capabilities: [
      "Bell icon in the topbar shows unread count",
      "Seven notification types with their own icons",
      "Click an item to jump straight to the related entity",
      "Mark all as read",
    ],
    try: { label: "Open notifications", route: "notifications" },
  },

  // ——— Admin ———
  {
    key: "settings", nav: "settings", section: "Admin",
    icon: "settings", color: "var(--ink-3)",
    title: "Settings",
    summary: "User management, roles, permissions matrix, audit log, integrations.",
    capabilities: [
      "User table with role assignment and last login",
      "Permission matrix view (read-only in prototype)",
      "Audit log of system events",
      "Integration connectors (Outlook, SharePoint, etc.)",
    ],
    try: { label: "Open settings", route: "settings" },
  },
];

// ============================================
// Getting-started journeys — one per role.
// Each step references a feature key so it disappears if the role
// can't access it (defence in depth — should never happen with the
// curated journeys, but keeps the system honest).
// ============================================
const GETTING_STARTED = {
  "Project Manager": {
    welcome: "As a Project Manager, you own delivery end-to-end. These five steps cover your daily flow.",
    steps: [
      { feature: "dashboard",          label: "Check the dashboard each morning",     why: "Open risks, weekly burn, milestones due — your morning brief in 30 seconds." },
      { feature: "project-workspace",  label: "Drill into a project workspace",       why: "11 tabs cover everything: cost, risks, changes, deliverables, schedule, activity log." },
      { feature: "daily-log",          label: "Log your day as you go",                why: "Capture work, blockers, calls, and decisions. The weekly report writes itself." },
      { feature: "approvals",          label: "Clear your approval queue",             why: "Pending approvals block the team. The SLA is 5 days — keep cycle time under that." },
      { feature: "cost",               label: "Review cost & forecast weekly",         why: "Spot variance early. Forecast at completion is the leading indicator." },
    ],
  },
  "Discipline Lead": {
    welcome: "As a Discipline Lead, you manage your team's output and approve technical deliverables.",
    steps: [
      { feature: "dashboard",          label: "Check team utilization",                why: "Discipline utilization tile flags whether your team is overloaded or underused." },
      { feature: "deliverables",       label: "Track your discipline's deliverables",  why: "Filter to your discipline — see what's in review, approved, or delayed." },
      { feature: "approvals",          label: "Review technical approvals daily",       why: "Engineers can't progress without your sign-off — keep cycle time tight." },
      { feature: "daily-log",          label: "Log decisions and blockers",             why: "Your team will reference your notes in their own logs. Be specific." },
      { feature: "risks",              label: "Own discipline-specific risks",         why: "Update probability, impact, and mitigation status as risks evolve." },
    ],
  },
  "Engineer": {
    welcome: "As an Engineer, you execute assigned work and capture your time accurately. Daily logging is the single highest-leverage habit.",
    steps: [
      { feature: "daily-log",          label: "Open My day first thing every morning", why: "Plan today, capture time as you work. Mike Holloway's whole point: never write a report from scratch again." },
      { feature: "projects",           label: "Find your active projects",             why: "Bookmark them, drop into the project workspace to check assignments and deliverables." },
      { feature: "deliverables",       label: "Update deliverable status",             why: "Move yours from Draft → In Progress → In Review as you go." },
      { feature: "changes",            label: "Raise a change request when scope shifts", why: "Don't absorb extra work silently — log it so cost and schedule reflect reality." },
      { feature: "dashboard",          label: "Check Friday afternoon",                 why: "Make sure your week's log is complete before the weekly report compiles." },
    ],
  },
  "Executive": {
    welcome: "As an Executive, you have read-only portfolio visibility. These views give you the high-altitude picture.",
    steps: [
      { feature: "dashboard",          label: "Daily portfolio scan",                  why: "Five KPIs, top risks, weekly burn — your three-minute brief." },
      { feature: "cost",               label: "Cost & forecast review",                why: "Variance percentages and contingency drawn tell you where margin is moving." },
      { feature: "analytics",          label: "Deep analytics weekly",                 why: "Client concentration, project-type mix, staff demand forecast, on-time delivery." },
      { feature: "risks",              label: "Top-of-portfolio risks",                why: "Filter to High severity, status Open. These need attention." },
      { feature: "reports",            label: "Schedule executive reports",            why: "Monthly summary auto-delivered to your inbox. Set it up once." },
    ],
  },
  "Planner": {
    welcome: "As a Planner, you orchestrate resources across projects and surface bottlenecks before they bite.",
    steps: [
      { feature: "calendar",           label: "Resource calendar — your home screen",  why: "14-week view of every engineer's allocation. Spot over-allocation in advance." },
      { feature: "gantt",              label: "Cross-project Gantt",                   why: "See how your projects interact in time. Re-baseline when needed." },
      { feature: "analytics",          label: "Staff demand forecast",                 why: "Six-month FTE demand by discipline drives hiring and subcontractor decisions." },
      { feature: "employees",          label: "Engineer profiles & skills",            why: "Match capability to upcoming demand. Identify cross-training opportunities." },
      { feature: "reports",            label: "Schedule planning reports",             why: "Weekly resource utilization to PMs, monthly demand forecast to execs." },
    ],
  },
  "Commercial": {
    welcome: "As Commercial, you own pricing, margin, and the change-request pipeline.",
    steps: [
      { feature: "cost",               label: "Portfolio cost engine",                 why: "Budget, committed, spent, forecast — your daily dashboard." },
      { feature: "changes",            label: "Change request triage",                 why: "Approve / reject CRs based on cost and schedule impact. Net value tracks here." },
      { feature: "approvals",          label: "Cost approvals",                        why: "Cost-impact thresholds route to you for sign-off. Cycle time matters." },
      { feature: "analytics",          label: "Margin and variance analysis",          why: "Best vs worst performer, average variance, forecast vs budget." },
      { feature: "reports",            label: "Monthly commercial report",             why: "Margin by project, change-impact summary, recovery actions." },
    ],
  },
  "Client": {
    welcome: "As a Client (external user), you have read-only access to the projects you sponsor.",
    steps: [
      { feature: "dashboard",          label: "Project dashboard",                     why: "Status overview for your projects only." },
      { feature: "projects",           label: "Drill into a project",                  why: "See progress, deliverables, milestones — limited to projects you sponsor." },
      { feature: "deliverables",       label: "Review issued deliverables",            why: "Approve or comment. Your inputs flow back into the engineering team's queue." },
      { feature: "reports",            label: "Read scheduled reports",                why: "Reports the PM has shared with you. PDF export available." },
    ],
  },
  "Doc Controller": {
    welcome: "As Doc Controller, you manage document control: revisions, transmittals, and the deliverables register.",
    steps: [
      { feature: "deliverables",       label: "Deliverables register — your hub",      why: "Every doc in the system: status, revision, owner, dates." },
      { feature: "projects",           label: "Project document tabs",                 why: "Each project's Documents tab shows everything filed against it." },
      { feature: "notifications",      label: "Watch for approval events",             why: "Approvals trigger your transmittal workflow — bell icon flags them." },
      { feature: "dashboard",          label: "Daily document control check",          why: "Spot delayed deliverables that need chasing." },
    ],
  },
  "QA/QC": {
    welcome: "As QA/QC, you review and approve technical deliverables, and own quality risks.",
    steps: [
      { feature: "approvals",          label: "Quality approval queue",                why: "QC sign-offs route to you. The 5-day SLA applies." },
      { feature: "deliverables",       label: "Deliverables in review",                why: "Filter by status = In Review. Your queue for the day." },
      { feature: "risks",              label: "Quality risks",                         why: "Flag and own QA/QC-category risks. Update mitigation status." },
      { feature: "daily-log",          label: "Log findings and decisions",            why: "Audit trail of what you checked, who you raised it with, what was changed." },
      { feature: "reports",            label: "Monthly QA report",                     why: "Defects, rejection rate, approval cycle time." },
    ],
  },
  "Admin": {
    welcome: "As Admin, you have full access. These are the day-zero setup priorities.",
    steps: [
      { feature: "settings",           label: "Users, roles, permissions",             why: "Provision people, assign roles, audit access changes." },
      { feature: "settings",           label: "Integrations",                          why: "Connect Outlook, SharePoint, Microsoft Entra ID for SSO." },
      { feature: "settings",           label: "Audit log",                             why: "Every state change is recorded. Filter, export, investigate." },
      { feature: "dashboard",          label: "Cross-role sanity check",               why: "Switch role from the user chip to validate what each persona sees." },
    ],
  },
};

// ============================================
// FAQs — also role-aware via "roles" filter (null = everyone)
// ============================================
const HELP_FAQS = [
  { roles: null, q: "How do I change my role to test what other users see?",
    a: "Use the user chip in the top-right corner. The role switcher shows every available role; selecting one re-renders the sidebar and locks features per the permission matrix." },
  { roles: null, q: "Where does the data come from?",
    a: "In this prototype, all data lives in `data/index.js` and is derived through helpers like `portfolioKPIs()` and `weeklyReport()`. Every KPI on every screen traces back to source rows — there are no hardcoded numbers." },
  { roles: ["Engineer","Discipline Lead","Project Manager","QA/QC"], q: "What's the daily log for?",
    a: "It captures time-stamped entries against projects and deliverables — work, meetings, blockers, communications, notes. At Friday end-of-week the weekly report auto-compiles, so engineers don't write progress reports from scratch." },
  { roles: ["Engineer","Discipline Lead","Project Manager","QA/QC"], q: "Can I attach files or emails to a log entry?",
    a: "Yes — use the Links field in the composer. Format is `Label | url-or-mailto`. The mailto links open the user's mail client; URL links navigate." },
  { roles: ["Project Manager","Commercial","Executive"], q: "Why is forecast different from budget on some projects?",
    a: "Forecast at completion factors in current run-rate plus pending change requests. Green-health projects forecast 1% under budget, amber 2% over, red 8% over. See the cost screen for per-project variance." },
  { roles: ["Project Manager","Discipline Lead","Engineer"], q: "How do I raise a change request?",
    a: "From any project's Changes tab, click \"New CR\". You specify the reason, cost impact, hours impact, schedule impact, and priority. It then routes through the approval chain." },
  { roles: ["Project Manager","Discipline Lead","Commercial"], q: "What does \"approved value\" vs \"pending value\" mean?",
    a: "Approved value = sum of cost impact across CRs already approved. Pending value = same sum for CRs in review or submitted. Rejected CRs are excluded from both." },
  { roles: ["Project Manager","Discipline Lead","Engineer","QA/QC"], q: "What's the difference between an approval and a change request?",
    a: "An approval is a sign-off on something that already exists (a deliverable revision, a cost line). A change request creates new work or modifies scope. CRs often need approvals — that's the approval chain." },
  { roles: ["Project Manager","Planner","Commercial"], q: "How is the S-curve calculated?",
    a: "Each project has a start_date, end_date, progress, and health. The planned curve is a tanh-based S; the actual line is anchored at the current progress %, lagged by health (-4pp amber, -8pp red); forecast extrapolates linearly to 100% at end_date." },
  { roles: null, q: "Why does the weekly burn rate look different on different days?",
    a: "It uses an S-curve distribution across each project's lifetime, weighted by spend-to-date. The total over the project lifetime reconciles to costs.spent." },
  { roles: ["Admin","Executive"], q: "Where is the permission matrix?",
    a: "Settings → Permissions tab. It's the source of truth for which roles see which navigation items. The help center you're reading uses the same matrix." },
  { roles: null, q: "What's the keyboard shortcut to start the guided tour?",
    a: "Click the blue \"Tour\" button in the topbar. The tour has 61 steps spanning every screen. ← → arrows step, Space pauses, Esc exits." },
];

// ============================================
// Keyboard shortcuts catalogue
// ============================================
const HELP_SHORTCUTS = [
  { group: "Navigation", items: [
    { keys: ["⌘", "K"], desc: "Open global search" },
    { keys: ["G", "D"], desc: "Go to Dashboard" },
    { keys: ["G", "P"], desc: "Go to Projects" },
    { keys: ["G", "L"], desc: "Go to My day (daily log)" },
    { keys: ["G", "A"], desc: "Go to Approvals" },
    { keys: ["?"],       desc: "Open this help centre" },
  ]},
  { group: "Tour", items: [
    { keys: ["←"], desc: "Previous step" },
    { keys: ["→"], desc: "Next step" },
    { keys: ["Space"], desc: "Pause / resume autoplay" },
    { keys: ["Esc"], desc: "Exit tour" },
  ]},
  { group: "Daily log composer", items: [
    { keys: ["⌘", "Enter"], desc: "Save and close" },
    { keys: ["Esc"], desc: "Cancel" },
    { keys: ["Tab"], desc: "Move between fields" },
  ]},
  { group: "Tables", items: [
    { keys: ["↑", "↓"], desc: "Move row selection" },
    { keys: ["Enter"], desc: "Open selected row" },
    { keys: ["⌘", "F"], desc: "Focus the search field" },
  ]},
];

// ============================================
// What's new / Changelog
// Most-recent first. Each entry tagged with affected roles so we can show
// only relevant updates per persona (null = everyone).
// ============================================
const HELP_CHANGELOG = [
  {
    date: "2026-05-21", version: "v0.4",
    headline: "Daily log + auto-generated weekly report",
    roles: ["Engineer","Discipline Lead","Project Manager","QA/QC"],
    points: [
      "New \"My day\" workspace — log work, meetings, blockers, comms and notes against a project + deliverable",
      "Drop in links and emails (mailto:) per entry — opens your mail client",
      "Weekly report auto-compiles from your log — no manual report writing",
      "Project detail gets an \"Activity log\" tab showing every engineer's entries",
      "\"Log entry\" button on every project header for one-click capture",
    ],
  },
  {
    date: "2026-05-21", version: "v0.4",
    headline: "Premium interaction layer — everything feels alive",
    roles: null,
    points: [
      "Cards, KPIs, table rows lift on hover with spring easing",
      "Buttons get focus rings, shimmer sweeps, colored shadows on press",
      "Progress bars now shimmer over the filled portion",
      "Page content staggers in on screen change",
      "Avatars pop, badges nudge, the notification dot pulses",
      "All animations respect prefers-reduced-motion",
    ],
  },
  {
    date: "2026-05-20", version: "v0.4",
    headline: "Source data integrity — every number derives from the helpers",
    roles: ["Project Manager","Commercial","Executive"],
    points: [
      "Dashboard \"Open risks\" matches Analytics donut matches Risks tab — zero drift",
      "Weekly + monthly burn rates derive from costs.spent using S-curve distribution",
      "S-curve per project derives from start/end/progress/health",
      "Best/worst performer computed from variance — no more hardcoded WTP-505",
      "Analytics revenue earned = Σ(budget × progress%) across all projects",
    ],
  },
  {
    date: "2026-05-20", version: "v0.4",
    headline: "Guided tour upgrades",
    roles: null,
    points: [
      "Tour no longer \"gets lazy\" mid-run — smooth tracking throughout",
      "Per-step countdown bar shows when autoplay will advance",
      "Pauses automatically when you switch tabs",
      "Always navigates to the exact step route (no more stuck-on-child-route)",
    ],
  },
];

// ============================================
// Helper — given role, return the features they can see
// Uses the same ROLE_NAV access map as the sidebar (defined in shell.jsx)
// Accessed via window since this file loads before shell.jsx
// ============================================
function featuresForRole(role) {
  const allowed = window.ROLE_NAV ? window.ROLE_NAV[role] : null;
  if (!allowed) return HELP_FEATURES.slice();   // Admin / null = all
  return HELP_FEATURES.filter(f => allowed.includes(f.nav));
}

function faqsForRole(role) {
  return HELP_FAQS.filter(f => !f.roles || f.roles.includes(role));
}

function changelogForRole(role) {
  return HELP_CHANGELOG.filter(c => !c.roles || c.roles.includes(role));
}

function gettingStartedForRole(role) {
  const journey = GETTING_STARTED[role];
  if (!journey) return null;
  // Defensive: drop any step whose feature isn't accessible to this role
  const allowed = window.ROLE_NAV ? window.ROLE_NAV[role] : null;
  const accessibleFeatures = HELP_FEATURES.filter(f => !allowed || allowed.includes(f.nav)).map(f => f.key);
  return {
    welcome: journey.welcome,
    steps: journey.steps.filter(s => accessibleFeatures.includes(s.feature)),
  };
}

// ============================================
// HelpCentre — slide-in drawer with tabs
// ============================================
function HelpCentre({ role, onClose, initialFeatureKey }) {
  const [tab, setTab] = React.useState(initialFeatureKey ? "features" : "getting-started");
  const [search, setSearch] = React.useState("");
  const [expandedFeatureKey, setExpandedFeatureKey] = React.useState(initialFeatureKey || null);

  const features = React.useMemo(() => featuresForRole(role), [role]);
  const faqs     = React.useMemo(() => faqsForRole(role), [role]);
  const journey  = React.useMemo(() => gettingStartedForRole(role), [role]);
  const changelog = React.useMemo(() => changelogForRole(role), [role]);

  // Persist getting-started completion per role
  const completionKey = "atlas.help.completed." + role;
  const [completed, setCompleted] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem(completionKey) || "{}"); } catch { return {}; }
  });
  function toggleStep(featureKey) {
    setCompleted(prev => {
      const next = { ...prev, [featureKey]: !prev[featureKey] };
      try { localStorage.setItem(completionKey, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  // Filter features by section + search
  const featuresBySection = {};
  features
    .filter(f => !search ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.summary.toLowerCase().includes(search.toLowerCase()) ||
      f.capabilities.some(c => c.toLowerCase().includes(search.toLowerCase()))
    )
    .forEach(f => {
      if (!featuresBySection[f.section]) featuresBySection[f.section] = [];
      featuresBySection[f.section].push(f);
    });

  // Filter FAQs by search
  const filteredFaqs = search
    ? faqs.filter(f => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase()))
    : faqs;

  // Esc to close
  React.useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const tabs = [
    { value: "getting-started", label: "Getting started", icon: "play" },
    { value: "features",        label: "Features",        icon: "layers", count: features.length },
    { value: "whats-new",       label: "What's new",      icon: "zap",    count: changelog.length },
    { value: "faqs",            label: "FAQ",             icon: "help",   count: faqs.length },
    { value: "shortcuts",       label: "Shortcuts",       icon: "command" },
    { value: "about",           label: "About",           icon: "info" },
  ];

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={e => e.stopPropagation()} style={{ width: 640 }}>
        {/* Header */}
        <div style={{
          padding: "20px 22px 0",
          borderBottom: "1px solid var(--line)",
          background: "linear-gradient(135deg, var(--accent-soft-2) 0%, var(--surface) 60%)",
        }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div className="muted xs" style={{ letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 500 }}>
                Help centre
              </div>
              <h2 style={{ margin: "4px 0 2px", fontSize: 20, fontWeight: 500, letterSpacing: "-0.025em" }}>
                Atlas for {role}s
              </h2>
              <div className="muted tiny">Content tailored to your access · {features.length} features available</div>
            </div>
            <button className="icon-btn" onClick={onClose} title="Close (Esc)">
              <Ico name="x" size={16}/>
            </button>
          </div>

          {/* Search */}
          <div className="row" style={{ gap: 8, padding: "8px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--line)", marginBottom: 14 }}>
            <Ico name="search" size={14} color="var(--ink-4)"/>
            <input
              type="text"
              placeholder="Search features, FAQs, shortcuts…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", flex: 1, fontSize: 13 }}
            />
            {search && (
              <button className="icon-btn" onClick={() => setSearch("")} style={{ width: 22, height: 22 }}>
                <Ico name="x" size={12}/>
              </button>
            )}
          </div>

          {/* Tabs */}
          <div className="tabs" style={{ marginBottom: -1 }}>
            {tabs.map(t => (
              <div key={t.value} className={"tab" + (tab === t.value ? " active" : "")} onClick={() => setTab(t.value)}>
                <Ico name={t.icon} size={12}/>{t.label}
                {t.count != null && <span className="count">{t.count}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Tab body */}
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "getting-started" && <GettingStartedTab role={role} journey={journey} completed={completed} onToggle={toggleStep} onClose={onClose}/>}
          {tab === "features" && <FeaturesTab featuresBySection={featuresBySection} onClose={onClose} expandedKey={expandedFeatureKey} onToggleExpand={setExpandedFeatureKey}/>}
          {tab === "whats-new" && <WhatsNewTab changelog={changelog} role={role}/>}
          {tab === "faqs"     && <FAQsTab faqs={filteredFaqs}/>}
          {tab === "shortcuts" && <ShortcutsTab/>}
          {tab === "about" && <AboutTab role={role} featureCount={features.length}/>}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Getting Started tab
// ============================================
function GettingStartedTab({ role, journey, completed, onToggle, onClose }) {
  if (!journey) {
    return (
      <div className="muted" style={{ padding: 20, textAlign: "center" }}>
        No getting-started journey configured for {role}.
      </div>
    );
  }
  const completedCount = journey.steps.filter(s => completed[s.feature]).length;
  const progress = journey.steps.length > 0 ? Math.round(completedCount / journey.steps.length * 100) : 0;

  return (
    <>
      {/* Intro card */}
      <div className="card" style={{
        background: "linear-gradient(135deg, var(--accent-soft-2) 0%, var(--surface) 60%)",
        borderLeft: "3px solid var(--accent)",
      }}>
        <div className="row" style={{ gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center" }}>
            <Ico name="play" size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500, letterSpacing: "-0.015em" }}>Welcome to Atlas</h3>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>
              {journey.welcome}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
            <span className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>Onboarding progress</span>
            <span className="mono tiny" style={{ color: "var(--accent)" }}>{completedCount} / {journey.steps.length}</span>
          </div>
          <div className="progress" style={{ height: 6 }}>
            <span style={{ width: progress + "%" }}/>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="col" style={{ gap: 8 }}>
        {journey.steps.map((s, i) => {
          const f = HELP_FEATURES.find(x => x.key === s.feature);
          const done = !!completed[s.feature];
          return (
            <div key={i} className="card" style={{
              padding: 14,
              borderLeft: "3px solid " + (done ? "var(--green)" : f?.color || "var(--accent)"),
              opacity: done ? 0.75 : 1,
              transition: "opacity var(--dur-base) var(--ease-out)",
            }}>
              <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
                <button
                  onClick={() => onToggle(s.feature)}
                  className="icon-btn"
                  style={{
                    width: 24, height: 24, flexShrink: 0, marginTop: 1,
                    background: done ? "var(--green)" : "var(--surface)",
                    color: done ? "#fff" : "var(--ink-5)",
                    border: "1.5px solid " + (done ? "var(--green)" : "var(--line-2)"),
                    borderRadius: "50%",
                  }}
                  title={done ? "Mark incomplete" : "Mark complete"}
                >
                  {done ? <Ico name="check" size={12}/> : <span style={{ fontSize: 10, fontWeight: 600, color: "var(--ink-4)" }}>{i+1}</span>}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ gap: 6, marginBottom: 2 }}>
                    {f && <Ico name={f.icon} size={12} color={f.color}/>}
                    <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)", textDecoration: done ? "line-through" : "none" }}>{s.label}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", lineHeight: 1.5 }}>{s.why}</div>
                  {f?.try && (
                    <button className="btn xs" style={{ marginTop: 8 }} onClick={() => { location.hash = "#/" + f.try.route; onClose(); }}>
                      <Ico name="arrRight" size={11}/>{f.try.label}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// ============================================
// Features tab
// ============================================
function FeaturesTab({ featuresBySection, onClose, expandedKey, onToggleExpand }) {
  const sections = Object.keys(featuresBySection);
  if (sections.length === 0) {
    return <div className="empty"><Ico name="search" size={28} color="var(--ink-5)"/><h3>No matches</h3><div>Try a different search term.</div></div>;
  }
  return (
    <>
      {sections.map(section => (
        <div key={section}>
          <div className="muted xs" style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, padding: "4px 0 8px" }}>{section}</div>
          <div className="col" style={{ gap: 8 }}>
            {featuresBySection[section].map(f => (
              <FeatureCard
                key={f.key}
                feature={f}
                onClose={onClose}
                expanded={expandedKey === f.key}
                onToggle={() => onToggleExpand(expandedKey === f.key ? null : f.key)}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function FeatureCard({ feature, onClose, expanded, onToggle }) {
  // Scroll into view when expanded from deep-link
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (expanded && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [expanded]);
  return (
    <div ref={ref} className="card" style={{ padding: 0, overflow: "hidden", transition: "box-shadow var(--dur-fast) var(--ease-out)" }}>
      <div
        style={{ padding: 14, cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start" }}
        onClick={onToggle}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: feature.color + "1A",
          color: feature.color,
          display: "grid", placeItems: "center",
          flexShrink: 0,
        }}>
          <Ico name={feature.icon} size={14}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="row" style={{ justifyContent: "space-between", gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500, letterSpacing: "-0.015em" }}>{feature.title}</h3>
            <Ico name={expanded ? "arrUp" : "arrDown"} size={12} color="var(--ink-4)"/>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>{feature.summary}</div>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 14px 14px 58px", borderTop: "1px solid var(--line)" }}>
          <div className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500, padding: "10px 0 6px" }}>What it does</div>
          <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
            {feature.capabilities.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
          {feature.try && (
            <button className="btn sm" style={{ marginTop: 12 }} onClick={() => { location.hash = "#/" + feature.try.route; onClose(); }}>
              <Ico name="arrRight" size={11}/>{feature.try.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// FAQ tab
// ============================================
function FAQsTab({ faqs }) {
  const [openId, setOpenId] = React.useState(null);
  if (faqs.length === 0) {
    return <div className="empty"><Ico name="search" size={28} color="var(--ink-5)"/><h3>No FAQs match</h3><div>Try a different search term.</div></div>;
  }
  return (
    <div className="col" style={{ gap: 6 }}>
      {faqs.map((f, i) => {
        const open = openId === i;
        return (
          <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div
              style={{ padding: "12px 14px", cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start", background: open ? "var(--surface-2)" : "var(--surface)" }}
              onClick={() => setOpenId(open ? null : i)}
            >
              <Ico name="help" size={14} color="var(--accent)" style={{ marginTop: 2 }}/>
              <div style={{ flex: 1, fontSize: 13, fontWeight: open ? 500 : 400, color: "var(--ink)" }}>{f.q}</div>
              <Ico name={open ? "arrUp" : "arrDown"} size={12} color="var(--ink-4)"/>
            </div>
            {open && (
              <div style={{ padding: "0 14px 14px 40px", fontSize: 12.5, color: "var(--ink-3)", lineHeight: 1.6 }}>
                {f.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// Shortcuts tab
// ============================================
function ShortcutsTab() {
  return (
    <>
      {HELP_SHORTCUTS.map(g => (
        <div key={g.group}>
          <div className="muted xs" style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, padding: "4px 0 8px" }}>{g.group}</div>
          <div className="card" style={{ padding: 0 }}>
            {g.items.map((s, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 14px",
                borderBottom: i < g.items.length - 1 ? "1px solid var(--line)" : "none",
                fontSize: 13,
              }}>
                <span style={{ color: "var(--ink-2)" }}>{s.desc}</span>
                <div className="row" style={{ gap: 4 }}>
                  {s.keys.map((k, j) => (
                    <kbd key={j} style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      padding: "2px 7px",
                      background: "var(--surface-3)",
                      border: "1px solid var(--line-2)",
                      borderRadius: 4,
                      color: "var(--ink-2)",
                      boxShadow: "0 1px 0 var(--line-2)",
                    }}>{k}</kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// ============================================
// What's new tab — changelog filtered by role
// ============================================
function WhatsNewTab({ changelog, role }) {
  if (changelog.length === 0) {
    return (
      <div className="empty">
        <Ico name="zap" size={28} color="var(--ink-5)"/>
        <h3>Nothing new</h3>
        <div>No recent updates affect your role.</div>
      </div>
    );
  }
  // Group by date
  const byDate = {};
  for (const c of changelog) {
    if (!byDate[c.date]) byDate[c.date] = [];
    byDate[c.date].push(c);
  }
  const dates = Object.keys(byDate).sort().reverse();

  return (
    <>
      <div className="card" style={{
        background: "linear-gradient(135deg, var(--violet-soft) 0%, var(--surface) 60%)",
        borderLeft: "3px solid var(--violet)",
      }}>
        <div className="row" style={{ gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--violet)", color: "#fff", display: "grid", placeItems: "center" }}>
            <Ico name="zap" size={16}/>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500, letterSpacing: "-0.015em" }}>What's new for {role}s</h3>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>
              Recent platform updates relevant to your role. Most-recent first.
            </div>
          </div>
        </div>
      </div>

      {dates.map(date => {
        const d = new Date(date + "T12:00:00Z");
        const label = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
        return (
          <div key={date}>
            <div className="muted xs" style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, padding: "4px 0 8px" }}>
              {label}
            </div>
            <div className="col" style={{ gap: 8 }}>
              {byDate[date].map((c, i) => (
                <div key={i} className="card" style={{ padding: 14 }}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
                    <h4 style={{ margin: 0, fontSize: 13.5, fontWeight: 500, letterSpacing: "-0.015em" }}>
                      {c.headline}
                    </h4>
                    <span className="badge" style={{ background: "var(--accent-soft-2)", color: "var(--accent)", fontSize: 10, fontWeight: 500 }}>
                      {c.version}
                    </span>
                  </div>
                  <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.7 }}>
                    {c.points.map((p, j) => <li key={j}>{p}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

// ============================================
// About tab
// ============================================
function AboutTab({ role, featureCount }) {
  return (
    <>
      <div className="card">
        <div className="row" style={{ gap: 12, alignItems: "flex-start" }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: "var(--accent)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 18 }}>A</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500, letterSpacing: "-0.015em" }}>Atlas EPM</h3>
            <div className="muted tiny mono">v0.4 · Engineering Project Management</div>
            <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 8, lineHeight: 1.6 }}>
              Atlas is the project management platform for engineering consultancies. It covers the full lifecycle: scope, plan, execute, control, close. Built for multi-project portfolios with strong cost discipline and resource visibility.
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="muted xs" style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, marginBottom: 10 }}>Your access</div>
        <div className="col" style={{ gap: 8, fontSize: 12.5 }}>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="muted">Role</span>
            <span style={{ fontWeight: 500 }}>{role}</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="muted">Features available</span>
            <span className="mono">{featureCount}</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between" }}>
            <span className="muted">Visible nav items</span>
            <span className="mono">{((window.ROLE_NAV && window.ROLE_NAV[role]) || HELP_FEATURES.map(f => f.nav)).length}</span>
          </div>
        </div>
        <div className="muted tiny" style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--line)", lineHeight: 1.5 }}>
          The Help centre shows only content you can act on. Switching role (top-right user chip) will refresh this view.
        </div>
      </div>

      <div className="card">
        <div className="muted xs" style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500, marginBottom: 10 }}>Support</div>
        <div className="col" style={{ gap: 10, fontSize: 13 }}>
          <a href="mailto:support@atlas-epm.example" style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink-2)", textDecoration: "none" }}>
            <Ico name="mail" size={14} color="var(--accent)"/>support@atlas-epm.example
          </a>
          <a href="#/settings" style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink-2)", textDecoration: "none" }}>
            <Ico name="settings" size={14} color="var(--accent)"/>Settings & integrations
          </a>
          <a href="https://docs.atlas-epm.example" style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ink-2)", textDecoration: "none" }}>
            <Ico name="bookOpen" size={14} color="var(--accent)"/>Full documentation
          </a>
        </div>
      </div>
    </>
  );
}

Object.assign(window, {
  HelpCentre, HELP_FEATURES, HELP_CHANGELOG,
  featuresForRole, faqsForRole, gettingStartedForRole, changelogForRole,
});
