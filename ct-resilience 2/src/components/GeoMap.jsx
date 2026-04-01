import { useRef, useState, useEffect } from "react";
import { T, ORG_COLORS } from "../utils/colors.js";
import { nodeRadius, nodeColor, toXY, COUNTY_CENTERS } from "../utils/helpers.js";

export default function GeoMap({ orgs, selectedOrg, onSelectOrg, scenario, filters }) {
  const ref = useRef(null);
  const [dim, setDim] = useState({ w: 900, h: 540 });

  useEffect(() => {
    const update = () => {
      if (ref.current) setDim({ w: ref.current.clientWidth, h: ref.current.clientHeight });
    };
    update();
    const ro = new ResizeObserver(update);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const visible = orgs.filter(o => {
    if (filters.types?.length && !filters.types.includes(o.type)) return false;
    if (filters.county && o.county !== filters.county) return false;
    if (o.trustScore < (filters.minTrust || 0)) return false;
    return true;
  });

  // Spread overlapping orgs using county-grouped spiral layout
  const computePositions = (orgs, cw, ch) => {
    // Group by lat/lng rounded to 2 decimal places
    const groups = {};
    orgs.forEach(org => {
      const k = `${org.lat.toFixed(2)},${org.lng.toFixed(2)}`;
      if (!groups[k]) groups[k] = [];
      groups[k].push(org);
    });
    const result = {};
    Object.values(groups).forEach(group => {
      // Sort by budget desc so largest nodes go center
      group.sort((a,b) => (b.budget||0) - (a.budget||0));
      group.forEach((org, i) => {
        const { x, y } = toXY(org.lat, org.lng, cw, ch);
        if (i === 0) { result[org.id] = { x, y }; return; }
        // Sunflower spiral with larger spacing for big groups
        const spacing = group.length > 8 ? 34 : 28;
        const ring = Math.ceil(i / 6);
        const angleOffset = i * 2.399; // golden angle
        const dist = ring * spacing;
        result[org.id] = {
          x: x + Math.cos(angleOffset) * dist,
          y: y + Math.sin(angleOffset) * dist
        };
      });
    });
    return result;
  };

  const PAD = { l: 48, r: 32, t: 32, b: 24 };
  const cw = dim.w - PAD.l - PAD.r;
  const ch = dim.h - PAD.t - PAD.b;

  return (
    <div ref={ref} style={{ width:"100%", height:"100%", position:"relative" }}>
      <svg width={dim.w} height={dim.h} style={{ background: T.bg, display:"block" }}>
        <defs>
          <pattern id="mgrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1E3050" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mgrid)"/>

        {/* CT state border */}
        <rect x={PAD.l} y={PAD.t} width={cw} height={ch}
          fill="#0D1829" stroke="#2A4070" strokeWidth={1.5} rx={2}/>

        {/* Approximate county dividers */}
        {[0.33, 0.67].map(fx => (
          <line key={fx}
            x1={PAD.l + cw * fx} y1={PAD.t}
            x2={PAD.l + cw * fx} y2={PAD.t + ch}
            stroke="#1E3050" strokeWidth={1} strokeDasharray="4,4"/>
        ))}
        <line x1={PAD.l} y1={PAD.t + ch * 0.5}
              x2={PAD.l + cw} y2={PAD.t + ch * 0.5}
              stroke="#1E3050" strokeWidth={1} strokeDasharray="4,4"/>

        {/* County labels */}
        {Object.entries(COUNTY_CENTERS).map(([county, c]) => {
          const { x, y } = toXY(c.lat, c.lng, cw, ch);
          return (
            <g key={county}>
              <text x={PAD.l + x} y={PAD.t + y - 6}
                textAnchor="middle" fill="#0D1F35"
                fontSize="11" fontFamily="system-ui"
                fontWeight="800" letterSpacing="0.08em">
                {county.toUpperCase()}
              </text>
              <text x={PAD.l + x} y={PAD.t + y + 7}
                textAnchor="middle" fill="#0D2040"
                fontSize="9" fontFamily="system-ui">
                {({
                  Fairfield:"~45K undoc.", Hartford:"~35K undoc.",
                  "New Haven":"~28K undoc.", Middlesex:"~5K undoc.",
                  "New London":"~6K undoc.", Tolland:"~3K undoc.",
                  Windham:"~4K undoc.", Litchfield:"~3K undoc."
                })[county] || ""}
              </text>
            </g>
          );
        })}

        {/* Org nodes — with spiral spread to prevent overlap */}
        {(() => {
          const positions = computePositions(visible, cw, ch);
          return visible.map(org => {
            const pos = positions[org.id] || toXY(org.lat, org.lng, cw, ch);
            const px = PAD.l + pos.x, py = PAD.t + pos.y;
            const r   = nodeRadius(org);
            const col = nodeColor(org, scenario);
            const sel = org.id === selectedOrg;
            return (
              <g key={org.id} transform={`translate(${px},${py})`}
                style={{ cursor:"pointer" }}
                onClick={e => { e.stopPropagation(); onSelectOrg(org.id===selectedOrg ? null : org.id); }}>
                {sel && <circle r={r+7} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.5}/>}
                <circle r={r} fill={col}
                  stroke={sel ? "#FFFFFF" : "rgba(255,255,255,0.15)"}
                  strokeWidth={sel ? 2 : 1} opacity={0.92}/>
                <text textAnchor="middle" dy={r + 11}
                  fill={T.muted} fontSize="8.5" fontFamily="system-ui"
                  pointerEvents="none">
                  {org.shortName}
                </text>
              </g>
            );
          });
        })()}

        {/* Compass */}
        <text x={12} y={PAD.t + 16} fill={T.dim} fontSize="9" fontFamily="system-ui">N↑</text>
        <text x={12} y={PAD.t + ch - 6} fill={T.dim} fontSize="9" fontFamily="system-ui">S↓</text>
        <text x={dim.w - 56} y={dim.h - 8} fill={T.dim} fontSize="9" fontFamily="system-ui">← W | E →</text>

        {/* Scale note */}
        <text x={PAD.l + 6} y={PAD.t - 8} fill={T.dim} fontSize="9" fontFamily="system-ui">
          Connecticut — geographic org placement
        </text>
      </svg>
    </div>
  );
}
