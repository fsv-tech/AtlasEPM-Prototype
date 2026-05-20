// ============================================
// Atlas — App shell: Sidebar, Topbar, Router, Popovers, Toasts
// ============================================

const NAV = [
  { section: "Workspace", items: [
    { id: "dashboard", label: "Dashboard", icon: "dashboard", route: "dashboard" },
  ]},
  { section: "Projects", items: [
    { id: "projects",  label: "Projects",  icon: "folder", route: "projects",  badge: () => DB.projects.filter(p => p.status === "Active").length },
    { id: "calendar",  label: "Resource calendar", icon: "calendar", route: "calendar" },
    { id: "gantt",     label: "Gantt planning", icon: "gantt", route: "gantt" },
    { id: "cost",      label: "Cost management", icon: "coin", route: "cost" },
  ]},
  { section: "Delivery", items: [
    { id: "deliverables", label: "Deliverables", icon: "layers", route: "deliverables", badge: () => DB.deliverables.filter(d => d.status !== "Approved" && d.status !== "Issued").length },
    { id: "approvals", label: "Approvals", icon: "checkSquare", route: "approvals", badge: () => DB.approvals.filter(a => a.status === "Pending").length, badgeKind: "accent" },
    { id: "changes",   label: "Change requests", icon: "git", route: "changes",  badge: () => DB.changes.filter(c => c.status === "In Review" || c.status === "Submitted").length },
    { id: "risks",     label: "Risks", icon: "shield", route: "risks", badge: () => DB.risks.filter(r => r.status === "Open").length },
  ]},
  { section: "People", items: [
    { id: "employees", label: "Employees", icon: "users", route: "employees" },
  ]},
  { section: "Insights", items: [
    { id: "reports",   label: "Reports", icon: "report", route: "reports" },
    { id: "analytics", label: "Analytics", icon: "brain",  route: "analytics" },
  ]},
  { section: "Admin", items: [
    { id: "settings", label: "Settings", icon: "settings", route: "settings" },
  ]},
];

const ROLE_NAV = {
  "Admin":           null,
  "Executive":       ["dashboard","projects","cost","deliverables","approvals","risks","reports","analytics","notifications"],
  "Project Manager": ["dashboard","projects","calendar","gantt","cost","deliverables","approvals","changes","risks","employees","reports","analytics","notifications"],
  "Discipline Lead": ["dashboard","projects","calendar","deliverables","approvals","changes","risks","employees","reports","notifications"],
  "Engineer":        ["dashboard","projects","deliverables","changes","risks","notifications"],
  "Planner":         ["dashboard","projects","calendar","gantt","employees","reports","analytics","notifications"],
  "Commercial":      ["dashboard","projects","cost","approvals","changes","reports","analytics","notifications"],
  "Client":          ["dashboard","projects","deliverables","reports","notifications"],
  "Doc Controller":  ["dashboard","projects","deliverables","notifications"],
  "QA/QC":           ["dashboard","projects","deliverables","approvals","risks","reports","notifications"],
};

// ============================================
// Toast system — global queue, used by buttons that don't
// have a real handler yet
// ============================================
const ToastContext = React.createContext(null);
function useToast() { return React.useContext(ToastContext); }

