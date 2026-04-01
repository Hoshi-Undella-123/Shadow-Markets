export const ORGS = [
  // ── FOUNDATIONS ──────────────────────────────────────────────────────────
  {
    id: "ccp", name: "CT Council for Philanthropy", shortName: "CCP",
    type: "foundation", county: "Hartford", lat: 41.765, lng: -72.674,
    budget: 2_000_000, website: "ctphilanthropy.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:200000, communications:90 },
    elasticity: { financialAid:0.4, communications:0.6 },
    trustScore: 95, dataSource: "Website + 990",
    connections: ["hartford_fdn","fairfield_fdn","new_haven_fdn","iris","cira","make_road","aclu_ct","oia","ccf"],
    description: "Association of 130+ CT grantmakers. $2.3B annual philanthropic giving across CT. Primary convener of funder community.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Lead Coordinator",            responseTime:"24–48 hrs",  financialAid:350000, communications:95,
        notes:"Activate 130+ member funder network. Coordinate emergency rapid-response grants. Convene funders call within 24 hrs." },
      economic_crisis:  { committed:true,  role:"Funder Coordinator",          responseTime:"1 week",     financialAid:500000,
        notes:"Convene funders, identify safety net gaps." },
      natural_disaster: { committed:true,  role:"Funder Coordinator",          responseTime:"48 hrs",     financialAid:400000,
        notes:"Rapid member coordination, match emergency grants." },
      pandemic:         { committed:true,  role:"Funder Coordinator",          responseTime:"48 hrs",     financialAid:600000,
        notes:"Coordinate member pandemic response giving." },
    },
  },
  {
    id: "hartford_fdn", name: "Hartford Foundation for Public Giving", shortName: "Hartford Fdn",
    type: "foundation", county: "Hartford", lat: 41.763, lng: -72.685,
    budget: 85_000_000, website: "hfpg.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:8_500_000, communications:70 },
    elasticity: { financialAid:0.25, communications:0.4 },
    trustScore: 97, dataSource: "990 + Annual Report",
    connections: ["ccp","iris","ct_legal","columbus_house","foodshare","mental_health_ct","catholic_charities","aclu_ct","chc","cira"],
    description: "Largest CT community foundation. $900M+ assets. $8.5M annual grants. Greater Hartford region. Has emergency grants protocol.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Funder – Hartford Region", responseTime:"72 hrs",   financialAid:2_000_000,
        notes:"Emergency grants fund active. 48-hr rapid protocol established. Covers Hartford, Tolland, Windham counties." },
      economic_crisis:  { committed:true,  role:"Safety Net Funder",  responseTime:"1 week",  financialAid:3_000_000 },
      natural_disaster: { committed:true,  role:"Emergency Funder",   responseTime:"48 hrs",  financialAid:2_000_000 },
      pandemic:         { committed:true,  role:"Health Equity Funder",responseTime:"48 hrs", financialAid:4_000_000,
        notes:"COVID precedent – proven rapid deployment capability." },
    },
  },
  {
    id: "fairfield_fdn", name: "Fairfield County's Community Foundation", shortName: "Fairfield Fdn",
    type: "foundation", county: "Fairfield", lat: 41.117, lng: -73.408,
    budget: 60_000_000, website: "fccfoundation.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:6_000_000, communications:65 },
    elasticity: { financialAid:0.2, communications:0.35 },
    trustScore: 95, dataSource: "990 + Annual Report",
    connections: ["ccp","make_road","int_institute","cira","ct_food_bank"],
    description: "$800M assets. Strong immigrant services portfolio. Covers Fairfield County: Bridgeport, Stamford, Norwalk.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Funder – Fairfield County", responseTime:"72 hrs",  financialAid:1_500_000,
        notes:"~40K undocumented in Fairfield County. Existing grantees: Make the Road, IICT." },
      economic_crisis:  { committed:true,  role:"Safety Net Funder",  responseTime:"1 week",  financialAid:2_000_000 },
      natural_disaster: { committed:true,  role:"Emergency Funder",   responseTime:"48 hrs",  financialAid:1_500_000 },
      pandemic:         { committed:true,  role:"Health Equity Funder",responseTime:"48 hrs", financialAid:2_500_000 },
    },
  },
  {
    id: "new_haven_fdn", name: "Community Foundation for Greater New Haven", shortName: "New Haven Fdn",
    type: "foundation", county: "New Haven", lat: 41.308, lng: -72.928,
    budget: 40_000_000, website: "cfgnh.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:4_000_000, communications:60 },
    elasticity: { financialAid:0.3, communications:0.4 },
    trustScore: 94, dataSource: "990 + Website",
    connections: ["ccp","iris","nhla","ct_legal","yale_legal","columbus_house","ct_food_bank"],
    description: "$450M assets. Covers Greater New Haven. Deep ties to IRIS and NHLA. Proven emergency fund activation.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Funder – New Haven Region", responseTime:"48–72 hrs", financialAid:1_200_000,
        notes:"Close partner with IRIS and NHLA. Emergency fund activation precedent exists." },
      economic_crisis:  { committed:true,  role:"Safety Net Funder",  responseTime:"1 week",  financialAid:1_500_000 },
      natural_disaster: { committed:true,  role:"Emergency Funder",   responseTime:"48 hrs",  financialAid:1_000_000 },
      pandemic:         { committed:true,  role:"Health Equity Funder",responseTime:"48 hrs", financialAid:2_000_000 },
    },
  },
  {
    id: "ccf", name: "Connecticut Community Foundation", shortName: "CT Comm Fdn",
    type: "foundation", county: "New Haven", lat: 41.559, lng: -73.051,
    budget: 25_000_000, website: "conncf.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:2_500_000, communications:50 },
    elasticity: { financialAid:0.2, communications:0.3 },
    trustScore: 90, dataSource: "990",
    connections: ["ccp","ct_food_bank","chc"],
    description: "$300M assets. Waterbury/Naugatuck Valley region. ⚠ KEY GAP: Limited immigrant services portfolio.",
    scenarioCommitments: {
      ice_raid:         { committed:false, role:"Funder – Naugatuck Valley (GAP)", responseTime:"1–2 wks", financialAid:500000,
        notes:"⚠ GAP: Limited immigrant-specific grantees in Waterbury area. Needs new relationships to respond effectively." },
      economic_crisis:  { committed:true,  role:"Safety Net Funder",  responseTime:"1 week",  financialAid:1_000_000 },
      natural_disaster: { committed:true,  role:"Emergency Funder",   responseTime:"72 hrs",  financialAid:750000 },
      pandemic:         { committed:true,  role:"Health Funder",      responseTime:"72 hrs",  financialAid:1_500_000 },
    },
  },
  // ── LEGAL ─────────────────────────────────────────────────────────────────
  {
    id: "iris", name: "IRIS – Integrated Refugee & Immigrant Services", shortName: "IRIS",
    type: "legal", county: "New Haven", lat: 41.314, lng: -72.923,
    budget: 15_000_000, website: "irisct.org",
    resources: { legal:85, shelter:40, food:30, mentalHealth:30, financialAid:500000, communications:60 },
    elasticity: { legal:0.3, shelter:0.2, financialAid:0.4 },
    trustScore: 98, dataSource: "990 + Website + Field",
    connections: ["new_haven_fdn","ccp","nhla","yale_legal","ct_legal","hartford_fdn","foodshare","catholic_charities"],
    description: "30+ year institution. 2,500+ immigrants/refugees annually. Full wraparound: legal, housing, employment, education, health.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Lead Response Hub – New Haven",  responseTime:"2 hrs",   legal:120, shelter:60, mentalHealth:50, financialAid:750000, communications:80,
        notes:"KYR materials in 12 languages. Rapid response team deploys in 2 hrs. Emergency funding needed to fully surge attorney capacity." },
      economic_crisis:  { committed:true,  role:"Wraparound Services Hub",        responseTime:"24 hrs",  notes:"Job nav, benefits, legal, emergency assistance." },
      natural_disaster: { committed:true,  role:"Immigrant Support Hub",          responseTime:"4 hrs" },
      pandemic:         { committed:true,  role:"Health Navigation Hub",          responseTime:"24 hrs" },
    },
  },
  {
    id: "ct_legal", name: "Connecticut Legal Services", shortName: "CT Legal Svcs",
    type: "legal", county: "New Haven", lat: 41.310, lng: -72.930,
    budget: 8_000_000, website: "ctlegal.org",
    resources: { legal:75, shelter:0, food:0, mentalHealth:0, financialAid:100000, communications:40 },
    elasticity: { legal:0.2 },
    trustScore: 96, dataSource: "990 + Website",
    connections: ["iris","new_haven_fdn","nhla","hartford_fdn","aclu_ct","ccp"],
    description: "Statewide civil legal aid. Immigration unit active. 4 offices: New Haven, Middletown, Waterbury, Willimantic.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal Defense – Statewide", responseTime:"4–8 hrs", legal:90,
        notes:"Offices in 4 cities. Emergency funding needed to scale attorney hours." },
      economic_crisis:  { committed:true,  role:"Civil Legal Aid",      responseTime:"24 hrs",  legal:90 },
      natural_disaster: { committed:true,  role:"Disaster Legal Aid",   responseTime:"24 hrs",  legal:80 },
      pandemic:         { committed:true,  role:"Benefits Navigation",  responseTime:"24 hrs",  legal:80 },
    },
  },
  {
    id: "nhla", name: "New Haven Legal Assistance", shortName: "NHLA",
    type: "legal", county: "New Haven", lat: 41.305, lng: -72.926,
    budget: 5_000_000, website: "nhla.com",
    resources: { legal:70, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:30 },
    elasticity: { legal:0.15 },
    trustScore: 94, dataSource: "990",
    connections: ["iris","ct_legal","new_haven_fdn","yale_legal"],
    description: "Civil legal aid for New Haven County. Strong immigration practice. Yale Law partnership.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal Defense – New Haven County", responseTime:"4 hrs", legal:80,
        notes:"Partners with Yale Law. Emergency intake protocol exists." },
      economic_crisis:  { committed:true,  role:"Civil Legal Aid",      responseTime:"24 hrs",  legal:80 },
      natural_disaster: { committed:true,  role:"Disaster Legal",       responseTime:"24 hrs",  legal:70 },
      pandemic:         { committed:true,  role:"Benefits/Housing Legal",responseTime:"24 hrs", legal:75 },
    },
  },
  {
    id: "yale_legal", name: "Yale Law Immigration Clinic", shortName: "Yale Law Clinic",
    type: "legal", county: "New Haven", lat: 41.311, lng: -72.934,
    budget: 3_000_000, website: "law.yale.edu",
    resources: { legal:60, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:25 },
    elasticity: { legal:0.4 },
    trustScore: 88, dataSource: "Website",
    connections: ["nhla","iris","new_haven_fdn","ct_legal"],
    description: "Yale Law Immigration Clinic. Student surge capacity. Experienced supervising attorneys. Academic calendar matters.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal Defense + KYR Training", responseTime:"24 hrs", legal:100,
        notes:"Student surge capacity. KYR workshops across New Haven. Note: academic calendar affects peak availability." },
      economic_crisis:  { committed:false, role:"Limited Support",              responseTime:"1 week" },
      natural_disaster: { committed:false, role:"Limited Support",              responseTime:"1 week" },
      pandemic:         { committed:false, role:"Health Law Support",           responseTime:"1 week" },
    },
  },
  {
    id: "aclu_ct", name: "ACLU of Connecticut", shortName: "ACLU CT",
    type: "legal", county: "Hartford", lat: 41.762, lng: -72.678,
    budget: 6_000_000, website: "acluct.org",
    resources: { legal:80, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:85 },
    elasticity: { legal:0.2, communications:0.4 },
    trustScore: 96, dataSource: "990 + Website",
    connections: ["ct_legal","make_road","cira","hartford_fdn","nhla"],
    description: "Civil liberties advocacy + litigation. Emergency injunctions. Legal observer network. Strong media presence.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Litigation + Media + Legal Observers", responseTime:"2–4 hrs", legal:90, communications:90,
        notes:"Emergency injunctions for rights violations. Coordinates legal observer network at enforcement sites. Policy advocacy to Governor." },
      economic_crisis:  { committed:true,  role:"Policy + Litigation",   responseTime:"24 hrs",  legal:80, communications:75 },
      natural_disaster: { committed:true,  role:"Rights Protection",     responseTime:"24 hrs",  legal:70, communications:70 },
      pandemic:         { committed:true,  role:"Rights Protection",     responseTime:"24 hrs",  legal:80, communications:80 },
    },
  },
  // ── ADVOCACY ──────────────────────────────────────────────────────────────
  {
    id: "make_road", name: "Make the Road Connecticut", shortName: "Make the Road CT",
    type: "advocacy", county: "Fairfield", lat: 41.178, lng: -73.196,
    budget: 4_000_000, website: "maketheroadct.org",
    resources: { legal:50, shelter:20, food:20, mentalHealth:20, financialAid:100000, communications:90 },
    elasticity: { legal:0.3, communications:0.5, financialAid:0.3 },
    trustScore: 92, dataSource: "990 + Website",
    connections: ["fairfield_fdn","cira","int_institute","aclu_ct","ccp"],
    description: "Membership-based immigrant rights org. Bridgeport HQ + Hartford chapter. 5,000+ members. Rapid response hotline.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Rapid Response + Comms – Bridgeport/SW CT", responseTime:"1–2 hrs",
        legal:70, communications:95, financialAid:150000,
        notes:"Rapid response hotline ACTIVE. KYR in Spanish/English. Bridgeport + Stamford primary. 5,000+ member network." },
      economic_crisis:  { committed:true,  role:"Advocacy + Services",  responseTime:"24 hrs",  communications:80 },
      natural_disaster: { committed:true,  role:"Community Response",   responseTime:"4 hrs",   communications:85 },
      pandemic:         { committed:true,  role:"Community Health",     responseTime:"24 hrs",  communications:85 },
    },
  },
  {
    id: "cira", name: "CT Immigrant Rights Alliance", shortName: "CIRA",
    type: "advocacy", county: "Hartford", lat: 41.757, lng: -72.679,
    budget: 800_000, website: "ctimmigrantrights.org",
    resources: { legal:30, shelter:0, food:0, mentalHealth:0, financialAid:50000, communications:95 },
    elasticity: { communications:0.7, legal:0.3 },
    trustScore: 85, dataSource: "Website",
    connections: ["make_road","aclu_ct","hartford_fdn","ccp","oia"],
    description: "Statewide coalition of 50+ immigrant rights orgs. PRIMARY rapid-alert coordinator. Alert network reaches 120K+ in under 1 hr.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"STATEWIDE COORDINATOR + Alert Network", responseTime:"30 min",
        communications:100, financialAid:75000,
        notes:"Coalition of 50+ orgs. Alert tree reaches 120K+ residents in under 1 hr. Coordinator role only – limited direct services." },
      economic_crisis:  { committed:true,  role:"Advocacy + Coordination",  responseTime:"24 hrs",  communications:90 },
      natural_disaster: { committed:true,  role:"Communications",            responseTime:"1 hr",    communications:90 },
      pandemic:         { committed:true,  role:"Community Alerts",          responseTime:"1 hr",    communications:90 },
    },
  },
  {
    id: "int_institute", name: "International Institute of CT", shortName: "Intl Institute CT",
    type: "legal", county: "Fairfield", lat: 41.182, lng: -73.194,
    budget: 3_500_000, website: "iict.org",
    resources: { legal:60, shelter:30, food:25, mentalHealth:20, financialAid:200000, communications:40 },
    elasticity: { legal:0.2, shelter:0.3 },
    trustScore: 88, dataSource: "Website",
    connections: ["fairfield_fdn","make_road","cira","ct_food_bank"],
    description: "Bridgeport-based. 100+ years serving immigrants. Resettlement agency with housing. SW Connecticut anchor.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Response Hub – Bridgeport/SW CT", responseTime:"4–8 hrs",
        legal:70, shelter:50, financialAid:300000,
        notes:"Emergency shelter for displaced families. 100+ year history serving immigrants." },
      economic_crisis:  { committed:true,  role:"Wraparound Services",  responseTime:"24 hrs" },
      natural_disaster: { committed:true,  role:"Immigrant Support",    responseTime:"8 hrs",   shelter:60, food:50 },
      pandemic:         { committed:true,  role:"Health Navigation",    responseTime:"24 hrs" },
    },
  },
  // ── SHELTER ───────────────────────────────────────────────────────────────
  {
    id: "columbus_house", name: "Columbus House", shortName: "Columbus House",
    type: "shelter", county: "New Haven", lat: 41.306, lng: -72.927,
    budget: 12_000_000, website: "columbushouse.org",
    resources: { legal:0, shelter:90, food:60, mentalHealth:40, financialAid:0, communications:30 },
    elasticity: { shelter:0.1, food:0.2 },
    trustScore: 92, dataSource: "990",
    connections: ["new_haven_fdn","iris","foodshare","ct_food_bank","chc"],
    description: "127 shelter beds in New Haven. Near full capacity. Food + mental health services.",
    scenarioCommitments: {
      ice_raid:         { committed:false, role:"Emergency Shelter – New Haven (GAP)", responseTime:"4–8 hrs", shelter:95, food:75,
        notes:"⚠ UNCOMMITTED: 127 beds ~85% full. Emergency overflow possible with advance notice + funding. Needs relationship-building with immigrant orgs." },
      economic_crisis:  { committed:true,  role:"Primary Shelter",   responseTime:"24 hrs",  shelter:100, food:80 },
      natural_disaster: { committed:true,  role:"Emergency Shelter", responseTime:"4 hrs",   shelter:110, food:90 },
      pandemic:         { committed:true,  role:"Shelter + Health",  responseTime:"24 hrs",  shelter:90,  mentalHealth:50 },
    },
  },
  {
    id: "mutual_housing", name: "Mutual Housing – Greater Hartford", shortName: "Mutual Housing",
    type: "shelter", county: "Hartford", lat: 41.768, lng: -72.680,
    budget: 8_000_000, website: "mutualhousing.org",
    resources: { legal:0, shelter:70, food:20, mentalHealth:0, financialAid:0, communications:20 },
    elasticity: { shelter:0.05 },
    trustScore: 82, dataSource: "990",
    connections: ["hartford_fdn","ct_legal"],
    description: "Greater Hartford affordable housing. Long-term focus. Very limited emergency surge capacity.",
    scenarioCommitments: {
      ice_raid:         { committed:false, role:"Housing – Hartford (Limited)", responseTime:"1+ wks", shelter:70,
        notes:"⚠ Long-term affordable housing only. 1+ week advance notice required. Not suited for rapid ICE response." },
      economic_crisis:  { committed:true,  role:"Affordable Housing",  responseTime:"1 month", shelter:80 },
      natural_disaster: { committed:false, role:"Temporary Housing",   responseTime:"1 week",  shelter:75 },
      pandemic:         { committed:true,  role:"Housing Stability",   responseTime:"1 week",  shelter:70 },
    },
  },
  // ── FOOD ──────────────────────────────────────────────────────────────────
  {
    id: "foodshare", name: "Foodshare", shortName: "Foodshare",
    type: "food", county: "Hartford", lat: 41.800, lng: -72.650,
    budget: 18_000_000, website: "foodshare.com",
    resources: { legal:0, shelter:0, food:95, mentalHealth:0, financialAid:0, communications:30 },
    elasticity: { food:0.4 },
    trustScore: 95, dataSource: "990 + Website",
    connections: ["hartford_fdn","ccp","ct_food_bank","columbus_house","catholic_charities","iris"],
    description: "Regional food bank. 28M lbs/year. 500+ partner agencies. Northern CT. Mobile distribution.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Food Distribution – Northern CT", responseTime:"24 hrs", food:130,
        notes:"28M lbs/year. 40%+ surge capacity. Mobile distribution can target neighborhoods." },
      economic_crisis:  { committed:true,  role:"Expanded Food Distribution",     responseTime:"24 hrs", food:150 },
      natural_disaster: { committed:true,  role:"Emergency Food",                 responseTime:"12 hrs", food:160 },
      pandemic:         { committed:true,  role:"Food Distribution",              responseTime:"24 hrs", food:150 },
    },
  },
  {
    id: "ct_food_bank", name: "Connecticut Food Bank", shortName: "CT Food Bank",
    type: "food", county: "New Haven", lat: 41.313, lng: -72.913,
    budget: 20_000_000, website: "ctfoodbank.org",
    resources: { legal:0, shelter:0, food:95, mentalHealth:0, financialAid:0, communications:30 },
    elasticity: { food:0.5 },
    trustScore: 95, dataSource: "990",
    connections: ["new_haven_fdn","ccf","fairfield_fdn","foodshare","int_institute","columbus_house"],
    description: "Southern CT food bank. 22M lbs/year. 600+ partner orgs. New Haven, Fairfield, Middlesex, New London, Litchfield.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Food Distribution – Southern CT", responseTime:"24 hrs", food:140,
        notes:"22M lbs/year. 50%+ surge capacity." },
      economic_crisis:  { committed:true,  role:"Food Distribution",  responseTime:"24 hrs", food:150 },
      natural_disaster: { committed:true,  role:"Emergency Food",     responseTime:"12 hrs", food:160 },
      pandemic:         { committed:true,  role:"Food Distribution",  responseTime:"24 hrs", food:150 },
    },
  },
  // ── MENTAL HEALTH ─────────────────────────────────────────────────────────
  {
    id: "mental_health_ct", name: "Mental Health Connecticut", shortName: "Mental Health CT",
    type: "mentalHealth", county: "Hartford", lat: 41.769, lng: -72.686,
    budget: 10_000_000, website: "mhconn.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:80, financialAid:0, communications:40 },
    elasticity: { mentalHealth:0.15 },
    trustScore: 88, dataSource: "990",
    connections: ["hartford_fdn","ccp","iris","chc","catholic_charities"],
    description: "Statewide mental health. Trauma-informed care. Spanish-speaking staff.",
    scenarioCommitments: {
      ice_raid:         { committed:false, role:"Mental Health – Hartford (GAP)", responseTime:"24–48 hrs", mentalHealth:85,
        notes:"⚠ UNCOMMITTED: Trauma-informed care teams available. Needs additional funding + new partnerships to deploy community MH teams." },
      economic_crisis:  { committed:true,  role:"Mental Health Services",  responseTime:"24 hrs",  mentalHealth:90 },
      natural_disaster: { committed:true,  role:"Crisis Counseling",       responseTime:"8 hrs",   mentalHealth:95 },
      pandemic:         { committed:true,  role:"Mental Health",           responseTime:"24 hrs",  mentalHealth:90 },
    },
  },
  {
    id: "chc", name: "Community Health Center (Middletown)", shortName: "CHC",
    type: "mentalHealth", county: "Middlesex", lat: 41.562, lng: -72.650,
    budget: 30_000_000, website: "chc1.com",
    resources: { legal:0, shelter:0, food:20, mentalHealth:75, financialAid:0, communications:30 },
    elasticity: { mentalHealth:0.25 },
    trustScore: 90, dataSource: "990",
    connections: ["hartford_fdn","new_haven_fdn","columbus_house","ccf"],
    description: "FQHC – serves ALL regardless of immigration status. 150K patients/year. Crisis counseling. Middletown + satellites.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Health + Mental Health – Central CT", responseTime:"24 hrs", mentalHealth:90, food:30,
        notes:"FQHC – serves ALL regardless of status. Crisis counseling. 150K patients/year." },
      economic_crisis:  { committed:true,  role:"Health Safety Net",     responseTime:"24 hrs",  mentalHealth:90 },
      natural_disaster: { committed:true,  role:"Health Response",       responseTime:"8 hrs",   mentalHealth:85 },
      pandemic:         { committed:true,  role:"Primary Health Response",responseTime:"8 hrs",  mentalHealth:90 },
    },
  },
  // ── FAITH ─────────────────────────────────────────────────────────────────
  {
    id: "catholic_charities", name: "Catholic Charities – Archdiocese of Hartford", shortName: "Catholic Charities",
    type: "faith", county: "Hartford", lat: 41.764, lng: -72.688,
    budget: 25_000_000, website: "ccaoh.org",
    resources: { legal:40, shelter:60, food:70, mentalHealth:40, financialAid:500000, communications:50 },
    elasticity: { shelter:0.3, food:0.3, financialAid:0.4, legal:0.2 },
    trustScore: 88, dataSource: "990 + Website",
    connections: ["hartford_fdn","ccp","iris","foodshare","mental_health_ct","ct_legal"],
    description: "163 parishes across CT. Immigration services, food, shelter, emergency funds. Sanctuary church network. Broadest geographic reach.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Multi-Resource – Statewide via 163 parishes", responseTime:"4–8 hrs",
        shelter:80, food:80, financialAid:800000, legal:50,
        notes:"163 parishes = broadest geographic reach. Sanctuary church network active. Rural CT coverage others lack." },
      economic_crisis:  { committed:true,  role:"Multi-Resource Response",  responseTime:"8 hrs",  shelter:70,  food:80,  financialAid:600000 },
      natural_disaster: { committed:true,  role:"Emergency Response",       responseTime:"4 hrs",  shelter:85,  food:85 },
      pandemic:         { committed:true,  role:"Health + Services",        responseTime:"8 hrs",  food:80,     mentalHealth:50 },
    },
  },
  // ── GOVERNMENT ────────────────────────────────────────────────────────────
  {
    id: "oia", name: "CT Office of Immigrant Affairs", shortName: "CT Immigrant Affairs",
    type: "government", county: "Hartford", lat: 41.764, lng: -72.675,
    budget: 2_000_000, website: "portal.ct.gov/oia",
    resources: { legal:30, shelter:0, food:0, mentalHealth:0, financialAid:100000, communications:70 },
    elasticity: { communications:0.4, legal:0.2, financialAid:0.3 },
    trustScore: 75, dataSource: "State website",
    connections: ["ccp","cira","iris","ct_legal","aclu_ct","make_road"],
    description: "CT State office. CT TRUST Act limits ICE cooperation. Policy + coordination. Connects to Governor's office. No direct services.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Policy + State Coordination", responseTime:"4–8 hrs", communications:80, financialAid:200000,
        notes:"CT TRUST Act limits state/local ICE cooperation. Issues guidance to municipalities. Emergency immigrant fund activation possible." },
      economic_crisis:  { committed:true,  role:"Policy + Navigation",   responseTime:"24 hrs",  communications:70 },
      natural_disaster: { committed:true,  role:"State Coordination",    responseTime:"4 hrs",   communications:75 },
      pandemic:         { committed:true,  role:"Policy Coordination",   responseTime:"24 hrs",  communications:70 },
    },
  },
];


