// ============================================
// Atlas — Screens 12 & 13: Deliverables tracker + Deliverable detail
// ============================================

function ScreenDeliverables() {
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState("All");
  const [disc, setDisc]     = React.useState("All");
  const [project, setProj]  = React.useState("All");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);

  const disciplines = ["All", ...Array.from(new Set(DB.deliverables.map(d => d.discipline)))];
  const statuses = ["All","Draft","In Progress","In Review","Approved","Delayed","Issued"];

  const filtered = DB.deliverables.filter(d => {
    if (status !== "All" && d.status !== status) return false;
    if (disc   !== "All" && d.discipline !== disc) return false;
    if (project!== "All" && d.project_id !== project) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(d.title + " " + d.deliverable_code).toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Delivery"
        title="Deliverables tracker"
        subtitle="Every drawing, calculation and report across the portfolio — by status and discipline."
        actions={
          <>
            <button className="btn" onClick={() => setExportOpen(true)} data-no-toast><Ico name="download" size={13}/>Export</button>
            <button className="btn primary" onClick={() => setCreateOpen(true)} data-no-toast><Ico name="plus" size={13}/>New deliverable</button>
          </>
        }
      />

      <div className="kpi-grid">
        <KPI label="Total" icon="layers" value={DB.deliverables.length}/>
        <KPI label="In progress" icon="activity" value={DB.deliverables.filter(d=>d.status==="In Progress").length}/>
        <KPI label="In review" icon="eye" value={DB.deliverables.filter(d=>d.status==="In Review").length}/>
        <KPI label="Approved / issued" icon="checkCircle" value={DB.deliverables.filter(d => d.status === "Approved" || d.status === "Issued").length}/>
        <KPI label="Delayed" icon="alertTri" value={DB.deliverables.filter(d=>d.status==="Delayed").length} delta="needs attention" deltaDir="down"/>
      </div>

      <FilterBar
        chips={statuses.map(s => ({ value: s, label: s, count: s === "All" ? DB.deliverables.length : DB.deliverables.filter(d => d.status === s).length }))}
        value={status} onChange={setStatus}
        search={search} onSearch={setSearch}
        searchPlaceholder="Search by code or title..."
        right={
          <>
            <select className="btn" value={project} onChange={e => setProj(e.target.value)}>
              <option value="All">All projects</option>
              {DB.projects.map(p => <option key={p.project_id} value={p.project_id}>{p.project_code}</option>)}
            </select>
            <select className="btn" value={disc} onChange={e => setDisc(e.target.value)}>
              {disciplines.map(d => <option key={d} value={d}>{d === "All" ? "All disciplines" : d}</option>)}
            </select>
          </>
        }
      />

      <div className="card flush">
        <table className="data">
          <thead>
            <tr>
              <th>Code</th><th>Title</th><th>Project</th><th>Discipline</th><th>Owner</th><th>Status</th><th>Progress</th><th>Planned</th><th>Actual</th>
            </tr>
          </thead>          <tbody>
            {filtered.map(d => {
              const p = DB.projectById(d.project_id);
              const owner = DB.employeeById(d.owner_employee_id);
              const overdue = d.status !== "Approved" && d.status !== "Issued" && U.daysFromToday(d.planned_date) < 0;
              return (
                <tr key={d.deliverable_id} onClick={() => navTo("deliverables/" + d.deliverable_id)}>
                  <td className="cell-id">{d.deliverable_code}</td>
                  <td>
                    <div className="row" style={{gap:8}}>
                      <Ico name="fileText" size={14} color="var(--ink-3)"/>
                      <div>
                        <div className="cell-strong">{d.title}</div>
                        <div className="cell-sub row" style={{gap: 6}}>
                          <span className="badge outline" style={{fontSize: 9.5}}>Rev {d.revision}</span>
                          {overdue && <span style={{color: "var(--red)"}}>{Math.abs(U.daysFromToday(d.planned_date))}d overdue</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td><span className="mono tiny">{p.project_code}</span></td>
                  <td><span className="badge outline" style={{fontSize: 10}}>{d.discipline}</span></td>
                  <td><div className="row" style={{gap: 6}}><Avatar employee={owner} size="sm"/><span className="tiny">{owner.full_name.split(" ").pop()}</span></div></td>
                  <td><Status value={d.status}/></td>
                  <td style={{ width: 120 }}><ProgressWithLabel value={d.completion_percent}/></td>
                  <td className="cell-num">{U.fmtDate(d.planned_date)}</td>
                  <td className="cell-num">{U.fmtDate(d.actual_date)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {createOpen && <CreateRecordModal
        title="New deliverable"
        subtitle="Add a new deliverable to a project. The owner gets notified and the deliverable shows up in their queue immediately."
        submitLabel="Create deliverable"
        onClose={() => setCreateOpen(false)}
        fields={[
          { name: "code",  label: "Deliverable code", required: true, placeholder: "e.g. GFB-PR-PID-005" },
          { name: "rev",   label: "Revision", type: "select", options: ["A","B","C","D"], default: "A" },
          { name: "title", label: "Title", required: true, span: 2, placeholder: "P&ID — Utility distribution" },
          { name: "project", label: "Project", type: "select", required: true, options: DB.projects.map(p => ({ value: p.project_id, label: p.project_code + " — " + p.project_name })), default: "P-001" },
          { name: "discipline", label: "Discipline", type: "select", required: true, options: DB.disciplineNames, default: "Process" },
          { name: "owner", label: "Owner", type: "select", required: true, options: DB.employees.map(e => ({ value: e.employee_id, label: e.full_name })), default: "EMP-081" },
          { name: "status", label: "Status", type: "select", options: ["Draft","In Progress","In Review","Approved"], default: "Draft" },
          { name: "plannedDate", label: "Planned date", type: "date", required: true },
          { name: "hours",       label: "Estimated hours", type: "number", placeholder: "80" },
          { name: "description", label: "Description", type: "textarea", placeholder: "Optional context for the team..." },
        ]}
      />}

      {exportOpen && <ExportModal
        title="Export deliverables"
        entity="deliverables"
        count={DB.deliverables.length}
        onClose={() => setExportOpen(false)}
        scopeOptions={[
          { value: "current", label: "Current filter (" + DB.deliverables.length + " items)" },
          { value: "all",     label: "All deliverables across portfolio" },
          { value: "project", label: "Active project only" },
        ]}
      />}
    </div>
  );
}

// ============================================
// Screen 13: Deliverable Detail
// ============================================
function ScreenDeliverableDetail({ deliverableId }) {
  const d = DB.deliverableById(deliverableId);
  if (!d) return <div className="content" data-tour-id="page"><Empty title="Deliverable not found" action={<a className="btn" href="#/deliverables">Back</a>}/></div>;

  const p = DB.projectById(d.project_id);
  const owner = DB.employeeById(d.owner_employee_id);
  const [tab, setTab] = React.useState("overview");

  // Revisions — generate up to current rev, anchored to the deliverable's planned date
  const planned = new Date(d.planned_date);
  const numRevs = d.revision.charCodeAt(0) - 64;
  const revs = ["A","B","C","D"].slice(0, numRevs).map((r, i) => {
    // Each revision dated ~30 days apart, ending at actual_date or planned_date
    const refDate = new Date((d.actual_date || d.planned_date));
    const revDate = new Date(refDate.getTime() - (numRevs - 1 - i) * 30 * 86400000);
    return {
      rev: r,
      date: U.fmtDate(revDate),
      by: d.owner_employee_id,
      note: i === 0
        ? "First issue for internal review."
        : i === numRevs - 1
          ? "Issued for project use; comments incorporated."
          : "Updated per review feedback; technical content revised.",
    };
  });
  // Comments — generated for this deliverable's owner + project PM
  const pm = DB.employeeById(p.pm_id);
  const baseTime = new Date(d.planned_date).getTime() - 5 * 86400000;
  const comments = [
    { by: pm.employee_id, at: U.fmtDate(new Date(baseTime)) + " 09:42", text: `Please review the inputs against the current ${d.discipline.toLowerCase()} design package.` },
    { by: d.owner_employee_id, at: U.fmtDate(new Date(baseTime + 86400000)) + " 11:08", text: `Updated to incorporate feedback. ${d.status === "Approved" || d.status === "Issued" ? "Ready for sign-off." : "Continuing internal review."}` },
  ];

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        crumb={[
          { label: "Deliverables", onClick: () => navTo("deliverables") },
          { label: p.project_code, onClick: () => navTo("projects/" + p.project_id + "/deliverables") },
          { label: d.deliverable_code },
        ]}
        title=""
      />

      <div className="card" style={{ padding: 22 }}>
        <div className="row" style={{ alignItems: "flex-start", gap: 18 }}>
          <div style={{ width: 56, height: 72, background: "var(--surface-3)", borderRadius: 8, display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Ico name="fileText" size={26} color="var(--ink-3)"/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="row" style={{ gap: 10, marginBottom: 4 }}>
              <span className="mono tiny muted">{d.deliverable_code}</span>
              <span className="badge outline" style={{ fontSize: 10 }}>Rev {d.revision}</span>
              <span className="badge outline" style={{ fontSize: 10 }}>{d.discipline}</span>
              <Status value={d.status}/>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.025em", margin: 0, lineHeight: 1.2 }}>{d.title}</h1>
            <div className="row" style={{ gap: 18, marginTop: 10, fontSize: 12.5, color: "var(--ink-3)", flexWrap: "wrap" }}>
              <div className="row" style={{gap: 6}}><Ico name="folder" size={12}/>{p.project_name}</div>
              <div className="row" style={{gap: 6}}>
                <Avatar employee={owner} size="sm"/>
                <span>{owner.full_name}</span>
              </div>
              <div className="row" style={{gap: 6}}><Ico name="calendar" size={12}/>Planned {U.fmtDate(d.planned_date)}</div>
              {d.actual_date && <div className="row" style={{gap: 6}}><Ico name="checkCircle" size={12} color="var(--green)"/>Actual {U.fmtDate(d.actual_date)}</div>}
            </div>
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn"><Ico name="download" size={13}/>Download</button>
            <button className="btn"><Ico name="upload" size={13}/>New revision</button>
            <button className="btn primary"><Ico name="send" size={13}/>Submit for approval</button>
          </div>
        </div>

        {/* Workflow strip */}
        <div className="row" style={{ marginTop: 22, gap: 0 }}>
          {(() => {
            // Derive workflow dates from planned_date and actual_date
            const planDate = new Date(d.planned_date);
            const stages = [
              { l: "Draft",     k: "Draft",       offset: -45 },
              { l: "In review", k: "In Review",   offset: -15 },
              { l: "Approved",  k: "Approved",    offset: -3 },
              { l: "Issued",    k: "Issued",      offset: 0 },
            ];
            const orderedStatuses = ["Draft","In Progress","In Review","Approved","Issued"];
            const curIdx = orderedStatuses.indexOf(d.status);
            return stages.map((s, i, arr) => {
              const sIdx = orderedStatuses.indexOf(s.k);
              const cur = d.status === s.k;
              const reached = curIdx >= sIdx;
              // Show date for reached stages
              const stageDate = reached ? U.fmtDate(new Date(planDate.getTime() + s.offset * 86400000)) : null;
              return (
                <React.Fragment key={s.k}>
                  <div className="col" style={{ alignItems:"center", flex: 1, gap: 4 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: reached || cur ? "var(--accent)" : "var(--surface-3)", color: reached || cur ? "#fff" : "var(--ink-4)", display:"grid", placeItems:"center", border: cur ? "3px solid var(--accent-soft)" : "none" }}>
                      {reached && !cur ? <Ico name="check" size={14}/> : <span style={{ fontSize: 11, fontWeight: 500 }}>{i+1}</span>}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: cur ? 500 : 400, color: cur ? "var(--ink)" : "var(--ink-3)" }}>{s.l}</div>
                    <div className="muted tiny mono">{stageDate || "—"}</div>
                  </div>
                  {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: reached ? "var(--accent)" : "var(--line)", marginTop: 14 }}/>}
                </React.Fragment>
              );
            });
          })()}
        </div>
      </div>

      <Tabs active={tab} onChange={setTab} tabs={[
        { value: "overview", label: "Overview", icon: "info" },
        { value: "revisions", label: "Revisions", icon: "history", count: revs.length },
        { value: "comments", label: "Comments", icon: "message", count: comments.length },
        { value: "approvals", label: "Approvals", icon: "checkSquare" },
        { value: "attachments", label: "Attachments", icon: "paperclip", count: 3 },
      ]}/>

      <div className="grid" style={{ gridTemplateColumns: "1fr 320px" }}>
        <div className="col" style={{ gap: 14 }}>
          {tab === "overview" && (
            <>
              <div className="card">
                <CardH title="Description"/>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--ink-2)" }}>
                  This deliverable captures the {d.title.toLowerCase()} for the {p.project_name} package. It documents the design intent, key assumptions, and outputs required for subsequent {d.discipline.toLowerCase()} workstreams. Inputs include the latest PFD/P&ID set, equipment list, and supplier datasheets where available.
                </p>
                <hr className="divider" style={{ margin: "12px 0" }}/>
                <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                  <Field label="Discipline">{d.discipline}</Field>
                  <Field label="Project">{p.project_code} — {p.project_name}</Field>
                  <Field label="Owner">{owner.full_name}</Field>
                  <Field label="Status"><Status value={d.status}/></Field>
                  <Field label="Revision">{d.revision}</Field>
                  <Field label="Completion">{d.completion_percent}%</Field>
                  <Field label="Planned date">{U.fmtDate(d.planned_date, "medium")}</Field>
                  <Field label="Actual date">{d.actual_date ? U.fmtDate(d.actual_date, "medium") : "—"}</Field>
                  <Field label="Days vs plan">{d.actual_date ? Math.round((new Date(d.actual_date) - new Date(d.planned_date)) / 86400000) + "d" : "—"}</Field>
                </div>
              </div>

              <div className="card">
                <CardH title="Inputs & dependencies"/>
                {(() => {
                  const projDels = DB.deliverables.filter(x => x.project_id === d.project_id && x.deliverable_id !== d.deliverable_id);
                  // Inputs: same project, planned earlier than this one
                  const inputs = projDels
                    .filter(x => x.planned_date < d.planned_date)
                    .sort((a,b) => b.planned_date.localeCompare(a.planned_date))
                    .slice(0, 3);
                  // Feeds into: same project, planned later
                  const feeds = projDels
                    .filter(x => x.planned_date > d.planned_date)
                    .sort((a,b) => a.planned_date.localeCompare(b.planned_date))
                    .slice(0, 3);
                  return (
                <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div>
                    <h4 className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Predecessors</h4>
                    {inputs.length === 0 ? <div className="muted tiny">No predecessors.</div> :
                      inputs.map(x => (
                        <div key={x.deliverable_id} className="row" style={{ padding: "6px 0", borderBottom: "1px solid var(--line)", gap: 8, cursor: "pointer" }}
                             onClick={() => navTo("deliverables/" + x.deliverable_id)}>
                          <Ico name="fileText" size={12} color="var(--ink-3)"/>
                          <span style={{ fontSize: 12.5 }}><span className="mono">{x.deliverable_code}</span> — {x.title.slice(0,28)}</span>
                        </div>
                      ))
                    }
                  </div>
                  <div>
                    <h4 className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>Successors</h4>
                    {feeds.length === 0 ? <div className="muted tiny">No successors.</div> :
                      feeds.map(x => (
                        <div key={x.deliverable_id} className="row" style={{ padding: "6px 0", borderBottom: "1px solid var(--line)", gap: 8, cursor: "pointer" }}
                             onClick={() => navTo("deliverables/" + x.deliverable_id)}>
                          <Ico name="arrUpRight" size={12} color="var(--ink-3)"/>
                          <span style={{ fontSize: 12.5 }}><span className="mono">{x.deliverable_code}</span> — {x.title.slice(0,28)}</span>
                        </div>
                      ))
                    }
                  </div>
                </div>
                  );
                })()}
              </div>
            </>
          )}

          {tab === "revisions" && (
            <div className="card">
              <CardH title="Revision history" subtitle="Newest first"/>
              {revs.reverse().map(r => {
                const auth = DB.employeeById(r.by);
                return (
                  <div key={r.rev} className="row" style={{ padding: "14px 0", borderBottom: "1px solid var(--line)", gap: 12, alignItems:"flex-start" }}>
                    <span className="badge" style={{ background: "var(--accent)", color: "#fff", fontSize: 11 }}>Rev {r.rev}</span>
                    <div style={{ flex: 1 }}>
                      <div className="row" style={{ gap: 8 }}>
                        <Avatar employee={auth} size="sm"/>
                        <span style={{ fontSize: 13, fontWeight: 500 }}>{auth.full_name}</span>
                        <span className="muted tiny">·</span>
                        <span className="muted tiny">{r.date}</span>
                      </div>
                      <div style={{ fontSize: 12.5, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>{r.note}</div>
                    </div>
                    <button className="btn xs"><Ico name="download" size={11}/>PDF</button>
                  </div>
                );
              })}
            </div>
          )}

          {tab === "comments" && (
            <div className="card">
              <CardH title="Comments" subtitle={`${comments.length} replies in this thread`}/>
              <div className="col" style={{ gap: 14 }}>
                {comments.map((c, i) => {
                  const auth = DB.employeeById(c.by);
                  return (
                    <div key={i} className="row" style={{ gap: 10, alignItems: "flex-start" }}>
                      <Avatar employee={auth}/>
                      <div style={{ flex: 1, background: "var(--surface-2)", padding: 12, borderRadius: 10 }}>
                        <div className="row" style={{ gap: 8 }}>
                          <span style={{ fontSize: 13, fontWeight: 500 }}>{auth.full_name}</span>
                          <span className="muted tiny mono">{c.at}</span>
                        </div>
                        <div style={{ fontSize: 13, marginTop: 4, lineHeight: 1.5 }}>{c.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="row" style={{ gap: 8, marginTop: 16 }}>
                <Avatar employee={DB.employees[0]}/>
                <input className="grow" style={{ padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 8 }} placeholder="Write a comment..."/>
                <button className="btn primary"><Ico name="send" size={13}/>Reply</button>
              </div>
            </div>
          )}

          {tab === "attachments" && (
            <div className="card flush">
              <div className="table-head">
                <div className="table-head-l">
                  <h3 className="card-title">Attachments</h3>
                </div>
                <button className="btn primary sm"><Ico name="upload" size={12}/>Upload</button>
              </div>
              <table className="data">
                <thead><tr><th>File</th><th>Type</th><th>Size</th><th>Uploaded by</th><th>Date</th></tr></thead>
                <tbody>
                  {[
                    { f: d.deliverable_code + "_R" + d.revision + ".pdf", t: "PDF", s: "3.4 MB" },
                    { f: d.deliverable_code + "_R" + d.revision + ".dwg", t: "DWG", s: "12.1 MB" },
                    { f: d.deliverable_code + "_calc.xlsx", t: "XLSX", s: "0.8 MB" },
                  ].map((a, i) => (
                    <tr key={i}>
                      <td><div className="row" style={{ gap: 8 }}><Ico name="fileText" size={14}/>{a.f}</div></td>
                      <td><span className="badge neutral" style={{ fontSize: 10 }}>{a.t}</span></td>
                      <td className="cell-num">{a.s}</td>
                      <td><div className="row" style={{ gap: 6 }}><Avatar employee={owner} size="sm"/><span className="tiny">{owner.full_name.split(" ").pop()}</span></div></td>
                      <td className="cell-num">{U.fmtDate(d.planned_date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "approvals" && (
            <div className="card flush">
              <div className="table-head"><h3 className="card-title">Approval chain</h3></div>
              <ApprovalsView approvals={DB.approvals.filter(a => a.entity_id === d.deliverable_id)}/>
            </div>
          )}
        </div>

        {/* Right rail */}
        <div className="col" style={{ gap: 14 }}>
          <div className="card">
            <CardH title="Status"/>
            <div className="col" style={{ gap: 10 }}>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5 }}>
                <span className="muted">Current</span>
                <Status value={d.status}/>
              </div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5 }}>
                <span className="muted">Progress</span>
                <span className="mono">{d.completion_percent}%</span>
              </div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5 }}>
                <span className="muted">Owner</span>
                <Avatar employee={owner} size="sm"/>
              </div>
              <div className="row" style={{ justifyContent: "space-between", fontSize: 12.5 }}>
                <span className="muted">Revision</span>
                <span className="badge neutral">Rev {d.revision}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <CardH title="Quick actions"/>
            <div className="col" style={{ gap: 8 }}>
              <button className="btn" style={{ justifyContent: "space-between" }}><span>Submit for approval</span><Ico name="arrRight" size={13}/></button>
              <button className="btn" style={{ justifyContent: "space-between" }}><span>Add reviewer</span><Ico name="arrRight" size={13}/></button>
              <button className="btn" style={{ justifyContent: "space-between" }}><span>Mark as delayed</span><Ico name="arrRight" size={13}/></button>
              <button className="btn" style={{ justifyContent: "space-between" }}><span>Duplicate</span><Ico name="arrRight" size={13}/></button>
            </div>
          </div>

          <div className="card muted">
            <CardH title="Linked items"/>
            {(() => {
              // Approvals where this deliverable is the entity
              const linkedApprovals = DB.approvals.filter(a => a.entity_id === d.deliverable_id);
              // Top changes & risks in same project
              const linkedChanges = DB.changes.filter(c => c.project_id === d.project_id).slice(0, 1);
              const linkedRisks   = DB.risks.filter(r => r.project_id === d.project_id && r.status === "Open").slice(0, 1);
              const items = [];
              linkedApprovals.forEach(a => items.push({ icon: "checkSquare", href: "#/approvals", label: `${a.approval_id} — ${a.status}` }));
              linkedChanges.forEach(c   => items.push({ icon: "git",          href: "#/changes/" + c.change_id, label: `${c.change_id} — ${c.title.slice(0,24)}` }));
              linkedRisks.forEach(r     => items.push({ icon: "shield",       href: "#/risks",   label: `${r.risk_id} — ${r.title.slice(0,24)}` }));
              if (items.length === 0) {
                return <div className="muted tiny" style={{ padding: 6 }}>No linked items.</div>;
              }
              return (
                <div className="col" style={{ gap: 6 }}>
                  {items.map((it, i) => (
                    <a key={i} className="row" style={{ gap: 8, fontSize: 12.5, padding: 6 }} href={it.href}>
                      <Ico name={it.icon} size={12}/>{it.label}
                    </a>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScreenDeliverables = ScreenDeliverables;
window.ScreenDeliverableDetail = ScreenDeliverableDetail;
