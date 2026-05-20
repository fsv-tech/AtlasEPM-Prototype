// ============================================
// Helix PM — Plan modules (Look Ahead, Visual Planning)
// ============================================

function LookAhead({ onNav }) {
  const [horizon, setHorizon] = React.useState("5");
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Plan · Look ahead"
        title="Look ahead"
        subtitle="A rolling 3 / 5 / 8-week production preview, agreed weekly with the contractor and circulated each Friday."
        actions={<>
          <div className="chips">
            {["3","5","8"].map(h => (
              <button key={h} className={"chip" + (horizon===h?" active":"")} onClick={()=>setHorizon(h)}>{h} weeks</button>
            ))}
          </div>
          <button className="btn"><Icon name="download" size={14}/>Export PDF</button>
          <button className="btn accent"><Icon name="plus" size={14}/>Add task</button>
        </>}
      />
      <SummaryStrip stats={[
        { label: "Wk 21 active",       value: HX.lookahead.weeks.find(w=>w.current).tasks.length, sub: "tasks underway" },
        { label: "Completed wk 20",    value: HX.lookahead.weeks[0].tasks.length, sub: "vs. plan" },
        { label: "Lookahead horizon",  value: horizon, unit: " wk", sub: "rolling" },
        { label: "Crew on site",       value: 84, sub: "Mon 18 May" },
      ]}/>

      <div className="la-board">
        {HX.lookahead.weeks.slice(0, parseInt(horizon)).map((w, i) => (
          <div key={i} className="la-col" style={w.current ? { borderColor: "var(--ink)", boxShadow: "var(--shadow-md)"} : null}>
            <div className="la-col-h">
              <div>
                <div className="wk">{w.wk}</div>
                <div className="dt">{w.dates}</div>
              </div>
              {w.current && <span className="badge warm" style={{fontSize: 10}}>NOW</span>}
            </div>
            {w.tasks.map((t, j) => (
              <div key={j} className="la-task" style={t.state === "done" ? { opacity: 0.6 } : null}>
                <div className="row" style={{justifyContent:"space-between"}}>
                  <span className="badge outline" style={{fontSize: 10}}>{t.tag}</span>
                  {t.state === "done" && <Icon name="check" size={12}/>}
                  {t.state === "active" && <span className="dot" style={{background:"var(--accent)"}}/>}
                </div>
                <div className="la-task-title" style={t.state === "done" ? { textDecoration: "line-through" } : null}>{t.t}</div>
                <div className="la-task-meta">
                  <Avatar name={t.who} size="sm"/>
                  <span className="mono">{t.state === "done" ? "Completed" : t.state === "active" ? "In progress" : "Planned"}</span>
                </div>
              </div>
            ))}
            <button className="btn ghost sm" style={{justifyContent:"center", marginTop:"auto", color:"var(--ink-4)"}}>
              <Icon name="plus" size={12}/> Add task
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-h">
          <h3 className="card-title">Constraints & promises this week</h3>
          <button className="card-action">View log <Icon name="arrow-right" size={12}/></button>
        </div>
        <table className="data">
          <thead><tr><th>Constraint</th><th>Owner</th><th>Promise date</th><th>Status</th></tr></thead>
          <tbody>
            {[
              { t: "Crane permit C3 — night lift", who: "AV", date: "2026-05-21", s: "Open" },
              { t: "Steel delivery sec. A1 — 14 panels", who: "EK", date: "2026-05-20", s: "In Progress" },
              { t: "Heritage facade tilt data wk 20", who: "JS", date: "2026-05-19", s: "Done" },
              { t: "RFI-217 reply (CP wall cover)",  who: "RB", date: "2026-05-22", s: "Overdue" },
              { t: "Signalling design freeze (interface)", who: "MT", date: "2026-05-24", s: "Open" },
            ].map((c, i) => (
              <tr key={i}>
                <td className="cell-strong">{c.t}</td>
                <td><div className="row" style={{gap:8}}><Avatar name={c.who} size="sm"/><span className="muted tiny">{c.who}</span></div></td>
                <td className="cell-num">{fmtDate(c.date)}</td>
                <td><span className={"badge " + statusClass(c.s)}><span className="dot"/>{c.s}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function VisualPlanning() {
  const months = HX.visualPlanning.months;
  const colW = 80;
  const today = 1; // index of "current" month
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Plan · Visual planning"
        title="Visual planning"
        subtitle="Programme-of-record, broken into packages. Drag a bar to reschedule; pinch the gridlines to re-bin time."
        actions={<>
          <div className="chips">
            <button className="chip active">Months</button>
            <button className="chip">Weeks</button>
            <button className="chip">Days</button>
          </div>
          <button className="btn"><Icon name="filter" size={14}/>Section A</button>
          <button className="btn accent"><Icon name="plus" size={14}/>Add bar</button>
        </>}
      />

      <SummaryStrip stats={[
        { label: "Packages", value: HX.visualPlanning.rows.length, sub: "active workstreams" },
        { label: "Today",    value: "Wk 21",  sub: "18 May 2026" },
        { label: "Float",    value: "+14",    unit: "d", sub: "marine works window" },
        { label: "Slip",     value: "-3",     unit: "d", sub: "vs. last month", delta: "down" },
      ]}/>

      <div className="gantt">
        {/* header */}
        <div style={{display:"grid", gridTemplateColumns: `220px repeat(${months.length}, ${colW}px)`, alignItems:"center"}}>
          <div style={{padding:"14px 16px", borderRight:"1px solid var(--line)", borderBottom:"1px solid var(--line)", background:"var(--surface-2)", fontSize:11, color:"var(--ink-4)", letterSpacing:".14em", textTransform:"uppercase"}}>Package</div>
          {months.map((m,i) => (
            <div key={i} style={{padding:"14px 8px", borderBottom:"1px solid var(--line)", borderRight:"1px solid var(--line)", fontSize:11, color: i===today?"var(--ink)":"var(--ink-4)", letterSpacing:".06em", textTransform:"uppercase", textAlign:"center", background: i===today ? "var(--accent-soft)" : "var(--surface-2)"}}>
              {m}
            </div>
          ))}
        </div>
        {HX.visualPlanning.rows.map(row => (
          <div key={row.id} style={{display:"grid", gridTemplateColumns: `220px repeat(${months.length}, ${colW}px)`, alignItems:"center", position:"relative"}}>
            <div style={{padding:"14px 16px", borderRight:"1px solid var(--line)", borderBottom:"1px solid var(--line)", background:"var(--surface-2)"}}>
              <div className="row" style={{gap:8}}>
                <span style={{width:8, height:8, borderRadius:2, background: row.color}}/>
                <span style={{fontSize:12.5}}>{row.name}</span>
              </div>
              <div className="mono tiny muted" style={{marginTop:2}}>{row.id}</div>
            </div>
            {months.map((_, i) => (
              <div key={i} style={{borderRight: "1px solid var(--line)", borderBottom:"1px solid var(--line)", height: 52, background: i===today ? "rgba(255,106,77,0.04)" : "transparent"}}/>
            ))}
            {row.bars.map((b, j) => {
              const left = 220 + b.s * colW + 4;
              const w = (b.e - b.s + 1) * colW - 8;
              return (
                <div key={j} style={{
                  position:"absolute",
                  left, top: 14,
                  width: w, height: 24,
                  borderRadius: 6,
                  background: row.color,
                  color: "#fff",
                  fontSize: 11.5,
                  padding: "4px 10px",
                  display:"flex", alignItems:"center",
                  whiteSpace:"nowrap", overflow:"hidden",
                  boxShadow: "0 2px 6px rgba(20,23,43,0.12)",
                }}>{b.label}</div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Milestones strip */}
      <div className="card">
        <div className="card-h"><h3 className="card-title">Key milestones</h3><span className="muted tiny">Float colour-coded</span></div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap:12}}>
          {[
            { ms:"M-10", t:"TBM launch", d:"2025-08-12", float:"+18d", state:"done" },
            { ms:"M-11", t:"Shaft S1 lined", d:"2026-02-04", float:"+9d", state:"done" },
            { ms:"M-12", t:"TBM ring 430", d:"2026-06-03", float:"+5d", state:"active" },
            { ms:"M-13", t:"PSD plinth handover", d:"2026-07-04", float:"+2d", state:"plan" },
            { ms:"M-14", t:"Section A T&C", d:"2027-03-30", float:"-3d", state:"risk" },
          ].map(m => (
            <div key={m.ms} className="card" style={{padding: 14, borderColor: m.state==="risk"?"var(--rose)":"var(--line)"}}>
              <div className="row" style={{justifyContent:"space-between"}}>
                <span className="mono tiny muted">{m.ms}</span>
                <span className={"badge " + (m.state==="done"?"success":m.state==="active"?"warm":m.state==="risk"?"danger":"neutral")} style={{fontSize:10}}>{m.float}</span>
              </div>
              <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 18, marginTop: 6, lineHeight: 1.1}}>{m.t}</div>
              <div className="muted tiny mono" style={{marginTop:4}}>{fmtDate(m.d)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

window.LookAhead = LookAhead;
window.VisualPlanning = VisualPlanning;
