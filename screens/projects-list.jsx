// ============================================
// Atlas — Screens 3 & 4: Projects list + Create
// ============================================

function ScreenProjectsList() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All");
  const [client, setClient] = React.useState("All");
  const [type, setType]     = React.useState("All");
  const [view, setView]     = React.useState("table"); // table | cards

  const clients = ["All", ...Array.from(new Set(DB.projects.map(p => p.client)))];
  const types   = ["All", ...Array.from(new Set(DB.projects.map(p => p.project_type)))];

  const filtered = DB.projects.filter(p => {
    if (status !== "All" && p.status !== status) return false;
    if (client !== "All" && p.client !== client) return false;
    if (type   !== "All" && p.project_type !== type) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(p.project_name + p.project_code + p.client).toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const statusChips = ["All","Active","Planning","On Hold","Closeout"].map(s => ({
    value: s, label: s,
    count: s === "All" ? DB.projects.length : DB.projects.filter(p => p.status === s).length,
  }));

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Workspace"
        title="Projects"
        subtitle={`${filtered.length} of ${DB.projects.length} projects · filter by status, client, or type.`}
        actions={
          <>
            <button className="btn"><Ico name="download" size={13}/>Export</button>
            <a className="btn primary" href="#/projects/new"><Ico name="plus" size={13}/>New project</a>
          </>
        }
      />

      <FilterBar
        chips={statusChips}
        value={status}
        onChange={setStatus}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search projects..."
        right={
          <>
            <select className="btn" style={{ paddingRight: 24 }} value={client} onChange={e => setClient(e.target.value)}>
              {clients.map(c => <option key={c} value={c}>{c === "All" ? "All clients" : c}</option>)}
            </select>
            <select className="btn" style={{ paddingRight: 24 }} value={type} onChange={e => setType(e.target.value)}>
              {types.map(t => <option key={t} value={t}>{t === "All" ? "All types" : t}</option>)}
            </select>
            <div className="row" style={{ gap: 2, marginLeft: 4, background: "var(--surface-3)", borderRadius: 7, padding: 2 }}>
              <button className={"icon-btn" + (view === "table" ? " active" : "")} onClick={() => setView("table")}
                      style={{ width: 28, height: 28, background: view === "table" ? "var(--surface)" : "transparent" }}>
                <Ico name="list" size={14}/>
              </button>
              <button className={"icon-btn" + (view === "cards" ? " active" : "")} onClick={() => setView("cards")}
                      style={{ width: 28, height: 28, background: view === "cards" ? "var(--surface)" : "transparent" }}>
                <Ico name="cards" size={14}/>
              </button>
            </div>
          </>
        }
      />

      {view === "table" ? (
        <div className="card flush">
          <table className="data">
            <thead>
              <tr>
                <th>Project</th><th>Client</th><th>Type</th><th>PM</th>
                <th>Progress</th><th className="num">Budget</th><th>Submission</th><th>Status</th><th>Health</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const pm = DB.employeeById(p.pm_id);
                const c = DB.costs.find(c => c.project_id === p.project_id);
                return (
                  <tr key={p.project_id} onClick={() => navTo("projects/" + p.project_id)}>
                    <td>
                      <div className="cell-strong">{p.project_name}</div>
                      <div className="cell-sub mono">{p.project_code}</div>
                    </td>
                    <td>{p.client}<div className="cell-sub">{p.country}</div></td>
                    <td><span className="badge outline" style={{ fontSize: 10 }}>{p.project_type}</span></td>
                    <td><div className="row" style={{ gap: 8 }}><Avatar employee={pm} size="sm"/><span className="tiny">{pm.full_name.split(" ").pop()}</span></div></td>
                    <td style={{ width: 160 }}><ProgressWithLabel value={p.progress}/></td>
                    <td className="num cell-num">${(p.budget/1e6).toFixed(2)}M</td>
                    <td><span className="mono tiny">{U.fmtDate(p.submission_date)}</span></td>
                    <td><Status value={p.status}/></td>
                    <td>
                      <span style={{
                        display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                        background: p.health === "green" ? "var(--green)" : p.health === "amber" ? "var(--amber)" : "var(--red)",
                      }} title={p.health}/>
                    </td>
                    <td><Ico name="chevRight" size={14} color="var(--ink-4)"/></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          {filtered.map(p => {
            const pm = DB.employeeById(p.pm_id);
            const c = DB.costs.find(c => c.project_id === p.project_id);
            const disc = DB.disciplines.filter(d => d.project_id === p.project_id);
            return (
              <div key={p.project_id} className="card" onClick={() => navTo("projects/" + p.project_id)}
                   style={{ cursor: "pointer" }}>
                <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
                  <span className="cell-id">{p.project_code}</span>
                  <span style={{
                    display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                    background: p.health === "green" ? "var(--green)" : p.health === "amber" ? "var(--amber)" : "var(--red)",
                  }}/>
                </div>
                <div style={{ fontSize: 15, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 4 }}>{p.project_name}</div>
                <div className="muted tiny" style={{ marginBottom: 12 }}>{p.client} · {p.country}</div>
                <ProgressWithLabel value={p.progress}/>
                <div className="row" style={{ justifyContent:"space-between", marginTop: 12, fontSize: 11, color:"var(--ink-3)" }}>
                  <span>${(p.budget/1e6).toFixed(1)}M budget</span>
                  <span>{disc.length || 4} disciplines</span>
                </div>
                <div className="divider" style={{margin:"12px 0"}}/>
                <div className="row" style={{ justifyContent:"space-between" }}>
                  <Status value={p.status}/>
                  <div className="row" style={{ gap: 6 }}>
                    <Avatar employee={pm} size="sm"/>
                    <span className="tiny muted">{pm.full_name.split(" ").pop()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================
// Screen 4: Create project
// ============================================
function ScreenProjectCreate() {
  const [form, setForm] = React.useState({
    name: "", code: "", client: "", country: "Qatar", type: "FEED Study",
    start: "", end: "", submission: "", priority: "Medium", pm: "EMP-001",
    budget: "", feeFactor: "2.75", contingency: "8", tenderFee: "",
    description: "", tags: "",
  });
  function up(k, v) { setForm(f => ({ ...f, [k]: v })); }

  return (
    <div className="content" data-tour-id="page" data-screen-label="04 Create Project">
      <PageHeader
        crumb={[{ label: "Projects", onClick: () => navTo("projects") }, { label: "New project" }]}
        title="Create project"
        subtitle="The project metadata you enter here becomes the spine — every discipline, deliverable, cost line and resource allocation that follows ties back to this record."
        actions={
          <>
            <a className="btn" href="#/projects">Cancel</a>
            <button className="btn">Save as draft</button>
            <button className="btn primary"><Ico name="plus" size={13}/>Create project</button>
          </>
        }
      />

      <div className="grid" style={{ gridTemplateColumns: "1fr 320px" }}>
        <div className="col" style={{ gap: 16 }}>
          {/* Section 1: Project information */}
          <div className="card">
            <CardH title="Project information"/>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Project name *</label>
                <input value={form.name} onChange={e => up("name", e.target.value)} placeholder="e.g. Green Fuel Bridging Study"/>
              </div>
              <div className="field"><label>Project code *</label><input value={form.code} onChange={e => up("code", e.target.value)} placeholder="GFB-101"/></div>
              <div className="field"><label>Client *</label><input value={form.client} onChange={e => up("client", e.target.value)} placeholder="QatarEnergy LNG"/></div>
              <div className="field">
                <label>Country</label>
                <select value={form.country} onChange={e => up("country", e.target.value)}>
                  {["Qatar","UAE","Saudi Arabia","Oman","Kuwait","Denmark","UK"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Project type</label>
                <select value={form.type} onChange={e => up("type", e.target.value)}>
                  {["FEED Study","Pre-FEED","Detailed Design","Concept Design","EPC Support","Bridging Study"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => up("description", e.target.value)} placeholder="Brief scope and objectives..."/>
              </div>
              <div className="field" style={{ gridColumn: "1 / -1" }}>
                <label>Tags</label>
                <input value={form.tags} onChange={e => up("tags", e.target.value)} placeholder="Hydrogen, FEED, Bridging"/>
                <div className="hint">Comma-separated. Used for portfolio filtering.</div>
              </div>
            </div>
          </div>

          {/* Section 2: Schedule */}
          <div className="card">
            <CardH title="Schedule"/>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <div className="field"><label>Start date *</label><input type="date" value={form.start} onChange={e => up("start", e.target.value)}/></div>
              <div className="field"><label>End date *</label><input type="date" value={form.end} onChange={e => up("end", e.target.value)}/></div>
              <div className="field"><label>Submission date</label><input type="date" value={form.submission} onChange={e => up("submission", e.target.value)}/></div>
              <div className="field">
                <label>Priority</label>
                <select value={form.priority} onChange={e => up("priority", e.target.value)}>
                  {["High","Medium","Low"].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="field" style={{ gridColumn: "span 2" }}>
                <label>Project manager *</label>
                <select value={form.pm} onChange={e => up("pm", e.target.value)}>
                  {DB.employees.filter(e => e.discipline === "PM").map(e => <option key={e.employee_id} value={e.employee_id}>{e.full_name} — {e.job_title}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Financials */}
          <div className="card">
            <CardH title="Financials" subtitle="Drives the cost engine and forecasts"/>
            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="field"><label>Budget (USD)</label><input type="number" value={form.budget} onChange={e => up("budget", e.target.value)} placeholder="4,850,000"/></div>
              <div className="field"><label>Tender fee (USD)</label><input type="number" value={form.tenderFee} onChange={e => up("tenderFee", e.target.value)} placeholder="285,000"/></div>
              <div className="field"><label>Fee factor</label><input type="number" step="0.01" value={form.feeFactor} onChange={e => up("feeFactor", e.target.value)}/><div className="hint">Multiplier applied to hourly cost when invoicing.</div></div>
              <div className="field"><label>Contingency (%)</label><input type="number" value={form.contingency} onChange={e => up("contingency", e.target.value)}/></div>
            </div>

            <hr className="divider" style={{ margin: "16px 0" }}/>

            <h4 className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Derived figures</h4>
            <div className="grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
              <StatBox label="Contingency $" value={form.budget && form.contingency ? `$${(form.budget * form.contingency / 100 / 1000).toFixed(0)}K` : "—"}/>
              <StatBox label="Net of contingency" value={form.budget ? `$${((form.budget * (1 - (form.contingency||0)/100)) / 1e6).toFixed(2)}M` : "—"}/>
              <StatBox label="Effective fee" value={form.feeFactor ? `${form.feeFactor}×` : "—"}/>
              <StatBox label="Required hours" value={form.budget && form.feeFactor ? `${Math.round(form.budget / (90 * form.feeFactor)).toLocaleString()} h` : "—"} sub="@ blended $90/hr"/>
            </div>
          </div>

          {/* Section 4: Templates */}
          <div className="card">
            <CardH title="Start from template" subtitle="Pre-populate disciplines, deliverables, and milestone schedule"/>
            <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
              {[
                { name: "Blank project",   sub: "Start from scratch",    icon: "plus",  active: true },
                { name: "FEED template",   sub: "10 disciplines · 65 deliverables", icon: "fileText" },
                { name: "Bridging template", sub: "7 disciplines · 32 deliverables", icon: "git" },
                { name: "Detailed design", sub: "12 disciplines · 110 deliverables", icon: "layers" },
                { name: "EPC support",     sub: "8 disciplines · 48 deliverables",  icon: "tools" },
                { name: "Concept design",  sub: "6 disciplines · 22 deliverables",  icon: "edit" },
              ].map(t => (
                <div key={t.name} className="card" style={{ padding: 12, cursor: "pointer", borderColor: t.active ? "var(--accent)" : "var(--line)", background: t.active ? "var(--accent-soft-2)" : "var(--surface)" }}>
                  <div className="row" style={{ gap: 10, marginBottom: 4 }}>
                    <div style={{ width: 26, height: 26, background: t.active ? "var(--accent)" : "var(--surface-3)", color: t.active ? "#fff" : "var(--ink-3)", borderRadius: 6, display: "grid", placeItems: "center" }}>
                      <Ico name={t.icon} size={13}/>
                    </div>
                    <span style={{ fontWeight: 500, fontSize: 13 }}>{t.name}</span>
                  </div>
                  <div className="muted tiny">{t.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right rail: project preview / checklist */}
        <div className="col" style={{ gap: 16 }}>
          <div className="card">
            <CardH title="Setup checklist"/>
            {[
              { l: "Project information", done: form.name && form.code && form.client },
              { l: "Schedule",            done: form.start && form.end },
              { l: "Financials",          done: form.budget && form.feeFactor },
              { l: "Project manager",     done: !!form.pm },
              { l: "Disciplines",         done: false, sub: "Add after creation" },
              { l: "Team assignments",    done: false, sub: "Add after creation" },
              { l: "Deliverables list",   done: false, sub: "Add after creation" },
            ].map((s, i) => (
              <div key={s.l} className="row" style={{ padding: "8px 0", borderBottom: i < 6 ? "1px solid var(--line)" : null, gap: 10 }}>
                <Ico name={s.done ? "checkCircle" : "circle"} size={16} color={s.done ? "var(--green)" : "var(--ink-5)"}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12.5, fontWeight: s.done ? 500 : 400, color: s.done ? "var(--ink)" : "var(--ink-3)" }}>{s.l}</div>
                  {s.sub && <div className="muted tiny">{s.sub}</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="card muted">
            <div className="row" style={{ gap: 10, marginBottom: 8 }}>
              <Ico name="info" size={16} color="var(--ink-3)"/>
              <span style={{ fontWeight: 500, fontSize: 13 }}>What happens next</span>
            </div>
            <div className="muted tiny" style={{ lineHeight: 1.55 }}>
              After creation we'll generate the discipline workspaces, baseline cost lines from the budget, and email the PM. Resource allocation can begin immediately.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScreenProjectsList = ScreenProjectsList;
window.ScreenProjectCreate = ScreenProjectCreate;
