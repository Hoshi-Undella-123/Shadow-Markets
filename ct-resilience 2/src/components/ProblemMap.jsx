import { T, ORG_COLORS } from "../utils/colors.js";

// Problems in the CT nonprofit/philanthropy space (from whiteboard)
export const PROBLEMS = [
  { id:"no_collab",      label:"No Collaboration\nIncentives",      x:0.12, y:0.20, severity:"high" },
  { id:"decision_cost",  label:"High Cost of\nDecision Making",     x:0.30, y:0.10, severity:"high" },
  { id:"no_leader",      label:"No Trusted\nLeader",                x:0.50, y:0.08, severity:"high" },
  { id:"no_financial",   label:"No Financial\nIncentive to Collab", x:0.70, y:0.10, severity:"medium" },
  { id:"old_data",       label:"Old / Stale\nData in Sector",       x:0.88, y:0.22, severity:"high" },
  { id:"donor_info",     label:"Donors Uninformed\n(Give to Wrong)", x:0.82, y:0.42, severity:"medium" },
  { id:"fin_flows",      label:"Unclear Financial\nFlows (Gov↔Orgs)",x:0.68, y:0.58, severity:"medium" },
  { id:"lone_wolf",      label:"Philanthropy =\nLone Wolf Orgs",    x:0.50, y:0.65, severity:"high" },
  { id:"diff_views",     label:"Different Views\non Issues",         x:0.30, y:0.58, severity:"low"  },
  { id:"internal_flow",  label:"Internal Org\nFlow Problems",        x:0.12, y:0.42, severity:"medium"},
  { id:"no_map",         label:"No Ecosystem\nMap Exists",           x:0.20, y:0.82, severity:"high" },
  { id:"agency_prob",    label:"Agency\nProblem",                    x:0.50, y:0.85, severity:"high" },
  { id:"ice_pressure",   label:"ICE Enforcement\nPressure",          x:0.80, y:0.78, severity:"high" },
];

// Problem connections (what causes what / co-occurs)
export const PROBLEM_EDGES = [
  ["no_collab","no_leader"],["no_collab","no_financial"],["no_collab","lone_wolf"],
  ["no_leader","no_collab"],["no_leader","decision_cost"],
  ["old_data","donor_info"],["old_data","no_map"],["old_data","decision_cost"],
  ["donor_info","fin_flows"],["donor_info","no_financial"],
  ["lone_wolf","diff_views"],["lone_wolf","no_collab"],
  ["internal_flow","no_collab"],["internal_flow","decision_cost"],
  ["no_map","agency_prob"],["no_map","ice_pressure"],["no_map","donor_info"],
  ["agency_prob","no_financial"],["agency_prob","lone_wolf"],
  ["ice_pressure","no_map"],["ice_pressure","no_collab"],
  ["fin_flows","no_financial"],["diff_views","no_collab"],
];

// Which orgs address which problems
const ORG_ADDRESSES = {
  "ccp":              ["no_leader","no_collab","no_map","donor_info","old_data"],
  "hartford_fdn":     ["no_financial","donor_info","fin_flows"],
  "fairfield_fdn":    ["no_financial","donor_info"],
  "new_haven_fdn":    ["no_financial","donor_info","fin_flows"],
  "cfect":            ["no_financial","no_map","donor_info"],
  "iris":             ["ice_pressure","no_map","no_collab"],
  "cira":             ["ice_pressure","no_map","no_collab","no_leader"],
  "circ":             ["ice_pressure","no_collab","agency_prob"],
  "make_road":        ["ice_pressure","lone_wolf","no_collab"],
  "aclu_ct":          ["ice_pressure","agency_prob"],
  "nlg_ct":           ["ice_pressure","agency_prob"],
  "ct_legal":         ["ice_pressure","agency_prob"],
  "greater_hartford_legal": ["ice_pressure","agency_prob"],
  "iasc":             ["ice_pressure","no_map"],
  "nhla":             ["ice_pressure","agency_prob"],
  "ciri":             ["ice_pressure","no_map"],
  "junta":            ["ice_pressure","no_collab","lone_wolf"],
  "unidad_latina":    ["ice_pressure","no_collab","lone_wolf"],
  "sanctuary_ct":     ["ice_pressure","no_collab"],
  "ag_office":        ["ice_pressure","agency_prob"],
  "hartford_city":    ["ice_pressure","no_map"],
  "oia":              ["ice_pressure","no_map","fin_flows"],
  "catholic_charities":["lone_wolf","no_collab"],
  "neighbor_fund":    ["ice_pressure","no_financial","agency_prob"],
  "ct_bail_fund":     ["ice_pressure","no_financial","agency_prob"],
  "ct_voices":        ["no_map","old_data","donor_info","agency_prob"],
  "ccadv":            ["ice_pressure","no_collab","lone_wolf"],
  "cceh":             ["no_map","no_collab","lone_wolf"],
  "end_hunger_ct":    ["no_map","no_collab","donor_info"],
  "chc":              ["no_collab","diff_views"],
  "mental_health_ct": ["no_collab","internal_flow"],
  "charter_oak":      ["no_collab","diff_views"],
};

