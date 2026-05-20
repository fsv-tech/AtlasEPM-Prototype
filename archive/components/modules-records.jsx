// ============================================
// Helix PM — Records modules
//   Minutes · Documents · Correspondence · AEC
// ============================================

function Minutes() {
  const [selected, setSelected] = React.useState(HX.minutes[0]);
  const typeColors = {
    Progress: "var(--indigo)", Interface: "var(--cyan)", Risk: "var(--rose)",
    Commercial: "var(--accent)", HSE: "var(--amber)", Design: "var(--violet)",
    Steering: "var(--ink)", Sustainability: "var(--lime)",
  };
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Records · Meeting minutes"
        title="Minutes of meetings"
        subtitle="Every recurring meeting, agenda decision and action captured in a single thread."
        actions={<>
          <button className="btn"><Icon name="download" size={14}/>Export</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New minutes</button>
        </>}
      />

      <SummaryStrip stats={[
        { label:"Logged",        value: HX.minutes.length, sub:"meetings YTD" },
        { label:"Actions raised",value: HX.minutes.reduce((s,m)=>s+m.actions,0), sub:"from minutes" },
        { label:"Avg. agenda items", value: (HX.minutes.reduce((s,m)=>s+m.items,0) / HX.minutes.length).toFixed(1), sub:"per meeting" },
        { label:"Recurring series", value: 6, sub:"weekly / monthly" },
      ]}/>

      <div style={{display:"grid", gridTemplateColumns:"1.2fr 1.4fr", gap: 14}}>
        <div className="card flush">
          <div className="table-head">
            <div className="table-head-l">
              <h3 className="card-title">Recent meetings</h3>
              <div className="muted tiny">Chronological · most recent first</div>
            </div>
            <button className="btn ghost sm"><Icon name="history" size={14}/>All time</button>
          </div>
          <div>
            {HX.minutes.map(m => (
              <div key={m.id}
                   onClick={()=>setSelected(m)}
                   className={"row" + (selected?.id === m.id ? " selected" : "")}
                   style={{
                     padding: "16px 22px",
                     borderBottom: "1px solid var(--line)",
                     gap: 14,
                     cursor: "pointer",
                     background: selected?.id === m.id ? "var(--indigo-soft)" : "transparent",
                   }}>
                <div style={{width: 56, textAlign:"center", borderRight: `2px solid ${typeColors[m.type] || "var(--ink-4)"}`, paddingRight: 8}}>
                  <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 26, lineHeight: 1}}>{m.date.slice(8,10)}</div>
                  <div className="tiny muted" style={{textTransform:"uppercase", letterSpacing:".06em"}}>{["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m.date.slice(5,7),10)-1]}</div>
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div className="row" style={{gap: 8, marginBottom: 4}}>
                    <span className="mono tiny muted">{m.id}</span>
                    <span className="badge outline" style={{fontSize: 10, color: typeColors[m.type]}}>
                      <span className="dot" style={{background: typeColors[m.type]}}/>{m.type}
                    </span>
                  </div>
                  <div style={{fontSize:13.5, fontWeight: 500}}>{m.title}</div>
                  <div className="row" style={{gap: 12, marginTop: 6, fontSize: 11, color:"var(--ink-3)"}}>
                    <span>Chair: <Avatar name={m.chair} size="sm" /></span>
                    <span>·</span>
                    <span>{m.items} items</span>
                    <span>·</span>
                    <span>{m.actions} actions</span>
                  </div>
                </div>
                <AvatarStack names={m.attendees} size="sm"/>
              </div>
            ))}
          </div>
        </div>

        {/* Selected meeting */}
        {selected && (
          <div className="card">
            <div className="row" style={{justifyContent:"space-between", marginBottom: 12}}>
              <span className="page-eyebrow" style={{margin:0}}>{selected.id} · {selected.type}</span>
              <div className="row" style={{gap: 6}}>
                <button className="btn ghost sm"><Icon name="edit" size={12}/></button>
                <button className="btn ghost sm"><Icon name="paperclip" size={12}/></button>
                <button className="btn ghost sm"><Icon name="more" size={12}/></button>
              </div>
            </div>
            <h2 style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 30, lineHeight: 1.1, letterSpacing:"-0.01em", margin:"0 0 12px"}}>
              {selected.title}
            </h2>
            <div className="row" style={{gap: 18, marginBottom: 16, fontSize: 12.5, color:"var(--ink-3)"}}>
              <div className="row" style={{gap: 6}}><Icon name="calendar" size={12}/>{fmtDate(selected.date)}</div>
              <div className="row" style={{gap: 6}}><Icon name="clock" size={12}/>09:00 – 10:30</div>
              <div className="row" style={{gap: 6}}><Icon name="users" size={12}/>{selected.attendees.length} attendees</div>
            </div>

            <Field label="Attendees">
              <div className="row" style={{flexWrap:"wrap", gap: 8}}>
                {selected.attendees.map(a => {
                  const m = HX.team.find(t=>t.init===a);
                  return (
                    <div key={a} className="row" style={{gap: 6, background:"var(--surface-2)", padding:"4px 10px 4px 4px", borderRadius: 999, border:"1px solid var(--line)"}}>
                      <Avatar name={a} size="sm"/>
                      <span style={{fontSize:12}}>{m?.name || a}</span>
                    </div>
                  );
                })}
              </div>
            </Field>

            <Field label="Agenda & decisions">
              {sampleAgenda(selected).map((item, i) => (
                <div key={i} style={{borderLeft: "2px solid var(--line-2)", paddingLeft: 14, paddingBottom: 14, position:"relative"}}>
                  <span style={{position:"absolute", left: -5, top: 2, width: 8, height: 8, borderRadius: "50%", background: item.decided ? "var(--success)" : "var(--amber)"}}/>
                  <div style={{fontWeight: 500, fontSize: 13}}>{i+1}. {item.title}</div>
                  <div className="muted tiny" style={{marginTop: 3}}>{item.note}</div>
                </div>
              ))}
            </Field>

            <Field label="Actions raised">
              {HX.actions.slice(0, 3).map(a => (
                <div key={a.id} className="row" style={{padding: "6px 0", borderBottom: "1px solid var(--line)", gap: 8}}>
                  <span className="mono tiny muted">{a.id}</span>
                  <span style={{fontSize: 12.5, flex:1}}>{a.title}</span>
                  <Avatar name={a.owner} size="sm"/>
                  <span className="mono tiny muted">{fmtDate(a.due)}</span>
                </div>
              ))}
            </Field>
          </div>
        )}
      </div>
    </div>
  );
}

