// ============================================
// Helix PM — People + Data Centre modules
// ============================================

function Team() {
  const [filter, setFilter] = React.useState("All");
  const groups = ["Helix","Metroselskabet","STRABAG JV"];
  const filtered = HX.team.filter(m => filter === "All" ? true : m.company === filter);
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="People · Team"
        title="Team contact data"
        subtitle="Single phonebook for the project. Pulls from the common data centre — change a number once and every register updates."
        actions={<>
          <button className="btn"><Icon name="download" size={14}/>Export vCard</button>
          <button className="btn accent"><Icon name="plus" size={14}/>Add member</button>
        </>}
      />
      <SummaryStrip stats={[
        { label:"Members", value: HX.team.length, sub:"across all parties" },
        { label:"Helix",   value: HX.team.filter(m=>m.company==="Helix").length, sub:"in-house" },
        { label:"Client",  value: HX.team.filter(m=>m.company==="Metroselskabet").length, sub:"Metroselskabet" },
        { label:"Contractor", value: HX.team.filter(m=>m.company==="STRABAG JV").length, sub:"STRABAG JV" },
      ]}/>

      <div className="row" style={{gap: 8, flexWrap:"wrap"}}>
        <button className={"chip" + (filter==="All"?" active":"")} onClick={()=>setFilter("All")}>All ({HX.team.length})</button>
        {groups.map(g => <button key={g} className={"chip" + (filter===g?" active":"")} onClick={()=>setFilter(g)}>{g} ({HX.team.filter(m=>m.company===g).length})</button>)}
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 14}}>
        {filtered.map((m, i) => (
          <div key={m.email} className="card" style={{display:"flex", flexDirection:"column", gap: 12}}>
            <div className="row" style={{gap: 12}}>
              <Avatar name={m.init} size="lg" color={m.color}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{fontWeight: 500, fontSize: 14}}>{m.name}</div>
                <div className="muted tiny">{m.role}</div>
              </div>
              <span className="badge outline" style={{fontSize: 10}}>{m.discipline}</span>
            </div>
            <div className="divider"/>
            <div className="col" style={{gap: 6}}>
              <div className="row" style={{gap: 8, fontSize: 12, color:"var(--ink-2)"}}>
                <Icon name="at" size={13}/>{m.email}
              </div>
              <div className="row" style={{gap: 8, fontSize: 12, color:"var(--ink-2)"}}>
                <Icon name="phone" size={13}/><span className="mono">{m.phone}</span>
              </div>
              <div className="row" style={{gap: 8, fontSize: 12, color:"var(--ink-2)"}}>
                <Icon name="map-pin" size={13}/>{m.location}
              </div>
            </div>
            <div className="row" style={{gap: 6, marginTop: 4}}>
              <span className="badge neutral" style={{fontSize: 10}}>{m.company}</span>
              {i === 0 && <span className="badge warm" style={{fontSize: 10}}><span className="dot"/>PM</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-h"><h3 className="card-title">Distribution lists</h3><span className="muted tiny">Pre-configured groups</span></div>
        <table className="data">
          <thead><tr><th>List</th><th>Members</th><th>Used by</th></tr></thead>
          <tbody>
            {[
              { l: "Weekly progress MoM", n: 8, u: "MOM-032, MOM-031, MOM-030", who: ["AV","RB","SL","MT","PD","EK","BJ","LM"] },
              { l: "Risk review",         n: 6, u: "MOM-030", who: ["AV","JS","RB","PD","CH","YK"] },
              { l: "Client steering",     n: 4, u: "MOM-025", who: ["BJ","LM","AV","LH"] },
              { l: "HSE walk",            n: 4, u: "MOM-027", who: ["YK","MD","EK","AV"] },
              { l: "Design review",       n: 4, u: "MOM-026", who: ["SL","RB","JS","BJ"] },
            ].map(d => (
              <tr key={d.l}>
                <td className="cell-strong">{d.l}</td>
                <td><AvatarStack names={d.who} size="sm"/></td>
                <td className="muted tiny">{d.u}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DataCentre({ onNav }) {
  return (
    <div className="content">
      <ModuleHeader
        eyebrow="Overview · Common data centre"
        title="The data centre"
        subtitle="Your dad's sketch made literal. Every register on the left-hand nav is just a view of this same set of data — change something once and every report updates."
        actions={<>
          <button className="btn"><Icon name="download" size={14}/>Schema (CSV)</button>
          <button className="btn"><Icon name="upload" size={14}/>Import .xlsx</button>
          <button className="btn accent"><Icon name="plus" size={14}/>New field</button>
        </>}
      />

      <div className="card dark" style={{padding: 32, overflow: "hidden", position:"relative"}}>
        <div style={{display:"grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems:"center"}}>
          <div>
            <div className="row" style={{gap: 8, marginBottom: 14}}>
              <span style={{width: 8, height: 8, background:"var(--accent)", borderRadius:"50%"}}/>
              <span className="tiny" style={{color:"var(--bg)", opacity:0.7, letterSpacing:".14em", textTransform:"uppercase"}}>Single source of truth</span>
            </div>
            <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 44, lineHeight: 1.05, letterSpacing:"-0.015em", marginBottom: 16}}>
              All 14 modules share<br/>
              <span style={{color:"rgba(245,243,238,0.55)"}}>one common spine.</span>
            </div>
            <p style={{maxWidth: 460, color: "rgba(245,243,238,0.7)", lineHeight: 1.55}}>
              Change a phone number in Team, and it updates the MoM attendee list, the correspondence sender, and the action owner — all at once.
            </p>
          </div>
          <DataCentreHub onNav={onNav}/>
        </div>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 14}}>
        {[
          { t: "Project metadata", n: 1, sub: "name, code, client, value, dates", icon: "info" },
          { t: "Team contacts",    n: HX.team.length, sub: "names, roles, comms", icon: "users" },
          { t: "WBS & packages",   n: HX.costEstimate.packages.length, sub: "P1 – P7", icon: "branch" },
          { t: "Disciplines",      n: 9, sub: "Civil, Structures, MEP, ...", icon: "grid" },
          { t: "Master document codes", n: HX.documents.length, sub: "NHM-[disc]-[type]-####", icon: "folder" },
          { t: "Distribution lists", n: 5, sub: "MoM, RR, steering...", icon: "share" },
        ].map((s,i) => (
          <div key={i} className="card">
            <div className="row" style={{gap: 12, marginBottom: 10}}>
              <div style={{width: 34, height: 34, borderRadius: 10, background:"var(--surface-3)", display:"grid", placeItems:"center"}}>
                <Icon name={s.icon} size={16}/>
              </div>
              <div style={{flex: 1}}>
                <div style={{fontWeight: 500, fontSize: 13.5}}>{s.t}</div>
                <div className="muted tiny">{s.sub}</div>
              </div>
              <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 26, lineHeight: 1}}>{s.n}</div>
            </div>
            <div className="row" style={{gap: 6, flexWrap:"wrap"}}>
              <span className="badge neutral" style={{fontSize: 10}}>Synced</span>
              <span className="badge outline" style={{fontSize: 10}}>Read-write</span>
              <span className="badge outline" style={{fontSize: 10}}>14 consumers</span>
            </div>
          </div>
        ))}
      </div>

      {/* Project metadata edit panel — visual editor */}
      <div className="card">
        <div className="card-h">
          <h3 className="card-title">Project metadata</h3>
          <span className="muted tiny">Changes propagate immediately to every register</span>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap: 14}}>
          {[
            ["Project name",  HX.active.name],
            ["Project code",  HX.active.code],
            ["Client",        HX.active.client],
            ["Sector",        HX.active.sector],
            ["Location",      HX.active.location],
            ["PM",            HX.active.pm],
            ["Contract value (M DKK)", HX.active.value.toFixed(1)],
            ["Start",         fmtDate(HX.active.start)],
            ["End",           fmtDate(HX.active.end)],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="muted tiny" style={{letterSpacing:".1em", textTransform:"uppercase", fontSize:10, marginBottom: 4}}>{k}</div>
              <div style={{padding: "10px 12px", border:"1px solid var(--line)", borderRadius: 8, background:"var(--surface-2)", fontSize: 13.5}}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hub visualization — circles around a centre, echoing the sketch
function DataCentreHub({ onNav }) {
  const modules = [
    { id: "look-ahead",    label: "Look ahead",       short: "LA"  },
    { id: "visual-plan",   label: "Visual planning",  short: "VP"  },
    { id: "team",          label: "Team",             short: "T"   },
    { id: "interfaces",    label: "Interfaces",       short: "IF"  },
    { id: "risks",         label: "Risks",            short: "R"   },
    { id: "aec",           label: "AEC",              short: "AEC" },
    { id: "minutes",       label: "Minutes",          short: "M"   },
    { id: "variations",    label: "Variations",       short: "VO"  },
    { id: "tqs",           label: "TQs",              short: "TQ"  },
    { id: "actions",       label: "Actions",          short: "A"   },
    { id: "cost",          label: "Cost",             short: "$"   },
    { id: "docs",          label: "Documents",        short: "D"   },
    { id: "correspondence",label: "Correspondence",   short: "C"   },
  ];
  const w = 460, h = 400, cx = w/2, cy = h/2, r = 150;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{maxHeight: 420}}>
      <defs>
        <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
          <path d="M22 0L0 0 0 22" fill="none" stroke="rgba(255,255,255,0.06)"/>
        </pattern>
      </defs>
      <rect width={w} height={h} fill="url(#grid)" opacity="0.5"/>

      {/* connector lines */}
      {modules.map((m, i) => {
        const ang = (i / modules.length) * Math.PI * 2 - Math.PI/2;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        return (
          <line key={"l"+m.id}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke="rgba(245,243,238,0.18)" strokeWidth="1" strokeDasharray="2 3"/>
        );
      })}

      {/* central hub */}
      <circle cx={cx} cy={cy} r="58" fill="var(--accent)"/>
      <circle cx={cx} cy={cy} r="58" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeDasharray="2 4"/>
      <text x={cx} y={cy-6} textAnchor="middle" fontSize="11" fill="#fff" fontFamily="var(--font-sans)" letterSpacing="2">DATA</text>
      <text x={cx} y={cy+10} textAnchor="middle" fontSize="14" fill="#fff" fontFamily="var(--font-sans)" fontWeight="500">Centre</text>

      {/* module nodes */}
      {modules.map((m, i) => {
        const ang = (i / modules.length) * Math.PI * 2 - Math.PI/2;
        const x = cx + Math.cos(ang) * r;
        const y = cy + Math.sin(ang) * r;
        return (
          <g key={m.id} transform={`translate(${x}, ${y})`} style={{cursor:"pointer"}} onClick={()=>onNav && onNav(m.id)}>
            <circle r="26" fill="var(--bg)" stroke="rgba(245,243,238,0.4)" strokeWidth="1"/>
            <text textAnchor="middle" dy="-2" fontSize="11" fontFamily="var(--font-mono)" fill="var(--ink)">{m.short}</text>
            <text textAnchor="middle" dy="9" fontSize="7.5" fill="var(--ink-3)" letterSpacing="0.5">{m.label.toUpperCase().slice(0,10)}</text>
          </g>
        );
      })}
    </svg>
  );
}

window.Team = Team;
window.DataCentre = DataCentre;