// ── ADDITIONAL ORGS (expanding coverage) ────────────────────────────────────
// These are appended — imported via the same ORGS export above
ORGS.push(
  // ── LEGAL / IMMIGRATION ───────────────────────────────────────────────────
  {
    id: "ciri", name: "CT Institute for Refugees and Immigrants", shortName: "CIRI",
    type: "legal", county: "Fairfield", lat: 41.176, lng: -73.190,
    budget: 6_000_000, website: "cirict.org",
    resources: { legal:80, shelter:20, food:0, mentalHealth:20, financialAid:150000, communications:50 },
    elasticity: { legal:0.25, financialAid:0.3 },
    trustScore: 94, dataSource: "Website + DOJ Recognition",
    connections: ["fairfield_fdn","make_road","int_institute","ct_legal","cira","hartford_fdn"],
    description: "Est. 1918. Only statewide DOJ-recognized nonprofit for immigration services. 4 offices: Stamford, Bridgeport, Waterbury, Hartford. BIA-accredited reps.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Immigration Legal – Statewide (4 offices)", responseTime:"4–8 hrs",
        legal:95, financialAid:200000,
        notes:"DOJ & BIA recognized. 4 offices = Stamford, Bridgeport, Waterbury, Hartford. KYR training. Can provide emergency immigration counseling statewide." },
      economic_crisis:  { committed:true,  role:"Immigration Legal",  responseTime:"24 hrs",  legal:85 },
      natural_disaster: { committed:true,  role:"Immigrant Support",  responseTime:"8 hrs",   legal:70 },
      pandemic:         { committed:true,  role:"Immigration Legal",  responseTime:"24 hrs",  legal:75 },
    },
  },
  {
    id: "circ", name: "CT Immigrant & Refugee Coalition", shortName: "CIRC",
    type: "advocacy", county: "Hartford", lat: 41.760, lng: -72.682,
    budget: 600_000, website: "coalitionct.org",
    resources: { legal:20, shelter:0, food:0, mentalHealth:0, financialAid:30000, communications:85 },
    elasticity: { communications:0.6, legal:0.2 },
    trustScore: 82, dataSource: "Website",
    connections: ["cira","make_road","aclu_ct","oia","ccp"],
    description: "Broad-based network of community orgs, religious & business groups, legal service providers. Hartford-based. Policy advocacy + community organizing.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Policy Advocacy + Community Organizing", responseTime:"2–4 hrs",
        communications:85,
        notes:"Coordinates statewide policy response. Racial profiling prohibition monitoring. Community organizing network. Complements CIRA's rapid alert role." },
      economic_crisis:  { committed:true,  role:"Policy Advocacy",    responseTime:"24 hrs",  communications:75 },
      natural_disaster: { committed:false, role:"Limited Support",    responseTime:"1 week" },
      pandemic:         { committed:true,  role:"Policy Advocacy",    responseTime:"24 hrs",  communications:70 },
    },
  },
  {
    id: "charter_oak", name: "Charter Oak Community Health Center", shortName: "Charter Oak CHC",
    type: "mentalHealth", county: "Hartford", lat: 41.755, lng: -72.695,
    budget: 12_000_000, website: "thecharteroak.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:70, financialAid:0, communications:25 },
    elasticity: { mentalHealth:0.2 },
    trustScore: 86, dataSource: "Website + HRSA",
    connections: ["hartford_fdn","chc","mental_health_ct","oia"],
    description: "FQHC in Hartford. Serves all regardless of immigration status. Mental health + primary care. Bilingual staff. Hartford-area anchor health org.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Health + Mental Health – Hartford", responseTime:"24 hrs",
        mentalHealth:85,
        notes:"FQHC — serves ALL regardless of status. No immigration screening. Bilingual staff. Crisis counseling. Hartford primary service area." },
      economic_crisis:  { committed:true,  role:"Health Safety Net",  responseTime:"24 hrs",  mentalHealth:85 },
      natural_disaster: { committed:true,  role:"Health Response",    responseTime:"8 hrs",   mentalHealth:80 },
      pandemic:         { committed:true,  role:"Primary Health",     responseTime:"8 hrs",   mentalHealth:85 },
    },
  },
  // ── SHELTER / HOUSING ─────────────────────────────────────────────────────
  {
    id: "cceh", name: "CT Coalition to End Homelessness", shortName: "CCEH",
    type: "shelter", county: "Hartford", lat: 41.766, lng: -72.677,
    budget: 5_000_000, website: "cceh.org",
    resources: { legal:0, shelter:60, food:20, mentalHealth:10, financialAid:0, communications:50 },
    elasticity: { shelter:0.2, communications:0.3 },
    trustScore: 88, dataSource: "990 + Website",
    connections: ["hartford_fdn","ccp","columbus_house","mutual_housing","foodshare"],
    description: "Statewide homeless services coalition. 100+ member shelter + housing orgs. Coordinates emergency shelter network. Tracks bed availability.",
    scenarioCommitments: {
      ice_raid:         { committed:false, role:"Shelter Network Coordinator (GAP)", responseTime:"48 hrs", shelter:70,
        notes:"⚠ Can activate member network for emergency shelter but has no direct immigrant-org relationships. Critical gap for ICE scenario — needs bridge-building with IRIS/CIRA." },
      economic_crisis:  { committed:true,  role:"Shelter Coordinator", responseTime:"24 hrs",  shelter:90 },
      natural_disaster: { committed:true,  role:"Emergency Shelter",   responseTime:"8 hrs",   shelter:100 },
      pandemic:         { committed:true,  role:"Shelter Safety Net",  responseTime:"24 hrs",  shelter:80 },
    },
  },
  {
    id: "south_park", name: "South Park Inn (Hartford)", shortName: "South Park Inn",
    type: "shelter", county: "Hartford", lat: 41.758, lng: -72.676,
    budget: 3_500_000, website: "southparkinn.org",
    resources: { legal:0, shelter:80, food:60, mentalHealth:20, financialAid:50000, communications:20 },
    elasticity: { shelter:0.15, food:0.2 },
    trustScore: 80, dataSource: "990",
    connections: ["hartford_fdn","cceh","foodshare","catholic_charities"],
    description: "Emergency shelter + transitional housing in Hartford. 75+ beds. Food program. Mental health partnerships. Serves Hartford's most vulnerable.",
    scenarioCommitments: {
      ice_raid:         { committed:false, role:"Emergency Shelter – Hartford (Potential)", responseTime:"4–8 hrs",
        shelter:85, food:70,
        notes:"Willing to provide emergency beds but needs funding + Spanish-language support. Not currently immigrant-connected. Warm handoff from Catholic Charities possible." },
      economic_crisis:  { committed:true,  role:"Emergency Shelter",   responseTime:"8 hrs",   shelter:90, food:75 },
      natural_disaster: { committed:true,  role:"Emergency Shelter",   responseTime:"4 hrs",   shelter:100, food:80 },
      pandemic:         { committed:true,  role:"Shelter",             responseTime:"8 hrs",   shelter:85 },
    },
  },
  // ── FOOD ──────────────────────────────────────────────────────────────────
  {
    id: "loaves_fishes", name: "Loaves & Fishes Ministries (New Haven)", shortName: "Loaves & Fishes",
    type: "food", county: "New Haven", lat: 41.310, lng: -72.920,
    budget: 1_200_000, website: "loavesandfishes-nh.org",
    resources: { legal:0, shelter:0, food:80, mentalHealth:0, financialAid:20000, communications:20 },
    elasticity: { food:0.3 },
    trustScore: 78, dataSource: "Website",
    connections: ["new_haven_fdn","ct_food_bank","columbus_house","iris"],
    description: "New Haven community meals program. Daily hot meals. No questions asked — serves all. 200+ meals/day baseline. Strong volunteer network.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Community Meals – New Haven", responseTime:"24 hrs",
        food:110,
        notes:"No questions asked — serves all regardless of status. Surge via volunteer mobilization. Proximity to IRIS for coordinated distribution." },
      economic_crisis:  { committed:true,  role:"Community Meals",    responseTime:"24 hrs",  food:130 },
      natural_disaster: { committed:true,  role:"Emergency Meals",    responseTime:"8 hrs",   food:140 },
      pandemic:         { committed:true,  role:"Meal Distribution",  responseTime:"24 hrs",  food:120 },
    },
  },
  {
    id: "end_hunger_ct", name: "End Hunger CT!", shortName: "End Hunger CT",
    type: "food", county: "Hartford", lat: 41.770, lng: -72.670,
    budget: 800_000, website: "endhungerct.org",
    resources: { legal:0, shelter:0, food:50, mentalHealth:0, financialAid:0, communications:70 },
    elasticity: { food:0.2, communications:0.5 },
    trustScore: 82, dataSource: "Website",
    connections: ["ccp","hartford_fdn","foodshare","ct_food_bank"],
    description: "Statewide food security advocacy + food bank coordination. Policy + direct food distribution. Coordinates among CT's network of food pantries.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Food Network Coordination", responseTime:"48 hrs",
        food:60, communications:75,
        notes:"Coordinates across 400+ food pantries. Can issue rapid guidance to member pantries to serve immigrants without documentation requirements." },
      economic_crisis:  { committed:true,  role:"Food Advocacy + Coord.",    responseTime:"24 hrs",  food:70, communications:80 },
      natural_disaster: { committed:true,  role:"Food Coordination",         responseTime:"24 hrs",  food:70 },
      pandemic:         { committed:true,  role:"Food Policy + Coord.",      responseTime:"24 hrs",  food:65, communications:75 },
    },
  },
  // ── ADVOCACY / COMMUNITY ──────────────────────────────────────────────────
  {
    id: "ct_voices", name: "Connecticut Voices for Children", shortName: "CT Voices",
    type: "advocacy", county: "New Haven", lat: 41.312, lng: -72.930,
    budget: 2_500_000, website: "ctvoicesforchildren.org",
    resources: { legal:20, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:80 },
    elasticity: { communications:0.4, legal:0.1 },
    trustScore: 88, dataSource: "990 + Website",
    connections: ["new_haven_fdn","ccp","aclu_ct","oia"],
    description: "Child & family policy advocacy. Data-driven research org. Immigrant children + families focus. Strong media and legislative presence.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Policy Advocacy + Child Impact Research", responseTime:"4–8 hrs",
        communications:85,
        notes:"Rapid research on child impact of enforcement. ~30% of CT children in immigrant families. Media + legislative advocacy. Data for funding appeals." },
      economic_crisis:  { committed:true,  role:"Child Policy Advocacy",  responseTime:"24 hrs",  communications:80 },
      natural_disaster: { committed:false, role:"Limited Support",        responseTime:"1 week" },
      pandemic:         { committed:true,  role:"Child Health Policy",    responseTime:"24 hrs",  communications:80 },
    },
  },
  {
    id: "unidad_latina", name: "Unidad Latina en Acción", shortName: "Unidad Latina",
    type: "advocacy", county: "New Haven", lat: 41.308, lng: -72.932,
    budget: 400_000, website: "unidadlatina.org",
    resources: { legal:40, shelter:10, food:10, mentalHealth:10, financialAid:30000, communications:85 },
    elasticity: { legal:0.4, communications:0.6, financialAid:0.4 },
    trustScore: 84, dataSource: "Website",
    connections: ["make_road","cira","iris","nhla","new_haven_fdn"],
    description: "New Haven-based immigrant rights org. Direct action, community organizing, legal support. Strong undocumented community ties. Deep trust in community.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Community Response + Legal Referrals – New Haven", responseTime:"1–2 hrs",
        legal:60, communications:90, financialAid:50000,
        notes:"Deep trust with undocumented community. Rapid mobilization. Know Your Rights workshops. Emergency hotline. Mutual aid network activation." },
      economic_crisis:  { committed:true,  role:"Community Response",  responseTime:"4 hrs",   communications:80 },
      natural_disaster: { committed:true,  role:"Community Response",  responseTime:"2 hrs",   communications:85 },
      pandemic:         { committed:true,  role:"Community Health",    responseTime:"4 hrs",   communications:80 },
    },
  },
  // ── FAITH / SANCTUARY ─────────────────────────────────────────────────────
  {
    id: "sanctuary_ct", name: "Sanctuary Connecticut", shortName: "Sanctuary CT",
    type: "faith", county: "Hartford", lat: 41.762, lng: -72.683,
    budget: 300_000, website: "sanctuaryct.org",
    resources: { legal:20, shelter:40, food:20, mentalHealth:0, financialAid:20000, communications:70 },
    elasticity: { shelter:0.6, communications:0.5, financialAid:0.3 },
    trustScore: 76, dataSource: "Website",
    connections: ["cira","make_road","catholic_charities","aclu_ct","iris"],
    description: "Interfaith sanctuary network. Physical sanctuary placement in churches. KYR training for congregations. Statewide faith community mobilization.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Physical Sanctuary + Faith Network Mobilization", responseTime:"2–4 hrs",
        shelter:60, communications:80, financialAid:30000,
        notes:"Can place individuals in physical sanctuary in partner churches. Interfaith network reaches congregations across CT. 24/7 sanctuary hotline. Faith community fundraising activation." },
      economic_crisis:  { committed:true,  role:"Faith Community Support",  responseTime:"8 hrs",  food:40, financialAid:25000 },
      natural_disaster: { committed:true,  role:"Shelter + Community",      responseTime:"4 hrs",  shelter:70, food:40 },
      pandemic:         { committed:true,  role:"Faith Community Support",  responseTime:"8 hrs",  food:40 },
    },
  },
  // ── GOVERNMENT / LEGAL OBSERVER ───────────────────────────────────────────
  {
    id: "ag_office", name: "CT Attorney General's Office", shortName: "AG Office",
    type: "government", county: "Hartford", lat: 41.763, lng: -72.671,
    budget: 50_000_000, website: "portal.ct.gov/ag",
    resources: { legal:90, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:80 },
    elasticity: { legal:0.1, communications:0.2 },
    trustScore: 85, dataSource: "State website",
    connections: ["oia","aclu_ct","cira","ct_legal"],
    description: "AG William Tong active on immigrant rights. Will challenge unlawful federal actions. Civil rights enforcement. Public KYR communications. CT TRUST Act enforcement.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal Challenges + Public Comms", responseTime:"2–4 hrs",
        legal:80, communications:85,
        notes:"AG Tong has been public about challenging unlawful ICE actions. Can issue guidance to local law enforcement. Emergency legal challenges. High public communication value." },
      economic_crisis:  { committed:true,  role:"Consumer + Worker Protection",   responseTime:"24 hrs",  legal:75, communications:70 },
      natural_disaster: { committed:true,  role:"Legal + Consumer Protection",    responseTime:"4 hrs",   legal:70, communications:75 },
      pandemic:         { committed:true,  role:"Public Health Orders",           responseTime:"4 hrs",   legal:70, communications:80 },
    },
  },
  {
    id: "hartford_city", name: "City of Hartford (Mayor's Office)", shortName: "Hartford City",
    type: "government", county: "Hartford", lat: 41.764, lng: -72.674,
    budget: 500_000_000, website: "hartford.gov",
    resources: { legal:20, shelter:30, food:20, mentalHealth:10, financialAid:500000, communications:75 },
    elasticity: { financialAid:0.1, communications:0.2 },
    trustScore: 72, dataSource: "City website",
    connections: ["oia","hartford_fdn","cceh","catholic_charities","cira"],
    description: "Hartford is a sanctuary city. Mayor's Office of Immigrant Affairs. Emergency management + public comms capacity. ~30% immigrant population.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Sanctuary City Coordination + Comms", responseTime:"4–8 hrs",
        communications:80, financialAid:250000,
        notes:"Sanctuary city policy limits ICE cooperation. Mayor can issue public statement + guidance. Emergency fund activation possible. ONLY covers Hartford city limits." },
      economic_crisis:  { committed:true,  role:"Emergency Relief",    responseTime:"1 week",  financialAid:500000 },
      natural_disaster: { committed:true,  role:"Emergency Management",responseTime:"1 hr",    communications:85, shelter:50 },
      pandemic:         { committed:true,  role:"Public Health",       responseTime:"2 hrs",   communications:80 },
    },
  }
);

