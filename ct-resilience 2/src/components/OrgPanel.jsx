import { T, ORG_COLORS, ORG_LABELS, RES_META, trustColor } from "../utils/colors.js";
import { fmtMoney, fmtRes, sH, nodeRadius } from "../utils/helpers.js";
import { ORGS } from "../data/orgs.js";
import { computeTrustBreakdown, getTrustTier, getTrustImprovements } from "../utils/trust.js";
import ElasticityChart from "./ElasticityChart.jsx";

const RES_KEYS = ["legal","shelter","food","mentalHealth","financialAid","communications"];

function MiniBar({ value, color }) {
  return (
    <div style={{ height:"4px", background:"#060C16", borderRadius:"2px", overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${Math.min(100,value)}%`, background:color, borderRadius:"2px", opacity:0.8 }}/>
    </div>
  );
}

function TrustWidget({ org }) {
  const { total, breakdown } = computeTrustBreakdown(org, ORGS);
  const tier = getTrustTier(total);
  const improvements = getTrustImprovements(org, breakdown);

  return (
    <div style={{ marginBottom:"12px" }}>
      <div style={sH}>DATA TRUST SCORE</div>
      <div style={{
        background:T.bg, borderRadius:"8px", padding:"10px 12px",
        border:`1px solid ${tier.color}44`,
      }}>
        {/* Score header */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"10px" }}>
          <div style={{
            width:"44px", height:"44px", borderRadius:"8px",
            background:tier.color+"22", border:`2px solid ${tier.color}`,
            display:"flex", flexDirection:"column",
            alignItems:"center", justifyContent:"center", flexShrink:0,
          }}>
            <div style={{ fontSize:"16px", fontWeight:800, color:tier.color, lineHeight:1 }}>{total}</div>
            <div style={{ fontSize:"7px", color:tier.color, opacity:0.7 }}>/100</div>
          </div>
          <div>
            <div style={{ fontSize:"11px", fontWeight:700, color:tier.color }}>{tier.icon} {tier.label}</div>
            <div style={{ fontSize:"9px", color:T.dim, marginTop:"2px" }}>Based on {org.dataSource}</div>
          </div>
        </div>

        {/* Factor bars */}
        {breakdown.map(b => (
          <div key={b.factor} style={{ marginBottom:"6px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"9px", marginBottom:"2px" }}>
              <span style={{ color:T.muted }}>{b.label}</span>
              <span style={{ color: b.score >= 60 ? T.green : b.score >= 35 ? T.amber : T.red,
                fontWeight:600 }}>{Math.round(b.score)}</span>
            </div>
            <div style={{ height:"3px", background:"#060C16", borderRadius:"2px", overflow:"hidden" }}>
              <div style={{
                height:"100%",
                width:`${b.score}%`,
                background: b.score >= 60 ? T.green : b.score >= 35 ? T.amber : T.red,
                borderRadius:"2px",
              }}/>
            </div>
          </div>
        ))}

        {/* Improvement suggestions */}
        {improvements.length > 0 && (
          <div style={{ marginTop:"8px", paddingTop:"8px", borderTop:`1px solid ${T.border}` }}>
            <div style={{ fontSize:"8px", fontWeight:700, color:T.muted,
              letterSpacing:"0.08em", marginBottom:"5px" }}>HOW TO IMPROVE</div>
            {improvements.map((s, i) => (
              <div key={i} style={{ fontSize:"9px", color:T.dim, marginBottom:"3px" }}>
                → {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrgPanel({ org, scenario, onClose }) {
  const c = org.scenarioCommitments?.[scenario];
  const borderCol = c?.committed ? T.green : T.amber;

  return (
    <div style={{ padding:"16px", height:"100%", overflowY:"auto",
      color:T.text, boxSizing:"border-box", fontFamily:"system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
        <div style={{ flex:1 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:"4px",
            background: ORG_COLORS[org.type] + "22",
            border: `1px solid ${ORG_COLORS[org.type]}55`,
            borderRadius:"4px", padding:"2px 7px", marginBottom:"5px"
          }}>
            <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:ORG_COLORS[org.type] }}/>
            <span style={{ fontSize:"9px", fontWeight:700, color:ORG_COLORS[org.type],
              letterSpacing:"0.08em", textTransform:"uppercase" }}>
              {ORG_LABELS[org.type]}
            </span>
          </div>
          <div style={{ fontSize:"13px", fontWeight:700, lineHeight:1.3 }}>{org.name}</div>
          <div style={{ fontSize:"10px", color:T.muted, marginTop:"2px" }}>{org.county} County</div>
        </div>
        <button onClick={onClose} style={{
          background:"none", border:`1px solid ${T.border}`, color:T.muted,
          cursor:"pointer", fontSize:"13px", borderRadius:"4px",
          width:"24px", height:"24px", flexShrink:0,
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>✕</button>
      </div>

      {/* Metrics row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px", marginBottom:"12px" }}>
        {[
          [fmtMoney(org.budget), "BUDGET",       T.text,  true],
          [org.dataSource,       "DATA SOURCE",  T.muted, false],
        ].map(([val, label, col, bold], i) => (
          <div key={i} style={{
            background:T.bg, borderRadius:"6px", padding:"8px 6px",
            textAlign:"center", border:`1px solid ${T.border}`
          }}>
            <div style={{ fontSize: bold ? "16px" : "8px", fontWeight: bold ? 700 : 400,
              color:col, lineHeight:1 }}>{val}</div>
            <div style={{ fontSize:"8px", color:T.muted, marginTop:"3px", letterSpacing:"0.08em" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Trust Score Breakdown */}
      <TrustWidget org={org}/>

      {/* Description */}
      <p style={{ fontSize:"10.5px", color:T.muted, lineHeight:1.6, marginBottom:"14px",
        borderLeft:`2px solid ${T.border}`, paddingLeft:"8px", margin:"0 0 14px 0" }}>
        {org.description}
      </p>

      {/* Baseline resources */}
      <div style={sH}>BASELINE RESOURCES</div>
      <div style={{ marginBottom:"14px" }}>
        {RES_KEYS.map(k => {
          const v = org.resources?.[k];
          if (!v) return null;
          const m = RES_META[k];
          const barW = k==="financialAid" ? Math.min(100, v / 50000) : Math.min(100, v);
          return (
            <div key={k} style={{ marginBottom:"8px" }}>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:"10px", marginBottom:"3px" }}>
                <span style={{ color:m.color, fontWeight:600 }}>{m.icon} {m.label}</span>
                <span style={{ color:T.muted }}>{fmtRes(k, v)}</span>
              </div>
              <MiniBar value={barW} color={m.color}/>
            </div>
          );
        })}
      </div>

      {/* Scenario commitment */}
      {scenario !== "normal" && (
        <>
          <ElasticityChart org={org} scenario={scenario}/>
          <div style={{ ...sH, color: c?.committed ? T.green : T.amber }}>
            {c?.committed ? "✓ COMMITTED TO SCENARIO" : "⚠ NOT YET COMMITTED"}
          </div>
          <div style={{
            background:T.bg, borderRadius:"8px", padding:"12px",
            border:`1px solid ${(c?.committed ? T.green : T.amber)}44`,
            fontSize:"10.5px", lineHeight:1.7, marginBottom:"14px"
          }}>
            {c ? (
              <>
                <div><span style={{ color:T.muted }}>Role: </span><strong>{c.role}</strong></div>
                {c.responseTime && (
                  <div><span style={{ color:T.muted }}>Response: </span>
                    <span style={{ color: c.committed ? T.green : T.amber, fontWeight:600 }}>
                      {c.responseTime}
                    </span>
                  </div>
                )}
                {c.notes && (
                  <div style={{ marginTop:"8px", color:T.muted, fontSize:"10px", lineHeight:1.6 }}>
                    {c.notes}
                  </div>
                )}
                {/* Scenario-specific resources */}
                <div style={{ marginTop:"8px", display:"flex", gap:"5px", flexWrap:"wrap" }}>
                  {RES_KEYS.map(k => {
                    if (!c[k]) return null;
                    const m = RES_META[k];
                    return (
                      <span key={k} style={{
                        background: m.color + "22",
                        border: `1px solid ${m.color}44`,
                        borderRadius:"4px", padding:"1px 6px",
                        fontSize:"9px", color:m.color, fontWeight:600
                      }}>
                        {m.label}: {fmtRes(k, c[k])}
                      </span>
                    );
                  })}
                </div>
              </>
            ) : (
              <div style={{ color:T.muted, fontSize:"10px" }}>
                No scenario commitment on record. This organization represents a potential coordination gap.
              </div>
            )}
          </div>
        </>
      )}

      {/* Contact info */}
      {org.contact && (
        <div style={{ marginBottom:"14px" }}>
          <div style={sH}>CONTACT</div>
          <div style={{
            background:T.bg, borderRadius:"7px", padding:"10px 12px",
            border:`1px solid ${T.border}`, fontSize:"10px", lineHeight:1.9
          }}>
            {org.contact.hotline && (
              <div style={{ marginBottom:"4px" }}>
                <span style={{ color:T.red, fontWeight:700 }}>🚨 Rapid Hotline: </span>
                <span style={{ color:T.text, fontWeight:700, fontSize:"11px" }}>{org.contact.hotline}</span>
              </div>
            )}
            {org.contact.phone && (
              <div><span style={{ color:T.muted }}>📞 Main: </span>
                <span style={{ color:T.text }}>{org.contact.phone}</span></div>
            )}
            {org.contact.address && (
              <div><span style={{ color:T.muted }}>📍 </span>
                <span style={{ color:T.dim }}>{org.contact.address}</span></div>
            )}
            {org.website && (
              <div><span style={{ color:T.muted }}>🌐 </span>
                <span style={{ color:"#60A5FA" }}>{org.website}</span></div>
            )}
          </div>
        </div>
      )}

      {/* Connections */}
      <div style={sH}>CONNECTIONS ({(org.connections||[]).length})</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:"4px", marginBottom:"14px" }}>
        {(org.connections||[]).map(id => {
          const target = ORGS.find(o => o.id === id);
          if (!target) return null;
          return (
            <span key={id} style={{
              background: ORG_COLORS[target.type] + "18",
              border: `1px solid ${ORG_COLORS[target.type]}44`,
              borderRadius:"4px", padding:"2px 6px",
              fontSize:"9px", color: ORG_COLORS[target.type]
            }}>
              {target.shortName}
            </span>
          );
        })}
      </div>

      {/* Website */}
      {org.website && (
        <div style={{ fontSize:"10px", color:T.muted }}>
          🌐 <span style={{ color:"#60A5FA" }}>{org.website}</span>
        </div>
      )}
    </div>
  );
}