function sampleAgenda(m) {
  return [
    { title: "Safety moment", note: "Recap of near-miss at Sortedam shaft; revised lifting plan in force.", decided: true },
    { title: "Programme update", note: "TBM advance rate steady at 13.8 m/day; ring 412 installed.", decided: true },
    { title: "Interface — Signalling vs PSD", note: "Tripartite workshop agreed for wk 22; draft tolerance build-up to be issued.", decided: true },
    { title: "Cost report April", note: "Forecast tracked at 191.6 M DKK; contingency drawdown 8.65 M of 9.2 M.", decided: false },
    { title: "Public consultation outcome", note: "Two entrance design variants progressed; workshop on 22 May.", decided: false },
  ];
}

function Documents() {
  const [filter, setFilter] = React.useState("All");
  const filtered = HX.documents.filter(d => filter === "All" ? true : d.discipline === filter);
  const disciplines = Array.from(new Set(HX.documents.map(d => d.discipline)));
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Records · Master document register"
        title="Master document register"
        subtitle="The single index of every drawing, calculation, report and specification — by revision."
        actions={<>
          <button className="btn"><Icon name="upload" size={14}/>Upload</button>
          <button className="btn"><Icon name="download" size={14}/>Export</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New doc</button>
        </>}
      />
      <SummaryStrip stats={[
        { label:"Documents", value: HX.documents.length, sub:"current revisions" },
        { label:"WIP",       value: HX.documents.filter(d=>d.status==="WIP").length, sub:"unissued" },
        { label:"Issued for Review", value: HX.documents.filter(d=>d.status==="Issued for Review").length },
        { label:"Disciplines",value: disciplines.length },
      ]}/>

      <div className="card flush">
        <div className="table-head">
          <div className="table-head-l">
            <h3 className="card-title">All documents</h3>
            <div className="muted tiny">{filtered.length} of {HX.documents.length}</div>
          </div>
          <div className="table-head-r">
            <div className="chips">
              <button className={"chip" + (filter==="All"?" active":"")} onClick={()=>setFilter("All")}>All</button>
              {disciplines.map(d => (
                <button key={d} className={"chip" + (filter===d?" active":"")} onClick={()=>setFilter(d)}>{d}</button>
              ))}
            </div>
          </div>
        </div>
        <table className="data">
          <thead><tr><th>Code</th><th>Title</th><th>Discipline</th><th>Rev</th><th>Date</th><th>Author</th><th>Size</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td className="cell-id">{d.code}</td>
                <td>
                  <div className="row" style={{gap: 10}}>
                    <div style={{width:24, height:30, background:"var(--surface-3)", borderRadius:3, display:"grid", placeItems:"center", color:"var(--ink-3)"}}>
                      <Icon name="doc" size={12}/>
                    </div>
                    <span className="cell-strong">{d.title}</span>
                  </div>
                </td>
                <td><span className="badge outline" style={{fontSize: 10}}>{d.discipline}</span></td>
                <td><span className="mono" style={{background:"var(--ink-soft, var(--surface-3))", padding:"1px 6px", borderRadius: 4, fontSize:11}}>{d.rev}</span></td>
                <td className="cell-num">{fmtDate(d.date)}</td>
                <td><Avatar name={d.author} size="sm"/></td>
                <td className="cell-num muted">{d.size}</td>
                <td><span className={"badge " + statusClass(d.status)} style={{fontSize:10}}><span className="dot"/>{d.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Correspondence() {
  const [tab, setTab] = React.useState("All");
  const filtered = HX.correspondence.filter(c => tab === "All" ? true : c.status === tab);
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Records · Correspondence register"
        title="Correspondence"
        subtitle="Every formal letter, email and notification — inbound and outbound — with full thread context."
        actions={<>
          <button className="btn"><Icon name="upload" size={14}/>Import .msg</button>
          <button className="btn accent"><Icon name="plus" size={14}/>Compose</button>
        </>}
      />
      <SummaryStrip stats={[
        { label:"Sent",     value: HX.correspondence.filter(c=>c.status==="Sent").length, sub:"outbound" },
        { label:"Received", value: HX.correspondence.filter(c=>c.status==="Received").length, sub:"inbound" },
        { label:"Active threads", value: new Set(HX.correspondence.map(c=>c.thread)).size },
        { label:"Awaiting reply", value: 4, sub:"> 7 days", delta:"down" },
      ]}/>

      <div className="card flush">
        <div className="table-head">
          <div className="table-head-l">
            <h3 className="card-title">All correspondence</h3>
          </div>
          <div className="table-head-r">
            <div className="chips">
              {["All","Sent","Received"].map(f => (
                <button key={f} className={"chip" + (tab===f?" active":"")} onClick={()=>setTab(f)}>{f}</button>
              ))}
            </div>
          </div>
        </div>
        <table className="data">
          <thead><tr><th>Ref</th><th>Direction</th><th>Subject</th><th>Type</th><th>Date</th><th>Thread</th><th></th></tr></thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td className="cell-id">{c.id}</td>
                <td>
                  <div className="row" style={{gap: 8}}>
                    <span style={{
                      width: 22, height: 22, borderRadius: "50%",
                      background: c.status === "Sent" ? "var(--indigo-soft)" : "var(--accent-soft)",
                      color:      c.status === "Sent" ? "var(--indigo)"      : "var(--accent)",
                      display:"grid", placeItems:"center"
                    }}>
                      <Icon name={c.status === "Sent" ? "send" : "mail"} size={11}/>
                    </span>
                    <span style={{fontSize: 12.5}}>{c.from}</span>
                  </div>
                </td>
                <td className="cell-strong">
                  {c.subject}
                  {c.attachments > 0 && (
                    <span className="muted tiny row" style={{gap: 4, marginTop: 3}}>
                      <Icon name="paperclip" size={10}/> {c.attachments} attachment{c.attachments>1?"s":""}
                    </span>
                  )}
                </td>
                <td><span className="badge outline" style={{fontSize: 10}}>{c.type}</span></td>
                <td className="cell-num">{fmtDate(c.date)}</td>
                <td>
                  <span className="mono tiny" style={{background:"var(--surface-3)", padding:"2px 8px", borderRadius: 999}}>T-{String(c.thread).padStart(3,"0")}</span>
                </td>
                <td><Icon name="chevron-right" size={14}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Assumptions() {
  const [tab, setTab] = React.useState("All");
  const filtered = HX.aec.filter(a => tab === "All" ? true : a.type === tab);
  const typeBadge = { Assumption: "info", Exclusion: "danger", Clarification: "violet" };
  const confColor  = { High: "var(--success)", Medium: "var(--amber)", Low: "var(--rose)", "—": "var(--ink-4)" };
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Records · AEC register"
        title="Assumptions, Exclusions & Clarifications"
        subtitle="Every load-bearing premise the project rests on — and every scope boundary the contract pushes back on."
        actions={<>
          <button className="btn"><Icon name="download" size={14}/>Export</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New entry</button>
        </>}
      />
      <SummaryStrip stats={[
        { label:"Assumptions",   value: HX.aec.filter(a=>a.type==="Assumption").length },
        { label:"Exclusions",    value: HX.aec.filter(a=>a.type==="Exclusion").length },
        { label:"Clarifications",value: HX.aec.filter(a=>a.type==="Clarification").length },
        { label:"Low confidence",value: HX.aec.filter(a=>a.confidence==="Low").length, sub:"to validate" },
      ]}/>

      <div className="card flush">
        <div className="table-head">
          <div className="table-head-l">
            <h3 className="card-title">Register</h3>
            <div className="muted tiny">{filtered.length} of {HX.aec.length}</div>
          </div>
          <div className="table-head-r">
            <div className="chips">
              {["All","Assumption","Exclusion","Clarification"].map(f => (
                <button key={f} className={"chip" + (tab===f?" active":"")} onClick={()=>setTab(f)}>{f}</button>
              ))}
            </div>
          </div>
        </div>
        <table className="data">
          <thead><tr><th>ID</th><th>Type</th><th>Statement</th><th>Basis</th><th>Author</th><th>Confidence</th><th>Reviewed</th></tr></thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td className="cell-id">{a.id}</td>
                <td><span className={"badge " + typeBadge[a.type]} style={{fontSize: 10}}>{a.type}</span></td>
                <td style={{maxWidth: 360}} className="cell-strong">{a.text}</td>
                <td className="muted tiny">{a.basis}</td>
                <td><Avatar name={a.author} size="sm"/></td>
                <td>
                  <span className="row" style={{gap: 6, color: confColor[a.confidence], fontSize: 12, fontWeight: 500}}>
                    <span className="dot" style={{background: confColor[a.confidence]}}/>{a.confidence}
                  </span>
                </td>
                <td className="cell-num">{fmtDate(a.reviewed)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

window.Minutes = Minutes;
window.Documents = Documents;
window.Correspondence = Correspondence;
window.Assumptions = Assumptions;
