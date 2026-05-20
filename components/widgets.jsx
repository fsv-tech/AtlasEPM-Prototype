// ============================================
// Atlas — Shared widgets
// KPI cards, sparkline, donut, bars, stacked bars, mini charts
// ============================================

const { useState, useEffect, useMemo, useRef } = React;

// ---------- Avatar -----------------------
function Avatar({ name, employee, size, color }) {
  const cls = "avatar" + (size ? " " + size : "");
  const emp = employee || (name && DB.employees.find(e => e.employee_id === name || e.full_name === name));
  const display = emp ? U.initials(emp.full_name) : (typeof name === "string" ? U.initials(name) : "??");
  const fullName = emp ? emp.full_name : name;
  const seed = (fullName || display).split("").reduce((a,c)=>a+c.charCodeAt(0), 0);
  const palette = ["#2563EB","#0EA5E9","#14B8A6","#10B981","#F59E0B","#F97316","#EF4444","#EC4899","#8B5CF6","#4F46E5","#475569"];
  const bg = color || palette[seed % palette.length];
  return <span className={cls} style={{ background: bg, color: "#fff" }} title={fullName}>{display}</span>;
}
function AvatarStack({ names, employees, size, max = 4 }) {
  const list = employees || (names || []);
  const visible = list.slice(0, max);
  const extra = list.length - max;
  return (
    <span className="avatar-stack">
      {visible.map((n, i) => {
        const isEmp = typeof n === "object";
        return isEmp
          ? <Avatar key={i} employee={n} size={size} />
          : <Avatar key={i} name={n} size={size} />;
      })}
      {extra > 0 && <span className={"avatar " + (size||"")} style={{ background: "var(--surface-3)", color: "var(--ink-3)" }}>+{extra}</span>}
    </span>
  );
}

// ---------- KPI ----------------------------
function KPI({ label, value, unit, icon, delta, deltaDir, foot, featured, color, sparkData, ...rest }) {
  return (
    <div className={"kpi" + (featured ? " featured" : "")} {...rest}>
      <div className="kpi-label">
        {icon && <Ico name={icon} size={12} />}
        {label}
      </div>
      <div className="kpi-value" style={color ? { color } : null}>
        {value}{unit && <span className="unit">{unit}</span>}
      </div>
      <div className="kpi-foot">
        {(delta || foot) && (
          <span className={"kpi-delta" + (deltaDir==="up"?" up":deltaDir==="down"?" down":"")}>
            {deltaDir === "up" && <Ico name="arrUp" size={11} />}
            {deltaDir === "down" && <Ico name="arrDown" size={11} />}
            {delta || foot}
          </span>
        )}
        {sparkData && <Sparkline data={sparkData} color={featured ? "rgba(255,255,255,0.7)" : (deltaDir==="down" ? "var(--red)" : "var(--accent)")} w={60} h={24} />}
      </div>
    </div>
  );
}

// ---------- Sparkline ----------------------
function Sparkline({ data, color, w = 120, h = 36, fill = true, stroke = 1.5 }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((d, i) => [i*step, h - ((d - min) / range) * (h - 4) - 2]);
  const path = pts.map((p,i) => (i===0?"M":"L") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = path + ` L ${w} ${h} L 0 ${h} Z`;
  const last = pts[pts.length-1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display:"block"}}>
      {fill && <path d={area} fill={color} opacity={0.1}/>}
      <path d={path} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={last[0]} cy={last[1]} r={2.2} fill={color} />
    </svg>
  );
}

