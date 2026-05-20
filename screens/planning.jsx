// ============================================
// Atlas — Screens 10, 11
//   Standalone Gantt + Cost (cross-project)
// ============================================

function ScreenGantt() {
  const [addBarOpen, setAddBarOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const p = DB.activeProject;
  const disc = DB.disciplines.filter(d => d.project_id === p.project_id);
  const milestones = DB.milestones.filter(m => m.project_id === p.project_id);
  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Plan"
        title="Gantt planning"
        subtitle={`${p.project_code} · ${p.project_name} — switch project from the top selector.`}
        actions={
          <>
            <select className="btn" defaultValue={p.project_id} onChange={e => location.hash = "#/projects/" + e.target.value + "/gantt"}>
              {DB.projects.map(pr => <option key={pr.project_id} value={pr.project_id}>{pr.project_code} — {pr.project_name}</option>)}
            </select>
            <button className="btn" onClick={() => setExportOpen(true)} data-no-toast><Ico name="download" size={13}/>Export PDF</button>
            <button className="btn primary" onClick={() => setAddBarOpen(true)} data-no-toast><Ico name="plus" size={13}/>Add bar</button>
          </>
        }
      />
      <GanttView p={p} disc={disc} milestones={milestones}/>
      {addBarOpen && <AddBarModal disc={disc} onClose={() => setAddBarOpen(false)}/>}
      {exportOpen && <ExportModal title="Export Gantt as PDF" entity="schedule" onClose={() => setExportOpen(false)}/>}
    </div>
  );
}

function AddBarModal({ disc, onClose }) {
  const [form, setForm] = React.useState({
    discipline: disc[0]?.name || "PM",
    label: "",
    start: "2026-06-01",
    end:   "2026-08-31",
    progress: 0,
    color: "auto",
  });
  function up(k,v) { setForm(f => ({...f, [k]: v })); }
  return (
    <Modal title="Add Gantt bar" onClose={onClose} width={520}
           footer={<>
             <button className="btn" onClick={onClose}>Cancel</button>
             <button className="btn primary" onClick={onClose}><Ico name="plus" size={13}/>Add bar</button>
           </>}>
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Workstream / discipline</label>
          <select value={form.discipline} onChange={e => up("discipline", e.target.value)}>
            {disc.map(d => <option key={d.name}>{d.name}</option>)}
          </select>
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Bar label</label>
          <input value={form.label} onChange={e => up("label", e.target.value)} placeholder="e.g. Detailed engineering — Phase 2"/>
        </div>
        <div className="field">
          <label>Start date</label>
          <input type="date" value={form.start} onChange={e => up("start", e.target.value)}/>
        </div>
        <div className="field">
          <label>End date</label>
          <input type="date" value={form.end} onChange={e => up("end", e.target.value)}/>
        </div>
        <div className="field">
          <label>Initial progress (%)</label>
          <input type="number" min="0" max="100" value={form.progress} onChange={e => up("progress", e.target.value)}/>
        </div>
        <div className="field">
          <label>Colour</label>
          <select value={form.color} onChange={e => up("color", e.target.value)}>
            <option value="auto">Auto (discipline colour)</option>
            <option value="blue">Blue</option><option value="green">Green</option>
            <option value="amber">Amber</option><option value="red">Red</option>
            <option value="violet">Violet</option>
          </select>
        </div>
        <div className="field" style={{ gridColumn: "1 / -1" }}>
          <label>Dependencies (optional)</label>
          <select multiple size="3" style={{ minHeight: 64 }}>
            {disc.map(d => <option key={d.name} value={d.name}>{d.name} — phase 1</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginTop: 14, padding: 12, background: "var(--surface-2)", borderRadius: 8, fontSize: 12.5, color: "var(--ink-3)" }}>
        Bar will appear on the {form.discipline} row spanning {U.fmtDate(form.start)} – {U.fmtDate(form.end)} ({Math.round((new Date(form.end) - new Date(form.start)) / 86400000)} days).
      </div>
    </Modal>
  );
}