// ── PATCH: Wire new orgs INTO existing org connection lists ──────────────────
// This runs after ORGS.push() calls above to add back-connections
const BACK_CONNECTIONS = {
  hartford_fdn:  ["charter_oak","cceh","south_park","end_hunger_ct","ct_voices","hartford_city","ag_office"],
  fairfield_fdn: ["ciri"],
  new_haven_fdn: ["loaves_fishes","ct_voices","unidad_latina"],
  ccp:           ["circ","end_hunger_ct"],
  iris:          ["unidad_latina","sanctuary_ct","ciri"],
  cira:          ["circ","sanctuary_ct","unidad_latina"],
  make_road:     ["unidad_latina","sanctuary_ct"],
  aclu_ct:       ["ag_office","circ","ct_voices"],
  catholic_charities: ["south_park","sanctuary_ct"],
  hartford_fdn:  ["charter_oak","cceh","south_park","ct_voices","hartford_city","ag_office"],
  oia:           ["ag_office","hartford_city"],
  foodshare:     ["end_hunger_ct","south_park"],
  ct_food_bank:  ["loaves_fishes","end_hunger_ct"],
  columbus_house:["cceh"],
  mental_health_ct: ["charter_oak"],
  chc:           ["charter_oak"],
  nhla:          ["unidad_latina"],
  cceh:          ["south_park"],
};

BACK_CONNECTIONS && Object.entries(BACK_CONNECTIONS).forEach(([orgId, newConns]) => {
  const org = ORGS.find(o => o.id === orgId);
  if (!org) return;
  newConns.forEach(newId => {
    if (!org.connections.includes(newId)) {
      org.connections.push(newId);
    }
  });
});

// ── ADD CONTACT INFO + HOTLINES to key orgs ──────────────────────────────────
const CONTACT_DATA = {
  iris:          { phone:"(203) 562-2095", hotline:null,              address:"75 Hamilton St, New Haven CT 06511" },
  cira:          { phone:"(860) 906-8000", hotline:"(860) 906-8000",  address:"P.O. Box 1323, Hartford CT 06143" },
  make_road:     { phone:"(203) 549-5220", hotline:"(203) 549-5220",  address:"220 Clinton Ave, Bridgeport CT 06605" },
  ct_legal:      { phone:"(203) 946-4811", hotline:"(800) 798-0671",  address:"Multiple offices statewide" },
  nhla:          { phone:"(203) 946-4811", hotline:null,              address:"205 Orange St, New Haven CT 06510" },
  aclu_ct:       { phone:"(860) 523-9146", hotline:null,              address:"765 Asylum Ave, Hartford CT 06105" },
  ciri:          { phone:"(203) 551-0500", hotline:null,              address:"670 Clinton Ave, Bridgeport CT 06605" },
  circ:          { phone:"(860) 906-8000", hotline:null,              address:"Hartford, CT" },
  ag_office:     { phone:"(860) 808-5318", hotline:null,              address:"165 Capitol Ave, Hartford CT 06106" },
  oia:           { phone:"(860) 256-2897", hotline:null,              address:"450 Capitol Ave, Hartford CT 06106" },
  hartford_fdn:  { phone:"(860) 548-1888", hotline:null,              address:"Ten Columbus Blvd, Hartford CT 06106" },
  fairfield_fdn: { phone:"(203) 750-3200", hotline:null,              address:"40 Richards Ave, Norwalk CT 06854" },
  new_haven_fdn: { phone:"(203) 777-2386", hotline:null,              address:"70 Audubon St, New Haven CT 06510" },
  ccp:           { phone:"(860) 525-5585", hotline:null,              address:"221 Main St, Hartford CT 06106" },
  foodshare:     { phone:"(860) 286-9999", hotline:null,              address:"450 Woodland Ave, Bloomfield CT 06002" },
  ct_food_bank:  { phone:"(203) 469-5000", hotline:null,              address:"2 Research Pkwy, Wallingford CT 06492" },
  catholic_charities:{phone:"(860) 548-2000",hotline:null,            address:"467 Bloomfield Ave, Bloomfield CT 06002" },
  columbus_house:{ phone:"(203) 776-9008", hotline:null,              address:"42 Clifton St, New Haven CT 06513" },
  sanctuary_ct:  { phone:null,             hotline:"(860) 519-0966",  address:"Hartford, CT" },
  unidad_latina: { phone:"(203) 776-2520", hotline:null,              address:"37 Howe St, New Haven CT 06511" },
  chc:           { phone:"(860) 347-6971", hotline:null,              address:"635 Main St, Middletown CT 06457" },
  cceh:          { phone:"(860) 721-7876", hotline:null,              address:"30 Jordan Lane, Wethersfield CT 06109" },
};

Object.entries(CONTACT_DATA).forEach(([id, contact]) => {
  const org = ORGS.find(o => o.id === id);
  if (org) org.contact = contact;
});

