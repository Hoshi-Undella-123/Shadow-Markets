# CT Resilience Network
### Connecticut Council for Philanthropy — Community Preparedness Ecosystem Map

A fully interactive tool for mapping Connecticut's philanthropic and nonprofit ecosystem,
analyzing resource coverage gaps, and coordinating response under crisis scenarios.

---

## Quick Start

```bash
npm install
npm run dev          # development server at http://localhost:5173
npm run build        # production build → dist/
npm run preview      # preview production build at http://localhost:4173
```

---

## What It Does

### 5 Views
| View | Description |
|---|---|
| **⬡ Network** | D3 force graph — drag nodes, scroll to zoom, click to inspect any org |
| **📍 Geographic Map** | CT county-level placement of all organizations |
| **🔗 Problem Map** | Correlation web of CT nonprofit ecosystem problems from whiteboard session |
| **⚡ Compare** | Side-by-side heatmap of coverage across all 4 scenarios |
| *(Org Detail)* | Click any node to open full profile in right panel |

### 5 Scenarios
- 🌐 Normal Operations
- 🚨 ICE Enforcement Action ← primary focus
- 📉 Economic Crisis
- 🌪 Natural Disaster
- 🏥 Public Health Emergency

### Right Panel Tabs
- **📊 Gap Analysis** — coverage % vs estimated demand, uncommitted orgs, critical gaps
- **⚡ Coordinate** — activation timeline (who does what in what order when scenario fires)
- **Org Detail** — full profile: budget, resources, trust score breakdown, elasticity chart

### Other Features
- 🔍 **Search** — instant fuzzy search by name, county, or org type
- 📊 **Export Report** — print-ready HTML report, Print → PDF
- **+ Submit Data** — private 4-step org self-report form (increases trust score)
- **Filter bar** — by org type, county
- **Trust Score System** — 4-factor dynamic scoring with improvement suggestions
- **Elasticity Chart** — baseline vs scenario-projected resource capacity per org

---

## Architecture

```
src/
  data/
    orgs.js          ← All 32 CT organizations + auto-generated EDGES
    scenarios.js     ← SCENARIOS, DEMANDS, computeGaps(), SCENARIO_GAPS
  utils/
    colors.js        ← Design tokens, ORG_COLORS, RES_META
    helpers.js       ← nodeRadius, nodeColor, fmtMoney, CT geo utils
    trust.js         ← Trust score computation engine
    report.js        ← Print/PDF report generator
  components/
    Toolbar.jsx           ← All controls: scenarios, views, search, filters, export
    SearchBar.jsx         ← Fuzzy search with dropdown
    NetworkGraph.jsx      ← D3 force simulation
    GeoMap.jsx            ← Geographic CT county map
    OrgPanel.jsx          ← Full org detail panel
    GapPanel.jsx          ← Coverage bars, gaps, uncommitted orgs
    CoordinationPanel.jsx ← Activation timeline by response window
    ScenarioComparison.jsx← Side-by-side heatmap + org matrix
    ElasticityChart.jsx   ← Baseline vs scenario resource capacity
    DataEntryPanel.jsx    ← Private org self-report (4 steps)
    ProblemMap.jsx        ← Problem correlation network
  App.jsx                 ← Thin orchestrator, state only
```

---

## Adding a New Organization

Edit `src/data/orgs.js`. Copy any existing org block and fill in:

```js
{
  id: "unique_id",           // snake_case, unique
  name: "Full Org Name",
  shortName: "Short Name",   // shown on network nodes
  type: "foundation",        // foundation|legal|shelter|food|mentalHealth|advocacy|government|faith
  county: "Hartford",        // CT county
  lat: 41.76,                // approximate lat/lng for geo map
  lng: -72.68,
  budget: 5_000_000,         // annual budget in dollars
  website: "example.org",
  resources: {               // current baseline capacity (% or $ for financialAid)
    legal: 0,
    shelter: 0,
    food: 0,
    mentalHealth: 0,
    financialAid: 0,
    communications: 0,
  },
  elasticity: {              // fraction capacity can surge (e.g. 0.3 = 30% surge possible)
    financialAid: 0.2,
  },
  trustScore: 80,            // 0–100, overridden dynamically by trust engine
  dataSource: "Website",     // used in trust score
  connections: ["other_org_id"], // org IDs this org connects to
  description: "...",
  scenarioCommitments: {
    ice_raid: {
      committed: true,       // or false
      role: "Lead Response Hub",
      responseTime: "4–8 hrs",
      legal: 80,             // scenario-specific resource levels (optional)
      financialAid: 500000,
      notes: "Details of what they'll do...",
    },
    economic_crisis: { ... },
    natural_disaster: { ... },
    pandemic: { ... },
  },
}
```

---

## Adding a New Scenario

Edit `src/data/scenarios.js`:

1. Add to `SCENARIOS` object
2. Add to `DEMANDS` object (estimated resource needs)
3. Add to `SCENARIO_GAPS` (known gaps to call out in gap panel)
4. Add commitments for the new scenario in each org in `orgs.js`

---

## Trust Score System

Each org gets a dynamic trust score from 4 factors (`src/utils/trust.js`):

| Factor | Weight | Description |
|---|---|---|
| Data Source Quality | 35% | 990+field report > website only |
| Commitment Depth | 30% | How specific are scenario commitments |
| Network Density | 20% | How many verified connections |
| Self-Reported | 15% | Org submitted private data form |

Orgs can increase their score by:
- Submitting via the "Submit Data" form (adds self-reported factor)
- CCP staff verifying submission
- Adding more partner connections

---

## Future Roadmap

- [ ] **Backend API** — replace static `orgs.js` with database (Supabase/Airtable)
- [ ] **Auth layer** — CCP staff login for private org data management
- [ ] **Real-time updates** — WebSocket or polling for live data changes
- [ ] **Email alerts** — notify org contacts when scenario is activated
- [ ] **Mobile app** — React Native version for field coordination
- [ ] **More CT orgs** — currently 32, goal is 150+
- [ ] **Funding flows** — visualize grant relationships between funders and grantees
- [ ] **Historical data** — track resource changes over time
- [ ] **Minneapolis comparison** — import their ecosystem for side-by-side gap analysis

---

## Data Sources

All data is from public sources:
- IRS Form 990 filings (ProPublica Nonprofit Explorer)
- Organization websites
- DOJ/BIA recognition databases
- CT state government websites
- Connecticut Foundation Stats (connecticut.foundationcenter.org)

Trust scores reflect data quality and recency. Organizations can submit private
updates via the "Submit Data" form — reviewed by CCP staff before publishing.

---

## Built For

Connecticut Council for Philanthropy (ctphilanthropy.org)
Inspired by learnings from Minneapolis community response gaps.
