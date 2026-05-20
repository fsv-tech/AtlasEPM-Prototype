// ============================================
// Helix PM — shared UI primitives (icons, charts)
// ============================================

const { useState, useEffect, useMemo, useRef } = React;

// --- Icons (24x24 stroke 1.5) ----------------
function Icon({ name, size = 16, ...rest }) {
  const stroke = 1.5;
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round", ...rest };
  switch (name) {
    case "grid":     return <svg {...common}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
    case "database": return <svg {...common}><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.66 3.58 3 8 3s8-1.34 8-3V5"/><path d="M4 11v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/></svg>;
    case "calendar": return <svg {...common}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>;
    case "gantt":    return <svg {...common}><path d="M3 5h8M3 12h12M3 19h6"/><path d="M11 4v2M15 11v2M9 18v2"/></svg>;
    case "shield":   return <svg {...common}><path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z"/></svg>;
    case "check":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/></svg>;
    case "share":    return <svg {...common}><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/></svg>;
    case "help":     return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.5-1 1-1 2"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></svg>;
    case "branch":   return <svg {...common}><circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8M8 6c4 0 8 2 8 6"/></svg>;
    case "coin":     return <svg {...common}><ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/></svg>;
    case "doc":      return <svg {...common}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>;
    case "folder":   return <svg {...common}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
    case "mail":     return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case "info":     return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r="0.7" fill="currentColor"/></svg>;
    case "users":    return <svg {...common}><circle cx="9" cy="9" r="3.5"/><path d="M2.5 19c.5-3.5 3.5-5 6.5-5s5.5 1.5 6.5 4.5"/><circle cx="17" cy="8" r="2.5"/><path d="M17 13c2.5 0 4.3 1.4 4.5 4"/></svg>;
    case "search":   return <svg {...common}><circle cx="11" cy="11" r="7"/><path d="M16 16l4 4"/></svg>;
    case "bell":     return <svg {...common}><path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/></svg>;
    case "settings": return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "plus":     return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case "arrow-up-right": return <svg {...common}><path d="M7 17 17 7M9 7h8v8"/></svg>;
    case "arrow-down": return <svg {...common}><path d="M12 5v14M19 12l-7 7-7-7"/></svg>;
    case "arrow-up":   return <svg {...common}><path d="M12 19V5M5 12l7-7 7 7"/></svg>;
    case "arrow-right": return <svg {...common}><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    case "chevron-down": return <svg {...common}><path d="M6 9l6 6 6-6"/></svg>;
    case "chevron-right": return <svg {...common}><path d="M9 6l6 6-6 6"/></svg>;
    case "menu":     return <svg {...common}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "filter":   return <svg {...common}><path d="M3 5h18l-7 9v5l-4 2v-7L3 5z"/></svg>;
    case "sort":     return <svg {...common}><path d="M3 6h13M3 12h9M3 18h5M18 6v12M14 14l4 4 4-4"/></svg>;
    case "more":     return <svg {...common}><circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/></svg>;
    case "edit":     return <svg {...common}><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>;
    case "trash":    return <svg {...common}><path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/></svg>;
    case "link":     return <svg {...common}><path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07L11 5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07L13 19"/></svg>;
    case "paperclip":return <svg {...common}><path d="M21 12.5L13 21a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/></svg>;
    case "clock":    return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "play":     return <svg {...common}><path d="M6 4l14 8-14 8z" fill="currentColor"/></svg>;
    case "pause":    return <svg {...common}><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg>;
    case "phone":    return <svg {...common}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/></svg>;
    case "at":       return <svg {...common}><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/></svg>;
    case "map-pin":  return <svg {...common}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
    case "x":        return <svg {...common}><path d="M6 6l12 12M6 18L18 6"/></svg>;
    case "panel-left": return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M6 8h0M6 12h0"/></svg>;
    case "trend-up": return <svg {...common}><path d="M3 17l6-6 4 4 8-9M14 6h7v7"/></svg>;
    case "circle":   return <svg {...common}><circle cx="12" cy="12" r="8"/></svg>;
    case "dot":      return <svg {...common}><circle cx="12" cy="12" r="4" fill="currentColor"/></svg>;
    case "send":     return <svg {...common}><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>;
    case "download": return <svg {...common}><path d="M12 4v12M6 12l6 6 6-6M4 20h16"/></svg>;
    case "upload":   return <svg {...common}><path d="M12 20V8M6 12l6-6 6 6M4 4h16"/></svg>;
    case "history":  return <svg {...common}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/></svg>;
    default: return <svg {...common}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

// --- Avatar ---------------------------------
function Avatar({ name, size, color }) {
  const className = "avatar" + (size === "sm" ? " avatar-sm" : size === "lg" ? " avatar-lg" : "");
  // try to look up in HX.team
  const member = HX.team.find(m => m.init === name || m.name === name);
  const init = member?.init || (typeof name === "string" ? name.slice(0,2).toUpperCase() : "??");
  const bg = color || member?.color || "#E6E3DA";
  // contrasty text
  return (
    <span className={className} style={{ background: bg, color: "#fff" }} title={member?.name || name}>{init}</span>
  );
}

function AvatarStack({ names, size }) {
  return (
    <span className="avatar-stack">
      {names.slice(0,4).map(n => <Avatar key={n} name={n} size={size} />)}
      {names.length > 4 && <span className={"avatar" + (size==="sm"?" avatar-sm":"")} style={{background:"var(--surface-3)",color:"var(--ink-3)"}}>+{names.length-4}</span>}
    </span>
  );
}

// --- Sparkline ------------------------------
function Sparkline({ data, color = "var(--ink)", w = 120, h = 36, fill = true, stroke = 1.5 }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data.map((d, i) => [i*step, h - ((d - min) / range) * (h - 6) - 3]);
  const path = points.map((p,i) => (i===0?"M":"L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;
  const last = points[points.length-1];
  return (
    <svg className="spark" width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {fill && <path d={area} fill={color} opacity="0.10"/>}
      <path d={path} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color}/>
    </svg>
  );
}

// --- Donut ----------------------------------
function Donut({ value, max = 100, size = 120, thickness = 12, color = "var(--ink)", track = "var(--surface-3)", children, gap = 0, segments }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  if (segments) {
    // multi-segment donut: array of {value, color}
    let offset = 0;
    const total = segments.reduce((s,seg)=>s+seg.value, 0);
    return (
      <div className="donut-wrap" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={thickness}/>
          {segments.map((seg, i) => {
            const len = (seg.value / total) * c;
            const dash = `${Math.max(0,len-gap)} ${c}`;
            const dashoff = -offset;
            offset += len;
            return <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={seg.color} strokeWidth={thickness} strokeDasharray={dash} strokeDashoffset={dashoff} transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="butt"/>;
          })}
        </svg>
        <div className="donut-center">{children}</div>
      </div>
    );
  }
  const pct = Math.max(0, Math.min(1, value/max));
  return (
    <div className="donut-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={thickness}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={thickness}
          strokeDasharray={`${c*pct} ${c}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div className="donut-center">{children}</div>
    </div>
  );
}

// --- Bar chart (simple) ---------------------
function Bars({ values, labels, color = "var(--ink)", h = 90, w = 280, barW = 14, gap = 8 }) {
  const max = Math.max(...values);
  const total = values.length * (barW + gap) - gap;
  const offset = (w - total) / 2;
  return (
    <svg width={w} height={h+18} viewBox={`0 0 ${w} ${h+18}`}>
      {values.map((v, i) => {
        const bh = (v / max) * h;
        const x = offset + i * (barW + gap);
        const y = h - bh;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx={barW/2.4} fill={color} opacity={i === values.length-1 ? 1 : 0.7}/>
            {labels && <text x={x + barW/2} y={h+12} textAnchor="middle" fontSize="9.5" fill="var(--ink-4)" fontFamily="var(--font-mono)">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// --- Stacked bar (for cost) -----------------
function StackedBar({ segments, height = 8 }) {
  const total = segments.reduce((s,seg)=>s+seg.value, 0);
  return (
    <div style={{ display:"flex", width:"100%", height, borderRadius: height, overflow:"hidden", gap: 2, background: "var(--surface-3)" }}>
      {segments.map((seg, i) => (
        <div key={i} title={`${seg.label}: ${seg.value}`} style={{ width: `${(seg.value/total)*100}%`, background: seg.color }} />
      ))}
    </div>
  );
}

// --- Status pill helpers --------------------
const statusClass = (s) => {
  const m = {
    "Open": "warn", "In Progress": "info", "In Review": "info", "Done": "success", "Closed": "success",
    "Approved": "success", "Submitted": "info", "Pending": "warn", "Rejected": "danger", "Overdue": "danger",
    "Mitigated": "success", "Issued": "success", "Issued for Construction": "success",
    "Issued for Review": "info", "WIP": "warn", "Received": "info", "Sent": "neutral",
    "Running": "info", "Closeout": "violet", "Mobilising": "warm",
  };
  return m[s] || "neutral";
};

const priorityClass = (p) => ({ High: "danger", Medium: "warn", Low: "neutral" }[p] || "neutral");

// --- Table primitives -----------------------
function TableWrap({ title, subtitle, actions, count, children }) {
  return (
    <div className="table-wrap">
      <div className="table-head">
        <div className="table-head-l">
          <div className="row" style={{gap:8}}>
            <h3 className="card-title" style={{fontSize:20}}>{title}</h3>
            {count != null && <span className="badge neutral">{count}</span>}
          </div>
          {subtitle && <div className="muted tiny">{subtitle}</div>}
        </div>
        <div className="table-head-r">{actions}</div>
      </div>
      {children}
    </div>
  );
}

// --- Format helpers ------------------------
const fmtMoney = (m, unit = "M DKK") => `${m.toFixed(1)} ${unit}`;
const fmtDate = (s) => {
  if (!s) return "—";
  const [y,m,d] = s.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(d,10)} ${months[parseInt(m,10)-1]} ${y.slice(2)}`;
};
const daysFromNow = (s) => {
  const today = new Date("2026-05-19");
  const d = new Date(s);
  return Math.round((d - today) / 86400000);
};

Object.assign(window, {
  Icon, Avatar, AvatarStack, Sparkline, Donut, Bars, StackedBar,
  statusClass, priorityClass, TableWrap, fmtMoney, fmtDate, daysFromNow,
});
