// ============================================
// Helix PM — Control modules
//   Risks · Actions · Interfaces · Technical Queries
// ============================================

function Risks() {
  const [filter, setFilter] = React.useState("All");
  const [selected, setSelected] = React.useState(null);

  const filtered = HX.risks.filter(r => {
    if (filter === "All") return true;
    if (filter === "Open") return r.status === "Open";
    if (filter === "Mitigated") return r.status === "Mitigated";
    if (filter === "Closed") return r.status === "Closed";
    return r.category === filter;
  });

  const score = (r) => r.L * r.I;
  const cellColor = (L, I) => {
    const s = L*I;
    if (s >= 15) return "var(--rose)";
    if (s >= 10) return "var(--accent)";
    if (s >= 5) return "var(--amber)";
    return "var(--success-soft)";
  };
  const scoreColor = (s) => s >= 15 ? "var(--rose)" : s >= 10 ? "var(--accent)" : s >= 5 ? "var(--amber)" : "var(--success)";

  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Control · Risk register"
        title="Risks"
        subtitle="Live register with 5×5 likelihood × impact matrix. Linked to the action register and minutes of meeting."
        actions={<>
          <button className="btn"><Icon name="download" size={14}/>Export</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New risk</button>
        </>}
      />

      <SummaryStrip stats={[
        { label: "Open", value: HX.risks.filter(r=>r.status==="Open").length, sub: "active risks" },
        { label: "High score (≥15)", value: HX.risks.filter(r=> r.L*r.I >= 15 && r.status === "Open").length, sub: "needs mitigation", delta:"down" },
        { label: "Rising trend", value: HX.risks.filter(r=>r.trend==="rising" && r.status==="Open").length, sub: "vs. last review" },
        { label: "Closed wk 20", value: 1, sub: "this period" },
      ]}/>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1.4fr", gap: 14}}>
        {/* Matrix */}
        <div className="card">
          <div className="card-h">
            <h3 className="card-title">Heatmap</h3>
            <span className="muted tiny">Click a cell to filter</span>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"24px repeat(5, 1fr)", gridTemplateRows:"repeat(5, 1fr) 18px", gap: 4}}>
            {[5,4,3,2,1].map(I => (
              <React.Fragment key={I}>
                <div style={{display:"grid", placeItems:"center", fontSize: 10, color:"var(--ink-4)", fontFamily:"var(--font-mono)"}}>{I}</div>
                {[1,2,3,4,5].map(L => {
                  const cellRisks = HX.risks.filter(r => r.L === L && r.I === I && r.status === "Open");
                  return (
                    <div key={L} style={{
                      background: cellColor(L,I),
                      opacity: L*I >= 10 ? 0.95 : L*I >= 5 ? 0.85 : 0.4,
                      borderRadius: 8, padding: 8,
                      color: L*I >= 10 ? "#fff" : "var(--ink-2)",
                      minHeight: 64, cursor: "pointer",
                      display:"flex", flexDirection:"column", justifyContent:"space-between",
                    }}>
                      <span className="mono" style={{fontSize:10, opacity: 0.8}}>{L*I}</span>
                      {cellRisks.length > 0 && (
                        <div className="row" style={{gap:4, flexWrap:"wrap"}}>
                          {cellRisks.slice(0,3).map(r => <span key={r.id} className="mono" style={{fontSize: 9.5, background:"rgba(255,255,255,0.25)", padding:"1px 5px", borderRadius:3}}>{r.id.replace("R-","")}</span>)}
                          {cellRisks.length > 3 && <span className="mono" style={{fontSize:9.5}}>+{cellRisks.length-3}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
            <div/>
            {[1,2,3,4,5].map(n => <div key={n} style={{textAlign:"center", fontSize: 10, color:"var(--ink-4)", fontFamily:"var(--font-mono)"}}>{n}</div>)}
          </div>
          <div className="row" style={{justifyContent:"space-between", marginTop: 8, fontSize: 10, color:"var(--ink-4)", letterSpacing:".12em", textTransform:"uppercase"}}>
            <span>Impact ↑</span>
            <span>Likelihood →</span>
          </div>

          <div className="divider" style={{margin: "14px 0"}}/>
          <h4 className="card-title-sm" style={{marginBottom: 10}}>Category mix</h4>
          {Object.entries(HX.risks.reduce((acc, r) => { acc[r.category]=(acc[r.category]||0)+1; return acc; }, {})).sort((a,b)=>b[1]-a[1]).map(([cat, n]) => (
            <div key={cat} className="row" style={{justifyContent:"space-between", padding:"5px 0", fontSize:12}}>
              <span>{cat}</span>
              <div className="row" style={{gap: 8, width: 140, justifyContent:"flex-end"}}>
                <div className="progress" style={{width: 80}}><span style={{width: (n/HX.risks.length*100)+"%", background:"var(--indigo)"}}/></div>
                <span className="mono tiny">{n}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Register list */}
        <div className="card flush">
          <div className="table-head">
            <div className="table-head-l">
              <h3 className="card-title">Register</h3>
              <div className="muted tiny">{filtered.length} of {HX.risks.length}</div>
            </div>
            <div className="table-head-r">
              <div className="chips">
                {["All","Open","Mitigated","Closed"].map(f => (
                  <button key={f} className={"chip" + (filter===f?" active":"")} onClick={()=>setFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
          </div>
          <table className="data">
            <thead><tr><th>ID</th><th>Risk</th><th>Owner</th><th>L</th><th>I</th><th>Score</th><th>Trend</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} onClick={()=>setSelected(r)} className={selected?.id===r.id?"selected":""}>
                  <td className="cell-id">{r.id}</td>
                  <td>
                    <div className="cell-strong">{r.title}</div>
                    <div className="cell-sub">{r.category}</div>
                  </td>
                  <td><Avatar name={r.owner} size="sm"/></td>
                  <td className="cell-num">{r.L}</td>
                  <td className="cell-num">{r.I}</td>
                  <td>
                    <span style={{
                      display:"inline-flex", width:30, height:24, alignItems:"center", justifyContent:"center",
                      background: scoreColor(score(r)) + "22", color: scoreColor(score(r)), borderRadius: 6,
                      fontFamily:"var(--font-mono)", fontWeight: 600, fontSize: 12,
                    }}>{score(r)}</span>
                  </td>
                  <td>
                    <span className="tiny" style={{color: r.trend==="rising"?"var(--rose)":r.trend==="falling"?"var(--success)":"var(--ink-3)"}}>
                      {r.trend === "rising" ? "↗" : r.trend === "falling" ? "↘" : "→"} {r.trend}
                    </span>
                  </td>
                  <td><span className={"badge " + statusClass(r.status)} style={{fontSize:10}}><span className="dot"/>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <Drawer onClose={()=>setSelected(null)} title={`${selected.id} · ${selected.category}`}>
          <h2 style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 26, letterSpacing:"-0.01em", lineHeight: 1.15, margin:"4px 0 14px"}}>{selected.title}</h2>
          <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap: 10, marginBottom: 18}}>
            <Stat label="Likelihood" value={selected.L}/>
            <Stat label="Impact" value={selected.I}/>
            <Stat label="Score" value={selected.L*selected.I} color={scoreColor(selected.L*selected.I)}/>
            <Stat label="Owner" value={<Avatar name={selected.owner} size="sm"/>}/>
          </div>
          <Field label="Mitigation">{selected.mitigation}</Field>
          <Field label="Review date">{fmtDate(selected.due)}</Field>
          <Field label="Status"><span className={"badge " + statusClass(selected.status)}><span className="dot"/>{selected.status}</span></Field>
          <Field label="Linked actions">
            {HX.actions.filter(a => a.linked === selected.id).map(a => (
              <div key={a.id} className="row" style={{gap: 8, padding: "6px 0", borderBottom:"1px solid var(--line)"}}>
                <span className="mono tiny muted">{a.id}</span>
                <span style={{fontSize:12.5, flex:1}}>{a.title}</span>
                <span className={"badge " + statusClass(a.status)} style={{fontSize:10}}>{a.status}</span>
              </div>
            ))}
            {HX.actions.filter(a => a.linked === selected.id).length === 0 && <span className="muted tiny">No linked actions.</span>}
          </Field>
        </Drawer>
      )}
    </div>
  );
}

function ActionRegister() {
  const [filter, setFilter] = React.useState("All");
  const filtered = HX.actions.filter(a => filter === "All" ? true : a.status === filter);
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Control · Actions"
        title="Action register"
        subtitle="Every promise made on the project — by whom, by when, for what."
        actions={<>
          <button className="btn"><Icon name="download" size={14}/>Export</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New action</button>
        </>}
      />
      <SummaryStrip stats={[
        { label: "Open",       value: HX.actions.filter(a=>a.status!=="Done").length },
        { label: "Overdue",    value: HX.actions.filter(a=>a.status==="Overdue").length, sub:"red flag", delta:"down" },
        { label: "Due wk 21",  value: HX.actions.filter(a=>daysFromNow(a.due) >= 0 && daysFromNow(a.due) <= 7 && a.status !== "Done").length, sub:"this week" },
        { label: "Closed wk 20", value: HX.actions.filter(a=>a.status==="Done").length, sub:"completed" },
      ]}/>

      <div className="card flush">
        <div className="table-head">
          <div className="table-head-l">
            <h3 className="card-title">All actions</h3>
            <div className="muted tiny">Linked to risks, MoMs and TQs</div>
          </div>
          <div className="table-head-r">
            <div className="chips">
              {["All","Open","In Progress","Overdue","Done"].map(f => (
                <button key={f} className={"chip" + (filter===f?" active":"")} onClick={()=>setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
        </div>
        <table className="data">
          <thead><tr><th>ID</th><th>Action</th><th>Owner</th><th>Raised</th><th>Due</th><th>Priority</th><th>Source</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(a => {
              const d = daysFromNow(a.due);
              return (
                <tr key={a.id}>
                  <td className="cell-id">{a.id}</td>
                  <td>
                    <div className="cell-strong">{a.title}</div>
                    <div className="cell-sub row" style={{gap: 6}}>
                      <Icon name="link" size={10}/> {a.linked}
                    </div>
                  </td>
                  <td><Avatar name={a.owner} size="sm"/></td>
                  <td className="cell-num">{fmtDate(a.raised)}</td>
                  <td>
                    <span className="cell-num">{fmtDate(a.due)}</span>
                    <div className="cell-sub" style={{color: d<0?"var(--rose)":d<=3?"var(--accent)":"var(--ink-3)"}}>
                      {a.status === "Done" ? "closed" : d < 0 ? `${Math.abs(d)}d overdue` : d === 0 ? "today" : `in ${d}d`}
                    </div>
                  </td>
                  <td><span className={"badge " + priorityClass(a.priority)} style={{fontSize:10}}>{a.priority}</span></td>
                  <td className="muted tiny">{a.source}</td>
                  <td><span className={"badge " + statusClass(a.status)} style={{fontSize:10}}><span className="dot"/>{a.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Interfaces() {
  const [filter, setFilter] = React.useState("All");
  const filtered = HX.interfaces.filter(i => filter === "All" ? true : i.status === filter);
  // discipline pair distribution
  const disciplines = ["Civil","Structures","Geotech","MEP","Systems","Architecture","Utilities","Fire","Logistics"];
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Control · Interface register"
        title="Interface register"
        subtitle="Every handover between disciplines. Click a node to see the full chain."
        actions={<>
          <button className="btn"><Icon name="download" size={14}/>Export</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New interface</button>
        </>}
      />
      <SummaryStrip stats={[
        { label:"Total", value: HX.interfaces.length },
        { label:"Open",  value: HX.interfaces.filter(i=>i.status==="Open").length, sub:"unresolved" },
        { label:"In progress", value: HX.interfaces.filter(i=>i.status==="In Progress").length },
        { label:"Closed", value: HX.interfaces.filter(i=>i.status==="Closed").length, sub:"agreed" },
      ]}/>

      {/* Interface graph (chord-ish) */}
      <div className="card">
        <div className="card-h">
          <h3 className="card-title">Interface graph</h3>
          <span className="muted tiny">Edge weight = open interfaces</span>
        </div>
        <InterfaceGraph disciplines={disciplines} interfaces={HX.interfaces}/>
      </div>

      <div className="card flush">
        <div className="table-head">
          <div className="table-head-l">
            <h3 className="card-title">Register</h3>
            <div className="muted tiny">{filtered.length} of {HX.interfaces.length}</div>
          </div>
          <div className="table-head-r">
            <div className="chips">
              {["All","Open","In Progress","Closed"].map(f => (
                <button key={f} className={"chip" + (filter===f?" active":"")} onClick={()=>setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
        </div>
        <table className="data">
          <thead><tr><th>ID</th><th>Interface</th><th>Owners</th><th>Description</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(i => (
              <tr key={i.id}>
                <td className="cell-id">{i.id}</td>
                <td>
                  <div className="row" style={{gap: 8, alignItems:"center"}}>
                    <span style={{fontSize:12.5}}>{i.a}</span>
                    <Icon name="arrow-right" size={11}/>
                    <span style={{fontSize:12.5}}>{i.b}</span>
                  </div>
                </td>
                <td>
                  <AvatarStack names={i.owner.split(" / ")} size="sm"/>
                </td>
                <td className="muted" style={{fontSize: 12.5, maxWidth: 280}}>{i.desc}</td>
                <td className="cell-num">{fmtDate(i.due)}</td>
                <td><span className={"badge " + statusClass(i.status)} style={{fontSize:10}}><span className="dot"/>{i.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InterfaceGraph({ disciplines, interfaces }) {
  // place disciplines around a circle and draw chord-ish curves for each open interface
  const w = 700, h = 320, cx = w/2, cy = h/2 + 10, r = 130;
  const positions = disciplines.map((d, i) => {
    const ang = (i / disciplines.length) * Math.PI * 2 - Math.PI/2;
    return { name: d, x: cx + Math.cos(ang) * r, y: cy + Math.sin(ang) * r, ang };
  });
  const findIdx = (s) => positions.findIndex(p => s.includes(p.name));
  const color = (status) => status === "Closed" ? "var(--success)" : status === "In Progress" ? "var(--indigo)" : "var(--amber)";

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{maxHeight: 340}}>
      {/* curves */}
      {interfaces.map((i, idx) => {
        const ai = findIdx(i.a), bi = findIdx(i.b);
        if (ai < 0 || bi < 0) return null;
        const a = positions[ai], b = positions[bi];
        return (
          <path key={idx}
            d={`M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`}
            stroke={color(i.status)} strokeWidth="1.4" fill="none"
            opacity="0.5"/>
        );
      })}
      {/* discipline nodes */}
      {positions.map(p => (
        <g key={p.name} transform={`translate(${p.x}, ${p.y})`}>
          <circle r="22" fill="var(--surface)" stroke="var(--line)"/>
          <text textAnchor="middle" dy="-30" fontSize="11" fill="var(--ink-2)" fontFamily="var(--font-sans)">{p.name}</text>
          <text textAnchor="middle" dy="4" fontSize="11" fontFamily="var(--font-mono)" fill="var(--ink)">
            {interfaces.filter(i => i.a.includes(p.name) || i.b.includes(p.name)).length}
          </text>
        </g>
      ))}
    </svg>
  );
}

function TQs() {
  const [filter, setFilter] = React.useState("All");
  const filtered = HX.tqs.filter(t => filter === "All" ? true : t.status === filter);
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Control · Technical queries"
        title="Technical queries"
        subtitle="Formal requests for engineer's clarification. Every reply becomes an assumption or clarification."
        actions={<>
          <button className="btn"><Icon name="download" size={14}/>Export</button>
          <button className="btn accent"><Icon name="plus" size={14}/>Raise TQ</button>
        </>}
      />
      <SummaryStrip stats={[
        { label:"Open",  value: HX.tqs.filter(t=>t.status==="Open").length },
        { label:"In progress", value: HX.tqs.filter(t=>t.status==="In Progress").length },
        { label:"Closed wk 20", value: 2, sub:"this period" },
        { label:"Avg. response", value: 4.2, unit:"d", sub:"target ≤ 7 d", delta:"up" },
      ]}/>

      {/* discipline breakdown */}
      <div style={{display:"grid", gridTemplateColumns:"1.4fr 1fr", gap: 14}}>
        <div className="card flush">
          <div className="table-head">
            <div className="table-head-l">
              <h3 className="card-title">Queries</h3>
              <div className="muted tiny">{filtered.length} of {HX.tqs.length}</div>
            </div>
            <div className="table-head-r">
              <div className="chips">
                {["All","Open","In Progress","Closed"].map(f => (
                  <button key={f} className={"chip" + (filter===f?" active":"")} onClick={()=>setFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
          </div>
          <table className="data">
            <thead><tr><th>ID</th><th>Query</th><th>Disc.</th><th>Raised</th><th>Due</th><th>Priority</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td className="cell-id">{t.id}</td>
                  <td>
                    <div className="cell-strong">{t.title}</div>
                    <div className="cell-sub">{t.from} → {t.to}</div>
                  </td>
                  <td><span className="badge outline" style={{fontSize:10}}>{t.discipline}</span></td>
                  <td className="cell-num">{fmtDate(t.raised)}</td>
                  <td className="cell-num">{fmtDate(t.due)}</td>
                  <td><span className={"badge " + priorityClass(t.priority)} style={{fontSize:10}}>{t.priority}</span></td>
                  <td><span className={"badge " + statusClass(t.status)} style={{fontSize:10}}><span className="dot"/>{t.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-h"><h3 className="card-title">By discipline</h3></div>
          {Object.entries(HX.tqs.reduce((acc, t) => { acc[t.discipline] = (acc[t.discipline]||0)+1; return acc; }, {})).sort((a,b)=>b[1]-a[1]).map(([d, n]) => {
            const open = HX.tqs.filter(t=>t.discipline===d && t.status!=="Closed").length;
            return (
              <div key={d} style={{padding: "10px 0", borderBottom:"1px solid var(--line)"}}>
                <div className="row" style={{justifyContent:"space-between", marginBottom: 4}}>
                  <span style={{fontSize:13}}>{d}</span>
                  <span className="mono tiny">{open}/{n}</span>
                </div>
                <div className="progress"><span style={{width: (open/n*100) + "%", background: open ? "var(--amber)" : "var(--success)"}}/></div>
              </div>
            );
          })}

          <h4 className="card-title-sm" style={{marginTop: 18, marginBottom: 8}}>Response time (days)</h4>
          <Bars values={[3,5,4,2,4,6,5,3,4,5,7,4]} labels={["W9","W10","W11","W12","W13","W14","W15","W16","W17","W18","W19","W20"]} w={320} h={70} color="var(--indigo)"/>
        </div>
      </div>
    </div>
  );
}

window.Risks = Risks;
window.ActionRegister = ActionRegister;
window.Interfaces = Interfaces;
window.TQs = TQs;
