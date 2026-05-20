// ============================================
// Atlas — Table & layout primitives
// DataTable, FilterBar, Drawer, Modal, Tabs, Field
// ============================================

// ---------- Data Table -------------------
function DataTable({ columns, rows, onRowClick, selectedKey, rowKey = "id", emptyMessage }) {
  if (!rows || rows.length === 0) {
    return <Empty title="No records" subtitle={emptyMessage || "No data matches your filters."}/>;
  }
  return (
    <table className="data">
      <thead>
        <tr>
          {columns.map((c, i) => (
            <th key={i} style={c.headerStyle} className={c.numeric ? "num" : ""}>
              {c.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => {
          const key = r[rowKey] || r.id || r.project_id || r.employee_id || r.deliverable_id;
          const selected = selectedKey === key;
          return (
            <tr key={key}
                className={selected ? "selected" : ""}
                onClick={onRowClick ? () => onRowClick(r) : undefined}
                style={onRowClick ? null : { cursor: "default" }}>
              {columns.map((c, i) => (
                <td key={i} style={c.cellStyle} className={c.numeric ? "num" : ""}>
                  {c.render ? c.render(r) : r[c.field]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ---------- TableWrap (card + header) ----
function TableWrap({ title, subtitle, count, actions, children }) {
  return (
    <div className="table-wrap">
      <div className="table-head">
        <div className="table-head-l">
          <div className="row" style={{gap:8}}>
            {title && <h3 className="card-title">{title}</h3>}
            {count != null && <span className="badge neutral">{count}</span>}
          </div>
          {subtitle && <div className="muted tiny">{subtitle}</div>}
        </div>
        {actions && <div className="table-head-r">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

// ---------- FilterBar --------------------
function FilterBar({ chips, value, onChange, searchPlaceholder, search, onSearch, right }) {
  return (
    <div className="row" style={{ gap: 12, flexWrap: "wrap" }}>
      {onSearch && (
        <div className="topbar-search" style={{ maxWidth: 260, flex: 1, minWidth: 200, background: "var(--surface)", border: "1px solid var(--line)" }}>
          <Ico name="search" size={14} color="var(--ink-4)" />
          <input value={search || ""} onChange={e => onSearch(e.target.value)} placeholder={searchPlaceholder || "Search…"}/>
        </div>
      )}
      {chips && (
        <div className="chips">
          {chips.map(c => (
            <button key={c.value || c} className={"chip" + (value === (c.value || c) ? " active" : "")} onClick={() => onChange(c.value || c)}>
              {c.label || c}{c.count != null && <span className="muted tiny mono"> {c.count}</span>}
            </button>
          ))}
        </div>
      )}
      <div style={{ flex: 1 }}/>
      {right}
    </div>
  );
}

// ---------- Drawer -----------------------
function Drawer({ title, onClose, children, footer, width = 560 }) {
  React.useEffect(() => {
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" style={{ width }} onClick={e => e.stopPropagation()}>
        <div style={{ position: "sticky", top: 0, background: "var(--surface)", zIndex: 2, padding: "16px 22px", borderBottom: "1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <div className="page-eyebrow" style={{margin: 0}}>{title}</div>
          <button className="icon-btn" onClick={onClose}><Ico name="x" size={14}/></button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
        {footer && (
          <div style={{ position: "sticky", bottom: 0, background: "var(--surface)", borderTop: "1px solid var(--line)", padding: "12px 22px", display:"flex", gap: 8, justifyContent:"flex-end" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Modal -----------------------
function Modal({ title, onClose, children, footer, width }) {
  React.useEffect(() => {
    const esc = e => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={width ? { width } : null} onClick={e => e.stopPropagation()}>
        <div style={{padding:"18px 22px", borderBottom:"1px solid var(--line)", display:"flex", alignItems:"center", justifyContent:"space-between"}}>
          <h3 className="card-title" style={{fontSize:16}}>{title}</h3>
          <button className="icon-btn" onClick={onClose}><Ico name="x" size={14}/></button>
        </div>
        <div style={{padding: 22}}>{children}</div>
        {footer && (
          <div style={{padding: "12px 22px", borderTop:"1px solid var(--line)", display:"flex", gap: 8, justifyContent:"flex-end"}}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Tabs -------------------------
function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <div key={t.value || t}
             className={"tab" + (active === (t.value || t) ? " active" : "")}
             onClick={() => onChange(t.value || t)}>
          {t.icon && <Ico name={t.icon} size={14}/>}
          {t.label || t}
          {t.count != null && <span className="count">{t.count}</span>}
        </div>
      ))}
    </div>
  );
}

// ---------- Field row (drawer detail) ----
function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="muted xs" style={{ letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>{children}</div>
    </div>
  );
}

// ---------- Stat box ---------------------
function StatBox({ label, value, sub, color }) {
  return (
    <div style={{ background: "var(--surface-2)", border:"1px solid var(--line)", borderRadius: 8, padding: "10px 12px" }}>
      <div className="muted xs" style={{ letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", color: color || "var(--ink)", lineHeight: 1.1 }}>{value}</div>
      {sub && <div className="muted tiny" style={{ marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ---------- Pagination ----------------------
function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="row" style={{ justifyContent:"space-between", padding: "12px 18px", borderTop: "1px solid var(--line)" }}>
      <span className="muted tiny">Page {page} of {totalPages}</span>
      <div className="row" style={{ gap: 4 }}>
        <button className="btn sm" disabled={page <= 1} onClick={() => onPage(page-1)}>
          <Ico name="chevLeft" size={12}/> Prev
        </button>
        <button className="btn sm" disabled={page >= totalPages} onClick={() => onPage(page+1)}>
          Next <Ico name="chevRight" size={12}/>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  DataTable, TableWrap, FilterBar, Drawer, Modal, Tabs, Field, StatBox, Pagination,
  CreateRecordModal, ExportModal,
});

// ============================================
// CreateRecordModal — generic "New X" form modal
// ============================================
function CreateRecordModal({ title, subtitle, fields, onClose, onSubmit, submitLabel, submitIcon, width = 640 }) {
  const initial = React.useMemo(() => {
    const o = {};
    fields.forEach(f => { o[f.name] = f.default != null ? f.default : ""; });
    return o;
  }, [fields]);
  const [form, setForm] = React.useState(initial);
  function up(k, v) { setForm(f => ({ ...f, [k]: v })); }

  return (
    <Modal title={title} onClose={onClose} width={width}
           footer={
             <>
               <button className="btn" onClick={onClose}>Cancel</button>
               <button className="btn primary" onClick={() => { onSubmit && onSubmit(form); onClose(); }}>
                 <Ico name={submitIcon || "plus"} size={13}/>{submitLabel || "Create"}
               </button>
             </>
           }>
      {subtitle && <div className="muted" style={{ fontSize: 13, marginBottom: 14, marginTop: -4 }}>{subtitle}</div>}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {fields.map(f => (
          <div key={f.name} className="field" style={f.span === 2 || f.type === "textarea" ? { gridColumn: "1 / -1" } : null}>
            <label>{f.label}{f.required ? " *" : ""}</label>
            {f.type === "textarea" ? (
              <textarea rows={f.rows || 3} value={form[f.name]} onChange={e => up(f.name, e.target.value)} placeholder={f.placeholder}/>
            ) : f.type === "select" ? (
              <select value={form[f.name]} onChange={e => up(f.name, e.target.value)}>
                {f.options.map(o => {
                  const val = typeof o === "object" ? o.value : o;
                  const lab = typeof o === "object" ? o.label : o;
                  return <option key={val} value={val}>{lab}</option>;
                })}
              </select>
            ) : (
              <input type={f.type || "text"} value={form[f.name]} onChange={e => up(f.name, e.target.value)} placeholder={f.placeholder} min={f.min} max={f.max} step={f.step}/>
            )}
            {f.hint && <div className="hint">{f.hint}</div>}
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ============================================
// ExportModal — used by every Export button
// ============================================
function ExportModal({ title = "Export", entity = "records", count, scopeOptions, onClose }) {
  const [format, setFormat] = React.useState("xlsx");
  const [scope, setScope]   = React.useState(scopeOptions ? scopeOptions[0].value : "current");
  const [include, setInclude] = React.useState({ filters: true, columns: true, attachments: false });
  return (
    <Modal title={title} onClose={onClose} width={520}
           footer={
             <>
               <button className="btn" onClick={onClose}>Cancel</button>
               <button className="btn primary" onClick={onClose}><Ico name="download" size={13}/>Download</button>
             </>
           }>
      <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
        Exporting {count != null ? <b>{count}</b> : null} {entity} as a downloadable file.
      </div>

      <div className="field" style={{ marginBottom: 14 }}>
        <label>Format</label>
        <div className="row" style={{ gap: 8 }}>
          {[
            { v: "xlsx", l: "Excel", i: "grid" },
            { v: "csv",  l: "CSV",   i: "fileText" },
            { v: "pdf",  l: "PDF",   i: "fileText" },
            { v: "json", l: "JSON",  i: "fileText" },
          ].map(f => (
            <button key={f.v} type="button"
              onClick={() => setFormat(f.v)} data-no-toast
              className="btn"
              style={{
                flex: 1, justifyContent: "center",
                background: format === f.v ? "var(--accent-soft-2)" : "var(--surface)",
                borderColor: format === f.v ? "var(--accent)" : "var(--line)",
                color: format === f.v ? "var(--accent)" : "var(--ink)",
              }}>
              <Ico name={f.i} size={13}/>{f.l}
            </button>
          ))}
        </div>
      </div>

      {scopeOptions && (
        <div className="field" style={{ marginBottom: 14 }}>
          <label>Scope</label>
          <select value={scope} onChange={e => setScope(e.target.value)}>
            {scopeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", display:"block", marginBottom: 8, fontWeight: 500 }}>Include</label>
        {[
          { k: "filters",     l: "Current filters & sorting" },
          { k: "columns",     l: "All visible columns" },
          { k: "attachments", l: "Attached files (zip)" },
        ].map(o => (
          <label key={o.k} className="row" style={{ gap: 8, padding: "6px 0", fontSize: 13, cursor: "pointer" }}>
            <input type="checkbox" checked={include[o.k]} onChange={e => setInclude({ ...include, [o.k]: e.target.checked })}/>
            {o.l}
          </label>
        ))}
      </div>
    </Modal>
  );
}
