// ============================================
// Atlas — Mock data (shaped like the ERD)
// Everything exposed on window.DB
// ============================================

window.DB = (function () {
  // ============================================
  // ROLES
  // ============================================
  const roles = [
    { role_id: "ROLE-001", role_name: "Admin",            description: "Platform administrator — full access" },
    { role_id: "ROLE-002", role_name: "Executive",        description: "Portfolio visibility, executive dashboards" },
    { role_id: "ROLE-003", role_name: "Project Manager",  description: "Owns project execution end-to-end" },
    { role_id: "ROLE-004", role_name: "Discipline Lead",  description: "Manages a discipline within a project" },
    { role_id: "ROLE-005", role_name: "Engineer",         description: "Executes assigned work" },
    { role_id: "ROLE-006", role_name: "Planner",          description: "Resource planning & capacity" },
    { role_id: "ROLE-007", role_name: "Commercial",       description: "Cost engine, pricing, margins" },
    { role_id: "ROLE-008", role_name: "Client",           description: "Read-only external portal" },
    { role_id: "ROLE-009", role_name: "Doc Controller",   description: "Document control & transmittals" },
    { role_id: "ROLE-010", role_name: "QA/QC",            description: "Quality review & approval" },
    { role_id: "ROLE-011", role_name: "Finance",          description: "Financial reporting, invoicing, cost validation" },
  ];

  const disciplineNames = [
    "PM", "Mechanical", "Electrical", "Instrumentation",
    "Structural", "HSE", "Operations", "Procurement",
    "Civil", "Process", "Commercial", "Architecture", "DocCtrl",
  ];

  // ============================================
  // EMPLOYEES
  // ============================================
  function emp(code, fname, lname, disc, role_on_company, rate, capacity, level, skills, loc) {
    loc = loc || "Doha";
    return {
      employee_id: code, employee_code: code,
      first_name: fname, last_name: lname,
      full_name: fname + " " + lname,
      email: (fname + "." + lname).toLowerCase().replace(/['\s-]/g,"") + "@helix.eng",
      job_title: role_on_company,
      discipline: disc, location: loc,
      hourly_rate: rate, capacity_hours: capacity,
      seniority_level: level, skills, profile_photo: null,
      status: "Active",
    };
  }
  const employees = [
    emp("EMP-001","Anders","Vestergaard","PM","Project Director", 145, 40, "Principal", ["Project Management","Energy","FEED","Contracts"]),
    emp("EMP-002","Lina","Holm","PM","Senior Project Manager",   135, 40, "Lead",      ["Project Management","Cost Control","Risk"]),
    emp("EMP-003","Rasmus","Bjerg","PM","Project Manager",       115, 40, "Senior",    ["Project Management","Civil","Bridges"]),
    emp("EMP-004","Sofie","Lindgaard","PM","Project Manager",    115, 40, "Senior",    ["Project Management","Offshore","Wind"]),
    emp("EMP-005","Mikkel","Thranum","PM","Junior Project Manager", 85, 40, "Mid",     ["Project Coordination","MEP"]),
    emp("EMP-010","Henrik","Brask","Mechanical","Mechanical Lead",       125, 40, "Lead",   ["Piping","Static equipment","HYSYS"]),
    emp("EMP-011","Pernille","Damgaard","Mechanical","Senior Mech Eng.",  98, 40, "Senior", ["Rotating equipment","Pumps","Compressors"]),
    emp("EMP-012","Yusuf","Korkmaz","Mechanical","Mechanical Engineer",   78, 40, "Mid",    ["Piping","Stress analysis","CAESAR II"]),
    emp("EMP-013","Cecilie","Hovgaard","Mechanical","Mechanical Engineer", 72, 40, "Mid",   ["HVAC","Heat exchangers"]),
    emp("EMP-014","Jonas","Stark","Mechanical","Junior Mech Eng.",         52, 40, "Junior", ["3D modelling","AutoCAD"]),
    emp("EMP-015","Mariam","Al-Subaie","Mechanical","Senior Mech Eng.",    98, 40, "Senior", ["Tanks","Static equipment"]),
    emp("EMP-020","Soren","Lindberg","Electrical","Electrical Lead",       125, 40, "Lead",   ["LV/HV","Switchgear","ETAP"]),
    emp("EMP-021","Khaled","Hassan","Electrical","Senior Elec Eng.",        95, 40, "Senior", ["MV systems","Earthing","Lightning"]),
    emp("EMP-022","Ana","Pereira","Electrical","Electrical Engineer",       72, 40, "Mid",    ["Power systems","SCADA"]),
    emp("EMP-023","Pavel","Novak","Electrical","Electrical Engineer",       72, 40, "Mid",    ["Distribution","Cable routing"]),
    emp("EMP-024","Ines","Markovic","Electrical","Junior Elec Eng.",         52, 40, "Junior", ["AutoCAD","Drafting"]),
    emp("EMP-030","Daniel","Westergaard","Instrumentation","I&C Lead", 125, 40, "Lead",   ["DCS","SIS","Foundation FB"]),
    emp("EMP-031","Suresh","Iyer","Instrumentation","Senior I&C Eng.",            95, 40, "Senior", ["Control systems","Loop drawings"]),
    emp("EMP-032","Federica","Costa","Instrumentation","I&C Engineer",            70, 40, "Mid",    ["Field instruments","Calibration"]),
    emp("EMP-033","Omar","Boutros","Instrumentation","I&C Engineer",              70, 40, "Mid",    ["DCS","HMI"]),
    emp("EMP-040","Eva","Birch","Structural","Structural Lead",                 125, 40, "Lead",   ["Steel","Concrete","STAAD"]),
    emp("EMP-041","Hassan","Yousef","Structural","Senior Structural Eng.",       95, 40, "Senior", ["Offshore structures","Lifting analysis"]),
    emp("EMP-042","Carlos","Mendes","Structural","Structural Engineer",          72, 40, "Mid",    ["RC structures","Foundations"]),
    emp("EMP-043","Aisha","Rahman","Structural","Structural Engineer",           72, 40, "Mid",    ["Steel detailing","Connections"]),
    emp("EMP-050","Lars","Nyholm","HSE","HSE Lead",                              115, 40, "Lead",   ["HAZOP","HAZID","Risk assessment"]),
    emp("EMP-051","Aya","Saleh","HSE","HSE Engineer",                             78, 40, "Mid",    ["SIMOPS","Risk register"]),
    emp("EMP-052","Tom","Mortensen","HSE","Senior HSE Engineer",                  92, 40, "Senior", ["QRA","Fire safety"]),
    emp("EMP-060","Hilde","Eriksen","Operations","Operations Specialist",        105, 40, "Senior", ["Commissioning","Start-up"]),
    emp("EMP-061","Bilal","Khoury","Operations","Senior Ops Eng.",                95, 40, "Senior", ["Refineries","Operations"]),
    emp("EMP-070","Joana","Carvalho","Procurement","Procurement Manager",        110, 40, "Lead",   ["RFQ","Vendor management"]),
    emp("EMP-071","Hamza","Othman","Procurement","Procurement Officer",           65, 40, "Mid",    ["Expediting","Bid evaluation"]),
    emp("EMP-080","Maria","Henriksen","Civil","Civil Lead",                      115, 40, "Lead",   ["Drainage","Earthworks","Roads"]),
    emp("EMP-081","Ali","Mansour","Process","Process Lead",                      125, 40, "Lead",   ["Refinery","Gas","HYSYS","PFD/P&ID"]),
    emp("EMP-082","Eline","Bakker","Process","Senior Process Eng.",               95, 40, "Senior", ["Hydrogen","Sustainability"]),
    emp("EMP-090","Trine","Moller","Commercial","Commercial Manager",            115, 40, "Lead",   ["Pricing","Margins","Contracts"]),
    emp("EMP-091","Reema","Al-Mansoori","Commercial","Cost Controller",           72, 40, "Mid",    ["Cost reports","Forecasting"]),
    emp("EMP-092","Stephane","Renaud","Commercial","Senior Cost Engineer",        92, 40, "Senior", ["Estimating","Bridging"]),
    emp("EMP-100","Karim","El-Shafei","DocCtrl","Document Controller",            55, 40, "Mid",    ["EDMS","Transmittals"]),
    emp("EMP-101","Naomi","Sato","QA","QA/QC Manager",                           110, 40, "Lead",   ["ISO 9001","Audits"]),
    emp("EMP-102","Ben","Foster","QA","QA Engineer",                               75, 40, "Mid",    ["Document review","Compliance"]),
    emp("EMP-110","Ingrid","Solberg","Architecture","Architect",                    95, 40, "Senior", ["Industrial buildings","Codes"]),
  ];

  const users = employees.map(e => ({
    user_id: "U-" + e.employee_id.split("-")[1],
    email: e.email, status: "Active",
    microsoft_id: "o365-" + e.employee_id.toLowerCase(),
    last_login: "2026-05-19T08:14:00Z",
    employee_id: e.employee_id,
  }));

  // ============================================
  // PROJECTS
  // ============================================
  const projects = [
    {
      project_id: "P-001", project_code: "GFB-101",
      project_name: "Green Fuel Bridging Study",
      client: "QatarEnergy LNG", country: "Qatar",
      project_type: "FEED Study", status: "Active", priority: "High",
      start_date: "2025-09-01", end_date: "2026-08-31", submission_date: "2026-07-15",
      budget: 4850000, fee_factor: 2.85, contingency_pct: 8, tender_fee: 285000, currency: "USD",
      pm_id: "EMP-001", progress: 74, health: "amber",
      description: "Engineering bridging study for a green fuel hydrogen / ammonia integration into existing LNG facilities at Ras Laffan.",
      tags: ["Hydrogen","Ammonia","Bridging","FEED"],
    },
    {
      project_id: "P-002", project_code: "EXP-204",
      project_name: "North Field Expansion — Utilities",
      client: "QatarEnergy", country: "Qatar",
      project_type: "Detailed Design", status: "Active", priority: "High",
      start_date: "2025-04-15", end_date: "2027-06-30", submission_date: "2027-04-30",
      budget: 12400000, fee_factor: 2.65, contingency_pct: 7, tender_fee: 720000, currency: "USD",
      pm_id: "EMP-002", progress: 41, health: "green",
      description: "Detailed engineering for utilities upgrade — power, cooling, and water — supporting the North Field expansion.",
      tags: ["LNG","Utilities","Detailed Design"],
    },
    {
      project_id: "P-003", project_code: "PSR-309",
      project_name: "Pearl Refinery Sulphur Recovery Upgrade",
      client: "QatarEnergy Refining", country: "Qatar",
      project_type: "EPC Support", status: "Active", priority: "Medium",
      start_date: "2025-01-10", end_date: "2026-12-20", submission_date: "2026-11-15",
      budget: 7900000, fee_factor: 2.70, contingency_pct: 6, tender_fee: 450000, currency: "USD",
      pm_id: "EMP-003", progress: 62, health: "green",
      description: "Engineering services for an upgrade to the existing Claus sulphur recovery train, including emission compliance package.",
      tags: ["Refinery","Sulphur","Brownfield"],
    },
    {
      project_id: "P-004", project_code: "DSW-118",
      project_name: "Doha Sea Water Cooling Plant",
      client: "Kahramaa", country: "Qatar",
      project_type: "Concept Design", status: "Active", priority: "Medium",
      start_date: "2026-01-15", end_date: "2027-09-30", submission_date: "2027-07-30",
      budget: 3200000, fee_factor: 2.80, contingency_pct: 10, tender_fee: 180000, currency: "USD",
      pm_id: "EMP-004", progress: 22, health: "green",
      description: "Conceptual design for a new sea-water cooling intake & distribution plant serving the western Doha district cooling network.",
      tags: ["Water","Concept","District cooling"],
    },
    {
      project_id: "P-005", project_code: "BRB-022",
      project_name: "Salwa Road Bridge Refurbishment",
      client: "Ashghal", country: "Qatar",
      project_type: "Detailed Design", status: "Active", priority: "Low",
      start_date: "2025-11-01", end_date: "2026-08-15", submission_date: "2026-07-01",
      budget: 1650000, fee_factor: 2.55, contingency_pct: 5, tender_fee: 95000, currency: "USD",
      pm_id: "EMP-003", progress: 88, health: "green",
      description: "Refurbishment design for the Salwa Road interchange bridge — strengthening, expansion joints, and waterproofing replacement.",
      tags: ["Bridges","Infrastructure"],
    },
    {
      project_id: "P-006", project_code: "OWF-401",
      project_name: "Offshore Wind Foundations Concept",
      client: "Masdar", country: "UAE",
      project_type: "Concept Design", status: "Planning", priority: "High",
      start_date: "2026-06-01", end_date: "2027-12-30", submission_date: "2027-10-15",
      budget: 5800000, fee_factor: 2.90, contingency_pct: 12, tender_fee: 320000, currency: "USD",
      pm_id: "EMP-004", progress: 6, health: "amber",
      description: "Concept design package for monopile and jacket foundations for a 1.2 GW offshore wind cluster in the Gulf of Oman.",
      tags: ["Offshore","Wind","Concept"],
    },
    {
      project_id: "P-007", project_code: "WTP-505",
      project_name: "Ammonia Tank Farm Modification",
      client: "Industries Qatar", country: "Qatar",
      project_type: "Detailed Design", status: "On Hold", priority: "Low",
      start_date: "2025-06-01", end_date: "2026-12-31", submission_date: "2026-11-30",
      budget: 2900000, fee_factor: 2.60, contingency_pct: 8, tender_fee: 165000, currency: "USD",
      pm_id: "EMP-002", progress: 38, health: "red",
      description: "Modification of two existing ammonia storage tanks to comply with revised emission standards. On hold pending client review.",
      tags: ["Ammonia","Storage","Brownfield"],
    },
    {
      project_id: "P-008", project_code: "CCS-902",
      project_name: "Mesaieed CCS Pre-FEED",
      client: "QatarEnergy LNG", country: "Qatar",
      project_type: "Pre-FEED", status: "Closeout", priority: "Medium",
      start_date: "2024-09-01", end_date: "2026-05-31", submission_date: "2026-05-15",
      budget: 6700000, fee_factor: 2.75, contingency_pct: 6, tender_fee: 380000, currency: "USD",
      pm_id: "EMP-001", progress: 96, health: "green",
      description: "Carbon capture & storage Pre-FEED for the Mesaieed industrial complex, integrating post-combustion capture with existing assets.",
      tags: ["CCS","Pre-FEED","Sustainability"],
    },
  ];
  const activeProject = projects[0];

  // ============================================
  // DISCIPLINES PER PROJECT (deep for P-001 & P-002)
  // ============================================
  function makeDisciplines(p, mix) {
    return mix.map((d, i) => ({
      discipline_id: p.project_code + "-DSC-" + String(i+1).padStart(2,"0"),
      project_id: p.project_id, name: d.name,
      lead_employee_id: d.lead,
      planned_hours: d.plan, actual_hours: d.actual,
      completion_percent: Math.min(100, Math.round((d.actual/d.plan)*100)),
      budget: d.budget, spent: d.spent,
    }));
  }
  const disciplines = [
    ...makeDisciplines(projects[0], [
      { name: "PM",              lead: "EMP-001", plan: 720,  actual: 535, budget: 105000, spent: 78000 },
      { name: "Process",         lead: "EMP-081", plan: 2200, actual: 1605, budget: 220000, spent: 161000 },
      { name: "Mechanical",      lead: "EMP-010", plan: 3400, actual: 2510, budget: 296000, spent: 218400 },
      { name: "Electrical",      lead: "EMP-020", plan: 1850, actual: 1320, budget: 196000, spent: 140100 },
      { name: "Instrumentation", lead: "EMP-030", plan: 1600, actual: 1108, budget: 168000, spent: 116300 },
      { name: "Structural",      lead: "EMP-040", plan: 1450, actual: 985,  budget: 152000, spent: 103500 },
      { name: "HSE",             lead: "EMP-050", plan: 620,  actual: 410,  budget: 78000,  spent: 51700 },
      { name: "Civil",           lead: "EMP-080", plan: 720,  actual: 380,  budget: 82000,  spent: 43000 },
      { name: "Procurement",     lead: "EMP-070", plan: 540,  actual: 280,  budget: 62000,  spent: 32100 },
      { name: "Commercial",      lead: "EMP-090", plan: 480,  actual: 320,  budget: 65000,  spent: 44000 },
    ]),
    ...makeDisciplines(projects[1], [
      { name: "PM",         lead: "EMP-002", plan: 1200, actual: 480, budget: 168000, spent: 67200 },
      { name: "Process",    lead: "EMP-081", plan: 2800, actual: 1100, budget: 308000, spent: 121000 },
      { name: "Mechanical", lead: "EMP-010", plan: 4200, actual: 1750, budget: 410000, spent: 170800 },
      { name: "Electrical", lead: "EMP-020", plan: 2400, actual: 900, budget: 235200, spent: 88200 },
    ]),
  ];

  // ============================================
  // ASSIGNMENTS
  // ============================================
  const assignments = [
    { project_id: "P-001", employee_id: "EMP-001", discipline: "PM",              role_on_project: "Project Director", allocation_pct: 50, start_date: "2025-09-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-081", discipline: "Process",         role_on_project: "Process Lead",     allocation_pct: 80, start_date: "2025-09-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-082", discipline: "Process",         role_on_project: "Senior Process",   allocation_pct: 70, start_date: "2025-09-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-010", discipline: "Mechanical",      role_on_project: "Mech Lead",        allocation_pct: 60, start_date: "2025-10-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-011", discipline: "Mechanical",      role_on_project: "Sr. Rotating",     allocation_pct: 50, start_date: "2025-10-01", end_date: "2026-06-30" },
    { project_id: "P-001", employee_id: "EMP-012", discipline: "Mechanical",      role_on_project: "Stress Analyst",   allocation_pct: 70, start_date: "2025-10-01", end_date: "2026-07-31" },
    { project_id: "P-001", employee_id: "EMP-014", discipline: "Mechanical",      role_on_project: "Junior",           allocation_pct: 100, start_date: "2025-10-15", end_date: "2026-08-15" },
    { project_id: "P-001", employee_id: "EMP-020", discipline: "Electrical",      role_on_project: "Elec Lead",        allocation_pct: 60, start_date: "2025-10-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-021", discipline: "Electrical",      role_on_project: "Sr. Power",        allocation_pct: 65, start_date: "2025-10-01", end_date: "2026-07-31" },
    { project_id: "P-001", employee_id: "EMP-023", discipline: "Electrical",      role_on_project: "Power Distribution", allocation_pct: 70, start_date: "2025-10-01", end_date: "2026-07-31" },
    { project_id: "P-001", employee_id: "EMP-030", discipline: "Instrumentation", role_on_project: "I&C Lead",         allocation_pct: 55, start_date: "2025-11-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-031", discipline: "Instrumentation", role_on_project: "Sr. I&C",          allocation_pct: 60, start_date: "2025-11-01", end_date: "2026-08-15" },
    { project_id: "P-001", employee_id: "EMP-033", discipline: "Instrumentation", role_on_project: "I&C Engineer",     allocation_pct: 80, start_date: "2025-11-01", end_date: "2026-08-15" },
    { project_id: "P-001", employee_id: "EMP-040", discipline: "Structural",      role_on_project: "Struct Lead",      allocation_pct: 50, start_date: "2025-10-15", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-042", discipline: "Structural",      role_on_project: "Struct Engineer",  allocation_pct: 70, start_date: "2025-10-15", end_date: "2026-08-15" },
    { project_id: "P-001", employee_id: "EMP-050", discipline: "HSE",             role_on_project: "HSE Lead",         allocation_pct: 35, start_date: "2025-09-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-051", discipline: "HSE",             role_on_project: "HSE Eng.",         allocation_pct: 60, start_date: "2025-10-01", end_date: "2026-08-15" },
    { project_id: "P-001", employee_id: "EMP-080", discipline: "Civil",           role_on_project: "Civil Lead",       allocation_pct: 40, start_date: "2025-10-01", end_date: "2026-07-31" },
    { project_id: "P-001", employee_id: "EMP-070", discipline: "Procurement",     role_on_project: "Procurement Mgr",  allocation_pct: 30, start_date: "2025-10-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-090", discipline: "Commercial",      role_on_project: "Commercial Lead",  allocation_pct: 30, start_date: "2025-09-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-091", discipline: "Commercial",      role_on_project: "Cost Controller",  allocation_pct: 50, start_date: "2025-09-01", end_date: "2026-08-31" },
    { project_id: "P-001", employee_id: "EMP-100", discipline: "DocCtrl",         role_on_project: "Doc Controller",   allocation_pct: 40, start_date: "2025-10-01", end_date: "2026-08-31" },
    { project_id: "P-002", employee_id: "EMP-002", discipline: "PM", role_on_project: "Project Manager", allocation_pct: 70, start_date: "2025-04-15", end_date: "2027-06-30" },
    { project_id: "P-002", employee_id: "EMP-010", discipline: "Mechanical", role_on_project: "Mech Lead", allocation_pct: 40, start_date: "2025-05-01", end_date: "2027-06-30" },
    { project_id: "P-002", employee_id: "EMP-013", discipline: "Mechanical", role_on_project: "HVAC", allocation_pct: 60, start_date: "2025-05-01", end_date: "2027-06-30" },
    { project_id: "P-002", employee_id: "EMP-020", discipline: "Electrical", role_on_project: "Elec Lead", allocation_pct: 40, start_date: "2025-05-01", end_date: "2027-06-30" },
    { project_id: "P-002", employee_id: "EMP-022", discipline: "Electrical", role_on_project: "Power", allocation_pct: 70, start_date: "2025-05-01", end_date: "2027-06-30" },
    { project_id: "P-003", employee_id: "EMP-003", discipline: "PM", role_on_project: "Project Manager", allocation_pct: 60, start_date: "2025-01-10", end_date: "2026-12-20" },
    { project_id: "P-003", employee_id: "EMP-081", discipline: "Process", role_on_project: "Process Lead", allocation_pct: 20, start_date: "2025-02-01", end_date: "2026-12-20" },
    { project_id: "P-003", employee_id: "EMP-015", discipline: "Mechanical", role_on_project: "Static Eq", allocation_pct: 80, start_date: "2025-02-01", end_date: "2026-12-20" },
    { project_id: "P-004", employee_id: "EMP-004", discipline: "PM", role_on_project: "Project Manager", allocation_pct: 60, start_date: "2026-01-15", end_date: "2027-09-30" },
    { project_id: "P-004", employee_id: "EMP-080", discipline: "Civil", role_on_project: "Civil Lead", allocation_pct: 60, start_date: "2026-02-01", end_date: "2027-09-30" },
    { project_id: "P-005", employee_id: "EMP-003", discipline: "PM", role_on_project: "Project Manager", allocation_pct: 40, start_date: "2025-11-01", end_date: "2026-08-15" },
    { project_id: "P-005", employee_id: "EMP-041", discipline: "Structural", role_on_project: "Sr. Struct", allocation_pct: 80, start_date: "2025-11-15", end_date: "2026-08-15" },
    { project_id: "P-006", employee_id: "EMP-004", discipline: "PM", role_on_project: "Project Manager", allocation_pct: 40, start_date: "2026-06-01", end_date: "2027-12-30" },
    { project_id: "P-007", employee_id: "EMP-002", discipline: "PM", role_on_project: "Project Manager", allocation_pct: 10, start_date: "2025-06-01", end_date: "2026-12-31" },
    { project_id: "P-008", employee_id: "EMP-001", discipline: "PM", role_on_project: "Project Director", allocation_pct: 30, start_date: "2024-09-01", end_date: "2026-05-31" },
    { project_id: "P-008", employee_id: "EMP-082", discipline: "Process", role_on_project: "Sr. Process", allocation_pct: 30, start_date: "2024-09-01", end_date: "2026-05-31" },
  ];

  // ============================================
  // WEEKLY HOURS / ALLOCATIONS — 14-week window
  // ============================================
  const planningWeeks = [];
  {
    const startISO = new Date("2026-04-13");
    for (let i = 0; i < 14; i++) {
      const d = new Date(startISO.getTime() + i*7*86400000);
      planningWeeks.push({
        index: i, year: d.getUTCFullYear(),
        week: U.isoWeek(d),
        label: "W" + U.isoWeek(d),
        start: d.toISOString().slice(0,10),
        isCurrent: i === 5,
      });
    }
  }
  const allocations = [];
  for (const a of assignments) {
    if (a.project_id !== "P-001" && a.project_id !== "P-002") continue;
    const rand = U.deterministicRand(parseInt(a.employee_id.slice(-3)) + a.project_id.charCodeAt(2));
    for (const w of planningWeeks) {
      const planned = Math.round((a.allocation_pct / 100) * 40);
      const past = w.index < 5;
      const actual = past ? Math.max(0, Math.round(planned + (rand()-0.5) * 10)) : null;
      allocations.push({
        project_id: a.project_id, employee_id: a.employee_id,
        week: w.week, year: w.year, week_index: w.index,
        planned_hours: planned, actual_hours: actual,
      });
    }
  }

  // ============================================
  // DELIVERABLES
  // ============================================
  function dv(id, code, title, project, discipline, owner, status, plan, actual, completion, rev) {
    rev = rev || "A";
    return {
      deliverable_id: id, project_id: project, discipline,
      owner_employee_id: owner, deliverable_code: code, title, status,
      planned_date: plan, actual_date: actual, revision: rev,
      completion_percent: completion,
    };
  }
  const deliverables = [
    dv("DEL-0001","GFB-PR-PFD-001","Process Flow Diagram — Hydrogen package",                "P-001","Process",         "EMP-081","Approved",     "2026-01-15","2026-01-14",100,"B"),
    dv("DEL-0002","GFB-PR-PID-002","P&ID — Hydrogen production package",                      "P-001","Process",         "EMP-081","In Progress",  "2026-05-30",null,         65, "B"),
    dv("DEL-0003","GFB-PR-PID-003","P&ID — Ammonia synthesis loop",                            "P-001","Process",         "EMP-082","In Progress",  "2026-06-15",null,         45, "A"),
    dv("DEL-0004","GFB-ME-EQ-101", "Equipment list — Hydrogen package",                        "P-001","Mechanical",      "EMP-010","Approved",     "2026-02-12","2026-02-10",100,"C"),
    dv("DEL-0005","GFB-ME-EQ-102", "Equipment datasheets — pumps & compressors",               "P-001","Mechanical",      "EMP-011","In Review",    "2026-05-22","2026-05-18",92, "B"),
    dv("DEL-0006","GFB-ME-CALC-001","Piping stress analysis — Hydrogen unit",                  "P-001","Mechanical",      "EMP-012","Delayed",      "2026-05-15",null,         70, "A"),
    dv("DEL-0007","GFB-ME-LAY-001","Mech 3D model — first issue",                              "P-001","Mechanical",      "EMP-014","In Progress",  "2026-06-25",null,         40, "A"),
    dv("DEL-0008","GFB-EL-SLD-001","Single Line Diagram — main substation",                    "P-001","Electrical",      "EMP-020","Approved",     "2026-03-15","2026-03-14",100,"B"),
    dv("DEL-0009","GFB-EL-LDC-001","Load list & power balance",                                "P-001","Electrical",      "EMP-021","Issued",       "2026-04-30","2026-04-28",100,"B"),
    dv("DEL-0010","GFB-EL-DR-101", "Cable schedule",                                           "P-001","Electrical",      "EMP-023","In Progress",  "2026-06-10",null,         55, "A"),
    dv("DEL-0011","GFB-IC-PHI-001","Control philosophy — Hydrogen package",                    "P-001","Instrumentation", "EMP-030","In Review",    "2026-05-20","2026-05-15",95, "B"),
    dv("DEL-0012","GFB-IC-IL-001", "Instrument list",                                          "P-001","Instrumentation", "EMP-031","In Progress",  "2026-06-08",null,         60, "A"),
    dv("DEL-0013","GFB-IC-LD-001", "Loop drawings — package 1",                                "P-001","Instrumentation", "EMP-033","Draft",        "2026-07-15",null,         15, "A"),
    dv("DEL-0014","GFB-ST-CALC-001","Structural calculation — pipe rack",                      "P-001","Structural",      "EMP-040","In Progress",  "2026-05-28",null,         70, "A"),
    dv("DEL-0015","GFB-ST-DR-101","Pipe rack — General Arrangement",                            "P-001","Structural",      "EMP-042","Draft",        "2026-07-08",null,         25, "A"),
    dv("DEL-0016","GFB-HSE-HAZID-001","HAZID workshop report",                                  "P-001","HSE",             "EMP-050","Approved",     "2026-01-30","2026-01-28",100,"B"),
    dv("DEL-0017","GFB-HSE-HAZOP-001","HAZOP — Hydrogen package",                              "P-001","HSE",             "EMP-052","In Review",    "2026-05-25","2026-05-20",90, "A"),
    dv("DEL-0018","GFB-CI-DR-101","Plot plan — overall",                                       "P-001","Civil",            "EMP-080","Issued",       "2026-03-20","2026-03-18",100,"B"),
    dv("DEL-0019","GFB-CI-CALC-001","Drainage calculation",                                     "P-001","Civil",            "EMP-080","Draft",        "2026-07-12",null,         20, "A"),
    dv("DEL-0020","GFB-PR-RP-001","Process narrative report",                                   "P-001","Process",         "EMP-081","In Progress",  "2026-06-30",null,         55, "A"),
    dv("DEL-0021","GFB-PM-RP-001","Project execution plan",                                    "P-001","PM",              "EMP-001","Approved",     "2025-10-15","2025-10-10",100,"C"),
    dv("DEL-0022","GFB-PM-RP-002","Monthly progress report — April 2026",                      "P-001","PM",              "EMP-001","Issued",       "2026-05-05","2026-05-04",100,"A"),
    dv("DEL-0023","GFB-CM-RP-001","Cost report — April 2026",                                  "P-001","Commercial",      "EMP-091","Issued",       "2026-05-08","2026-05-07",100,"A"),
    dv("DEL-0024","GFB-PR-PID-004","P&ID — Utilities",                                          "P-001","Process",         "EMP-082","Delayed",     "2026-05-12",null,         55, "A"),
    dv("DEL-0030","EXP-PM-RP-001","Project execution plan",                                     "P-002","PM",              "EMP-002","Approved",    "2025-05-30","2025-05-29",100,"B"),
    dv("DEL-0031","EXP-PR-PFD-001","PFD — Power utilities",                                     "P-002","Process",         "EMP-081","In Progress",  "2026-06-30",null,         35,"A"),
    dv("DEL-0032","EXP-ME-EQ-001","HVAC equipment list",                                         "P-002","Mechanical",      "EMP-013","In Progress",  "2026-07-15",null,         30,"A"),
    dv("DEL-0033","EXP-EL-SLD-001","Single Line Diagram — utility substation",                  "P-002","Electrical",      "EMP-022","In Progress",  "2026-08-10",null,         25,"A"),
    dv("DEL-0040","PSR-ME-CALC-001","Reactor mechanical calculation",                           "P-003","Mechanical",      "EMP-015","Issued",       "2026-03-15","2026-03-14",100,"B"),
    dv("DEL-0041","PSR-PR-PID-001","P&ID — modified Claus train",                              "P-003","Process",         "EMP-081","Approved",     "2026-04-10","2026-04-08",100,"C"),
  ];

  // ============================================
  // COSTS PER PROJECT
  // ============================================
  const costs = projects.map(p => {
    const spent_pct = p.progress * 0.95;
    const spent = p.budget * (spent_pct/100);
    const committed = spent + p.budget * 0.12;
    const forecast = p.health === "red" ? p.budget * 1.08 :
                     p.health === "amber" ? p.budget * 1.02 :
                     p.budget * 0.99;
    return {
      project_id: p.project_id, budget: p.budget,
      committed: Math.round(committed), spent: Math.round(spent),
      forecast: Math.round(forecast), variance: Math.round(forecast - p.budget),
      contingency: Math.round(p.budget * p.contingency_pct / 100),
      contingency_drawn: Math.round(p.budget * p.contingency_pct / 100 * (spent_pct/100)),
      currency: p.currency,
    };
  });

  // ============================================
  // RISKS, APPROVALS, CHANGES, MILESTONES
  // ============================================
  const risks = [
    { risk_id: "R-001", project_id: "P-001", title: "Hydrogen vendor lead time slip (12-wk impact)", category: "Logistics",   probability: 4, impact: 4, severity: "High",     mitigation: "Dual-source compressors; secure long-lead steel reservation.", owner: "EMP-001", status: "Open",     trend: "rising",  due: "2026-06-15" },
    { risk_id: "R-002", project_id: "P-001", title: "Client decision delay on ammonia synthesis loop", category: "Stakeholder", probability: 3, impact: 4, severity: "Medium",   mitigation: "Bi-weekly steering committee; option register prepared.", owner: "EMP-001", status: "Open",     trend: "stable",  due: "2026-05-30" },
    { risk_id: "R-003", project_id: "P-001", title: "HAZOP findings exceed contingency allowance",   category: "Engineering",  probability: 2, impact: 4, severity: "Medium",   mitigation: "Early HAZOP workshop; design review checkpoints.", owner: "EMP-050", status: "Open",     trend: "stable",  due: "2026-05-25" },
    { risk_id: "R-004", project_id: "P-001", title: "Currency exposure on imported equipment (EUR)",  category: "Commercial",   probability: 3, impact: 3, severity: "Medium",   mitigation: "Forward hedge for Q3/Q4 procurement (60%).", owner: "EMP-090", status: "Open",     trend: "stable",  due: "2026-08-01" },
    { risk_id: "R-005", project_id: "P-001", title: "Local content compliance gap",                  category: "Compliance",   probability: 2, impact: 3, severity: "Low",      mitigation: "Local fabrication agreement signed.", owner: "EMP-070", status: "Mitigated", trend: "falling", due: "2026-05-20" },
    { risk_id: "R-006", project_id: "P-001", title: "Skilled engineer availability — Stress analysis", category: "Resources",   probability: 4, impact: 3, severity: "High",     mitigation: "Subcontract framework with two firms; visa pipeline.", owner: "EMP-001", status: "Open", trend: "rising",  due: "2026-07-01" },
    { risk_id: "R-007", project_id: "P-001", title: "Quality issues with hydrogen package vendor",    category: "Engineering",  probability: 3, impact: 4, severity: "High",     mitigation: "Pre-inspection meeting; QA representative at vendor.", owner: "EMP-101", status: "Open",     trend: "stable",  due: "2026-06-30" },
    { risk_id: "R-008", project_id: "P-001", title: "Permit lapse — laydown area heavy equipment",    category: "Permits",      probability: 1, impact: 4, severity: "Medium",   mitigation: "Renewal lodged 8 weeks early; legal liaison.", owner: "EMP-001", status: "Mitigated", trend: "falling", due: "2026-06-12" },
    { risk_id: "R-009", project_id: "P-001", title: "Carbon target slippage on cementitious materials", category: "Sustainability", probability: 3, impact: 2, severity: "Low",  mitigation: "Trial mixes with 35% GGBS underway; cost neutral.", owner: "EMP-110", status: "Open", trend: "stable", due: "2026-08-15" },
    { risk_id: "R-010", project_id: "P-001", title: "Interface clash — instrumentation vs structural", category: "Interface",    probability: 2, impact: 5, severity: "Medium",   mitigation: "Tripartite interface workshop scheduled wk 22.", owner: "EMP-030", status: "Open",     trend: "rising",  due: "2026-05-28" },
    { risk_id: "R-011", project_id: "P-001", title: "Software licensing — CAESAR II expiration",      category: "IT",           probability: 1, impact: 3, severity: "Low",      mitigation: "Renewal already approved by IT.", owner: "EMP-012", status: "Closed",   trend: "falling", due: "2026-03-01" },
    { risk_id: "R-012", project_id: "P-002", title: "Schedule slip on substation civil works",        category: "Construction", probability: 3, impact: 4, severity: "High",     mitigation: "Float in marine programme +14 days; weekly check-in.", owner: "EMP-080", status: "Open", trend: "stable", due: "2026-06-30" },
    { risk_id: "R-013", project_id: "P-002", title: "Increased cyclone activity affecting marine",     category: "Weather",      probability: 4, impact: 3, severity: "High",     mitigation: "Float in marine programme +14 days.", owner: "EMP-002", status: "Open",     trend: "rising",  due: "2026-09-30" },
    { risk_id: "R-014", project_id: "P-003", title: "Brownfield interface — tie-in coordination",     category: "Interface",    probability: 3, impact: 3, severity: "Medium",   mitigation: "Joint engineering reviews with operations.", owner: "EMP-003", status: "Open", trend: "stable", due: "2026-07-15" },
  ];

  const approvals = [
    { approval_id: "APR-001", project_id: "P-001", entity_type: "Deliverable",   entity_id: "DEL-0011", title: "Control philosophy — Hydrogen package (Rev B)", approver_id: "EMP-001", level: "PM",         status: "Pending",  raised: "2026-05-15", priority: "High" },
    { approval_id: "APR-002", project_id: "P-001", entity_type: "ChangeRequest", entity_id: "CR-003",   title: "VO — Acoustic enclosure to vent shaft",         approver_id: "EMP-090", level: "Commercial", status: "Pending",  raised: "2026-05-14", priority: "Medium" },
    { approval_id: "APR-003", project_id: "P-001", entity_type: "Deliverable",   entity_id: "DEL-0005", title: "Equipment datasheets — pumps & compressors",    approver_id: "EMP-010", level: "Lead",       status: "Pending",  raised: "2026-05-18", priority: "High" },
    { approval_id: "APR-004", project_id: "P-001", entity_type: "Deliverable",   entity_id: "DEL-0017", title: "HAZOP — Hydrogen package",                       approver_id: "EMP-050", level: "Lead",       status: "Approved", raised: "2026-05-20", priority: "High", approved_date: "2026-05-21" },
    { approval_id: "APR-005", project_id: "P-001", entity_type: "ChangeRequest", entity_id: "CR-001",   title: "VO — Additional CPT campaign at section C",     approver_id: "EMP-090", level: "Commercial", status: "Approved", raised: "2026-04-19", priority: "Medium", approved_date: "2026-04-25" },
    { approval_id: "APR-006", project_id: "P-001", entity_type: "Cost",          entity_id: "COST-Q2",  title: "Q2 cost forecast endorsement",                   approver_id: "EMP-001", level: "PM",         status: "Approved", raised: "2026-05-02", priority: "Medium", approved_date: "2026-05-03" },
    { approval_id: "APR-007", project_id: "P-002", entity_type: "Deliverable",   entity_id: "DEL-0030", title: "Project execution plan (Rev B)",                 approver_id: "EMP-002", level: "PM",         status: "Approved", raised: "2025-05-25", priority: "High", approved_date: "2025-05-29" },
    { approval_id: "APR-008", project_id: "P-001", entity_type: "Deliverable",   entity_id: "DEL-0002", title: "P&ID — Hydrogen production package (Rev B)",     approver_id: "EMP-001", level: "PM",         status: "Pending",  raised: "2026-05-19", priority: "High" },
    { approval_id: "APR-009", project_id: "P-001", entity_type: "ChangeRequest", entity_id: "CR-004",   title: "VO — Revised entrance canopy — heritage area",   approver_id: "EMP-001", level: "PM",         status: "Pending",  raised: "2026-05-15", priority: "Medium" },
    { approval_id: "APR-010", project_id: "P-002", entity_type: "Cost",          entity_id: "COST-Q1",  title: "Q1 cost forecast",                               approver_id: "EMP-090", level: "Commercial", status: "Approved", raised: "2026-04-05", priority: "Low", approved_date: "2026-04-10" },
  ];

  const changes = [
    { change_id: "CR-001", project_id: "P-001", title: "Additional CPT campaign at section C",    reason: "Ground info gap",          hours_impact: 240,  cost_impact:  120000, schedule_impact_days: 8,  status: "Approved",   requested_by: "EMP-040", date: "2026-03-12", initiator: "Engineer" },
    { change_id: "CR-002", project_id: "P-001", title: "Hydrogen package vendor change",          reason: "Better lead time",          hours_impact: 180,  cost_impact:   38500, schedule_impact_days: -14, status: "Approved",  requested_by: "EMP-070", date: "2026-04-25", initiator: "Engineer" },
    { change_id: "CR-003", project_id: "P-001", title: "Acoustic enclosure to vent shaft",        reason: "Community / stakeholder",   hours_impact: 320,  cost_impact:  145000, schedule_impact_days: 7,  status: "In Review",  requested_by: "EMP-082", date: "2026-05-04", initiator: "Stakeholder" },
    { change_id: "CR-004", project_id: "P-001", title: "Revised entrance canopy — heritage area", reason: "Heritage consultation",     hours_impact: 480,  cost_impact:  230000, schedule_impact_days: 18, status: "In Review",  requested_by: "EMP-110", date: "2026-04-19", initiator: "Stakeholder" },
    { change_id: "CR-005", project_id: "P-001", title: "Extended fibre duct provision",           reason: "Future-proofing",           hours_impact: 80,   cost_impact:   65000, schedule_impact_days: 0,  status: "Approved",  requested_by: "EMP-030", date: "2026-04-25", initiator: "Engineer" },
    { change_id: "CR-006", project_id: "P-001", title: "Carbon-reduced concrete mixes (trial)",   reason: "Sustainability",            hours_impact: 60,   cost_impact:   18000, schedule_impact_days: 0,  status: "Approved",  requested_by: "EMP-082", date: "2026-04-30", initiator: "Engineer" },
    { change_id: "CR-007", project_id: "P-001", title: "Programme acceleration — section A",     reason: "Client request",             hours_impact: -240, cost_impact: -680000, schedule_impact_days: -22, status: "Submitted", requested_by: "EMP-001", date: "2026-05-09", initiator: "Client" },
    { change_id: "CR-008", project_id: "P-001", title: "Additional waterproofing detail wk 20",   reason: "Design clarification",      hours_impact: 60,   cost_impact:   90000, schedule_impact_days: 3,  status: "Rejected",  requested_by: "EMP-040", date: "2026-05-12", initiator: "Contractor" },
    { change_id: "CR-009", project_id: "P-002", title: "HVAC redundancy upgrade",                 reason: "Client requirement",        hours_impact: 360,  cost_impact:  185000, schedule_impact_days: 6,  status: "In Review",  requested_by: "EMP-013", date: "2026-05-10", initiator: "Client" },
  ];

  const milestones = [
    { milestone_id: "M-01", project_id: "P-001", title: "Project kickoff",               due_date: "2025-09-15", status: "Completed" },
    { milestone_id: "M-02", project_id: "P-001", title: "Process design freeze",          due_date: "2026-01-31", status: "Completed" },
    { milestone_id: "M-03", project_id: "P-001", title: "30% Design review",              due_date: "2026-03-15", status: "Completed" },
    { milestone_id: "M-04", project_id: "P-001", title: "HAZOP completion",               due_date: "2026-05-25", status: "Active" },
    { milestone_id: "M-05", project_id: "P-001", title: "60% Design review",              due_date: "2026-06-30", status: "Upcoming" },
    { milestone_id: "M-06", project_id: "P-001", title: "Equipment datasheets issued",    due_date: "2026-07-15", status: "Upcoming" },
    { milestone_id: "M-07", project_id: "P-001", title: "Final submission",               due_date: "2026-07-31", status: "Upcoming" },
    { milestone_id: "M-08", project_id: "P-001", title: "Project closeout",               due_date: "2026-08-31", status: "Upcoming" },
  ];

  const documents = deliverables.map(d => ({
    document_id: "DOC-" + d.deliverable_id.split("-")[1],
    project_id: d.project_id,
    file_name: d.deliverable_code + "_R" + d.revision + ".pdf",
    title: d.title, discipline: d.discipline,
    file_type: "PDF", uploaded_by: d.owner_employee_id,
    uploaded_date: d.actual_date || d.planned_date,
    version: d.revision,
    size_mb: (1 + (parseInt(d.deliverable_id.split("-")[1]) % 8) * 0.7).toFixed(1),
  }));

  const notifications = [
    { id: "N-01", user_id: "U-001", type: "approval",    title: "Approval requested",         message: "P&ID — Hydrogen production package (Rev B) needs your sign-off.",       link: "#/approvals/APR-008", read: false, created_at: "2026-05-19T09:14:00Z", priority: "high"   },
    { id: "N-02", user_id: "U-001", type: "deliverable", title: "Deliverable delayed",        message: "Piping stress analysis — Hydrogen unit is 4 days overdue.",            link: "#/deliverables/DEL-0006", read: false, created_at: "2026-05-19T08:42:00Z", priority: "high"   },
    { id: "N-03", user_id: "U-001", type: "budget",      title: "Budget threshold reached",   message: "GFB-101 forecast is now 99.4% of approved budget.",                     link: "#/projects/P-001/cost", read: false, created_at: "2026-05-19T07:11:00Z", priority: "medium" },
    { id: "N-04", user_id: "U-001", type: "risk",        title: "Risk severity increased",    message: "Risk R-006 (skilled engineer availability) moved from Med → High.",     link: "#/projects/P-001/risks", read: false, created_at: "2026-05-18T16:30:00Z", priority: "medium" },
    { id: "N-05", user_id: "U-001", type: "change",      title: "New change request",         message: "CR-007 (Programme acceleration — section A) submitted by client.",       link: "#/changes/CR-007", read: true, created_at: "2026-05-18T12:08:00Z", priority: "medium" },
    { id: "N-06", user_id: "U-001", type: "mention",     title: "You were mentioned",         message: "Lina Holm mentioned you in MoM-032 minutes.",                            link: "#/projects/P-001", read: true,  created_at: "2026-05-17T15:01:00Z", priority: "low"   },
    { id: "N-07", user_id: "U-001", type: "deliverable", title: "Deliverable approved",       message: "HAZOP — Hydrogen package was approved by Lars Nyholm.",                 link: "#/deliverables/DEL-0017", read: true,  created_at: "2026-05-16T09:30:00Z", priority: "low"   },
    { id: "N-08", user_id: "U-001", type: "system",      title: "Weekly progress digest",     message: "Wk 20 — 6 deliverables progressed, 2 risks raised, 3 approvals closed.", link: "#/dashboard", read: true,  created_at: "2026-05-16T07:00:00Z", priority: "low"   },
  ];

  function portfolioKPIs() {
    const active = projects.filter(p => p.status === "Active" || p.status === "Planning");
    const budgetTotal = projects.reduce((s,p)=>s+p.budget, 0);
    const spentTotal  = costs.reduce((s,c)=>s+c.spent, 0);
    const openRisks = risks.filter(r => r.status !== "Closed").length;
    const utilization = 78;
    return {
      activeProjects: active.length, totalProjects: projects.length,
      budgetTotal, spentTotal,
      resources: employees.length,
      openRisks, utilization,
    };
  }

  // Lookup helpers
  function employeeById(id) { return employees.find(e => e.employee_id === id); }
  function projectById(id)  { return projects.find(p => p.project_id === id); }
  function projectByCode(code) { return projects.find(p => p.project_code === code); }
  function deliverableById(id) { return deliverables.find(d => d.deliverable_id === id); }
  function changeById(id) { return changes.find(c => c.change_id === id); }
  function approvalById(id) { return approvals.find(a => a.approval_id === id); }

  return {
    roles, disciplineNames, employees, users, projects, activeProject, disciplines, assignments,
    planningWeeks, allocations, deliverables, costs, risks, approvals, changes, milestones,
    documents, notifications, portfolioKPIs,
    employeeById, projectById, projectByCode, deliverableById, changeById, approvalById,
  };
})();
