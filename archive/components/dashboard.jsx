// ============================================
// Helix PM — Dashboard
// ============================================

function Dashboard({ onNav }) {
  const p = HX.active;

  // KPI mini sparklines (synthetic)
  const sparkRisk    = [12,13,15,14,16,15,17,16,15,14,13,14];
  const sparkActions = [22,24,21,23,25,24,22,21,19,18,20,19];
  const sparkSpend   = [11,15,22,28,34,38,42,49,55,62,67,71];
  const sparkProg    = [12,14,17,21,24,27,30,33,35,36,37,38];

  const openRisks    = HX.risks.filter(r => r.status === "Open");
  const topRisks     = [...openRisks].sort((a,b)=>(b.L*b.I)-(a.L*a.I)).slice(0,4);
  const openActions  = HX.actions.filter(a => a.status !== "Done");
  const overdue      = HX.actions.filter(a => a.status === "Overdue");
  const dueSoon      = HX.actions.filter(a => {
    const d = daysFromNow(a.due);
    return d >= 0 && d <= 5 && a.status !== "Done";
  });

  return (
    <div className="content">
      {/* page header */}
      <div className="page-header">
        <div>
          <div className="page-eyebrow">Project · {p.code} · Reporting period 11 — 17 May 2026</div>
          <h1 className="page-title">{p.name}</h1>
          <p className="page-subtitle">Live status across delivery, commercial, risk and compliance — drawn from the common data centre.</p>
        </div>
        <div className="row" style={{gap:8}}>
          <button className="btn"><Icon name="download" size={14}/>Weekly report</button>
          <button className="btn"><Icon name="filter" size={14}/>Wk 20</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New entry</button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="kpi-grid">
        <div className="kpi featured">
          <div className="kpi-label">Project Health</div>
          <div className="kpi-value">{p.progress}<span className="unit">%</span></div>
          <div className="kpi-foot">
            <span className="kpi-delta up"><Icon name="trend-up" size={11}/>+3.1 vs plan</span>
            <span className="kpi-arrow"><Icon name="arrow-up-right" size={14}/></span>
          </div>
          <svg style={{position:"absolute", right:-10, bottom:-10, opacity:0.18}} width="140" height="80" viewBox="0 0 140 80">
            <Sparkline data={sparkProg} color="#fff" w={140} h={80} stroke={2}/>
          </svg>
        </div>

        <div className="kpi">
          <div className="kpi-label"><span className="dot" style={{background:"var(--rose)"}}/>Open risks</div>
          <div className="kpi-value">{openRisks.length}</div>
          <div className="kpi-foot">
            <span className="kpi-delta down"><Icon name="arrow-up" size={11}/>+2 wk</span>
            <Sparkline data={sparkRisk} color="var(--rose)" w={70} h={28}/>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-label"><span className="dot" style={{background:"var(--amber)"}}/>Open actions</div>
          <div className="kpi-value">{openActions.length}<span className="unit">/ {HX.actions.length}</span></div>
          <div className="kpi-foot">
            <span className="kpi-delta up"><Icon name="arrow-down" size={11}/>-3 wk</span>
            <Sparkline data={sparkActions} color="var(--amber)" w={70} h={28}/>
          </div>
        </div>

        <div className="kpi">
          <div className="kpi-label"><span className="dot" style={{background:"var(--success)"}}/>Spend to date</div>
          <div className="kpi-value">{p.spent.toFixed(1)}<span className="unit">M DKK</span></div>
          <div className="kpi-foot">
            <span className="kpi-delta">{Math.round(p.spent/p.value*100)}% of budget</span>
            <Sparkline data={sparkSpend} color="var(--success)" w={70} h={28}/>
          </div>
        </div>
      </div>

      {/* secondary grid */}
      <div style={{display:"grid", gridTemplateColumns:"1.45fr 1fr", gap: 14}}>
        {/* Cost overview */}
        <div className="card">
          <div className="card-h">
            <div>
              <h3 className="card-title">Cost overview</h3>
              <div className="muted tiny">{HX.costEstimate.unit} · forecast vs. budget</div>
            </div>
            <button className="card-action" onClick={()=>onNav("cost")}>Open cost module <Icon name="arrow-right" size={12}/></button>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap: 12, marginBottom: 18}}>
            {[
              { l: "Budget",     v: HX.costEstimate.total,    sub: "approved" },
              { l: "Committed",  v: HX.costEstimate.committed, sub: "POs raised" },
              { l: "Spent",      v: HX.costEstimate.spent,     sub: "to date" },
              { l: "Forecast",   v: HX.costEstimate.forecast,  sub: "at completion", warn: true },
            ].map(k => (
              <div key={k.l}>
                <div className="muted tiny" style={{letterSpacing:".12em", textTransform:"uppercase"}}>{k.l}</div>
                <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 28, letterSpacing:"-0.01em", lineHeight:1.1, color: k.warn ? "var(--accent)" : "var(--ink)"}}>
                  {k.v.toFixed(1)}<span style={{fontFamily:"var(--font-sans)", fontSize:12, color:"var(--ink-3)"}}> M</span>
                </div>
                <div className="muted tiny">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* stacked bar by package */}
          <div style={{display:"flex", flexDirection:"column", gap: 10, marginTop: 8}}>
            {HX.costEstimate.packages.map(pkg => {
              const max = HX.costEstimate.total;
              return (
                <div key={pkg.code}>
                  <div style={{display:"grid", gridTemplateColumns:"22px 1fr auto auto", gap: 8, alignItems:"center", marginBottom: 4}}>
                    <span className="mono tiny muted">{pkg.code}</span>
                    <span style={{fontSize: 12.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{pkg.name}</span>
                    <span className="mono tiny muted">{pkg.spent.toFixed(1)} / {pkg.budget.toFixed(1)}</span>
                    {pkg.forecast > pkg.budget
                      ? <span className="badge danger" style={{fontSize:10}}>+{(pkg.forecast-pkg.budget).toFixed(1)}</span>
                      : <span style={{width:38}}/>}
                  </div>
                  <StackedBar segments={[
                    { label: "Spent",     value: pkg.spent,                              color: "var(--ink)" },
                    { label: "Committed", value: Math.max(0, pkg.committed - pkg.spent), color: "var(--ink-3)" },
                    { label: "Budget remaining", value: Math.max(0, pkg.budget - pkg.committed), color: "var(--surface-3)" },
                    ...(pkg.forecast > pkg.budget ? [{ label: "Forecast overrun", value: pkg.forecast - pkg.budget, color: "var(--accent)" }] : []),
                  ]}/>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk heatmap */}
        <div className="card">
          <div className="card-h">
            <div>
              <h3 className="card-title">Risk profile</h3>
              <div className="muted tiny">Likelihood × Impact · {openRisks.length} open</div>
            </div>
            <button className="card-action" onClick={()=>onNav("risks")}>Open register <Icon name="arrow-right" size={12}/></button>
          </div>
          <RiskMatrixMini risks={openRisks}/>
          <div className="row" style={{justifyContent:"space-between", marginTop: 12, fontSize: 11, color: "var(--ink-3)"}}>
            <span>Top exposures</span>
            <span>L × I</span>
          </div>
          {topRisks.map(r => (
            <div key={r.id} className="row" style={{justifyContent:"space-between", padding: "8px 0", borderBottom: "1px solid var(--line)"}}>
              <div style={{minWidth:0}}>
                <div className="row" style={{gap: 8}}>
                  <span className="mono tiny muted">{r.id}</span>
                  <span className={"badge " + (r.L*r.I >= 12 ? "danger" : r.L*r.I >= 6 ? "warn" : "neutral")} style={{fontSize:10}}>{r.L*r.I}</span>
                </div>
                <div style={{fontSize:12.5, marginTop: 2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{r.title}</div>
              </div>
              <Avatar name={r.owner} size="sm"/>
            </div>
          ))}
        </div>
      </div>

      {/* Look-ahead + Actions + Schedule */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1.1fr", gap: 14}}>
        {/* This week */}
        <div className="card">
          <div className="card-h">
            <div>
              <h3 className="card-title">This week</h3>
              <div className="muted tiny">Week 21 · 18 — 24 May</div>
            </div>
            <button className="card-action" onClick={()=>onNav("look-ahead")}>Look ahead <Icon name="arrow-right" size={12}/></button>
          </div>
          {HX.lookahead.weeks.find(w=>w.current).tasks.map((t,i) => (
            <div key={i} className="row" style={{padding: "8px 0", borderBottom: "1px solid var(--line)", gap: 10}}>
              <span style={{width:6, height:6, borderRadius:"50%", background:"var(--accent)", flexShrink:0}}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:12.5}}>{t.t}</div>
                <div className="muted tiny">{t.tag}</div>
              </div>
              <Avatar name={t.who} size="sm"/>
            </div>
          ))}
        </div>

        {/* Action funnel */}
        <div className="card">
          <div className="card-h">
            <div>
              <h3 className="card-title">Actions</h3>
              <div className="muted tiny">Status across register</div>
            </div>
            <button className="card-action" onClick={()=>onNav("actions")}>Open <Icon name="arrow-right" size={12}/></button>
          </div>
          <div style={{display:"flex", justifyContent:"center", margin:"6px 0 14px"}}>
            <Donut size={150} thickness={20} segments={[
              { value: HX.actions.filter(a => a.status === "Open").length, color: "var(--amber)" },
              { value: HX.actions.filter(a => a.status === "In Progress").length, color: "var(--indigo)" },
              { value: HX.actions.filter(a => a.status === "Overdue").length, color: "var(--rose)" },
              { value: HX.actions.filter(a => a.status === "Done").length, color: "var(--success)" },
            ]} gap={3} track="var(--surface-3)">
              <div>
                <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 28, lineHeight:1}}>{openActions.length}</div>
                <div className="muted tiny">open</div>
              </div>
            </Donut>
          </div>
          {[
            { l:"Overdue",     v: HX.actions.filter(a=>a.status==="Overdue").length,     c:"var(--rose)" },
            { l:"In progress", v: HX.actions.filter(a=>a.status==="In Progress").length, c:"var(--indigo)" },
            { l:"Open",        v: HX.actions.filter(a=>a.status==="Open").length,        c:"var(--amber)" },
            { l:"Done",        v: HX.actions.filter(a=>a.status==="Done").length,        c:"var(--success)" },
          ].map(s => (
            <div key={s.l} className="row" style={{justifyContent:"space-between", padding:"4px 0", fontSize:12}}>
              <div className="row" style={{gap:8}}><span className="dot" style={{background:s.c}}/>{s.l}</div>
              <span className="mono">{s.v}</span>
            </div>
          ))}
        </div>

        {/* Schedule glance — milestones */}
        <div className="card">
          <div className="card-h">
            <div>
              <h3 className="card-title">Milestones</h3>
              <div className="muted tiny">Next 60 days</div>
            </div>
            <button className="card-action" onClick={()=>onNav("visual-plan")}>Visual plan <Icon name="arrow-right" size={12}/></button>
          </div>
          {[
            { ms: "M-12", t: "TBM ring 430 — Section A1", date: "2026-06-03", days: 15, kind: "Production" },
            { ms: "M-13", t: "Shaft S2 waterproofing complete", date: "2026-06-22", days: 34, kind: "Civil" },
            { ms: "M-14", t: "PSD plinth handover — Sec A", date: "2026-07-04", days: 46, kind: "Systems" },
            { ms: "M-15", t: "Public consultation outcome", date: "2026-05-29", days: 10, kind: "Stakeholder" },
            { ms: "M-16", t: "Programme rev. C endorsement", date: "2026-05-26", days: 7, kind: "Planning" },
          ].map(m => (
            <div key={m.ms} className="row" style={{padding:"8px 0", borderBottom:"1px solid var(--line)", gap:10}}>
              <div style={{textAlign:"center", width: 38}}>
                <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 20, lineHeight:1}}>{m.days}</div>
                <div className="tiny muted">days</div>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontSize:12.5}}>{m.t}</div>
                <div className="muted tiny row" style={{gap: 8}}>
                  <span className="mono">{m.ms}</span>
                  <span>·</span>
                  <span>{fmtDate(m.date)}</span>
                  <span>·</span>
                  <span>{m.kind}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio + Recent docs */}
      <div style={{display:"grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
        <div className="card flush">
          <div className="card-h" style={{padding: 20, marginBottom: 0, borderBottom:"1px solid var(--line)"}}>
            <div>
              <h3 className="card-title">Portfolio</h3>
              <div className="muted tiny">All projects you manage · click to switch</div>
            </div>
            <button className="card-action"><Icon name="plus" size={12}/>Add project</button>
          </div>
          <table className="data">
            <thead><tr><th>Project</th><th>Sector</th><th>Progress</th><th>Spend</th><th>Health</th></tr></thead>
            <tbody>
              {HX.projects.map(pr => (
                <tr key={pr.id}>
                  <td>
                    <div className="row" style={{gap:10}}>
                      <span style={{width: 4, height: 28, background: pr.color, borderRadius: 2}}/>
                      <div>
                        <div className="cell-strong">{pr.name}</div>
                        <div className="cell-sub mono">{pr.code} · {pr.client}</div>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge outline">{pr.sector}</span></td>
                  <td style={{width: 160}}>
                    <div className="progress"><span style={{width: pr.progress + "%", background: pr.color}}/></div>
                    <div className="mono tiny muted" style={{marginTop:4}}>{pr.progress}%</div>
                  </td>
                  <td><span className="cell-num">{pr.spent.toFixed(1)}</span> <span className="muted tiny">/ {pr.value.toFixed(0)}M</span></td>
                  <td>
                    <span className={"badge " + (pr.health === "green" ? "success" : pr.health === "amber" ? "warn" : "danger")}>
                      <span className="dot"/>{pr.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display:"grid", gridTemplateRows:"1fr 1fr", gap: 14}}>
          {/* Variations summary */}
          <div className="card">
            <div className="card-h">
              <div>
                <h3 className="card-title">Variations</h3>
                <div className="muted tiny">Approved / pending value</div>
              </div>
              <button className="card-action" onClick={()=>onNav("variations")}>Open <Icon name="arrow-right" size={12}/></button>
            </div>
            <div className="row" style={{gap: 18, alignItems:"center"}}>
              <Donut size={108} thickness={16} segments={[
                { value: HX.variations.filter(v=>v.status==="Approved").reduce((s,v)=>s+v.value,0), color: "var(--success)" },
                { value: HX.variations.filter(v=>v.status==="In Review" || v.status==="Submitted" || v.status==="Pending").reduce((s,v)=>s+v.value,0), color: "var(--amber)" },
                { value: HX.variations.filter(v=>v.status==="Rejected").reduce((s,v)=>s+v.value,0), color: "var(--ink-4)" },
              ]} gap={3}>
                <div>
                  <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 22, lineHeight: 1}}>
                    {HX.variations.reduce((s,v)=>s+v.value,0).toFixed(1)}
                  </div>
                  <div className="muted tiny">M DKK</div>
                </div>
              </Donut>
              <div style={{flex:1, display:"flex", flexDirection:"column", gap:6}}>
                {[
                  { l:"Approved", v: HX.variations.filter(v=>v.status==="Approved").reduce((s,v)=>s+v.value,0), c:"var(--success)" },
                  { l:"Pending",  v: HX.variations.filter(v=>v.status==="In Review" || v.status==="Submitted" || v.status==="Pending").reduce((s,v)=>s+v.value,0), c:"var(--amber)" },
                  { l:"Rejected", v: HX.variations.filter(v=>v.status==="Rejected").reduce((s,v)=>s+v.value,0), c:"var(--ink-4)" },
                ].map(s => (
                  <div key={s.l} className="row" style={{justifyContent:"space-between", fontSize:12}}>
                    <div className="row" style={{gap:8}}><span className="dot" style={{background:s.c}}/>{s.l}</div>
                    <span className="mono">{s.v.toFixed(2)} M</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent documents */}
          <div className="card">
            <div className="card-h">
              <div>
                <h3 className="card-title">Latest documents</h3>
                <div className="muted tiny">Master register · most recent</div>
              </div>
              <button className="card-action" onClick={()=>onNav("docs")}>Open <Icon name="arrow-right" size={12}/></button>
            </div>
            {HX.documents.slice(0,4).map(d => (
              <div key={d.id} className="row" style={{padding:"8px 0", borderBottom:"1px solid var(--line)", gap: 10}}>
                <div style={{width:30, height:36, background:"var(--surface-3)", borderRadius:4, display:"grid", placeItems:"center", color:"var(--ink-3)", flexShrink:0}}>
                  <Icon name="doc" size={14}/>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div className="row" style={{gap:6}}>
                    <span className="mono tiny muted">{d.code}</span>
                    <span className="badge neutral" style={{fontSize:9.5, padding:"1px 6px"}}>Rev {d.rev}</span>
                  </div>
                  <div style={{fontSize:12.5, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{d.title}</div>
                </div>
                <span className={"badge " + statusClass(d.status)} style={{fontSize:10}}>{d.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom band: data centre nudge + correspondence */}
      <div style={{display:"grid", gridTemplateColumns: "1fr 1.2fr", gap: 14}}>
        <div className="card dark" style={{padding: 24, position:"relative", overflow:"hidden"}}>
          <div className="row" style={{justifyContent:"space-between", marginBottom: 16}}>
            <span className="badge" style={{background:"rgba(255,255,255,0.1)", color:"var(--bg)"}}>
              <span className="dot" style={{background:"var(--accent)"}}/>Common Data Centre
            </span>
            <button className="card-action" style={{color:"var(--bg)"}} onClick={()=>onNav("data-centre")}>Open <Icon name="arrow-right" size={12}/></button>
          </div>
          <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 32, lineHeight: 1.05, letterSpacing:"-0.01em", marginBottom: 12}}>
            One source of truth.<br/>
            <span style={{color:"rgba(245,243,238,0.55)"}}>Every register pulls from here.</span>
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:14, marginTop: 16}}>
            {[
              { l: "Documents", v: HX.documents.length },
              { l: "Team",      v: HX.team.length },
              { l: "Assumptions", v: HX.aec.length },
            ].map(s => (
              <div key={s.l} style={{borderTop: "1px solid rgba(245,243,238,0.18)", paddingTop: 10}}>
                <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 26}}>{s.v}</div>
                <div className="tiny" style={{color:"rgba(245,243,238,0.6)"}}>{s.l}</div>
              </div>
            ))}
          </div>
          {/* decorative grid */}
          <svg style={{position:"absolute", right:-30, top:-30, opacity:0.08}} width="220" height="220" viewBox="0 0 220 220">
            {Array.from({length:11}).map((_,i)=>(
              <line key={"v"+i} x1={i*22} y1="0" x2={i*22} y2="220" stroke="#fff"/>
            ))}
            {Array.from({length:11}).map((_,i)=>(
              <line key={"h"+i} x1="0" y1={i*22} x2="220" y2={i*22} stroke="#fff"/>
            ))}
          </svg>
        </div>

        <div className="card">
          <div className="card-h">
            <div>
              <h3 className="card-title">Latest correspondence</h3>
              <div className="muted tiny">In/out · last 7 days</div>
            </div>
            <button className="card-action" onClick={()=>onNav("correspondence")}>Open <Icon name="arrow-right" size={12}/></button>
          </div>
          {HX.correspondence.slice(0,5).map(c => (
            <div key={c.id} className="row" style={{padding:"10px 0", borderBottom:"1px solid var(--line)", gap: 10}}>
              <div style={{width: 28, height: 28, borderRadius: "50%", background: c.status === "Sent" ? "var(--indigo-soft)" : "var(--accent-soft)", color: c.status === "Sent" ? "var(--indigo)" : "var(--accent)", display:"grid", placeItems:"center", flexShrink: 0}}>
                <Icon name={c.status === "Sent" ? "send" : "mail"} size={12}/>
              </div>
              <div style={{flex:1, minWidth:0}}>
                <div className="row" style={{gap:8}}>
                  <span className="mono tiny muted">{c.id}</span>
                  <span className="tiny" style={{color:"var(--ink-3)"}}>{c.from}</span>
                </div>
                <div style={{fontSize:12.5, marginTop:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>{c.subject}</div>
              </div>
              <span className="tiny muted">{fmtDate(c.date)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Small risk matrix on dashboard
function RiskMatrixMini({ risks }) {
  // 5x5 grid: rows = Impact 5..1, cols = Likelihood 1..5
  const cells = Array.from({length: 5}, () => Array.from({length: 5}, () => []));
  risks.forEach(r => {
    cells[5 - r.I][r.L - 1].push(r);
  });
  const colorFor = (L, I) => {
    const s = L * I;
    if (s >= 15) return "var(--rose)";
    if (s >= 10) return "var(--accent)";
    if (s >= 5)  return "var(--amber)";
    return "var(--success-soft)";
  };
  return (
    <div style={{display:"grid", gridTemplateColumns:"24px repeat(5, 1fr)", gridTemplateRows:"repeat(5, 1fr) 18px", gap: 4, marginTop: 4}}>
      {cells.map((row, ri) => (
        <React.Fragment key={ri}>
          <div className="risk-axis" style={{display:"grid", placeItems:"center", fontSize:10, color:"var(--ink-4)"}}>{5-ri}</div>
          {row.map((items, ci) => {
            const L = ci+1, I = 5-ri;
            const s = L*I;
            return (
              <div key={ci} style={{
                background: colorFor(L,I),
                opacity: s>=10 ? 0.95 : s>=5 ? 0.85 : 0.4,
                borderRadius: 6, minHeight: 36, padding: 4,
                color: s>=10 ? "#fff" : "var(--ink-2)",
                fontSize: 10, fontFamily: "var(--font-mono)",
                display:"flex", alignItems:"flex-end", justifyContent:"flex-end",
              }}>
                {items.length > 0 && <span>{items.length}</span>}
              </div>
            );
          })}
        </React.Fragment>
      ))}
      <div></div>
      {[1,2,3,4,5].map(n => (
        <div key={n} style={{textAlign:"center", fontSize:10, color:"var(--ink-4)"}}>{n}</div>
      ))}
    </div>
  );
}

window.Dashboard = Dashboard;