function ToastHost({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const add = React.useCallback((message, kind = "default", ms = 2400) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(t => [...t, { id, message, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), ms);
  }, []);

  // Global "demo-mode" handler — any .btn click that isn't an anchor and
  // isn't an icon-btn (those open popovers/modals) gets a toast acknowledging
  // the action would hit the backend.
  React.useEffect(() => {
    function onDocClick(e) {
      const btn = e.target.closest("button.btn");
      if (!btn) return;
      if (btn.classList.contains("icon-btn")) return;
      if (btn.hasAttribute("data-no-toast")) return;
      if (btn.disabled) return;
      // tiny delay so any explicit onClick gets first chance to set toast
      setTimeout(() => {
        const label = (btn.innerText || "").trim().replace(/\s+/g, " ").slice(0, 60);
        if (!label) return;
        const low = label.toLowerCase();
        if (low.startsWith("approve")) {
          add(label + " — approved ✓", "success");
        } else if (low.startsWith("reject") || low.startsWith("delete")) {
          add(label + " — confirmed", "warn");
        } else if (low.startsWith("sign in")) {
          location.hash = "#/dashboard";
        } else {
          add(`"${label}" — demo mode (would call API)`, "default", 1900);
        }
      }, 0);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [add]);

  return (
    <ToastContext.Provider value={add}>
      {children}
      <div className="toast-stack">
        {toasts.map(t => (
          <div key={t.id} className={"toast" + (t.kind !== "default" ? " " + t.kind : "")}>
            <Ico name={t.kind === "success" ? "checkCircle" : t.kind === "warn" ? "alertTri" : t.kind === "danger" ? "alertCirc" : "info"} size={14}/>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Convenience: a "demo action" button that triggers a toast
function demoAction(toast, label) {
  return () => toast(label + " — demo mode (would trigger backend call)", "default");
}

// ============================================
// Sidebar
// ============================================
function Sidebar({ route, role, collapsed, onCollapseToggle }) {
  const visible = ROLE_NAV[role];
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">A</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="brand-name">Atlas</div>
          <div className="brand-sub">EPM · v0.4</div>
        </div>
      </div>

      {NAV.map(section => {
        const items = section.items.filter(it => !visible || visible.includes(it.id));
        if (items.length === 0) return null;
        return (
          <div key={section.section}>
            <div className="nav-section">{section.section}</div>
            {items.map(it => {
              const badge = it.badge ? it.badge() : null;
              const active = route.split("/")[0] === it.route;
              return (
                <a key={it.id} className={"nav-item" + (active ? " active" : "")} href={"#/" + it.route} title={it.label}>
                  <span className="nav-icon"><Ico name={it.icon} size={16}/></span>
                  <span className="nav-label">{it.label}</span>
                  {badge ? <span className={"nav-badge" + (it.badgeKind ? " " + it.badgeKind : "")}>{badge}</span> : null}
                </a>
              );
            })}
          </div>
        );
      })}

      <div className="sidebar-footer">
        {!collapsed && <RoleSwitcher current={role}/>}
      </div>
    </aside>
  );
}

function RoleSwitcher({ current }) {
  const [open, setOpen] = React.useState(false);
  const list = DB.roles.map(r => r.role_name);
  React.useEffect(() => {
    function onClick(e) {
      if (!e.target.closest(".role-switcher")) setOpen(false);
    }
    if (open) {
      document.addEventListener("click", onClick);
      return () => document.removeEventListener("click", onClick);
    }
  }, [open]);
  function pick(r) {
    const url = new URL(location.href);
    url.searchParams.set("role", r);
    location.href = url.toString();
  }
  return (
    <div className="role-switcher" style={{ position: "relative" }}>
      <div className="label">Viewing as</div>
      <button
        onClick={() => setOpen(o => !o)} data-no-toast
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 6,
          color: "#fff",
          padding: "6px 10px",
          fontSize: 12,
          width: "100%",
          textAlign: "left",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}>
        <span>{current}</span>
        <Ico name={open ? "chevDown" : "chevUp"} size={12}/>
      </button>
      {open && (
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          bottom: "calc(100% + 4px)",
          background: "var(--surface)",
          border: "1px solid var(--line)",
          borderRadius: 8,
          boxShadow: "var(--shadow-lg)",
          zIndex: 60,
          maxHeight: 320,
          overflowY: "auto",
        }}>
          {list.map(r => (
            <button key={r} onClick={() => pick(r)} data-no-toast
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 12px",
                fontSize: 12.5,
                color: r === current ? "var(--accent)" : "var(--ink-2)",
                background: r === current ? "var(--accent-soft-2)" : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onMouseEnter={e => { if (r !== current) e.currentTarget.style.background = "var(--surface-2)"; }}
              onMouseLeave={e => { if (r !== current) e.currentTarget.style.background = "transparent"; }}>
              <span>{r}</span>
              {r === current && <Ico name="check" size={12}/>}
            </button>
          ))}
        </div>
      )}
      <div className="row" style={{justifyContent:"space-between", fontSize: 10.5, color: "rgba(255,255,255,0.5)"}}>
        <span>Permissions matrix</span>
        <span>active</span>
      </div>
    </div>
  );
}

// ============================================
// Topbar
// ============================================
function Topbar({ route, role, onCollapseToggle }) {
  const [popoverOpen, setPopoverOpen] = React.useState(null);
  const [tourOpen, setTourOpen] = React.useState(false);
  const toast = useToast();
  const me = DB.employees[0];
  const unread = DB.notifications.filter(n => !n.read).length;

  React.useEffect(() => {
    function onClick(e) {
      if (!e.target.closest(".popover-anchor") && !e.target.closest(".popover")) {
        setPopoverOpen(null);
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className="topbar">
      <button className="icon-btn" title="Toggle sidebar" onClick={onCollapseToggle}>
        <Ico name="panelLeft" size={18}/>
      </button>

      <div className="topbar-search">
        <Ico name="search" size={14}/>
        <input placeholder="Search projects, employees, deliverables..."/>
        <kbd>⌘K</kbd>
      </div>

      <div className="topbar-actions">
        <button className="btn ghost sm" onClick={() => setTourOpen(true)} data-no-toast
                style={{ background: "var(--accent-soft-2)", color: "var(--accent)", border: "1px solid var(--accent-soft)", fontWeight: 500 }}>
          <Ico name="play" size={12}/>Tour
        </button>
        <a className="btn ghost sm" href="#/projects/new"><Ico name="plus" size={13}/>New project</a>

        {/* Notifications popover */}
        <div className="popover-anchor">
          <button className="icon-btn" title="Notifications" onClick={() => setPopoverOpen(popoverOpen === "notif" ? null : "notif")} style={{position:"relative"}}>
            <Ico name="bell" size={16}/>
            {unread > 0 && <span className="dot"/>}
          </button>
          {popoverOpen === "notif" && <NotificationsPopover onClose={() => setPopoverOpen(null)}/>}
        </div>

        {/* Settings popover */}
        <div className="popover-anchor">
          <button className="icon-btn" title="Settings" onClick={() => setPopoverOpen(popoverOpen === "settings" ? null : "settings")}>
            <Ico name="settings" size={16}/>
          </button>
          {popoverOpen === "settings" && <SettingsPopover onClose={() => setPopoverOpen(null)} toast={toast}/>}
        </div>

        {/* User popover */}
        <div className="popover-anchor">
          <div className="user-chip" title={me.full_name} onClick={() => setPopoverOpen(popoverOpen === "user" ? null : "user")}>
            <Avatar employee={me}/>
            <div>
              <div className="name">{me.full_name}</div>
              <div className="role">{role}</div>
            </div>
            <Ico name="chevDown" size={12} color="var(--ink-4)"/>
          </div>
          {popoverOpen === "user" && <UserPopover me={me} role={role} onClose={() => setPopoverOpen(null)} toast={toast}/>}
        </div>
      </div>

      {tourOpen && <Tour onClose={() => setTourOpen(false)} steps={ATLAS_TOUR_STEPS}/>}
    </div>
  );
}

function NotificationsPopover({ onClose }) {
  const list = DB.notifications.slice(0, 6);
  return (
    <div className="popover" style={{ width: 380 }}>
      <div className="popover-h">
        <div className="popover-title">Notifications</div>
        <a className="card-action" style={{ fontSize: 11 }} href="#/notifications" onClick={onClose}>Mark all read</a>
      </div>
      {list.map(n => (
        <a key={n.id} className="popover-item" href={n.link} onClick={onClose}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, flexShrink: 0,
            background: n.type === "approval" ? "var(--blue-soft)" :
                        n.type === "deliverable" ? "var(--violet-soft)" :
                        n.type === "budget" ? "var(--amber-soft)" :
                        n.type === "risk" ? "var(--red-soft)" : "var(--surface-3)",
            color: n.type === "approval" ? "var(--blue)" :
                   n.type === "deliverable" ? "var(--violet)" :
                   n.type === "budget" ? "var(--amber)" :
                   n.type === "risk" ? "var(--red)" : "var(--ink-3)",
            display: "grid", placeItems: "center",
          }}>
            <Ico name={
              n.type === "approval" ? "checkSquare" :
              n.type === "deliverable" ? "layers" :
              n.type === "budget" ? "dollar" :
              n.type === "risk" ? "shield" :
              n.type === "change" ? "git" :
              n.type === "mention" ? "at" : "bell"
            } size={13}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500 }}>{n.title}</div>
            <div className="muted tiny" style={{ marginTop: 2, lineHeight: 1.45 }}>{n.message}</div>
          </div>
          {!n.read && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", marginTop: 8, flexShrink: 0 }}/>}
        </a>
      ))}
      <a className="popover-foot" href="#/notifications" onClick={onClose}>See all notifications →</a>
    </div>
  );
}

function SettingsPopover({ onClose, toast }) {
  return (
    <div className="popover" style={{ width: 220 }}>
      <div className="popover-h">
        <div className="popover-title">Settings</div>
      </div>
      {[
        { label: "Workspace settings", icon: "settings", href: "#/settings" },
        { label: "Users & permissions", icon: "users", href: "#/settings" },
        { label: "Disciplines", icon: "layers", href: "#/settings" },
        { label: "Templates", icon: "fileText", href: "#/settings" },
        { label: "Integrations", icon: "link", href: "#/settings" },
      ].map(i => (
        <a key={i.label} className="popover-item" href={i.href} onClick={onClose}>
          <Ico name={i.icon} size={14} color="var(--ink-3)"/>
          <span style={{ fontSize: 13 }}>{i.label}</span>
        </a>
      ))}
      <div className="popover-item" onClick={() => { toast("Help center opening...", "default"); onClose(); }}>
        <Ico name="help" size={14} color="var(--ink-3)"/>
        <span style={{ fontSize: 13 }}>Help & support</span>
      </div>
    </div>
  );
}

function UserPopover({ me, role, onClose, toast }) {
  return (
    <div className="popover" style={{ width: 260 }}>
      <div style={{ padding: "14px 14px 10px", borderBottom: "1px solid var(--line)" }}>
        <div className="row" style={{ gap: 10 }}>
          <Avatar employee={me} size="lg"/>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 500, fontSize: 13 }}>{me.full_name}</div>
            <div className="muted tiny" style={{ whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{me.email}</div>
            <div className="muted tiny" style={{ marginTop: 4 }}>{role}</div>
          </div>
        </div>
      </div>
      <a className="popover-item" href={"#/employees/" + me.employee_id} onClick={onClose}>
        <Ico name="user" size={14} color="var(--ink-3)"/>
        <span style={{ fontSize: 13 }}>My profile</span>
      </a>
      <a className="popover-item" href="#/settings" onClick={onClose}>
        <Ico name="settings" size={14} color="var(--ink-3)"/>
        <span style={{ fontSize: 13 }}>Preferences</span>
      </a>
      <div className="popover-item" onClick={() => { toast("Theme switching coming soon", "default"); onClose(); }}>
        <Ico name="eye" size={14} color="var(--ink-3)"/>
        <span style={{ fontSize: 13 }}>Theme</span>
      </div>
      <a className="popover-item" href="#/login" onClick={onClose} style={{ color: "var(--red)" }}>
        <Ico name="logOut" size={14}/>
        <span style={{ fontSize: 13 }}>Sign out</span>
      </a>
    </div>
  );
}

// ============================================
// Router
// ============================================
function parseHash(hash) {
  let h = hash.replace(/^#\/?/, "");
  if (!h) return { route: "dashboard", parts: [] };
  const parts = h.split("/");
  return { route: parts[0], parts: parts.slice(1), raw: h };
}
function useRoute() {
  const [hash, setHash] = React.useState(() => location.hash);
  React.useEffect(() => {
    const on = () => setHash(location.hash);
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return parseHash(hash);
}

function navTo(path) {
  if (!path.startsWith("#")) path = "#/" + path.replace(/^\//, "");
  location.hash = path;
  window.scrollTo({ top: 0, behavior: "instant" });
}

Object.assign(window, {
  Sidebar, Topbar, NAV, ROLE_NAV, parseHash, useRoute, navTo,
  ToastHost, useToast, demoAction,
  NotificationsPopover, SettingsPopover, UserPopover,
});
