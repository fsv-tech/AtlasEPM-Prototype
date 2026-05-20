// ============================================
// Atlas — Global Guided Tour (portal-rendered)
// Multi-screen, autoplay, smooth animation, every section covered
// ============================================

function Tour({ steps, onClose, autoplay: initialAutoplay }) {
  const [idx, setIdx] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(initialAutoplay !== false);
  const [speed, setSpeed] = React.useState("normal");
  const [rect, setRect] = React.useState(null);
  const [animating, setAnimating] = React.useState(false);

  const step = steps[idx];
  const speedMs = { slow: 8000, normal: 5500, fast: 3000 }[speed];

  React.useEffect(() => {
    if (!step) return;

    if (step.route) {
      const wantHash = "#/" + step.route;
      if (location.hash !== wantHash && !location.hash.startsWith(wantHash + "/")) {
        location.hash = wantHash;
      }
    }

    setAnimating(true);
    const animOff = setTimeout(() => setAnimating(false), 560);

    let raf, last = null, didInitialScroll = false;

    function tick() {
      const el = step.selector ? document.querySelector(step.selector) : null;
      if (!el) {
        if (last !== null) { setRect(null); last = null; }
      } else {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          if (!didInitialScroll) {
            didInitialScroll = true;
            const cs = getComputedStyle(el);
            const stickyOrFixed = cs.position === "sticky" || cs.position === "fixed";
            const inView = r.top >= 8 && r.bottom <= window.innerHeight - 8;
            if (!inView && !stickyOrFixed) {
              const targetY = window.scrollY + r.top - (window.innerHeight - r.height) / 2;
              window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
            }
          }
          if (!last ||
              Math.abs(r.left   - last.left)   > 0.5 ||
              Math.abs(r.top    - last.top)    > 0.5 ||
              Math.abs(r.width  - last.width)  > 0.5 ||
              Math.abs(r.height - last.height) > 0.5) {
            last = { left: r.left, top: r.top, width: r.width, height: r.height };
            setRect(last);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(raf); clearTimeout(animOff); };
  }, [idx, step]);

  // Autoplay
  React.useEffect(() => {
    if (!autoplay) return;
    const t = setTimeout(() => {
      if (idx < steps.length - 1) setIdx(idx + 1);
      else setAutoplay(false);
    }, speedMs);
    return () => clearTimeout(t);
  }, [idx, autoplay, speedMs, steps.length]);

  // Keyboard
  React.useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") setIdx(i => Math.min(steps.length - 1, i + 1));
      else if (e.key === "ArrowLeft")  setIdx(i => Math.max(0, i - 1));
      else if (e.key === " ") { e.preventDefault(); setAutoplay(a => !a); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [steps.length, onClose]);

  const tooltipW = 400;
  const tooltipH = 340;
  const tooltipPos = React.useMemo(() => {
    if (!rect) {
      return { left: window.innerWidth/2 - tooltipW/2, top: window.innerHeight/2 - tooltipH/2, side: "center" };
    }
    const vw = window.innerWidth, vh = window.innerHeight;
    const pad = 16, minTop = 72, minLeft = 16;
    const fitsRight  = rect.right + pad + tooltipW + minLeft <= vw;
    const fitsLeft   = rect.left - pad - tooltipW            >= minLeft;
    const fitsBelow  = rect.bottom + pad + tooltipH + minLeft <= vh;
    const fitsAbove  = rect.top - pad - tooltipH             >= minTop;

    const alignV = () => Math.max(minTop, Math.min(vh - tooltipH - minLeft, rect.top + rect.height/2 - tooltipH/2));
    const alignH = () => Math.max(minLeft, Math.min(vw - tooltipW - minLeft, rect.left + rect.width/2 - tooltipW/2));

    if (fitsRight)  return { left: rect.right + pad,           top: alignV(),  side: "right"  };
    if (fitsLeft)   return { left: rect.left - pad - tooltipW, top: alignV(),  side: "left"   };
    if (fitsBelow)  return { left: alignH(),                   top: rect.bottom + pad, side: "bottom" };
    if (fitsAbove)  return { left: alignH(),                   top: rect.top - pad - tooltipH, side: "top" };
    return { left: vw/2 - tooltipW/2, top: vh - tooltipH - 24, side: "floating" };
  }, [rect]);

  const cutout = rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null;
  const sectionColor = step?.color || "#2563EB";

  return ReactDOM.createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 200, pointerEvents: "none" }}>
      {cutout ? (
        <div style={{
          position: "fixed",
          left: cutout.left, top: cutout.top,
          width: cutout.width, height: cutout.height,
          borderRadius: 12,
          boxShadow:
            `0 0 0 9999px rgba(8, 13, 28, 0.65), ` +
            `0 0 0 2px ${sectionColor} inset, ` +
            `0 0 0 6px ${sectionColor}33 inset`,
          pointerEvents: "auto",
          transition: animating ? "all 520ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}/>
      ) : (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(8, 13, 28, 0.65)",
          backdropFilter: "blur(2px)",
          pointerEvents: "auto",
        }}/>
      )}

      <div style={{
        position: "fixed",
        left: tooltipPos.left, top: tooltipPos.top,
        width: tooltipW,
        background: "var(--surface)",
        borderRadius: 16,
        boxShadow: "0 32px 64px rgba(15,23,41,0.32), 0 4px 12px rgba(15,23,41,0.10)",
        pointerEvents: "auto",
        overflow: "hidden",
        transition: animating
          ? "left 520ms cubic-bezier(0.22, 1, 0.36, 1), top 520ms cubic-bezier(0.22, 1, 0.36, 1)"
          : "none",
      }}>
        <div style={{ height: 4, background: `linear-gradient(90deg, ${sectionColor} 0%, ${sectionColor}88 100%)` }}/>
        <div style={{ padding: "16px 18px 12px", background: `linear-gradient(135deg, ${sectionColor}14 0%, ${sectionColor}04 60%)`, borderBottom: "1px solid var(--line)" }}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div className="row" style={{ gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: sectionColor, color: "#fff", display: "grid", placeItems: "center", boxShadow: `0 4px 10px ${sectionColor}55` }}>
                <Ico name={step?.icon || "info"} size={15}/>
              </div>
              <div>
                <div style={{ fontSize: 10.5, letterSpacing: "0.16em", textTransform: "uppercase", color: sectionColor, fontWeight: 600 }}>
                  {step?.eyebrow || "Step " + (idx + 1)}
                </div>
                <div style={{ fontSize: 10.5, color: "var(--ink-4)", marginTop: 2, fontFamily: "var(--font-mono)" }}>
                  {idx + 1} / {steps.length} · {step?.section || "Overview"}
                </div>
              </div>
            </div>
            <button className="icon-btn" onClick={onClose} title="Exit tour" data-no-toast style={{ width: 28, height: 28, color: "var(--ink-4)" }}>
              <Ico name="x" size={14}/>
            </button>
          </div>
          <h3 style={{ fontSize: 19, fontWeight: 500, letterSpacing: "-0.025em", margin: "12px 0 0", lineHeight: 1.2, color: "var(--ink)" }}>
            {step?.title}
          </h3>
        </div>

        <div style={{ padding: "16px 18px", maxHeight: 220, overflowY: "auto" }}>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)", margin: 0 }}>{step?.body}</p>
          {step?.bullets && (
            <ul style={{ marginTop: 12, paddingLeft: 0, listStyle: "none", fontSize: 12.5, color: "var(--ink-3)" }}>
              {step.bullets.map((b, i) => (
                <li key={i} style={{ padding: "5px 0", display: "flex", gap: 9, alignItems: "flex-start" }}>
                  <span style={{ width: 4, height: 4, borderRadius: 4, background: sectionColor, marginTop: 8, flexShrink: 0 }}/>
                  <span style={{ lineHeight: 1.55 }}>{b}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ height: 3, background: "var(--surface-3)" }}>
          <div style={{ height: "100%", width: `${((idx + 1) / steps.length) * 100}%`, background: `linear-gradient(90deg, ${sectionColor} 0%, ${sectionColor}AA 100%)`, transition: "width 520ms cubic-bezier(0.22, 1, 0.36, 1)" }}/>
        </div>

        <div style={{ padding: "10px 14px", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <div className="row" style={{ gap: 4 }}>
            <button className="icon-btn" disabled={idx === 0} onClick={() => setIdx(i => Math.max(0, i - 1))} data-no-toast title="Previous (←)" style={{ width: 28, height: 28, opacity: idx === 0 ? 0.3 : 1 }}>
              <Ico name="chevLeft" size={14}/>
            </button>
            <button className="icon-btn" onClick={() => setAutoplay(a => !a)} data-no-toast title={autoplay ? "Pause (space)" : "Play (space)"} style={{ width: 30, height: 30, background: sectionColor, color: "#fff" }}>
              <Ico name={autoplay ? "pause" : "play"} size={13}/>
            </button>
            <button className="icon-btn" disabled={idx === steps.length - 1} onClick={() => setIdx(i => Math.min(steps.length - 1, i + 1))} data-no-toast title="Next (→)" style={{ width: 28, height: 28, opacity: idx === steps.length - 1 ? 0.3 : 1 }}>
              <Ico name="chevRight" size={14}/>
            </button>
          </div>

          <div className="row" style={{ gap: 3 }}>
            <span className="muted xs" style={{ marginRight: 5, fontWeight: 500 }}>SPEED</span>
            {[{ v: "slow", l: "0.5×" }, { v: "normal", l: "1×" }, { v: "fast", l: "2×" }].map(s => (
              <button key={s.v} onClick={() => setSpeed(s.v)} data-no-toast
                style={{ padding: "3px 8px", fontSize: 10.5, fontFamily: "var(--font-mono)", borderRadius: 4, cursor: "pointer", fontWeight: 600,
                  background: speed === s.v ? sectionColor : "transparent",
                  color: speed === s.v ? "#fff" : "var(--ink-3)",
                  border: speed === s.v ? `1px solid ${sectionColor}` : "1px solid var(--line)",
                }}>{s.l}</button>
            ))}
          </div>
        </div>

        <div style={{ padding: "10px 14px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span className="muted tiny" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <kbd style={{ background: "var(--surface-3)", border: "1px solid var(--line)", borderRadius: 3, padding: "1px 5px", fontFamily: "var(--font-mono)", fontSize: 10 }}>Esc</kbd>
            <span>to exit</span>
          </span>
          {idx < steps.length - 1 ? (
            <button className="btn xs" onClick={() => setIdx(idx + 1)} data-no-toast style={{ background: sectionColor, color: "#fff", border: "none" }}>
              Next <Ico name="arrRight" size={11}/>
            </button>
          ) : (
            <button className="btn xs" onClick={onClose} data-no-toast style={{ background: "var(--green)", color: "#fff", border: "none" }}>
              <Ico name="check" size={11}/> Finish
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes tour-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%      { opacity: 0.95; transform: scale(1.012); }
        }
      `}</style>
    </div>,
    document.body
  );
}

// ============================================
// ATLAS_TOUR_STEPS — comprehensive walkthrough of every screen + section
// ============================================
// Section colour palette
const C = {
  intro:   "#2563EB",
  nav:     "#0F1729",
  dash:    "#2563EB",
  plan:    "#10B981",
  res:     "#F59E0B",
  comm:    "#7C3AED",
  deliv:   "#0EA5E9",
  risk:    "#EF4444",
  team:    "#F59E0B",
  insight: "#EC4899",
  admin:   "#475569",
};

const ATLAS_TOUR_STEPS = [
  // —— Welcome ————————————————————————————————————————
  { eyebrow: "Welcome to Atlas", icon: "play", section: "Intro", color: C.intro,
    title: "The full guided walkthrough",
    body: "In about three minutes we'll visit every screen and explain every section — KPIs, charts, tables, controls and side panels — one by one. Auto-plays at 1×; adjust speed at the bottom or use ←/→ to step manually.",
    bullets: ["Spotlight = the element being explained", "Tooltip moves to stay next to it", "Esc to exit any time"],
  },

  // —— App shell ————————————————————————————————————————
  { route: "dashboard", selector: ".sidebar", eyebrow: "App shell · Sidebar", icon: "menu", section: "Navigation", color: C.nav,
    title: "The sidebar — every module, role-aware",
    body: "Grouped by intent: Workspace, Projects, Delivery, People, Insights, Admin. Counts on the right are live (open approvals, risks, change requests). The visible items change based on the role you're viewing as.",
  },
  { route: "dashboard", selector: ".role-switcher", eyebrow: "App shell · Persona", icon: "users", section: "Navigation", color: C.nav,
    title: "Viewing as — preview any role",
    body: "Switch persona to see exactly what Engineers, Planners, Commercial, Clients or QA see. Sidebar items, action buttons, and visible projects all change immediately based on the permission matrix.",
  },
  { route: "dashboard", selector: ".topbar", eyebrow: "App shell · Topbar", icon: "search", section: "Navigation", color: C.nav,
    title: "Topbar — search, notifications, profile",
    body: "Global search hits projects, employees, deliverables. The bell opens a notifications popover, the gear opens settings, your avatar shows profile / preferences / sign-out.",
  },

  // —— Dashboard ————————————————————————————————————————
  { route: "dashboard", selector: ".kpi-grid", eyebrow: "Dashboard · KPI strip", icon: "dashboard", section: "Workspace", color: C.dash,
    title: "Five KPIs roll up the portfolio",
    body: "Active projects, budget, engineers, risks, utilization. The dark featured tile is always the most important metric on the page.",
  },
  { route: "dashboard", selector: '[data-tour-id="status-mix"]', eyebrow: "Dashboard · Status", icon: "pie", section: "Workspace", color: C.dash,
    title: "Project status mix",
    body: "Donut + 2×2 grid breakdown — Active / Planning / Closeout / On Hold counts. Health flags (Green / Amber / Red) sit underneath so flagged projects are one glance away.",
  },
  { route: "dashboard", selector: '[data-tour-id="resource-util"]', eyebrow: "Dashboard · Resources", icon: "activity", section: "Workspace", color: C.dash,
    title: "Discipline utilization this week",
    body: "Per-discipline load with coloured progress bars. Anything above 85% turns red and triggers the alert callout below — usually \"open Resource Planner and rebalance\".",
  },
  { route: "dashboard", selector: '[data-tour-id="burn-rate"]', eyebrow: "Dashboard · Burn rate", icon: "barChart", section: "Workspace", color: C.dash,
    title: "Weekly burn rate",
    body: "Last 12 weeks of portfolio spend (K USD) with the current week highlighted. Spotting acceleration here three weeks before the monthly cost report is the difference between adjusting and over-running.",
  },
  { route: "dashboard", selector: '[data-tour-id="top-projects"]', eyebrow: "Dashboard · Projects", icon: "folder", section: "Workspace", color: C.dash,
    title: "Top projects by value",
    body: "Largest projects by budget. Progress + spent per row gives you the financial vs schedule glance. Click any row to drill into the project's 10-tab workspace.",
  },
  { route: "dashboard", selector: '[data-tour-id="recent-activity"]', eyebrow: "Dashboard · Activity", icon: "bell", section: "Workspace", color: C.dash,
    title: "Recent activity",
    body: "Live notifications — approval requests, deliverable updates, budget thresholds, risk severity, mentions. Blue dot = unread.",
  },
  { route: "dashboard", selector: '[data-tour-id="approvals-card"]', eyebrow: "Dashboard · Approvals", icon: "checkSquare", section: "Workspace", color: C.dash,
    title: "Approvals waiting on you",
    body: "Items in the approval chain assigned to your role. Priority pill on the right; approver avatar shows who's already signed off.",
  },
  { route: "dashboard", selector: '[data-tour-id="milestones-card"]', eyebrow: "Dashboard · Milestones", icon: "diamond", section: "Workspace", color: C.dash,
    title: "Upcoming milestones",
    body: "Next 5 milestones for the active project. The day counter lights up amber under 14 days, red under 7 days.",
  },

  // —— Projects list ————————————————————————————————————————
  { route: "projects", selector: ".page-header", eyebrow: "Projects · Header", icon: "folder", section: "Plan", color: C.plan,
    title: "Projects — the master list",
    body: "Every project the firm has worked on, with action buttons to export, filter or create a new one in the top-right.",
  },
  { route: "projects", selector: ".chips", eyebrow: "Projects · Filters", icon: "filter", section: "Plan", color: C.plan,
    title: "Status filter chips",
    body: "Quick status filters — All / Active / Planning / On Hold / Closeout — with counts. Below the chips are additional dropdown filters for client, type, and view (table vs cards).",
  },
  { route: "projects", selector: ".table-wrap", eyebrow: "Projects · Register", icon: "list", section: "Plan", color: C.plan,
    title: "The project register",
    body: "Each row shows progress + spent so you can spot the overspenders and underdelivers at a glance. The coloured strip at the left is the project type; the dot at the right is the health flag.",
  },

  // —— Project detail ————————————————————————————————————————
  { route: "projects/P-001", selector: ".page-header, .crumb", eyebrow: "Project · Header", icon: "folder", section: "Plan", color: C.plan,
    title: "Project header & quick actions",
    body: "Project name, code, client, schedule, PM and status. The big progress bar shows schedule completion. Quick actions: Star, Share, more, Add deliverable.",
  },
  { route: "projects/P-001", selector: ".tabs", eyebrow: "Project · Tabs", icon: "layers", section: "Plan", color: C.plan,
    title: "Ten tabs for the full project life",
    body: "Overview, Team, Disciplines, Deliverables, Cost, Risks, Changes, Approvals, Documents, Schedule. The badge on each tab shows the live count for that section.",
  },
  { route: "projects/P-001", selector: ".kpi-grid", eyebrow: "Project · Overview KPIs", icon: "dashboard", section: "Plan", color: C.plan,
    title: "Overview KPIs",
    body: "Progress, hours consumed vs plan, remaining budget, late deliverables, open risks. Each tile drills into the matching tab below.",
  },
  { route: "projects/P-001/team", selector: ".table-wrap", eyebrow: "Project · Team", icon: "users", section: "Plan", color: C.plan,
    title: "Team & allocations",
    body: "Every engineer assigned with their discipline, role on this project, allocation %, and period. Allocation bar turns red over 80% so you can spot bottlenecks.",
  },
  { route: "projects/P-001/disciplines", selector: ".content", eyebrow: "Project · Disciplines", icon: "layers", section: "Plan", color: C.plan,
    title: "Discipline workspace",
    body: "Pick a discipline from the chip row at the top — Mechanical, Electrical, etc. Each shows planned vs actual hours, budget vs spent, owned deliverables, assigned team, lead, alerts and interface dependencies.",
  },
  { route: "projects/P-001/deliverables", selector: ".table-wrap", eyebrow: "Project · Deliverables", icon: "fileText", section: "Delivery", color: C.deliv,
    title: "Deliverable register (project-scoped)",
    body: "Every deliverable for this project — code, title, discipline, owner, status, progress, planned vs actual. Filter by status or discipline using the chips above.",
  },
  { route: "projects/P-001/cost", selector: ".kpi-grid", eyebrow: "Project · Cost KPIs", icon: "coin", section: "Commercial", color: C.comm,
    title: "Project cost KPIs",
    body: "Budget, committed, spent, forecast at completion, contingency drawn. Variance lights up red when forecast exceeds budget by more than 2%.",
  },
  { route: "projects/P-001/cost", selector: ".content > .grid", eyebrow: "Project · S-curve", icon: "lineChart", section: "Commercial", color: C.comm,
    title: "S-curve + scenario modelling",
    body: "Earned value chart: planned vs actual vs forecast. \"NOW\" marker shows where you are. The scenario panel on the right lets you simulate +2 engineers, +3 weeks, vendor changes — see combined impact instantly.",
  },
  { route: "projects/P-001/cost", selector: ".table-wrap", eyebrow: "Project · Cost by discipline", icon: "barChart", section: "Commercial", color: C.comm,
    title: "Cost by discipline",
    body: "Hours × rate × fee factor, broken down per discipline. Shows planned vs actual hours, average rate, cost, budget, margin and health.",
  },
  { route: "projects/P-001/risks", selector: ".content > .grid", eyebrow: "Project · Risk matrix", icon: "shield", section: "Risk", color: C.risk,
    title: "5×5 risk heat map",
    body: "Probability × Impact. Cells over score 15 are red. Risk IDs appear inside each cell. The register on the right shows the full list with trend arrows — rising risks are the leading indicator to watch.",
  },
  { route: "projects/P-001/changes", selector: ".table-wrap", eyebrow: "Project · Changes", icon: "git", section: "Delivery", color: C.deliv,
    title: "Change requests",
    body: "Every scope change with hour, cost and schedule impact. Status flows Submitted → In Review → Approved/Rejected.",
  },
  { route: "projects/P-001/approvals", selector: ".table-wrap", eyebrow: "Project · Approvals", icon: "checkSquare", section: "Delivery", color: C.deliv,
    title: "Project approval queue",
    body: "Everything waiting for sign-off on this project. Sorted by priority. Click Approve/Reject inline for pending items.",
  },
  { route: "projects/P-001/documents", selector: ".table-wrap", eyebrow: "Project · Documents", icon: "folder", section: "Delivery", color: C.deliv,
    title: "Document register",
    body: "Every deliverable, drawing, calculation and report uploaded against this project. Code, title, discipline, type, version, author, date and size.",
  },
  { route: "projects/P-001/gantt", selector: ".table-head", eyebrow: "Project · Schedule", icon: "gantt", section: "Plan", color: C.plan,
    title: "Project Gantt",
    body: "Monthly timeline with discipline workstreams as horizontal bars. Milestones render as accent diamonds. Drag bars to reschedule.",
  },

  // —— Resource calendar ————————————————————————————————————
  { route: "calendar", selector: ".kpi-grid", eyebrow: "Resources · KPIs", icon: "activity", section: "Plan", color: C.res,
    title: "Capacity at a glance",
    body: "Engineers loaded this week, total planned hours, avg utilization vs the 80% target, over-allocated count, and holiday conflicts.",
  },
  { route: "calendar", selector: ".card.flush", eyebrow: "Resources · Calendar", icon: "calendar", section: "Plan", color: C.res,
    title: "14-week resource planner",
    body: "Each row is an engineer; each cell is their planned hours that week. The colour bar at the bottom of each cell shows project distribution. Red cells = over-allocated.",
    bullets: ["Click a cell to edit", "Drag a bar to reassign hours", "Assign button opens a quick form"],
  },

  // —— Standalone Gantt ————————————————————————————————————
  { route: "gantt", selector: ".content", eyebrow: "Plan · Gantt", icon: "gantt", section: "Plan", color: C.res,
    title: "Cross-project Gantt",
    body: "Same Gantt as the project workspace but with a project-switcher at the top so you can jump between projects without losing the schedule view.",
  },

  // —— Cost portfolio ————————————————————————————————————
  { route: "cost", selector: ".kpi-grid", eyebrow: "Cost · Portfolio KPIs", icon: "coin", section: "Commercial", color: C.comm,
    title: "Portfolio cost KPIs",
    body: "Total budget, committed, spent, forecast at completion and margin across all projects. Forecast variance lights up red when over 2% of budget.",
  },
  { route: "cost", selector: ".content > .grid", eyebrow: "Cost · Burn + variance", icon: "lineChart", section: "Commercial", color: C.comm,
    title: "Monthly burn + per-project variance",
    body: "Left: monthly burn across all active projects, with the current month highlighted. Right: each project's forecast variance from baseline — quickly spot the over-runners.",
  },
  { route: "cost", selector: ".table-wrap", eyebrow: "Cost · Project summary", icon: "list", section: "Commercial", color: C.comm,
    title: "Per-project cost summary",
    body: "Budget, committed, spent, forecast, variance and health for every project. Click any row to open the project's cost engine.",
  },

  // —— Deliverables tracker ————————————————————————————————
  { route: "deliverables", selector: ".kpi-grid", eyebrow: "Deliverables · KPIs", icon: "fileText", section: "Delivery", color: C.deliv,
    title: "Deliverable KPIs",
    body: "Total, in-progress, in-review, approved/issued, delayed. Late items are flagged across the portfolio so you can triage in one screen.",
  },
  { route: "deliverables", selector: ".table-wrap", eyebrow: "Deliverables · Tracker", icon: "layers", section: "Delivery", color: C.deliv,
    title: "Portfolio deliverable register",
    body: "Every drawing, calc and report across every project. Filter by status, discipline or project. Click any row to open the deliverable detail.",
  },

  // —— Deliverable detail ————————————————————————————————
  { route: "deliverables/DEL-0011", selector: ".content > .card", eyebrow: "Deliverable · Header", icon: "fileText", section: "Delivery", color: C.deliv,
    title: "Deliverable header & workflow",
    body: "Code, title, discipline, owner, status, planned vs actual date — plus the workflow strip showing Draft → In Review → Approved → Issued with timestamps.",
  },
  { route: "deliverables/DEL-0011", selector: ".tabs", eyebrow: "Deliverable · Tabs", icon: "list", section: "Delivery", color: C.deliv,
    title: "Detail tabs",
    body: "Overview · Revisions (history of every rev) · Comments (review thread) · Approvals (chain status) · Attachments (uploaded files).",
  },

  // —— Approvals centre ————————————————————————————————
  { route: "approvals", selector: ".kpi-grid", eyebrow: "Approvals · KPIs", icon: "checkSquare", section: "Delivery", color: C.deliv,
    title: "Approval centre KPIs",
    body: "Awaiting you, approved this month, average turnaround, overdue, % auto-routed correctly.",
  },
  { route: "approvals", selector: ".card", eyebrow: "Approvals · Workflow", icon: "share", section: "Delivery", color: C.deliv,
    title: "Standard approval chain",
    body: "Engineer → Lead (technical review) → PM (schedule & budget) → Commercial (cost > threshold) → Executive (strategic). Different routes for different entities.",
  },
  { route: "approvals", selector: ".tabs", eyebrow: "Approvals · Tabs", icon: "filter", section: "Delivery", color: C.deliv,
    title: "Status tabs",
    body: "Pending · Approved · Rejected · All — with live counts. Pending is your action queue.",
  },

  // —— Changes ————————————————————————————————
  { route: "changes", selector: ".kpi-grid", eyebrow: "Changes · KPIs", icon: "git", section: "Delivery", color: C.deliv,
    title: "Change-request KPIs",
    body: "Approved value, pending value, total hour impact, schedule impact (net days), average cycle time.",
  },
  { route: "changes", selector: ".table-wrap", eyebrow: "Changes · Register", icon: "list", section: "Delivery", color: C.deliv,
    title: "Change-request register",
    body: "Every scope change with hour, cost and schedule impact. Click any row to open the detail drawer with workflow timeline.",
  },

  // —— Risks ————————————————————————————————
  { route: "risks", selector: ".kpi-grid", eyebrow: "Risks · KPIs", icon: "shield", section: "Risk", color: C.risk,
    title: "Risk KPIs",
    body: "Open, high-severity, rising trend, mitigated, closed. The rising trend count is the leading indicator — those risks may not yet be high-score but they're trending wrong.",
  },
  { route: "risks", selector: ".content > .grid", eyebrow: "Risks · Heatmap & Register", icon: "shield", section: "Risk", color: C.risk,
    title: "5×5 heat map + full register",
    body: "Probability × Impact. Score 15+ = red. Click a cell to filter the register. The register shows mitigation, trend arrows and owner per risk.",
  },

  // —— Employees ————————————————————————————————
  { route: "employees", selector: ".chips", eyebrow: "Employees · Filters", icon: "filter", section: "Team", color: C.team,
    title: "Discipline chip filter",
    body: "Quick filter chips with counts. The dropdowns to the right add seniority and a card/table view toggle.",
  },
  { route: "employees", selector: ".grid", eyebrow: "Employees · Directory", icon: "users", section: "Team", color: C.team,
    title: "Employee directory",
    body: "Each card shows name, role, discipline, seniority, rate, skills and current utilization. Click into the card for the full profile.",
  },

  // —— Employee profile ————————————————————————————————
  { route: "employees/EMP-010", selector: ".content > .card", eyebrow: "Employee · Header", icon: "user", section: "Team", color: C.team,
    title: "Employee header card",
    body: "Avatar, name, role, discipline, seniority, contact details and rate. The KPI strip underneath shows utilization, active projects, deliverables owned, YTD hours and effective fee.",
  },
  { route: "employees/EMP-010", selector: ".tabs", eyebrow: "Employee · Tabs", icon: "list", section: "Team", color: C.team,
    title: "Profile tabs",
    body: "Projects (current assignments) · Skills (with proficiency bars + certifications) · Calendar (14-week forward view) · Availability (trend + time off) · Timesheets (last 8 weeks).",
  },

  // —— Reports ————————————————————————————————
  { route: "reports", selector: ".chips", eyebrow: "Reports · Filters", icon: "filter", section: "Insights", color: C.insight,
    title: "Report categories",
    body: "Filter the catalogue by category — Weekly / Executive / Client / Resource / Cost / Project / Risk / Commercial.",
  },
  { route: "reports", selector: ".grid", eyebrow: "Reports · Catalogue", icon: "report", section: "Insights", color: C.insight,
    title: "Pre-built report cards",
    body: "Each card shows the report's purpose, last-run date, schedule and quick-action buttons — Generate, PDF, Excel, PowerPoint, Schedule.",
  },
  { route: "reports", selector: ".card", eyebrow: "Reports · Scheduled", icon: "calendar", section: "Insights", color: C.insight,
    title: "Scheduled reports",
    body: "Reports that run automatically and email a distribution list. The Monday 09:00 progress report is the most common.",
  },

  // —— Analytics ————————————————————————————————
  { route: "analytics", selector: ".kpi-grid", eyebrow: "Analytics · KPIs", icon: "brain", section: "Insights", color: C.insight,
    title: "Performance KPIs",
    body: "Billable hours, revenue, average rate, win rate, on-time delivery — all YTD with deltas vs target.",
  },
  { route: "analytics", selector: ".card", eyebrow: "Analytics · AI insights", icon: "brain", section: "Insights", color: C.insight,
    title: "AI-surfaced patterns",
    body: "Three patterns the system noticed this week — resource bottlenecks, cost variance trends, risk-index changes. Click Investigate for the underlying data.",
  },
  { route: "analytics", selector: ".content > .grid:nth-of-type(2)", eyebrow: "Analytics · Trends", icon: "lineChart", section: "Insights", color: C.insight,
    title: "Utilization & forecast accuracy",
    body: "9-month utilization trend by discipline (left), and per-project forecast accuracy vs baseline (right) — with best/worst performer callouts.",
  },

  // —— Notifications ————————————————————————————————
  { route: "notifications", selector: ".tabs", eyebrow: "Notifications · Tabs", icon: "bell", section: "Insights", color: C.insight,
    title: "Notification filters",
    body: "All / Unread / Approvals / Deliverables / Budget / Risks / Mentions — each with live counts.",
  },
  { route: "notifications", selector: ".card.flush", eyebrow: "Notifications · Feed", icon: "list", section: "Insights", color: C.insight,
    title: "Notification feed",
    body: "Grouped by day (Today / Yesterday / earlier). Unread items have a blue tint and a dot indicator. Click any item to jump to its source.",
  },

  // —— Settings ————————————————————————————————
  { route: "settings", selector: ".tabs", eyebrow: "Settings · Tabs", icon: "settings", section: "Admin", color: C.admin,
    title: "Admin sections",
    body: "Users · Permissions · Disciplines · Templates · Integrations · Email · Branding. Admin role only.",
  },
  { route: "settings", selector: ".table-wrap", eyebrow: "Settings · Users", icon: "users", section: "Admin", color: C.admin,
    title: "User management",
    body: "Every user synced from Microsoft Entra ID with their role, discipline, status, and last login. Invite, sync, or change roles from here.",
  },

  // —— Wrap up ————————————————————————————————
  { route: "dashboard", eyebrow: "That's the tour", icon: "checkCircle", section: "Done", color: "#10B981",
    title: "You've seen every section",
    body: "Atlas covers project, resource, deliverable, cost, risk, change, approval, reporting and analytics — replacing the spreadsheet workflow end-to-end. The docs folder has the full plan to turn this prototype into a deployed product.",
    bullets: ["Click Tour any time to replay", "Try switching roles to see how the platform changes", "Open docs/PROJECT_PLAN.md for the build plan"],
  },
];

window.Tour = Tour;
window.ATLAS_TOUR_STEPS = ATLAS_TOUR_STEPS;
