// ============================================
// Atlas — Daily Log + Weekly Report
// Per-engineer time-stamped log: notes, hours, blockers, comms.
// Each entry ties to a project (optionally a deliverable) and supports
// links/emails. Auto-summarises into a weekly report.
// ============================================

const ENTRY_TYPES = [
  { value: "work",    label: "Work",       icon: "edit",      color: "var(--accent)",  description: "Time spent on a task" },
  { value: "meeting", label: "Meeting",    icon: "users",     color: "var(--violet)",  description: "Meetings, calls, standups" },
  { value: "comm",    label: "Comms",      icon: "send",      color: "var(--cyan)",    description: "Email, call, or message sent/received" },
  { value: "note",    label: "Note",       icon: "fileText",  color: "var(--ink-3)",   description: "Reminder or observation" },
  { value: "blocker", label: "Blocker",    icon: "alertTri",  color: "var(--red)",     description: "Something stopping progress" },
];

function entryTypeMeta(t) {
  return ENTRY_TYPES.find(x => x.value === t) || ENTRY_TYPES[3];
}

// ============================================
// ScreenDailyLog — main timeline view
// ============================================
function ScreenDailyLog({ employeeId }) {
  const employee = DB.employeeById(employeeId);

  // Read ?project= from hash to enable deep-linking from project detail
  const hashParams = React.useMemo(() => {
    const q = location.hash.indexOf("?");
    if (q < 0) return {};
    const params = {};
    new URLSearchParams(location.hash.slice(q + 1)).forEach((v, k) => { params[k] = v; });
    return params;
  }, []);

  const [filterProject, setFilterProject]   = React.useState(hashParams.project || null);
  const [filterType, setFilterType]         = React.useState(null);
  const [search, setSearch]                 = React.useState("");
  const [composerOpen, setComposerOpen]     = React.useState(!!hashParams.compose || !!hashParams.project);
  const [editingEntry, setEditingEntry]     = React.useState(null);

  // Build the day-grouped entries with current filters
  const days = DB.dailyLogByDay(employeeId, {
    project_id: filterProject,
    entry_type: filterType,
    search,
  });

  // Project filter options — only projects the employee has assignments on,
  // plus any project they have entries for
  const empProjects = React.useMemo(() => {
    const ids = new Set();
    DB.assignments.filter(a => a.employee_id === employeeId).forEach(a => ids.add(a.project_id));
    DB.dailyLogEntries.filter(e => e.employee_id === employeeId && e.project_id).forEach(e => ids.add(e.project_id));
    return Array.from(ids).map(id => DB.projectById(id)).filter(Boolean);
  }, [employeeId]);

  // Today's stats
  const todayStr = DB.TODAY.toISOString().slice(0, 10);
  const todayEntries = DB.dailyLogEntries.filter(e =>
    e.employee_id === employeeId && e.created_at.slice(0, 10) === todayStr
  );
  const todayHours = todayEntries.reduce((s, e) => s + (e.hours || 0), 0);
  const todayBlockers = todayEntries.filter(e => e.entry_type === "blocker").length;

  // This-week stats
  const wkReport = DB.weeklyReport(employeeId, todayStr);

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Workspace"
        title="My day"
        subtitle={`${employee.full_name} · ${employee.discipline} · ${employee.role_title}`}
        actions={
          <div className="row" style={{ gap: 8 }}>
            <a className="btn" href={`#/daily-log/weekly/${wkReport.weekStart}`}>
              <Ico name="report" size={13}/>Weekly report
            </a>
            <button className="btn primary" onClick={() => { setEditingEntry(null); setComposerOpen(true); }}>
              <Ico name="plus" size={13}/>New entry
            </button>
          </div>
        }
      />

      <div className="kpi-grid">
        <KPI featured label="Today" icon="clock" value={todayHours.toFixed(1)} unit="h" foot={todayEntries.length + " entries"}/>
        <KPI label="This week" icon="calendar" value={wkReport.summary.totalHours.toFixed(1)} unit="h" foot={wkReport.summary.totalEntries + " entries"}/>
        <KPI label="Projects today" icon="folder" value={new Set(todayEntries.map(e => e.project_id).filter(Boolean)).size} foot="distinct projects"/>
        <KPI label="Blockers (week)" icon="alertTri" value={wkReport.summary.totalBlockers} foot={todayBlockers > 0 ? todayBlockers + " today" : "none today"} deltaDir={wkReport.summary.totalBlockers > 0 ? "down" : "up"}/>
        <KPI label="Meetings (week)" icon="users" value={wkReport.summary.totalMeetings}/>
      </div>

      <div className="card" style={{ padding: 12 }}>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <div className="row" style={{ gap: 6 }}>
            <span className="muted tiny" style={{ marginRight: 6 }}>PROJECT</span>
            <button className={"chip" + (filterProject === null ? " active" : "")} onClick={() => setFilterProject(null)}>All</button>
            {empProjects.map(p => (
              <button key={p.project_id} className={"chip" + (filterProject === p.project_id ? " active" : "")} onClick={() => setFilterProject(p.project_id)}>
                <span style={{ width: 7, height: 7, borderRadius: 2, background: U.healthColor(p.health), display: "inline-block" }}/>
                {p.project_code}
              </button>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 12 }}/>
          <div className="row" style={{ gap: 6 }}>
            <span className="muted tiny" style={{ marginRight: 6 }}>TYPE</span>
            <button className={"chip" + (filterType === null ? " active" : "")} onClick={() => setFilterType(null)}>All</button>
            {ENTRY_TYPES.map(t => (
              <button key={t.value} className={"chip" + (filterType === t.value ? " active" : "")} onClick={() => setFilterType(t.value)}>
                <Ico name={t.icon} size={11} color={t.color}/>{t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="row" style={{ marginTop: 10, gap: 8 }}>
          <div className="row" style={{ gap: 8, flex: 1, padding: "7px 12px", background: "var(--surface-3)", borderRadius: 7 }}>
            <Ico name="search" size={13} color="var(--ink-4)"/>
            <input
              type="text"
              placeholder="Search by title, body, or tag…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ border: "none", background: "transparent", outline: "none", flex: 1, fontSize: 13 }}
            />
            {search && (
              <button className="icon-btn" onClick={() => setSearch("")} style={{ width: 22, height: 22 }}>
                <Ico name="x" size={12}/>
              </button>
            )}
          </div>
          <div className="muted tiny mono">
            {days.reduce((s, d) => s + d.entries.length, 0)} entries
          </div>
        </div>
      </div>

      {days.length === 0 ? (
        <Empty title="No entries match" subtitle="Try adjusting the filters above, or log your first entry." icon="book"/>
      ) : (
        <div className="col" style={{ gap: 16 }}>
          {days.map(({ day, entries }) => (
            <DayGroup
              key={day}
              day={day}
              entries={entries}
              employeeId={employeeId}
              onEdit={(entry) => { setEditingEntry(entry); setComposerOpen(true); }}
            />
          ))}
        </div>
      )}

      {composerOpen && (
        <EntryComposer
          employeeId={employeeId}
          empProjects={empProjects}
          editing={editingEntry}
          onClose={() => { setComposerOpen(false); setEditingEntry(null); }}
        />
      )}
    </div>
  );
}

// ============================================
// DayGroup — entries on a single day, with sticky date header
// ============================================
function DayGroup({ day, entries, employeeId, onEdit }) {
  const date = new Date(day + "T12:00:00Z");
  const isToday = day === DB.TODAY.toISOString().slice(0, 10);
  const yesterdayStr = new Date(DB.TODAY.getTime() - 86400000).toISOString().slice(0, 10);
  const isYesterday = day === yesterdayStr;
  const dayLabel = isToday ? "Today" : isYesterday ? "Yesterday" :
    date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", timeZone: "UTC" });

  const dayHours = entries.reduce((s, e) => s + (e.hours || 0), 0);
  const dayProjects = new Set(entries.map(e => e.project_id).filter(Boolean)).size;

  return (
    <div className="card flush">
      <div style={{
        padding: "12px 18px",
        borderBottom: "1px solid var(--line)",
        display: "flex", alignItems: "center", gap: 12,
        background: isToday ? "var(--accent-soft-2)" : "var(--surface-2)",
      }}>
        <div style={{ flex: 1 }}>
          <div className="row" style={{ gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: "-0.015em", color: isToday ? "var(--accent)" : "var(--ink)" }}>{dayLabel}</span>
            <span className="muted tiny mono">{day}</span>
          </div>
        </div>
        <div className="row" style={{ gap: 14, fontSize: 11.5, color: "var(--ink-4)" }}>
          <span><b className="mono" style={{ color: "var(--ink-2)" }}>{dayHours.toFixed(1)}h</b> logged</span>
          {dayProjects > 0 && <span><b className="mono" style={{ color: "var(--ink-2)" }}>{dayProjects}</b> project{dayProjects === 1 ? "" : "s"}</span>}
          <span><b className="mono" style={{ color: "var(--ink-2)" }}>{entries.length}</b> entr{entries.length === 1 ? "y" : "ies"}</span>
        </div>
      </div>
      <div style={{ padding: "6px 0" }}>
        {entries.map(e => <EntryRow key={e.entry_id} entry={e} onEdit={() => onEdit(e)}/>)}
      </div>
    </div>
  );
}

// ============================================
// EntryRow — one log entry with timestamp + meta
// ============================================
function EntryRow({ entry, onEdit }) {
  const meta = entryTypeMeta(entry.entry_type);
  const proj = entry.project_id ? DB.projectById(entry.project_id) : null;
  const del  = entry.deliverable_id ? DB.deliverableById(entry.deliverable_id) : null;
  const time = entry.created_at.slice(11, 16);

  return (
    <div
      className="entry-row"
      onClick={onEdit}
      style={{
        padding: "12px 18px",
        display: "grid",
        gridTemplateColumns: "60px 24px 1fr auto",
        gap: 12,
        alignItems: "flex-start",
        cursor: "pointer",
        borderBottom: "1px solid var(--line)",
        position: "relative",
        transition: "background var(--dur-fast) var(--ease-out)",
      }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
      onMouseLeave={e => e.currentTarget.style.background = ""}
    >
      <div className="mono" style={{ fontSize: 11, color: "var(--ink-4)", paddingTop: 3, textAlign: "right" }}>{time}</div>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        background: meta.color + "1A",
        color: meta.color,
        display: "grid", placeItems: "center",
        marginTop: 1,
      }}>
        <Ico name={meta.icon} size={12}/>
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)" }}>{entry.title}</span>
          {entry.hours != null && (
            <span className="badge" style={{ background: "var(--surface-3)", color: "var(--ink-2)", fontSize: 10.5 }}>
              <Ico name="clock" size={10}/>{entry.hours}h
            </span>
          )}
          {proj && (
            <a className="badge outline" href={`#/projects/${proj.project_id}`} onClick={ev => ev.stopPropagation()}
               style={{ fontSize: 10.5, textDecoration: "none" }}>
              <span style={{ width: 5, height: 5, borderRadius: 1, background: U.healthColor(proj.health), display: "inline-block" }}/>
              {proj.project_code}
            </a>
          )}
          {del && (
            <a className="badge outline" href={`#/deliverables/${del.deliverable_id}`} onClick={ev => ev.stopPropagation()}
               style={{ fontSize: 10.5, textDecoration: "none" }}>
              <Ico name="fileText" size={10}/>{del.deliverable_code}
            </a>
          )}
        </div>
        {entry.body && (
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.5 }}>{entry.body}</div>
        )}
        {(entry.links?.length > 0 || entry.tags?.length > 0) && (
          <div className="row" style={{ gap: 6, marginTop: 6, flexWrap: "wrap" }}>
            {(entry.links || []).map((l, i) => (
              <a key={i} href={l.value} onClick={ev => ev.stopPropagation()}
                 style={{ fontSize: 11, color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: 4, textDecoration: "none" }}>
                <Ico name={l.kind === "email" ? "mail" : "link"} size={11}/>
                {l.label}
              </a>
            ))}
            {(entry.tags || []).map(t => (
              <span key={t} style={{ fontSize: 10.5, color: "var(--ink-4)", background: "var(--surface-3)", padding: "1px 6px", borderRadius: 4 }}>
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 4, opacity: 0.6 }}>
        <button className="icon-btn" style={{ width: 26, height: 26 }} onClick={ev => { ev.stopPropagation(); onEdit(); }} title="Edit entry">
          <Ico name="edit" size={12}/>
        </button>
      </div>
    </div>
  );
}

// ============================================
// EntryComposer — modal for creating/editing entries
// ============================================
function EntryComposer({ employeeId, empProjects, editing, onClose }) {
  const isEditing = !!editing;
  const [type, setType]               = React.useState(editing?.entry_type || "work");
  const [projectId, setProjectId]     = React.useState(editing?.project_id || (empProjects[0]?.project_id || ""));
  const [deliverableId, setDeliverableId] = React.useState(editing?.deliverable_id || "");
  const [title, setTitle]             = React.useState(editing?.title || "");
  const [body, setBody]               = React.useState(editing?.body || "");
  const [hours, setHours]             = React.useState(editing?.hours ?? "");
  const [tagsText, setTagsText]       = React.useState((editing?.tags || []).join(", "));
  const [linksText, setLinksText]     = React.useState((editing?.links || []).map(l => `${l.label}|${l.value}`).join("\n"));
  const toast = useToast();

  // Deliverables on the chosen project, scoped to disciplines this employee can own
  const projectDeliverables = React.useMemo(() => {
    if (!projectId) return [];
    return DB.deliverables.filter(d => d.project_id === projectId).sort((a, b) => a.deliverable_code.localeCompare(b.deliverable_code));
  }, [projectId]);

  function submit() {
    if (!title.trim()) {
      toast("A title is required.", "warn");
      return;
    }
    toast(isEditing ? "Entry updated · timestamp preserved." : "Entry saved · " + new Date().toLocaleTimeString(), "success");
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 580 }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500, letterSpacing: "-0.015em" }}>
              {isEditing ? "Edit log entry" : "New log entry"}
            </h3>
            <div className="muted tiny" style={{ marginTop: 2 }}>
              {isEditing
                ? `Originally logged ${new Date(editing.created_at).toLocaleString()}`
                : "Time stamped " + new Date().toLocaleString()}
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><Ico name="x" size={14}/></button>
        </div>

        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Entry type picker */}
          <div>
            <label style={{ fontSize: 11, fontWeight: 500, color: "var(--ink-3)", display: "block", marginBottom: 6 }}>TYPE</label>
            <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
              {ENTRY_TYPES.map(t => (
                <button
                  key={t.value}
                  className={"chip" + (type === t.value ? " active" : "")}
                  onClick={() => setType(t.value)}
                  style={type === t.value ? { background: t.color, borderColor: t.color } : {}}
                >
                  <Ico name={t.icon} size={11}/>{t.label}
                </button>
              ))}
            </div>
            <div className="muted tiny" style={{ marginTop: 4 }}>{entryTypeMeta(type).description}</div>
          </div>

          {/* Project + deliverable */}
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>PROJECT</label>
              <select value={projectId} onChange={e => { setProjectId(e.target.value); setDeliverableId(""); }}>
                <option value="">— No project —</option>
                {empProjects.map(p => (
                  <option key={p.project_id} value={p.project_id}>{p.project_code} — {p.project_name}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>DELIVERABLE (optional)</label>
              <select value={deliverableId} onChange={e => setDeliverableId(e.target.value)} disabled={!projectId || projectDeliverables.length === 0}>
                <option value="">— No specific deliverable —</option>
                {projectDeliverables.map(d => (
                  <option key={d.deliverable_id} value={d.deliverable_id}>{d.deliverable_code} — {d.title.slice(0, 40)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="field">
            <label>TITLE</label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={
                type === "blocker" ? "What's blocking you?" :
                type === "comm"    ? "Who did you communicate with?" :
                type === "meeting" ? "Meeting name" :
                type === "note"    ? "Quick reminder…" :
                "What did you work on?"
              }
            />
          </div>

          {/* Body */}
          <div className="field">
            <label>NOTES (optional)</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Details, context, decisions made, next steps…"
              rows={3}
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          {/* Hours + Tags */}
          <div className="grid" style={{ gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <div className="field">
              <label>HOURS {type !== "work" && type !== "meeting" ? "(optional)" : ""}</label>
              <input
                type="number"
                step="0.25"
                min="0"
                max="24"
                value={hours}
                onChange={e => setHours(e.target.value)}
                placeholder="0.0"
              />
            </div>
            <div className="field">
              <label>TAGS (comma-separated)</label>
              <input
                type="text"
                value={tagsText}
                onChange={e => setTagsText(e.target.value)}
                placeholder="e.g. client, review, hazop"
              />
            </div>
          </div>

          {/* Links / emails */}
          <div className="field">
            <label>LINKS & EMAILS (one per line, format: label | url-or-mailto)</label>
            <textarea
              value={linksText}
              onChange={e => setLinksText(e.target.value)}
              placeholder={"Linde — vent silencer | mailto:projects.eu@linde.com\nReview SharePoint | https://…"}
              rows={2}
              style={{ resize: "vertical", fontFamily: "var(--font-mono)", fontSize: 12 }}
            />
            <div className="hint">Use <span className="mono">mailto:</span> prefix for email links — they'll open the user's mail client.</div>
          </div>
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-2)" }}>
          <div className="muted tiny">
            {isEditing ? "Editing preserves original timestamp" : "Will be saved with current timestamp"}
          </div>
          <div className="row" style={{ gap: 8 }}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={submit}>
              <Ico name="check" size={13}/>{isEditing ? "Save changes" : "Log entry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// ScreenWeeklyReport — auto-generated weekly report
// Mike's key requirement: save engineers time in report writing
// ============================================
function ScreenWeeklyReport({ employeeId, weekStart }) {
  // Default to current week
  const ref = weekStart || DB.TODAY.toISOString().slice(0, 10);
  const r = DB.weeklyReport(employeeId, ref);

  // Previous/next week navigation
  const prevMon = new Date(new Date(r.weekStart + "T00:00:00Z").getTime() - 7 * 86400000).toISOString().slice(0, 10);
  const nextMon = new Date(new Date(r.weekStart + "T00:00:00Z").getTime() + 7 * 86400000).toISOString().slice(0, 10);
  const isFutureWeek = new Date(r.weekStart) > DB.TODAY;
  const formatRange = (s, e) => {
    const sd = new Date(s + "T00:00:00Z");
    const ed = new Date(e + "T00:00:00Z");
    const sm = sd.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    const em = ed.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
    return sm + " – " + em;
  };

  return (
    <div className="content" data-tour-id="page">
      <PageHeader
        eyebrow="Workspace · Auto-generated"
        title={"Weekly report · W" + r.isoWeek + " " + r.year}
        subtitle={`${r.employee.full_name} · ${formatRange(r.weekStart, r.weekEnd)}`}
        actions={
          <div className="row" style={{ gap: 8 }}>
            <a className="btn" href="#/daily-log"><Ico name="arrLeft" size={13}/>Back to log</a>
            <button className="btn"><Ico name="download" size={13}/>Export PDF</button>
            <button className="btn navy"><Ico name="send" size={13}/>Email to PM</button>
          </div>
        }
      />

      <div className="row" style={{ gap: 8, justifyContent: "space-between" }}>
        <a className="btn sm" href={`#/daily-log/weekly/${prevMon}`}><Ico name="arrLeft" size={11}/>Previous week</a>
        <span className="muted tiny">Auto-compiled from {r.summary.totalEntries} log entries</span>
        <a className={"btn sm" + (isFutureWeek ? " ghost" : "")} href={isFutureWeek ? "#" : `#/daily-log/weekly/${nextMon}`} style={isFutureWeek ? { pointerEvents: "none", opacity: 0.4 } : {}}>
          Next week<Ico name="arrRight" size={11}/>
        </a>
      </div>

      {/* Summary KPIs */}
      <div className="kpi-grid">
        <KPI featured label="Hours logged" icon="clock" value={r.summary.totalHours.toFixed(1)} unit="h" foot={r.summary.totalEntries + " entries"}/>
        <KPI label="Projects worked" icon="folder" value={r.summary.distinctProjects} foot="distinct projects this week"/>
        <KPI label="Meetings" icon="users" value={r.summary.totalMeetings}/>
        <KPI label="Communications" icon="send" value={r.summary.totalCommunications}/>
        <KPI label="Blockers raised" icon="alertTri" value={r.summary.totalBlockers} foot={r.summary.totalBlockers > 0 ? "see by-project below" : "all clear"} deltaDir={r.summary.totalBlockers > 0 ? "down" : "up"}/>
      </div>

      {r.summary.totalEntries === 0 ? (
        <Empty
          title="No entries for this week"
          subtitle={isFutureWeek ? "This week hasn't started yet." : "No log entries recorded for this period."}
          icon="book"
        />
      ) : (
        <>
          {/* Per-project sections — Mike asked for reporting per project */}
          {r.projectGroups.map(g => (
            <ProjectWeekSection key={g.project?.project_id || "general"} group={g}/>
          ))}

          {/* Full chronological list — collapsed at first */}
          <FullEntryList entries={r.entries}/>
        </>
      )}
    </div>
  );
}

function ProjectWeekSection({ group }) {
  const proj = group.project;
  if (!proj) return null;
  return (
    <div className="card" style={{ borderLeft: "3px solid " + U.healthColor(proj.health) }}>
      <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
        <div>
          <div className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500 }}>{proj.project_code}</div>
          <h3 style={{ margin: "2px 0 4px", fontSize: 16, fontWeight: 500, letterSpacing: "-0.015em" }}>
            <a href={`#/projects/${proj.project_id}`} style={{ color: "var(--ink)", textDecoration: "none" }}>{proj.project_name}</a>
          </h3>
          <div className="muted tiny">{proj.client} · {group.entries.length} entries · {group.totalHours.toFixed(1)}h logged</div>
        </div>
        <a className="btn sm" href={`#/projects/${proj.project_id}`}>Open project<Ico name="arrRight" size={11}/></a>
      </div>

      {group.blockers.length > 0 && (
        <ReportBlock title="Blockers" icon="alertTri" color="var(--red)" entries={group.blockers} prefix="⚠"/>
      )}
      {group.highlights.length > 0 && (
        <ReportBlock title="Work delivered" icon="edit" color="var(--accent)" entries={group.highlights}/>
      )}
      {group.meetings.length > 0 && (
        <ReportBlock title="Meetings" icon="users" color="var(--violet)" entries={group.meetings}/>
      )}
      {group.communications.length > 0 && (
        <ReportBlock title="Communications" icon="send" color="var(--cyan)" entries={group.communications}/>
      )}
      {group.notes.length > 0 && (
        <ReportBlock title="Notes & follow-ups" icon="fileText" color="var(--ink-4)" entries={group.notes}/>
      )}

      {group.deliverables.length > 0 && (
        <div style={{ marginTop: 12, padding: 10, background: "var(--surface-2)", borderRadius: 6 }}>
          <div className="muted xs" style={{ letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>Touched deliverables</div>
          <div className="row" style={{ gap: 6, flexWrap: "wrap" }}>
            {group.deliverables.map(did => {
              const d = DB.deliverableById(did);
              if (!d) return null;
              return (
                <a key={did} className="badge outline" href={`#/deliverables/${did}`}
                   style={{ textDecoration: "none", fontSize: 11 }}>
                  <Ico name="fileText" size={11}/>{d.deliverable_code}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function ReportBlock({ title, icon, color, entries, prefix }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div className="row" style={{ gap: 6, marginBottom: 6 }}>
        <Ico name={icon} size={12} color={color}/>
        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-3)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {title} ({entries.length})
        </span>
      </div>
      <ul style={{ margin: 0, padding: "0 0 0 18px", listStyle: "none" }}>
        {entries.map(e => (
          <li key={e.entry_id} style={{ position: "relative", padding: "4px 0", fontSize: 12.5, color: "var(--ink-2)", lineHeight: 1.5 }}>
            <span style={{ position: "absolute", left: -14, top: 6, width: 4, height: 4, borderRadius: "50%", background: color }}/>
            <span style={{ color: "var(--ink-4)", fontSize: 10.5, fontFamily: "var(--font-mono)", marginRight: 6 }}>
              {U.fmtDate(e.created_at).slice(0, 6)} {e.created_at.slice(11, 16)}
            </span>
            <strong style={{ fontWeight: 500 }}>{e.title}</strong>
            {e.body && <span style={{ color: "var(--ink-3)" }}> — {e.body}</span>}
            {e.hours && <span className="mono" style={{ color: "var(--ink-4)", marginLeft: 6 }}>({e.hours}h)</span>}
            {(e.links || []).map((l, i) => (
              <a key={i} href={l.value} style={{ marginLeft: 8, fontSize: 11, color: "var(--accent)", textDecoration: "none" }}>
                <Ico name={l.kind === "email" ? "mail" : "link"} size={10}/> {l.label}
              </a>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FullEntryList({ entries }) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between", marginBottom: expanded ? 12 : 0 }}>
        <h3 style={{ margin: 0, fontSize: 14, fontWeight: 500, letterSpacing: "-0.015em" }}>
          All entries · chronological ({entries.length})
        </h3>
        <button className="btn sm ghost" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Collapse" : "Expand"}<Ico name={expanded ? "arrUp" : "arrDown"} size={11}/>
        </button>
      </div>
      {expanded && (
        <div className="col" style={{ gap: 6 }}>
          {[...entries].sort((a, b) => a.created_at.localeCompare(b.created_at)).map(e => {
            const meta = entryTypeMeta(e.entry_type);
            const proj = e.project_id ? DB.projectById(e.project_id) : null;
            return (
              <div key={e.entry_id} className="row" style={{ gap: 10, padding: "6px 8px", fontSize: 12.5, alignItems: "flex-start", borderBottom: "1px solid var(--line)" }}>
                <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", minWidth: 78 }}>
                  {U.fmtDate(e.created_at).slice(0, 6)} {e.created_at.slice(11, 16)}
                </span>
                <span style={{ minWidth: 18, color: meta.color, marginTop: 2 }}><Ico name={meta.icon} size={11}/></span>
                {proj && (
                  <span className="mono" style={{ fontSize: 10.5, color: "var(--ink-4)", minWidth: 60 }}>{proj.project_code}</span>
                )}
                <span style={{ flex: 1, lineHeight: 1.5 }}>{e.title}</span>
                {e.hours && <span className="mono" style={{ color: "var(--ink-4)", fontSize: 11 }}>{e.hours}h</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
