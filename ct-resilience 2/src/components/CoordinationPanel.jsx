import { T, ORG_COLORS } from "../utils/colors.js";
import { sH } from "../utils/helpers.js";
import { SCENARIOS } from "../data/scenarios.js";

// Response timeline ordering
const RESPONSE_ORDER = [
  { window: "0–2 hrs",   label: "Immediate",      color: "#EF4444" },
  { window: "2–8 hrs",   label: "Same Day",        color: "#F59E0B" },
  { window: "8–24 hrs",  label: "Within 24 hrs",   color: "#3B82F6" },
  { window: "1–3 days",  label: "2–3 Days",        color: "#8B5CF6" },
  { window: "1+ week",   label: "Week+",           color: "#64748B" },
];

const parseResponseTime = (rt) => {
  if (!rt) return 4;
  const s = rt.toLowerCase();
  if (s.includes("30 min") || s.includes("1-2 hr") || s.includes("1–2 hr") || s.includes("2 hr")) return 0;
  if (s.includes("4") || s.includes("8") || s.includes("same")) return 1;
  if (s.includes("24") || s.includes("day")) return 2;
  if (s.includes("48") || s.includes("72") || s.includes("3 day")) return 3;
  return 4;
};

export default function CoordinationPanel({ scenario, orgs, onSelectOrg }) {
  if (scenario === "normal") {
    return (
      <div style={{ padding:"24px", color:T.muted, fontSize:"11px", fontFamily:"system-ui" }}>
        Select a scenario to see the coordination timeline.
      </div>
    );
  }

  const s = SCENARIOS[scenario];
  const committed = orgs
    .filter(o => o.scenarioCommitments?.[scenario]?.committed)
    .map(o => ({ ...o, c: o.scenarioCommitments[scenario], tier: parseResponseTime(o.scenarioCommitments[scenario].responseTime) }))
    .sort((a, b) => a.tier - b.tier);

  const uncommitted = orgs.filter(o => !o.scenarioCommitments?.[scenario]?.committed);

  const copyAllContacts = () => {
    const lines = committed.map(o =>
      `${o.name} | ${o.c.responseTime||'TBD'} | ${o.contact?.phone||o.contact?.hotline||'—'} | ${o.website||'—'}`
    );
    const text = `CT RESILIENCE — ${s.label} Contacts\n${'='.repeat(50)}\n${lines.join('\n')}`;
    navigator.clipboard?.writeText(text);
  };

  return (
    <div style={{ padding:"16px", height:"100%", overflowY:"auto",
      color:T.text, fontFamily:"system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"12px" }}>
        <span style={{ fontSize:"20px" }}>{s.icon}</span>
        <div>
          <div style={{ fontSize:"13px", fontWeight:700 }}>Coordination Timeline</div>
          <div style={{ fontSize:"10px", color:T.muted }}>{s.label} — who does what, when</div>
        </div>
      </div>

      {/* 2025 real context for ICE scenario */}
      {scenario === "ice_raid" && (
        <div style={{
          background:"#1A0808", border:`1px solid ${T.red}33`,
          borderRadius:"7px", padding:"10px 12px", marginBottom:"12px",
          fontSize:"9px", lineHeight:1.8, color:T.muted
        }}>
          <div style={{color:T.red, fontWeight:700, marginBottom:"4px"}}>🚨 2025 CT Context</div>
          <div>ICE actively operating in CT — arrested 8 people at Hamden car wash (2025)</div>
          <div>AG Tong publicly challenging unlawful enforcement actions</div>
          <div>Legislature in special session on civil rights lawsuit bill</div>
          <div>CT TRUST Act limits state/local ICE cooperation</div>
          <div style={{marginTop:"4px", color:T.dim, fontSize:"8px"}}>
            Rapid response hotlines: Make the Road CT (203) 549-5220 · CIRA (860) 906-8000 · Sanctuary CT (860) 519-0966
          </div>
        </div>
      )}

      {/* Timeline by response window */}
      {RESPONSE_ORDER.map((tier, ti) => {
        const tierOrgs = committed.filter(o => o.tier === ti);
        if (!tierOrgs.length) return null;
        return (
          <div key={ti} style={{ marginBottom:"16px" }}>
            {/* Tier header */}
            <div style={{
              display:"flex", alignItems:"center", gap:"8px", marginBottom:"8px"
            }}>
              <div style={{
                width:"10px", height:"10px", borderRadius:"50%",
                background:tier.color, flexShrink:0
              }}/>
              <div style={{ fontSize:"10px", fontWeight:700, color:tier.color,
                letterSpacing:"0.06em", textTransform:"uppercase" }}>
                {tier.label}
              </div>
              <div style={{ flex:1, height:"1px", background:T.border }}/>
              <div style={{ fontSize:"9px", color:T.dim }}>{tier.window}</div>
            </div>

            {/* Orgs in this tier */}
            {tierOrgs.map(org => (
              <div key={org.id}
                onClick={() => onSelectOrg(org.id)}
                style={{
                  background:T.bg, borderRadius:"7px", padding:"10px 12px",
                  marginBottom:"6px", cursor:"pointer",
                  border:`1px solid ${ORG_COLORS[org.type]}33`,
                  transition:"border-color 0.15s",
                }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"8px" }}>
                  <span style={{
                    width:"8px", height:"8px", borderRadius:"50%",
                    background:ORG_COLORS[org.type], flexShrink:0, marginTop:"3px"
                  }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"11px", fontWeight:600, color:T.text,
                      marginBottom:"2px" }}>
                      {org.shortName}
                    </div>
                    <div style={{ fontSize:"9px", color:tier.color, fontWeight:600,
                      marginBottom:"4px" }}>
                      {org.c.role}
                    </div>
                    {org.c.notes && (
                      <div style={{ fontSize:"9px", color:T.muted, lineHeight:1.6 }}>
                        {org.c.notes}
                      </div>
                    )}
                    {/* Resource badges */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"3px", marginTop:"5px" }}>
                      {["legal","shelter","food","mentalHealth","financialAid","communications"].map(k => {
                        if (!org.c[k]) return null;
                        const colors = {
                          legal:"#8B5CF6", shelter:"#F59E0B", food:"#10B981",
                          mentalHealth:"#EC4899", financialAid:"#3B82F6", communications:"#06B6D4"
                        };
                        const col = colors[k] || T.muted;
                        return (
                          <span key={k} style={{
                            background:col+"18", border:`1px solid ${col}44`,
                            borderRadius:"3px", padding:"1px 5px",
                            fontSize:"8px", color:col, fontWeight:600
                          }}>
                            {k === "financialAid" ? "💰 Funds" :
                             k === "communications" ? "📡 Comms" :
                             k === "legal" ? "⚖ Legal" :
                             k === "shelter" ? "🏠 Shelter" :
                             k === "food" ? "🍎 Food" : "🧠 MH"}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                  <div style={{ fontSize:"8px", color:T.dim, flexShrink:0, textAlign:"right" }}>
                    {org.county}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}

      {/* Uncommitted gap warning */}
      {uncommitted.length > 0 && (
        <>
          <div style={{ ...sH, marginTop:"8px", color:T.amber }}>
            ⚠ NOT YET ENGAGED ({uncommitted.length})
          </div>
          <div style={{
            background:"#1A1000", border:`1px solid ${T.amber}33`,
            borderRadius:"7px", padding:"10px 12px", fontSize:"10px"
          }}>
            {uncommitted.map(org => (
              <div key={org.id}
                onClick={() => onSelectOrg(org.id)}
                style={{
                  display:"flex", alignItems:"center", gap:"6px",
                  padding:"4px 0", cursor:"pointer", color:T.muted,
                  borderBottom:`1px solid ${T.border}`,
                }}>
                <span style={{
                  width:"6px", height:"6px", borderRadius:"50%",
                  background:ORG_COLORS[org.type], flexShrink:0
                }}/>
                <span style={{ flex:1 }}>{org.name}</span>
                <span style={{ fontSize:"8px", color:T.dim }}>{org.county}</span>
              </div>
            ))}
            <div style={{ marginTop:"8px", fontSize:"9px", color:T.amber }}>
              ↑ Click any org to see what outreach is needed to bring them in.
            </div>
          </div>
        </>
      )}

      {/* How to use this */}
      <div style={{
        marginTop:"16px", padding:"10px", background:T.bg,
        borderRadius:"6px", border:`1px solid ${T.border}`,
        fontSize:"9px", color:T.dim, lineHeight:1.7
      }}>
        <strong style={{ color:T.muted, display:"block", marginBottom:"4px" }}>HOW TO USE</strong>
        This timeline shows activation sequence if the scenario occurs today.
        Click any organization to see full details, contact info, and what they
        said they'd do. Share with partner orgs to align coordination.
      </div>
    </div>
  );
}
