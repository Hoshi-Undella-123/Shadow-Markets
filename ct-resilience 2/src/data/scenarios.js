export const SCENARIOS = {
  normal: {
    id: "normal", label: "Normal Operations",
    color: "#5A7AA0", icon: "🌐",
    description: "Baseline ecosystem view. Node size = budget. Color = org type.",
  },
  ice_raid: {
    id: "ice_raid", label: "ICE Enforcement Action",
    color: "#EF4444", icon: "🚨",
    description: "THIS IS HAPPENING NOW. ICE arrested 405 people in CT Jan–July 2025, up 134% from 2024. Hartford (127), Danbury (65 in one operation), Stamford (19), Waterbury (14), Bridgeport (12). 25% had no criminal charges beyond immigration status. 32 CT towns affected. Schools reporting enrollment drops due to fear.",
  },
  economic_crisis: {
    id: "economic_crisis", label: "Economic Crisis",
    color: "#F59E0B", icon: "📉",
    description: "Major recession/unemployment spike. Safety net systems overwhelmed.",
  },
  natural_disaster: {
    id: "natural_disaster", label: "Natural Disaster",
    color: "#3B82F6", icon: "🌪",
    description: "Hurricane, flood, or major storm. Mass displacement + infrastructure damage.",
  },
  pandemic: {
    id: "pandemic", label: "Public Health Emergency",
    color: "#8B5CF6", icon: "🏥",
    description: "Disease outbreak requiring community health coordination at scale.",
  },
};

export const DEMANDS = {
  ice_raid: {
    legal:         { v: 3000,      label: "~3,000 cases",   note: "~6K affected → ~3K need legal help" },
    shelter:       { v: 800,       label: "800 beds",        note: "Emergency family displacement" },
    food:          { v: 6000,      label: "6,000/day",       note: "14-day emergency food" },
    mentalHealth:  { v: 1500,      label: "1,500 sessions",  note: "Trauma + crisis counseling" },
    financialAid:  { v: 8_000_000, label: "$8M",             note: "Bail, legal fees, emergency aid" },
    communications:{ v: 120000,    label: "120K people",     note: "KYR alert to all at-risk" },
  },
  economic_crisis: {
    legal:         { v: 5000,       label: "5,000 cases",    note: "Housing, employment, benefits" },
    shelter:       { v: 2000,       label: "2,000 beds",     note: "Eviction + emergency housing" },
    food:          { v: 50000,      label: "50K/day",        note: "Expanded food assistance" },
    mentalHealth:  { v: 5000,       label: "5,000 sessions", note: "Job loss, financial stress" },
    financialAid:  { v: 20_000_000, label: "$20M",           note: "Emergency relief grants" },
    communications:{ v: 300000,     label: "300K people",    note: "Resource navigation" },
  },
  natural_disaster: {
    legal:         { v: 500,        label: "500 cases",      note: "Insurance, housing rights" },
    shelter:       { v: 3000,       label: "3,000 beds",     note: "Displaced families" },
    food:          { v: 20000,      label: "20K/day",        note: "72-hr emergency food" },
    mentalHealth:  { v: 2000,       label: "2,000 sessions", note: "Disaster trauma" },
    financialAid:  { v: 15_000_000, label: "$15M",           note: "Disaster relief" },
    communications:{ v: 500000,     label: "500K people",    note: "Emergency alerts + resource nav" },
  },
  pandemic: {
    legal:         { v: 1000,       label: "1,000 cases",    note: "Benefits, housing, workplace" },
    shelter:       { v: 500,        label: "500 beds",        note: "Quarantine + displacement" },
    food:          { v: 100000,     label: "100K/day",       note: "Expanded distribution" },
    mentalHealth:  { v: 10000,      label: "10,000 sessions",note: "Isolation + grief" },
    financialAid:  { v: 30_000_000, label: "$30M",           note: "Small biz + personal aid" },
    communications:{ v: 1_000_000,  label: "1M people",      note: "Public health information" },
  },
};

// Rough supply normalization factors per resource type
export const SUPPLY_NORM = {
  financialAid:   1,      // direct dollar comparison
  legal:          0.03,   // % capacity → cases (crude proxy)
  shelter:        0.009,
  food:           0.03,
  mentalHealth:   0.03,
  communications: 0.03,
};