// ── TIER 3: UNITED WAYS, HOSPITALS, NAACP, 211, SCHOOL DISTRICTS ─────────────
ORGS.push(
  {
    id: "uw_hartford", name: "United Way of Central & Northeastern CT", shortName: "United Way Hartford",
    type: "foundation", county: "Hartford", lat: 41.768, lng: -72.671,
    budget: 12_000_000, website: "unitedwayinc.org",
    resources: { legal:0, shelter:20, food:30, mentalHealth:10, financialAid:2_000_000, communications:60 },
    elasticity: { financialAid:0.3, food:0.2, communications:0.3 },
    trustScore: 90, dataSource: "990 + Website",
    connections: ["hartford_fdn","ccp","foodshare","cceh","south_park","hartford_city","end_hunger_ct"],
    description: "Covers 56 Hartford-region towns. Rapid Response Fund for Homelessness ($100K+). 211 helpline operator. Convener of basic needs safety net. COVID precedent for rapid grantmaking.",
    contact: { phone:"(860) 493-6800", hotline:"211", address:"One State Street Suite 1710, Hartford CT 06103" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Fund + 211 Navigation – Hartford Region", responseTime:"48–72 hrs",
        financialAid:300000, communications:70,
        notes:"211 helpline can add ICE-specific resource navigation. Rapid Response Fund can be reoriented. Covers 56 towns in Hartford/Tolland/Windham area." },
      economic_crisis:  { committed:true,  role:"Emergency Cash Assistance",    responseTime:"24 hrs",  financialAid:500000, food:40 },
      natural_disaster: { committed:true,  role:"Disaster Relief Coordination", responseTime:"24 hrs",  financialAid:400000 },
      pandemic:         { committed:true,  role:"Emergency Relief",             responseTime:"48 hrs",  financialAid:600000 },
    },
  },
  {
    id: "uw_fairfield", name: "United Way of Coastal & Western CT", shortName: "United Way Fairfield",
    type: "foundation", county: "Fairfield", lat: 41.395, lng: -73.455,
    budget: 15_000_000, website: "unitedwaycwc.org",
    resources: { legal:0, shelter:20, food:30, mentalHealth:10, financialAid:1_800_000, communications:55 },
    elasticity: { financialAid:0.25, communications:0.3 },
    trustScore: 88, dataSource: "990 + Website",
    connections: ["fairfield_fdn","ccp","ct_food_bank","make_road","int_institute"],
    description: "Covers Bridgeport, Stamford, Norwalk, Danbury, New Milford. Emergency Food & Shelter Program distributor ($1.8M). Community Reinvestment grants. ALICE framework.",
    contact: { phone:"(203) 792-5330", hotline:"211", address:"301 Main St Suite 2-5, Danbury CT 06810" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Fund + EFSP – Fairfield County", responseTime:"48–72 hrs",
        financialAid:400000, communications:60,
        notes:"EFSP funds can be reoriented to ICE emergency. Covers highest-concentration immigrant county. Partners with Make the Road and IICT on immigrant services." },
      economic_crisis:  { committed:true,  role:"ALICE Emergency Response",     responseTime:"24 hrs",  financialAid:600000 },
      natural_disaster: { committed:true,  role:"Disaster Relief",              responseTime:"24 hrs",  financialAid:500000 },
      pandemic:         { committed:true,  role:"Emergency Relief",             responseTime:"48 hrs",  financialAid:700000 },
    },
  },
  {
    id: "uw_new_haven", name: "United Way of Greater New Haven", shortName: "United Way New Haven",
    type: "foundation", county: "New Haven", lat: 41.311, lng: -72.924,
    budget: 8_000_000, website: "uwgnh.org",
    resources: { legal:0, shelter:15, food:25, mentalHealth:10, financialAid:1_200_000, communications:50 },
    elasticity: { financialAid:0.25, communications:0.3 },
    trustScore: 87, dataSource: "990 + Website",
    connections: ["new_haven_fdn","ccp","ct_food_bank","loaves_fishes","columbus_house","unidad_latina"],
    description: "Covers Greater New Haven. Basic needs, housing stability, financial empowerment. 211 navigation. Deep grantee network in immigrant-serving orgs.",
    contact: { phone:"(203) 777-2009", hotline:"211", address:"370 James St Suite 204, New Haven CT 06513" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Fund + 211 – New Haven Region", responseTime:"48 hrs",
        financialAid:200000, communications:60,
        notes:"211 can add ICE resource navigation. Grantee network includes immigrant-serving orgs. Rapid grant protocol established from COVID." },
      economic_crisis:  { committed:true,  role:"Emergency Relief",             responseTime:"24 hrs",  financialAid:400000 },
      natural_disaster: { committed:true,  role:"Disaster Relief",              responseTime:"24 hrs",  financialAid:300000 },
      pandemic:         { committed:true,  role:"Emergency Relief",             responseTime:"48 hrs",  financialAid:500000 },
    },
  },
  {
    id: "ct_211", name: "211 Connecticut / United Way CT", shortName: "211 CT Helpline",
    type: "advocacy", county: "Hartford", lat: 41.766, lng: -72.669,
    budget: 3_000_000, website: "211ct.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:99 },
    elasticity: { communications:0.2 },
    trustScore: 92, dataSource: "State contract + Website",
    connections: ["uw_hartford","uw_fairfield","uw_new_haven","ccp","oia","foodshare","ct_food_bank"],
    description: "Statewide 211 helpline — connects callers to 4,000+ health/human service programs. 500K+ contacts/year. Available 24/7 in 180 languages. CRITICAL infrastructure for crisis navigation.",
    contact: { phone:"211", hotline:"211", address:"Statewide — Hartford HQ" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"RESOURCE NAVIGATION HUB – Statewide 24/7", responseTime:"IMMEDIATE",
        communications:100,
        notes:"Can add ICE-specific resources to database within hours. 24/7 multilingual. 180 languages. Single number for entire CT population. MOST SCALABLE communication asset in ecosystem." },
      economic_crisis:  { committed:true,  role:"Resource Navigation",          responseTime:"24 hrs",  communications:100 },
      natural_disaster: { committed:true,  role:"Emergency Navigation",         responseTime:"1 hr",    communications:100 },
      pandemic:         { committed:true,  role:"Health Navigation",            responseTime:"1 hr",    communications:100 },
    },
  },
  {
    id: "ct_naacp", name: "NAACP Connecticut State Conference", shortName: "CT NAACP",
    type: "advocacy", county: "Hartford", lat: 41.761, lng: -72.681,
    budget: 500_000, website: "ctnaacp.org",
    resources: { legal:30, shelter:0, food:0, mentalHealth:0, financialAid:20000, communications:80 },
    elasticity: { legal:0.2, communications:0.4 },
    trustScore: 80, dataSource: "Website",
    connections: ["aclu_ct","cira","ag_office","hartford_city","ct_voices"],
    description: "CT statewide NAACP. Civil rights advocacy, legal observer network, community organizing. 30+ branches across CT. Know Your Rights outreach. Racial profiling monitoring.",
    contact: { phone:"(860) 951-3939", hotline:null, address:"Hartford, CT" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Civil Rights Advocacy + Legal Observers", responseTime:"4–8 hrs",
        legal:50, communications:80,
        notes:"Monitors for racial profiling. KYR outreach network. 30+ branches = statewide reach. Civil rights documentation. Partners with ACLU on enforcement monitoring." },
      economic_crisis:  { committed:true,  role:"Economic Justice Advocacy",    responseTime:"24 hrs",  communications:75 },
      natural_disaster: { committed:true,  role:"Community Advocacy",           responseTime:"24 hrs",  communications:70 },
      pandemic:         { committed:true,  role:"Health Equity Advocacy",       responseTime:"24 hrs",  communications:75 },
    },
  },
  {
    id: "yale_hospital", name: "Yale New Haven Health System", shortName: "Yale New Haven Health",
    type: "mentalHealth", county: "New Haven", lat: 41.304, lng: -72.936,
    budget: 3_500_000_000, website: "ynhh.org",
    resources: { legal:0, shelter:0, food:10, mentalHealth:80, financialAid:500000, communications:40 },
    elasticity: { mentalHealth:0.15, financialAid:0.1 },
    trustScore: 85, dataSource: "Website + Annual Report",
    connections: ["new_haven_fdn","chc","yale_legal","columbus_house","ct_211"],
    description: "Yale New Haven, Bridgeport, Greenwich Hospitals + 5 others. Serves all regardless of ability to pay. Trauma/psych services. Bridgeport Hospital covers Fairfield County. Community Health Investment Program ($50M/yr).",
    contact: { phone:"(203) 688-4242", hotline:"911 for emergencies", address:"20 York St, New Haven CT 06510" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Medical + Trauma – Southern CT", responseTime:"IMMEDIATE",
        mentalHealth:75,
        notes:"EMTALA requires treatment regardless of status. Trauma psych available. Community health investment can be directed. Bridgeport Hospital covers Fairfield County. Language access for 100+ languages." },
      economic_crisis:  { committed:true,  role:"Health Safety Net",            responseTime:"24 hrs",  mentalHealth:75 },
      natural_disaster: { committed:true,  role:"Mass Casualty + Emergency",   responseTime:"IMMEDIATE", mentalHealth:80 },
      pandemic:         { committed:true,  role:"Primary Health Response",      responseTime:"IMMEDIATE", mentalHealth:80 },
    },
  },
  {
    id: "hartford_hospital", name: "Hartford HealthCare", shortName: "Hartford HealthCare",
    type: "mentalHealth", county: "Hartford", lat: 41.760, lng: -72.675,
    budget: 2_800_000_000, website: "hartfordhealthcare.org",
    resources: { legal:0, shelter:0, food:10, mentalHealth:80, financialAid:400000, communications:40 },
    elasticity: { mentalHealth:0.1 },
    trustScore: 83, dataSource: "Website + Annual Report",
    connections: ["hartford_fdn","chc","charter_oak","mental_health_ct","ct_211","uw_hartford"],
    description: "Hartford Hospital, MidState, Backus + 7 facilities. Behavioral Health Network. Nuvance Health partner. EMTALA — treats all regardless of status. Institute of Living for psychiatric care.",
    contact: { phone:"(860) 972-1000", hotline:"911 for emergencies", address:"80 Seymour St, Hartford CT 06102" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Medical + Psychiatric – Northern CT", responseTime:"IMMEDIATE",
        mentalHealth:75,
        notes:"EMTALA mandates treatment regardless of status. Institute of Living for trauma psych. Language access program. Behavioral Health Network for ongoing mental health. Hartford and surrounding region." },
      economic_crisis:  { committed:true,  role:"Health Safety Net",            responseTime:"24 hrs",  mentalHealth:75 },
      natural_disaster: { committed:true,  role:"Mass Casualty + Emergency",   responseTime:"IMMEDIATE", mentalHealth:80 },
      pandemic:         { committed:true,  role:"Primary Health Response",      responseTime:"IMMEDIATE", mentalHealth:80 },
    },
  },
  {
    id: "ct_ed_dept", name: "CT Dept of Education / School Districts", shortName: "CT Schools",
    type: "government", county: "Hartford", lat: 41.762, lng: -72.673,
    budget: 5_000_000_000, website: "ct.gov/sde",
    resources: { legal:10, shelter:20, food:50, mentalHealth:30, financialAid:0, communications:70 },
    elasticity: { food:0.2, communications:0.3, mentalHealth:0.1 },
    trustScore: 72, dataSource: "State website",
    connections: ["oia","ct_voices","ag_office","hartford_city","chc"],
    description: "170+ public school districts. Plyler v. Doe — schools serve all children regardless of status. School counselors. Free meals. Safe haven for children of detained parents. Guidance issued 2025.",
    contact: { phone:"(860) 713-6543", hotline:null, address:"450 Columbus Blvd, Hartford CT 06103" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Safe Haven for Children – Statewide Schools", responseTime:"IMMEDIATE",
        food:60, mentalHealth:40, communications:70,
        notes:"SDE issued 2025 guidance: schools must not cooperate with ICE, serve all children. 500K+ students = massive reach network. Meals, counselors, safe place. Standby guardianship protocols. School social workers." },
      economic_crisis:  { committed:true,  role:"School Safety Net",            responseTime:"IMMEDIATE", food:60, mentalHealth:40 },
      natural_disaster: { committed:true,  role:"Shelter + Community Hub",      responseTime:"4 hrs",    shelter:60, food:60 },
      pandemic:         { committed:true,  role:"Health Safety Net",            responseTime:"24 hrs",   food:50, mentalHealth:40 },
    },
  },
  {
    id: "clifford_beers", name: "Clifford Beers Community Health Partners", shortName: "Clifford Beers",
    type: "mentalHealth", county: "New Haven", lat: 41.315, lng: -72.921,
    budget: 8_000_000, website: "cliffordbeerschp.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:85, financialAid:0, communications:30 },
    elasticity: { mentalHealth:0.2 },
    trustScore: 85, dataSource: "Website",
    connections: ["new_haven_fdn","chc","iris","columbus_house","unidad_latina"],
    description: "New Haven area FQHC. Specializes in behavioral health + trauma. Serves all regardless of status. Strong Spanish-language capacity. Immigrant community experience.",
    contact: { phone:"(203) 772-1270", hotline:null, address:"1 Long Wharf Dr, New Haven CT 06511" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Trauma Mental Health – New Haven", responseTime:"24–48 hrs",
        mentalHealth:95,
        notes:"Trauma-specialised FQHC. Serves all regardless of status. Strong Spanish capacity. Located near IRIS + Unidad Latina for coordinated referrals. Crisis intervention available." },
      economic_crisis:  { committed:true,  role:"Mental Health Safety Net",     responseTime:"24 hrs",  mentalHealth:90 },
      natural_disaster: { committed:true,  role:"Crisis Counseling",            responseTime:"8 hrs",   mentalHealth:90 },
      pandemic:         { committed:true,  role:"Mental Health",                responseTime:"24 hrs",  mentalHealth:90 },
    },
  },
  {
    id: "new_haven_city", name: "City of New Haven (Mayor's Office)", shortName: "New Haven City",
    type: "government", county: "New Haven", lat: 41.308, lng: -72.928,
    budget: 600_000_000, website: "newhavenct.gov",
    resources: { legal:20, shelter:30, food:20, mentalHealth:10, financialAid:300000, communications:75 },
    elasticity: { communications:0.2, financialAid:0.1 },
    trustScore: 78, dataSource: "City website",
    connections: ["oia","new_haven_fdn","iris","nhla","unidad_latina","ag_office","columbus_house"],
    description: "Sanctuary city since 1980s. New Haven ID card program (City ID). Office of Immigrant Affairs. AG Justin Elicker supportive. ~17% immigrant population. Emergency management capacity.",
    contact: { phone:"(203) 946-8200", hotline:null, address:"165 Church St, New Haven CT 06510" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Sanctuary City + Comms + City ID – New Haven", responseTime:"2–4 hrs",
        communications:85, financialAid:150000,
        notes:"Sanctuary policy since 1980s. City ID program serves undocumented residents. Emergency declaration possible. Police won't cooperate with ICE. Mayor communicates directly to community. City attorney can file legal challenges." },
      economic_crisis:  { committed:true,  role:"Emergency Relief",             responseTime:"1 week",  financialAid:300000 },
      natural_disaster: { committed:true,  role:"Emergency Management",         responseTime:"1 hr",    communications:85, shelter:50 },
      pandemic:         { committed:true,  role:"Public Health",                responseTime:"2 hrs",   communications:80 },
    },
  },
  {
    id: "new_haven_police", name: "New Haven Police Dept (Sanctuary Policy)", shortName: "NHPD",
    type: "government", county: "New Haven", lat: 41.310, lng: -72.926,
    budget: 50_000_000, website: "newhavenct.gov/nhpd",
    resources: { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:60 },
    elasticity: { communications:0.1 },
    trustScore: 65, dataSource: "City website + Policy docs",
    connections: ["new_haven_city","oia","ag_office","aclu_ct"],
    description: "Sanctuary policy — will not cooperate with ICE civil immigration enforcement. Community policing model in immigrant neighborhoods. Trust is critical and fragile. Policy established under Garry/Esserman.",
    contact: { phone:"(203) 946-6316", hotline:"911", address:"1 Union Ave, New Haven CT 06519" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Non-Cooperation with ICE Civil Enforcement", responseTime:"IMMEDIATE",
        communications:65,
        notes:"Will NOT honor ICE civil detainers per sanctuary policy. Will not assist in civil immigration enforcement. Can issue guidance to officers. Trust with community is critical — active communication during enforcement events helps maintain calm." },
      economic_crisis:  { committed:false, role:"Limited — Public Safety Only",  responseTime:"N/A" },
      natural_disaster: { committed:true,  role:"Emergency Response",           responseTime:"IMMEDIATE", communications:70 },
      pandemic:         { committed:true,  role:"Public Safety",                responseTime:"IMMEDIATE" },
    },
  },
  {
    id: "open_doors", name: "Open Doors – Refugee & Immigrant Services", shortName: "Open Doors",
    type: "legal", county: "New Haven", lat: 41.313, lng: -72.918,
    budget: 4_000_000, website: "odpCT.org",
    resources: { legal:55, shelter:25, food:15, mentalHealth:20, financialAid:150000, communications:40 },
    elasticity: { legal:0.25, shelter:0.2, financialAid:0.3 },
    trustScore: 84, dataSource: "Website",
    connections: ["new_haven_fdn","iris","nhla","ct_legal","columbus_house","clifford_beers"],
    description: "Milford-based resettlement agency covering New Haven + Fairfield. Legal services, employment, housing, ESL. Resettlement case management. DOJ recognition.",
    contact: { phone:"(203) 874-1225", hotline:null, address:"26 Sycamore St, Milford CT 06460" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal + Resettlement Support – SW New Haven", responseTime:"8–12 hrs",
        legal:70, shelter:40, financialAid:200000,
        notes:"Milford-based. Covers gap between New Haven city and Fairfield County. Housing + legal + case management. Emergency family placements. DOJ-recognized legal program." },
      economic_crisis:  { committed:true,  role:"Resettlement + Legal",         responseTime:"24 hrs",  legal:65 },
      natural_disaster: { committed:true,  role:"Immigrant Support",            responseTime:"8 hrs",   shelter:50 },
      pandemic:         { committed:true,  role:"Health Navigation",            responseTime:"24 hrs",  mentalHealth:40 },
    },
  },
  {
    id: "ct_bail_fund", name: "Connecticut Bail Fund", shortName: "CT Bail Fund",
    type: "advocacy", county: "Hartford", lat: 41.764, lng: -72.680,
    budget: 800_000, website: "ctbailfund.org",
    resources: { legal:20, shelter:0, food:0, mentalHealth:0, financialAid:200000, communications:40 },
    elasticity: { financialAid:0.5, legal:0.2 },
    trustScore: 78, dataSource: "Website",
    connections: ["aclu_ct","ct_legal","cira","make_road","ag_office"],
    description: "Pays bail for people who can't afford it. CRITICAL for ICE scenario — immigration bond can be $1,500–$25,000. Revolving fund model. Advocacy for bail reform.",
    contact: { phone:null, hotline:null, address:"Hartford, CT" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Immigration Bond Payments – CRITICAL", responseTime:"24–48 hrs",
        financialAid:300000, legal:30,
        notes:"Immigration bonds $1,500–$25,000 per person. Revolving fund — money returns when case resolved. CRITICAL gap: most families cannot afford bond. Needs large emergency capital infusion to operate at scale during mass enforcement." },
      economic_crisis:  { committed:true,  role:"Bail + Legal",                 responseTime:"48 hrs",  financialAid:150000 },
      natural_disaster: { committed:false, role:"Not Primary Role",             responseTime:"N/A" },
      pandemic:         { committed:true,  role:"Decarceration Advocacy",       responseTime:"48 hrs",  financialAid:100000 },
    },
  },
  {
    id: "carc", name: "Center for Advanced Refugee Care (CARC)", shortName: "CARC",
    type: "mentalHealth", county: "Hartford", lat: 41.762, lng: -72.677,
    budget: 2_000_000, website: "carcct.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:90, financialAid:0, communications:25 },
    elasticity: { mentalHealth:0.25 },
    trustScore: 82, dataSource: "Website",
    connections: ["hartford_fdn","iris","catholic_charities","charter_oak","ciri"],
    description: "Specialized trauma therapy for refugees and immigrants. Hartford-based. Multilingual clinicians. PTSD, torture survivor care. Deep immigrant community trust. Small but highly specialized.",
    contact: { phone:"(860) 232-9816", hotline:null, address:"41 New Britain Ave, Hartford CT 06052" },
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Trauma Therapy – Hartford Immigrant Community", responseTime:"48–72 hrs",
        mentalHealth:100,
        notes:"Specialized trauma + PTSD care for immigrants and refugees. Multilingual clinicians. Deep community trust. Limited capacity but highest quality trauma care in Hartford for immigrant community." },
      economic_crisis:  { committed:true,  role:"Mental Health",                responseTime:"48 hrs",  mentalHealth:90 },
      natural_disaster: { committed:true,  role:"Trauma Support",               responseTime:"48 hrs",  mentalHealth:90 },
      pandemic:         { committed:true,  role:"Telehealth Mental Health",      responseTime:"48 hrs",  mentalHealth:90 },
    },
  }
);

