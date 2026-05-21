// ============================================
// Atlas — Screen 5: Project Detail (with all tabs)
// Also includes Screen 6 (Discipline workspace) inline
// ============================================

function ScreenProjectDetail({ projectId, tab }) {
  const p = DB.projectById(projectId);
  if (!p) {
    return (
      <div className="content" data-tour-id="page">
        <Empty title="Project not found" subtitle="Try the projects list." action={<a className="btn" href="#/projects">Back to projects</a>}/>
      </div>
    );
  }
  const cost = DB.costs.find(c => c.project_id === p.project_id);
  const pm = DB.employeeById(p.pm_id);
  const disc = DB.disciplines.filter(d => d.project_id === p.project_id);
  const dels = DB.deliverables.filter(d => d.project_id === p.project_id);
  const risksList = DB.risks.filter(r => r.project_id === p.project_id);
  const team = DB.assignments.filter(a => a.project_id === p.project_id);
  const milestones = DB.milestones.filter(m => m.project_id === p.project_id);
  const changeList = DB.changes.filter(c => c.project_id === p.project_id);
  const approvals  = DB.approvals.filter(a => a.project_id === p.project_id);

  const tabs = [
    { value: "overview",     label: "Overview",     icon: "dashboard" },
    { value: "team",         label: "Team",         icon: "users",   count: team.length },
    { value: "disciplines",  label: "Disciplines",  icon: "layers",  count: disc.length },
    { value: "deliverables", label: "Deliverables", icon: "fileText", count: dels.length },
    { value: "cost",         label: "Cost",         icon: "coin" },
    { value: "risks",        label: "Risks",        icon: "shield",  count: risksList.length },
    { value: "changes",      label: "Changes",      icon: "git",     count: changeList.length },
    { value: "approvals",    label: "Approvals",    icon: "checkSquare", count: approvals.length },
    { value: "minutes",      label: "Minutes",      icon: "users",   count: DB.meetingsByProject(p.project_id).length },
    { value: "documents",    label: "Documents",    icon: "folder",  count: DB.documents.filter(d => d.project_id === p.project_id).length },
    { value: "gantt",        label: "Schedule",     icon: "gantt" },
    { value: "log",          label: "Activity log", icon: "book",    count: DB.dailyLogEntries.filter(e => e.project_id === p.project_id).length },
  ];
  // Support a sub-route for individual meeting: tab can be "minutes/MTG-001"
  const tabParts = (tab || "").split("/");
  const tabRoot = tabParts[0];
  const tabArg = tabParts[1];
  const activeTab = tabs.find(t => t.value === tabRoot) ? tabRoot : "overview";

  return (
    <div className="content" data-tour-id="page">
      {/* Header */}
      <div>
        <div className="crumb">
          <a onClick={() => navTo("projects")} style={{cursor:"pointer"}}>Projects</a>
          <Ico name="chevRight" size={12}/>
          <span style={{color:"var(--ink)"}}>{p.project_code}</span>
        </div>
        <div className="row" style={{ alignItems: "flex-start", gap: 18, marginBottom: 14 }}>
          <div style={{ flex: 1 }}>
            <div className="row" style={{ gap: 10, marginBottom: 6 }}>
              <span style={{
                width: 12, height: 12, borderRadius: "50%",
                background: p.health === "green" ? "var(--green)" : p.health === "amber" ? "var(--amber)" : "var(--red)",
              }} title={p.health}/>
              <span className="mono tiny muted">{p.project_code}</span>
              <span className="muted tiny">·</span>
              <span className="badge outline" style={{fontSize: 10}}>{p.project_type}</span>
              <span className="muted tiny">·</span>
              <span className="tiny muted">{p.client} · {p.country}</span>
            </div>
            <h1 className="page-title" style={{ marginBottom: 6 }}>{p.project_name}</h1>
            <div className="row" style={{ gap: 12, color: "var(--ink-3)", fontSize: 12.5, flexWrap:"wrap" }}>
              <div className="row" style={{gap:6}}><Ico name="calendar" size={12}/>{U.fmtDate(p.start_date)} – {U.fmtDate(p.end_date)}</div>
              <span className="muted">·</span>
              <div className="row" style={{gap:6}}><Ico name="dollar" size={12}/>${(p.budget/1e6).toFixed(2)}M budget</div>
              <span className="muted">·</span>
              <div className="row" style={{gap:6}}>
                <Avatar employee={pm} size="sm"/>
                <span>{pm.full_name}</span>
              </div>
              <span className="muted">·</span>
              <Status value={p.status}/>
            </div>
          </div>

          <div className="row" style={{ gap: 8 }}>
            <button className="icon-btn" title="Star"><Ico name="bookmark" size={16}/></button>
            <button className="btn"><Ico name="share" size={13}/>Share</button>
            <button className="btn" data-no-toast onClick={() => location.hash = `#/daily-log?project=${p.project_id}`}><Ico name="book" size={13}/>Log entry</button>
            <button className="btn primary" data-no-toast onClick={() => location.hash = '#/deliverables'}><Ico name="plus" size={13}/>Add deliverable</button>
          </div>
        </div>

        {/* Progress strip */}
        <div className="row" style={{ gap: 16 }}>
          <div style={{flex: 1}}>
            <div className="row" style={{ justifyContent:"space-between", marginBottom: 4 }}>
              <span className="muted tiny" style={{letterSpacing:"0.12em", textTransform:"uppercase"}}>Schedule progress</span>
              <span className="mono tiny">{p.progress}% · Submission {U.fmtDate(p.submission_date)}</span>
            </div>
            <div className="progress thick"><span style={{ width: p.progress + "%", background: p.health==="amber"?"var(--amber)":p.health==="red"?"var(--red)":"var(--green)" }}/></div>
          </div>
        </div>
      </div>

      <Tabs tabs={tabs} active={activeTab} onChange={t => navTo(`projects/${p.project_id}/${t}`)}/>

      <div style={{ marginTop: -8 }}/>

      {/* Tab content */}
      {activeTab === "overview"     && <ProjectOverview p={p} cost={cost} disc={disc} dels={dels} risksList={risksList} milestones={milestones}/>}
      {activeTab === "team"         && <ProjectTeam p={p} team={team}/>}
      {activeTab === "disciplines"  && <ProjectDisciplines p={p} disc={disc}/>}
      {activeTab === "deliverables" && <ProjectDeliverables p={p} dels={dels}/>}
      {activeTab === "cost"         && <ProjectCost p={p} cost={cost} disc={disc}/>}
      {activeTab === "risks"        && <ProjectRisks p={p} risks={risksList}/>}
      {activeTab === "changes"      && <ProjectChanges p={p} changes={changeList}/>}
      {activeTab === "approvals"    && <ProjectApprovals p={p} approvals={approvals}/>}
      {activeTab === "documents"    && <ProjectDocuments p={p}/>}
      {activeTab === "minutes"      && (tabArg ? <ProjectMeetingDetail p={p} meetingId={tabArg}/> : <ProjectMinutes p={p}/>)}
      {activeTab === "gantt"        && <ProjectGantt p={p} disc={disc} milestones={milestones}/>}
      {activeTab === "log"          && <ProjectActivityLog p={p}/>}
    </div>
  );
}

