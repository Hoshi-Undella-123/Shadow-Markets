import { T, RES_META } from "../utils/colors.js";
import { fmtMoney } from "../utils/helpers.js";

const RES_KEYS = ["legal","shelter","food","mentalHealth","financialAid","communications"];

/**
 * Shows a radar/bar comparison of org's baseline resources vs
 * projected scenario capacity (baseline × (1 + elasticity))
 */
export default function ElasticityChart({ org, scenario }) {
  if (scenario === "normal") return null;

  const c = org.scenarioCommitments?.[scenario];
  const hasCommitment = c?.committed;

  const bars = RES_KEYS.map(k => {
    const base = org.resources?.[k] || 0;
    const elasticity = org.elasticity?.[k] || 0;
    const projected = Math.round(base * (1 + elasticity));
    const scenarioVal = c?.[k] || null; // explicitly stated in commitment
    const displayVal = scenarioVal ?? projected;
    const isSurge = displayVal > base;
    const isConstrained = displayVal < base;
    return { k, base, projected, scenarioVal, displayVal, elasticity, isSurge, isConstrained };
  }).filter(b => b.base > 0 || b.scenarioVal);

  if (!bars.length) return null;

  const maxVal = Math.max(...bars.map(b => Math.max(b.base, b.displayVal, 1)));

  return (
    <div style={{ marginBottom:"14px" }}>
      <div style={{
        fontSize:"9px", fontWeight:800, letterSpacing:"0.1em", color:T.muted,
        textTransform:"uppercase", marginBottom:"8px",
        borderBottom:`1px solid ${T.border}`, paddingBottom:"4px",
        display:"flex", justifyContent:"space-between",
      }}>
        <span>RESOURCE ELASTICITY</span>
        <span style={{ fontWeight:400, textTransform:"none", letterSpacing:0 }}>
          <span style={{ color:T.muted }}>■ </span>baseline &nbsp;
          <span style={{ color: hasCommitment ? T.green : T.amber }}>■ </span>
          {hasCommitment ? "scenario capacity" : "projected"}
        </span>
      </div>

      {bars.map(({ k, base, displayVal, isSurge, isConstrained, scenarioVal }) => {
        const m = RES_META[k];
        const baseW  = (base / maxVal) * 100;
        const surgeW = (displayVal / maxVal) * 100;
        const surgeColor = hasCommitment
          ? (isSurge ? T.green : isConstrained ? T.red : T.muted)
          : T.amber;

        return (
          <div key={k} style={{ marginBottom:"10px" }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              fontSize:"9px", marginBottom:"4px" }}>
              <span style={{ color:m.color, fontWeight:600 }}>{m.icon} {m.label}</span>
              <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
                {base > 0 && (
                  <span style={{ color:T.dim }}>
                    {k === "financialAid" ? fmtMoney(base) : `${base}%`}
                  </span>
                )}
                {displayVal !== base && (
                  <>
                    <span style={{ color:T.dim }}>→</span>
                    <span style={{ color:surgeColor, fontWeight:700 }}>
                      {k === "financialAid" ? fmtMoney(displayVal) : `${displayVal}%`}
                      {isSurge && " ↑"}
                      {isConstrained && " ↓"}
                      {scenarioVal ? " ★" : " ~"}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Stacked bar: baseline + surge overlay */}
            <div style={{ position:"relative", height:"8px",
              background:"#060C16", borderRadius:"4px",
              overflow:"hidden", border:`1px solid ${T.border}` }}>
              {/* Baseline */}
              <div style={{
                position:"absolute", left:0, top:0, bottom:0,
                width:`${baseW}%`,
                background:m.color, opacity:0.35,
                borderRadius:"3px",
              }}/>
              {/* Surge/scenario */}
              {displayVal > 0 && (
                <div style={{
                  position:"absolute", left:0, top:0, bottom:0,
                  width:`${surgeW}%`,
                  background:surgeColor, opacity:0.75,
                  borderRadius:"3px",
                  transition:"width 0.5s ease",
                }}/>
              )}
            </div>
            {scenarioVal && (
              <div style={{ fontSize:"8px", color:T.dim, marginTop:"2px" }}>
                ★ explicitly stated in scenario commitment
              </div>
            )}
          </div>
        );
      })}

      <div style={{ fontSize:"8px", color:T.dim, marginTop:"4px", lineHeight:1.6 }}>
        ~ = projected from elasticity factor &nbsp;·&nbsp;
        ★ = explicitly committed &nbsp;·&nbsp;
        ↑↓ = surge / constrained vs baseline
      </div>
    </div>
  );
}
