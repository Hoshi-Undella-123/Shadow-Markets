import { ORG_COLORS, T } from "./colors.js";

export const nodeRadius = org =>
  9 + Math.log((org.budget || 500000) / 100000) * 3.5;

export const nodeColor = (org, scenario) => {
  if (scenario === "normal") return ORG_COLORS[org.type] || T.muted;
  const c = org.scenarioCommitments?.[scenario];
  if (!c) return "#0D1829";
  return c.committed ? T.green : T.amber;
};

export const fmtMoney = n =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M`
  : n >= 1_000   ? `$${(n / 1_000).toFixed(0)}K`
  : `$${n}`;

export const fmtRes = (key, val) => {
  if (val === undefined || val === 0) return "—";
  return key === "financialAid" ? fmtMoney(val) : `${val}%`;
};

// Shared section-header style
export const sH = {
  fontSize: "9px",
  fontWeight: 800,
  letterSpacing: "0.1em",
  color: T.muted,
  textTransform: "uppercase",
  marginBottom: "8px",
  borderBottom: `1px solid ${T.border}`,
  paddingBottom: "4px",
};

// CT geographic bounds
export const CT_BOUNDS = {
  latMin: 40.95, latMax: 42.05,
  lngMin: -73.73, lngMax: -71.79,
};

export const toXY = (lat, lng, w, h) => ({
  x: (lng - CT_BOUNDS.lngMin) / (CT_BOUNDS.lngMax - CT_BOUNDS.lngMin) * w,
  y: (1 - (lat - CT_BOUNDS.latMin) / (CT_BOUNDS.latMax - CT_BOUNDS.latMin)) * h,
});

export const COUNTY_CENTERS = {
  Fairfield:    { lat: 41.2,  lng: -73.35 },
  "New Haven":  { lat: 41.38, lng: -72.93 },
  Hartford:     { lat: 41.77, lng: -72.70 },
  Middlesex:    { lat: 41.50, lng: -72.55 },
  "New London": { lat: 41.40, lng: -72.10 },
  Tolland:      { lat: 41.85, lng: -72.38 },
  Windham:      { lat: 41.85, lng: -71.95 },
  Litchfield:   { lat: 41.72, lng: -73.22 },
};
