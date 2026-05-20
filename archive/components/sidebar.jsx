// ============================================
// Helix PM — Sidebar
// ============================================

function Sidebar({ active, onNav, collapsed, onToggleCollapse }) {
  const groups = {};
  HX.modules.forEach(m => {
    groups[m.group] = groups[m.group] || [];
    groups[m.group].push(m);
  });

  // counts per module
  const counts = {
    risks: HX.risks.filter(r => r.status === "Open").length,
    actions: HX.actions.filter(a => a.status !== "Done").length,
    tqs: HX.tqs.filter(t => t.status !== "Closed").length,
    interfaces: HX.interfaces.filter(i => i.status !== "Closed").length,
    variations: HX.variations.filter(v => v.status === "In Review" || v.status === "Submitted" || v.status === "Pending").length,
    minutes: HX.minutes.length,
    correspondence: HX.correspondence.length,
    docs: HX.documents.filter(d => d.status === "WIP").length,
    team: HX.team.length,
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">h</div>
        <div>
          <div className="brand-name">Helix</div>
          <div className="brand-sub">PM · v2.4</div>
        </div>
      </div>

      {Object.entries(groups).map(([groupName, items]) => (
        <div key={groupName}>
          <div className="nav-section-label">{groupName}</div>
          {items.map(m => (
            <div
              key={m.id}
              className={"nav-item" + (active === m.id ? " active" : "")}
              onClick={() => onNav(m.id)}
            >
              <span className="nav-icon"><Icon name={m.icon} size={16}/></span>
              <span className="nav-label">{m.label}</span>
              {counts[m.id] != null && (
                <span className="nav-badge">{counts[m.id]}</span>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="project-switcher">
        <div className="row" style={{justifyContent:"space-between"}}>
          <span className="label">Active Project</span>
          <Icon name="chevron-down" size={12}/>
        </div>
        <div className="name">{HX.active.name}</div>
        <div className="meta">
          <span>{HX.active.code}</span>
          <span>{HX.active.client}</span>
        </div>
        <div className="progress"><span style={{width: HX.active.progress + "%", background: "var(--accent)"}}/></div>
        <div className="meta">
          <span>{HX.active.progress}% complete</span>
          <span>{HX.active.health === "green" ? "🟢" : HX.active.health === "amber" ? "🟡" : "🔴"} {HX.active.status}</span>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
