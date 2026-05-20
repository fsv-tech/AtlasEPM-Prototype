// ============================================
// Atlas — App root + route dispatch
// ============================================

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error("Atlas render error:", error, info); }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: "var(--font-sans, system-ui)" }}>
          <h2 style={{ color: "var(--red, #dc2626)", marginBottom: 8 }}>Something went wrong</h2>
          <p style={{ color: "var(--ink-3, #64748b)", fontSize: 14, marginBottom: 16 }}>{this.state.error.message}</p>
          <button style={{ padding: "8px 16px", borderRadius: 6, border: "1px solid var(--line, #e2e8f0)", cursor: "pointer" }}
            onClick={() => this.setState({ error: null })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const r = useRoute();
  const [role, setRole] = React.useState(() => {
    const params = new URLSearchParams(location.search);
    return params.get("role") || "Project Manager";
  });
  const [collapsed, setCollapsed] = React.useState(() => {
    try { return localStorage.getItem("atlas.sidebarCollapsed") === "1"; } catch { return false; }
  });
  React.useEffect(() => {
    try { localStorage.setItem("atlas.sidebarCollapsed", collapsed ? "1" : "0"); } catch {}
  }, [collapsed]);
  const onToggle = () => setCollapsed(c => !c);

  if (r.route === "login") return <ToastHost><ScreenLogin/></ToastHost>;

  let screen;
  switch (r.route) {
    case "dashboard":  screen = <ScreenDashboard role={role}/>; break;
    case "projects":
      if (!r.parts[0])                screen = <ScreenProjectsList/>;
      else if (r.parts[0] === "new")  screen = <ScreenProjectCreate/>;
      else                            screen = <ScreenProjectDetail projectId={r.parts[0]} tab={r.parts[1] || "overview"}/>;
      break;
    case "employees":
      if (!r.parts[0])                screen = <ScreenEmployees/>;
      else                            screen = <ScreenEmployeeDetail employeeId={r.parts[0]}/>;
      break;
    case "calendar":      screen = <ScreenCalendar/>; break;
    case "gantt":         screen = <ScreenGantt/>; break;
    case "cost":          screen = <ScreenCost/>; break;
    case "deliverables":
      if (!r.parts[0])                screen = <ScreenDeliverables/>;
      else                            screen = <ScreenDeliverableDetail deliverableId={r.parts[0]}/>;
      break;
    case "approvals":     screen = <ScreenApprovals/>; break;
    case "changes":       screen = <ScreenChanges/>; break;
    case "risks":         screen = <ScreenRisks/>; break;
    case "reports":       screen = <ScreenReports/>; break;
    case "analytics":     screen = <ScreenAnalytics/>; break;
    case "notifications": screen = <ScreenNotifications/>; break;
    case "settings":      screen = <ScreenSettings/>; break;
    default:              screen = <ScreenDashboard role={role}/>;
  }

  return (
    <ToastHost>
      <div className={"app" + (collapsed ? " collapsed" : "")}>
        <Sidebar route={r.raw || r.route} role={role} collapsed={collapsed} onCollapseToggle={onToggle}/>
        <div className="main">
          <Topbar route={r.route} role={role} onCollapseToggle={onToggle}/>
          {screen}
        </div>
      </div>
    </ToastHost>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ErrorBoundary><App/></ErrorBoundary>);