// =========================================================
// OVERVIEW TAB
// =========================================================
function ProjectOverview({ p, cost, disc, dels, risksList, milestones }) {
  const lateDels = dels.filter(d => d.status === "Delayed" || (d.status === "In Progress" && U.daysFromToday(d.planned_date) < 0));
  const upcoming = milestones.filter(m => m.status !== "Completed").sort((a,b)=> a.due_date.localeCompare(b.due_date)).slice(0,4);
  const consumedHours = disc.reduce((s,d)=>s+d.actual_hours, 0);
  const plannedHours  = disc.reduce((s,d)=>s+d.planned_hours, 0);

  return (
    <div className="col" style={{ gap: 14 }}>
      {/* Widget strip */}
      <div className="kpi-grid">
        <KPI featured label="Project progress" icon="trendUp" value={p.progress + "%"} foot={`${p.health[0].toUpperCase() + p.health.slice(1)} status`}/>
        <KPI label="Hours consumed" icon="clock" value={Math.round(consumedHours/1000) + "K"} unit={"/" + Math.round(plannedHours/1000) + "K"} foot={`${Math.round(consumedHours/plannedHours*100)}% of plan`}/>
        <KPI label="Remaining budget" icon="dollar" value={"$" + ((p.budget-cost.spent)/1e6).toFixed(2) + "M"} foot={Math.round((1-cost.spent/p.budget)*100) + "% left"}/>
        <KPI label="Late deliverables" icon="alertTri" value={lateDels.length} delta={lateDels.length > 0 ? "needs attention" : "on track"} deltaDir={lateDels.length > 0 ? "down" : "up"}/>
        <KPI label="Open risks" icon="shield" value={risksList.filter(r => r.status === "Open").length} foot="View register"/>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
        {/* Discipline progress */}
        <div className="card">
          <CardH title="Discipline progress" subtitle="Hours consumed vs plan"/>
          <div className="col" style={{ gap: 10 }}>
            {disc.map(d => {
              const lead = DB.employeeById(d.lead_employee_id);
              const color = U.disciplineColors[d.name] || "var(--accent)";
              return (
                <div key={d.discipline_id} className="row" style={{ gap: 12 }}>
                  <div className="row" style={{ gap: 8, width: 200 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
                    <span style={{ fontSize: 12.5 }}>{d.name}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="progress" style={{ height: 8 }}>
                      <span style={{ width: d.completion_percent + "%", background: color }}/>
                    </div>
                  </div>
                  <span className="mono tiny" style={{ width: 90, textAlign: "right" }}>{d.actual_hours.toLocaleString()} / {d.planned_hours.toLocaleString()}h</span>
                  <span className="mono tiny" style={{ width: 36, textAlign: "right", fontWeight: 500 }}>{d.completion_percent}%</span>
                  <Avatar employee={lead} size="sm"/>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming milestones */}
        <div className="card">
          <CardH title="Upcoming milestones" action="See schedule" onAction={() => navTo(`projects/${p.project_id}/gantt`)}/>
          {upcoming.map(m => {
            const d = U.daysFromToday(m.due_date);
            return (
              <div key={m.milestone_id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)", gap: 10 }}>
                <Ico name="diamond" size={14} color={d < 14 ? "var(--accent)" : "var(--ink-4)"}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5 }}>{m.title}</div>
                  <div className="muted tiny mono">{m.milestone_id} · {U.fmtDate(m.due_date)}</div>
                </div>
                <span className="mono tiny" style={{ color: d < 7 ? "var(--red)" : d < 14 ? "var(--amber)" : "var(--ink-3)" }}>{d}d</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
        {/* Recent deliverables */}
        <div className="card">
          <CardH title="Recent deliverables" action="See all" onAction={() => navTo(`projects/${p.project_id}/deliverables`)}/>
          {dels.slice(0,5).map(d => (
            <div key={d.deliverable_id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)", gap: 10 }}>
              <Ico name="fileText" size={14} color="var(--ink-3)"/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="row" style={{gap: 8}}>
                  <span className="mono tiny muted">{d.deliverable_code}</span>
                  <span className="badge outline" style={{fontSize:9.5}}>Rev {d.revision}</span>
                </div>
                <div style={{ fontSize: 12.5, marginTop: 2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{d.title}</div>
              </div>
              <Status value={d.status}/>
            </div>
          ))}
        </div>

        {/* Risks summary */}
        <div className="card">
          <CardH title="Top risks" action="Open register" onAction={() => navTo(`projects/${p.project_id}/risks`)}/>
          {[...risksList].sort((a,b)=> (b.probability*b.impact) - (a.probability*a.impact)).slice(0,4).map(r => {
            const score = r.probability * r.impact;
            return (
              <div key={r.risk_id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)", gap: 10 }}>
                <span style={{
                  display:"inline-flex", width: 30, height: 24, alignItems:"center", justifyContent:"center",
                  background: score>=15?"var(--red-soft)":score>=10?"var(--orange-soft)":score>=5?"var(--amber-soft)":"var(--surface-3)",
                  color: score>=15?"var(--red)":score>=10?"var(--orange)":score>=5?"var(--amber)":"var(--ink-3)",
                  borderRadius: 5, fontFamily:"var(--font-mono)", fontWeight:600, fontSize:12,
                }}>{score}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{r.title}</div>
                  <div className="muted tiny mono">{r.risk_id} · {r.category}</div>
                </div>
                <Avatar name={r.owner} size="sm"/>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =========================================================
// TEAM TAB
// =========================================================
function ProjectTeam({ p, team }) {
  const [createOpen, setCreateOpen] = React.useState(false);
  return (
    <div className="card flush">
      <div className="table-head">
        <div className="table-head-l">
          <h3 className="card-title">Team — {team.length} members</h3>
          <div className="muted tiny">Active assignments on {p.project_code}</div>
        </div>
        <button className="btn primary"><Ico name="plus" size={13}/>Add member</button>
      </div>
      <table className="data">
        <thead><tr><th>Name</th><th>Role on project</th><th>Discipline</th><th>Allocation</th><th>Period</th><th></th></tr></thead>
        <tbody>
          {team.map((a, i) => {
            const e = DB.employeeById(a.employee_id);
            if (!e) return null;
            return (
              <tr key={i} onClick={() => navTo("employees/" + e.employee_id)}>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <Avatar employee={e}/>
                    <div>
                      <div className="cell-strong">{e.full_name}</div>
                      <div className="cell-sub mono">{e.employee_code}</div>
                    </div>
                  </div>
                </td>
                <td>{a.role_on_project}<div className="cell-sub">{e.job_title}</div></td>
                <td><span className="badge outline" style={{fontSize: 10}}>{a.discipline}</span></td>
                <td style={{ width: 180 }}>
                  <div className="row" style={{ gap: 10 }}>
                    <div className="progress" style={{ flex: 1, height: 6 }}><span style={{ width: a.allocation_pct + "%", background: a.allocation_pct > 80 ? "var(--red)" : "var(--accent)" }}/></div>
                    <span className="mono tiny" style={{ width: 36, textAlign: "right" }}>{a.allocation_pct}%</span>
                  </div>
                </td>
                <td><span className="mono tiny">{U.fmtDate(a.start_date)} – {U.fmtDate(a.end_date)}</span></td>
                <td><Ico name="chevRight" size={14} color="var(--ink-4)"/></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {createOpen && <CreateRecordModal
        title="Add team member"
        subtitle={"Assign someone to " + p.project_code + " with a role and allocation."}
        submitLabel="Add to team"
        onClose={() => setCreateOpen(false)}
        fields={[
          { name: "employee", label: "Engineer", type: "select", required: true, options: DB.employees.map(e => ({ value: e.employee_id, label: e.full_name + " — " + e.discipline })) },
          { name: "discipline", label: "Discipline on project", type: "select", options: DB.disciplineNames, default: "Mechanical" },
          { name: "role", label: "Role on project", required: true, placeholder: "Sr. Stress Analyst" },
          { name: "allocation", label: "Allocation (%)", type: "number", default: 60 },
          { name: "start", label: "Start date", type: "date" },
          { name: "end",   label: "End date", type: "date" },
        ]}
      />}
    </div>
  );
}

// =========================================================
// DISCIPLINES TAB (Screen 6: discipline workspace)
// =========================================================
function ProjectDisciplines({ p, disc }) {
  const [active, setActive] = React.useState(disc[0]?.name || "PM");
  const cur = disc.find(d => d.name === active);
  if (!cur) return <Empty title="No disciplines yet" subtitle="Add disciplines from the project setup."/>;
  const team = DB.assignments.filter(a => a.project_id === p.project_id && a.discipline === active);
  const dels = DB.deliverables.filter(d => d.project_id === p.project_id && d.discipline === active);
  const lead = DB.employeeById(cur.lead_employee_id);
  const color = U.disciplineColors[active] || "var(--accent)";

  return (
    <div className="col" style={{gap:14}}>
      {/* Discipline tabs */}
      <div className="card flush" style={{padding: "6px 8px"}}>
        <div className="row" style={{flexWrap:"wrap", gap: 4}}>
          {disc.map(d => {
            const c = U.disciplineColors[d.name] || "var(--accent)";
            const isActive = d.name === active;
            return (
              <button key={d.discipline_id}
                onClick={() => setActive(d.name)}
                className="chip"
                style={isActive ? { background: c, borderColor: c, color: "#fff" } : null}>
                <span className="dot" style={{ background: isActive ? "rgba(255,255,255,0.7)" : c }}/>
                {d.name}
                <span className="mono tiny" style={{ marginLeft: 4, opacity: 0.75 }}>{d.completion_percent}%</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid" style={{gridTemplateColumns: "1fr 280px"}}>
        <div className="col" style={{gap: 14}}>
          {/* KPIs */}
          <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <KPI label="Planned hours" icon="clock" value={cur.planned_hours.toLocaleString()}/>
            <KPI label="Actual hours" icon="activity" value={cur.actual_hours.toLocaleString()} delta={`${cur.completion_percent}% of plan`} deltaDir={cur.completion_percent > 100 ? "down":"up"}/>
            <KPI label="Discipline budget" icon="dollar" value={"$" + (cur.budget/1000).toFixed(0) + "K"}/>
            <KPI label="Spent" icon="coin" value={"$" + (cur.spent/1000).toFixed(0) + "K"} delta={Math.round(cur.spent/cur.budget*100)+"% used"}/>
          </div>

          {/* Deliverables for this discipline */}
          <div className="card flush">
            <div className="table-head">
              <div className="table-head-l">
                <h3 className="card-title">{active} deliverables</h3>
                <div className="muted tiny">{dels.length} items · owned by {active} discipline</div>
              </div>
              <button className="btn primary sm" data-no-toast onClick={() => location.hash = '#/deliverables'}><Ico name="plus" size={12}/>New deliverable</button>
            </div>
            <table className="data">
              <thead><tr><th>Code</th><th>Title</th><th>Owner</th><th>Status</th><th>Progress</th><th>Due</th></tr></thead>
              <tbody>
                {dels.map(d => {
                  const owner = DB.employeeById(d.owner_employee_id);
                  return (
                    <tr key={d.deliverable_id} onClick={() => navTo("deliverables/"+d.deliverable_id)}>
                      <td className="cell-id">{d.deliverable_code}</td>
                      <td>
                        <div className="row" style={{ gap: 8 }}>
                          <span className="cell-strong">{d.title}</span>
                          <span className="badge outline" style={{fontSize: 9.5}}>Rev {d.revision}</span>
                        </div>
                      </td>
                      <td><div className="row" style={{ gap: 6 }}><Avatar employee={owner} size="sm"/><span className="tiny">{owner.full_name.split(" ").pop()}</span></div></td>
                      <td><Status value={d.status}/></td>
                      <td style={{ width: 120 }}><ProgressWithLabel value={d.completion_percent}/></td>
                      <td className="cell-num">{U.fmtDate(d.planned_date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Team in this discipline */}
          <div className="card">
            <CardH title="Team assigned" subtitle={`${team.length} engineers in ${active}`}/>
            <div className="grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
              {team.map(a => {
                const e = DB.employeeById(a.employee_id);
                if (!e) return null;
                return (
                  <div key={a.employee_id} className="row" style={{ gap: 10, padding: 10, background: "var(--surface-2)", borderRadius: 8 }}
                       onClick={() => navTo("employees/"+e.employee_id)}>
                    <Avatar employee={e}/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{e.full_name}</div>
                      <div className="muted tiny">{a.role_on_project} · {a.allocation_pct}% · ${e.hourly_rate}/h</div>
                    </div>
                    <span className="badge outline" style={{ fontSize: 10 }}>{e.seniority_level}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="col" style={{ gap: 14 }}>
          <div className="card" style={{borderLeft: `3px solid ${color}`}}>
            <div className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Discipline lead</div>
            <div className="row" style={{ gap: 10 }}>
              <Avatar employee={lead} size="lg"/>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{lead.full_name}</div>
                <div className="muted tiny">{lead.job_title}</div>
                <div className="muted tiny mono" style={{ marginTop: 4 }}>{lead.email}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <CardH title="Alerts"/>
            <div className="col" style={{ gap: 8 }}>
              {(() => {
                const alerts = [];
                // Overdue deliverables
                dels.filter(d => {
                  if (d.status === "Approved" || d.status === "Issued") return false;
                  const days = Math.round((DB.TODAY - new Date(d.planned_date)) / 86400000);
                  return d.status === "Delayed" || days > 0;
                }).slice(0, 2).forEach(d => {
                  const days = Math.round((DB.TODAY - new Date(d.planned_date)) / 86400000);
                  alerts.push({ l: d.deliverable_code + (days > 0 ? ` ${days}d overdue` : " delayed"), k: "danger" });
                });
                // In Review deliverables
                dels.filter(d => d.status === "In Review").slice(0, 2).forEach(d => {
                  alerts.push({ l: d.deliverable_code + " awaiting review", k: "amber" });
                });
                // Open risks for this discipline (best-effort: those owned by this discipline's lead)
                const discLeadId = cur.lead_employee_id;
                DB.risks.filter(r => r.project_id === p.project_id && r.status === "Open" && r.owner === discLeadId).slice(0,1).forEach(r => {
                  alerts.push({ l: r.title.slice(0,38), k: r.severity === "High" ? "danger" : "amber" });
                });
                if (alerts.length === 0) {
                  return <div className="muted tiny" style={{ padding: "8px 0" }}>No active alerts.</div>;
                }
                return alerts.slice(0,4).map((a, i) => (
                  <div key={i} className="row" style={{ gap: 8, fontSize: 12, padding: 8, background: a.k === "danger" ? "var(--red-soft)" : "var(--amber-soft)", borderRadius: 6, color: a.k === "danger" ? "#9A1F1F" : "#92400E" }}>
                    <Ico name="alertTri" size={13}/>
                    <span>{a.l}</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="card">
            <CardH title="Dependencies"/>
            <div className="col" style={{ gap: 8 }}>
              {[
                { from: active, to: "Instrumentation", l: "PSD plinth tolerances" },
                { from: active, to: "Structural",      l: "Equipment loads" },
                { from: "Process", to: active,         l: "P&ID issued for design" },
              ].map((d, i) => (
                <div key={i} style={{ fontSize: 12, padding: 8, background: "var(--surface-2)", borderRadius: 6 }}>
                  <div className="row" style={{ gap: 6, marginBottom: 4 }}>
                    <span className="badge outline" style={{ fontSize: 9.5 }}>{d.from}</span>
                    <Ico name="arrRight" size={11}/>
                    <span className="badge outline" style={{ fontSize: 9.5 }}>{d.to}</span>
                  </div>
                  <div className="muted tiny">{d.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================
// DELIVERABLES TAB (mini view; full page also exists)
// =========================================================
function ProjectDeliverables({ p, dels }) {
  const [status, setStatus] = React.useState("All");
  const [disc,   setDisc]   = React.useState("All");
  const disciplines = ["All", ...Array.from(new Set(dels.map(d => d.discipline)))];
  const statuses = ["All","Draft","In Progress","In Review","Approved","Delayed","Issued"];

  const filtered = dels.filter(d => {
    if (status !== "All" && d.status !== status) return false;
    if (disc   !== "All" && d.discipline !== disc) return false;
    return true;
  });

  return (
    <div className="col" style={{gap: 14}}>
      <FilterBar
        chips={statuses.map(s => ({ value: s, label: s, count: s === "All" ? dels.length : dels.filter(d => d.status === s).length }))}
        value={status} onChange={setStatus}
        right={
          <select className="btn" value={disc} onChange={e => setDisc(e.target.value)}>
            {disciplines.map(d => <option key={d} value={d}>{d === "All" ? "All disciplines" : d}</option>)}
          </select>
        }
      />
      <div className="card flush">
        <table className="data">
          <thead><tr><th>Code</th><th>Title</th><th>Discipline</th><th>Owner</th><th>Status</th><th>Progress</th><th>Planned</th><th>Actual</th></tr></thead>
          <tbody>
            {filtered.map(d => {
              const owner = DB.employeeById(d.owner_employee_id);
              return (
                <tr key={d.deliverable_id} onClick={() => navTo("deliverables/"+d.deliverable_id)}>
                  <td className="cell-id">{d.deliverable_code}</td>
                  <td>
                    <div className="row" style={{gap:8}}>
                      <span className="cell-strong">{d.title}</span>
                      <span className="badge outline" style={{fontSize:9.5}}>Rev {d.revision}</span>
                    </div>
                  </td>
                  <td><span className="badge outline" style={{ fontSize: 10 }}>{d.discipline}</span></td>
                  <td><div className="row" style={{ gap: 6 }}><Avatar employee={owner} size="sm"/><span className="tiny">{owner.full_name.split(" ").pop()}</span></div></td>
                  <td><Status value={d.status}/></td>
                  <td style={{width:120}}><ProgressWithLabel value={d.completion_percent}/></td>
                  <td className="cell-num">{U.fmtDate(d.planned_date)}</td>
                  <td className="cell-num">{U.fmtDate(d.actual_date)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================
// COST TAB
// =========================================================
function ProjectCost({ p, cost, disc }) {
  // S-curve derived from project timeline and progress
  const sCurve = DB.projectSCurve(p.project_id);
  const sCurveMonths = sCurve.months.map(m => m.label);
  const planned  = sCurve.planned;
  const actual   = sCurve.actual;
  const forecast = sCurve.forecast;

  // Scenarios derived from this project's pending change requests
  const projectChanges = DB.changes.filter(c => c.project_id === p.project_id && c.status !== "Approved");
  const scenarioItems = projectChanges.slice(0, 4).map(c => ({
    label: c.title,
    delta: (c.cost_impact >= 0 ? "+$" : "-$") + Math.abs(c.cost_impact/1000).toFixed(0) + "K",
    days:  (c.schedule_impact_days >= 0 ? "+" : "") + c.schedule_impact_days + " days",
    cost:  c.cost_impact,
    daysN: c.schedule_impact_days,
  }));
  const combinedCost = scenarioItems.reduce((s,x) => s + x.cost, 0);
  const combinedDays = scenarioItems.reduce((s,x) => s + x.daysN, 0);

  return (
    <div className="col" style={{ gap: 14 }}>
      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
        <KPI featured label="Budget" icon="dollar" value={"$" + (p.budget/1e6).toFixed(2) + "M"}/>
        <KPI label="Committed" icon="briefcase" value={"$" + (cost.committed/1e6).toFixed(2) + "M"} foot={Math.round(cost.committed/p.budget*100)+"% of budget"}/>
        <KPI label="Spent" icon="coin" value={"$" + (cost.spent/1e6).toFixed(2) + "M"} foot={Math.round(cost.spent/p.budget*100)+"%"}/>
        <KPI label="Forecast at completion" icon="trendUp" value={"$" + (cost.forecast/1e6).toFixed(2) + "M"} delta={(cost.variance >= 0 ? "+" : "") + "$" + Math.abs(cost.variance/1000).toFixed(0) + "K"} deltaDir={cost.variance >= 0 ? "down" : "up"}/>
        <KPI label="Contingency drawn" icon="alertTri" value={"$" + (cost.contingency_drawn/1000).toFixed(0) + "K"} foot={`of $${(cost.contingency/1000).toFixed(0)}K`}/>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <CardH title="Cost S-curve" subtitle="Earned value · planned vs actual vs forecast"/>
          <LineChart
            w={600} h={210}
            currentIdx={sCurve.currentIdx}
            months={sCurveMonths}
            yMax={100}
            series={[
              { color: "var(--ink-5)", data: planned, dashed: true },
              { color: "var(--ink)",   data: actual },
              { color: "var(--accent)",data: forecast, dashed: true },
            ]}
          />
          <div className="row" style={{ justifyContent:"center", gap: 16, marginTop: 4, fontSize: 11 }}>
            <div className="row" style={{ gap: 6 }}><span style={{ width: 16, height: 2, background: "var(--ink-5)", borderTop: "1px dashed var(--ink-5)" }}/>Planned</div>
            <div className="row" style={{ gap: 6 }}><span style={{ width: 16, height: 2, background: "var(--ink)" }}/>Actual</div>
            <div className="row" style={{ gap: 6 }}><span style={{ width: 16, height: 2, background: "var(--accent)" }}/>Forecast</div>
          </div>
        </div>

        <div className="card">
          <CardH title="Scenario modeling" subtitle="Pending change requests · cumulative if all approved"/>
          {scenarioItems.length === 0 ? (
            <div className="muted tiny" style={{ padding: "20px 0", textAlign: "center" }}>No pending scenarios for this project.</div>
          ) : (
            <>
              <div className="col" style={{ gap: 12 }}>
                {scenarioItems.map((s, i) => (
                  <ScenarioRow key={i} label={s.label} delta={s.delta} days={s.days}/>
                ))}
              </div>
              <div style={{ marginTop: 16, padding: 12, background: "var(--accent-soft-2)", borderRadius: 8 }}>
                <div className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Combined impact</div>
                <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.025em", color: "var(--accent)" }}>
                  {combinedCost >= 0 ? "+$" : "-$"}{Math.abs(combinedCost/1000).toFixed(0)}K · {combinedDays >= 0 ? "+" : ""}{combinedDays} days
                </div>
                <div className="muted tiny" style={{ marginTop: 4 }}>Applied to {p.project_code} forecast at completion.</div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card flush">
        <div className="table-head">
          <div className="table-head-l">
            <h3 className="card-title">Cost by discipline</h3>
            <div className="muted tiny">Hours × rate × fee factor — synced with assignments</div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn sm"><Ico name="download" size={12}/>Cost report (PDF)</button>
            <button className="btn sm"><Ico name="upload" size={12}/>Import POs</button>
          </div>
        </div>
        <table className="data">
          <thead><tr><th>Discipline</th><th className="num">Planned hrs</th><th className="num">Actual hrs</th><th className="num">Rate</th><th className="num">Cost</th><th className="num">Budget</th><th>Margin</th><th>Health</th></tr></thead>
          <tbody>
            {disc.map(d => {
              const margin = d.budget - d.spent;
              const pct = Math.round(d.spent/d.budget*100);
              return (
                <tr key={d.discipline_id}>
                  <td>
                    <div className="row" style={{ gap: 8 }}>
                      <span style={{ width: 6, height: 22, background: U.disciplineColors[d.name], borderRadius: 2 }}/>
                      <span className="cell-strong">{d.name}</span>
                    </div>
                  </td>
                  <td className="num cell-num">{d.planned_hours.toLocaleString()}</td>
                  <td className="num cell-num">{d.actual_hours.toLocaleString()}</td>
                  <td className="num cell-num">${Math.round(d.spent/d.actual_hours || 0)}</td>
                  <td className="num cell-num">${(d.spent/1000).toFixed(1)}K</td>
                  <td className="num cell-num">${(d.budget/1000).toFixed(1)}K</td>
                  <td className="num"><span style={{ color: margin > 0 ? "var(--green)" : "var(--red)", fontFamily: "var(--font-mono)" }}>{margin > 0 ? "+" : ""}${(margin/1000).toFixed(1)}K</span></td>
                  <td>
                    <span className={"badge " + (pct > 100 ? "danger" : pct > 90 ? "warn" : "success")} style={{ fontSize: 10 }}>{pct}%</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function ScenarioRow({ label, delta, days }) {
  const positive = delta.startsWith("-");
  return (
    <div className="row" style={{ gap: 10, padding: "10px 12px", background: "var(--surface-2)", borderRadius: 8 }}>
      <input type="checkbox"/>
      <div style={{ flex: 1, fontSize: 12.5 }}>{label}</div>
      <span className="mono tiny" style={{ color: positive ? "var(--green)" : "var(--red)" }}>{delta}</span>
      <span className="mono tiny muted">{days}</span>
    </div>
  );
}

// =========================================================
// RISKS TAB (heatmap + list)
// =========================================================
function ProjectRisks({ p, risks }) {
  return <RisksView risks={risks}/>;
}
function RisksView({ risks }) {
  const colorFor = (L, I) => {
    const s = L*I;
    if (s >= 15) return "var(--red)";
    if (s >= 10) return "var(--orange)";
    if (s >= 5)  return "var(--amber)";
    return "var(--green-soft)";
  };
  return (
    <div className="grid" style={{ gridTemplateColumns: "320px 1fr" }}>
      <div className="card">
        <CardH title="Heat map" subtitle="Probability × Impact"/>
        <div style={{display:"grid", gridTemplateColumns:"24px repeat(5, 1fr)", gridTemplateRows:"repeat(5, 1fr) 18px", gap: 4}}>
          {[5,4,3,2,1].map(I => (
            <React.Fragment key={I}>
              <div style={{display:"grid", placeItems:"center", fontSize: 10, color: "var(--ink-4)", fontFamily:"var(--font-mono)"}}>{I}</div>
              {[1,2,3,4,5].map(L => {
                const cellRisks = risks.filter(r => r.probability === L && r.impact === I && r.status === "Open");
                return (
                  <div key={L} className="heat-cell" style={{
                    background: colorFor(L,I), opacity: L*I >= 10 ? 0.95 : L*I >= 5 ? 0.85 : 0.45,
                    color: L*I >= 10 ? "#fff" : "var(--ink-2)",
                  }}>
                    <span style={{ fontSize: 9.5, opacity: 0.7 }}>{L*I}</span>
                    {cellRisks.length > 0 && (
                      <div className="row" style={{ gap: 3, flexWrap: "wrap" }}>
                        {cellRisks.slice(0,3).map(r => <span key={r.risk_id} style={{ fontSize: 9, background: "rgba(255,255,255,0.3)", padding: "1px 4px", borderRadius: 3 }}>{r.risk_id.replace("R-","")}</span>)}
                        {cellRisks.length > 3 && <span style={{ fontSize: 9 }}>+{cellRisks.length-3}</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
          <div/>
          {[1,2,3,4,5].map(n => <div key={n} style={{textAlign:"center", fontSize: 10, color: "var(--ink-4)", fontFamily:"var(--font-mono)"}}>{n}</div>)}
        </div>
        <div className="row" style={{ justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span>Impact ↑</span>
          <span>Probability →</span>
        </div>
      </div>

      <div className="card flush">
        <div className="table-head">
          <div className="table-head-l">
            <h3 className="card-title">Risk register</h3>
            <div className="muted tiny">{risks.filter(r=>r.status==="Open").length} open · {risks.length} total</div>
          </div>
          <button className="btn primary sm" data-no-toast onClick={() => location.hash = '#/risks'}><Ico name="plus" size={12}/>New risk</button>
        </div>
        <table className="data">
          <thead><tr><th>ID</th><th>Risk</th><th>Category</th><th>Owner</th><th className="num">P</th><th className="num">I</th><th className="num">Score</th><th>Trend</th><th>Status</th></tr></thead>
          <tbody>
            {risks.map(r => {
              const owner = DB.employeeById(r.owner);
              return (
                <tr key={r.risk_id}>
                  <td className="cell-id">{r.risk_id}</td>
                  <td>
                    <div className="cell-strong">{r.title}</div>
                    <div className="cell-sub">{r.mitigation}</div>
                  </td>
                  <td><span className="badge outline" style={{ fontSize: 10 }}>{r.category}</span></td>
                  <td><Avatar employee={owner} size="sm"/></td>
                  <td className="num cell-num">{r.probability}</td>
                  <td className="num cell-num">{r.impact}</td>
                  <td className="num">
                    <span style={{
                      display:"inline-flex", width: 28, height: 22, alignItems:"center", justifyContent:"center",
                      background: r.probability*r.impact>=15?"var(--red-soft)":r.probability*r.impact>=10?"var(--orange-soft)":r.probability*r.impact>=5?"var(--amber-soft)":"var(--surface-3)",
                      color: r.probability*r.impact>=15?"var(--red)":r.probability*r.impact>=10?"var(--orange)":r.probability*r.impact>=5?"var(--amber)":"var(--ink-3)",
                      borderRadius: 5, fontWeight: 600,
                    }}>{r.probability*r.impact}</span>
                  </td>
                  <td>
                    <span className="tiny" style={{color: r.trend==="rising"?"var(--red)":r.trend==="falling"?"var(--green)":"var(--ink-4)"}}>
                      {r.trend === "rising" ? "↗" : r.trend === "falling" ? "↘" : "→"} {r.trend}
                    </span>
                  </td>
                  <td><Status value={r.status}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =========================================================
// CHANGES TAB
// =========================================================
function ProjectChanges({ p, changes }) {
  return <ChangesView changes={changes}/>;
}
function ChangesView({ changes }) {
  return (
    <div className="card flush">
      <div className="table-head">
        <div className="table-head-l">
          <h3 className="card-title">Change requests</h3>
          <div className="muted tiny">{changes.length} requests · {changes.filter(c => c.status === "Approved").length} approved</div>
        </div>
        <button className="btn primary sm" data-no-toast onClick={() => location.hash = '#/changes'}><Ico name="plus" size={12}/>New change</button>
      </div>
      <table className="data">
        <thead><tr><th>ID</th><th>Title</th><th>Reason</th><th>Initiator</th><th className="num">Hrs</th><th className="num">Cost</th><th className="num">Days</th><th>Status</th></tr></thead>
        <tbody>
          {changes.map(c => (
            <tr key={c.change_id} onClick={() => navTo("changes/" + c.change_id)}>
              <td className="cell-id">{c.change_id}</td>
              <td>
                <div className="cell-strong">{c.title}</div>
                <div className="cell-sub">{U.fmtDate(c.date)}</div>
              </td>
              <td>{c.reason}</td>
              <td><span className="badge outline" style={{ fontSize: 10 }}>{c.initiator}</span></td>
              <td className="num cell-num" style={{ color: c.hours_impact < 0 ? "var(--green)" : null }}>{c.hours_impact > 0 ? "+" : ""}{c.hours_impact}</td>
              <td className="num cell-num" style={{ color: c.cost_impact < 0 ? "var(--green)" : null }}>{c.cost_impact >= 0 ? "+$" : "-$"}{Math.abs(c.cost_impact/1000).toFixed(1)}K</td>
              <td className="num cell-num" style={{ color: c.schedule_impact_days < 0 ? "var(--green)" : null }}>{c.schedule_impact_days > 0 ? "+" : ""}{c.schedule_impact_days}d</td>
              <td><Status value={c.status}/></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// =========================================================
// APPROVALS TAB
// =========================================================
function ProjectApprovals({ p, approvals }) { return <ApprovalsView approvals={approvals}/>; }

// =========================================================
// DOCUMENTS TAB
// =========================================================
function ProjectDocuments({ p }) {
  const docs = DB.documents.filter(d => d.project_id === p.project_id);
  return (
    <div className="card flush">
      <div className="table-head">
        <div className="table-head-l">
          <h3 className="card-title">Documents</h3>
          <div className="muted tiny">{docs.length} files · synced from deliverables</div>
        </div>
        <button className="btn primary sm"><Ico name="upload" size={12}/>Upload</button>
      </div>
      <table className="data">
        <thead><tr><th>Code</th><th>Title</th><th>Discipline</th><th>Type</th><th>Rev</th><th>Author</th><th>Date</th><th className="num">Size</th></tr></thead>
        <tbody>
          {docs.map(d => {
            const author = DB.employeeById(d.uploaded_by);
            return (
              <tr key={d.document_id}>
                <td className="cell-id">{d.document_id}</td>
                <td>
                  <div className="row" style={{ gap: 10 }}>
                    <div style={{ width: 28, height: 32, background: "var(--surface-3)", borderRadius: 4, display: "grid", placeItems: "center" }}>
                      <Ico name="fileText" size={13} color="var(--ink-3)"/>
                    </div>
                    <div>
                      <div className="cell-strong">{d.title}</div>
                      <div className="cell-sub mono">{d.file_name}</div>
                    </div>
                  </div>
                </td>
                <td><span className="badge outline" style={{ fontSize: 10 }}>{d.discipline}</span></td>
                <td>{d.file_type}</td>
                <td><span className="badge neutral" style={{ fontSize: 10 }}>{d.version}</span></td>
                <td><Avatar employee={author} size="sm"/></td>
                <td className="cell-num">{U.fmtDate(d.uploaded_date)}</td>
                <td className="num cell-num">{d.size_mb} MB</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// =========================================================
// GANTT TAB (also screen 10)
// =========================================================
function ProjectGantt({ p, disc, milestones }) {
  return <GanttView p={p} disc={disc} milestones={milestones}/>;
}
function GanttView({ p, disc, milestones }) {
  // Months from project start through end
  const start = new Date(p.start_date), end = new Date(p.end_date);
  const months = [];
  let cur = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1));
  while (cur <= end) {
    months.push({ y: cur.getUTCFullYear(), m: cur.getUTCMonth(), label: U.fmtDate(cur, "monthYr") });
    cur = new Date(Date.UTC(cur.getUTCFullYear(), cur.getUTCMonth()+1, 1));
  }
  const today = new Date("2026-05-19");
  const todayIdx = (today.getUTCFullYear() - start.getUTCFullYear()) * 12 + (today.getUTCMonth() - start.getUTCMonth());
  const colW = Math.max(58, Math.min(120, 900 / months.length));

  // Build bars per discipline (synthetic spans across project)
  function barsFor(d, i) {
    const total = months.length;
    const startIdx = Math.floor((i / disc.length) * total * 0.25);
    const endIdx = Math.min(total - 1, startIdx + Math.floor(total * (0.55 + (i%3) * 0.1)));
    return [{ start: startIdx, end: endIdx, label: d.name + " — phase 1" }];
  }

  return (
    <div className="card flush" style={{ overflow: "auto" }}>
      <div className="table-head">
        <div className="table-head-l">
          <h3 className="card-title">Schedule — Gantt</h3>
          <div className="muted tiny">Monthly view · {months.length} months · drag bars to reschedule</div>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="chips">
            <button className="chip active">Months</button>
            <button className="chip">Weeks</button>
            <button className="chip">Days</button>
          </div>
          <button className="btn sm"><Ico name="filter" size={12}/>Filter</button>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: `220px repeat(${months.length}, ${colW}px)`, background: "var(--surface-2)", borderBottom: "1px solid var(--line)", position: "sticky", top: 0, zIndex: 1 }}>
          <div style={{ padding: "10px 14px", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", borderRight: "1px solid var(--line)" }}>Workstream</div>
          {months.map((m, i) => (
            <div key={i} style={{ padding: "10px 6px", fontSize: 10.5, color: i === todayIdx ? "var(--accent)" : "var(--ink-4)", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center", borderRight: "1px solid var(--line)", fontWeight: i === todayIdx ? 600 : 400 }}>
              {m.label}
            </div>
          ))}
        </div>

        {disc.map((d, i) => {
          const bars = barsFor(d, i);
          return (
            <div key={d.discipline_id} style={{ display: "grid", gridTemplateColumns: `220px repeat(${months.length}, ${colW}px)`, position: "relative", borderBottom: "1px solid var(--line)" }}>
              <div style={{ padding: "12px 14px", background: "var(--surface-2)", borderRight: "1px solid var(--line)" }}>
                <div className="row" style={{ gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: U.disciplineColors[d.name] }}/>
                  <span style={{ fontSize: 12.5 }}>{d.name}</span>
                </div>
                <div className="muted tiny mono" style={{ marginTop: 2 }}>{d.completion_percent}% · {(d.actual_hours/1000).toFixed(1)}K h</div>
              </div>
              {months.map((_, j) => (
                <div key={j} style={{ borderRight: "1px solid var(--line)", height: 52, background: j === todayIdx ? "rgba(37, 99, 235, 0.04)" : null }}/>
              ))}
              {bars.map((b, k) => (
                <div key={k} className="gantt-bar" style={{
                  left: 220 + b.start*colW + 4,
                  width: (b.end - b.start + 1)*colW - 8,
                  background: U.disciplineColors[d.name],
                  height: 24, top: 14,
                }}>
                  <span style={{ opacity: 0.9 }}>{b.label}</span>
                </div>
              ))}
            </div>
          );
        })}

        {/* Milestones row */}
        <div style={{ display: "grid", gridTemplateColumns: `220px repeat(${months.length}, ${colW}px)`, position: "relative", background: "var(--bg)" }}>
          <div style={{ padding: "12px 14px", background: "var(--surface-2)", borderRight: "1px solid var(--line)", fontSize: 12.5, fontWeight: 500 }}>
            <div className="row" style={{ gap: 8 }}><Ico name="diamond" size={12} color="var(--accent)"/>Milestones</div>
          </div>
          {months.map((_, j) => (
            <div key={j} style={{ borderRight: "1px solid var(--line)", height: 44, background: j === todayIdx ? "rgba(37, 99, 235, 0.04)" : null }}/>
          ))}
          {milestones.map(m => {
            const d = new Date(m.due_date);
            const monthIdx = (d.getUTCFullYear() - start.getUTCFullYear()) * 12 + (d.getUTCMonth() - start.getUTCMonth());
            const dayFrac = d.getUTCDate() / 30;
            const x = 220 + (monthIdx + dayFrac) * colW;
            return (
              <div key={m.milestone_id} style={{ position: "absolute", left: x - 8, top: 12, textAlign: "center" }} title={m.title}>
                <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 1L15 8L8 15L1 8z" fill={m.status === "Completed" ? "var(--green)" : m.status === "Active" ? "var(--accent)" : "var(--ink-4)"}/></svg>
                <div className="mono" style={{ fontSize: 9, color: "var(--ink-3)", marginTop: 2, whiteSpace: "nowrap" }}>{m.milestone_id}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Placeholder needed before its definition above
function ApprovalsView({ approvals }) {
  return (
    <div className="card flush">
      <div className="table-head">
        <div className="table-head-l">
          <h3 className="card-title">Approval queue</h3>
          <div className="muted tiny">{approvals.filter(a=>a.status==="Pending").length} pending · {approvals.length} total</div>
        </div>
      </div>
      <table className="data">
        <thead><tr><th>ID</th><th>Type</th><th>Item</th><th>Level</th><th>Approver</th><th>Raised</th><th>Priority</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {approvals.map(a => {
            const approver = DB.employeeById(a.approver_id);
            return (
              <tr key={a.approval_id}>
                <td className="cell-id">{a.approval_id}</td>
                <td><span className="badge outline" style={{ fontSize: 10 }}>{a.entity_type}</span></td>
                <td><div className="cell-strong">{a.title}</div><div className="cell-sub mono">{a.entity_id}</div></td>
                <td>{a.level}</td>
                <td><div className="row" style={{ gap: 6 }}><Avatar employee={approver} size="sm"/><span className="tiny">{approver.full_name.split(" ").pop()}</span></div></td>
                <td className="cell-num">{U.fmtDate(a.raised)}</td>
                <td><span className={"badge " + U.priorityClass(a.priority)} style={{ fontSize: 10 }}>{a.priority}</span></td>
                <td><Status value={a.status}/></td>
                <td>
                  {a.status === "Pending" && (
                    <div className="row" style={{ gap: 4 }}>
                      <button className="btn xs success">Approve</button>
                      <button className="btn xs">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// =========================================================
// Project activity log — every engineer's log entries on this project
// Mike's requirement: "reporting should be available for each project
// separately." This view aggregates the daily log entries from all
// engineers, with filtering by person, type, deliverable.
// =========================================================
function ProjectActivityLog({ p }) {
  const [filterEmp, setFilterEmp]   = React.useState(null);
  const [filterType, setFilterType] = React.useState(null);
  const [filterDel, setFilterDel]   = React.useState(null);
  const [search, setSearch]         = React.useState("");

  const allEntries = DB.dailyLogByProject(p.project_id);

  // Apply filters
  let entries = allEntries;
  if (filterEmp)  entries = entries.filter(e => e.employee_id === filterEmp);
  if (filterType) entries = entries.filter(e => e.entry_type === filterType);
  if (filterDel)  entries = entries.filter(e => e.deliverable_id === filterDel);
  if (search) {
    const q = search.toLowerCase();
    entries = entries.filter(e =>
      (e.title || "").toLowerCase().includes(q) ||
      (e.body  || "").toLowerCase().includes(q) ||
      (e.tags  || []).some(t => t.toLowerCase().includes(q))
    );
  }

  // Group by day
  const byDay = {};
  for (const e of entries) {
    const day = e.created_at.slice(0, 10);
    if (!byDay[day]) byDay[day] = [];
    byDay[day].push(e);
  }
  for (const d in byDay) byDay[d].sort((a, b) => a.created_at.localeCompare(b.created_at));
  const days = Object.keys(byDay).sort().reverse().map(day => ({ day, entries: byDay[day] }));

  // Stats
  const totalHours = entries.reduce((s, e) => s + (e.hours || 0), 0);
  const uniqueContributors = new Set(entries.map(e => e.employee_id));
  const blockers = entries.filter(e => e.entry_type === "blocker");

  // Contributor list (only those who have entries on this project)
  const contributors = Array.from(new Set(allEntries.map(e => e.employee_id)))
    .map(id => DB.employeeById(id))
    .filter(Boolean);

  const projectDeliverables = DB.deliverables
    .filter(d => d.project_id === p.project_id && allEntries.some(e => e.deliverable_id === d.deliverable_id))
    .sort((a, b) => a.deliverable_code.localeCompare(b.deliverable_code));

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="kpi-grid">
        <KPI featured label="Total entries" icon="book" value={allEntries.length} foot={uniqueContributors.size + " contributors"}/>
        <KPI label="Hours logged" icon="clock" value={allEntries.reduce((s,e)=>s+(e.hours||0),0).toFixed(1)} unit="h"/>
        <KPI label="Blockers raised" icon="alertTri" value={allEntries.filter(e=>e.entry_type==="blocker").length} foot={blockers.filter(e => e.created_at.slice(0,10) >= new Date(DB.TODAY.getTime() - 7*86400000).toISOString().slice(0,10)).length + " in last 7 days"} deltaDir={blockers.length > 0 ? "down" : "up"}/>
        <KPI label="Meetings" icon="users" value={allEntries.filter(e=>e.entry_type==="meeting").length}/>
        <KPI label="Communications" icon="send" value={allEntries.filter(e=>e.entry_type==="comm").length}/>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: 12 }}>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <span className="muted tiny" style={{ marginRight: 4 }}>WHO</span>
          <button className={"chip" + (filterEmp === null ? " active" : "")} onClick={() => setFilterEmp(null)}>Everyone</button>
          {contributors.map(emp => (
            <button key={emp.employee_id} className={"chip" + (filterEmp === emp.employee_id ? " active" : "")} onClick={() => setFilterEmp(emp.employee_id)}>
              <Avatar employee={emp} size="sm"/>
              {emp.full_name.split(" ").slice(-1)[0]}
            </button>
          ))}
        </div>
        <div className="row" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          <span className="muted tiny" style={{ marginRight: 4 }}>TYPE</span>
          <button className={"chip" + (filterType === null ? " active" : "")} onClick={() => setFilterType(null)}>All types</button>
          {[
            { v: "work", l: "Work", c: "var(--accent)", i: "edit" },
            { v: "meeting", l: "Meetings", c: "var(--violet)", i: "users" },
            { v: "comm", l: "Comms", c: "var(--cyan)", i: "send" },
            { v: "blocker", l: "Blockers", c: "var(--red)", i: "alertTri" },
            { v: "note", l: "Notes", c: "var(--ink-3)", i: "fileText" },
          ].map(t => (
            <button key={t.v} className={"chip" + (filterType === t.v ? " active" : "")} onClick={() => setFilterType(t.v)}>
              <Ico name={t.i} size={11} color={t.c}/>{t.l}
            </button>
          ))}
        </div>
        {projectDeliverables.length > 0 && (
          <div className="row" style={{ gap: 8, marginTop: 8, flexWrap: "wrap" }}>
            <span className="muted tiny" style={{ marginRight: 4 }}>DELIVERABLE</span>
            <button className={"chip" + (filterDel === null ? " active" : "")} onClick={() => setFilterDel(null)}>Any</button>
            {projectDeliverables.map(d => (
              <button key={d.deliverable_id} className={"chip" + (filterDel === d.deliverable_id ? " active" : "")} onClick={() => setFilterDel(d.deliverable_id)}>
                <Ico name="fileText" size={11}/>{d.deliverable_code}
              </button>
            ))}
          </div>
        )}
        <div className="row" style={{ marginTop: 10, gap: 8 }}>
          <div className="row" style={{ gap: 8, flex: 1, padding: "7px 12px", background: "var(--surface-3)", borderRadius: 7 }}>
            <Ico name="search" size={13} color="var(--ink-4)"/>
            <input
              type="text"
              placeholder="Search entries…"
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
          <div className="muted tiny mono">
            {entries.length} of {allEntries.length} · {totalHours.toFixed(1)}h
          </div>
        </div>
      </div>

      {days.length === 0 ? (
        <Empty title="No log entries match" subtitle="Try clearing some filters above." icon="book"/>
      ) : (
        days.map(({ day, entries }) => {
          const date = new Date(day + "T12:00:00Z");
          const isToday = day === DB.TODAY.toISOString().slice(0, 10);
          const yesterdayStr = new Date(DB.TODAY.getTime() - 86400000).toISOString().slice(0, 10);
          const isYesterday = day === yesterdayStr;
          const dayLabel = isToday ? "Today" : isYesterday ? "Yesterday" :
            date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" });
          const dayHours = entries.reduce((s, e) => s + (e.hours || 0), 0);

          return (
            <div key={day} className="card flush">
              <div style={{
                padding: "10px 18px",
                borderBottom: "1px solid var(--line)",
                display: "flex", alignItems: "center", gap: 12,
                background: isToday ? "var(--accent-soft-2)" : "var(--surface-2)",
              }}>
                <div style={{ flex: 1 }}>
                  <div className="row" style={{ gap: 10 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 500, letterSpacing: "-0.015em", color: isToday ? "var(--accent)" : "var(--ink)" }}>{dayLabel}</span>
                    <span className="muted tiny mono">{day}</span>
                  </div>
                </div>
                <div className="muted tiny">
                  <b className="mono" style={{ color: "var(--ink-2)" }}>{dayHours.toFixed(1)}h</b> · {entries.length} entr{entries.length === 1 ? "y" : "ies"}
                </div>
              </div>
              <div style={{ padding: "4px 0" }}>
                {entries.map(e => {
                  const meta = {
                    work:    { c: "var(--accent)", i: "edit" },
                    meeting: { c: "var(--violet)", i: "users" },
                    comm:    { c: "var(--cyan)",   i: "send" },
                    note:    { c: "var(--ink-3)",  i: "fileText" },
                    blocker: { c: "var(--red)",    i: "alertTri" },
                  }[e.entry_type] || { c: "var(--ink-3)", i: "fileText" };
                  const emp = DB.employeeById(e.employee_id);
                  const del = e.deliverable_id ? DB.deliverableById(e.deliverable_id) : null;
                  return (
                    <div key={e.entry_id} style={{
                      padding: "10px 18px",
                      display: "grid",
                      gridTemplateColumns: "60px 24px 130px 1fr",
                      gap: 12,
                      alignItems: "flex-start",
                      borderBottom: "1px solid var(--line)",
                    }}>
                      <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", paddingTop: 3, textAlign: "right" }}>
                        {e.created_at.slice(11, 16)}
                      </div>
                      <div style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: meta.c + "1A",
                        color: meta.c,
                        display: "grid", placeItems: "center",
                        marginTop: 1,
                      }}>
                        <Ico name={meta.i} size={12}/>
                      </div>
                      <a href={`#/employees/${emp.employee_id}`}
                         style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--ink-2)", textDecoration: "none" }}>
                        <Avatar employee={emp} size="sm"/>
                        <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{emp.full_name.split(" ")[0]} {emp.full_name.split(" ").slice(-1)[0][0]}.</span>
                      </a>
                      <div style={{ minWidth: 0 }}>
                        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>{e.title}</span>
                          {e.hours != null && (
                            <span className="badge" style={{ background: "var(--surface-3)", color: "var(--ink-2)", fontSize: 10.5 }}>
                              <Ico name="clock" size={10}/>{e.hours}h
                            </span>
                          )}
                          {del && (
                            <a className="badge outline" href={`#/deliverables/${del.deliverable_id}`}
                               style={{ fontSize: 10.5, textDecoration: "none" }}>
                              <Ico name="fileText" size={10}/>{del.deliverable_code}
                            </a>
                          )}
                        </div>
                        {e.body && (
                          <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.5 }}>{e.body}</div>
                        )}
                        {(e.links?.length > 0 || e.tags?.length > 0) && (
                          <div className="row" style={{ gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                            {(e.links || []).map((l, i) => (
                              <a key={i} href={l.value}
                                 style={{ fontSize: 11, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                                <Ico name={l.kind === "email" ? "mail" : "link"} size={11}/>{l.label}
                              </a>
                            ))}
                            {(e.tags || []).map(t => (
                              <span key={t} style={{ fontSize: 10.5, color: "var(--ink-4)", background: "var(--surface-3)", padding: "1px 6px", borderRadius: 4 }}>
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// =========================================================
// Minutes of Meeting — list view
// Each meeting auto-creates log entries for attendees marked as present.
// =========================================================
function ProjectMinutes({ p }) {
  const meetings = DB.meetingsByProject(p.project_id);
  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="kpi-grid">
        <KPI featured label="Meetings logged" icon="users" value={meetings.length} foot="across this project" helpKey="daily-log"/>
        <KPI label="Total hours" icon="clock" value={meetings.reduce((s, m) => s + m.duration_minutes/60, 0).toFixed(1)} unit="h"/>
        <KPI label="Attendee entries" icon="zap" value={meetings.reduce((s, m) => s + m.attendees.filter(a => a.attendance !== "absent").length, 0)} foot="auto-logged to My Day"/>
        <KPI label="Open actions" icon="checkSquare" value={meetings.reduce((s, m) => s + m.actions.filter(a => a.status === "Open").length, 0)}/>
        <KPI label="Decisions" icon="check" value={meetings.reduce((s, m) => s + m.decisions.length, 0)}/>
      </div>

      <div className="card flush">
        <div className="table-head">
          <div className="table-head-l">
            <h3 className="card-title">Minutes of Meeting</h3>
            <div className="muted tiny">Attendees get an auto-logged entry in their My Day where they can add personal notes</div>
          </div>
          <button className="btn primary"><Ico name="plus" size={13}/>New meeting</button>
        </div>
        {meetings.length === 0 ? (
          <Empty title="No meetings yet" subtitle="Create the first meeting — attendees will see it auto-logged in their daily log." icon="users"/>
        ) : (
          <table className="data">
            <thead><tr>
              <th>Meeting</th>
              <th>Type</th>
              <th>Date / time</th>
              <th>Chair</th>
              <th>Attendance</th>
              <th className="num">Actions</th>
            </tr></thead>
            <tbody>
              {meetings.map(m => {
                const chair = DB.employeeById(m.chair_employee_id);
                const present = m.attendees.filter(a => a.attendance === "present").length;
                const total = m.attendees.length;
                const openActions = m.actions.filter(a => a.status === "Open").length;
                return (
                  <tr key={m.meeting_id} onClick={() => location.hash = `#/projects/${p.project_id}/minutes/${m.meeting_id}`}>
                    <td>
                      <div className="cell-strong">{m.title}</div>
                      <div className="cell-sub mono">{m.meeting_id}</div>
                    </td>
                    <td><span className="badge" style={{ background: "var(--violet-soft)", color: "var(--violet)", fontSize: 11 }}>{m.meeting_type}</span></td>
                    <td>
                      <div style={{ fontSize: 12.5 }}>{U.fmtDate(m.scheduled_at)}</div>
                      <div className="cell-sub mono">{m.scheduled_at.slice(11, 16)} · {m.duration_minutes}min</div>
                    </td>
                    <td>
                      <div className="row" style={{ gap: 6 }}>
                        <Avatar employee={chair} size="sm"/>
                        <span style={{ fontSize: 12.5 }}>{chair?.full_name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="row" style={{ gap: 8 }}>
                        <AvatarStack employees={m.attendees.filter(a => a.attendance === "present").map(a => DB.employeeById(a.employee_id))} size="sm" max={4}/>
                        <span className="mono tiny" style={{ color: "var(--ink-4)" }}>{present}/{total}</span>
                      </div>
                    </td>
                    <td className="num cell-num">
                      {openActions > 0
                        ? <span style={{ color: "var(--amber)" }}>{openActions} open</span>
                        : <span style={{ color: "var(--green)" }}>—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// =========================================================
// Single Meeting / MoM detail view
// Shows everything about a single meeting — agenda, attendees, notes,
// decisions, actions — plus the personal-notes preview from each attendee
// who has filled them in via their daily log.
// =========================================================
function ProjectMeetingDetail({ p, meetingId }) {
  const m = DB.meetingById(meetingId);
  if (!m) {
    return (
      <Empty title="Meeting not found" subtitle="This MoM may have been deleted." icon="users" action={
        <a className="btn" href={`#/projects/${p.project_id}/minutes`}><Ico name="arrLeft" size={13}/>Back to minutes</a>
      }/>
    );
  }
  const chair = DB.employeeById(m.chair_employee_id);

  // Personal notes from attendees who've added their own log entries
  const attendeeNotes = DB.dailyLogEntries.filter(e => e.meeting_id === meetingId);

  return (
    <div className="col" style={{ gap: 16 }}>
      <div className="row" style={{ justifyContent: "space-between" }}>
        <a className="btn sm" href={`#/projects/${p.project_id}/minutes`}><Ico name="arrLeft" size={11}/>All minutes</a>
        <div className="row" style={{ gap: 8 }}>
          <button className="btn sm"><Ico name="download" size={12}/>Export PDF</button>
          <button className="btn sm"><Ico name="send" size={12}/>Send to attendees</button>
          <button className="btn sm"><Ico name="edit" size={12}/>Edit</button>
        </div>
      </div>

      <div className="card" style={{ borderLeft: "3px solid var(--violet)" }}>
        <div className="row" style={{ gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 9, background: "var(--violet)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Ico name="users" size={18}/>
          </div>
          <div style={{ flex: 1 }}>
            <div className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>{m.meeting_type} · {m.meeting_id}</div>
            <h2 style={{ margin: "2px 0 6px", fontSize: 20, fontWeight: 500, letterSpacing: "-0.025em" }}>{m.title}</h2>
            <div className="muted" style={{ fontSize: 12.5 }}>
              {U.fmtDate(m.scheduled_at)} · {m.scheduled_at.slice(11, 16)} · {m.duration_minutes}min · {m.location}
            </div>
            <div className="row" style={{ gap: 6, marginTop: 8 }}>
              <span className="muted tiny">Chaired by</span>
              <Avatar employee={chair} size="sm"/>
              <span style={{ fontSize: 12.5 }}>{chair?.full_name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        {/* LEFT: agenda, notes, decisions, actions */}
        <div className="col" style={{ gap: 16 }}>
          {m.agenda.length > 0 && (
            <div className="card">
              <CardH title="Agenda"/>
              <ol style={{ margin: 0, padding: "0 0 0 20px", fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>
                {m.agenda.map((item, i) => <li key={i}>{item}</li>)}
              </ol>
            </div>
          )}

          {m.notes && (
            <div className="card">
              <CardH title="Notes / discussion summary"/>
              <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{m.notes}</div>
            </div>
          )}

          {m.decisions.length > 0 && (
            <div className="card">
              <CardH title={`Decisions (${m.decisions.length})`}/>
              <div className="col" style={{ gap: 8 }}>
                {m.decisions.map(d => {
                  const owner = DB.employeeById(d.owner);
                  return (
                    <div key={d.id} className="row" style={{ gap: 10, padding: 10, background: "var(--green-soft)", borderRadius: 6, borderLeft: "3px solid var(--green)" }}>
                      <Ico name="check" size={13} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }}/>
                      <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5 }}>
                        <div style={{ color: "var(--ink-2)" }}>{d.text}</div>
                        {owner && <div className="muted tiny" style={{ marginTop: 3 }}>Owner: {owner.full_name}{d.due ? ` · due ${U.fmtDate(d.due)}` : ""}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {m.actions.length > 0 && (
            <div className="card">
              <CardH title={`Action items (${m.actions.length})`}/>
              <div className="col" style={{ gap: 8 }}>
                {m.actions.map(a => {
                  const owner = DB.employeeById(a.owner);
                  const overdue = a.due && a.status === "Open" && a.due < DB.TODAY.toISOString().slice(0,10);
                  return (
                    <div key={a.id} className="row" style={{ gap: 10, padding: 10, background: a.status === "Done" ? "var(--surface-2)" : (overdue ? "var(--red-soft)" : "var(--amber-soft)"), borderRadius: 6, borderLeft: "3px solid " + (a.status === "Done" ? "var(--green)" : overdue ? "var(--red)" : "var(--amber)") }}>
                      <Ico name={a.status === "Done" ? "checkCircle" : "circle"} size={13} color={a.status === "Done" ? "var(--green)" : overdue ? "var(--red)" : "var(--amber)"} style={{ marginTop: 2, flexShrink: 0 }}/>
                      <div style={{ flex: 1, fontSize: 12.5, lineHeight: 1.5 }}>
                        <div style={{ color: "var(--ink-2)", textDecoration: a.status === "Done" ? "line-through" : "none", opacity: a.status === "Done" ? 0.7 : 1 }}>{a.text}</div>
                        {owner && <div className="muted tiny" style={{ marginTop: 3 }}>Owner: {owner.full_name}{a.due ? ` · due ${U.fmtDate(a.due)}` : ""}</div>}
                      </div>
                      <span className="badge" style={{ fontSize: 10, background: a.status === "Done" ? "var(--green)" : overdue ? "var(--red)" : "var(--amber)", color: "#fff" }}>{a.status === "Done" ? "Done" : overdue ? "Overdue" : "Open"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: attendees + their personal notes */}
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <CardH title={`Attendees (${m.attendees.length})`} subtitle="Auto-logs to each present attendee's My Day"/>
            <div className="col" style={{ gap: 8 }}>
              {m.attendees.map(a => {
                const emp = DB.employeeById(a.employee_id);
                if (!emp) return null;
                const hasNotes = attendeeNotes.find(n => n.employee_id === a.employee_id);
                const status = a.attendance;
                return (
                  <div key={a.employee_id} className="row" style={{ gap: 10, padding: 8, background: "var(--surface-2)", borderRadius: 6 }}>
                    <Avatar employee={emp} size="md"/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row" style={{ gap: 6 }}>
                        <span style={{ fontSize: 12.5, fontWeight: 500 }}>{emp.full_name}</span>
                        {a.role && <span className="muted tiny">· {a.role}</span>}
                      </div>
                      <div className="row" style={{ gap: 6, marginTop: 3 }}>
                        <span className="badge" style={{ fontSize: 9.5, background: status === "present" ? "var(--green)" : status === "apologies" ? "var(--amber)" : "var(--ink-5)", color: "#fff" }}>
                          {status === "present" ? "Present" : status === "apologies" ? "Apologies" : "Absent"}
                        </span>
                        {status === "present" && (
                          hasNotes ? (
                            <span className="badge" style={{ fontSize: 9.5, background: "var(--accent-soft)", color: "var(--accent)" }}>
                              <Ico name="check" size={9}/>Notes added
                            </span>
                          ) : (
                            <span className="muted tiny">Auto-logged · awaiting personal notes</span>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {attendeeNotes.length > 0 && (
            <div className="card">
              <CardH title={`Attendee notes (${attendeeNotes.length})`} subtitle="Personal observations from attendees' daily logs"/>
              <div className="col" style={{ gap: 10 }}>
                {attendeeNotes.map(n => {
                  const emp = DB.employeeById(n.employee_id);
                  return (
                    <div key={n.entry_id} className="row" style={{ gap: 10, padding: 8, background: "var(--surface-2)", borderRadius: 6, alignItems: "flex-start" }}>
                      <Avatar employee={emp} size="sm"/>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="row" style={{ gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{emp?.full_name}</span>
                          <span className="muted tiny mono">· {U.fmtDate(n.created_at)}</span>
                        </div>
                        {n.body && <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.5 }}>{n.body}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenProjectDetail, RisksView, ChangesView, ApprovalsView, GanttView });