export const computeGaps = (scenario, orgs) => {
  if (!DEMANDS[scenario]) return null;
  const supply = { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:0 };
  let committedCount = 0;

  orgs.forEach(org => {
    const c = org.scenarioCommitments?.[scenario];
    if (!c?.committed) return;
    committedCount++;
    ["legal","shelter","food","mentalHealth","communications"].forEach(k => {
      if (c[k]) supply[k] += c[k];
    });
    if (c.financialAid) supply.financialAid += c.financialAid;
  });

  const dem = DEMANDS[scenario];

  // Coverage calculation calibrated to CT real capacity:
  // Legal: sum of % scores / 100 × 4 attorneys avg per org × 25 crisis cases each
  //   → 36% for ice_raid = accurate (only ~40 nonprofit attorneys statewide)
  // Shelter: sum of bed-% / 100 × 24 beds per org avg (small orgs)
  //   → shelter scores represent % of capacity, each org ~24 beds on avg
  // Food: sum of food-% / 100 × 1500 meals/day (conservative for large food banks)
  //   → CT Food Bank + Foodshare combined = 50M lbs/yr = ~137K meals/day at surge
  //   So normalize downward: 1 unit food% = ~500 meals/day
  // MH: sum of MH-% / 100 × 20 sessions/month per org
  // Comms: sum of comms-% / 100 × 8000 people reached per org
  const legalSupplyEst   = (supply.legal / 100) * 25 * 4;
  const shelterSupplyEst = (supply.shelter / 100) * 24;
  const foodSupplyEst    = (supply.food / 100) * 500;
  const mhSupplyEst      = (supply.mentalHealth / 100) * 20;
  const commsSupplyEst   = (supply.communications / 100) * 8000;

  const coverage = {
    financialAid:   Math.min(100, Math.round((supply.financialAid / dem.financialAid.v) * 100)),
    legal:          Math.min(100, Math.round((legalSupplyEst / dem.legal.v) * 100)),
    shelter:        Math.min(100, Math.round((shelterSupplyEst / dem.shelter.v) * 100)),
    food:           Math.min(100, Math.round((foodSupplyEst / dem.food.v) * 100)),
    mentalHealth:   Math.min(100, Math.round((mhSupplyEst / dem.mentalHealth.v) * 100)),
    communications: Math.min(100, Math.round((commsSupplyEst / dem.communications.v) * 100)),
  };

  return { coverage, committedCount, total: orgs.length };
};

export const SCENARIO_GAPS = {
  ice_raid: [
    "GEOGRAPHIC GAP: Middlesex, New London, Tolland, Windham, Litchfield counties have near-zero dedicated immigrant services orgs",
    "FINANCIAL GAP: Immigration bonds ($1,500–$25K each) will exhaust CT Bail Fund within days at scale — needs $2–5M emergency capital",
    "MENTAL HEALTH SURGE: Even with 7 MH orgs committed, trauma counseling capacity meets only ~40% of projected 1,500-session need",
    "LEGAL ATTORNEY SHORTAGE: ~40 nonprofit immigration attorneys statewide — need emergency funding to bring 40 more to 80 total for 90-day surge",
    "SHELTER FOR FAMILIES: Only 290 surge beds available statewide vs 800 projected need — gap of 510 beds with no committed org to fill it",
    "RURAL CT BLIND SPOT: Catholic Charities (163 parishes) is only org with statewide rural reach — single point of failure",
    "COORDINATION INFRASTRUCTURE: No pre-existing CT-wide incident command structure for immigration emergency — CIRA alert fills comms gap but no ops center",
  ],
  economic_crisis: [
    "Affordable housing surge capacity insufficient — CT has 3-year homelessness growth trend, shelters already full",
    "Mental health system statewide at near-capacity baseline — economic stress would overwhelm existing capacity",
    "Workforce development and job placement infrastructure not yet mapped in this network",
    "Small business support gap — no CDFI or small business lender in current network",
  ],
  natural_disaster: [
    "Shelter beds inadequate for major mass-displacement event (2,400 statewide at 88% occupancy = only 290 surge)",
    "Eastern CT (Windham, Tolland, New London) critically under-resourced — no major orgs mapped there",
    "No statewide shelter surge coordination protocol — CCEH would coordinate but needs pre-established relationships",
    "Coastal flooding risk (Fairfield, New Haven counties) with concentration of immigrant population = compound vulnerability",
  ],
  pandemic: [
    "Mental health demand in pandemic (10,000+ sessions) far exceeds even expanded 7-org MH network capacity",
    "Food distribution at 100K meals/day requires multi-fold surge across Foodshare + CT Food Bank + 1,100 partners",
    "FQHC network (CHC, Charter Oak, Clifford Beers) serves all regardless of status — critical but underfunded",
    "Rural CT has minimal FQHC access — large unserved population in Litchfield, Windham, New London counties",
  ],
};

// Counties with NO mapped orgs — critical geographic gaps
export const GEOGRAPHIC_GAPS = [
  { county: "New London",  risk: "high",   note: "~6K undocumented. No legal, shelter, or food org mapped. Norwich/New London cities underserved." },
  { county: "Tolland",     risk: "medium", note: "~3K undocumented. Only UConn area. Catholic Charities is only reach." },
  { county: "Windham",     risk: "high",   note: "~4K undocumented. Willimantic has large Latino population. CT Legal has Willimantic office." },
  { county: "Litchfield",  risk: "medium", note: "~3K undocumented. Torrington area. No dedicated immigrant org." },
  { county: "Middlesex",   risk: "low",    note: "Only CHC mapped. Middletown has growing immigrant community." },
];
