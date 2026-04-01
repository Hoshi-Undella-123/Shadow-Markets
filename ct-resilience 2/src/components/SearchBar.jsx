import { useState, useMemo, useRef, useEffect } from "react";
import { T, ORG_COLORS, ORG_LABELS } from "../utils/colors.js";
import { ORGS } from "../data/orgs.js";

const score = (org, q) => {
  const s = q.toLowerCase();
  let pts = 0;
  if (org.name.toLowerCase().includes(s))        pts += 10;
  if (org.shortName.toLowerCase().includes(s))    pts += 8;
  if (org.county?.toLowerCase().includes(s))      pts += 6;
  if (ORG_LABELS[org.type]?.toLowerCase().includes(s)) pts += 4;
  if (org.description?.toLowerCase().includes(s)) pts += 2;
  return pts;
};

export default function SearchBar({ onSelectOrg, scenario }) {
  const [query, setQuery]   = useState("");
  const [open,  setOpen]    = useState(false);
  const ref                 = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return ORGS
      .map(o => ({ ...o, _score: score(o, query) }))
      .filter(o => o._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 8);
  }, [query]);

  // Close on outside click or ESC
  useEffect(() => {
    const clickHandler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const keyHandler = e => { if (e.key === "Escape") { setOpen(false); setQuery(""); } };
    document.addEventListener("mousedown", clickHandler);
    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("mousedown", clickHandler);
      document.removeEventListener("keydown", keyHandler);
    };
  }, []);

  const pick = (id) => {
    onSelectOrg(id);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position:"relative", width:"155px", flexShrink:0 }}>
      <div style={{ position:"relative" }}>
        <span style={{
          position:"absolute", left:"8px", top:"50%", transform:"translateY(-50%)",
          fontSize:"11px", color:T.muted, pointerEvents:"none",
        }}>🔍</span>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => query && setOpen(true)}
          placeholder="Search orgs…"
          style={{
            width:"100%", background:T.bg, border:`1px solid ${T.border}`,
            borderRadius:"5px", color:T.text, padding:"4px 8px 4px 24px",
            fontSize:"10px", outline:"none", boxSizing:"border-box",
            fontFamily:"system-ui",
          }}
        />
        {query && (
          <button onClick={() => { setQuery(""); setOpen(false); }} style={{
            position:"absolute", right:"6px", top:"50%", transform:"translateY(-50%)",
            background:"none", border:"none", color:T.muted, cursor:"pointer",
            fontSize:"11px", padding:0, lineHeight:1,
          }}>✕</button>
        )}
      </div>

      {open && results.length > 0 && (
        <div style={{
          position:"absolute", top:"calc(100% + 4px)", left:0, right:0,
          background:T.panel, border:`1px solid ${T.border}`,
          borderRadius:"8px", zIndex:200, overflow:"hidden",
          boxShadow:"0 8px 24px rgba(0,0,0,0.4)",
        }}>
          {results.map((org, i) => {
            const c = org.scenarioCommitments?.[scenario];
            const dot = scenario !== "normal"
              ? (c?.committed ? T.green : T.amber)
              : ORG_COLORS[org.type];
            return (
              <div key={org.id}
                onClick={() => pick(org.id)}
                style={{
                  padding:"8px 12px", cursor:"pointer",
                  borderBottom: i < results.length-1 ? `1px solid ${T.border}` : "none",
                  display:"flex", alignItems:"center", gap:"8px",
                  transition:"background 0.1s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.surface}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                <span style={{
                  width:"8px", height:"8px", borderRadius:"50%",
                  background:dot, flexShrink:0,
                }}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:"11px", fontWeight:600, color:T.text,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {org.name}
                  </div>
                  <div style={{ fontSize:"9px", color:T.muted }}>
                    {org.county} · {ORG_LABELS[org.type]}
                  </div>
                </div>
                {scenario !== "normal" && c?.responseTime && (
                  <span style={{ fontSize:"8px", color: c.committed ? T.green : T.amber,
                    flexShrink:0, fontWeight:600 }}>
                    {c.responseTime}
                  </span>
                )}
              </div>
            );
          })}
          <div style={{ padding:"5px 12px", fontSize:"8px", color:T.dim,
            borderTop:`1px solid ${T.border}`, background:T.bg }}>
            {results.length} result{results.length !== 1 ? "s" : ""} — click to focus
          </div>
        </div>
      )}

      {open && query && results.length === 0 && (
        <div style={{
          position:"absolute", top:"calc(100% + 4px)", left:0, right:0,
          background:T.panel, border:`1px solid ${T.border}`,
          borderRadius:"8px", zIndex:200, padding:"12px",
          fontSize:"10px", color:T.muted, textAlign:"center",
          boxShadow:"0 8px 24px rgba(0,0,0,0.4)",
        }}>
          No orgs matching "{query}"
        </div>
      )}
    </div>
  );
}
