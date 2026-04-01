import { T, ORG_COLORS } from "../utils/colors.js";
import { toXY, COUNTY_CENTERS } from "../utils/helpers.js";
import { GEOGRAPHIC_GAPS } from "../data/scenarios.js";

const CT_COUNTIES = {
  Fairfield:    { latMin:41.00, latMax:41.35, lngMin:-73.73, lngMax:-73.13 },
  "New Haven":  { latMin:41.19, latMax:41.60, lngMin:-73.13, lngMax:-72.65 },
  Hartford:     { latMin:41.59, latMax:42.05, lngMin:-73.00, lngMax:-72.35 },
  Middlesex:    { latMin:41.33, latMax:41.63, lngMin:-72.68, lngMax:-72.28 },
  Tolland:      { latMin:41.73, latMax:42.05, lngMin:-72.53, lngMax:-72.05 },
  Windham:      { latMin:41.70, latMax:42.05, lngMin:-72.16, lngMax:-71.79 },
  "New London": { latMin:41.28, latMax:41.75, lngMin:-72.16, lngMax:-71.79 },
  Litchfield:   { latMin:41.40, latMax:42.05, lngMin:-73.55, lngMax:-73.00 },
};

const getRisk = county => {
  const g = GEOGRAPHIC_GAPS?.find(g => g.county === county);
  return g?.risk || null;
};

const RISK_COLOR = { high:"#EF4444", medium:"#F59E0B", low:"#3B82F6", null:"#22C55E" };
const RISK_LABEL = { high:"Critical Gap", medium:"Partial Coverage", low:"Minimal Gap", null:"Covered" };

export default function CountyCoveragePanel({ orgs, scenario, onSelectOrg }) {
  // Count committed orgs per county for this scenario
  const countyStats = {};
  Object.keys(COUNTY_CENTERS).forEach(county => {
    const countyOrgs = orgs.filter(o => o.county === county);
    const committed  = scenario === "normal"
      ? countyOrgs.length
      : countyOrgs.filter(o => o.scenarioCommitments?.[scenario]?.committed).length;
    const gap = GEOGRAPHIC_GAPS?.find(g => g.county === county);
    countyStats[county] = {
      total: countyOrgs.length,
      committed,
      gap,
      risk: gap?.risk || (countyOrgs.length === 0 ? "high" : committed === 0 ? "high" : "null"),
      undocEst: {
        Fairfield: "~45K", Hartford: "~35K", "New Haven": "~28K",
        Middlesex: "~5K", "New London": "~6K", Tolland: "~3K",
        Windham: "~4K", Litchfield: "~3K",
      }[county] || "?",
    };
  });

  const W = 700, H = 360;
  const PAD = { l:20, r:20, t:20, b:20 };
  const cw = W - PAD.l - PAD.r;
  const ch = H - PAD.t - PAD.b;

  return (
    <div style={{ height:"100%", overflowY:"auto", fontFamily:"system-ui, sans-serif", color:T.text }}>
      <div style={{ padding:"14px 16px", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ fontSize:"13px", fontWeight:700 }}>Geographic Coverage</div>
        <div style={{ fontSize:"10px", color:T.muted, marginTop:"2px" }}>
          Which CT counties have committed org coverage — and where are the gaps?
        </div>
      </div>

      {/* County cards */}
      <div style={{ padding:"12px 16px" }}>
        {Object.entries(countyStats).map(([county, stats]) => {
          const rCol = RISK_COLOR[stats.risk] || RISK_COLOR.null;
          const rLab = RISK_LABEL[stats.risk] || "Covered";
          const pct  = stats.total > 0 ? Math.round((stats.committed / stats.total) * 100) : 0;
          return (
            <div key={county} style={{
              background:T.bg, borderRadius:"8px", padding:"10px 12px",
              marginBottom:"8px", border:`1px solid ${rCol}44`,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"6px" }}>
                <div>
                  <span style={{ fontSize:"12px", fontWeight:700, color:T.text }}>{county} County</span>
                  <span style={{ marginLeft:"8px", fontSize:"9px", color:T.muted }}>
                    est. {stats.undocEst} undocumented
                  </span>
                </div>
                <span style={{
                  fontSize:"9px", fontWeight:700, color:rCol,
                  background:rCol+"18", border:`1px solid ${rCol}44`,
                  borderRadius:"4px", padding:"1px 6px",
                }}>
                  {rLab}
                </span>
              </div>

              {/* Org count bar */}
              <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
                <div style={{ flex:1, height:"6px", background:"#060C16",
                  borderRadius:"3px", overflow:"hidden", border:`1px solid ${T.border}` }}>
                  <div style={{
                    height:"100%", width:`${pct}%`, borderRadius:"3px",
                    background:rCol, transition:"width 0.5s ease",
                  }}/>
                </div>
                <span style={{ fontSize:"9px", color:rCol, fontWeight:700, flexShrink:0 }}>
                  {stats.committed}/{stats.total} orgs committed
                </span>
              </div>

              {/* Org dots */}
              <div style={{ display:"flex", flexWrap:"wrap", gap:"3px", marginBottom: stats.gap ? "6px" : 0 }}>
                {orgs.filter(o => o.county === county).map(org => {
                  const isCommitted = scenario === "normal" || org.scenarioCommitments?.[scenario]?.committed;
                  return (
                    <span key={org.id}
                      onClick={() => onSelectOrg(org.id)}
                      title={org.name}
                      style={{
                        fontSize:"8px", padding:"1px 5px", borderRadius:"3px",
                        cursor:"pointer",
                        background: isCommitted ? ORG_COLORS[org.type]+"22" : "#1A0A0A",
                        border:`1px solid ${isCommitted ? ORG_COLORS[org.type]+"66" : T.border}`,
                        color: isCommitted ? ORG_COLORS[org.type] : T.dim,
                      }}>
                      {org.shortName}
                    </span>
                  );
                })}
                {stats.total === 0 && (
                  <span style={{ fontSize:"9px", color:T.red, fontStyle:"italic" }}>
                    No mapped organizations
                  </span>
                )}
              </div>

              {/* Gap note */}
              {stats.gap && (
                <div style={{
                  fontSize:"9px", color:T.amber, lineHeight:1.6,
                  borderTop:`1px solid ${T.border}`, paddingTop:"5px", marginTop:"5px"
                }}>
                  ⚠ {stats.gap.note}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ padding:"0 16px 16px" }}>
        <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
          {Object.entries(RISK_COLOR).map(([risk, col]) => (
            <div key={risk} style={{ display:"flex", alignItems:"center", gap:"4px",
              fontSize:"9px", color:T.muted }}>
              <span style={{ width:"8px", height:"8px", borderRadius:"50%", background:col }}/>
              {RISK_LABEL[risk]}
            </div>
          ))}
        </div>
        <div style={{ marginTop:"8px", fontSize:"9px", color:T.dim, lineHeight:1.6 }}>
          Undocumented population estimates from American Immigration Council + IRIS data.
          Click any org badge to view full profile.
        </div>
      </div>
    </div>
  );
}
