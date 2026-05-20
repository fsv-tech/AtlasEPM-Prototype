// ============================================
// Helix PM — Commercial modules (Variations, Cost)
// ============================================

function Variations() {
  const [filter, setFilter] = React.useState("All");
  const filtered = HX.variations.filter(v => filter === "All" ? true : v.status === filter);
  const totalApproved = HX.variations.filter(v=>v.status==="Approved").reduce((s,v)=>s+v.value,0);
  const totalPending = HX.variations.filter(v=> ["In Review","Submitted","Pending"].includes(v.status)).reduce((s,v)=>s+v.value,0);
  const totalRejected = HX.variations.filter(v=>v.status==="Rejected").reduce((s,v)=>s+v.value,0);
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Commercial · Variation orders"
        title="Variations & task changes"
        subtitle="Every change to the agreed scope — cost, programme impact and decision trail."
        actions={<>
          <button className="btn"><Icon name="download" size={14}/>Export</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New VO</button>
        </>}
      />
      <SummaryStrip stats={[
        { label:"Approved",  value: totalApproved.toFixed(1), unit:" M", sub:"DKK" },
        { label:"Pending",   value: totalPending.toFixed(1),  unit:" M", sub:"in review / submitted" },
        { label:"Rejected",  value: totalRejected.toFixed(1), unit:" M", sub:"declined" },
        { label:"Net impact",value: (totalApproved+totalPending*0.5).toFixed(1), unit:" M", sub:"weighted forecast", delta:"up" },
      ]}/>

      <div style={{display:"grid", gridTemplateColumns:"1.5fr 1fr", gap: 14}}>
        <div className="card flush">
          <div className="table-head">
            <div className="table-head-l">
              <h3 className="card-title">Register</h3>
              <div className="muted tiny">{filtered.length} of {HX.variations.length}</div>
            </div>
            <div className="table-head-r">
              <div className="chips">
                {["All","Approved","In Review","Submitted","Pending","Rejected"].map(f => (
                  <button key={f} className={"chip" + (filter===f?" active":"")} onClick={()=>setFilter(f)}>{f}</button>
                ))}
              </div>
            </div>
          </div>
          <table className="data">
            <thead><tr><th>ID</th><th>Description</th><th>Initiator</th><th>Value</th><th>Time</th><th>Status</th></tr></thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td className="cell-id">{v.id}</td>
                  <td>
                    <div className="cell-strong">{v.title}</div>
                    <div className="cell-sub">{v.cause} · {fmtDate(v.date)}</div>
                  </td>
                  <td><span className="badge outline" style={{fontSize:10}}>{v.initiator}</span></td>
                  <td>
                    <span className="cell-num">{v.value.toFixed(2)}</span>
                    <span className="muted tiny"> M DKK</span>
                  </td>
                  <td>
                    <span className="mono tiny" style={{color: v.impact.startsWith("-") ? "var(--success)" : v.impact === "0 days" ? "var(--ink-3)" : "var(--rose)"}}>{v.impact}</span>
                  </td>
                  <td><span className={"badge " + statusClass(v.status)} style={{fontSize:10}}><span className="dot"/>{v.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap: 14}}>
          <div className="card">
            <div className="card-h"><h3 className="card-title">Value waterfall</h3><span className="muted tiny">Cumulative impact on contract value</span></div>
            <Waterfall items={[
              { label: "Award value",  value: 168.2, color: "var(--ink)",      kind: "start" },
              { label: "Approved VOs", value: +totalApproved,  color: "var(--success)" },
              { label: "Pending VOs",  value: +totalPending*0.5, color: "var(--amber)",   note: "50% probability weight" },
              { label: "Rejected",     value: 0,             color: "var(--ink-3)" },
              { label: "Current AAC",  value: 168.2 + totalApproved + totalPending*0.5, color: "var(--accent)", kind: "end" },
            ]}/>
          </div>
          <div className="card">
            <div className="card-h"><h3 className="card-title">Causes</h3></div>
            {Object.entries(HX.variations.reduce((acc, v) => { acc[v.cause]=(acc[v.cause]||0)+v.value; return acc; }, {})).sort((a,b)=>b[1]-a[1]).map(([c, v]) => (
              <div key={c} className="row" style={{justifyContent:"space-between", padding: "6px 0", fontSize:12.5}}>
                <span>{c}</span>
                <span className="mono">{v.toFixed(2)} M</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Waterfall({ items }) {
  const w = 360, h = 180, pad = 28, gap = 8;
  const barW = (w - pad*2 - gap*(items.length-1)) / items.length;
  let cumulative = 0;
  const series = items.map(it => {
    const o = { ...it };
    if (it.kind === "start") { o.start = 0; o.end = it.value; cumulative = it.value; }
    else if (it.kind === "end") { o.start = 0; o.end = it.value; }
    else { o.start = cumulative; o.end = cumulative + it.value; cumulative = o.end; }
    return o;
  });
  const allVals = series.flatMap(s => [s.start, s.end]);
  const maxV = Math.max(...allVals);
  const minV = Math.min(0, ...allVals);
  const scale = (v) => (h - pad) - ((v - minV) / (maxV - minV)) * (h - pad*1.5);

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h+30}`}>
      {series.map((s, i) => {
        const x = pad + i * (barW + gap);
        const y0 = scale(s.start), y1 = scale(s.end);
        const top = Math.min(y0, y1), height = Math.abs(y1 - y0) || 18;
        return (
          <g key={i}>
            <rect x={x} y={top} width={barW} height={height} rx={4} fill={s.color}/>
            <text x={x + barW/2} y={top-6} textAnchor="middle" fontSize="11" fill="var(--ink)" fontFamily="var(--font-mono)">{s.end.toFixed(1)}</text>
            <text x={x + barW/2} y={h+12} textAnchor="middle" fontSize="10" fill="var(--ink-3)">{s.label}</text>
            {s.note && <text x={x + barW/2} y={h+24} textAnchor="middle" fontSize="9" fill="var(--ink-4)">{s.note}</text>}
            {i < series.length - 1 && (
              <line x1={x + barW} y1={y1} x2={x + barW + gap} y2={y1} stroke="var(--line-2)" strokeDasharray="2 2"/>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function CostEstimate() {
  const c = HX.costEstimate;
  const [view, setView] = React.useState("By package");
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Commercial · Cost estimate"
        title="Cost estimate"
        subtitle="Live cost engine driving the forecast at completion. Pulls from variations, commitments and time-sheets."
        actions={<>
          <button className="btn"><Icon name="upload" size={14}/>Import POs</button>
          <button className="btn"><Icon name="download" size={14}/>Cost report</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New line</button>
        </>}
      />

      <SummaryStrip stats={[
        { label:"Budget",    value: c.total.toFixed(1), unit:" M", sub:"approved"  },
        { label:"Spent",     value: c.spent.toFixed(1), unit:" M", sub: Math.round(c.spent/c.total*100) + "% of budget", featured: true },
        { label:"Committed", value: c.committed.toFixed(1), unit:" M", sub:"POs raised" },
        { label:"Forecast",  value: c.forecast.toFixed(1), unit:" M", sub: "+" + (c.forecast - c.total).toFixed(1) + " M over", delta: "down" },
      ]}/>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1.3fr", gap: 14}}>
        <div className="card">
          <div className="card-h">
            <h3 className="card-title">S-curve</h3>
            <span className="muted tiny">Earned value · planned vs. actual</span>
          </div>
          <SCurve/>
          <div className="row" style={{gap: 14, marginTop: 8, justifyContent:"center", fontSize: 11}}>
            <div className="row" style={{gap:6}}><span className="dot" style={{background:"var(--ink-4)"}}/>Planned</div>
            <div className="row" style={{gap:6}}><span className="dot" style={{background:"var(--ink)"}}/>Actual</div>
            <div className="row" style={{gap:6}}><span className="dot" style={{background:"var(--accent)"}}/>Forecast</div>
          </div>
        </div>

        <div className="card">
          <div className="card-h">
            <h3 className="card-title">Breakdown</h3>
            <div className="chips">
              {["By package","By month","By discipline"].map(v => (
                <button key={v} className={"chip" + (view===v?" active":"")} onClick={()=>setView(v)}>{v}</button>
              ))}
            </div>
          </div>
          <table className="data" style={{borderRadius: 0}}>
            <thead>
              <tr>
                <th>Code</th><th>Package</th><th style={{textAlign:"right"}}>Budget</th><th style={{textAlign:"right"}}>Commit.</th><th style={{textAlign:"right"}}>Spent</th><th style={{textAlign:"right"}}>VO</th><th style={{textAlign:"right"}}>Forecast</th><th></th>
              </tr>
            </thead>
            <tbody>
              {c.packages.map(p => {
                const variance = p.forecast - p.budget;
                return (
                  <tr key={p.code}>
                    <td className="cell-id">{p.code}</td>
                    <td className="cell-strong">{p.name}</td>
                    <td className="cell-num" style={{textAlign:"right"}}>{p.budget.toFixed(1)}</td>
                    <td className="cell-num" style={{textAlign:"right", color:"var(--ink-3)"}}>{p.committed.toFixed(1)}</td>
                    <td className="cell-num" style={{textAlign:"right"}}>{p.spent.toFixed(1)}</td>
                    <td className="cell-num" style={{textAlign:"right", color: p.vo > 0 ? "var(--accent)" : "var(--ink-3)"}}>{p.vo > 0 ? "+" + p.vo.toFixed(1) : "—"}</td>
                    <td className="cell-num" style={{textAlign:"right"}}>{p.forecast.toFixed(1)}</td>
                    <td>
                      <span className={"badge " + (variance > 1 ? "danger" : variance > 0 ? "warn" : "success")} style={{fontSize:10}}>
                        {variance > 0 ? "+" : ""}{variance.toFixed(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr style={{background:"var(--surface-2)", fontWeight: 500}}>
                <td></td>
                <td className="cell-strong">Total</td>
                <td className="cell-num" style={{textAlign:"right"}}>{c.total.toFixed(1)}</td>
                <td className="cell-num" style={{textAlign:"right"}}>{c.committed.toFixed(1)}</td>
                <td className="cell-num" style={{textAlign:"right"}}>{c.spent.toFixed(1)}</td>
                <td className="cell-num" style={{textAlign:"right", color:"var(--accent)"}}>+{HX.variations.filter(v=>v.status==="Approved").reduce((s,v)=>s+v.value,0).toFixed(1)}</td>
                <td className="cell-num" style={{textAlign:"right"}}>{c.forecast.toFixed(1)}</td>
                <td><span className="badge danger" style={{fontSize:10}}>+{(c.forecast-c.total).toFixed(1)}</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <div className="card-h">
          <h3 className="card-title">Contingency draw-down</h3>
          <span className="muted tiny">Risk-based reserve · DKK {c.contingency.toFixed(1)}M initial</span>
        </div>
        <ContingencyTrack/>
      </div>
    </div>
  );
}

function SCurve() {
  const w = 380, h = 170, pad = 24;
  const months = ["Mar 25","Jun","Sep","Dec","Mar 26","Jun","Sep","Dec","Mar 27","Jun","Sep","Dec","Mar 28"];
  // cumulative %
  const planned  = [0,3,8,16,26,38,52,66,78,87,93,98,100];
  const actual   = [0,3,7,15,24,36, /* now */ null,null,null,null,null,null,null];
  const forecast = [null,null,null,null,null,36,49,63,76,86,92,97,100];
  // actual: extend until index 5
  actual[5] = 36;

  const scale = (i) => pad + (i / (months.length-1)) * (w - pad*2);
  const yscale = (v) => h - pad - (v/100) * (h - pad*1.5);
  const path = (arr) => arr.map((v, i) => v == null ? null : (i===0 || arr[i-1]==null?"M":"L") + scale(i).toFixed(1) + " " + yscale(v).toFixed(1)).filter(Boolean).join(" ");

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h+18}`}>
      {/* gridlines */}
      {[0,25,50,75,100].map(v => (
        <g key={v}>
          <line x1={pad} y1={yscale(v)} x2={w-pad} y2={yscale(v)} stroke="var(--line)"/>
          <text x={pad-6} y={yscale(v)+3} textAnchor="end" fontSize="9" fill="var(--ink-4)">{v}%</text>
        </g>
      ))}
      <path d={path(planned)} stroke="var(--ink-4)" strokeWidth="1.5" fill="none" strokeDasharray="3 3"/>
      <path d={path(forecast)} stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeDasharray="4 2"/>
      <path d={path(actual)} stroke="var(--ink)" strokeWidth="2" fill="none"/>
      {/* current marker */}
      <line x1={scale(5)} y1={pad} x2={scale(5)} y2={h-pad} stroke="var(--accent)" strokeDasharray="2 2" opacity="0.6"/>
      <circle cx={scale(5)} cy={yscale(36)} r="3" fill="var(--ink)"/>
      {months.filter((_,i)=>i%2===0).map((m,i) => (
        <text key={m} x={scale(i*2)} y={h-pad+12} textAnchor="middle" fontSize="9" fill="var(--ink-4)">{m}</text>
      ))}
      <text x={scale(5)} y={pad-4} textAnchor="middle" fontSize="9" fill="var(--accent)" fontFamily="var(--font-mono)">NOW</text>
    </svg>
  );
}

