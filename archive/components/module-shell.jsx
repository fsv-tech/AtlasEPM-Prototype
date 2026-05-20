// ============================================
// Helix PM — Module page chrome helpers
// ============================================

function ModuleHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="row" style={{gap: 8, flexWrap:"wrap", justifyContent:"flex-end"}}>{actions}</div>}
    </div>
  );
}

function SummaryStrip({ stats }) {
  return (
    <div className="kpi-grid" style={{gridTemplateColumns: `repeat(${stats.length}, 1fr)`}}>
      {stats.map((s, i) => (
        <div key={i} className={"kpi" + (s.featured ? " featured" : "")}>
          <div className="kpi-label">{s.label}</div>
          <div className="kpi-value">
            {s.value}{s.unit && <span className="unit">{s.unit}</span>}
          </div>
          <div className="kpi-foot">
            <span className={"kpi-delta" + (s.delta==="up"?" up":s.delta==="down"?" down":"")}>
              {s.delta==="up" && <Icon name="arrow-up" size={11}/>}
              {s.delta==="down" && <Icon name="arrow-down" size={11}/>}
              {s.sub}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function FilterBar({ filters, value, onChange, actions, searchPlaceholder }) {
  return (
    <div className="row" style={{gap: 12, flexWrap: "wrap"}}>
      <div className="topbar-search" style={{maxWidth: 280, flex: 1, minWidth: 200}}>
        <Icon name="search" size={14}/>
        <input placeholder={searchPlaceholder || "Search…"}/>
      </div>
      <div className="chips">
        {filters.map(f => (
          <button key={f} className={"chip" + (value === f ? " active" : "")} onClick={() => onChange(f)}>{f}</button>
        ))}
      </div>
      <div style={{flex: 1}}/>
      <div className="row" style={{gap: 8}}>
        <button className="btn"><Icon name="filter" size={14}/>Filter</button>
        <button className="btn"><Icon name="sort" size={14}/>Sort</button>
        {actions}
      </div>
    </div>
  );
}

// Side drawer for record details
function Drawer({ title, onClose, children, width = 460 }) {
  React.useEffect(() => {
    const esc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  return (
    <div style={{position:"fixed", inset:0, zIndex: 80, display:"flex", justifyContent:"flex-end"}}>
      <div style={{position:"absolute", inset: 0, background:"rgba(20,23,43,0.32)", backdropFilter:"blur(2px)"}} onClick={onClose}/>
      <div style={{
        position:"relative", width, maxWidth:"92vw", background:"var(--surface)",
        height:"100%", overflowY:"auto",
        borderLeft:"1px solid var(--line)", padding: 24,
        boxShadow:"var(--shadow-lg)",
        animation: "slideIn 180ms ease-out"
      }}>
        <div className="row" style={{justifyContent:"space-between", marginBottom: 14}}>
          <span className="page-eyebrow" style={{margin:0}}>{title}</span>
          <button className="icon-btn" onClick={onClose} style={{width:30, height:30}}><Icon name="x" size={14}/></button>
        </div>
        {children}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(20px); opacity: 0;} to { transform: none; opacity: 1; } }`}</style>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{background:"var(--surface-2)", border:"1px solid var(--line)", borderRadius: 10, padding: "10px 12px"}}>
      <div className="muted tiny" style={{letterSpacing:".1em", textTransform:"uppercase", fontSize:10}}>{label}</div>
      <div style={{fontFamily:"var(--font-sans)", fontWeight: 500, letterSpacing:"-0.025em", fontSize: 22, lineHeight: 1.1, marginTop: 4, color: color || "var(--ink)"}}>{value}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{marginBottom: 14}}>
      <div className="muted tiny" style={{letterSpacing:".1em", textTransform:"uppercase", fontSize:10, marginBottom: 6}}>{label}</div>
      <div style={{fontSize:13.5, lineHeight: 1.5}}>{children}</div>
    </div>
  );
}

window.ModuleHeader = ModuleHeader;
window.SummaryStrip = SummaryStrip;
window.FilterBar = FilterBar;
window.Drawer = Drawer;
window.Stat = Stat;
window.Field = Field;