// ---------- Donut --------------------------
function Donut({ value, max = 100, size = 120, thickness = 12, color = "var(--accent)", track = "var(--surface-3)", children, gap = 0, segments }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  if (segments) {
    let offset = 0;
    const total = segments.reduce((s,seg)=>s+seg.value, 0) || 1;
    return (
      <div style={{ position:"relative", width: size, height: size, display:"inline-block" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={thickness}/>
          {segments.map((seg, i) => {
            const len = (seg.value / total) * c;
            const dash = `${Math.max(0, len-gap)} ${c}`;
            const dashoff = -offset;
            offset += len;
            return <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
              stroke={seg.color} strokeWidth={thickness}
              strokeDasharray={dash} strokeDashoffset={dashoff}
              transform={`rotate(-90 ${size/2} ${size/2})`}/>;
          })}
        </svg>
        {children != null && (
          <div style={{ position:"absolute", inset: 0, display:"grid", placeItems:"center", textAlign:"center", pointerEvents:"none" }}>{children}</div>
        )}
      </div>
    );
  }
  const pct = Math.max(0, Math.min(1, value/max));
  return (
    <div style={{ position:"relative", width: size, height: size, display:"inline-block" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={thickness}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={thickness}
          strokeDasharray={`${c*pct} ${c}`} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      {children != null && (
        <div style={{ position:"absolute", inset: 0, display:"grid", placeItems:"center", textAlign:"center", pointerEvents:"none" }}>{children}</div>
      )}
    </div>
  );
}

// ---------- Bars ---------------------------
function Bars({ values, labels, colors, h = 90, barW = 14, gap = 8, highlight }) {
  const max = Math.max(...values) || 1;
  const total = values.length * (barW + gap) - gap;
  // Use viewBox so the chart scales to fill its container.
  const w = total + 4;
  return (
    <svg width="100%" height={h+18} viewBox={`0 0 ${w} ${h+18}`} preserveAspectRatio="xMidYMid meet" style={{display:"block"}}>
      {values.map((v, i) => {
        const bh = (v / max) * h;
        const x = i * (barW + gap);
        const y = h - bh;
        const col = colors ? colors[i] : "var(--accent)";
        const isHL = highlight != null && i === highlight;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={bh} rx={barW/2.4}
              fill={col} opacity={isHL ? 1 : 0.85}/>
            {labels && <text x={x + barW/2} y={h+13} textAnchor="middle" fontSize="9.5" fill="var(--ink-4)" fontFamily="var(--font-mono)">{labels[i]}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Stacked bar -------------------
function StackedBar({ segments, height = 8 }) {
  const total = segments.reduce((s,seg)=>s+seg.value, 0) || 1;
  return (
    <div style={{ display:"flex", width:"100%", height, borderRadius: height/2, overflow:"hidden", gap: 1, background: "var(--surface-3)" }}>
      {segments.map((seg, i) => (
        <div key={i} title={`${seg.label}: ${seg.value}`} style={{ width: `${(seg.value/total)*100}%`, background: seg.color }} />
      ))}
    </div>
  );
}

// ---------- Status pill ---------------------
function Status({ value }) {
  return <span className={"badge " + U.statusClass(value)}><span className="dot"/>{value}</span>;
}

// ---------- Progress with label -------------
function ProgressWithLabel({ value, color, height = 6 }) {
  return (
    <div className="row" style={{ gap: 10 }}>
      <div className="progress" style={{ flex: 1, height }}>
        <span style={{ width: value + "%", background: color || "var(--accent)" }}/>
      </div>
      <span className="mono tiny" style={{ minWidth: 32, textAlign: "right" }}>{value}%</span>
    </div>
  );
}

// ---------- Line chart (S-curve, simple) -----
function LineChart({ series, months, h = 200, currentIdx, yMax }) {
  const w = 600;
  const pad = 28;
  const allVals = series.flatMap(s => s.data.filter(v => v != null));
  const max = yMax || Math.max(...allVals, 1);
  const xs = (i) => pad + (i/(months.length-1)) * (w - pad*2);
  const ys = (v) => h - pad - (v/max) * (h - pad*1.6);
  const path = (data) => data.map((v, i) => v==null ? null : (i===0 || data[i-1]==null?"M":"L") + xs(i).toFixed(1) + " " + ys(v).toFixed(1)).filter(Boolean).join(" ");

  const gridSteps = 5;
  return (
    <svg width="100%" height={h+18} viewBox={`0 0 ${w} ${h+18}`} preserveAspectRatio="xMidYMid meet" style={{display:"block"}}>
      {Array.from({length:gridSteps+1}).map((_,i) => {
        const v = (max/gridSteps) * i;
        return (
          <g key={i}>
            <line x1={pad} y1={ys(v)} x2={w-pad} y2={ys(v)} stroke="var(--line)"/>
            <text x={pad-6} y={ys(v)+3} textAnchor="end" fontSize="9" fill="var(--ink-4)" fontFamily="var(--font-mono)">{Math.round(v)}</text>
          </g>
        );
      })}
      {series.map((s, idx) => (
        <g key={idx}>
          <path d={path(s.data)} stroke={s.color} strokeWidth={s.dashed ? 1.5 : 2} fill="none"
            strokeDasharray={s.dashed ? "4 3" : null} strokeLinecap="round" strokeLinejoin="round"/>
          {s.data.map((v, i) => v == null ? null : (
            <circle key={i} cx={xs(i)} cy={ys(v)} r={s.dotR || 2.5} fill={s.color}/>
          ))}
        </g>
      ))}
      {currentIdx != null && (
        <g>
          <line x1={xs(currentIdx)} y1={pad-4} x2={xs(currentIdx)} y2={h-pad} stroke="var(--accent)" strokeDasharray="2 2" opacity="0.6"/>
          <text x={xs(currentIdx)} y={pad-8} textAnchor="middle" fontSize="9" fill="var(--accent)" fontFamily="var(--font-mono)">NOW</text>
        </g>
      )}
      {months.map((m, i) => (
        i % Math.ceil(months.length/8) === 0 ? <text key={i} x={xs(i)} y={h-pad+12} textAnchor="middle" fontSize="9" fill="var(--ink-4)">{m}</text> : null
      ))}
    </svg>
  );
}

// ---------- Card heading helper -------------
function CardH({ title, subtitle, action, onAction }) {
  return (
    <div className="card-h">
      <div>
        <h3 className="card-title">{title}</h3>
        {subtitle && <div className="muted tiny" style={{marginTop: 2}}>{subtitle}</div>}
      </div>
      {action && (
        <button className="card-action" onClick={onAction}>
          {action} <Ico name="arrRight" size={11}/>
        </button>
      )}
    </div>
  );
}

// ---------- Page header ----------------------
function PageHeader({ eyebrow, title, subtitle, actions, crumb }) {
  return (
    <>
      {crumb && (
        <div className="crumb">
          {crumb.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <Ico name="chevRight" size={12}/>}
              {c.onClick
                ? <a onClick={c.onClick} style={{cursor:"pointer"}}>{c.label}</a>
                : <span style={{color: i === crumb.length-1 ? "var(--ink)" : null}}>{c.label}</span>
              }
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="page-header">
        <div>
          {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="row" style={{gap: 6, flexWrap:"wrap", justifyContent:"flex-end"}}>{actions}</div>}
      </div>
    </>
  );
}

// ---------- Empty state ---------------------
function Empty({ icon = "box", title, subtitle, action }) {
  return (
    <div className="empty">
      <Ico name={icon} size={28} color="var(--ink-5)" />
      <h3>{title}</h3>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>{subtitle}</div>
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}

Object.assign(window, {
  Avatar, AvatarStack, KPI, Sparkline, Donut, Bars, StackedBar,
  Status, ProgressWithLabel, LineChart, CardH, PageHeader, Empty,
});