function ContingencyTrack() {
  const items = [
    { reason:"GI campaign sec. C",    drawn: 1.20, date: "Mar 26", risk: "R-004" },
    { reason:"Compensation grouting", drawn: 3.85, date: "Mar 26", risk: "R-001" },
    { reason:"Acoustic enclosure",    drawn: 1.45, date: "May 26", risk: "VO-007" },
    { reason:"DH re-routing",         drawn: 2.15, date: "May 26", risk: "VO-010" },
  ];
  const used = items.reduce((s,i)=>s+i.drawn, 0);
  const total = HX.costEstimate.contingency;
  return (
    <div>
      <div className="row" style={{justifyContent:"space-between", marginBottom: 8, fontSize: 12.5}}>
        <span>Used: <span className="mono">{used.toFixed(1)} M</span></span>
        <span>Remaining: <span className="mono" style={{color: used/total > 0.7 ? "var(--rose)" : "var(--ink)"}}>{(total-used).toFixed(1)} M</span></span>
      </div>
      <div style={{display:"flex", width:"100%", height: 12, borderRadius: 999, overflow:"hidden", gap: 2, background:"var(--surface-3)"}}>
        {items.map((i, idx) => (
          <div key={idx} style={{width: `${(i.drawn/total)*100}%`, background: ["var(--indigo)","var(--violet)","var(--accent)","var(--amber)"][idx]}} title={i.reason}/>
        ))}
        <div style={{width: `${((total-used)/total)*100}%`, background:"var(--surface-3)"}}/>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap: 12, marginTop: 16}}>
        {items.map((i, idx) => (
          <div key={idx} style={{padding: 12, background:"var(--surface-2)", borderRadius: 10}}>
            <div className="row" style={{gap: 8, marginBottom: 6}}>
              <span className="dot" style={{background: ["var(--indigo)","var(--violet)","var(--accent)","var(--amber)"][idx], color:"transparent"}}/>
              <span className="mono tiny muted">{i.risk}</span>
            </div>
            <div style={{fontSize: 12.5}}>{i.reason}</div>
            <div className="mono" style={{fontSize: 16, marginTop: 4}}>{i.drawn.toFixed(2)} <span className="muted tiny">M</span></div>
            <div className="muted tiny">{i.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

window.Variations = Variations;
window.CostEstimate = CostEstimate;