// ── Wire Tier 3 orgs into existing org connections ───────────────────────────
const TIER3_BACK = {
  hartford_fdn:  ["uw_hartford","yale_hospital","hartford_hospital","carc"],
  new_haven_fdn: ["uw_new_haven","yale_hospital","clifford_beers","new_haven_city","open_doors"],
  fairfield_fdn: ["uw_fairfield"],
  ccp:           ["uw_hartford","uw_fairfield","uw_new_haven","ct_211","ct_naacp"],
  iris:          ["open_doors","clifford_beers","carc"],
  aclu_ct:       ["ct_naacp","ct_bail_fund","new_haven_police","new_haven_city"],
  cira:          ["ct_bail_fund","ct_naacp"],
  make_road:     ["ct_bail_fund"],
  oia:           ["ct_ed_dept","new_haven_city","new_haven_police"],
  ag_office:     ["ct_naacp","new_haven_city","new_haven_police","ct_bail_fund"],
  hartford_city: ["uw_hartford","hartford_hospital"],
  nhla:          ["open_doors","new_haven_city"],
  unidad_latina: ["clifford_beers","new_haven_city"],
  chc:           ["hartford_hospital","clifford_beers","carc"],
};

Object.entries(TIER3_BACK).forEach(([orgId, newConns]) => {
  const org = ORGS.find(o => o.id === orgId);
  if (!org) return;
  newConns.forEach(newId => {
    if (!org.connections.includes(newId)) org.connections.push(newId);
  });
});

// ── TIER 4: EASTERN CT, SPECIALIZED + UPDATED REAL 2025 DATA ─────────────────
ORGS.push(

  // ── EASTERN CT GAP FILLERS ───────────────────────────────────────────────
  {
    id: "iasc", name: "Immigration Advocacy & Support Center", shortName: "IASC",
    type: "legal", county: "New London", lat: 41.355, lng: -72.097,
    budget: 400_000, website: "iascct.org",
    resources: { legal:70, shelter:0, food:0, mentalHealth:0, financialAid:20000, communications:30 },
    elasticity: { legal:0.2, financialAid:0.2 },
    trustScore: 86, dataSource: "Website + DOJ BIA Recognition",
    connections: ["cfect","ct_legal","cira","catholic_norwich"],
    contact: { phone:"(860) 395-4344", hotline:null, address:"1 Whale Oil Row, New London CT 06320" },
    description: "ONLY nonprofit in Southeastern CT dedicated exclusively to immigrant legal services. DOJ/BIA-accredited. Spanish + Haitian Creole. Norwich/New London area. Critical gap-filler for eastern CT.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal Response – SE Connecticut (SOLE Provider)", responseTime:"4–8 hrs",
        legal:80,
        notes:"THE ONLY BIA-accredited nonprofit in all of southeastern CT. Without IASC, New London County has zero dedicated immigration legal services. Critically under-resourced — serves 6K+ undocumented with tiny budget." },
      economic_crisis:  { committed:true,  role:"Immigration Legal",    responseTime:"24 hrs",  legal:75 },
      natural_disaster: { committed:true,  role:"Immigrant Support",    responseTime:"8 hrs" },
      pandemic:         { committed:true,  role:"Immigration Legal",    responseTime:"24 hrs",  legal:70 },
    },
  },
  {
    id: "cfect", name: "Community Foundation of Eastern CT", shortName: "CFECT",
    type: "foundation", county: "New London", lat: 41.357, lng: -72.094,
    budget: 8_000_000, website: "cfect.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:800000, communications:40 },
    elasticity: { financialAid:0.2, communications:0.3 },
    trustScore: 88, dataSource: "990 + ProPublica 2024",
    connections: ["ccp","iasc","uw_hartford","catholic_norwich","neighbor_fund"],
    contact: { phone:"(860) 442-3572", hotline:null, address:"68 Federal St, New London CT 06320" },
    description: "$8M/yr grants across 42 towns in New London, Windham, Tolland counties. The primary philanthropic infrastructure for all of eastern CT. Critical funder in the most under-resourced region.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Funder – Eastern CT (Sole Regional Funder)", responseTime:"72 hrs",
        financialAid:200000,
        notes:"Covers New London, Windham, Tolland — regions with ZERO other community foundations. Social equity and immigration justice in grantmaking priorities. Can rapidly reorient grants." },
      economic_crisis:  { committed:true,  role:"Regional Emergency Funder",  responseTime:"1 week",  financialAid:400000 },
      natural_disaster: { committed:true,  role:"Disaster Relief – Eastern CT",responseTime:"48 hrs",  financialAid:300000 },
      pandemic:         { committed:true,  role:"Health + Basic Needs",        responseTime:"48 hrs",  financialAid:350000 },
    },
  },
  {
    id: "catholic_norwich", name: "Catholic Charities – Diocese of Norwich", shortName: "Catholic Charities Norwich",
    type: "faith", county: "New London", lat: 41.525, lng: -72.075,
    budget: 5_000_000, website: "ccaoh.org/norwich",
    resources: { legal:20, shelter:40, food:50, mentalHealth:20, financialAid:100000, communications:30 },
    elasticity: { shelter:0.2, food:0.3, financialAid:0.2 },
    trustScore: 80, dataSource: "DOJ Accreditation + Website",
    connections: ["cfect","iasc","cceh","ct_food_bank","cira"],
    contact: { phone:"(860) 889-8346", hotline:null, address:"331 Main St, Norwich CT 06360" },
    description: "Diocese of Norwich covers New London + Windham counties. Part-time DOJ-accredited immigration worker. 60+ parishes in eastern CT. Food, shelter, emergency assistance. Key rural coverage.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Multi-Resource – New London + Windham Counties", responseTime:"8 hrs",
        legal:30, shelter:50, food:60, financialAid:120000,
        notes:"60+ parishes in eastern CT. Part-time BIA-accredited immigration worker (Rosalinda Bazinet). Food pantries, emergency shelter. CRITICAL: Only faith-based anchor org in eastern CT." },
      economic_crisis:  { committed:true,  role:"Multi-Resource Response",    responseTime:"8 hrs",   food:65, shelter:50, financialAid:80000 },
      natural_disaster: { committed:true,  role:"Emergency Response",         responseTime:"4 hrs",   food:70, shelter:60 },
      pandemic:         { committed:true,  role:"Food + Community",           responseTime:"8 hrs",   food:65 },
    },
  },
  {
    id: "neighbor_fund", name: "The Neighbor Fund", shortName: "Neighbor Fund",
    type: "advocacy", county: "Windham", lat: 41.712, lng: -72.208,
    budget: 150_000, website: "theneighborfund.org",
    resources: { legal:10, shelter:0, food:0, mentalHealth:0, financialAid:80000, communications:50 },
    elasticity: { financialAid:0.6, communications:0.4 },
    trustScore: 76, dataSource: "Website",
    connections: ["cfect","ct_bail_fund","cira","ct_legal"],
    contact: { phone:null, hotline:null, address:"Willimantic CT 06226" },
    description: "Grassroots fund supporting immigrant communities in Windham + Tolland counties facing detention/deportation. Founded 2017 after Willimantic ICE arrests. Direct bail + legal financial support. Deep community trust.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Bail + Emergency Fund – Willimantic/Eastern CT", responseTime:"2–4 hrs",
        financialAid:100000, communications:60,
        notes:"Founded in direct response to 2017 ICE arrests near Frog Bridge in Willimantic. Deepest community trust in Windham + Tolland. Small but nimble — can mobilize community network fast. Pays bail bonds directly." },
      economic_crisis:  { committed:true,  role:"Direct Financial Aid",        responseTime:"24 hrs",  financialAid:50000 },
      natural_disaster: { committed:true,  role:"Mutual Aid Coordination",     responseTime:"4 hrs",   communications:55 },
      pandemic:         { committed:true,  role:"Direct Aid",                  responseTime:"24 hrs",  financialAid:40000 },
    },
  },
  {
    id: "united_services", name: "United Services Inc. (NE CT Behavioral Health)", shortName: "United Services",
    type: "mentalHealth", county: "Windham", lat: 41.743, lng: -71.870,
    budget: 25_000_000, website: "unitedservicesinc.org",
    resources: { legal:0, shelter:20, food:0, mentalHealth:85, financialAid:0, communications:25 },
    elasticity: { mentalHealth:0.15, shelter:0.1 },
    trustScore: 82, dataSource: "990 + Website",
    connections: ["cfect","neighbor_fund","catholic_norwich","cceh"],
    contact: { phone:"(860) 774-2020", hotline:"(860) 774-2020", address:"132 Pomfret St, Putnam CT 06260" },
    description: "Comprehensive behavioral health for Northeast CT (Windham + Tolland + New London). Adults, children, families. Crisis services. Putnam HQ + Willimantic + Norwich offices. ONLY major MH provider in region.",
    scenarioCommitments: {
      ice_raid:         { committed:false, role:"MH Services – NE CT (Needs Outreach)", responseTime:"48 hrs",
        mentalHealth:80,
        notes:"⚠ Not yet formally engaged for ICE scenario. Has crisis services and serves all regardless of insurance. Would need CIRA/CCP outreach + funding commitment. CRITICAL GAP: only major MH org in northeastern CT." },
      economic_crisis:  { committed:true,  role:"MH Safety Net – NE CT",       responseTime:"24 hrs",  mentalHealth:85 },
      natural_disaster: { committed:true,  role:"Crisis Counseling",            responseTime:"8 hrs",   mentalHealth:90 },
      pandemic:         { committed:true,  role:"Behavioral Health",            responseTime:"24 hrs",  mentalHealth:85 },
    },
  },

  // ── SPECIALIZED + CRITICAL MISSING ───────────────────────────────────────
  {
    id: "nlg_ct", name: "National Lawyers Guild – CT Chapter", shortName: "NLG Connecticut",
    type: "legal", county: "New Haven", lat: 41.312, lng: -72.928,
    budget: 100_000, website: "nlgct.org",
    resources: { legal:60, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:70 },
    elasticity: { legal:0.5, communications:0.4 },
    trustScore: 74, dataSource: "Website + Published hotline",
    connections: ["aclu_ct","ct_bail_fund","make_road","unidad_latina","cira","nhla"],
    contact: { phone:"(203) 896-7221", hotline:"(203) 896-7221", address:"New Haven, CT" },
    description: "Legal observer network. Statewide legal support hotline (203) 896-7221. Reports arrests + police violence. Jail support. Bond connections. Critical rapid-response legal infrastructure.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal Observers + Hotline + Jail Support – Statewide", responseTime:"1–2 hrs",
        legal:80, communications:75,
        notes:"Hotline (203) 896-7221 receives arrest reports statewide. Legal observers deploy to enforcement sites. Jail support team. Connects detained to bond resources. Volunteer-powered surge capacity. 2025-active." },
      economic_crisis:  { committed:true,  role:"Worker Rights Legal",          responseTime:"24 hrs",  legal:70 },
      natural_disaster: { committed:false, role:"Limited",                      responseTime:"1 week" },
      pandemic:         { committed:true,  role:"Prisoner Rights + Bail",       responseTime:"24 hrs",  legal:65 },
    },
  },
  {
    id: "ccadv", name: "CT Coalition Against Domestic Violence", shortName: "CCADV",
    type: "shelter", county: "Hartford", lat: 41.768, lng: -72.679,
    budget: 8_000_000, website: "ctcadv.org",
    resources: { legal:30, shelter:80, food:20, mentalHealth:60, financialAid:200000, communications:70 },
    elasticity: { shelter:0.2, mentalHealth:0.15, communications:0.3 },
    trustScore: 90, dataSource: "990 + State contract",
    connections: ["hartford_fdn","ccp","ct_legal","aclu_ct","cceh","uw_hartford","sanctuary_ct"],
    contact: { phone:"(959) 202-5000", hotline:"(888) 774-2900", address:"110 Connecticutt Blvd, E Hartford CT 06108" },
    description: "Umbrella for 18 DV member orgs statewide. Safe Connect hotline 888-774-2900 (24/7, all languages). 16 shelters statewide. 705 victims + children in housing program. SERVES ALL including undocumented.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Shelter + Support – All Undocumented Survivors", responseTime:"IMMEDIATE",
        shelter:75, mentalHealth:55, communications:80,
        notes:"SERVES ALL including undocumented — explicitly stated policy. ICE enforcement dramatically increases DV risk (abusers threaten to report). 18 member orgs statewide. Safe Connect hotline available 24/7 in ALL languages. 16 shelter locations statewide." },
      economic_crisis:  { committed:true,  role:"DV + Housing Safety Net",      responseTime:"24 hrs",  shelter:85, mentalHealth:65 },
      natural_disaster: { committed:true,  role:"Emergency Shelter + DV",       responseTime:"4 hrs",   shelter:90, mentalHealth:70 },
      pandemic:         { committed:true,  role:"DV + Mental Health",           responseTime:"8 hrs",   shelter:80, mentalHealth:70 },
    },
  },
  {
    id: "greater_hartford_legal", name: "Greater Hartford Legal Aid", shortName: "Greater Hartford Legal",
    type: "legal", county: "Hartford", lat: 41.764, lng: -72.681,
    budget: 6_000_000, website: "ghla.org",
    resources: { legal:75, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:35 },
    elasticity: { legal:0.2 },
    trustScore: 90, dataSource: "990 + Website",
    connections: ["hartford_fdn","ccp","ct_legal","aclu_ct","oia","charter_oak"],
    contact: { phone:"(860) 541-5000", hotline:"(860) 541-5000", address:"999 Asylum Ave, Hartford CT 06105" },
    description: "Civil legal aid for Hartford County. Immigration unit active. Equal justice mission. Deep Hartford community ties. Serves low-income regardless of status.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal Defense – Greater Hartford", responseTime:"4–8 hrs",
        legal:85,
        notes:"Hartford County focus. Immigration unit handles removal defense, VAWA, asylum. Emergency intake capacity. Coordinates with IRIS for wraparound services. 860-541-5000." },
      economic_crisis:  { committed:true,  role:"Civil Legal Aid",              responseTime:"24 hrs",  legal:85 },
      natural_disaster: { committed:true,  role:"Disaster Legal",               responseTime:"24 hrs",  legal:75 },
      pandemic:         { committed:true,  role:"Benefits + Housing Legal",     responseTime:"24 hrs",  legal:80 },
    },
  },
  {
    id: "chcact", name: "CT Health Center Association (CHCACT)", shortName: "CHCACT",
    type: "mentalHealth", county: "Hartford", lat: 41.765, lng: -72.680,
    budget: 5_000_000, website: "chcact.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:50, financialAid:0, communications:60 },
    elasticity: { communications:0.4, mentalHealth:0.1 },
    trustScore: 84, dataSource: "Website + HRSA",
    connections: ["ccp","hartford_fdn","chc","charter_oak","clifford_beers","oia","ct_211"],
    contact: { phone:"(860) 656-4003", hotline:null, address:"745 Main St, Hartford CT 06103" },
    description: "Association of ALL CT community health centers (FQHCs). Coordinates 16 FQHCs statewide. All FQHCs serve regardless of immigration status. Networks 400+ clinicians. Policy + coordination capacity.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"FQHC Network Coordination – Statewide Health Access", responseTime:"24 hrs",
        mentalHealth:60, communications:70,
        notes:"Can issue guidance to ALL 16 CT FQHCs to serve immigrant community without documentation. Coordinates statewide network. FQHCs collectively see 250K+ patients/year. Can rapidly disseminate KYR + health access info to all FQHC patients." },
      economic_crisis:  { committed:true,  role:"FQHC Coordination",           responseTime:"24 hrs",  mentalHealth:60, communications:65 },
      natural_disaster: { committed:true,  role:"Health Network Coordination",  responseTime:"24 hrs",  mentalHealth:55 },
      pandemic:         { committed:true,  role:"Primary Health Coordination",  responseTime:"8 hrs",   mentalHealth:65, communications:75 },
    },
  },
  {
    id: "ct_students_dream", name: "CT Students for a Dream", shortName: "CT Students Dream",
    type: "advocacy", county: "Hartford", lat: 41.761, lng: -72.682,
    budget: 200_000, website: "ct4adream.org",
    resources: { legal:20, shelter:0, food:0, mentalHealth:10, financialAid:20000, communications:80 },
    elasticity: { communications:0.5, legal:0.2, financialAid:0.3 },
    trustScore: 72, dataSource: "Website",
    connections: ["cira","make_road","neighbor_fund","unidad_latina","ct_voices","oia"],
    contact: { phone:null, hotline:null, address:"Hartford, CT" },
    description: "Youth-led DACA and undocumented student advocacy. Statewide network on college campuses. KYR workshops. 3,560 active DACA recipients in CT. Campus rapid response network.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Youth Network + Campus Rapid Response", responseTime:"1–2 hrs",
        communications:85, financialAid:25000,
        notes:"Statewide campus network activates rapidly. Deep DACA community connections. Youth peer support. KYR workshops at colleges. Emergency student support fund. Connects to Neighbor Fund for bail/financial support." },
      economic_crisis:  { committed:true,  role:"Student + Youth Advocacy",    responseTime:"24 hrs",  communications:75 },
      natural_disaster: { committed:false, role:"Limited",                     responseTime:"N/A" },
      pandemic:         { committed:true,  role:"Student Resource Navigation", responseTime:"24 hrs",  communications:75 },
    },
  },
  {
    id: "sw_community_health", name: "Southwest Community Health Center", shortName: "SW Community Health",
    type: "mentalHealth", county: "Fairfield", lat: 41.175, lng: -73.192,
    budget: 15_000_000, website: "swchc.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:75, financialAid:0, communications:30 },
    elasticity: { mentalHealth:0.2 },
    trustScore: 83, dataSource: "HRSA + Website",
    connections: ["fairfield_fdn","make_road","int_institute","chcact","ct_211"],
    contact: { phone:"(203) 330-6000", hotline:null, address:"1425 Success Ave, Bridgeport CT 06610" },
    description: "FQHC in Bridgeport. Serves all regardless of status or insurance. Behavioral health + primary care. Bilingual Spanish staff. Covers Fairfield County immigrant health gap.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Health + Mental Health – Bridgeport Area", responseTime:"24 hrs",
        mentalHealth:80,
        notes:"FQHC — serves ALL regardless of immigration status. Bridgeport anchor health org. Spanish-language capacity. Crisis counseling available. Coordinates with Make the Road + Int'l Institute." },
      economic_crisis:  { committed:true,  role:"Health Safety Net",           responseTime:"24 hrs",  mentalHealth:80 },
      natural_disaster: { committed:true,  role:"Health Response",             responseTime:"8 hrs",   mentalHealth:75 },
      pandemic:         { committed:true,  role:"Primary Health",              responseTime:"8 hrs",   mentalHealth:80 },
    },
  },
  {
    id: "wave_bridgeport", name: "WAVE Inc. (Bridgeport Anti-Violence)", shortName: "WAVE Bridgeport",
    type: "advocacy", county: "Fairfield", lat: 41.179, lng: -73.186,
    budget: 1_200_000, website: "waveinc.org",
    resources: { legal:10, shelter:0, food:20, mentalHealth:30, financialAid:30000, communications:65 },
    elasticity: { communications:0.4, mentalHealth:0.2, financialAid:0.3 },
    trustScore: 75, dataSource: "Website",
    connections: ["fairfield_fdn","make_road","sw_community_health","ct_211"],
    contact: { phone:"(203) 384-0819", hotline:null, address:"340 Peet St, Bridgeport CT 06608" },
    description: "Bridgeport community violence prevention + youth services. Deep community trust in underserved neighborhoods. Mutual aid, food, mental health. Strong Latinx community connections.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Community Mutual Aid + KYR – Bridgeport Neighborhoods", responseTime:"2–4 hrs",
        communications:70, financialAid:40000, mentalHealth:35,
        notes:"Deep trust in Bridgeport's hardest-hit neighborhoods. Peer network can spread KYR info rapidly. Mutual aid for families of detained. Food + emergency support. Coordinates with Make the Road." },
      economic_crisis:  { committed:true,  role:"Community Mutual Aid",        responseTime:"8 hrs",   communications:65, food:30 },
      natural_disaster: { committed:true,  role:"Community Response",          responseTime:"4 hrs",   communications:70 },
      pandemic:         { committed:true,  role:"Community Health",            responseTime:"8 hrs",   communications:65, mentalHealth:35 },
    },
  },
  {
    id: "new_britain_legal", name: "New Britain Legal Assistance", shortName: "New Britain Legal",
    type: "legal", county: "Hartford", lat: 41.661, lng: -72.779,
    budget: 2_000_000, website: "newbritainla.org",
    resources: { legal:65, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:25 },
    elasticity: { legal:0.15 },
    trustScore: 78, dataSource: "Website",
    connections: ["hartford_fdn","ct_legal","ciri","ccf","uw_hartford"],
    contact: { phone:"(860) 225-8678", hotline:null, address:"166 W Main St, New Britain CT 06051" },
    description: "Legal aid for New Britain + Central CT. Large Polish, Puerto Rican, and immigrant populations in New Britain. Immigration cases, housing, family law. Fills geographic gap between Hartford and Waterbury.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal Aid – New Britain + Central CT", responseTime:"8 hrs",
        legal:70,
        notes:"New Britain has large immigrant community (43% non-English at home). Covers geographic gap between Hartford + Waterbury. Immigration cases, emergency housing, family separation." },
      economic_crisis:  { committed:true,  role:"Civil Legal Aid",             responseTime:"24 hrs",  legal:70 },
      natural_disaster: { committed:true,  role:"Disaster Legal",              responseTime:"24 hrs",  legal:60 },
      pandemic:         { committed:true,  role:"Benefits Legal",              responseTime:"24 hrs",  legal:65 },
    },
  },
  {
    id: "junta", name: "Junta for Progressive Action", shortName: "Junta",
    type: "advocacy", county: "New Haven", lat: 41.305, lng: -72.934,
    budget: 1_500_000, website: "juntainc.org",
    resources: { legal:30, shelter:0, food:20, mentalHealth:20, financialAid:50000, communications:75 },
    elasticity: { legal:0.3, communications:0.5, financialAid:0.4 },
    trustScore: 82, dataSource: "990 + Website",
    connections: ["new_haven_fdn","unidad_latina","iris","nhla","new_haven_city","ct_voices"],
    contact: { phone:"(203) 787-0191", hotline:null, address:"169 Grand Ave, New Haven CT 06513" },
    description: "Est. 1969. New Haven's oldest Latino community org. Comprehensive services: legal, employment, youth, housing. Deep Latinx community roots. Community leadership development. Fair Haven neighborhood anchor.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Community Hub + Legal Referrals – Fair Haven/New Haven", responseTime:"1–2 hrs",
        legal:50, communications:80, financialAid:70000,
        notes:"50+ year presence in Fair Haven — highest immigrant concentration in New Haven. Community members trust Junta before any other institution. Emergency community meetings. Rapid KYR dissemination. Legal referral hub for neighborhood." },
      economic_crisis:  { committed:true,  role:"Community Hub + Services",   responseTime:"4 hrs",   communications:75, food:30 },
      natural_disaster: { committed:true,  role:"Community Response",          responseTime:"2 hrs",   communications:80 },
      pandemic:         { committed:true,  role:"Community Health + Services", responseTime:"4 hrs",   communications:75, mentalHealth:25 },
    },
  },
  {
    id: "caritas", name: "Caritas of Waterbury", shortName: "Caritas Waterbury",
    type: "food", county: "New Haven", lat: 41.558, lng: -73.047,
    budget: 900_000, website: "caritasofwaterbury.org",
    resources: { legal:0, shelter:10, food:80, mentalHealth:10, financialAid:30000, communications:30 },
    elasticity: { food:0.3, shelter:0.1 },
    trustScore: 76, dataSource: "Website",
    connections: ["ccf","ct_food_bank","catholic_charities","cceh"],
    contact: { phone:"(203) 755-1196", hotline:null, address:"56 Prospect St, Waterbury CT 06702" },
    description: "Waterbury food pantry + social services. Naugatuck Valley anchor. Serves large immigrant population in Waterbury. Food, clothing, emergency assistance. Fills critical Waterbury gap.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Food + Emergency Aid – Waterbury/Naugatuck Valley", responseTime:"24 hrs",
        food:90, financialAid:35000,
        notes:"Waterbury is home to large Guatemalan and Haitian immigrant communities that CCF (the main funder) has limited immigrant-org connections to. Caritas is the on-the-ground food + emergency services anchor for this gap region." },
      economic_crisis:  { committed:true,  role:"Food + Emergency Aid",        responseTime:"24 hrs",  food:95 },
      natural_disaster: { committed:true,  role:"Emergency Food",              responseTime:"8 hrs",   food:100 },
      pandemic:         { committed:true,  role:"Food Distribution",           responseTime:"24 hrs",  food:90 },
    },
  },
  {
    id: "bridgeport_city", name: "City of Bridgeport (Mayor's Office)", shortName: "Bridgeport City",
    type: "government", county: "Fairfield", lat: 41.179, lng: -73.188,
    budget: 600_000_000, website: "bridgeportct.gov",
    resources: { legal:10, shelter:20, food:20, mentalHealth:0, financialAid:200000, communications:70 },
    elasticity: { communications:0.2, financialAid:0.1 },
    trustScore: 68, dataSource: "City website",
    connections: ["fairfield_fdn","make_road","int_institute","uw_fairfield","sw_community_health","oia"],
    contact: { phone:"(203) 576-7201", hotline:null, address:"45 Lyon Terrace, Bridgeport CT 06604" },
    description: "CT's largest city. ~40K immigrants (22% of population). Sanctuary city policy. Emergency management. Office of Diversity + Equity. Mayor's office can issue rapid public communications.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Sanctuary City + Emergency Comms – Bridgeport", responseTime:"4–8 hrs",
        communications:75, financialAid:100000,
        notes:"Sanctuary policy limits ICE cooperation. Mayor can issue public statements + Spanish-language communications rapidly. Emergency management capacity. Largest immigrant city in CT by count. City ID program." },
      economic_crisis:  { committed:true,  role:"Emergency Relief",            responseTime:"1 week",  financialAid:250000 },
      natural_disaster: { committed:true,  role:"Emergency Management",        responseTime:"1 hr",    communications:80, shelter:40 },
      pandemic:         { committed:true,  role:"Public Health",               responseTime:"2 hrs",   communications:75 },
    },
  },

  // ── UPDATED CIRI DATA (serves 5,003 in 2025 — major update) ─────────────
  // CIRI data significantly understated — update with 2025 real figures
);

