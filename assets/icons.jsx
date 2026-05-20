// ============================================
// Atlas — Icon library (Lucide-flavoured)
// Pre-loaded with every icon used in the app
// ============================================

(function () {
  function svg(path, opts = {}) {
    const { fill = "none", strokeWidth = 1.6, ...rest } = opts;
    return function Icon({ size = 16, color = "currentColor", ...p }) {
      return React.createElement("svg", {
        width: size, height: size, viewBox: "0 0 24 24",
        fill, stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
        ...rest, ...p,
      }, React.createElement("g", { dangerouslySetInnerHTML: { __html: path } }));
    };
  }

  const I = {};

  // ---- App / navigation ----
  I.grid       = svg('<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>');
  I.folder     = svg('<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>');
  I.users      = svg('<circle cx="9" cy="9" r="3.5"/><path d="M2.5 19c.5-3.5 3.5-5 6.5-5s5.5 1.5 6.5 4.5"/><circle cx="17" cy="8" r="2.5"/><path d="M17 13c2.5 0 4.3 1.4 4.5 4"/>');
  I.user       = svg('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>');
  I.layers     = svg('<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17l9 5 9-5"/>');
  I.box        = svg('<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v10"/>');
  I.calendar   = svg('<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>');
  I.barChart   = svg('<path d="M3 21h18M7 17V9M12 17V5M17 17v-7"/>');
  I.gantt      = svg('<rect x="3" y="5" width="9" height="3" rx="1"/><rect x="7" y="10" width="11" height="3" rx="1"/><rect x="4" y="15" width="7" height="3" rx="1"/>');
  I.lineChart  = svg('<path d="M3 21h18"/><path d="M3 16l5-5 4 4 8-9"/>');
  I.pie        = svg('<path d="M21 12A9 9 0 1 1 12 3v9h9z"/>');
  I.coin       = svg('<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3"/>');
  I.check      = svg('<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>');
  I.checkSquare = svg('<path d="M3 12V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"/><path d="M9 11l3 3L22 4"/>');
  I.flag       = svg('<path d="M4 21V4a1 1 0 0 1 1-1h14l-4 5 4 5H5"/>');
  I.shield     = svg('<path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z"/>');
  I.git        = svg('<circle cx="6" cy="6" r="2"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="12" r="2"/><path d="M6 8v8M8 6c4 0 8 2 8 6"/>');
  I.bell       = svg('<path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 19a2 2 0 0 0 4 0"/>');
  I.settings   = svg('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>');
  I.fileText   = svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>');
  I.report     = svg('<path d="M9 4h7l4 4v12a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M16 4v5h4"/><path d="M11 12v6M14 14v4M8 17v1"/>');
  I.brain      = svg('<path d="M12 4a3 3 0 0 0-3 3v.5A3.5 3.5 0 0 0 5.5 11 3.5 3.5 0 0 0 9 14.5V18a3 3 0 0 0 3 3 3 3 0 0 0 3-3v-3.5A3.5 3.5 0 0 0 18.5 11 3.5 3.5 0 0 0 15 7.5V7a3 3 0 0 0-3-3z"/>');
  I.tools      = svg('<path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 1 5.4-5.4z"/>');
  I.dashboard  = svg('<path d="M12 3a9 9 0 0 0-9 9h9V3z"/><path d="M12 3a9 9 0 0 1 9 9h-9V3z"/><path d="M3 12a9 9 0 0 0 9 9V12H3z"/>');

  // ---- Actions ----
  I.search     = svg('<circle cx="11" cy="11" r="7"/><path d="M16 16l4 4"/>');
  I.plus       = svg('<path d="M12 5v14M5 12h14"/>');
  I.minus      = svg('<path d="M5 12h14"/>');
  I.x          = svg('<path d="M6 6l12 12M6 18L18 6"/>');
  I.edit       = svg('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>');
  I.trash      = svg('<path d="M4 7h16M10 11v6M14 11v6M5 7l1 13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-13M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"/>');
  I.filter     = svg('<path d="M3 5h18l-7 9v5l-4 2v-7L3 5z"/>');
  I.sort       = svg('<path d="M3 6h13M3 12h9M3 18h5M18 6v12M14 14l4 4 4-4"/>');
  I.more       = svg('<circle cx="6" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="18" cy="12" r="1.4" fill="currentColor"/>', { strokeWidth: 0.5 });
  I.copy       = svg('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>');
  I.download   = svg('<path d="M12 4v12M6 12l6 6 6-6M4 20h16"/>');
  I.upload     = svg('<path d="M12 20V8M6 12l6-6 6 6M4 4h16"/>');
  I.share      = svg('<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/>');
  I.link       = svg('<path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 1 0-7.07-7.07L11 5"/><path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 1 0 7.07 7.07L13 19"/>');
  I.paperclip  = svg('<path d="M21 12.5L13 21a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/>');
  I.send       = svg('<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>');
  I.refresh    = svg('<path d="M3 12a9 9 0 0 1 15.7-6.1L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.7 6.1L3 16M3 21v-5h5"/>');

  // ---- Indicators ----
  I.alertTri   = svg('<path d="M12 3l10 18H2L12 3z"/><path d="M12 9v5M12 18v.1"/>');
  I.alertCirc  = svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 17v.1"/>');
  I.info       = svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r="0.6" fill="currentColor"/>');
  I.help       = svg('<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.5-1 1-1 2"/><circle cx="12" cy="17" r="0.5" fill="currentColor"/>');
  I.clock      = svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>');
  I.checkCircle= svg('<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>');
  I.xCircle    = svg('<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M9 15l6-6"/>');
  I.eye        = svg('<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>');
  I.eyeOff     = svg('<path d="M17.94 17.94A10.06 10.06 0 0 1 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 4.05-5.06M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a18.5 18.5 0 0 1-2.1 3.18"/><path d="M14.12 14.12A3 3 0 0 1 9.88 9.88M1 1l22 22"/>');

  // ---- Arrows ----
  I.arrUpRight = svg('<path d="M7 17 17 7M9 7h8v8"/>');
  I.arrDownRight= svg('<path d="M7 7 17 17M17 9v8H9"/>');
  I.arrUp      = svg('<path d="M12 19V5M5 12l7-7 7 7"/>');
  I.arrDown    = svg('<path d="M12 5v14M19 12l-7 7-7-7"/>');
  I.arrLeft    = svg('<path d="M19 12H5M12 5l-7 7 7 7"/>');
  I.arrRight   = svg('<path d="M5 12h14M13 5l7 7-7 7"/>');
  I.chevDown   = svg('<path d="M6 9l6 6 6-6"/>');
  I.chevUp     = svg('<path d="M6 15l6-6 6 6"/>');
  I.chevLeft   = svg('<path d="M15 6l-6 6 6 6"/>');
  I.chevRight  = svg('<path d="M9 6l6 6-6 6"/>');

  // ---- Comms ----
  I.mail       = svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>');
  I.phone      = svg('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z"/>');
  I.at         = svg('<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>');
  I.message    = svg('<path d="M21 11.5a8.4 8.4 0 0 1-3.2 6.6L17 21l-4-2.5a8.5 8.5 0 1 1 8-7z"/>');
  I.mapPin     = svg('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/>');
  I.globe      = svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>');

  // ---- UI ----
  I.panelLeft  = svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>');
  I.panelRight = svg('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>');
  I.menu       = svg('<path d="M4 6h16M4 12h16M4 18h16"/>');
  I.list       = svg('<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>');
  I.cards      = svg('<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>');
  I.expand     = svg('<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>');
  I.history    = svg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>');
  I.zap        = svg('<path d="M13 2L3 14h8l-1 8 10-12h-8z"/>');
  I.activity   = svg('<path d="M3 12h4l3-9 4 18 3-9h4"/>');
  I.dollar     = svg('<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>');
  I.briefcase  = svg('<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>');
  I.hardHat    = svg('<path d="M3 18v2h18v-2"/><path d="M5 18v-3a7 7 0 0 1 14 0v3"/><path d="M10 8V6M14 8V6"/>');
  I.target     = svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>');
  I.trendUp    = svg('<path d="M3 17l6-6 4 4 8-9M14 6h7v7"/>');
  I.trendDown  = svg('<path d="M3 7l6 6 4-4 8 9M14 18h7v-7"/>');
  I.diamond    = svg('<path d="M12 2l10 10-10 10L2 12 12 2z"/>');
  I.bookmark   = svg('<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>');
  I.lock       = svg('<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>');
  I.logOut     = svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>');
  I.play       = svg('<path d="M6 4l14 8-14 8z" fill="currentColor" stroke-width="0"/>');
  I.pause      = svg('<rect x="6" y="4" width="4" height="16" fill="currentColor" stroke-width="0"/><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke-width="0"/>');
  I.maximize   = svg('<path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6"/>');
  I.dotMenu    = svg('<circle cx="12" cy="6" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="18" r="1.5" fill="currentColor"/>', { strokeWidth: 0.5 });

  // generic
  I.circle     = svg('<circle cx="12" cy="12" r="8"/>');
  I.square     = svg('<rect x="5" y="5" width="14" height="14" rx="2"/>');
  I.dot        = svg('<circle cx="12" cy="12" r="4" fill="currentColor"/>', { strokeWidth: 0 });

  window.I = I;

  // Wrapper component <Ico name="…" size={N} />
  function Ico({ name, size = 16, ...rest }) {
    const C = I[name];
    if (!C) return React.createElement("span", { style: { display: "inline-block", width: size, height: size } });
    return React.createElement(C, { size, ...rest });
  }
  window.Ico = Ico;
})();
