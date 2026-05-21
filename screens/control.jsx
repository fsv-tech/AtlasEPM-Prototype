// ============================================
// Atlas — Screens 14, 15, 16
//   Approvals Center · Change Requests · Risks
// ============================================

function ScreenApprovals() {
  const [tab, setTab] = React.useState("Pending");
  const list = DB.approvals.filter(a => tab === "All" ? true : a.status === tab);
  const ap = DB.approvalSummary();

  const tabs = ["Pending","Approved","Rejected","All"].map(t => ({
    value: t, label: t, count: t === "All" ? DB.approvals.length : DB.approvals.filter(a => a.status === t).length,
  }));

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Delivery"
        title="Approval centre"
        subtitle="Every decision waiting on the chain — sign-offs, change requests, cost approvals."
        actions={<button className="btn"><Ico name="download" size={13}/>Export</button>}
      />

      <div className="kpi-grid">
        <KPI featured label="Awaiting you" icon="checkSquare" value={ap.pending} foot="action needed"/>
        <KPI label="Approved this month" icon="checkCircle" value={ap.approved}/>
        <KPI label="Avg turnaround" icon="clock" value={ap.avgCycleDays ? ap.avgCycleDays.toFixed(1) : "—"} unit="d" foot="Target ≤ 5d" deltaDir={ap.avgCycleDays && ap.avgCycleDays <= 5 ? "up" : "down"}/>
        <KPI label="Overdue" icon="alertTri" value={ap.overdue} foot={ap.overdue > 0 ? "follow up" : "all on track"} deltaDir={ap.overdue > 0 ? "down" : "up"}/>
        <KPI label="Rejected" icon="x" value={ap.rejected} foot="this period"/>
      </div>

      {/* Approval pipeline diagram */}
      <div className="card">
        <CardH title="Approval workflow" subtitle="Standard chain for engineering deliverables"/>
        <div className="row" style={{ justifyContent: "space-between", gap: 16, padding: "8px 0" }}>
          {[
            { l: "Engineer",    sub: "Submits", icon: "edit",       color: "var(--slate)" },
            { l: "Lead",        sub: "Technical review", icon: "checkCircle", color: "var(--blue)" },
            { l: "PM",          sub: "Schedule & budget", icon: "user",   color: "var(--violet)" },
            { l: "Commercial",  sub: "Cost > threshold", icon: "dollar",  color: "var(--amber)" },
            { l: "Executive",   sub: "Strategic", icon: "shield",  color: "var(--navy)" },
          ].map((s, i, arr) => (
            <React.Fragment key={s.l}>
              <div className="col" style={{ alignItems: "center", gap: 6, flex: 1 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: s.color, color: "#fff", display: "grid", placeItems: "center" }}>
                  <Ico name={s.icon} size={18}/>
                </div>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{s.l}</div>
                <div className="muted xs">{s.sub}</div>
              </div>
              {i < arr.length - 1 && <Ico name="arrRight" size={18} color="var(--ink-5)" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <Tabs active={tab} onChange={setTab} tabs={tabs}/>

      <div className="card flush">
        <table className="data">
          <thead><tr><th>ID</th><th>Type</th><th>Item</th><th>Level</th><th>Approver</th><th>Raised</th><th>Priority</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {list.map(a => {
              const approver = DB.employeeById(a.approver_id);
              const p = DB.projectById(a.project_id);
              return (
                <tr key={a.approval_id}>
                  <td className="cell-id">{a.approval_id}</td>
                  <td><span className="badge outline" style={{ fontSize: 10 }}>{a.entity_type}</span></td>
                  <td>
                    <div className="cell-strong">{a.title}</div>
                    <div className="cell-sub mono">{p.project_code} · {a.entity_id}</div>
                  </td>
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
    </div>
  );
}

// ============================================
function ScreenChanges() {
  const [tab, setTab] = React.useState("All");
  const [drawer, setDrawer] = React.useState(null);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const tabs = ["All","Approved","In Review","Submitted","Pending","Rejected"].map(t => ({
    value: t, label: t, count: t === "All" ? DB.changes.length : DB.changes.filter(c => c.status === t).length,
  }));
  const list = DB.changes.filter(c => tab === "All" ? true : c.status === tab);

  const totalApproved = DB.changes.filter(c=>c.status==="Approved").reduce((s,c)=>s+c.cost_impact, 0);
  const totalPending  = DB.changes.filter(c=>["In Review","Submitted","Pending"].includes(c.status)).reduce((s,c)=>s+c.cost_impact, 0);

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Delivery"
        title="Change requests"
        subtitle="Every change to the agreed scope — with the cost, hour, and schedule impact tracked end-to-end."
        actions={
          <>
            <button className="btn" onClick={() => setExportOpen(true)} data-no-toast><Ico name="download" size={13}/>Export</button>
            <button className="btn primary" onClick={() => setCreateOpen(true)} data-no-toast><Ico name="plus" size={13}/>New change request</button>
          </>
        }
      />

      {(() => {
        const ci = DB.changeImpact();
        return (
      <div className="kpi-grid">
        <KPI featured label="Approved value" icon="checkCircle" value={(ci.approvedValue >= 0 ? "+$" : "-$") + Math.abs(ci.approvedValue/1000).toFixed(0)} unit="K" foot={ci.approved + " approved"}/>
        <KPI label="Pending value" icon="clock" value={(ci.pendingValue >= 0 ? "+$" : "-$") + Math.abs(ci.pendingValue/1000).toFixed(0)} unit="K" foot={ci.pending + " in review"}/>
        <KPI label="Total hour impact" icon="activity" value={ci.netHours.toLocaleString()} unit="h" foot="across all CRs"/>
        <KPI label="Schedule impact" icon="calendar" value={(ci.netSchedule >= 0 ? "+" : "") + ci.netSchedule} unit="d" foot="net days (non-rejected)"/>
        <KPI label="Rejected" icon="x" value={ci.rejected} foot={"of " + ci.total + " total"}/>
      </div>
        );
      })()}

      <Tabs active={tab} onChange={setTab} tabs={tabs}/>

      <div className="card flush">
        <table className="data">
          <thead><tr><th>ID</th><th>Title</th><th>Project</th><th>Initiator</th><th className="num">Hours</th><th className="num">Cost impact</th><th className="num">Days</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {list.map(c => {
              const p = DB.projectById(c.project_id);
              const reqBy = DB.employeeById(c.requested_by);
              return (
                <tr key={c.change_id} onClick={() => setDrawer(c)}>
                  <td className="cell-id">{c.change_id}</td>
                  <td>
                    <div className="cell-strong">{c.title}</div>
                    <div className="cell-sub">{c.reason}</div>
                  </td>
                  <td><span className="mono tiny">{p.project_code}</span></td>
                  <td><div className="row" style={{ gap: 6 }}><Avatar employee={reqBy} size="sm"/><span className="tiny">{reqBy.full_name.split(" ").pop()}</span></div></td>
                  <td className="num cell-num" style={{ color: c.hours_impact < 0 ? "var(--green)" : null }}>{c.hours_impact > 0 ? "+" : ""}{c.hours_impact}</td>
                  <td className="num cell-num" style={{ color: c.cost_impact < 0 ? "var(--green)" : null }}>{c.cost_impact >= 0 ? "+$" : "-$"}{Math.abs(c.cost_impact/1000).toFixed(1)}K</td>
                  <td className="num cell-num" style={{ color: c.schedule_impact_days < 0 ? "var(--green)" : null }}>{c.schedule_impact_days > 0 ? "+" : ""}{c.schedule_impact_days}d</td>
                  <td className="cell-num">{U.fmtDate(c.date)}</td>
                  <td><Status value={c.status}/></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {drawer && (
        <Drawer
          title={drawer.change_id + " · Change request"}
          onClose={() => setDrawer(null)}
          footer={
            <>
              <button className="btn" onClick={() => setDrawer(null)}>Close</button>
              {drawer.status !== "Approved" && drawer.status !== "Rejected" && (
                <>
                  <button className="btn">Reject</button>
                  <button className="btn primary"><Ico name="check" size={13}/>Approve</button>
                </>
              )}
            </>
          }
        >
          <h2 style={{ fontSize: 20, fontWeight: 500, letterSpacing: "-0.02em", margin: "4px 0 14px", lineHeight: 1.25 }}>{drawer.title}</h2>
          <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <StatBox label="Hours" value={(drawer.hours_impact > 0 ? "+" : "") + drawer.hours_impact} color={drawer.hours_impact < 0 ? "var(--green)" : "var(--ink)"}/>
            <StatBox label="Cost" value={(drawer.cost_impact >= 0 ? "+$" : "-$") + Math.abs(drawer.cost_impact/1000).toFixed(1) + "K"} color={drawer.cost_impact < 0 ? "var(--green)" : "var(--red)"}/>
            <StatBox label="Schedule" value={(drawer.schedule_impact_days > 0 ? "+" : "") + drawer.schedule_impact_days + "d"} color={drawer.schedule_impact_days < 0 ? "var(--green)" : "var(--red)"}/>
          </div>
          <div style={{ marginTop: 16 }}>
            <Field label="Reason">{drawer.reason}</Field>
            <Field label="Initiator">{drawer.initiator}</Field>
            <Field label="Requested by">{DB.employeeById(drawer.requested_by).full_name}</Field>
            <Field label="Project">{DB.projectById(drawer.project_id).project_name} ({drawer.project_id})</Field>
            <Field label="Date raised">{U.fmtDate(drawer.date, "medium")}</Field>
            <Field label="Status"><Status value={drawer.status}/></Field>
          </div>
          <hr className="divider" style={{ margin: "16px 0" }}/>
          <h4 className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Workflow</h4>
          <div className="col" style={{ gap: 12 }}>
            {[
              { l: "Requested",    by: "EMP-001", at: "2026-05-04", done: true },
              { l: "Review (PM)",  by: "EMP-001", at: "2026-05-06", done: ["Approved","Rejected","In Review","Submitted"].includes(drawer.status) },
              { l: "Approve (Comm.)", by: "EMP-090", at: drawer.status === "Approved" ? "2026-05-09" : null, done: drawer.status === "Approved" },
              { l: "Implemented",  by: "—",       at: null, done: false },
            ].map((s, i) => (
              <div key={i} className="row" style={{ gap: 10 }}>
                <Ico name={s.done ? "checkCircle" : "circle"} size={16} color={s.done ? "var(--green)" : "var(--ink-5)"}/>
                <div style={{ flex: 1, fontSize: 13 }}>{s.l}</div>
                <span className="mono tiny muted">{s.at ? U.fmtDate(s.at) : "—"}</span>
              </div>
            ))}
          </div>
        </Drawer>
      )}

      {createOpen && <CreateRecordModal
        title="New change request"
        subtitle="Captures the cost, hour, and schedule impact of a proposed scope change."
        submitLabel="Submit for review"
        onClose={() => setCreateOpen(false)}
        fields={[
          { name: "title", label: "Title", required: true, span: 2, placeholder: "Brief change description..." },
          { name: "project", label: "Project", type: "select", required: true, options: DB.projects.map(p => ({ value: p.project_id, label: p.project_code })), default: "P-001" },
          { name: "initiator", label: "Initiator", type: "select", options: ["Client","Engineer","Contractor","Stakeholder","Utility"], default: "Engineer" },
          { name: "reason", label: "Reason / driver", required: true, placeholder: "Ground info gap, sustainability, etc." },
          { name: "requestedBy", label: "Requested by", type: "select", options: DB.employees.map(e => ({ value: e.employee_id, label: e.full_name })), default: "EMP-001" },
          { name: "hoursImpact", label: "Hours impact", type: "number", placeholder: "240" },
          { name: "costImpact",  label: "Cost impact ($)", type: "number", placeholder: "120000" },
          { name: "scheduleImpact", label: "Schedule impact (days)", type: "number", placeholder: "8" },
          { name: "description", label: "Description", type: "textarea", placeholder: "Optional detail..." },
        ]}
      />}
      {exportOpen && <ExportModal
        title="Export change requests"
        entity="change requests"
        count={DB.changes.length}
        onClose={() => setExportOpen(false)}
      />}
    </div>
  );
}

// ============================================
function ScreenRisks() {
  const [project, setProject] = React.useState("All");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const list = project === "All" ? DB.risks : DB.risks.filter(r => r.project_id === project);
  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Delivery"
        title="Risk register"
        subtitle="Likelihood × Impact heat map and the full register across the portfolio."
        actions={
          <>
            <select className="btn" value={project} onChange={e => setProject(e.target.value)}>
              <option value="All">All projects</option>
              {DB.projects.map(p => <option key={p.project_id} value={p.project_id}>{p.project_code}</option>)}
            </select>
            <button className="btn" onClick={() => setExportOpen(true)} data-no-toast><Ico name="download" size={13}/>Export</button>
            <button className="btn primary" onClick={() => setCreateOpen(true)} data-no-toast><Ico name="plus" size={13}/>New risk</button>
          </>
        }
      />

      <div className="kpi-grid">
        <KPI featured label="Open risks" icon="shield" value={list.filter(r=>r.status==="Open").length}/>
        <KPI label="High severity" icon="alertTri" value={list.filter(r=>r.severity==="High" && r.status === "Open").length} delta="needs action" deltaDir="down"/>
        <KPI label="Rising trend" icon="trendUp" value={list.filter(r=>r.trend==="rising" && r.status === "Open").length}/>
        <KPI label="Mitigated" icon="checkCircle" value={list.filter(r=>r.status==="Mitigated").length}/>
        <KPI label="Closed" icon="x" value={list.filter(r=>r.status==="Closed").length}/>
      </div>

      <RisksView risks={list}/>

      {createOpen && <CreateRecordModal
        title="New risk"
        subtitle="Add to the risk register. The owner gets notified and the matrix updates immediately."
        submitLabel="Add risk"
        onClose={() => setCreateOpen(false)}
        fields={[
          { name: "title", label: "Risk title", required: true, span: 2, placeholder: "Brief description of the risk..." },
          { name: "project", label: "Project", type: "select", required: true, options: DB.projects.map(p => ({ value: p.project_id, label: p.project_code })), default: "P-001" },
          { name: "category", label: "Category", type: "select", options: ["Engineering","Logistics","Stakeholder","Commercial","Compliance","Resources","Construction","Interface","Weather","IT","Permits","Sustainability"], default: "Engineering" },
          { name: "probability", label: "Probability (1–5)", type: "number", min: 1, max: 5, default: 3 },
          { name: "impact",      label: "Impact (1–5)",      type: "number", min: 1, max: 5, default: 3 },
          { name: "owner", label: "Owner", type: "select", required: true, options: DB.employees.map(e => ({ value: e.employee_id, label: e.full_name })), default: "EMP-001" },
          { name: "due",   label: "Review by", type: "date" },
          { name: "mitigation", label: "Mitigation plan", type: "textarea", placeholder: "How will we manage / reduce this risk?" },
        ]}
      />}
      {exportOpen && <ExportModal
        title="Export risk register"
        entity="risks"
        count={list.length}
        onClose={() => setExportOpen(false)}
      />}
    </div>
  );
}

window.ScreenApprovals = ScreenApprovals;
window.ScreenChanges = ScreenChanges;
window.ScreenRisks = ScreenRisks;