// ── UPDATE CIRI WITH REAL 2025 DATA ──────────────────────────────────────────
const ciriOrg = ORGS.find(o => o.id === 'ciri');
if (ciriOrg) {
  ciriOrg.budget = 8_000_000; // updated
  ciriOrg.description = "Est. 1918. In 2025 served 5,003 refugees, immigrants, trafficking survivors & unaccompanied children. Immigration Legal Services served 3,186 clients statewide. Project Rescue: 209 trafficking survivors. 4 offices: Stamford, Bridgeport, Waterbury, Hartford. Only statewide DOJ-recognized nonprofit.";
  ciriOrg.trustScore = 96;
  ciriOrg.dataSource = "990 + Website + 2025 Annual Data";
  if (ciriOrg.scenarioCommitments.ice_raid) {
    ciriOrg.scenarioCommitments.ice_raid.notes = "2025: served 3,186 immigration legal clients statewide. 4 offices = Stamford, Bridgeport, Waterbury, Hartford. BIA + DOJ recognized. Emergency capacity. Project Rescue for trafficking survivors.";
  }
}

// ── UPDATE IRIS WITH REAL 2025 DATA (lost $4M, shut Hartford office) ─────────
const irisOrg = ORGS.find(o => o.id === 'iris');
if (irisOrg) {
  irisOrg.description = "CRITICAL 2025 UPDATE: Lost $4M federal funding, shut Hartford office, laid off staff. FY2025: served 2,000+ people, resettled only 241 refugees (vs 800 planned). Relocated New Haven office. Realigning focus to housing, food, health, ELL. Still active — mission unchanged.";
  irisOrg.budget = 11_000_000; // reduced from federal funding loss
  irisOrg.trustScore = 99;
  if (irisOrg.scenarioCommitments.ice_raid) {
    irisOrg.scenarioCommitments.ice_raid.notes = "2025 CONTEXT: IRIS lost $4M in federal funding and shut Hartford office but remains active in New Haven. KYR in 12 languages. Rapid response team. AG Tong spoke at IRIS-organized New London event. CRITICAL but under-resourced — emergency funding essential.";
  }
}

// ── WIRE NEW TIER 4 ORGS INTO NETWORK ────────────────────────────────────────
const TIER4_BACK = {
  ccp:           ["cfect","ccadv","chcact","nlg_ct","ct_students_dream"],
  hartford_fdn:  ["greater_hartford_legal","new_britain_legal","ccadv","chcact"],
  new_haven_fdn: ["junta","caritas"],
  fairfield_fdn: ["sw_community_health","wave_bridgeport","bridgeport_city"],
  aclu_ct:       ["nlg_ct","ccadv"],
  cira:          ["ct_students_dream","neighbor_fund","nlg_ct","cfect"],
  make_road:     ["wave_bridgeport","bridgeport_city","junta"],
  iris:          ["junta","cfect","greater_hartford_legal"],
  ct_legal:      ["greater_hartford_legal","new_britain_legal","iasc"],
  nhla:          ["junta"],
  ct_bail_fund:  ["nlg_ct","neighbor_fund"],
  oia:           ["bridgeport_city","chcact","ct_students_dream"],
  cceh:          ["ccadv","united_services"],
  catholic_charities: ["catholic_norwich","caritas"],
  chc:           ["chcact","sw_community_health"],
  unidad_latina: ["junta"],
  hartford_city: ["greater_hartford_legal"],
  ag_office:     ["nlg_ct","greater_hartford_legal"],
};

Object.entries(TIER4_BACK).forEach(([orgId, newConns]) => {
  const org = ORGS.find(o => o.id === orgId);
  if (!org) return;
  newConns.forEach(newId => {
    if (!org.connections.includes(newId)) org.connections.push(newId);
  });
});

// ── CONTACT DATA PATCH 2 — remaining orgs ────────────────────────────────────
const CONTACT_DATA_2 = {
  ccp:             { phone:"(860) 525-5585", hotline:null,             address:"221 Main St, Hartford CT 06106" },
  hartford_fdn:    { phone:"(860) 548-1888", hotline:null,             address:"Ten Columbus Blvd, Hartford CT 06106" },
  fairfield_fdn:   { phone:"(203) 750-3200", hotline:null,             address:"40 Richards Ave, Norwalk CT 06854" },
  new_haven_fdn:   { phone:"(203) 777-2386", hotline:null,             address:"70 Audubon St, New Haven CT 06510" },
  ccf:             { phone:"(203) 753-1315", hotline:null,             address:"43 Field St, Waterbury CT 06702" },
  iris:            { phone:"(203) 562-2095", hotline:null,             address:"75 Hamilton St, New Haven CT 06511" },
  ct_legal:        { phone:"(203) 946-4811", hotline:"(800) 798-0671", address:"Multiple offices statewide" },
  nhla:            { phone:"(203) 946-4811", hotline:null,             address:"205 Orange St, New Haven CT 06510" },
  yale_legal:      { phone:"(203) 432-4800", hotline:null,             address:"127 Wall St, New Haven CT 06511" },
  aclu_ct:         { phone:"(860) 523-9146", hotline:null,             address:"765 Asylum Ave, Hartford CT 06105" },
  make_road:       { phone:"(203) 549-5220", hotline:"(203) 549-5220", address:"220 Clinton Ave, Bridgeport CT 06605" },
  cira:            { phone:"(860) 906-8000", hotline:"(860) 906-8000", address:"P.O. Box 1323, Hartford CT 06143" },
  int_institute:   { phone:"(203) 336-0141", hotline:null,             address:"670 Clinton Ave, Bridgeport CT 06605" },
  columbus_house:  { phone:"(203) 776-9008", hotline:null,             address:"42 Clifton St, New Haven CT 06513" },
  mutual_housing:  { phone:"(860) 560-5880", hotline:null,             address:"261 Ann Uccello St, Hartford CT 06103" },
  foodshare:       { phone:"(860) 286-9999", hotline:null,             address:"450 Woodland Ave, Bloomfield CT 06002" },
  ct_food_bank:    { phone:"(203) 469-5000", hotline:null,             address:"2 Research Pkwy, Wallingford CT 06492" },
  mental_health_ct:{ phone:"(860) 882-0236", hotline:"(800) 564-7600", address:"1 Regency Dr, Bloomfield CT 06002" },
  chc:             { phone:"(860) 347-6971", hotline:null,             address:"635 Main St, Middletown CT 06457" },
  catholic_charities:{phone:"(860) 548-2000",hotline:null,             address:"467 Bloomfield Ave, Bloomfield CT 06002" },
  oia:             { phone:"(860) 256-2897", hotline:null,             address:"450 Capitol Ave, Hartford CT 06106" },
  circ:            { phone:"(860) 906-8000", hotline:null,             address:"Hartford, CT" },
  charter_oak:     { phone:"(860) 247-8941", hotline:null,             address:"21 Grand St, Hartford CT 06106" },
  cceh:            { phone:"(860) 721-7876", hotline:null,             address:"30 Jordan Lane, Wethersfield CT 06109" },
  south_park:      { phone:"(860) 724-5991", hotline:null,             address:"75 Main St, Hartford CT 06106" },
  loaves_fishes:   { phone:"(203) 624-3253", hotline:null,             address:"120 Léo Paul Dion Dr, New Haven CT 06513" },
  end_hunger_ct:   { phone:"(860) 760-2467", hotline:null,             address:"1 Regency Dr, Bloomfield CT 06002" },
  ct_voices:       { phone:"(203) 498-4240", hotline:null,             address:"33 Whitney Ave, New Haven CT 06510" },
  unidad_latina:   { phone:"(203) 776-2520", hotline:null,             address:"37 Howe St, New Haven CT 06511" },
  sanctuary_ct:    { phone:null,             hotline:"(860) 519-0966",  address:"Hartford, CT" },
  ag_office:       { phone:"(860) 808-5318", hotline:null,             address:"165 Capitol Ave, Hartford CT 06106" },
  hartford_city:   { phone:"(860) 757-9500", hotline:null,             address:"550 Main St, Hartford CT 06103" },
  uw_hartford:     { phone:"(860) 493-6800", hotline:"211",            address:"One State St Suite 1710, Hartford CT 06103" },
  uw_fairfield:    { phone:"(203) 792-5330", hotline:"211",            address:"301 Main St Suite 2-5, Danbury CT 06810" },
  uw_new_haven:    { phone:"(203) 777-2009", hotline:"211",            address:"370 James St Suite 204, New Haven CT 06513" },
  ct_211:          { phone:"211",            hotline:"211",            address:"Statewide helpline" },
  ct_naacp:        { phone:"(860) 951-3939", hotline:null,             address:"Hartford, CT" },
  yale_hospital:   { phone:"(203) 688-4242", hotline:"911",            address:"20 York St, New Haven CT 06510" },
  hartford_hospital:{ phone:"(860) 972-1000",hotline:"911",            address:"80 Seymour St, Hartford CT 06102" },
  ct_ed_dept:      { phone:"(860) 713-6543", hotline:null,             address:"450 Columbus Blvd, Hartford CT 06103" },
  clifford_beers:  { phone:"(203) 772-1270", hotline:null,             address:"1 Long Wharf Dr, New Haven CT 06511" },
  new_haven_city:  { phone:"(203) 946-8200", hotline:null,             address:"165 Church St, New Haven CT 06510" },
  new_haven_police:{ phone:"(203) 946-6316", hotline:"911",            address:"1 Union Ave, New Haven CT 06519" },
  open_doors:      { phone:"(203) 874-1225", hotline:null,             address:"26 Sycamore St, Milford CT 06460" },
  ct_bail_fund:    { phone:null,             hotline:null,             address:"Hartford, CT" },
  carc:            { phone:"(860) 232-9816", hotline:null,             address:"41 New Britain Ave, Hartford CT 06052" },
  cfect:           { phone:"(860) 442-3572", hotline:null,             address:"68 Federal St, New London CT 06320" },
  united_services: { phone:"(860) 774-2020", hotline:"(860) 774-2020", address:"132 Pomfret St, Putnam CT 06260" },
  nlg_ct:          { phone:"(203) 896-7221", hotline:"(203) 896-7221", address:"New Haven, CT" },
  greater_hartford_legal: { phone:"(860) 541-5000", hotline:"(860) 541-5000", address:"999 Asylum Ave, Hartford CT 06105" },
  chcact:          { phone:"(860) 656-4003", hotline:null,             address:"745 Main St, Hartford CT 06103" },
  ct_students_dream:{ phone:null,            hotline:null,             address:"Hartford, CT" },
  sw_community_health:{ phone:"(203) 330-6000", hotline:null,          address:"1425 Success Ave, Bridgeport CT 06610" },
  wave_bridgeport: { phone:"(203) 384-0819", hotline:null,             address:"340 Peet St, Bridgeport CT 06608" },
  new_britain_legal:{ phone:"(860) 225-8678", hotline:null,            address:"166 W Main St, New Britain CT 06051" },
  junta:           { phone:"(203) 787-0191", hotline:null,             address:"169 Grand Ave, New Haven CT 06513" },
  caritas:         { phone:"(203) 755-1196", hotline:null,             address:"56 Prospect St, Waterbury CT 06702" },
  bridgeport_city: { phone:"(203) 576-7201", hotline:null,             address:"45 Lyon Terrace, Bridgeport CT 06604" },
};

