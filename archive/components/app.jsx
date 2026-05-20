// ============================================
// Helix PM — App shell + router + tweaks
// ============================================

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "coral",
  "density": "cozy",
  "corner": "soft",
  "collapsedSidebar": false
}/*EDITMODE-END*/;

function App() {
  const [route, setRoute] = React.useState(() => {
    const h = window.location.hash.replace("#","");
    return HX.modules.find(m => m.id === h) ? h : "dashboard";
  });
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#","");
      if (HX.modules.find(m => m.id === h)) setRoute(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (id) => {
    setRoute(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderRoute = () => {
    switch (route) {
      case "dashboard":      return <Dashboard onNav={go}/>;
      case "data-centre":    return <DataCentre onNav={go}/>;
      case "look-ahead":     return <LookAhead onNav={go}/>;
      case "visual-plan":    return <VisualPlanning/>;
      case "risks":          return <Risks/>;
      case "actions":        return <ActionRegister/>;
      case "interfaces":     return <Interfaces/>;
      case "tqs":            return <TQs/>;
      case "variations":     return <Variations/>;
      case "cost":           return <CostEstimate/>;
      case "minutes":        return <Minutes/>;
      case "docs":           return <Documents/>;
      case "correspondence": return <Correspondence/>;
      case "aec":            return <Assumptions/>;
      case "team":           return <Team/>;
      default:               return <Dashboard onNav={go}/>;
    }
  };

  return (
    <div
      className={"app" + (t.collapsedSidebar ? " collapsed" : "")}
      data-theme={t.theme}
      data-accent={t.accent}
      data-density={t.density}
      data-corner={t.corner}
    >
      <Sidebar active={route} onNav={go} collapsed={t.collapsedSidebar}/>
      <div className="main">
        <Topbar onNav={go} t={t} setTweak={setTweak}/>
        {renderRoute()}
      </div>
      <HelixTweaks t={t} setTweak={setTweak}/>
    </div>
  );
}

function Topbar({ onNav, t, setTweak }) {
  return (
    <div className="topbar">
      <button className="icon-btn" onClick={() => setTweak("collapsedSidebar", !t.collapsedSidebar)} title="Collapse sidebar">
        <Icon name="panel-left" size={16}/>
      </button>
      <div className="topbar-search">
        <Icon name="search" size={14}/>
        <input placeholder="Search projects, risks, actions, documents…"/>
        <kbd>⌘K</kbd>
      </div>
      <div className="topbar-actions">
        <button className="btn ghost" onClick={()=>onNav("data-centre")}><Icon name="database" size={14}/>Data Centre</button>
        <button className="icon-btn" style={{position:"relative"}}>
          <Icon name="bell" size={16}/>
          <span className="dot"/>
        </button>
        <button className="icon-btn"><Icon name="settings" size={16}/></button>
        <div className="user-chip">
          <Avatar name="AV" color="#2A2F6E"/>
          <div>
            <div className="name">Anders Vestergaard</div>
            <div className="role">Project Manager</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HelixTweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme"/>
      <TweakRadio label="Mode"   value={t.theme}   options={["light","dark"]} onChange={v=>setTweak("theme", v)}/>
      <TweakRadio label="Density" value={t.density} options={["compact","cozy","spacious"]} onChange={v=>setTweak("density", v)}/>
      <TweakRadio label="Corners" value={t.corner} options={["soft","sharp","pill"]} onChange={v=>setTweak("corner", v)}/>

      <TweakSection label="Accent"/>
      <div className="twk-row" style={{flexDirection:"column", alignItems:"stretch", gap: 8}}>
        <div className="twk-lbl" style={{marginBottom: 4}}><span>Accent</span></div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(5, 1fr)", gap: 6}}>
          {[
            { v: "coral",  c: "#FF6A4D" },
            { v: "cyan",   c: "#2DB6D3" },
            { v: "violet", c: "#7C6BF0" },
            { v: "lime",   c: "#8BAA2C" },
            { v: "amber",  c: "#E89500" },
          ].map(o => (
            <button key={o.v} type="button"
              onClick={()=>setTweak("accent", o.v)}
              title={o.v}
              style={{
                height: 32, borderRadius: 8, border: t.accent === o.v ? "2px solid #fff" : "2px solid transparent",
                outline: t.accent === o.v ? "2px solid var(--ink)" : "none",
                background: o.c, cursor:"pointer"
              }}/>
          ))}
        </div>
      </div>

      <TweakSection label="Layout"/>
      <TweakToggle label="Collapsed sidebar" value={t.collapsedSidebar} onChange={v=>setTweak("collapsedSidebar", v)}/>
    </TweaksPanel>
  );
}

// Mount
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);
