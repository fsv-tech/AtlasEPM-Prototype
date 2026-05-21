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
  const ak = DB.analyticsKPIs();
  const billable = ak.billableHours;
  const billableTarget = ak.plannedHours;
  const revenue = ak.revenue;
  const avgRate = ak.avgRate;
  const onTimeRate = ak.onTimePct;
  const avgVariance = ak.avgVariancePct.toFixed(1);
  // Last 9 months for trend
  const monthlyBurn = DB.monthlyBurn(9);
  const months = monthlyBurn.map(m => m.label);

  // Discipline utilization trend — derive 9-month series from current util with smooth ramp-up
  const discUtilNow = DB.disciplineUtilization();
  const topDisciplines = discUtilNow
    .filter(d => ["Mechanical","Electrical","Instrumentation","HSE"].includes(d.name))
    .map(d => {
      // synthetic ramp from 60-80% of current up to current — represents trend
      const cur = d.util;
      const series = [];
      for (let i = 0; i < 9; i++) {
        series.push(Math.max(0, Math.round(cur * (0.65 + 0.35 * i / 8))));
      }
      return { name: d.name, color: U.disciplineColors[d.name], data: series };
    });

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
        <KPI featured label="Billable hours YTD" icon="clock" value={(billable/1000).toFixed(1)} unit="K h" foot={Math.round(billable/billableTarget*100) + "% of plan"}/>
        <KPI label="Revenue earned YTD" icon="dollar" value={"$" + (revenue/1e6).toFixed(2)} unit="M" foot="Σ budget × progress"/>
        <KPI label="Avg billable rate" icon="trendUp" value={"$" + avgRate} unit="/h" foot="across all engineers"/>
        <KPI label="Active projects" icon="folder" value={DB.projects.filter(p => p.status === "Active").length} foot={DB.projects.length + " total in portfolio"}/>
        <KPI label="On-time delivery" icon="checkCircle" value={onTimeRate + "%"} foot={DB.deliverables.filter(d=>d.actual_date).length + " delivered"} deltaDir={onTimeRate >= 90 ? "up" : "down"}/>
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
          {(() => {
            const insights = [];
            // 1. Resource bottleneck — highest utilization discipline
            const topUtil = DB.disciplineUtilization().sort((a,b)=>b.util-a.util)[0];
            if (topUtil && topUtil.util > 70) {
              insights.push({
                i: "alertTri", color: "#FCA5A5",
                k: "Resource bottleneck",
                t: `${topUtil.name} at ${topUtil.util}% utilization across ${topUtil.count} engineer${topUtil.count!==1?"s":""}. Consider adding capacity or rebalancing assignments.`,
              });
            }
            // 2. Worst-variance project
            const worstProj = ak.worst;
            if (worstProj && worstProj.variancePct > 0) {
              insights.push({
                i: "trendUp", color: "#FCD34D",
                k: "Forecast variance",
                t: `${worstProj.project.project_code} forecast ${worstProj.variancePct.toFixed(1)}% over budget. Driver: ${worstProj.project.health === "red" ? "scope creep and resource overrun" : "schedule slippage"}.`,
              });
            }
            // 3. Risk concentration
            const rs = DB.riskSummary();
            if (rs.rising > 0) {
              insights.push({
                i: "alertCirc", color: "#A5B4FC",
                k: "Rising risks",
                t: `${rs.rising} risks trending up across the portfolio${rs.high > 0 ? ` — ${rs.high} now classified High severity` : ""}. Suggest risk review session.`,
              });
            }
            return insights.slice(0,3).map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", padding: 14, borderRadius: 10 }}>
                <div className="row" style={{ gap: 8, marginBottom: 6 }}>
                  <Ico name={s.i} size={14} color={s.color}/>
                  <span style={{ fontWeight: 500, fontSize: 12.5 }}>{s.k}</span>
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>{s.t}</div>
                <button className="btn xs" style={{ marginTop: 10, background: "rgba(255,255,255,0.12)", color: "#fff", border: "none" }}>Investigate</button>
              </div>
            ));
          })()}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <CardH title="Resource utilization trend" subtitle="By discipline, last 9 months"/>
          <LineChart h={220} months={months} yMax={100}
            series={topDisciplines.map(d => ({ color: d.color, data: d.data, dotR: 3 }))}/>
          <div className="row" style={{ justifyContent: "center", gap: 18, marginTop: 10, fontSize: 11, flexWrap: "wrap" }}>
            {topDisciplines.map(d => (
              <div key={d.name} className="row" style={{ gap: 6 }}><span className="dot" style={{ background: d.color }}/>{d.name}</div>
            ))}
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
            <span className="mono" style={{ color: Number(avgVariance) > 2 ? "var(--red)" : Number(avgVariance) > 0 ? "var(--amber)" : "var(--green)" }}>{Number(avgVariance) >= 0 ? "+" : ""}{avgVariance}%</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
            <span className="muted">Best performer</span>
            <span className="mono">{ak.best.project.project_code} ({ak.best.variancePct.toFixed(1)}%)</span>
          </div>
          <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
            <span className="muted">Worst performer</span>
            <span className="mono" style={{ color: "var(--red)" }}>{ak.worst.project.project_code} ({ak.worst.variancePct >= 0 ? "+" : ""}{ak.worst.variancePct.toFixed(1)}%)</span>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card">
          <CardH title="Hours by discipline (YTD)" subtitle="Actual hours consumed across all projects"/>
          {(() => {
            const discOrder = ["Mechanical","Electrical","Instrumentation","Structural","PM","HSE","Civil","Procurement","Process","Commercial"];
            const discColors = ["#2563EB","#F59E0B","#8B5CF6","#0EA5E9","#6366F1","#10B981","#65A30D","#EC4899","#14B8A6","#475569"];
            const discHours = discOrder.map(name =>
              DB.disciplines.filter(d => d.name === name).reduce((s,d) => s + d.actual_hours, 0)
            ).filter((_,i) => discOrder[i]); // keep all
            const filtered = discOrder.map((name, i) => ({ name, hours: discHours[i], color: discColors[i] })).filter(d => d.hours > 0).sort((a,b)=>b.hours-a.hours);
            return <Bars h={150} barW={32} gap={10}
              values={filtered.map(d=>d.hours)}
              labels={filtered.map(d=>d.name.slice(0,5))}
              colors={filtered.map(d=>d.color)}/>;
          })()}
        </div>
        <div className="card">
          <CardH title="Staff demand forecast" subtitle="Next 6 months · derived from assignments"/>
          {(() => {
            // For each of next 6 months, count distinct employees assigned in that month
            const monthsAhead = [];
            for (let i = 0; i < 6; i++) {
              const d = new Date(Date.UTC(DB.TODAY.getUTCFullYear(), DB.TODAY.getUTCMonth() + i + 1, 1));
              const dEnd = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0));
              const empSet = new Set();
              let totalAlloc = 0;
              DB.assignments.forEach(a => {
                const s = new Date(a.start_date);
                const e = new Date(a.end_date);
                if (s <= dEnd && e >= d) {
                  empSet.add(a.employee_id);
                  totalAlloc += a.allocation_pct;
                }
              });
              monthsAhead.push({
                label: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getUTCMonth()],
                fte: Math.round(totalAlloc / 100),
                count: empSet.size,
              });
            }
            const peak = monthsAhead.reduce((a,b)=>b.fte>a.fte?b:a, monthsAhead[0]);
            return <>
              <Bars h={150} barW={32} gap={10}
                values={monthsAhead.map(m => m.fte)}
                labels={monthsAhead.map(m => m.label)}
                colors={monthsAhead.map(m => m.fte === peak.fte ? "var(--red)" : m.fte > peak.fte * 0.85 ? "var(--amber)" : "var(--accent)")}/>
              <div className="muted tiny" style={{ marginTop: 10, lineHeight: 1.5 }}>
                Peak demand in {peak.label} ({peak.fte} FTE-equivalent) across {peak.count} engineers. Source: current assignment allocations.
              </div>
            </>;
          })()}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.2fr 1fr" }}>
        <div className="card">
          <CardH title="Project type mix" subtitle="By project count and budget contribution"/>
          {(() => {
            const mix = DB.projectTypeMix();
            const typeColors = { "FEED Study": "#2563EB", "Detailed Design": "#0EA5E9", "EPC Support": "#F59E0B", "Concept Design": "#10B981", "Pre-FEED": "#8B5CF6", "Bridging Study": "#EC4899" };
            return (
          <div className="row" style={{ gap: 18, alignItems: "center" }}>
            <Donut size={140} thickness={20} segments={mix.map(m => ({ value: m.count, color: typeColors[m.type] || "#94A3B8" }))} gap={3}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.025em" }}>{DB.projects.length}</div>
                <div className="muted xs">projects</div>
              </div>
            </Donut>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {mix.map(s => (
                <div key={s.type} style={{ background: "var(--surface-2)", borderRadius: 8, padding: 10 }}>
                  <div className="row" style={{ gap: 6, fontSize: 11, color: "var(--ink-4)" }}>
                    <span className="dot" style={{ background: typeColors[s.type] || "#94A3B8" }}/>{s.type}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 2 }}>{s.count}</div>
                  <div className="muted tiny mono">${(s.budget/1e6).toFixed(1)}M</div>
                </div>
              ))}
            </div>
          </div>
            );
          })()}
        </div>

        <div className="card">
          <CardH title="Client concentration" subtitle="Revenue share earned by client"/>
          {(() => {
            const cc = DB.clientConcentration();
            const clientColors = ["#2563EB","#0EA5E9","#14B8A6","#8B5CF6","#10B981","#F59E0B","#EC4899","#9CA3AF"];
            const top3pct = cc.list.slice(0,3).reduce((s,c)=>s+c.pct, 0);
            return <>
              <div className="col" style={{ gap: 8 }}>
                {cc.list.map((c, i) => (
                  <div key={c.client} className="row" style={{ gap: 10 }}>
                    <span style={{ width: 140, fontSize: 12.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.client}</span>
                    <div className="progress" style={{ flex: 1, height: 8 }}><span style={{ width: c.pct + "%", background: clientColors[i] || "#9CA3AF" }}/></div>
                    <span className="mono tiny" style={{ width: 30, textAlign:"right" }}>{c.pct}%</span>
                  </div>
                ))}
              </div>
              <hr className="divider" style={{ margin: "12px 0" }}/>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
                <span className="muted">Top 3 client concentration</span>
                <span className="mono" style={{ color: top3pct > 70 ? "var(--amber)" : "var(--ink-3)" }}>{top3pct}%</span>
              </div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
                <span className="muted">Total clients</span>
                <span className="mono">{cc.list.length}</span>
              </div>
            </>;
          })()}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
        <div className="card">
          <CardH title="Risk profile" subtitle="By severity"/>
          {(() => {
            const rs = DB.riskSummary();
            const openRisks = DB.risks.filter(r => r.status === "Open");
            const highCount = openRisks.filter(r => r.severity === "High").length;
            const medCount  = openRisks.filter(r => r.severity === "Medium").length;
            const lowCount  = openRisks.filter(r => r.severity === "Low").length;
            return (
          <div className="row" style={{ gap: 18, alignItems: "center" }}>
            <Donut size={120} thickness={16} segments={[
              { value: highCount, color: "var(--red)" },
              { value: medCount,  color: "var(--amber)" },
              { value: lowCount,  color: "var(--green)" },
            ]} gap={3}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>{openRisks.length}</div>
                <div className="muted xs">open</div>
              </div>
            </Donut>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { l: "High", v: highCount, c: "var(--red)"   },
                { l: "Med",  v: medCount,  c: "var(--amber)" },
                { l: "Low",  v: lowCount,  c: "var(--green)" },
              ].map(s => (
                <div key={s.l} className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
                  <div className="row" style={{ gap: 8 }}><span className="dot" style={{ background: s.c }}/>{s.l}</div>
                  <span className="mono">{s.v}</span>
                </div>
              ))}
              <hr className="divider" style={{ margin: "4px 0" }}/>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 11 }}>
                <span className="muted">Mitigated</span>
                <span className="mono muted">{rs.mitigated}</span>
              </div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 11 }}>
                <span className="muted">Closed</span>
                <span className="mono muted">{rs.closed}</span>
              </div>
            </div>
          </div>
            );
          })()}
        </div>

        <div className="card">
          <CardH title="Change request impact" subtitle="Cumulative net effect on portfolio"/>
          {(() => {
            const activeChanges = DB.changes.filter(c => c.status !== "Rejected");
            const netCost = activeChanges.reduce((s, c) => s + c.cost_impact, 0);
            const netHours = DB.changes.reduce((s, c) => s + c.hours_impact, 0);
            const netDays = activeChanges.reduce((s, c) => s + c.schedule_impact_days, 0);
            const netCostStr = (netCost >= 0 ? "+" : "") + "$" + Math.abs(Math.round(netCost/1000)) + "K";
            return (
          <>
            <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.025em" }}>{netCostStr}</div>
            <div className="muted tiny">across {DB.changes.length} change requests</div>
            <hr className="divider" style={{ margin: "12px 0" }}/>
            {[
              { l: "Cost growth",       v: (netCost/activeChanges.reduce((s,c)=>s+Math.abs(c.cost_impact||0),1)*100).toFixed(1) + "%", c: netCost > 0 ? "var(--amber)" : "var(--green)" },
              { l: "Schedule impact",   v: (netDays >= 0 ? "+" : "") + netDays + " d",   c: netDays > 0 ? "var(--amber)" : "var(--green)" },
              { l: "Hours added",       v: (netHours >= 0 ? "+" : "") + netHours.toLocaleString() + " h", c: "var(--ink-3)" },
            ].map(r => (
              <div key={r.l} className="row" style={{ justifyContent: "space-between", fontSize: 12, padding: "4px 0" }}>
                <span className="muted">{r.l}</span>
                <span className="mono" style={{ color: r.c }}>{r.v}</span>
              </div>
            ))}
          </>
            );
          })()}
        </div>

        <div className="card">
          <CardH title="Approval throughput" subtitle="Average cycle time"/>
          {(() => {
            const apr = DB.approvalSummary();
            const avg = apr.avgCycleDays;
            // Per-week breakdown: approved items grouped by approved_date week
            const byWeek = {};
            DB.approvals.filter(a => a.approved_date).forEach(a => {
              const wk = U.isoWeek(new Date(a.approved_date));
              const cycle = (new Date(a.approved_date) - new Date(a.raised)) / 86400000;
              if (!byWeek[wk]) byWeek[wk] = { sum: 0, count: 0 };
              byWeek[wk].sum += cycle;
              byWeek[wk].count += 1;
            });
            const weeks = Object.keys(byWeek).sort((a,b)=>Number(a)-Number(b));
            const values = weeks.map(w => Math.round(byWeek[w].sum / byWeek[w].count * 10) / 10);
            const labels = weeks.map(w => "W" + w);
            return <>
              {values.length > 0 ? (
                <Bars h={100} barW={28} gap={8}
                  values={values}
                  labels={labels}
                  colors={values.map(v => v > 5 ? "var(--red)" : v > 3 ? "var(--amber)" : "var(--accent)")}/>
              ) : (
                <div className="muted tiny" style={{ padding: "20px 0", textAlign: "center" }}>No completed approvals yet.</div>
              )}
              <div className="row" style={{ justifyContent: "space-between", marginTop: 8, fontSize: 12 }}>
                <span className="muted">Average</span>
                <span className="mono">{avg ? avg.toFixed(1) + " days" : "—"}</span>
              </div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
                <span className="muted">Pending now</span>
                <span className="mono" style={{ color: apr.pending > 5 ? "var(--amber)" : "var(--ink-3)" }}>{apr.pending}</span>
              </div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 12, marginTop: 4 }}>
                <span className="muted">SLA (≤ 5d)</span>
                <span className="mono" style={{ color: (avg && avg <= 5) ? "var(--green)" : "var(--red)" }}>{(avg && avg <= 5) ? "On target" : "Behind"}</span>
              </div>
            </>;
          })()}
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
                    <td className="cell-num">{U.fmtDate(u.last_login)} {u.last_login.slice(11,16)}</td>
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