Object.entries(CONTACT_DATA_2).forEach(([id, contact]) => {
  const org = ORGS.find(o => o.id === id);
  if (org && !org.contact) org.contact = contact;
  else if (org && org.contact) {
    // Merge — don't overwrite existing good data
    if (!org.contact.phone && contact.phone) org.contact.phone = contact.phone;
    if (!org.contact.address && contact.address) org.contact.address = contact.address;
  }
});

// ── TIER 5: FINAL COVERAGE EXPANSION ─────────────────────────────────────────
ORGS.push(

  // ── STAMFORD / FAIRFIELD ANCHOR ───────────────────────────────────────────
  {
    id: "b1c", name: "Building One Community (B1C)", shortName: "B1C Stamford",
    type: "legal", county: "Fairfield", lat: 41.048, lng: -73.541,
    budget: 5_000_000, website: "b1c.org",
    resources: { legal:70, shelter:0, food:0, mentalHealth:20, financialAid:100000, communications:60 },
    elasticity: { legal:0.3, financialAid:0.3, communications:0.4 },
    trustScore: 91, dataSource: "990 + MacKenzie Scott $2M grant 2024",
    connections: ["fairfield_fdn","uw_fairfield","make_road","int_institute","ciri","sw_community_health","bridgeport_city"],
    contact: { phone:"(203) 674-8585", hotline:null, address:"417 Shippan Ave, Stamford CT 06902" },
    description: "Founded 2011. Stamford anchor for 33%-immigrant-population city. 18,245 served from 126 countries, 49 languages. DOJ-accredited immigration legal services. ESL, workforce dev, family services. $2M MacKenzie Scott grant 2024. Purchased permanent home in 2025.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Legal + Community Hub – Stamford/SW Fairfield", responseTime:"2–4 hrs",
        legal:85, communications:75, financialAid:150000,
        notes:"Stamford is 33% immigrant. B1C is the TRUSTED first contact for thousands of Stamford immigrants. DOJ-accredited legal services. Community training on immigration policies already active in 2025. Strong volunteer network. Rapid KYR dissemination." },
      economic_crisis:  { committed:true,  role:"Workforce + Legal + Services", responseTime:"24 hrs", legal:80 },
      natural_disaster: { committed:true,  role:"Community Hub",                responseTime:"8 hrs",  communications:70 },
      pandemic:         { committed:true,  role:"Health + Legal Navigation",    responseTime:"24 hrs", mentalHealth:30 },
    },
  },

  // ── TOLLAND COUNTY ────────────────────────────────────────────────────────
  {
    id: "uconn", name: "University of Connecticut (Undocumented Student Resources)", shortName: "UConn",
    type: "government", county: "Tolland", lat: 41.808, lng: -72.252,
    budget: 1_800_000_000, website: "undocumented.uconn.edu",
    resources: { legal:20, shelter:30, food:20, mentalHealth:50, financialAid:500000, communications:70 },
    elasticity: { mentalHealth:0.15, communications:0.3, financialAid:0.1 },
    trustScore: 82, dataSource: "UConn website + HR pages 2025",
    connections: ["ct_students_dream","cfect","neighbor_fund","cira","oia","chcact"],
    contact: { phone:"(860) 486-1111", hotline:"(800) 676-4357", address:"233 Glenbrook Rd, Storrs CT 06269" },
    description: "CT's flagship public university. Sanctuary-equivalent policies: UConn Police will NOT inquire about immigration status or honor ICE administrative warrants. 2025: active support for international + undocumented students amid visa revocations. 30,000+ students in Tolland County.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Campus Safe Haven + Student Support – Tolland County", responseTime:"4–8 hrs",
        mentalHealth:60, communications:75, financialAid:200000,
        notes:"UConn Police policy: will NOT detain based on immigration status. Dean of Students active support. Mental health services available. 2025: already responding to visa revocations. EAP hotline 1-800-676-4357. Campus covers entire Tolland County gap." },
      economic_crisis:  { committed:true,  role:"Student Support + EAP",       responseTime:"24 hrs", mentalHealth:65 },
      natural_disaster: { committed:true,  role:"Campus Emergency",             responseTime:"IMMEDIATE", shelter:40, communications:80 },
      pandemic:         { committed:true,  role:"Campus Health",                responseTime:"IMMEDIATE", mentalHealth:70, communications:80 },
    },
  },

  // ── LITCHFIELD COUNTY ─────────────────────────────────────────────────────
  {
    id: "nccf", name: "Northwest CT Community Foundation", shortName: "NW CT Foundation",
    type: "foundation", county: "Litchfield", lat: 41.786, lng: -73.097,
    budget: 3_000_000, website: "yournccf.org",
    resources: { legal:0, shelter:0, food:10, mentalHealth:0, financialAid:300000, communications:30 },
    elasticity: { financialAid:0.2, communications:0.2 },
    trustScore: 78, dataSource: "Website + 2024 grants list",
    connections: ["ccp","uw_hartford","catholic_charities"],
    contact: { phone:"(860) 626-1245", hotline:null, address:"32 City Hall Pl, Torrington CT 06790" },
    description: "Only community foundation in Litchfield County. Serves all 26 NW CT towns. $3M/yr grants. Torrington-based. Food, housing, basic needs priority. 2025 active grants for NW corner immigrant support.",
    scenarioCommitments: {
      ice_raid:         { committed:false, role:"Funder – Litchfield County (GAP)", responseTime:"1–2 wks",
        financialAid:80000,
        notes:"⚠ Litchfield County has ~3K undocumented and NO dedicated immigrant service orgs. NCCF is the ONLY philanthropic infrastructure. Would need urgent outreach from CCP to activate emergency grants. Catholic Charities Hartford is only service provider with any rural reach here." },
      economic_crisis:  { committed:true,  role:"Basic Needs Funder",           responseTime:"1 week", financialAid:150000 },
      natural_disaster: { committed:true,  role:"Emergency Funder",             responseTime:"1 week", financialAid:120000 },
      pandemic:         { committed:true,  role:"Basic Needs Funder",           responseTime:"1 week", financialAid:120000 },
    },
  },
  {
    id: "susan_anthony_project", name: "Susan B. Anthony Project", shortName: "SBA Project",
    type: "shelter", county: "Litchfield", lat: 41.800, lng: -73.121,
    budget: 3_500_000, website: "sbaproject.org",
    resources: { legal:10, shelter:70, food:20, mentalHealth:50, financialAid:50000, communications:40 },
    elasticity: { shelter:0.2, mentalHealth:0.15 },
    trustScore: 80, dataSource: "Website + CCADV membership",
    connections: ["nccf","ccadv","ct_food_bank","uw_hartford"],
    contact: { phone:"(860) 482-7133", hotline:"(888) 774-2900", address:"73 E Albert St, Torrington CT 06790" },
    description: "DV shelter + services for Litchfield County. CCADV member. 24-hr crisis line. Emergency shelter. Serves all regardless of status. Covers Torrington + northwest CT — region with no other shelter capacity.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Shelter + DV Services – Litchfield", responseTime:"IMMEDIATE",
        shelter:75, mentalHealth:55,
        notes:"ICE enforcement dramatically increases DV risk. SBA Project serves ALL regardless of immigration status. Emergency shelter in Torrington — critical for Litchfield County which has NO other shelter. CCADV Safe Connect hotline: 888-774-2900." },
      economic_crisis:  { committed:true,  role:"DV + Emergency Shelter",      responseTime:"IMMEDIATE", shelter:80, mentalHealth:60 },
      natural_disaster: { committed:true,  role:"Emergency Shelter",            responseTime:"4 hrs",     shelter:85 },
      pandemic:         { committed:true,  role:"Shelter + Mental Health",      responseTime:"8 hrs",     shelter:75, mentalHealth:60 },
    },
  },

  // ── NEW HAVEN ANCHORS (MISSING) ───────────────────────────────────────────
  {
    id: "community_soup_kitchen", name: "Community Soup Kitchen (New Haven)", shortName: "Community Soup Kitchen",
    type: "food", county: "New Haven", lat: 41.307, lng: -72.929,
    budget: 2_000_000, website: "csknewhaven.org",
    resources: { legal:0, shelter:0, food:90, mentalHealth:0, financialAid:0, communications:25 },
    elasticity: { food:0.4 },
    trustScore: 82, dataSource: "Website + IRIS partnership 2024",
    connections: ["new_haven_fdn","iris","loaves_fishes","columbus_house","junta"],
    contact: { phone:"(203) 777-1561", hotline:null, address:"84 Howe St, New Haven CT 06511" },
    description: "86,000+ meals in 2024 across multiple New Haven locations. 93% program expense ratio. 2024: formal IRIS partnership to expand food access for immigrant community. No-questions-asked. Goal: 380K meals/year by 2027.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Meals – New Haven (IRIS Partnership)", responseTime:"24 hrs",
        food:120,
        notes:"2024 formal partnership with IRIS to expand immigrant food access. No-questions-asked policy. 86K meals/yr base capacity with 40%+ surge. Multiple New Haven locations. Partners with IRIS for coordinated immigrant household distribution." },
      economic_crisis:  { committed:true,  role:"Community Meals",             responseTime:"24 hrs", food:130 },
      natural_disaster: { committed:true,  role:"Emergency Meals",             responseTime:"8 hrs",  food:140 },
      pandemic:         { committed:true,  role:"Meal Distribution",           responseTime:"24 hrs", food:125 },
    },
  },

  // ── STATEWIDE INFRASTRUCTURE ─────────────────────────────────────────────
  {
    id: "ct_judicial", name: "CT Judicial Branch / Legal Aid Hotline", shortName: "CT Judicial / SLS",
    type: "legal", county: "Hartford", lat: 41.764, lng: -72.674,
    budget: 200_000_000, website: "jud.ct.gov",
    resources: { legal:50, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:50 },
    elasticity: { legal:0.05, communications:0.1 },
    trustScore: 80, dataSource: "State website",
    connections: ["ct_legal","aclu_ct","greater_hartford_legal","nhla","ag_office"],
    contact: { phone:"(860) 263-2734", hotline:"(800) 453-3320", address:"231 Capitol Ave, Hartford CT 06106" },
    description: "CT Judicial Branch + Statewide Legal Services Hotline (800-453-3320). Immigration court jurisdiction. Crime victim compensation fund. Pro se assistance. Emergency legal orders. Interpreter services in all courts.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Emergency Court Access + SLS Hotline", responseTime:"24 hrs",
        legal:55, communications:55,
        notes:"SLS Hotline 800-453-3320 provides legal advice regardless of immigration status. Courts cannot be used as enforcement tools. Interpreter services in all courts. Emergency TROs possible. Crime victim compensation fund available to all regardless of status." },
      economic_crisis:  { committed:true,  role:"Civil Court + Legal Aid",     responseTime:"24 hrs", legal:55 },
      natural_disaster: { committed:true,  role:"Emergency Court Orders",      responseTime:"24 hrs", legal:50 },
      pandemic:         { committed:true,  role:"Remote Court Access",         responseTime:"24 hrs", legal:50 },
    },
  },
);

// ── WIRE TIER 5 INTO EXISTING NETWORK ────────────────────────────────────────
const TIER5_BACK = {
  fairfield_fdn:     ["b1c"],
  make_road:         ["b1c"],
  cira:              ["uconn"],
  ct_students_dream: ["uconn"],
  ccp:               ["nccf","uconn","b1c","community_soup_kitchen"],
  hartford_fdn:      ["ct_judicial"],
  new_haven_fdn:     ["community_soup_kitchen"],
  iris:              ["community_soup_kitchen"],
  ct_legal:          ["ct_judicial"],
  aclu_ct:           ["ct_judicial"],
  ccadv:             ["susan_anthony_project"],
  catholic_charities:["nccf","susan_anthony_project"],
  neighbor_fund:     ["uconn"],
  uw_hartford:       ["nccf"],
};

Object.entries(TIER5_BACK).forEach(([orgId, newConns]) => {
  const org = ORGS.find(o => o.id === orgId);
  if (!org) return;
  newConns.forEach(newId => {
    if (!org.connections.includes(newId)) org.connections.push(newId);
  });
});

// Add contact info for Tier 5
const TIER5_CONTACTS = {
  nccf:   { phone:"(860) 626-1245", hotline:null,           address:"32 City Hall Pl, Torrington CT 06790" },
  uconn:  { phone:"(860) 486-1111", hotline:"(800) 676-4357",address:"233 Glenbrook Rd, Storrs CT 06269" },
  ct_judicial: { phone:"(860) 263-2734", hotline:"(800) 453-3320", address:"231 Capitol Ave, Hartford CT 06106" },
};
Object.entries(TIER5_CONTACTS).forEach(([id, contact]) => {
  const org = ORGS.find(o => o.id === id);
  if (org && !org.contact) org.contact = contact;
});

