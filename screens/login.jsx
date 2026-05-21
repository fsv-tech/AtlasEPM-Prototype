// ============================================
// Atlas — Screen 1: Login
// ============================================

function ScreenLogin() {
  const [email, setEmail]       = React.useState("anders.vestergaard@helix.eng");
  const [password, setPassword] = React.useState("•••••••••••");
  const [showPw, setShowPw]     = React.useState(false);

  return (
    <div className="login-page">
      {/* Left art panel */}
      <div className="login-art">
        <div className="row" style={{ gap: 10 }}>
          <div className="brand-mark">A</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em" }}>Atlas</div>
            <div style={{ fontSize: 10, letterSpacing: 0.14*16 + "px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>Engineering PM</div>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: 12 }}>
            One platform · 14 disciplines · 14,000 deliverables
          </div>
          <h1 style={{ fontSize: 38, fontWeight: 500, letterSpacing: "-0.035em", lineHeight: 1.05, margin: 0, marginBottom: 14, maxWidth: 440 }}>
            From spreadsheet chaos to one source of truth.
          </h1>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", maxWidth: 420, lineHeight: 1.5 }}>
            Atlas replaces the bridging-study workbook your team has been hand-rolling for years — the cost engine, the resource loader, the deliverables tracker, the approval chain — and connects them into a single living data centre.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22, marginTop: 36, maxWidth: 460 }}>
            {(() => {
              const kpi = DB.portfolioKPIs();
              return [
                { v: String(kpi.activeProjects),                 l: "Active projects" },
                { v: "$" + (kpi.budgetTotal/1e6).toFixed(0) + "M", l: "Budget under mgmt" },
                { v: String(kpi.resources),                       l: "Engineers planned" },
              ];
            })().map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: "-0.03em" }}>{s.v}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", position: "relative", zIndex: 2 }}>
          © Atlas EPM 2026 · SOC 2 Type II · ISO 27001
        </div>

        {/* decorative grid */}
        <svg style={{ position: "absolute", right: -100, top: -80, opacity: 0.08, pointerEvents: "none" }} width="600" height="600" viewBox="0 0 600 600">
          {Array.from({ length: 21 }).map((_, i) => (
            <g key={i}>
              <line x1={i*30} y1="0" x2={i*30} y2="600" stroke="#fff" strokeWidth="0.5"/>
              <line x1="0" y1={i*30} x2="600" y2={i*30} stroke="#fff" strokeWidth="0.5"/>
            </g>
          ))}
        </svg>
        <svg style={{ position: "absolute", left: 30, bottom: 80, opacity: 0.07, pointerEvents: "none" }} width="320" height="220" viewBox="0 0 320 220">
          <path d="M0,180 Q40,120 80,140 T160,90 T240,50 T320,30" stroke="#fff" strokeWidth="2" fill="none"/>
          <path d="M0,200 Q40,180 80,170 T160,140 T240,100 T320,70" stroke="#fff" strokeWidth="2" fill="none" strokeDasharray="4 3"/>
        </svg>
      </div>

      {/* Right form */}
      <div className="login-form-wrap">
        <div className="login-form">
          <div style={{ marginBottom: 8 }}>
            <div className="page-eyebrow" style={{ marginBottom: 8 }}>Sign in</div>
            <h2 style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", margin: 0 }}>Welcome back</h2>
            <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>Use your Microsoft account or sign in with email.</div>
          </div>

          <button className="btn" style={{ justifyContent: "center", padding: "10px 14px", border: "1px solid var(--line-2)" }}>
            <svg width="14" height="14" viewBox="0 0 21 21"><rect width="10" height="10" fill="#F25022"/><rect x="11" width="10" height="10" fill="#7FBA00"/><rect y="11" width="10" height="10" fill="#00A4EF"/><rect x="11" y="11" width="10" height="10" fill="#FFB900"/></svg>
            Continue with Microsoft
          </button>

          <div className="row" style={{ gap: 12, color: "var(--ink-4)" }}>
            <div className="divider" style={{ flex: 1 }}></div>
            <span className="tiny">or</span>
            <div className="divider" style={{ flex: 1 }}></div>
          </div>

          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email"/>
          </div>
          <div className="field">
            <label>Password</label>
            <div style={{ position: "relative" }}>
              <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}/>
              <button onClick={() => setShowPw(!showPw)} className="icon-btn"
                style={{ position: "absolute", right: 4, top: "50%", transform: "translateY(-50%)", width: 28, height: 28 }}>
                <Ico name={showPw ? "eyeOff" : "eye"} size={14}/>
              </button>
            </div>
          </div>

          <div className="row" style={{ justifyContent: "space-between", fontSize: 12 }}>
            <label className="row" style={{ gap: 6, color: "var(--ink-3)", cursor: "pointer" }}>
              <input type="checkbox" defaultChecked/> Remember me
            </label>
            <a className="muted" style={{ cursor: "pointer", color: "var(--accent)" }}>Forgot password?</a>
          </div>

          <button className="btn primary" style={{ padding: "11px", justifyContent: "center" }} onClick={() => navTo("dashboard")}>
            Sign in
          </button>

          <div className="muted tiny" style={{ textAlign: "center", marginTop: 8 }}>
            Need an account? <a style={{ color: "var(--accent)", cursor: "pointer" }}>Contact your administrator</a>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScreenLogin = ScreenLogin;