const SEVERITY_COLOR = { high:"#EF4444", medium:"#F59E0B", low:"#3B82F6" };

export default function ProblemMap({ orgs, onSelectOrg }) {
  const W = 700, H = 420;

  return (
    <div style={{
      width:"100%", height:"100%", position:"relative",
      background:T.bg, overflow:"hidden",
      fontFamily:"system-ui, sans-serif",
    }}>
      <div style={{
        padding:"10px 16px", borderBottom:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", gap:"10px",
      }}>
        <div>
          <div style={{ fontSize:"12px", fontWeight:700, color:T.text }}>Problem Correlation Map</div>
          <div style={{ fontSize:"9px", color:T.muted }}>
            How CT nonprofit challenges interconnect — and which orgs address them
          </div>
        </div>
        <div style={{ marginLeft:"auto", display:"flex", gap:"8px" }}>
          {Object.entries(SEVERITY_COLOR).map(([s,c]) => (
            <div key={s} style={{ display:"flex", alignItems:"center", gap:"4px", fontSize:"9px", color:T.muted }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:c }}/>
              {s} severity
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"calc(100% - 44px)" }}>
        <defs>
          <pattern id="pgrid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1E3050" strokeWidth="0.4"/>
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#pgrid)"/>

        {/* Problem edges */}
        {PROBLEM_EDGES.map(([a,b], i) => {
          const pa = PROBLEMS.find(p => p.id===a), pb = PROBLEMS.find(p => p.id===b);
          if (!pa || !pb) return null;
          return (
            <line key={i}
              x1={pa.x*W} y1={pa.y*H} x2={pb.x*W} y2={pb.y*H}
              stroke="#1E3A5F" strokeWidth={1.5} opacity={0.6}/>
          );
        })}

        {/* Problem nodes */}
        {PROBLEMS.map(p => {
          const addressedBy = Object.entries(ORG_ADDRESSES)
            .filter(([,probs]) => probs.includes(p.id))
            .map(([orgId]) => orgs.find(o => o.id===orgId))
            .filter(Boolean);
          const col = SEVERITY_COLOR[p.severity];
          const r = 22 + addressedBy.length * 2;
          return (
            <g key={p.id} transform={`translate(${p.x*W},${p.y*H})`}>
              {/* Glow */}
              <circle r={r+4} fill={col} opacity={0.08}/>
              {/* Main */}
              <circle r={r} fill={col+"22"} stroke={col} strokeWidth={1.5} opacity={0.9}/>
              {/* Coverage dots */}
              {addressedBy.slice(0,5).map((org, oi) => {
                const angle = (oi / Math.max(addressedBy.length,1)) * Math.PI * 2 - Math.PI/2;
                const dr = r - 5;
                return (
                  <circle key={org.id}
                    cx={Math.cos(angle)*dr} cy={Math.sin(angle)*dr}
                    r={3} fill={ORG_COLORS[org.type]} opacity={0.9}/>
                );
              })}
              {/* Label */}
              {p.label.split("\n").map((line, li) => (
                <text key={li} textAnchor="middle"
                  y={(li - (p.label.split("\n").length-1)/2) * 10}
                  fill={col} fontSize="7.5" fontWeight="700"
                  fontFamily="system-ui">
                  {line}
                </text>
              ))}
              {/* Coverage count */}
              {addressedBy.length > 0 && (
                <text textAnchor="middle" y={r-3}
                  fill={col} fontSize="7" fontFamily="system-ui" opacity={0.7}>
                  {addressedBy.length} org{addressedBy.length!==1?"s":""}
                </text>
              )}
            </g>
          );
        })}

        {/* Core connector label */}
        <text x={W/2} y={H/2+4} textAnchor="middle"
          fill="#2A4070" fontSize="9" fontWeight="700" fontFamily="system-ui"
          letterSpacing="0.08em">
          CORE ISSUE: LACK OF COORDINATION
        </text>
      </svg>
    </div>
  );
}
