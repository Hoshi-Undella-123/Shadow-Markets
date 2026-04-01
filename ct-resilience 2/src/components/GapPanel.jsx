import { T, RES_META } from "../utils/colors.js";
import { fmtMoney, sH } from "../utils/helpers.js";
import { SCENARIOS, DEMANDS, SCENARIO_GAPS, computeGaps } from "../data/scenarios.js";

const RES_ORDER = ["financialAid","legal","shelter","food","mentalHealth","communications"];

function CoverageBar({ pct }) {
  const col = pct >= 70 ? T.green : pct >= 40 ? T.amber : T.red;
  return (
    <div style={{ height:"7px", background:"#060C16", borderRadius:"4px",
      overflow:"hidden", border:`1px solid ${T.border}`, marginBottom:"4px" }}>
      <div style={{ height:"100%", width:`${pct}%`, background:col,
        borderRadius:"4px", transition:"width 0.6s ease" }}/>
    </div>
  );
}

export default function GapPanel({ scenario, orgs }) {
  const gaps = computeGaps(scenario, orgs);

  if (!gaps || scenario === "normal") {
    // Show org ecosystem overview for Normal mode
    const byType = {};
    orgs.forEach(o => { byType[o.type] = (byType[o.type]||0) + 1; });
    const byCounty = {};
    orgs.forEach(o => { byCounty[o.county] = (byCounty[o.county]||0) + 1; });
    const totalBudget = orgs.reduce((s,o) => s+(o.budget||0), 0);
    const TYPE_LABELS = {
      foundation:"Foundation/Funder", legal:"Legal Services",
      advocacy:"Advocacy/Comms", shelter:"Shelter & Housing",
      food:"Food & Nutrition", mentalHealth:"Mental Health",
      faith:"Faith Community", government:"Government",
    };
    const TYPE_COLORS = {
      foundation:"#3B82F6", legal:"#8B5CF6", advocacy:"#06B6D4",
      shelter:"#F59E0B", food:"#10B981", mentalHealth:"#EC4899",
      faith:"#D97706", government:"#64748B",
    };
    return (
      <div style={{ padding:"14px", height:"100%", overflowY:"auto",
        color:T.text, fontFamily:"system-ui, sans-serif" }}>
        <div style={{ fontSize:"13px", fontWeight:700, marginBottom:"2px" }}>
          CT Resilience Network
        </div>
        <div style={{ fontSize:"9px", color:T.muted, marginBottom:"14px" }}>
          Ecosystem Overview · All 73 orgs mapped
        </div>
        <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
          <div style={{ flex:1, background:T.bg, borderRadius:"8px", padding:"10px", textAlign:"center" }}>
            <div style={{ fontSize:"22px", fontWeight:800, color:T.text }}>{orgs.length}</div>
            <div style={{ fontSize:"8px", color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>Orgs Mapped</div>
          </div>
          <div style={{ flex:1, background:T.bg, borderRadius:"8px", padding:"10px", textAlign:"center" }}>
            <div style={{ fontSize:"22px", fontWeight:800, color:T.green }}>{Object.keys(byCounty).length}</div>
            <div style={{ fontSize:"8px", color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>Counties</div>
          </div>
          <div style={{ flex:1, background:T.bg, borderRadius:"8px", padding:"10px", textAlign:"center" }}>
            <div style={{ fontSize:"17px", fontWeight:800, color:"#60A5FA" }}>{fmtMoney(totalBudget)}</div>
            <div style={{ fontSize:"8px", color:T.muted, textTransform:"uppercase", letterSpacing:"0.06em" }}>Total Budget</div>
          </div>
        </div>
        <div style={sH}>BY TYPE</div>
        {Object.entries(byType).sort((a,b)=>b[1]-a[1]).map(([type, count]) => (
          <div key={type} style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"7px" }}>
            <span style={{ width:"8px", height:"8px", borderRadius:"50%",
              background:TYPE_COLORS[type]||T.muted, flexShrink:0 }}/>
            <span style={{ flex:1, fontSize:"10px", color:T.muted }}>{TYPE_LABELS[type]||type}</span>
            <span style={{ fontSize:"11px", fontWeight:700, color:T.text }}>{count}</span>
            <div style={{ width:"60px", height:"5px", background:T.border, borderRadius:"3px", overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${(count/orgs.length)*100*3}%`,
                background:TYPE_COLORS[type]||T.muted, borderRadius:"3px" }}/>
            </div>
          </div>
        ))}
        <div style={sH}>BY COUNTY</div>
        {Object.entries(byCounty).sort((a,b)=>b[1]-a[1]).map(([county, count]) => (
          <div key={county} style={{ display:"flex", justifyContent:"space-between",
            alignItems:"center", marginBottom:"5px", fontSize:"10px" }}>
            <span style={{ color:T.muted }}>{county}</span>
            <span style={{ fontWeight:700, color:T.text }}>{count} orgs</span>
          </div>
        ))}
        <div style={{ marginTop:"14px", padding:"10px", background:T.bg,
          borderRadius:"6px", fontSize:"9px", color:T.dim, lineHeight:1.7 }}>
          Select 🚨 ICE, 📉 Economic, 🌪 Disaster, or 🏥 Public Health to see scenario-specific gap analysis.
        </div>
      </div>
    );
  }

  const { coverage, committedCount, total } = gaps;
  const dem = DEMANDS[scenario];
  const uncommitted = orgs.filter(o => !o.scenarioCommitments?.[scenario]?.committed);
  const knownGaps   = SCENARIO_GAPS[scenario] || [];

  return (
    <div style={{ padding:"16px", height:"100%", overflowY:"auto",
      color:T.text, fontFamily:"system-ui, sans-serif" }}>

      {/* Title */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
        <span style={{ fontSize:"20px" }}>{SCENARIOS[scenario].icon}</span>
        <div>
          <div style={{ fontSize:"13px", fontWeight:700 }}>{SCENARIOS[scenario].label}</div>
          <div style={{ fontSize:"10px", color:T.muted }}>Scenario Gap Analysis</div>
        </div>
      </div>

      {/* CT Real Context callout for ICE scenario */}
      {scenario === "ice_raid" && (
        <div style={{
          background:"#0D0505", border:`1px solid #EF444455`,
          borderRadius:"8px", padding:"12px", marginBottom:"16px",
          fontSize:"10px", lineHeight:1.9, color:"#FCA5A5",
        }}>
          <div style={{ color:"#EF4444", fontWeight:800, marginBottom:"6px", fontSize:"11px" }}>
            🚨 THIS IS HAPPENING NOW — 2025 CT Data
          </div>
          <div>• <span style={{color:T.text,fontWeight:700}}>405 arrests</span> Jan–Jul 2025 (+134% vs 2024)</div>
          <div>• <span style={{color:T.text,fontWeight:700}}>Hartford 127 · Danbury 65 (4-day op) · Stamford 19</span></div>
          <div>• <span style={{color:T.text}}>25% had NO criminal charges</span> beyond immigration status</div>
          <div>• <span style={{color:T.text}}>32 CT towns</span> affected · Deportations up <span style={{color:T.text}}>237.7%</span></div>
          <div>• Schools reporting <span style={{color:T.text}}>enrollment drops</span> due to family fear</div>
          <div>• TRUST Act expanded 2025 · Courthouse arrests occurring</div>
          <div style={{marginTop:"6px", fontSize:"8.5px", color:"#7F1D1D"}}>
            Sources: CT Mirror Aug 2025, CT Public Radio, CTData.org — Deportation Data Project FOIA
          </div>
        </div>
      )}

      {/* Economic Crisis context */}
      {scenario === "economic_crisis" && (
        <div style={{
          background:"#0D0A04", border:`1px solid #F59E0B55`,
          borderRadius:"8px", padding:"12px", marginBottom:"16px",
          fontSize:"10px", lineHeight:1.8, color:"#FDE68A",
        }}>
          <div style={{ color:"#F59E0B", fontWeight:800, marginBottom:"5px" }}>
            📉 CT Economic Vulnerability Context
          </div>
          <div>• Federal funding cuts threatening <span style={{color:T.text,fontWeight:700}}>$400M+</span> in CT nonprofit revenue</div>
          <div>• IRIS lost <span style={{color:T.text,fontWeight:700}}>$4M</span> in federal refugee funding in 2025 — Hartford office closed</div>
          <div>• Medicaid expansion rollback threatens coverage for <span style={{color:T.text}}>~100K CT residents</span></div>
          <div>• Immigrant-owned businesses generate <span style={{color:T.text}}>$8.3B/yr</span> for CT economy</div>
          <div>• SNAP, housing vouchers, childcare subsidies all at risk from federal cuts</div>
        </div>
      )}

      {/* Pandemic context */}
      {scenario === "pandemic" && (
        <div style={{
          background:"#040A0D", border:`1px solid #8B5CF655`,
          borderRadius:"8px", padding:"12px", marginBottom:"16px",
          fontSize:"10px", lineHeight:1.8, color:"#DDD6FE",
        }}>
          <div style={{ color:"#8B5CF6", fontWeight:800, marginBottom:"5px" }}>
            🏥 CT Health System Vulnerability
          </div>
          <div>• CT has <span style={{color:T.text,fontWeight:700}}>16 Federally Qualified Health Centers</span> (FQHCs) serving regardless of status</div>
          <div>• Undocumented residents largely excluded from COVID relief programs (2020 lesson)</div>
          <div>• Language barriers affect <span style={{color:T.text}}>30%+ of immigrant population</span> — need multilingual outreach</div>
          <div>• HUSKY for Immigrants covers <span style={{color:T.text}}>~10K residents</span> — expansion advocacy ongoing</div>
          <div>• CHC network coordinates 400+ clinicians statewide — key rapid deployment asset</div>
        </div>
      )}

      {/* Natural Disaster context */}
      {scenario === "natural_disaster" && (
        <div style={{
          background:"#040812", border:`1px solid #3B82F655`,
          borderRadius:"8px", padding:"12px", marginBottom:"16px",
          fontSize:"10px", lineHeight:1.8, color:"#BFDBFE",
        }}>
          <div style={{ color:"#3B82F6", fontWeight:800, marginBottom:"5px" }}>
            🌪 CT Natural Disaster Risk Profile
          </div>
          <div>• CT coastline: <span style={{color:T.text,fontWeight:700}}>Hurricane/flood risk</span> — Bridgeport, New Haven, New London most exposed</div>
          <div>• Undocumented residents less likely to access FEMA aid due to status concerns</div>
          <div>• Tropical storms increasingly severe — 2011 Irene, 2012 Sandy caused billions in damage</div>
          <div>• CT DEMHS coordinates with Red Cross + 211 — <span style={{color:T.text}}>immigrant orgs not always in loop</span></div>
          <div>• Faith community shelters (Catholic Charities, churches) critical for status-blind refuge</div>
        </div>
      )}

      {/* Commitment summary */}
      <div style={{
        background:T.bg, borderRadius:"8px", padding:"10px 12px",
        marginTop:"12px", marginBottom:"16px", border:`1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center"
      }}>
        {[
          [committedCount,          "COMMITTED",     T.green],
          [total - committedCount,  "NOT COMMITTED", T.amber],
          [total,                   "TOTAL MAPPED",  T.text],
        ].map(([val, label, col]) => (
          <div key={label} style={{ textAlign:"center" }}>
            <div style={{ fontSize:"22px", fontWeight:800, color:col }}>{val}</div>
            <div style={{ fontSize:"8px", color:T.muted, letterSpacing:"0.08em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Resource coverage */}
      <div style={sH}>RESOURCE COVERAGE vs ESTIMATED DEMAND</div>
      {RES_ORDER.map(k => {
        const pct = coverage[k] || 0;
        const m   = RES_META[k];
        const col = pct >= 70 ? T.green : pct >= 40 ? T.amber : T.red;
        const d   = dem[k];
        return (
          <div key={k} style={{ marginBottom:"14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", marginBottom:"4px" }}>
              <span style={{ color:m.color, fontWeight:600 }}>{m.icon} {m.label}</span>
              <span style={{ color:col, fontWeight:700 }}>{pct.toFixed(0)}% estimated coverage</span>
            </div>
            <CoverageBar pct={pct}/>
            <div style={{ fontSize:"9px", color:T.dim }}>
              Estimated need: {d.label} — {d.note}
            </div>
          </div>
        );
      })}

      {/* Uncommitted orgs */}
      {uncommitted.length > 0 && (
        <>
          <div style={{ ...sH, marginTop:"16px", color:T.amber }}>
            ⚠ ORGS NOT YET COMMITTED ({uncommitted.length})
          </div>
          <div style={{ marginBottom:"12px" }}>
            {uncommitted.map(org => (
              <div key={org.id} style={{
                display:"flex", alignItems:"center", gap:"6px",
                padding:"6px 8px", background:T.bg,
                borderRadius:"5px", marginBottom:"4px",
                border:`1px solid ${T.border}`, fontSize:"10px"
              }}>
                <span style={{
                  width:"7px", height:"7px", borderRadius:"50%",
                  background:"#3B82F6", flexShrink:0
                }}/>
                <span style={{ color:T.muted, flex:1 }}>{org.name}</span>
                <span style={{ fontSize:"8px", color:T.dim }}>{org.county}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Critical gaps */}
      {knownGaps.length > 0 && (
        <>
          <div style={{ ...sH, marginTop:"4px", color:T.red }}>🔴 CRITICAL GAPS IDENTIFIED</div>
          <div style={{
            background:"#1A0A0A", border:`1px solid ${T.red}44`,
            borderRadius:"8px", padding:"12px",
            fontSize:"10px", lineHeight:1.8, color:T.muted
          }}>
            {knownGaps.map((gap, i) => (
              <div key={i}>• {gap}</div>
            ))}
          </div>
        </>
      )}

      {/* Scenario description */}
      <div style={{ marginTop:"14px", padding:"10px", background:T.bg,
        borderRadius:"6px", border:`1px solid ${T.border}`, fontSize:"10px", color:T.muted }}>
        <strong style={{ color:T.text, display:"block", marginBottom:"4px" }}>About this scenario</strong>
        {SCENARIOS[scenario].description}
      </div>
    </div>
  );
}
