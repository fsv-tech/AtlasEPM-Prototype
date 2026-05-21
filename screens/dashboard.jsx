// ============================================
// Atlas — Screen 2: Executive Dashboard
// ============================================

function ScreenDashboard({ role }) {
  const kpi = DB.portfolioKPIs();

  // Helpful aggregations
  const active = DB.projects.filter(p => p.status === "Active" || p.status === "Planning");
  const statusCount = DB.projects.reduce((acc, p) => { acc[p.status] = (acc[p.status]||0)+1; return acc; }, {});
  const healthCount = DB.projects.reduce((acc, p) => { acc[p.health] = (acc[p.health]||0)+1; return acc; }, {});

  // Derived from DB.assignments via helper
  const disciplineUtil = DB.disciplineUtilization()
    .filter(d => ["PM","Process","Mechanical","Electrical","Instrumentation","Structural","HSE","Civil","Procurement","Commercial"].includes(d.name))
    .map(d => ({ ...d, color: U.disciplineColors[d.name] }));

  // Weekly portfolio burn — derived from costs and project timelines
  const burnSeries = DB.weeklyBurn(12);
  const burn = burnSeries.map(b => b.value);
  const burnLabels = burnSeries.map(b => b.label);
  const burnCurrent = burn[burn.length - 1];
  const burnPrev    = burn[burn.length - 2] || 1;
  const wowPct = ((burnCurrent / burnPrev - 1) * 100).toFixed(1);

  return (
    <div className="content">
      <PageHeader
        eyebrow="Workspace · Executive view"
        title="Portfolio dashboard"
        subtitle={`Atlas EPM at a glance — ${active.length} active projects, ${DB.employees.length} engineers planned, $${(kpi.budgetTotal/1e6).toFixed(1)}M under management.`}
        actions={
          <>
            <button className="btn"><Ico name="calendar" size={13}/>Last 30 days</button>
            <button className="btn"><Ico name="download" size={13}/>Export</button>
            <a className="btn primary" href="#/projects/new"><Ico name="plus" size={13}/>New project</a>
          </>
        }
      />

      {/* KPI strip */}
      <div className="kpi-grid" data-tour-id="kpi-grid">
        <KPI data-tour-id="kpi-active" featured label="Active projects" icon="folder" value={kpi.activeProjects} unit={"/ " + kpi.totalProjects} foot={kpi.closingThisMonth + " closing this month"} helpKey="projects"/>
        <KPI data-tour-id="kpi-budget" label="Budget under mgmt" icon="dollar" value={"$" + (kpi.budgetTotal/1e6).toFixed(1)} unit="M" foot={"$" + (kpi.spentTotal/1e6).toFixed(1) + "M spent · " + Math.round(kpi.spentTotal/kpi.budgetTotal*100) + "%"} helpKey="cost"/>
        <KPI data-tour-id="kpi-engineers" label="Engineers" icon="users" value={kpi.resources} delta={kpi.utilization + "% avg utilization"} deltaDir="up" helpKey="employees"/>
        <KPI data-tour-id="kpi-risks" label="Open risks" icon="shield" value={kpi.openRisks} foot={DB.riskSummary().rising + " trending up"} deltaDir="down" helpKey="risks"/>
        <KPI data-tour-id="kpi-util" label="Utilization" icon="activity" value={kpi.utilization + "%"} foot="vs 80% target" deltaDir={kpi.utilization >= 80 ? "up" : "down"} helpKey="calendar"/>
      </div>

      {/* Project status + Resource utilization + Weekly burn */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1.4fr 1.1fr" }}>
        {/* Status mix */}
        <div className="card" data-tour-id="status-mix">
          <CardH title="Project status" subtitle="Across portfolio"/>
          <div className="row" style={{ gap: 18, alignItems: "center" }}>
            <Donut size={130} thickness={18} segments={[
              { value: statusCount["Active"]   || 0, color: "var(--blue)" },
              { value: statusCount["Planning"] || 0, color: "var(--violet)" },
              { value: statusCount["Closeout"] || 0, color: "var(--green)" },
              { value: statusCount["On Hold"]  || 0, color: "var(--amber)" },
            ]} gap={3}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1 }}>{DB.projects.length}</div>
                <div className="muted xs" style={{ marginTop: 2 }}>total</div>
              </div>
            </Donut>
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
              {[
                { l: "Active",   k: "Active",   c: "var(--blue)" },
                { l: "Planning", k: "Planning", c: "var(--violet)" },
                { l: "Closeout", k: "Closeout", c: "var(--green)" },
                { l: "On Hold",  k: "On Hold",  c: "var(--amber)" },
              ].map(s => (
                <div key={s.l} style={{ background: "var(--surface-2)", borderRadius: 8, padding: "8px 10px" }}>
                  <div className="row" style={{ gap: 6, fontSize: 11, color: "var(--ink-4)" }}>
                    <span className="dot" style={{ background: s.c }}/>{s.l}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 2 }}>{statusCount[s.k] || 0}</div>
                </div>
              ))}
            </div>
          </div>

          <hr className="divider" style={{ margin: "16px 0 10px" }}/>
          <h4 className="muted xs" style={{ letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Health flags</h4>
          <div className="row" style={{ gap: 6 }}>
            {[
              { l: "Green", k: "green", c: "var(--green)" },
              { l: "Amber", k: "amber", c: "var(--amber)" },
              { l: "Red",   k: "red",   c: "var(--red)" },
            ].map(h => (
              <div key={h.k} style={{ flex: 1, padding: "8px 10px", background: "var(--surface-2)", borderRadius: 8, borderLeft: `3px solid ${h.c}` }}>
                <div className="muted xs" style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>{h.l}</div>
                <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", marginTop: 2 }}>{healthCount[h.k] || 0}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource utilization */}
        <div className="card" data-tour-id="resource-util">
          <CardH title="Resource utilization" subtitle="By discipline · this week" action="See planner" onAction={() => navTo("calendar")}/>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {disciplineUtil.map(d => (
              <div key={d.name} className="row" style={{ gap: 10 }}>
                <div className="row" style={{ width: 130, gap: 8 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 2, background: d.color, flexShrink: 0 }}/>
                  <span style={{ fontSize: 12.5 }}>{d.name}</span>
                </div>
                <div className="progress" style={{ flex: 1, height: 8 }}>
                  <span style={{ width: d.util + "%", background: d.util > 85 ? "linear-gradient(90deg, #F87171 0%, #EF4444 100%)" : d.util > 70 ? d.color : d.color, opacity: d.util > 85 ? 1 : 0.85 }}/>
                </div>
                <span className="mono tiny" style={{ width: 36, textAlign: "right", fontWeight: 500, color: d.util > 85 ? "var(--red)" : d.util > 70 ? "var(--ink-2)" : "var(--ink-4)" }}>{d.util}%</span>
              </div>
            ))}
          </div>
          {(() => {
            const overloaded = disciplineUtil.filter(d => d.util > 85);
            if (overloaded.length === 0) return null;
            const top = overloaded.sort((a,b) => b.util - a.util)[0];
            return (
          <div style={{ marginTop: 14, padding: "10px 12px", background: "var(--red-soft)", borderRadius: 8, fontSize: 12, color: "#9A1F1F", display: "flex", gap: 10, alignItems: "flex-start", borderLeft: "3px solid var(--red)" }}>
            <Ico name="alertTri" size={14} color="var(--red)"/>
            <div style={{ flex: 1, lineHeight: 1.5 }}><b style={{ fontWeight: 600 }}>{top.name} at {top.util}%</b> — overloaded. Consider reassignment from <a style={{color:"#9A1F1F", textDecoration:"underline", fontWeight: 500}} href="#/calendar">resource calendar</a>.</div>
          </div>
            );
          })()}
        </div>

        {/* Weekly burn */}
        <div className="card" data-tour-id="burn-rate">
          <CardH title="Weekly burn rate" subtitle="K USD · portfolio · last 12 weeks" action="Cost detail" onAction={() => navTo("cost")}/>
          <div style={{ display:"flex", alignItems:"baseline", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display:"flex", alignItems:"baseline", gap: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.028em" }}>${burnCurrent}K</span>
              <span className="muted tiny">this week</span>
            </div>
            <span className={"badge " + (Number(wowPct) >= 0 ? "red" : "success")} style={{ fontSize: 10 }}>
              <Ico name={Number(wowPct) >= 0 ? "arrUp" : "arrDown"} size={10}/>{Number(wowPct) >= 0 ? "+" : ""}{wowPct}% wow
            </span>
          </div>
          <Bars values={burn} labels={burnLabels} w={340} h={110} barW={16} gap={6} highlight={burn.length - 1}
            colors={burn.map((_,i)=> i === burn.length - 1 ? "var(--accent)" : i >= burn.length - 4 ? "var(--ink-6)" : "#E5E7EB")}/>
        </div>
      </div>

      {/* Top projects + Recent activity */}
      <div className="grid" style={{ gridTemplateColumns: "1.6fr 1fr" }}>
        <div className="card flush" data-tour-id="top-projects">
          <div className="table-head">
            <div className="table-head-l">
              <h3 className="card-title">Top projects by value</h3>
              <div className="muted tiny">Click to drill into project workspace</div>
            </div>
            <div className="table-head-r">
              <a className="btn sm" href="#/projects">All projects <Ico name="arrRight" size={11}/></a>
            </div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th>Project</th><th>Client</th><th>PM</th>
                <th>Progress</th><th className="num">Budget</th><th className="num">Spent</th>
                <th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {[...DB.projects].sort((a,b)=>b.budget-a.budget).slice(0,6).map(p => {
                const c = DB.costs.find(c => c.project_id === p.project_id);
                const pm = DB.employeeById(p.pm_id);
                return (
                  <tr key={p.project_id} onClick={() => navTo("projects/" + p.project_id)}>
                    <td>
                      <div className="row" style={{ gap: 10 }}>
                        <span style={{ width: 4, height: 30, background: U.disciplineColors[p.project_type] || "var(--accent)", borderRadius: 2 }}/>
                        <div>
                          <div className="cell-strong">{p.project_name}</div>
                          <div className="cell-sub mono">{p.project_code} · {p.project_type}</div>
                        </div>
                      </div>
                    </td>
                    <td><span style={{ fontSize: 12.5 }}>{p.client}</span><div className="cell-sub">{p.country}</div></td>
                    <td><Avatar employee={pm} size="sm"/></td>
                    <td style={{ width: 180 }}><ProgressWithLabel value={p.progress}/></td>
                    <td className="num cell-num">${(p.budget/1e6).toFixed(2)}M</td>
                    <td className="num cell-num">${(c.spent/1e6).toFixed(2)}M</td>
                    <td><Status value={p.status}/></td>
                    <td><Ico name="chevRight" size={14} color="var(--ink-4)"/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Recent activity */}
        <div className="card" data-tour-id="recent-activity">
          <CardH title="Recent activity" subtitle="Across all projects" action="Notifications" onAction={() => navTo("notifications")}/>
          {DB.notifications.slice(0, 6).map(n => (
            <div key={n.id} className="row" style={{ padding: "10px 0", gap: 10, borderBottom: "1px solid var(--line)" }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: n.type === "approval"    ? "var(--blue-soft)" :
                            n.type === "deliverable" ? "var(--violet-soft)" :
                            n.type === "budget"      ? "var(--amber-soft)" :
                            n.type === "risk"        ? "var(--red-soft)" :
                                                        "var(--surface-3)",
                color:      n.type === "approval"    ? "var(--blue)" :
                            n.type === "deliverable" ? "var(--violet)" :
                            n.type === "budget"      ? "var(--amber)" :
                            n.type === "risk"        ? "var(--red)" :
                                                        "var(--ink-3)",
                display: "grid", placeItems: "center", flexShrink: 0,
              }}>
                <Ico name={
                  n.type === "approval"    ? "checkSquare" :
                  n.type === "deliverable" ? "layers" :
                  n.type === "budget"      ? "dollar" :
                  n.type === "risk"        ? "shield" :
                  n.type === "change"      ? "git" :
                  n.type === "mention"     ? "at" :
                                              "bell"
                } size={13}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>{n.title}</div>
                <div className="muted tiny" style={{ marginTop: 2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{n.message}</div>
              </div>
              {!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}/>}
            </div>
          ))}
        </div>
      </div>

      {/* Approvals waiting + Upcoming milestones */}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="card" data-tour-id="approvals-card">
          <CardH title="Approvals waiting on you" action="Open queue" onAction={() => navTo("approvals")}/>
          {DB.approvals.filter(a => a.status === "Pending").slice(0,5).map(a => {
            const approver = DB.employeeById(a.approver_id);
            return (
              <div key={a.approval_id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)", gap: 10 }}>
                <span className="badge outline" style={{ fontSize: 10 }}>{a.entity_type}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="row" style={{ gap: 8 }}>
                    <span className="cell-id">{a.approval_id}</span>
                    <span style={{ fontSize: 12.5, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{a.title}</span>
                  </div>
                  <div className="muted tiny" style={{ marginTop: 2 }}>{a.level} approval · {U.fmtDate(a.raised)}</div>
                </div>
                <span className={"badge " + U.priorityClass(a.priority)} style={{ fontSize: 10 }}>{a.priority}</span>
                <Avatar employee={approver} size="sm"/>
              </div>
            );
          })}
        </div>

        <div className="card" data-tour-id="milestones-card">
          <CardH title="Upcoming milestones" subtitle="Across all active projects" action="View schedule" onAction={() => navTo("gantt")}/>
          {(() => {
            const upcoming = DB.milestones
              .filter(m => m.status !== "Completed")
              .map(m => ({ ...m, days: U.daysFromToday(m.due_date) }))
              .filter(m => m.days >= -7) // include barely-overdue too
              .sort((a,b) => a.days - b.days)
              .slice(0,5);
            if (upcoming.length === 0) {
              return <div className="muted tiny" style={{ padding: "20px 0", textAlign: "center" }}>No upcoming milestones.</div>;
            }
            return upcoming.map(m => {
              const proj = DB.projectById(m.project_id);
              return (
                <div key={m.milestone_id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)", gap: 12, cursor: "pointer" }}
                     onClick={() => navTo("projects/" + m.project_id + "/gantt")}>
                  <div style={{ textAlign:"center", width: 44 }}>
                    <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", color: m.days < 0 ? "var(--red)" : m.days < 7 ? "var(--amber)" : "var(--ink)" }}>{m.days}</div>
                    <div className="muted xs">days</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5 }}>{m.title}</div>
                    <div className="muted tiny mono" style={{ marginTop: 2 }}>{proj?.project_code} · {U.fmtDate(m.due_date)}</div>
                  </div>
                  <Status value={m.status}/>
                </div>
              );
            });
          })()}
        </div>
      </div>
    </div>
  );
}

window.ScreenDashboard = ScreenDashboard;
