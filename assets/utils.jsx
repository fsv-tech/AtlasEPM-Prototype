// ============================================
// Atlas — utility helpers (no React)
// Exposes everything on window.U
// ============================================

window.U = (function () {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Today is fixed for the prototype so all "due in X days" numbers stay stable
  const TODAY = new Date("2026-05-19T00:00:00Z");

  function fmtDate(s, format = "short") {
    if (!s) return "—";
    const d = typeof s === "string" ? new Date(s) : s;
    if (isNaN(d)) return "—";
    if (format === "short")   return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${String(d.getUTCFullYear()).slice(2)}`;
    if (format === "medium")  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    if (format === "long")    return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    if (format === "iso")     return d.toISOString().slice(0,10);
    if (format === "monthYr") return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
    if (format === "day")     return d.getUTCDate();
    return s;
  }
  function daysFromToday(s) {
    const d = new Date(s);
    return Math.round((d - TODAY) / 86400000);
  }
  function relTime(s) {
    const d = daysFromToday(s);
    if (d === 0) return "today";
    if (d === 1) return "tomorrow";
    if (d === -1) return "yesterday";
    if (d < 0)  return `${-d}d ago`;
    return `in ${d}d`;
  }
  function fmtMoney(v, unit = "K", decimals = 1) {
    if (v == null) return "—";
    if (Math.abs(v) >= 1000) return `${(v/1000).toFixed(decimals)}M ${unit === "K" ? "" : unit}`.trim();
    return `${v.toFixed(decimals)}${unit ? " " + unit : ""}`.trim();
  }
  function fmtCurrency(v, cur = "USD") {
    const sym = { USD: "$", EUR: "€", GBP: "£", DKK: "kr", QAR: "QR" }[cur] || cur;
    return `${sym}${Number(v).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  }
  function fmtPct(v, decimals = 0) { return `${v.toFixed(decimals)}%`; }
  function fmtHours(v) { return `${Number(v).toLocaleString("en-US", { maximumFractionDigits: 0 })} h`; }

  // status → badge class
  const statusBadge = {
    "Active":          "blue",
    "Running":         "blue",
    "Planning":        "violet",
    "Mobilising":      "amber",
    "Closeout":        "violet",
    "On Hold":         "amber",
    "Closed":          "green",
    "Completed":       "green",
    "Done":            "green",
    "Approved":        "green",
    "In Progress":     "blue",
    "Open":            "amber",
    "Pending":         "amber",
    "In Review":       "violet",
    "Submitted":       "violet",
    "Rejected":        "slate",
    "Overdue":         "red",
    "Delayed":         "red",
    "Cancelled":       "slate",
    "Draft":           "slate",
    "Issued":          "green",
    "Issued for Construction": "green",
    "Issued for Review":       "blue",
    "WIP":             "amber",
    "Mitigated":       "green",
    "Received":        "blue",
    "Sent":            "slate",
  };

  const priorityBadge = { High: "red", Medium: "amber", Low: "slate", Critical: "red" };

  function statusClass(s) { return statusBadge[s] || "neutral"; }
  function priorityClass(p) { return priorityBadge[p] || "neutral"; }

  // initials from a full name
  function initials(name) {
    if (!name) return "??";
    return name.split(" ").filter(Boolean).map(s => s[0]).slice(0,2).join("").toUpperCase();
  }

  // colour palette for chart series, ordered
  const chartPalette = [
    "#2563EB", "#0EA5E9", "#14B8A6", "#10B981", "#65A30D",
    "#F59E0B", "#F97316", "#EF4444", "#EC4899", "#8B5CF6",
    "#4F46E5", "#475569",
  ];

  // discipline color
  const disciplineColors = {
    "PM":              "#0F1729",
    "Mechanical":      "#2563EB",
    "Electrical":      "#F59E0B",
    "Instrumentation": "#8B5CF6",
    "Structural":      "#0EA5E9",
    "HSE":             "#10B981",
    "Operations":      "#14B8A6",
    "Procurement":     "#EC4899",
    "Civil":           "#65A30D",
    "Process":         "#F97316",
    "Commercial":      "#475569",
    "Architecture":    "#EF4444",
  };

  // ISO week of date (UTC)
  function isoWeek(d) {
    d = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  }

  // Project health → color
  function healthColor(h) {
    if (h === "green") return "var(--green)";
    if (h === "amber") return "var(--amber)";
    if (h === "red")   return "var(--red)";
    return "var(--ink-5)";
  }

  function deterministicRand(seed) {
    // Mulberry32
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  return {
    TODAY, fmtDate, daysFromToday, relTime, fmtMoney, fmtCurrency, fmtPct, fmtHours,
    statusClass, priorityClass, statusBadge, priorityBadge,
    initials, chartPalette, disciplineColors,
    isoWeek, healthColor, deterministicRand,
  };
})();