function ScreenCost() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const totalBudget = DB.projects.reduce((s,p)=>s+p.budget, 0);
  const totalSpent  = DB.costs.reduce((s,c)=>s+c.spent, 0);
  const totalForecast = DB.costs.reduce((s,c)=>s+c.forecast, 0);
  const totalCommitted = DB.costs.reduce((s,c)=>s+c.committed, 0);

  // Monthly burn (synthetic across all projects)
  const months = ["Aug 25","Sep","Oct","Nov","Dec","Jan 26","Feb","Mar","Apr","May"];
  const burnByMonth = [1.2,1.4,1.6,1.8,2.1,2.4,2.6,2.8,3.0,3.2];
  const cumulative  = burnByMonth.reduce((acc, v) => { acc.push((acc[acc.length-1]||0) + v); return acc; }, []);

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Commercial"
        title="Cost management"
        subtitle="Portfolio-level cost dashboard — drill into a project for the full engine."
        actions={
          <>
            <button className="btn"><Ico name="upload" size={13}/>Import POs</button>
            <button className="btn" onClick={() => setExportOpen(true)} data-no-toast><Ico name="download" size={13}/>Cost report</button>
            <button className="btn primary" onClick={() => setCreateOpen(true)} data-no-toast><Ico name="plus" size={13}/>New cost line</button>
          </>
        }
      />

      <div className="kpi-grid">
        <KPI featured label="Total budget" icon="dollar" value={"$" + (totalBudget/1e6).toFixed(1)} unit="M"/>
        <KPI label="Committed" icon="briefcase" value={"$" + (totalCommitted/1e6).toFixed(1)} unit="M" foot={Math.round(totalCommitted/totalBudget*100) + "% of budget"}/>
        <KPI label="Spent to date" icon="coin" value={"$" + (totalSpent/1e6).toFixed(1)} unit="M" foot={Math.round(totalSpent/totalBudget*100)+"%"} sparkData={cumulative}/>
        <KPI label="Forecast at completion" icon="trendUp" value={"$" + (totalForecast/1e6).toFixed(1)} unit="M" delta={"$" + ((totalForecast-totalBudget)/1e6).toFixed(2) + "M variance"} deltaDir={totalForecast > totalBudget ? "down" : "up"}/>
        <KPI label="Margin" icon="target" value="14.2%" delta="Target 12%" deltaDir="up"/>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1.4fr 1fr" }}>
        <div className="card">
          <CardH title="Monthly burn rate" subtitle="Across all active projects · USD M"/>
          <Bars w={500} h={140} barW={32} gap={10} values={burnByMonth} labels={months}
                colors={burnByMonth.map((_,i)=> i === burnByMonth.length-1 ? "var(--accent)" : "var(--ink-5)")}/>
          <div className="row" style={{ justifyContent: "space-between", marginTop: 8, fontSize: 11, color: "var(--ink-3)" }}>
            <span>Last 10 months</span>
            <span>Total: <span className="mono">${cumulative[cumulative.length-1].toFixed(1)}M</span></span>
          </div>
        </div>

        <div className="card">
          <CardH title="Forecast variance" subtitle="By project"/>
          <div className="col" style={{ gap: 8 }}>
            {DB.projects.map(p => {
              const c = DB.costs.find(c => c.project_id === p.project_id);
              const vPct = c.variance / p.budget * 100;
              const color = vPct > 2 ? "var(--red)" : vPct > 0 ? "var(--amber)" : "var(--green)";
              return (
                <div key={p.project_id} className="row" style={{ gap: 10 }}>
                  <span className="mono tiny muted" style={{ width: 60 }}>{p.project_code}</span>
                  <span style={{ fontSize: 12.5, flex: 1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.project_name}</span>
                  <span className="mono tiny" style={{ color, width: 70, textAlign:"right" }}>{c.variance > 0 ? "+" : ""}${(c.variance/1000).toFixed(0)}K</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="card flush">
        <div className="table-head">
          <div className="table-head-l">
            <h3 className="card-title">Project cost summary</h3>
            <div className="muted tiny">Click a row to open the project's cost engine</div>
          </div>
          <button className="btn sm"><Ico name="filter" size={12}/>Filter</button>
        </div>
        <table className="data">
          <thead>
            <tr>
              <th>Project</th><th>Client</th>
              <th className="num">Budget</th><th className="num">Committed</th><th className="num">Spent</th><th className="num">Forecast</th><th className="num">Variance</th><th>Health</th>
            </tr>
          </thead>
          <tbody>
            {DB.projects.map(p => {
              const c = DB.costs.find(c => c.project_id === p.project_id);
              return (
                <tr key={p.project_id} onClick={() => navTo("projects/" + p.project_id + "/cost")}>
                  <td>
                    <div className="cell-strong">{p.project_name}</div>
                    <div className="cell-sub mono">{p.project_code}</div>
                  </td>
                  <td>{p.client}</td>
                  <td className="num cell-num">${(c.budget/1e6).toFixed(2)}M</td>
                  <td className="num cell-num">${(c.committed/1e6).toFixed(2)}M</td>
                  <td className="num cell-num">${(c.spent/1e6).toFixed(2)}M</td>
                  <td className="num cell-num">${(c.forecast/1e6).toFixed(2)}M</td>
                  <td className="num cell-num" style={{ color: c.variance > 0 ? "var(--red)" : "var(--green)" }}>{c.variance > 0 ? "+" : ""}${(c.variance/1000).toFixed(0)}K</td>
                  <td>
                    <span style={{ display:"inline-block", width: 10, height: 10, borderRadius:"50%", background: p.health === "green" ? "var(--green)" : p.health === "amber" ? "var(--amber)" : "var(--red)" }}/>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {createOpen && <CreateRecordModal
        title="New cost line"
        subtitle="Add a cost line to the project ledger. Updates committed and forecast figures."
        submitLabel="Add cost line"
        onClose={() => setCreateOpen(false)}
        fields={[
          { name: "project", label: "Project", type: "select", required: true, options: DB.projects.map(p => ({ value: p.project_id, label: p.project_code })) },
          { name: "package", label: "Cost package", type: "select", options: ["P1 — Civil","P2 — Structures","P3 — MEP","P4 — Architecture","P5 — Marine","P6 — PMC","P7 — Contingency"], default: "P1 — Civil" },
          { name: "description", label: "Description", required: true, span: 2, placeholder: "e.g. Additional CPT campaign" },
          { name: "type", label: "Type", type: "select", options: ["Labour","Materials","Subcontract","Vendor","Travel","Equipment"], default: "Labour" },
          { name: "vendor", label: "Vendor / supplier", placeholder: "(optional)" },
          { name: "amount", label: "Amount (USD)", type: "number", placeholder: "125000" },
          { name: "currency", label: "Currency", type: "select", options: ["USD","EUR","GBP","DKK","QAR"], default: "USD" },
          { name: "committed", label: "PO date", type: "date" },
          { name: "spent", label: "Invoice date", type: "date" },
        ]}
      />}
      {exportOpen && <ExportModal title="Export cost report" entity="projects" count={DB.projects.length} onClose={() => setExportOpen(false)}/>}
    </div>
  );
}

window.ScreenGantt = ScreenGantt;
window.ScreenCost = ScreenCost;
