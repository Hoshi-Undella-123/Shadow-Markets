import { T, RES_META } from "../utils/colors.js";
import { fmtMoney } from "../utils/helpers.js";
import { SCENARIOS, DEMANDS, computeGaps } from "../data/scenarios.js";

const SCENARIO_IDS = ["ice_raid", "economic_crisis", "natural_disaster", "pandemic"];
const RES_ORDER    = ["financialAid","legal","shelter","food","mentalHealth","communications"];

export default function ScenarioComparison({ orgs }) {
  const allGaps = SCENARIO_IDS.map(sid => ({
    sid,
    s:    SCENARIOS[sid],
    gaps: computeGaps(sid, orgs),
  }));

  // For each org, show its commitment status across all scenarios
  const orgMatrix = orgs.map(org => ({
    org,
    scenarios: SCENARIO_IDS.map(sid => org.scenarioCommitments?.[sid] ?? null),
  }));

  return (
    <div style={{
      height:"100%", overflowY:"auto", padding:"16px",
      color:T.text, fontFamily:"system-ui, sans-serif",
    }}>
      <div style={{ fontSize:"13px", fontWeight:700, marginBottom:"4px" }}>
        Scenario Comparison
      </div>
      <div style={{ fontSize:"10px", color:T.muted, marginBottom:"16px" }}>
        Coverage across all 4 scenarios — see where CT is most and least prepared
      </div>

      {/* Coverage heat grid */}
      <div style={{
        fontSize:"9px", fontWeight:800, letterSpacing:"0.1em", color:T.muted,
        textTransform:"uppercase", marginBottom:"8px",
        borderBottom:`1px solid ${T.border}`, paddingBottom:"4px",
      }}>RESOURCE COVERAGE HEATMAP</div>

      {/* Header row */}
      <div style={{ display:"grid", gridTemplateColumns:`80px repeat(${SCENARIO_IDS.length}, 1fr)`,
        gap:"4px", marginBottom:"4px" }}>
        <div/>
        {allGaps.map(({ s, sid }) => (
          <div key={sid} style={{
            textAlign:"center", fontSize:"9px", color:s.color,
            fontWeight:700, padding:"3px 2px",
          }}>
            {s.icon}<br/>{s.label.split(" ").slice(0,2).join(" ")}
          </div>
        ))}
      </div>

      {/* Resource rows */}
      {RES_ORDER.map(k => {
        const m = RES_META[k];
        return (
          <div key={k} style={{
            display:"grid", gridTemplateColumns:`80px repeat(${SCENARIO_IDS.length}, 1fr)`,
            gap:"4px", marginBottom:"3px", alignItems:"center",
          }}>
            <div style={{ fontSize:"9px", color:m.color, fontWeight:600,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {m.icon} {m.label}
            </div>
            {allGaps.map(({ sid, gaps }) => {
              const pct = Math.round(gaps?.coverage?.[k] || 0);
              const bg  = pct >= 70 ? T.green : pct >= 40 ? T.amber : T.red;
              return (
                <div key={sid} style={{
                  background:bg + "22", border:`1px solid ${bg}55`,
                  borderRadius:"4px", padding:"4px 2px",
                  textAlign:"center", fontSize:"9px",
                  color:bg, fontWeight:700,
                }}>
                  {pct}%
                </div>
              );
            })}
          </div>
        );
      })}

      {/* Committed org counts */}
      <div style={{ marginTop:"8px",
        display:"grid", gridTemplateColumns:`80px repeat(${SCENARIO_IDS.length}, 1fr)`,
        gap:"4px", alignItems:"center",
      }}>
        <div style={{ fontSize:"8px", color:T.dim }}>Committed<br/>orgs</div>
        {allGaps.map(({ sid, gaps }) => (
          <div key={sid} style={{
            textAlign:"center", fontSize:"11px", fontWeight:800,
            color:T.green, borderTop:`1px solid ${T.border}`, paddingTop:"4px",
          }}>
            {gaps?.committedCount || 0}
            <span style={{ fontSize:"7px", color:T.dim, display:"block", fontWeight:400 }}>
              / {gaps?.total || 0}
            </span>
          </div>
        ))}
      </div>

      {/* Per-scenario summary cards */}
      <div style={{
        fontSize:"9px", fontWeight:800, letterSpacing:"0.1em", color:T.muted,
        textTransform:"uppercase", margin:"16px 0 8px",
        borderBottom:`1px solid ${T.border}`, paddingBottom:"4px",
      }}>SCENARIO READINESS SCORES</div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginBottom:"16px" }}>
        {allGaps.map(({ sid, s, gaps }) => {
          if (!gaps) return null;
          const coverageVals = RES_ORDER.map(k => gaps.coverage?.[k] || 0);
          const avgCoverage  = Math.round(coverageVals.reduce((a,b)=>a+b,0) / coverageVals.length);
          const readinessCol = avgCoverage >= 65 ? T.green : avgCoverage >= 40 ? T.amber : T.red;
          const uncommitted  = orgs.filter(o => !o.scenarioCommitments?.[sid]?.committed).length;
          return (
            <div key={sid} style={{
              background:T.bg, borderRadius:"8px", padding:"10px 12px",
              border:`1px solid ${s.color}44`,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"6px" }}>
                <span style={{ fontSize:"14px" }}>{s.icon}</span>
                <div style={{ fontSize:"10px", fontWeight:700, color:T.text, lineHeight:1.2 }}>
                  {s.label}
                </div>
              </div>
              <div style={{ display:"flex", gap:"8px", alignItems:"flex-end" }}>
                <div>
                  <div style={{ fontSize:"22px", fontWeight:800, color:readinessCol, lineHeight:1 }}>
                    {avgCoverage}%
                  </div>
                  <div style={{ fontSize:"7px", color:T.dim, letterSpacing:"0.06em" }}>
                    AVG COVERAGE
                  </div>
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"9px", color:T.muted, marginBottom:"2px" }}>
                    {gaps.committedCount} committed
                  </div>
                  {uncommitted > 0 && (
                    <div style={{ fontSize:"9px", color:T.amber }}>
                      ⚠ {uncommitted} not yet engaged
                    </div>
                  )}
                </div>
              </div>
              {/* Mini coverage sparkline */}
              <div style={{ display:"flex", gap:"2px", marginTop:"8px" }}>
                {RES_ORDER.map(k => {
                  const pct = gaps.coverage?.[k] || 0;
                  const col = pct >= 70 ? T.green : pct >= 40 ? T.amber : T.red;
                  return (
                    <div key={k} title={`${RES_META[k].label}: ${Math.round(pct)}%`} style={{
                      flex:1, height:`${Math.max(4, pct * 0.22)}px`,
                      background:col, borderRadius:"2px",
                      alignSelf:"flex-end", opacity:0.8,
                    }}/>
                  );
                })}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between",
                marginTop:"3px", fontSize:"7px", color:T.dim }}>
                {RES_ORDER.map(k => (
                  <span key={k}>{RES_META[k].icon}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Org commitment matrix */}
      <div style={{
        fontSize:"9px", fontWeight:800, letterSpacing:"0.1em", color:T.muted,
        textTransform:"uppercase", marginBottom:"8px",
        borderBottom:`1px solid ${T.border}`, paddingBottom:"4px",
      }}>ORG COMMITMENT MATRIX</div>

      <div style={{ overflowX:"auto" }}>
        {/* Header */}
        <div style={{ display:"grid",
          gridTemplateColumns:`110px repeat(${SCENARIO_IDS.length}, 60px)`,
          gap:"2px", marginBottom:"3px" }}>
          <div/>
          {SCENARIO_IDS.map(sid => (
            <div key={sid} style={{
              textAlign:"center", fontSize:"8px",
              color:SCENARIOS[sid].color, fontWeight:700,
              writingMode:"vertical-lr", transform:"rotate(180deg)",
              height:"48px", paddingBottom:"4px",
            }}>
              {SCENARIOS[sid].label}
            </div>
          ))}
        </div>

        {/* Org rows */}
        {orgMatrix.map(({ org, scenarios }) => (
          <div key={org.id} style={{
            display:"grid",
            gridTemplateColumns:`110px repeat(${SCENARIO_IDS.length}, 60px)`,
            gap:"2px", marginBottom:"2px", alignItems:"center",
          }}>
            <div style={{
              fontSize:"9px", color:T.muted, fontWeight:500,
              overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap",
              paddingRight:"4px",
            }} title={org.name}>
              {org.shortName}
            </div>
            {scenarios.map((c, i) => {
              const sid = SCENARIO_IDS[i];
              if (!c) return (
                <div key={sid} style={{
                  height:"18px", borderRadius:"3px",
                  background:T.border, opacity:0.3,
                }}/>
              );
              const col = c.committed ? T.green : T.amber;
              return (
                <div key={sid} title={c.role || ""} style={{
                  height:"18px", borderRadius:"3px",
                  background:col+"33", border:`1px solid ${col}66`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:"8px", color:col, fontWeight:700,
                }}>
                  {c.committed ? "✓" : "~"}
                </div>
              );
            })}
          </div>
        ))}

        <div style={{ marginTop:"8px", fontSize:"8px", color:T.dim, lineHeight:1.7 }}>
          ✓ = committed &nbsp;· &nbsp;~ = partial/unclear &nbsp;·&nbsp;
          <span style={{ background:T.border+"55", padding:"0 3px", borderRadius:"2px" }}>
            blank
          </span> = no data
        </div>
      </div>
    </div>
  );
}
