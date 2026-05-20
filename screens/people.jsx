// ============================================
// Atlas — Screens 7, 8 & 9
//   Employees list · Employee profile · Resource calendar
// ============================================

function ScreenEmployees() {
  const [search, setSearch] = React.useState("");
  const [disc, setDisc]     = React.useState("All");
  const [seniority, setSen] = React.useState("All");
  const [view, setView]     = React.useState("cards");
  const [createOpen, setCreateOpen] = React.useState(false);

  const disciplines = ["All", ...Array.from(new Set(DB.employees.map(e => e.discipline)))];
  const seniorities = ["All","Principal","Lead","Senior","Mid","Junior"];

  const filtered = DB.employees.filter(e => {
    if (disc !== "All" && e.discipline !== disc) return false;
    if (seniority !== "All" && e.seniority_level !== seniority) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(e.full_name + " " + e.job_title + " " + e.skills.join(" ")).toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="People"
        title="Employees"
        subtitle={`${filtered.length} of ${DB.employees.length} engineers — find by discipline, seniority, or skill.`}
        actions={
          <>
            <button className="btn"><Ico name="upload" size={13}/>Import vCard</button>
            <button className="btn primary" onClick={() => setCreateOpen(true)} data-no-toast><Ico name="plus" size={13}/>Add employee</button>
          </>
        }
      />

      <FilterBar
        chips={disciplines.map(d => ({ value: d, label: d, count: d === "All" ? DB.employees.length : DB.employees.filter(e => e.discipline === d).length }))}
        value={disc} onChange={setDisc}
        search={search} onSearch={setSearch}
        searchPlaceholder="Search by name, role, skill..."
        right={
          <>
            <select className="btn" value={seniority} onChange={e => setSen(e.target.value)}>
              {seniorities.map(s => <option key={s}>{s === "All" ? "All levels" : s}</option>)}
            </select>
            <div className="row" style={{ gap: 2, marginLeft: 4, background: "var(--surface-3)", borderRadius: 7, padding: 2 }}>
              <button className="icon-btn" onClick={() => setView("cards")} style={{ width: 28, height: 28, background: view === "cards" ? "var(--surface)" : "transparent" }}><Ico name="cards" size={14}/></button>
              <button className="icon-btn" onClick={() => setView("table")} style={{ width: 28, height: 28, background: view === "table" ? "var(--surface)" : "transparent" }}><Ico name="list" size={14}/></button>
            </div>
          </>
        }
      />

      {view === "cards" ? (
        <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          {filtered.map(e => {
            const projectsOn = DB.assignments.filter(a => a.employee_id === e.employee_id);
            const allocation = projectsOn.reduce((s,a)=>s+a.allocation_pct,0);
            return (
              <div key={e.employee_id} className="card" style={{ cursor:"pointer" }} onClick={() => navTo("employees/" + e.employee_id)}>
                <div className="row" style={{ gap: 10, marginBottom: 12 }}>
                  <Avatar employee={e} size="lg"/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: 13.5 }}>{e.full_name}</div>
                    <div className="muted tiny">{e.job_title}</div>
                  </div>
                  <span className="badge outline" style={{ fontSize: 10 }}>{e.seniority_level}</span>
                </div>
                <div className="row" style={{ gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  <span className="badge" style={{ background: (U.disciplineColors[e.discipline] || "#666") + "22", color: U.disciplineColors[e.discipline] || "var(--ink-3)", fontSize: 10 }}>{e.discipline}</span>
                  <span className="muted tiny" style={{ marginLeft: "auto" }}>${e.hourly_rate}/h</span>
                </div>
                <div className="row" style={{ gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                  {e.skills.slice(0,3).map(s => <span key={s} className="badge neutral" style={{ fontSize: 10 }}>{s}</span>)}
                  {e.skills.length > 3 && <span className="muted tiny">+{e.skills.length-3}</span>}
                </div>
                <div className="divider"/>
                <div style={{ marginTop: 10 }}>
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="muted xs" style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}>Utilization</span>
                    <span className="mono tiny" style={{ color: allocation > 100 ? "var(--red)" : allocation > 80 ? "var(--amber)" : "var(--ink-3)" }}>{allocation}%</span>
                  </div>
                  <div className="progress" style={{ height: 5 }}><span style={{ width: Math.min(100, allocation) + "%", background: allocation > 100 ? "var(--red)" : allocation > 80 ? "var(--amber)" : "var(--accent)" }}/></div>
                  <div className="muted tiny" style={{ marginTop: 6 }}>{projectsOn.length} active project{projectsOn.length !== 1 ? "s" : ""}</div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card flush">
          <table className="data">
            <thead><tr><th>Name</th><th>Role</th><th>Discipline</th><th>Level</th><th className="num">Rate</th><th>Utilization</th><th>Projects</th><th>Location</th></tr></thead>
            <tbody>
              {filtered.map(e => {
                const projs = DB.assignments.filter(a => a.employee_id === e.employee_id);
                const alloc = projs.reduce((s,a)=>s+a.allocation_pct,0);
                return (
                  <tr key={e.employee_id} onClick={() => navTo("employees/" + e.employee_id)}>
                    <td>
                      <div className="row" style={{ gap: 10 }}>
                        <Avatar employee={e}/>
                        <div>
                          <div className="cell-strong">{e.full_name}</div>
                          <div className="cell-sub mono">{e.employee_code}</div>
                        </div>
                      </div>
                    </td>
                    <td>{e.job_title}</td>
                    <td><span className="badge" style={{ background: (U.disciplineColors[e.discipline] || "#666") + "22", color: U.disciplineColors[e.discipline], fontSize: 10 }}>{e.discipline}</span></td>
                    <td><span className="badge outline" style={{ fontSize: 10 }}>{e.seniority_level}</span></td>
                    <td className="num cell-num">${e.hourly_rate}</td>
                    <td style={{ width: 160 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <div className="progress" style={{ flex: 1, height: 6 }}><span style={{ width: Math.min(100,alloc) + "%", background: alloc > 100 ? "var(--red)" : alloc > 80 ? "var(--amber)" : "var(--accent)" }}/></div>
                        <span className="mono tiny" style={{ width: 32, textAlign:"right" }}>{alloc}%</span>
                      </div>
                    </td>
                    <td><span className="mono tiny">{projs.length}</span></td>
                    <td>{e.location}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {createOpen && <CreateRecordModal
        title="Add employee"
        subtitle="Add a new engineer to the directory. They'll be invited via Microsoft Entra ID and appear in the resource planner."
        submitLabel="Add to directory"
        onClose={() => setCreateOpen(false)}
        fields={[
          { name: "first", label: "First name", required: true, placeholder: "Anders" },
          { name: "last",  label: "Last name",  required: true, placeholder: "Vestergaard" },
          { name: "email", label: "Email", type: "email", required: true, span: 2, placeholder: "anders.vestergaard@helix.eng" },
          { name: "discipline", label: "Discipline", type: "select", required: true, options: DB.disciplineNames, default: "Mechanical" },
          { name: "seniority", label: "Seniority", type: "select", options: ["Junior","Mid","Senior","Lead","Principal"], default: "Mid" },
          { name: "role", label: "Job title", required: true, placeholder: "Mechanical Engineer" },
          { name: "rate", label: "Hourly rate ($)", type: "number", placeholder: "85" },
          { name: "location", label: "Location", type: "select", options: ["Doha","Aarhus","Copenhagen","London","Dubai"], default: "Doha" },
          { name: "capacity", label: "Weekly capacity (h)", type: "number", default: 40 },
        ]}
      />}
    </div>
  );
}
// ============================================
// Screen 8: Employee profile
// ============================================
function ScreenEmployeeDetail({ employeeId }) {
  const e = DB.employeeById(employeeId);
  const [tab, setTab] = React.useState("projects");
  if (!e) return <div className="content" data-tour-id="page"><Empty title="Employee not found" action={<a className="btn" href="#/employees">Back</a>}/></div>;

  const projectsOn = DB.assignments.filter(a => a.employee_id === e.employee_id);
  const allocation = projectsOn.reduce((s,a)=>s+a.allocation_pct,0);
  const deliverablesOwned = DB.deliverables.filter(d => d.owner_employee_id === e.employee_id);

  // synthetic utilization over 12 weeks
  const utilHistory = [72,78,80,86,90,88,92,94,96,98,allocation,allocation];

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        crumb={[{ label: "Employees", onClick: () => navTo("employees") }, { label: e.full_name }]}
        title=""
        subtitle=""
      />

      {/* Header card */}
      <div className="card" style={{ padding: 22 }}>
        <div className="row" style={{ gap: 22, alignItems: "flex-start" }}>
          <Avatar employee={e} size="xl"/>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 500, letterSpacing: "-0.025em", margin: 0 }}>{e.full_name}</h1>
            <div className="row" style={{ gap: 10, marginTop: 4, color: "var(--ink-3)", fontSize: 13 }}>
              <span>{e.job_title}</span>
              <span className="muted">·</span>
              <span className="badge" style={{ background: (U.disciplineColors[e.discipline] || "#666") + "22", color: U.disciplineColors[e.discipline], fontSize: 11 }}>{e.discipline}</span>
              <span className="muted">·</span>
              <span className="badge outline" style={{ fontSize: 11 }}>{e.seniority_level}</span>
            </div>
            <div className="row" style={{ gap: 18, marginTop: 14, fontSize: 12.5, color: "var(--ink-3)", flexWrap: "wrap" }}>
              <div className="row" style={{ gap: 6 }}><Ico name="at" size={13}/>{e.email}</div>
              <div className="row" style={{ gap: 6 }}><Ico name="mapPin" size={13}/>{e.location}</div>
              <div className="row" style={{ gap: 6 }}><Ico name="dollar" size={13}/>${e.hourly_rate}/hour</div>
              <div className="row" style={{ gap: 6 }}><Ico name="clock" size={13}/>{e.capacity_hours}h/week capacity</div>
            </div>
          </div>

          <div className="row" style={{ gap: 8 }}>
            <button className="btn"><Ico name="message" size={13}/>Message</button>
            <button className="btn"><Ico name="calendar" size={13}/>Assign</button>
            <button className="btn"><Ico name="more" size={14}/></button>
          </div>
        </div>

        <div className="kpi-grid" style={{ marginTop: 20 }}>
          <KPI label="Current utilization" icon="activity" value={allocation + "%"} foot={allocation > 100 ? "OVER capacity" : "of capacity"} deltaDir={allocation > 100 ? "down" : "up"}/>
          <KPI label="Active projects" icon="folder" value={projectsOn.length}/>
          <KPI label="Deliverables owned" icon="layers" value={deliverablesOwned.length} foot={deliverablesOwned.filter(d => d.status === "Approved").length + " approved"}/>
          <KPI label="YTD hours" icon="clock" value="1,284" foot="62% of YTD capacity"/>
          <KPI label="Rate / fee" icon="dollar" value={"$" + e.hourly_rate} unit="/h" foot={`Fee factor 2.75× · $${(e.hourly_rate*2.75).toFixed(0)} effective`}/>
        </div>
      </div>

      <Tabs
        active={tab} onChange={setTab}
        tabs={[
          { value: "projects",     label: "Projects",     icon: "folder", count: projectsOn.length },
          { value: "skills",       label: "Skills",       icon: "tools" },
          { value: "calendar",     label: "Calendar",     icon: "calendar" },
          { value: "availability", label: "Availability", icon: "activity" },
          { value: "timesheets",   label: "Timesheets",   icon: "clock" },
        ]}
      />

      {tab === "projects" && (
        <div className="card flush">
          <div className="table-head">
            <div className="table-head-l">
              <h3 className="card-title">Current assignments</h3>
              <div className="muted tiny">{projectsOn.length} projects · {allocation}% total allocation</div>
            </div>
            <button className="btn primary sm"><Ico name="plus" size={12}/>Assign to project</button>
          </div>
          <table className="data">
            <thead><tr><th>Project</th><th>Role</th><th>Discipline</th><th>Allocation</th><th>Period</th><th>Hours YTD</th></tr></thead>
            <tbody>
              {projectsOn.map(a => {
                const p = DB.projectById(a.project_id);
                return (
                  <tr key={a.project_id} onClick={() => navTo("projects/" + p.project_id)}>
                    <td>
                      <div className="cell-strong">{p.project_name}</div>
                      <div className="cell-sub mono">{p.project_code} · {p.client}</div>
                    </td>
                    <td>{a.role_on_project}</td>
                    <td><span className="badge outline" style={{ fontSize: 10 }}>{a.discipline}</span></td>
                    <td style={{ width: 160 }}><ProgressWithLabel value={a.allocation_pct}/></td>
                    <td><span className="mono tiny">{U.fmtDate(a.start_date)} – {U.fmtDate(a.end_date)}</span></td>
                    <td className="cell-num">{Math.round(a.allocation_pct * 0.4 * 32)}h</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "skills" && (
        <div className="grid" style={{ gridTemplateColumns: "1.5fr 1fr" }}>
          <div className="card">
            <CardH title="Skills & expertise"/>
            <div className="col" style={{ gap: 10 }}>
              {e.skills.map((s, i) => {
                const level = 90 - i*8 - (i%2)*7;
                return (
                  <div key={s} className="row" style={{ gap: 10 }}>
                    <span style={{ width: 180, fontSize: 12.5 }}>{s}</span>
                    <div className="progress" style={{ flex: 1, height: 6 }}><span style={{ width: level + "%", background: "var(--accent)" }}/></div>
                    <span className="mono tiny" style={{ width: 32, textAlign: "right" }}>{level}%</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card">
            <CardH title="Certifications"/>
            {["IChemE Chartered", "PMP", "ISO 9001 Lead Auditor", "OSHA 30"].map((c, i) => (
              <div key={c} className="row" style={{ padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--line)" : null, gap: 10 }}>
                <Ico name="checkCircle" size={16} color="var(--green)"/>
                <div style={{ flex: 1, fontSize: 13 }}>{c}</div>
                <span className="muted tiny mono">2024-{(i+1)*3}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "calendar" && (
        <div className="card">
          <CardH title="Forward calendar" subtitle="Next 14 weeks"/>
          <EmployeeWeekStrip employeeId={employeeId}/>
        </div>
      )}

      {tab === "availability" && (
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <div className="card">
            <CardH title="Utilization trend" subtitle="12-week rolling"/>
            <Bars w={500} h={120} barW={28} gap={6} values={utilHistory}
                  labels={Array.from({length:12}, (_,i)=>"W"+(9+i))}
                  colors={utilHistory.map(v => v > 100 ? "var(--red)" : v > 80 ? "var(--amber)" : "var(--accent)")}/>
            <div className="muted tiny" style={{ marginTop: 8 }}>
              {e.full_name.split(" ")[0]} has averaged 88% utilization over the last 12 weeks · slightly above the 80% target.
            </div>
          </div>
          <div className="card">
            <CardH title="Time off & exceptions"/>
            {[
              { date: "2026-06-22 → 2026-07-03", reason: "Annual leave", type: "leave", days: 10 },
              { date: "2026-08-15", reason: "Public holiday — Indep. Day", type: "holiday", days: 1 },
              { date: "2026-05-28", reason: "Training — STAAD masterclass", type: "training", days: 1 },
            ].map((t, i) => (
              <div key={i} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)", gap: 10 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: t.type === "leave" ? "var(--blue-soft)" : t.type === "holiday" ? "var(--violet-soft)" : "var(--green-soft)", color: t.type === "leave" ? "var(--blue)" : t.type === "holiday" ? "var(--violet)" : "var(--green)", display: "grid", placeItems: "center" }}>
                  <Ico name="calendar" size={13}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t.reason}</div>
                  <div className="muted tiny">{t.date}</div>
                </div>
                <span className="mono tiny">{t.days}d</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "timesheets" && (
        <div className="card flush">
          <div className="table-head">
            <div className="table-head-l">
              <h3 className="card-title">Timesheets</h3>
              <div className="muted tiny">Last 8 weeks</div>
            </div>
            <button className="btn sm"><Ico name="download" size={12}/>Export</button>
          </div>
          <table className="data">
            <thead><tr><th>Week</th><th>Project</th><th className="num">Hours</th><th className="num">Cost</th><th>Status</th></tr></thead>
            <tbody>
              {Array.from({length:8}).map((_, i) => {
                const wk = 13 + i;
                const proj = projectsOn[i % Math.max(1, projectsOn.length)] || projectsOn[0];
                const p = proj ? DB.projectById(proj.project_id) : DB.projects[0];
                const hrs = Math.round(38 + (i%3)*2);
                return (
                  <tr key={i}>
                    <td>W{wk} · 2026</td>
                    <td>
                      <div className="cell-strong">{p.project_name}</div>
                      <div className="cell-sub mono">{p.project_code}</div>
                    </td>
                    <td className="num cell-num">{hrs}h</td>
                    <td className="num cell-num">${(hrs * e.hourly_rate).toLocaleString()}</td>
                    <td><Status value={i < 6 ? "Approved" : i === 6 ? "In Review" : "Draft"}/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EmployeeWeekStrip({ employeeId }) {
  const allocs = DB.allocations.filter(a => a.employee_id === employeeId);
  const weeks = DB.planningWeeks;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${weeks.length}, 1fr)`, gap: 4 }}>
      {weeks.map(w => {
        const total = allocs.filter(a => a.week_index === w.index).reduce((s,a)=> s + (a.planned_hours || 0), 0);
        const pct = Math.min(120, (total/40)*100);
        const color = pct > 100 ? "var(--red)" : pct > 80 ? "var(--amber)" : "var(--accent)";
        return (
          <div key={w.index} style={{ background: "var(--surface-2)", borderRadius: 8, padding: 10, border: w.isCurrent ? "1px solid var(--accent)" : "1px solid var(--line)", textAlign:"center" }}>
            <div className="muted tiny" style={{ textTransform:"uppercase", letterSpacing:"0.06em" }}>{w.label}</div>
            <div style={{ fontSize: 18, fontWeight: 500, color, marginTop: 4 }}>{total}h</div>
            <div className="progress" style={{ height: 4, marginTop: 6 }}><span style={{ width: Math.min(100,pct) + "%", background: color }}/></div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================
// Screen 9: Resource Planning Calendar
// ============================================
function ScreenCalendar() {
  const [granularity, setGranularity] = React.useState("Week");
  const [filterDisc, setFilterDisc]   = React.useState("All");
  const [assignOpen, setAssignOpen]   = React.useState(false);
  const [filterOpen, setFilterOpen]   = React.useState(false);
  const weeks = DB.planningWeeks;

  // Build per-employee weekly totals
  const emps = DB.employees.filter(e => filterDisc === "All" || e.discipline === filterDisc);
  function totalForEmp(empId, weekIdx) {
    return DB.allocations
      .filter(a => a.employee_id === empId && a.week_index === weekIdx)
      .reduce((s,a) => s + (a.planned_hours || 0), 0);
  }
  function projectsForEmp(empId, weekIdx) {
    return DB.allocations
      .filter(a => a.employee_id === empId && a.week_index === weekIdx && a.planned_hours > 0)
      .map(a => DB.projectById(a.project_id));
  }

  // Filter to people who actually have allocations (otherwise the grid is full of empty rows)
  const empsWithAlloc = emps.filter(e => weeks.some(w => totalForEmp(e.employee_id, w.index) > 0));

  const disciplines = ["All", ...Array.from(new Set(DB.employees.map(e => e.discipline)))];
  const colWidth = 80;

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Plan"
        title="Resource planning"
        subtitle="14-week rolling capacity view. Drag a bar to reallocate, or click a cell to edit hours."
        actions={
          <>
            <div className="chips">
              {["Day","Week","Month"].map(g => (
                <button key={g} className={"chip" + (granularity === g ? " active" : "")} onClick={() => setGranularity(g)}>{g}</button>
              ))}
            </div>
            <button className="btn" onClick={() => setFilterOpen(true)} data-no-toast><Ico name="filter" size={13}/>Filters</button>
            <button className="btn primary" onClick={() => setAssignOpen(true)} data-no-toast><Ico name="plus" size={13}/>Assign</button>
          </>
        }
      />

      {/* KPIs */}
      <div className="kpi-grid">
        <KPI label="Engineers loaded" icon="users" value={empsWithAlloc.length}/>
        <KPI label="Total planned hrs (wk 20)" icon="clock" value={empsWithAlloc.reduce((s,e)=>s+totalForEmp(e.employee_id, 5), 0).toLocaleString()}/>
        <KPI label="Avg utilization" icon="activity" value="84%" delta="+3 vs target" deltaDir="up"/>
        <KPI label="Over-allocated" icon="alertTri" value={empsWithAlloc.filter(e => totalForEmp(e.employee_id,5) > 40).length} delta="needs reshuffling" deltaDir="down"/>
        <KPI label="Holiday conflicts" icon="alertCirc" value={2} foot="next 4 weeks"/>
      </div>

      {/* Legend + filters */}
      <FilterBar
        chips={disciplines.map(d => ({ value: d, label: d, count: d === "All" ? DB.employees.length : DB.employees.filter(e=>e.discipline===d).length }))}
        value={filterDisc} onChange={setFilterDisc}
        right={
          <div className="row" style={{ gap: 12, fontSize: 11, color: "var(--ink-3)" }}>
            <span className="row" style={{gap: 5}}><span style={{width:10, height:10, borderRadius:2, background:"var(--accent)"}}/>Allocated</span>
            <span className="row" style={{gap: 5}}><span style={{width:10, height:10, borderRadius:2, background:"var(--amber)"}}/>Near capacity</span>
            <span className="row" style={{gap: 5}}><span style={{width:10, height:10, borderRadius:2, background:"var(--red)"}}/>Over-allocated</span>
            <span className="row" style={{gap: 5}}><span style={{width:10, height:10, borderRadius:2, background:"var(--ink-5)"}}/>Available</span>
          </div>
        }
      />

      <div className="card flush" style={{ overflowX: "auto" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: `240px repeat(${weeks.length}, ${colWidth}px)`, background: "var(--surface-2)", borderBottom: "1px solid var(--line)", position: "sticky", top: 0 }}>
          <div style={{ padding: "10px 14px", fontSize: 11, color: "var(--ink-4)", letterSpacing: "0.1em", textTransform: "uppercase", borderRight: "1px solid var(--line)" }}>Engineer</div>
          {weeks.map(w => (
            <div key={w.index} style={{ padding: "8px 4px", fontSize: 10.5, textAlign: "center", borderRight: "1px solid var(--line)", color: w.isCurrent ? "var(--accent)" : "var(--ink-4)", background: w.isCurrent ? "var(--accent-soft-2)" : null }}>
              <div style={{ fontWeight: w.isCurrent ? 600 : 400 }}>{w.label}</div>
              <div className="mono" style={{ fontSize: 9 }}>{U.fmtDate(w.start, "short").slice(0,5)}</div>
            </div>
          ))}
        </div>
        {empsWithAlloc.map(e => (
          <div key={e.employee_id} style={{ display: "grid", gridTemplateColumns: `240px repeat(${weeks.length}, ${colWidth}px)`, borderBottom: "1px solid var(--line)" }}>
            <div style={{ padding: "8px 14px", background: "var(--surface-2)", borderRight: "1px solid var(--line)", cursor: "pointer" }} onClick={() => navTo("employees/" + e.employee_id)}>
              <div className="row" style={{ gap: 8 }}>
                <Avatar employee={e} size="sm"/>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.full_name}</div>
                  <div className="muted tiny">{e.discipline} · {e.seniority_level}</div>
                </div>
              </div>
            </div>
            {weeks.map(w => {
              const total = totalForEmp(e.employee_id, w.index);
              const pct = (total / 40) * 100;
              const color = pct > 100 ? "var(--red)" : pct > 80 ? "var(--amber)" : pct > 0 ? "var(--accent)" : "transparent";
              const projs = projectsForEmp(e.employee_id, w.index);
              return (
                <div key={w.index} style={{ borderRight: "1px solid var(--line)", padding: 6, background: w.isCurrent ? "rgba(37,99,235,0.04)" : null, cursor: "pointer", minHeight: 56 }}
                     title={`${total}h planned${projs.length ? ' — ' + projs.map(p=>p.project_code).join(', ') : ""}`}>
                  {total > 0 && (
                    <div style={{ background: color, color: "#fff", borderRadius: 4, padding: "3px 6px", fontSize: 10.5, fontFamily: "var(--font-mono)", textAlign: "center" }}>
                      {total}h
                    </div>
                  )}
                  {projs.length > 0 && (
                    <div style={{ display: "flex", gap: 1, marginTop: 3 }}>
                      {projs.slice(0,3).map((p, i) => (
                        <div key={i} style={{ flex: 1, height: 4, background: U.disciplineColors[p.project_type] || "var(--ink-4)", borderRadius: 1 }} title={p.project_code}/>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="card" style={{ borderLeft: "3px solid var(--red)" }}>
        <div className="row" style={{ gap: 10, marginBottom: 6 }}>
          <Ico name="alertTri" size={16} color="var(--red)"/>
          <span style={{ fontWeight: 500 }}>Over-allocation detected</span>
        </div>
        <div className="muted" style={{ fontSize: 13 }}>
          2 engineers exceed 100% allocation in W21–W22. Suggestion: shift Yusuf Korkmaz (Mech, 120%) partially to EXP-204, or bring forward Carlos Mendes (Struct, 88% capacity headroom).
        </div>
        <div className="row" style={{ gap: 8, marginTop: 10 }}>
          <button className="btn sm">Auto-balance</button>
          <button className="btn sm">Open scenarios</button>
        </div>
      </div>

      {assignOpen && <AssignModal onClose={() => setAssignOpen(false)}/>}
      {filterOpen && <CalendarFilterModal onClose={() => setFilterOpen(false)} disciplines={disciplines}/>}
      {/* Add employee modal (only rendered on Employees screen, but exported here for reuse) */}
    </div>
  );
}

function AssignModal({ onClose }) {
  const [form, setForm] = React.useState({
    employee_id: "EMP-014",
    project_id:  "P-001",
    discipline:  "Mechanical",
    role:        "Stress Analyst",
    allocation:  60,
    start:       "2026-05-25",
    end:         "2026-08-15",
  });
  function up(k,v) { setForm(f => ({...f, [k]: v })); }
  const emp  = DB.employeeById(form.employee_id);
  const proj = DB.projectById(form.project_id);

  return (
    <Modal title="Assign engineer to project" onClose={onClose} width={620}
           footer={<>
             <button className="btn" onClick={onClose}>Cancel</button>
             <button className="btn primary" onClick={onClose}><Ico name="check" size={13}/>Assign</button>
           </>}>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field">
          <label>Engineer</label>
          <select value={form.employee_id} onChange={e => up("employee_id", e.target.value)}>
            {DB.employees.map(e => <option key={e.employee_id} value={e.employee_id}>{e.full_name} — {e.discipline}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Project</label>
          <select value={form.project_id} onChange={e => up("project_id", e.target.value)}>
            {DB.projects.map(p => <option key={p.project_id} value={p.project_id}>{p.project_code} — {p.project_name.slice(0,30)}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Discipline on project</label>
          <select value={form.discipline} onChange={e => up("discipline", e.target.value)}>
            {DB.disciplineNames.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Role on project</label>
          <input value={form.role} onChange={e => up("role", e.target.value)}/>
        </div>
        <div className="field">
          <label>Allocation (%)</label>
          <input type="number" min="0" max="200" value={form.allocation} onChange={e => up("allocation", e.target.value)}/>
        </div>
        <div className="field">
          <label>Hours/week</label>
          <input value={(form.allocation/100*40).toFixed(0) + "h"} disabled/>
        </div>
        <div className="field">
          <label>Start date</label>
          <input type="date" value={form.start} onChange={e => up("start", e.target.value)}/>
        </div>
        <div className="field">
          <label>End date</label>
          <input type="date" value={form.end} onChange={e => up("end", e.target.value)}/>
        </div>
      </div>
      <div style={{ marginTop: 16, padding: 12, background: "var(--surface-2)", borderRadius: 8 }}>
        <div className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Impact preview</div>
        <div className="row" style={{ justifyContent: "space-between", fontSize: 13 }}>
          <span>{emp.full_name} — combined utilization</span>
          <span className="mono" style={{ color: form.allocation > 50 ? "var(--amber)" : "var(--green)" }}>{form.allocation}% → projected {Math.min(120, 60+Number(form.allocation))}%</span>
        </div>
        <div className="row" style={{ justifyContent: "space-between", fontSize: 13, marginTop: 6 }}>
          <span>Estimated cost ({proj.project_code})</span>
          <span className="mono">${Math.round(emp.hourly_rate * form.allocation/100 * 40 * 12).toLocaleString()} / 12 weeks</span>
        </div>
      </div>
    </Modal>
  );
}

function CalendarFilterModal({ onClose, disciplines }) {
  return (
    <Modal title="Filter calendar" onClose={onClose} width={480}
           footer={<>
             <button className="btn" onClick={onClose}>Reset</button>
             <button className="btn primary" onClick={onClose}>Apply filters</button>
           </>}>
      <div className="col" style={{ gap: 14 }}>
        <div className="field">
          <label>Discipline</label>
          <select defaultValue="All">{disciplines.map(d => <option key={d}>{d}</option>)}</select>
        </div>
        <div className="field">
          <label>Seniority</label>
          <select defaultValue="All"><option>All</option><option>Principal</option><option>Lead</option><option>Senior</option><option>Mid</option><option>Junior</option></select>
        </div>
        <div className="field">
          <label>Project</label>
          <select defaultValue="All"><option>All</option>{DB.projects.map(p => <option key={p.project_id}>{p.project_code}</option>)}</select>
        </div>
        <div className="field">
          <label>Allocation range</label>
          <div className="row" style={{ gap: 8 }}>
            <input type="number" placeholder="Min %" defaultValue="0" style={{ flex: 1 }}/>
            <span className="muted">to</span>
            <input type="number" placeholder="Max %" defaultValue="120" style={{ flex: 1 }}/>
          </div>
        </div>
        <div>
          <label className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", display:"block", marginBottom: 6 }}>Show only</label>
          {[
            "Over-allocated (>100%)",
            "Available (<60%)",
            "Has time off scheduled",
            "Holiday conflicts",
          ].map(o => (
            <label key={o} className="row" style={{ gap: 8, padding: "6px 0", fontSize: 13 }}>
              <input type="checkbox"/>{o}
            </label>
          ))}
        </div>
      </div>
    </Modal>
  );
}

window.ScreenEmployees = ScreenEmployees;
window.ScreenEmployeeDetail = ScreenEmployeeDetail;
window.ScreenCalendar = ScreenCalendar;
