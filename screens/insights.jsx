// ============================================
// Atlas — Screens 17, 18, 19, 20
//   Reports · Analytics · Notifications · Settings
// ============================================

function ScreenReports() {
  const [category, setCategory] = React.useState("All");
  const [createOpen, setCreateOpen] = React.useState(false);
  const reports = [
    { name: "Weekly progress report",      cat: "Weekly",    desc: "Discipline progress, deliverables, hours, risks raised.", last: "2026-05-14", schedule: "Every Monday 09:00", icon: "report" },
    { name: "Monthly executive summary",   cat: "Executive", desc: "KPIs, budget, milestones, risks for senior leadership.",  last: "2026-05-05", schedule: "1st of month", icon: "trendUp" },
    { name: "Client weekly digest",        cat: "Client",    desc: "External-safe summary suitable for client distribution.",  last: "2026-05-15", schedule: "Every Friday 16:00", icon: "globe" },
    { name: "Resource utilization (HR)",   cat: "Resource",  desc: "Per-discipline and per-engineer utilization by month.",    last: "2026-05-10", schedule: "Monthly", icon: "users" },
    { name: "Cost performance report",     cat: "Cost",      desc: "Earned value, forecast vs budget, contingency drawdown.",  last: "2026-05-12", schedule: "Bi-weekly", icon: "coin" },
    { name: "Deliverable status report",   cat: "Project",   desc: "All deliverables — planned vs actual — coloured by status.", last: "2026-05-13", schedule: "Weekly", icon: "layers" },
    { name: "Risk register snapshot",      cat: "Risk",      desc: "Open risks by severity, mitigation status, change since last.", last: "2026-05-08", schedule: "Bi-weekly", icon: "shield" },
    { name: "Change request log",          cat: "Commercial", desc: "All change requests, approval status, value impact.",     last: "2026-05-14", schedule: "Weekly", icon: "git" },
    { name: "Portfolio dashboard PDF",     cat: "Executive", desc: "Snapshot of portfolio KPIs as a 1-page PDF.",              last: "2026-05-01", schedule: "On demand", icon: "dashboard" },
  ];
  const cats = ["All", ...Array.from(new Set(reports.map(r => r.cat)))];
  const filtered = category === "All" ? reports : reports.filter(r => r.cat === category);

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Insights"
        title="Reports centre"
        subtitle="Pre-built and scheduled reports. Click a card to generate, schedule, or export."
        actions={<button className="btn primary" onClick={() => setCreateOpen(true)} data-no-toast><Ico name="plus" size={13}/>New report</button>}
      />

      <FilterBar
        chips={cats.map(c => ({ value: c, label: c, count: c === "All" ? reports.length : reports.filter(r => r.cat === c).length }))}
        value={category} onChange={setCategory}
      />

      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {filtered.map(r => (
          <div key={r.name} className="card" style={{ cursor: "pointer" }}>
            <div className="row" style={{ gap: 10, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, background: "var(--accent-soft-2)", color: "var(--accent)", borderRadius: 10, display: "grid", placeItems: "center" }}>
                <Ico name={r.icon} size={18}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 500 }}>{r.name}</div>
                <span className="badge outline" style={{ fontSize: 10, marginTop: 2 }}>{r.cat}</span>
              </div>
            </div>
            <p className="muted tiny" style={{ lineHeight: 1.5, marginBottom: 10 }}>{r.desc}</p>
            <div className="row" style={{ justifyContent:"space-between", fontSize: 11, color: "var(--ink-4)" }}>
              <span>Last run: {U.fmtDate(r.last)}</span>
              <span>{r.schedule}</span>
            </div>
            <hr className="divider" style={{ margin: "12px 0 10px" }}/>
            <div className="row" style={{ gap: 6 }}>
              <button className="btn sm primary" style={{ flex: 1, justifyContent:"center" }}>Generate</button>
              <button className="btn sm icon-only" title="PDF"><Ico name="fileText" size={13}/></button>
              <button className="btn sm icon-only" title="Excel"><Ico name="grid" size={13}/></button>
              <button className="btn sm icon-only" title="PPT"><Ico name="cards" size={13}/></button>
              <button className="btn sm icon-only" title="Schedule"><Ico name="calendar" size={13}/></button>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <CardH title="Scheduled reports" subtitle="Reports that run automatically and email a distribution list"/>        <table className="data">
          <thead><tr><th>Report</th><th>Schedule</th><th>Recipients</th><th>Format</th><th>Next run</th><th></th></tr></thead>
          <tbody>
            {[
              { r: "Weekly progress",  s: "Mon 09:00",   to: ["EMP-001","EMP-002","EMP-090","EMP-101"], f: "PDF + Excel", n: "Mon 25 May 09:00" },
              { r: "Client weekly",    s: "Fri 16:00",   to: ["EMP-001","EMP-002"], f: "PDF",          n: "Fri 22 May 16:00" },
              { r: "Monthly exec",     s: "1st 08:00",   to: ["EMP-001","EMP-002","EMP-090"], f: "PPT", n: "Mon 1 Jun 08:00" },
              { r: "Cost performance", s: "Every 14d",   to: ["EMP-090","EMP-091","EMP-092"], f: "Excel", n: "Wed 27 May 09:00" },
            ].map((s, i) => (
              <tr key={i}>
                <td className="cell-strong">{s.r}</td>
                <td>{s.s}</td>
                <td><AvatarStack employees={s.to.map(id => DB.employeeById(id))} size="sm"/></td>
                <td>{s.f}</td>
                <td className="cell-num">{s.n}</td>
                <td><button className="btn xs ghost"><Ico name="more" size={14}/></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {createOpen && <CreateRecordModal
        title="New report"
        subtitle="Build a custom report. Choose a template, configure filters and schedule."
        submitLabel="Create report"
        onClose={() => setCreateOpen(false)}
        fields={[
          { name: "name", label: "Report name", required: true, span: 2, placeholder: "e.g. Monthly cost performance — Q3" },
          { name: "category", label: "Category", type: "select", options: ["Weekly","Executive","Client","Resource","Cost","Project","Risk","Commercial"], default: "Project" },
          { name: "template", label: "Based on template", type: "select", options: ["Blank","Weekly progress","Monthly executive","Cost performance","Risk register","Deliverable status"], default: "Blank" },
          { name: "scope", label: "Project scope", type: "select", options: [{ value: "all", label: "All projects" }, ...DB.projects.map(p => ({ value: p.project_id, label: p.project_code }))], default: "all" },
          { name: "schedule", label: "Schedule", type: "select", options: ["On demand","Daily","Every Monday 09:00","Every Friday 16:00","1st of month 08:00","Bi-weekly"], default: "On demand" },
          { name: "format", label: "Default format", type: "select", options: ["PDF","Excel","PowerPoint","PDF + Excel"], default: "PDF" },
          { name: "recipients", label: "Recipients (comma-separated emails)", span: 2, placeholder: "anders.vestergaard@helix.eng, lina.holm@helix.eng" },
          { name: "notes", label: "Description", type: "textarea", placeholder: "Optional context..." },
        ]}
      />}
    </div>
  );
}

// ============================================
function ScreenAnalytics() {
  const months = ["Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"];

  // Synthetic but plausible metrics
  const billable = 13560;      // hours YTD
  const billableTarget = 18000;
  const revenue   = 4_240_000; // USD YTD
  const avgRate   = 88;
  const winRate   = 67;
  const onTimeRate = 82;
  const avgVariance = 1.4;     // %
  const repeatClients = 73;    // %

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Insights"
        title="Analytics"
        subtitle="Patterns across projects, resources and cost — with AI-surfaced anomalies."
        actions={
          <>
            <button className="btn"><Ico name="calendar" size={13}/>Last 12 months</button>
            <button className="btn"><Ico name="download" size={13}/>Export</button>
          </>
        }
      />

      {/* KPI strip */}
      <div className="kpi-grid">
        <KPI featured label="Billable hours YTD" icon="clock" value={(billable/1000).toFixed(1)} unit="K h" foot={Math.round(billable/billableTarget*100) + "% of target"}/>
        <KPI label="Revenue YTD" icon="dollar" value={"$" + (revenue/1e6).toFixed(2)} unit="M" delta="+12% YoY" deltaDir="up"/>
        <KPI label="Avg billable rate" icon="trendUp" value={"$" + avgRate} unit="/h" delta="+$3 vs LY" deltaDir="up"/>
        <KPI label="Win rate" icon="target" value={winRate + "%"} delta="last 18 bids" sparkData={[58,62,60,65,68,67,70,67]}/>
        <KPI label="On-time delivery" icon="checkCircle" value={onTimeRate + "%"} delta="Target 90%" deltaDir="down"/>
      </div>

      {/* AI insights */}
      <div className="card" style={{ background: "linear-gradient(135deg, var(--navy) 0%, #1E1F4B 100%)", color: "#fff", border: "none" }}>
        <div className="row" style={{ gap: 12, marginBottom: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.1)", display: "grid", placeItems: "center" }}>
            <Ico name="brain" size={18}/>
          </div>
          <div>
            <div className="page-eyebrow" style={{ color: "rgba(255,255,255,0.6)", margin: 0 }}>AI insights · this week</div>
            <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.015em" }}>3 patterns we noticed</div>
          </div>
        </div>
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { i: "alertTri", k: "Resource bottleneck", t: "Electrical resources overloaded in W32–W34. Recommend +1 mid-level Elec engineer or shift EXP-204 by 3 weeks.", color: "#FCA5A5" },
            { i: "trendUp",  k: "Cost variance rising", t: "GFB-101 forecast variance grew +1.4% wk-on-wk. Major driver: H2 package vendor change (CR-002).", color: "#FCD34D" },
            { i: "alertCirc", k: "Risk score increase", t: "Project portfolio risk index up 12% — concentrated in 'logistics' and 'resources' categories. Suggest review.", color: "#A5B4FC" },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.06)", padding: 14, borderRadius: 10 }}>
              <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                <Ico name={s.i} size={14} color={s.color}/>
                <span style={{ fontWeight: 500, fontSize: 12.5 }}>{s.k}</span>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{s.t}</div>
              <button className="btn xs" style={{ marginTop: 10, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none" }}>Investigate</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <CardH title="Resource utilization trend" subtitle="By discipline, last 9 months"/>
          <LineChart h={220} months={months} yMax={100}
            series={[
              { color: "#2563EB", data: [62,68,72,78,82,80,85,88,91], dotR: 3 },
              { color: "#F59E0B", data: [55,58,60,64,70,72,74,76,80], dotR: 3 },
              { color: "#8B5CF6", data: [48,52,58,62,66,68,70,72,72], dotR: 3 },
              { color: "#10B981", data: [40,44,48,52,56,58,60,62,62], dotR: 3 },
            ]}/>
          <div className="row" style={{ justifyContent: "center", gap: 18, marginTop: 10, fontSize: 11 }}>
            <div className="row" style={{ gap: 6 }}><span className="dot" style={{ background: "#2563EB" }}/>Mechanical</div>
            <div className="row" style={{ gap: 6 }}><span className="dot" style={{ background: "#F59E0B" }}/>Electrical</div>
            <div className="row" style={{ gap: 6 }}><span className="dot" style={{ background: "#8B5CF6" }}/>Instrumentation</div>
            <div className="row" style={{ gap: 6 }}><span className="dot" style={{ background: "#10B981" }}/>HSE</div>
          </div>
        </div>

        <div className="card">
          <CardH title="Project forecast accuracy" subtitle="Variance from baseline, by project"/>
          <div className="col" style={{ gap: 10 }}>
            {DB.projects.slice(0, 6).map(p => {
              const c = DB.costs.find(c => c.project_id === p.project_id);
              const vPct = c.variance / p.budget * 100;
              return (
                <div key={p.project_id}>
                  <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
                    <span>{p.project_code}</span>
                    <span className="mono tiny" style={{ color: vPct > 2 ? "var(--red)" : vPct > 0 ? "var(--amber)" : "var(--green)" }}>{vPct > 0 ? "+" : ""}{vPct.toFixed(1)}%</span>
                  </div>
                  <div style={{ position: "relative", height: 6, background: "var(--surface-3)", borderRadius: 3 }}>
                    <span style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 1, background: "var(--ink-4)" }}/>
                    {vPct >= 0
                      ? <span style={{ position: "absolute", left: "50%", top: 0, height: 6, width: Math.min(50, Math.abs(vPct)*6) + "%", background: vPct > 2 ? "var(--red)" : "var(--amber)", borderRadius: 0 }}/>
                      : <span style={{ position: "absolute", right: "50%", top: 0, height: 6, width: Math.min(50, Math.abs(vPct)*6) + "%", background: "var(--green)" }}/>
                    }
                  </div>
                </div>
              );
            })}
          </div>

          <hr className="divider" style={{ margin: "16px 0 12px" }}/>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
            <span className="muted">Avg variance</span>
            <span className="mono" style={{ color: "var(--amber)" }}>+{avgVariance}%</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
            <span className="muted">Best performer</span>
            <span className="mono">BRB-022 (-1.8%)</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
            <span className="muted">Worst performer</span>
            <span className="mono" style={{ color: "var(--red)" }}>WTP-505 (+8.0%)</span>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <CardH title="Hours by discipline (YTD)" subtitle="2026 — total billable hours"/>
          <Bars h={150} barW={32} gap={10}
                values={[3400,1850,1600,1450,720,720,540,480]}
                labels={["Mech","Elec","Instr.","Struct","HSE","Civil","Proc","Comm"]}
                colors={["#2563EB","#F59E0B","#8B5CF6","#0EA5E9","#10B981","#65A30D","#EC4899","#475569"]}/>
        </div>
        <div className="card">
          <CardH title="Staff demand forecast" subtitle="Next 6 months (FTE equivalent)"/>
          <Bars h={150} barW={32} gap={10}
                values={[28,32,36,40,38,34]}
                labels={["Jun","Jul","Aug","Sep","Oct","Nov"]}
                colors={["#2563EB","#2563EB","#F59E0B","#EF4444","#F59E0B","#2563EB"]}/>
          <div className="muted tiny" style={{ marginTop: 10, lineHeight: 1.5 }}>
            Peak demand in Sep ’26 (40 FTE) driven by GFB-101 final submission + OWF-401 kickoff overlap. Consider proactive hiring or subcontractor framework.
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <div className="card">
          <CardH title="Project type mix" subtitle="By project count and revenue contribution"/>
          <div className="row" style={{ gap: 18, alignItems: "center" }}>
            <Donut size={140} thickness={20} segments={[
              { value: 3, color: "#2563EB" },
              { value: 2, color: "#10B981" },
              { value: 2, color: "#F59E0B" },
              { value: 1, color: "#8B5CF6" },
            ]} gap={3}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.025em" }}>8</div>
                <div className="muted xs">projects</div>
              </div>
            </Donut>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                { l: "FEED / Detailed", c: "#2563EB", v: 3, p: "$17.2M" },
                { l: "Concept",         c: "#10B981", v: 2, p: "$9.0M" },
                { l: "EPC support",     c: "#F59E0B", v: 2, p: "$8.6M" },
                { l: "Pre-FEED",        c: "#8B5CF6", v: 1, p: "$6.7M" },
              ].map(s => (
                <div key={s.l} style={{ background: "var(--surface-2)", borderRadius: 8, padding: 10 }}>
                  <div className="row" style={{ gap: 6, fontSize: 11, color: "var(--ink-4)" }}>
                    <span className="dot" style={{ background: s.c }}/>{s.l}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 2 }}>{s.v}</div>
                  <div className="muted tiny mono">{s.p}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <CardH title="Client concentration" subtitle="Revenue share by client"/>
          <div className="col" style={{ gap: 8 }}>
            {[
              { c: "QatarEnergy LNG",    v: 38, color: "#2563EB" },
              { c: "QatarEnergy",        v: 22, color: "#0EA5E9" },
              { c: "QatarEnergy Refining",v: 14, color: "#14B8A6" },
              { c: "Masdar",             v: 10, color: "#8B5CF6" },
              { c: "Kahramaa",           v:  8, color: "#10B981" },
              { c: "Other (3)",          v:  8, color: "#9CA3AF" },
            ].map(c => (
              <div key={c.c} className="row" style={{ gap: 10 }}>
                <span style={{ width: 140, fontSize: 12.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.c}</span>
                <div className="progress" style={{ flex: 1, height: 8 }}><span style={{ width: c.v + "%", background: c.color }}/></div>
                <span className="mono tiny" style={{ width: 30, textAlign:"right" }}>{c.v}%</span>
              </div>
            ))}
          </div>
          <hr className="divider" style={{ margin: "12px 0" }}/>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
            <span className="muted">Top 3 client concentration</span>
            <span className="mono" style={{ color: "var(--amber)" }}>74%</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
            <span className="muted">Repeat-business ratio</span>
            <span className="mono">{repeatClients}%</span>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="card">
          <CardH title="Risk profile" subtitle="Open risks by severity"/>
          <div className="row" style={{ gap: 18, alignItems: "center" }}>
            <Donut size={120} thickness={16} segments={[
              { value: 4, color: "var(--red)" },
              { value: 6, color: "var(--amber)" },
              { value: 3, color: "var(--green)" },
            ]} gap={3}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>13</div>
                <div className="muted xs">open</div>
              </div>
            </Donut>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { l: "High", v: 4, c: "var(--red)"   },
                { l: "Med",  v: 6, c: "var(--amber)" },
                { l: "Low",  v: 3, c: "var(--green)" },
              ].map(s => (
                <div key={s.l} className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
                  <div className="row" style={{ gap: 8 }}><span className="dot" style={{ background: s.c }}/>{s.l}</div>
                  <span className="mono">{s.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <CardH title="Change request impact" subtitle="Cumulative net effect on portfolio"/>
          <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.025em" }}>+$418K</div>
          <div className="muted tiny">across {DB.changes.length} change requests</div>
          <hr className="divider" style={{ margin: "12px 0" }}/>
          {[
            { l: "Cost growth",      v: "+0.9%", c: "var(--amber)" },
            { l: "Schedule slippage", v: "+12 d", c: "var(--amber)" },
            { l: "Hours added",      v: "1,540 h", c: "var(--ink-3)" },
          ].map(r => (
            <div key={r.l} className="row" style={{ justifyContent: "space-between", fontSize: 12, padding: "4px 0" }}>
              <span className="muted">{r.l}</span>
              <span className="mono" style={{ color: r.c }}>{r.v}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <CardH title="Approval throughput" subtitle="Cycle time, by week"/>
          <Bars h={100} barW={20} gap={6}
                values={[5.2,4.8,3.9,4.4,3.6,3.2,3.5,2.9]}
                labels={["W13","W14","W15","W16","W17","W18","W19","W20"]}
                colors={Array(8).fill("var(--accent)")}/>
          <div className="row" style={{ justifyContent: "space-between", marginTop: 8, fontSize: 12 }}>
            <span className="muted">8-week avg</span>
            <span className="mono">3.9 days</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
            <span className="muted">Target</span>
            <span className="mono" style={{ color: "var(--green)" }}>≤ 5.0 d ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
function ScreenNotifications() {
  const [tab, setTab] = React.useState("All");
  const list = DB.notifications.filter(n => tab === "All" ? true : tab === "Unread" ? !n.read : n.type === tab.toLowerCase());

  // Group by day
  function ymd(s) { return s.slice(0,10); }
  const grouped = {};
  list.forEach(n => {
    const day = ymd(n.created_at);
    grouped[day] = grouped[day] || [];
    grouped[day].push(n);
  });
  const days = Object.keys(grouped).sort().reverse();

  const today = "2026-05-19";
  const dayLabel = (d) => d === today ? "Today" : d === "2026-05-18" ? "Yesterday" : U.fmtDate(d, "medium");

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Insights"
        title="Notifications"
        subtitle="Approvals, deliverable updates, budget alerts, mentions."
        actions={<button className="btn"><Ico name="check" size={13}/>Mark all read</button>}
      />

      <Tabs active={tab} onChange={setTab} tabs={[
        { value: "All", label: "All", count: DB.notifications.length },
        { value: "Unread", label: "Unread", count: DB.notifications.filter(n => !n.read).length },
        { value: "Approval", label: "Approvals", count: DB.notifications.filter(n => n.type === "approval").length },
        { value: "Deliverable", label: "Deliverables", count: DB.notifications.filter(n => n.type === "deliverable").length },
        { value: "Budget", label: "Budget" },
        { value: "Risk", label: "Risks" },
        { value: "Mention", label: "Mentions" },
      ]}/>

      <div className="card flush">
        {days.map(day => (
          <div key={day}>
            <div style={{ padding: "12px 18px", background: "var(--surface-2)", borderBottom: "1px solid var(--line)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-4)", fontWeight: 500 }}>
              {dayLabel(day)} <span className="mono" style={{ float: "right" }}>{grouped[day].length}</span>
            </div>
            {grouped[day].map(n => (
              <div key={n.id} style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)", display: "flex", gap: 12, background: !n.read ? "var(--accent-soft-2)" : "transparent", cursor: "pointer" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: n.type === "approval" ? "var(--blue-soft)" :
                              n.type === "deliverable" ? "var(--violet-soft)" :
                              n.type === "budget" ? "var(--amber-soft)" :
                              n.type === "risk" ? "var(--red-soft)" :
                              "var(--surface-3)",
                  color:      n.type === "approval" ? "var(--blue)" :
                              n.type === "deliverable" ? "var(--violet)" :
                              n.type === "budget" ? "var(--amber)" :
                              n.type === "risk" ? "var(--red)" :
                              "var(--ink-3)",
                  display: "grid", placeItems: "center", flexShrink: 0,
                }}>
                  <Ico name={
                    n.type === "approval" ? "checkSquare" :
                    n.type === "deliverable" ? "layers" :
                    n.type === "budget" ? "dollar" :
                    n.type === "risk" ? "shield" :
                    n.type === "change" ? "git" :
                    n.type === "mention" ? "at" :
                    "bell"
                  } size={15}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500 }}>{n.title}</span>
                    <span className="badge outline" style={{ fontSize: 9.5 }}>{n.type}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 3 }}>{n.message}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="muted tiny mono">{n.created_at.slice(11,16)}</div>
                  {!n.read && <span style={{ display: "inline-block", width: 8, height: 8, background: "var(--accent)", borderRadius: "50%", marginTop: 6 }}/>}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
function ScreenSettings() {
  const [tab, setTab] = React.useState("users");
  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        subtitle="Workspace, users, permissions, templates and integrations."
      />
      <Tabs active={tab} onChange={setTab} tabs={[
        { value: "users",        label: "Users",       icon: "users" },
        { value: "permissions",  label: "Permissions", icon: "lock" },
        { value: "disciplines",  label: "Disciplines", icon: "layers" },
        { value: "templates",    label: "Templates",   icon: "fileText" },
        { value: "integrations", label: "Integrations",icon: "link" },
        { value: "email",        label: "Email",       icon: "mail" },
        { value: "branding",     label: "Branding",    icon: "settings" },
      ]}/>

      {tab === "users" && (
        <div className="card flush">
          <div className="table-head">
            <div className="table-head-l">
              <h3 className="card-title">Users</h3>
              <div className="muted tiny">{DB.users.length} accounts · synced from Microsoft Entra</div>
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button className="btn sm"><Ico name="upload" size={12}/>Sync now</button>
              <button className="btn primary sm"><Ico name="plus" size={12}/>Invite user</button>
            </div>
          </div>
          <table className="data">
            <thead><tr><th>User</th><th>Role</th><th>Discipline</th><th>Status</th><th>Last login</th><th>Source</th><th></th></tr></thead>
            <tbody>
              {DB.users.slice(0, 12).map(u => {
                const e = DB.employeeById(u.employee_id);
                return (
                  <tr key={u.user_id}>
                    <td>
                      <div className="row" style={{ gap: 10 }}>
                        <Avatar employee={e}/>
                        <div>
                          <div className="cell-strong">{e.full_name}</div>
                          <div className="cell-sub mono">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{e.job_title}</td>
                    <td><span className="badge outline" style={{ fontSize: 10 }}>{e.discipline}</span></td>
                    <td><Status value="Active"/></td>
                    <td className="cell-num">19 May 26 09:14</td>
                    <td><span className="badge neutral" style={{ fontSize: 10 }}>Entra ID</span></td>
                    <td><button className="btn xs ghost"><Ico name="more" size={14}/></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "permissions" && (
        <div className="card flush" style={{ overflowX: "auto" }}>
          <div className="table-head">
            <h3 className="card-title">Permission matrix</h3>
          </div>
          <PermissionMatrix/>
        </div>
      )}

      {tab === "disciplines" && (
        <div className="card flush">
          <div className="table-head">
            <h3 className="card-title">Disciplines</h3>
            <button className="btn primary sm"><Ico name="plus" size={12}/>Add discipline</button>
          </div>
          <table className="data">
            <thead><tr><th>Name</th><th>Default rate</th><th>Lead</th><th>Engineers</th><th>Colour</th></tr></thead>
            <tbody>
              {DB.disciplineNames.map(name => {
                const team = DB.employees.filter(e => e.discipline === name);
                const lead = team.find(e => e.seniority_level === "Lead" || e.seniority_level === "Principal") || team[0];
                const c = U.disciplineColors[name];
                return (
                  <tr key={name}>
                    <td>
                      <div className="row" style={{ gap: 8 }}>
                        <span style={{ width: 8, height: 8, background: c, borderRadius: 2 }}/>
                        <span className="cell-strong">{name}</span>
                      </div>
                    </td>
                    <td className="cell-num">${Math.round(team.reduce((s,e)=>s+e.hourly_rate,0)/Math.max(1,team.length))}/h avg</td>
                    <td>{lead ? <div className="row" style={{gap:6}}><Avatar employee={lead} size="sm"/><span className="tiny">{lead.full_name}</span></div> : <span className="muted tiny">—</span>}</td>
                    <td className="cell-num">{team.length}</td>
                    <td><span className="mono tiny">{c}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "templates" && (
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { n: "FEED template",          d: "10 disciplines · 65 deliverables · 14 milestones" },
            { n: "Bridging study",         d: "7 disciplines · 32 deliverables · 8 milestones" },
            { n: "Detailed design",        d: "12 disciplines · 110 deliverables · 22 milestones" },
            { n: "EPC support",            d: "8 disciplines · 48 deliverables · 16 milestones" },
            { n: "Concept design",         d: "6 disciplines · 22 deliverables · 7 milestones" },
            { n: "Pre-FEED",               d: "8 disciplines · 28 deliverables · 9 milestones" },
          ].map(t => (
            <div key={t.n} className="card">
              <div className="row" style={{ gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--accent-soft-2)", color: "var(--accent)", display: "grid", placeItems: "center" }}><Ico name="fileText" size={16}/></div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{t.n}</div>
                  <div className="muted tiny" style={{ marginTop: 2 }}>{t.d}</div>
                </div>
              </div>
              <hr className="divider" style={{ margin: "12px 0" }}/>
              <div className="row" style={{ gap: 6 }}>
                <button className="btn sm" style={{ flex: 1, justifyContent: "center" }}><Ico name="edit" size={12}/>Edit</button>
                <button className="btn sm"><Ico name="copy" size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "integrations" && (
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            { n: "Microsoft 365", d: "SSO, Teams, Outlook, SharePoint",     c: "var(--blue)",   s: "Connected" },
            { n: "Power BI",      d: "Dashboard embeds & data refresh",      c: "var(--amber)",  s: "Connected" },
            { n: "SAP",           d: "PO, vendor & invoice integration",     c: "var(--indigo)", s: "Connected" },
            { n: "SharePoint",    d: "Document storage & sync",              c: "var(--green)",  s: "Connected" },
            { n: "Primavera P6",  d: "Schedule import & sync",               c: "var(--violet)", s: "Available" },
            { n: "Slack",         d: "Notifications & alerts",               c: "var(--pink)",   s: "Available" },
          ].map(i => (
            <div key={i.n} className="card">
              <div className="row" style={{ gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: i.c + "22", color: i.c, display: "grid", placeItems: "center", fontWeight: 600 }}>
                  {i.n[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{i.n}</div>
                  <div className="muted tiny" style={{ marginTop: 2 }}>{i.d}</div>
                </div>
                <span className={"badge " + (i.s === "Connected" ? "success" : "neutral")} style={{ fontSize: 10 }}>{i.s}</span>
              </div>
              <hr className="divider" style={{ margin: "12px 0" }}/>
              <button className="btn sm" style={{ width: "100%", justifyContent: "center" }}>
                {i.s === "Connected" ? "Manage" : "Connect"}
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "email" && (
        <div className="card" style={{ maxWidth: 720 }}>
          <CardH title="Email settings" subtitle="Configure outbound notifications and distribution lists"/>
          <div className="col" style={{ gap: 14 }}>
            <div className="field">
              <label>From address</label>
              <input defaultValue="notifications@atlas.helix.eng"/>
            </div>
            <div className="field">
              <label>Default email signature</label>
              <textarea rows={3} defaultValue="— Atlas EPM · Helix Engineering · This is an automated message."/>
            </div>
            <div className="field">
              <label>Daily digest time</label>
              <input type="time" defaultValue="08:00"/>
            </div>
            <div>
              <h4 className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Notification preferences</h4>
              {[
                "Approval requests",
                "Deliverable status changes",
                "Risk severity changes",
                "Budget threshold alerts",
                "Mentions in comments",
              ].map(p => (
                <label key={p} className="row" style={{ padding: "8px 0", gap: 10, borderBottom: "1px solid var(--line)" }}>
                  <input type="checkbox" defaultChecked/>
                  <span style={{ fontSize: 13 }}>{p}</span>
                </label>
              ))}
            </div>
            <div className="row" style={{ gap: 8, marginTop: 8 }}>
              <button className="btn">Cancel</button>
              <button className="btn primary">Save changes</button>
            </div>
          </div>
        </div>
      )}

      {tab === "branding" && (
        <div className="grid" style={{ gridTemplateColumns: "1fr 320px" }}>
          <div className="card">
            <CardH title="Branding"/>
            <div className="col" style={{ gap: 14 }}>
              <div className="field">
                <label>Workspace name</label>
                <input defaultValue="Helix Engineering"/>
              </div>
              <div className="field">
                <label>Logo</label>
                <div className="row" style={{ gap: 12, padding: 14, border: "1px dashed var(--line-2)", borderRadius: 10 }}>
                  <div className="brand-mark" style={{ width: 48, height: 48, fontSize: 22 }}>A</div>
                  <div>
                    <div style={{ fontSize: 13 }}>Atlas mark</div>
                    <div className="muted tiny">PNG or SVG, max 2 MB</div>
                  </div>
                  <button className="btn sm" style={{ marginLeft: "auto" }}>Upload</button>
                </div>
              </div>
              <div className="field">
                <label>Brand colour</label>
                <div className="row" style={{ gap: 8 }}>
                  {["#2563EB","#0EA5E9","#10B981","#8B5CF6","#F59E0B","#EF4444"].map(c => (
                    <div key={c} style={{ width: 28, height: 28, background: c, borderRadius: 6, cursor: "pointer", border: c === "#2563EB" ? "2px solid var(--ink)" : null }}/>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>Default time zone</label>
                <select defaultValue="Asia/Qatar"><option>Asia/Qatar</option><option>Asia/Dubai</option><option>Europe/Copenhagen</option><option>Europe/London</option></select>
              </div>
              <div className="field">
                <label>Default currency</label>
                <select defaultValue="USD"><option>USD</option><option>EUR</option><option>QAR</option><option>DKK</option><option>GBP</option></select>
              </div>
            </div>
          </div>
          <div className="card muted">
            <CardH title="Preview"/>
            <div style={{ background: "var(--navy)", padding: 16, borderRadius: 10, color: "#fff" }}>
              <div className="row" style={{ gap: 10 }}>
                <div className="brand-mark">A</div>
                <div>
                  <div style={{ fontWeight: 500 }}>Atlas</div>
                  <div className="muted xs" style={{ color: "rgba(255,255,255,0.4)" }}>EPM · v0.4</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Permission matrix component
// ============================================
function PermissionMatrix() {
  const modules = ["Dashboard","Projects","Resources","Disciplines","Deliverables","Costs","Approvals","Reports","Risks","Changes","Documents","Analytics","Admin","Settings"];
  const roles   = ["Admin","Exec","PM","Lead","Engineer","Planner","Comm.","Client","DocCtrl","QA"];
  // Permission levels: full (✓), view (V), limited (L), approval (A), none (—)
  const matrix = {
    "Dashboard":   ["✓","✓","✓","✓","V","✓","✓","V","V","V"],
    "Projects":    ["✓","V","✓","L","V","L","L","V","—","V"],
    "Resources":   ["✓","V","✓","L","V","✓","—","—","—","—"],
    "Disciplines": ["✓","V","✓","✓","L","V","—","—","—","V"],
    "Deliverables":["✓","V","✓","✓","L","—","—","V","✓","✓"],
    "Costs":       ["✓","✓","✓","V","—","V","✓","—","—","—"],
    "Approvals":   ["✓","V","A","A","—","—","A","—","—","A"],
    "Reports":     ["✓","✓","✓","V","V","✓","✓","V","—","V"],
    "Risks":       ["✓","✓","✓","✓","L","—","—","—","—","✓"],
    "Changes":     ["✓","V","✓","A","L","—","A","—","—","✓"],
    "Documents":   ["✓","V","✓","✓","L","—","—","V","✓","✓"],
    "Analytics":   ["✓","✓","✓","V","—","✓","✓","—","—","—"],
    "Admin":       ["✓","—","—","—","—","—","—","—","—","—"],
    "Settings":    ["✓","—","—","—","—","—","—","—","—","—"],
  };
  function symbolToBadge(s) {
    if (s === "✓") return <span className="badge success" style={{ fontSize: 10 }}>Full</span>;
    if (s === "V") return <span className="badge info" style={{ fontSize: 10 }}>View</span>;
    if (s === "L") return <span className="badge warn" style={{ fontSize: 10 }}>Limited</span>;
    if (s === "A") return <span className="badge violet" style={{ fontSize: 10 }}>Approve</span>;
    return <span className="muted xs">—</span>;
  }
  return (
    <table className="data">
      <thead>
        <tr>
          <th style={{ position: "sticky", left: 0, background: "var(--surface-2)", zIndex: 1 }}>Module</th>
          {roles.map(r => <th key={r}>{r}</th>)}
        </tr>
      </thead>
      <tbody>
        {modules.map(m => (
          <tr key={m}>
            <td style={{ position: "sticky", left: 0, background: "var(--surface)", fontWeight: 500 }}>{m}</td>
            {matrix[m].map((p, i) => <td key={i}>{symbolToBadge(p)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Object.assign(window, { ScreenReports, ScreenAnalytics, ScreenNotifications, ScreenSettings, PermissionMatrix });