// ── TIER 6: ORGS ACTIVE IN 2025 ICE RESPONSE ─────────────────────────────────
ORGS.push(
  {
    id: "hartford_deportation_defense",
    name: "Hartford Deportation Defense", shortName: "Hartford Deport. Defense",
    type: "advocacy", county: "Hartford", lat: 41.763, lng: -72.682,
    budget: 80_000, website: "hartforddeportationdefense.org",
    resources: { legal:10, shelter:0, food:0, mentalHealth:0, financialAid:10000, communications:85 },
    elasticity: { communications:0.7, financialAid:0.4 },
    trustScore: 72, dataSource: "CT Mirror 2026",
    connections: ["cira","sanctuary_ct","make_road","nlg_ct","aclu_ct","hartford_city"],
    contact: { phone:null, hotline:null, address:"Hartford, CT" },
    description: "Grassroots direct action org. Active since 2025 ICE surge. Vigils, community rapid response, direct witness at ICE operations. Jan 2026: federal vehicle struck protester at their vigil — HPD investigation opened. Deep street-level trust.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Direct Action + Rapid Witness Network – Hartford", responseTime:"30 min",
        communications:90,
        notes:"On-the-ground witnesses at enforcement operations. Vigil network activates within 30 minutes. Documents rights violations. Partners with Jewish Voice for Peace + Sanctuary CT. Jan 2026: already responding to federal vehicle/protester incident." },
      economic_crisis:  { committed:true,  role:"Community Organizing",       responseTime:"24 hrs", communications:70 },
      natural_disaster: { committed:false, role:"Limited",                    responseTime:"N/A" },
      pandemic:         { committed:false, role:"Limited",                    responseTime:"N/A" },
    },
  },
  {
    id: "danbury_deportation_defense",
    name: "Danbury Deportation Defense / Comunidades Sin Fronteras", shortName: "Danbury Deport. Defense",
    type: "advocacy", county: "Fairfield", lat: 41.395, lng: -73.454,
    budget: 60_000, website: "comunidadesct.org",
    resources: { legal:10, shelter:0, food:0, mentalHealth:0, financialAid:10000, communications:85 },
    elasticity: { communications:0.7, financialAid:0.3 },
    trustScore: 70, dataSource: "CT Mirror + CT Public 2025",
    connections: ["cira","make_road","nlg_ct","fairfield_fdn","uw_fairfield"],
    contact: { phone:null, hotline:null, address:"Danbury, CT" },
    description: "Danbury-based response to 2025 ICE surge. Aug 2025: organized 100+ person protest at Danbury courthouse after 65 arrested in 4-day 'Operation Broken Trust'. Active petition for Danbury city ICE restrictions. Strong Ecuadoran + Guatemalan community ties.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Rapid Response + Advocacy – Danbury (ICE Hotspot)", responseTime:"30 min",
        communications:90, financialAid:15000,
        notes:"Danbury had 13 arrests (Jan-Jun 2025) + 65 in 4-day operation = highest-density enforcement zone in CT. 100+ person protest infrastructure ready. Petition for city-level ICE restrictions active. Ecuadoran community (23.7% of CT arrests) primary constituency." },
      economic_crisis:  { committed:true,  role:"Community Organizing",       responseTime:"24 hrs", communications:70 },
      natural_disaster: { committed:false, role:"Limited",                    responseTime:"N/A" },
      pandemic:         { committed:false, role:"Limited",                    responseTime:"N/A" },
    },
  },
  {
    id: "husky_immigrants",
    name: "Husky 4 Immigrants", shortName: "Husky 4 Immigrants",
    type: "advocacy", county: "Hartford", lat: 41.761, lng: -72.681,
    budget: 50_000, website: "husky4immigrants.org",
    resources: { legal:10, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:75 },
    elasticity: { communications:0.5, legal:0.2 },
    trustScore: 68, dataSource: "CT Mirror March 2026",
    connections: ["ct_students_dream","cira","aclu_ct","oia","ag_office"],
    contact: { phone:null, hotline:null, address:"Hartford, CT" },
    description: "Immigrant healthcare access advocacy. Active at March 2026 CT legislative hearings on ICE accountability. Advocates for hospital safety + community health access for immigrants regardless of status. Partners with CT for All Coalition.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Healthcare Access Advocacy + Legislative Pressure", responseTime:"4–8 hrs",
        communications:75,
        notes:"Active at March 2026 CT hearings on ICE accountability. Advocates for hospital safe spaces. Patients should feel safe seeking medical care — core message. Legislative pressure arm." },
      economic_crisis:  { committed:true,  role:"Health Access Advocacy",     responseTime:"24 hrs", communications:65 },
      natural_disaster: { committed:false, role:"Limited",                    responseTime:"N/A" },
      pandemic:         { committed:true,  role:"Health Access Advocacy",     responseTime:"24 hrs", communications:70 },
    },
  },
  {
    id: "ct_for_all",
    name: "Connecticut for All Coalition", shortName: "CT for All",
    type: "advocacy", county: "Hartford", lat: 41.762, lng: -72.680,
    budget: 200_000, website: "ctforall.org",
    resources: { legal:0, shelter:0, food:0, mentalHealth:0, financialAid:0, communications:90 },
    elasticity: { communications:0.6 },
    trustScore: 74, dataSource: "CT Mirror March 2026",
    connections: ["cira","ct_students_dream","husky_immigrants","make_road","sanctuary_ct","aclu_ct"],
    contact: { phone:null, hotline:null, address:"Hartford, CT" },
    description: "Statewide coalition coordinating immigrant safe spaces advocacy. March 2026: active at CT legislature hearings. Focus: schools, churches, hospitals, mosques as safe spaces free from ICE enforcement. Faith + educator + health community alignment.",
    scenarioCommitments: {
      ice_raid:         { committed:true,  role:"Safe Spaces Coalition + Legislative Pressure – Statewide", responseTime:"2–4 hrs",
        communications:90,
        notes:"Coordinating faith leaders, teachers, healthcare workers to advocate for safe spaces. March 2026 hearings showed massive public support. Partners: CT Students for a Dream, Husky 4 Immigrants, Comunidades Sin Fronteras. Amplifies CIRA alert network with institutional voice." },
      economic_crisis:  { committed:true,  role:"Coalition Advocacy",         responseTime:"24 hrs", communications:75 },
      natural_disaster: { committed:false, role:"Limited",                    responseTime:"N/A" },
      pandemic:         { committed:true,  role:"Health Safe Spaces",         responseTime:"24 hrs", communications:80 },
    },
  },
);

// Wire Tier 6 back-connections
const TIER6_BACK = {
  cira:          ["hartford_deportation_defense","danbury_deportation_defense","ct_for_all"],
  make_road:     ["danbury_deportation_defense","ct_for_all"],
  aclu_ct:       ["hartford_deportation_defense","husky_immigrants","ct_for_all"],
  sanctuary_ct:  ["hartford_deportation_defense","ct_for_all"],
  ct_students_dream: ["ct_for_all","husky_immigrants"],
  hartford_city: ["hartford_deportation_defense"],
  oia:           ["husky_immigrants"],
};
Object.entries(TIER6_BACK).forEach(([orgId, newConns]) => {
  const org = ORGS.find(o => o.id === orgId);
  if (!org) return;
  newConns.forEach(id => { if (!org.connections.includes(id)) org.connections.push(id); });
});

// ── EDGES — computed LAST after ALL patches and back-connections are applied ──
export const EDGES = (() => {
  const out = [], seen = new Set();
  ORGS.forEach(org => {
    (org.connections || []).forEach(tid => {
      const key = [org.id, tid].sort().join("--");
      if (!seen.has(key) && ORGS.find(o => o.id === tid)) {
        seen.add(key);
        out.push({ source: org.id, target: tid });
      }
    });
  });
  return out;
})();

// ── GEO COORDINATE PATCHES — real street-level coordinates ──────────────────
// Spreads Hartford + New Haven clusters to actual building addresses
const GEO_PATCHES = {
  // Hartford metro — spread across real city geography
  ccp:            { lat: 41.7654, lng: -72.6866 }, // 221 Main St
  hartford_fdn:   { lat: 41.7619, lng: -72.6743 }, // 10 Columbus Blvd
  mutual_housing: { lat: 41.7698, lng: -72.6885 }, // 261 Ann Uccello St
  aclu_ct:        { lat: 41.7647, lng: -72.7018 }, // 765 Asylum Ave
  mental_health_ct:{ lat: 41.7821, lng: -72.7102}, // Bloomfield
  uw_hartford:    { lat: 41.7661, lng: -72.6756 }, // One State St
  ct_211:         { lat: 41.7662, lng: -72.6740 }, // statewide
  foodshare:      { lat: 41.8207, lng: -72.7294 }, // 450 Woodland Ave Bloomfield
  end_hunger_ct:  { lat: 41.7821, lng: -72.7101 }, // Bloomfield
  catholic_charities:{lat:41.7817,lng:-72.7212},   // 467 Bloomfield Ave
  cira:           { lat: 41.7601, lng: -72.6952 }, // Hartford office
  circ:           { lat: 41.7595, lng: -72.6958 },
  south_park:     { lat: 41.7588, lng: -72.6821 }, // 75 Main St
  hartford_city:  { lat: 41.7640, lng: -72.6812 }, // 550 Main St
  ag_office:      { lat: 41.7641, lng: -72.6846 }, // 165 Capitol Ave
  oia:            { lat: 41.7648, lng: -72.6849 }, // 450 Capitol Ave
  ct_ed_dept:     { lat: 41.7643, lng: -72.6820 }, // 450 Columbus Blvd
  hartford_hospital:{ lat:41.7633,lng:-72.6751},   // 80 Seymour St
  cceh:           { lat: 41.7155, lng: -72.6543 }, // Wethersfield
  charter_oak:    { lat: 41.7564, lng: -72.6828 }, // 21 Grand St
  carc:           { lat: 41.7499, lng: -72.7022 }, // New Britain Ave
  sanctuary_ct:   { lat: 41.7680, lng: -72.6920 }, // Hartford
  ct_naacp:       { lat: 41.7670, lng: -72.6900 }, // Hartford
  hartford_deportation_defense: { lat: 41.7630, lng: -72.6960 },
  husky_immigrants: { lat: 41.7610, lng: -72.6890 },
  ct_for_all:     { lat: 41.7670, lng: -72.6870 },
  ct_students_dream: { lat: 41.7645, lng: -72.6856 },
  chcact:         { lat: 41.7630, lng: -72.6896 }, // 745 Main St
  ct_bail_fund:   { lat: 41.7660, lng: -72.6920 },
  ccadv:          { lat: 41.7618, lng: -72.6930 },
  greater_hartford_legal: { lat: 41.7762, lng: -72.7002 }, // 999 Asylum Ave
  nhpd:           { lat: 41.7544, lng: -72.6884 }, // New Haven
  ct_judicial:    { lat: 41.7639, lng: -72.6841 }, // 231 Capitol Ave
  // New Haven metro
  iris:           { lat: 41.3144, lng: -72.9233 }, // 75 Hamilton St
  nhla:           { lat: 41.3076, lng: -72.9265 }, // 205 Orange St
  yale_legal:     { lat: 41.3112, lng: -72.9246 }, // 127 Wall St
  new_haven_fdn:  { lat: 41.3072, lng: -72.9246 }, // 70 Audubon
  loaves_fishes:  { lat: 41.3096, lng: -72.9190 }, // 120 Leo Paul Dion Dr
  clifford_beers: { lat: 41.2972, lng: -72.9092 }, // 1 Long Wharf Dr
  ct_voices:      { lat: 41.3091, lng: -72.9264 }, // 33 Whitney Ave
  unidad_latina:  { lat: 41.3103, lng: -72.9299 }, // 37 Howe St
  junta:          { lat: 41.3054, lng: -72.9219 }, // 169 Grand Ave
  columbus_house: { lat: 41.2981, lng: -72.9318 }, // 42 Clifton St
  community_soup_kitchen: { lat: 41.3102, lng: -72.9295 }, // 84 Howe St
  uw_new_haven:   { lat: 41.3142, lng: -72.9192 }, // 370 James St
  new_haven_city: { lat: 41.3082, lng: -72.9262 }, // 165 Church St
  yale_hospital:  { lat: 41.3040, lng: -72.9391 }, // 20 York St
  open_doors:     { lat: 41.2268, lng: -73.0562 }, // Milford
  nlg_ct:         { lat: 41.3110, lng: -72.9270 }, // New Haven
};

Object.entries(GEO_PATCHES).forEach(([id, coords]) => {
  const org = ORGS.find(o => o.id === id);
  if (org) { org.lat = coords.lat; org.lng = coords.lng; }
});

// ── FINAL ADDITIONS: WATERBURY + MISSING CRITICAL ORGS ──────────────────────
ORGS.push(
  {
    id: "caritas_waterbury",
    name: "Caritas of Waterbury", shortName: "Caritas Waterbury",
    type: "faith", county: "New Haven", lat: 41.5580, lng: -73.0505,
    budget: 2_500_000, website: "caritasofwaterbury.org",
    resources: { legal:10, shelter:20, food:80, mentalHealth:20, financialAid:80000, communications:30 },
    elasticity: { food:0.35, financialAid:0.3 },
    trustScore: 79, dataSource: "Website + CCF partnership",
    connections: ["ccf","catholic_charities","ct_food_bank","caritas"],
    contact: { phone:"(203) 757-8396", hotline:null, address:"56 Prospect St, Waterbury CT 06702" },
    description: "Catholic social services for Waterbury/Naugatuck Valley. Food pantry serving 500+ families/month. Emergency financial assistance, clothing, immigration support navigation. Key hub for Waterbury's large Latino community.",
    scenarioCommitments: {
      ice_raid:         { committed:true, role:"Emergency Food + Financial Aid – Waterbury", responseTime:"24 hrs",
        food:100, financialAid:60000,
        notes:"Waterbury had 14 ICE arrests Jan-Jun 2025. Caritas serves hundreds of undocumented Waterbury families. Food pantry + emergency funds. Faith-based sanctuary ethic — serves all regardless of status." },
      economic_crisis:  { committed:true, role:"Food + Emergency Aid", responseTime:"24 hrs", food:100 },
      natural_disaster: { committed:true, role:"Emergency Food", responseTime:"8 hrs", food:90 },
      pandemic:         { committed:true, role:"Food Distribution", responseTime:"24 hrs", food:90 },
    },
  },
  {
    id: "dvsc_new_haven",
    name: "Domestic Violence Services of Greater New Haven", shortName: "DVSC New Haven",
    type: "shelter", county: "New Haven", lat: 41.3165, lng: -72.9290,
    budget: 4_500_000, website: "dvscgnh.org",
    resources: { legal:30, shelter:80, food:20, mentalHealth:60, financialAid:50000, communications:40 },
    elasticity: { shelter:0.25, mentalHealth:0.2 },
    trustScore: 81, dataSource: "Website + CCADV directory",
    connections: ["ccadv","new_haven_fdn","uw_new_haven","nhla","clifford_beers"],
    contact: { phone:"(203) 789-8104", hotline:"(203) 789-8104", address:"P.O. Box 1329, New Haven CT 06505" },
    description: "24-hr crisis shelter for DV survivors in Greater New Haven. CCADV member. Legal advocacy, housing placement, children's services. Serves all regardless of immigration status. ICE enforcement dramatically increases DV risk — orgs like this are on the front line.",
    scenarioCommitments: {
      ice_raid:         { committed:true, role:"DV Emergency Shelter + Legal Advocacy – New Haven", responseTime:"IMMEDIATE",
        shelter:90, mentalHealth:65, legal:35,
        notes:"ICE enforcement dramatically increases DV risk as abusers use immigration threat as control. DVSC serves all regardless of status. 24-hr crisis line. Emergency shelter. Legal advocates help survivors navigate immigration + DV systems simultaneously. CCADV Safe Connect: (888) 774-2900." },
      economic_crisis:  { committed:true, role:"DV Shelter + Services", responseTime:"IMMEDIATE", shelter:90 },
      natural_disaster: { committed:true, role:"Emergency Shelter", responseTime:"IMMEDIATE", shelter:85 },
      pandemic:         { committed:true, role:"DV Shelter + Remote Services", responseTime:"IMMEDIATE", shelter:85 },
    },
  },
  {
    id: "loaves_new_milford",
    name: "Loaves & Fishes of New Milford (Litchfield)", shortName: "Loaves & Fishes NM",
    type: "food", county: "Litchfield", lat: 41.5773, lng: -73.4081,
    budget: 1_200_000, website: "loavesandfishesofnewmilford.org",
    resources: { legal:0, shelter:0, food:85, mentalHealth:0, financialAid:0, communications:20 },
    elasticity: { food:0.4 },
    trustScore: 76, dataSource: "Litchfield Magazine 2024 + Website",
    connections: ["nccf","susan_anthony_project","ct_food_bank"],
    contact: { phone:"(860) 355-3372", hotline:null, address:"16 Bank St, New Milford CT 06776" },
    description: "30+ years serving daily meals in New Milford, western Litchfield County. No-questions-asked meals. Partners with food rescue networks. Critical for a county with no dedicated immigrant services — serves all regardless of status.",
    scenarioCommitments: {
      ice_raid:         { committed:true, role:"Emergency Meals – Litchfield County", responseTime:"24 hrs",
        food:90,
        notes:"New Milford is in western Litchfield County — an area with essentially no other immigrant service infrastructure. Loaves & Fishes no-questions-asked policy makes it a critical touchpoint for undocumented families. Partners with NW CT Foundation for emergency funding." },
      economic_crisis:  { committed:true, role:"Community Meals", responseTime:"24 hrs", food:95 },
      natural_disaster: { committed:true, role:"Emergency Meals", responseTime:"8 hrs",  food:95 },
      pandemic:         { committed:true, role:"Meal Distribution", responseTime:"24 hrs", food:90 },
    },
  }
);

// Back-wire new orgs
const FINAL_BACK = {
  ccf:            ["caritas_waterbury"],
  ccadv:          ["dvsc_new_haven"],
  new_haven_fdn:  ["dvsc_new_haven"],
  ct_food_bank:   ["caritas_waterbury","loaves_new_milford"],
  nccf:           ["loaves_new_milford"],
};
Object.entries(FINAL_BACK).forEach(([id, newConns]) => {
  const org = ORGS.find(o => o.id === id);
  if (!org) return;
  newConns.forEach(c => { if (!org.connections.includes(c)) org.connections.push(c); });
});
