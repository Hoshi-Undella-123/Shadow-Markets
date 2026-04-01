export const T = {
  bg:          "#060C16",
  surface:     "#0D1829",
  panel:       "#111E30",
  border:      "#1E3050",
  borderBright:"#2A4070",
  text:        "#E8F0FF",
  muted:       "#5A7AA0",
  dim:         "#2A4060",
  accent:      "#F97316",
  accentDim:   "#7B3A10",
  green:       "#22C55E",
  amber:       "#F59E0B",
  red:         "#EF4444",
  blue:        "#3B82F6",
};

export const ORG_COLORS = {
  foundation:  "#3B82F6",
  legal:       "#8B5CF6",
  shelter:     "#F59E0B",
  food:        "#10B981",
  mentalHealth:"#EC4899",
  advocacy:    "#06B6D4",
  government:  "#64748B",
  faith:       "#D97706",
};

export const ORG_LABELS = {
  foundation:  "Foundation / Funder",
  legal:       "Legal Services",
  shelter:     "Shelter & Housing",
  food:        "Food & Basic Needs",
  mentalHealth:"Mental Health",
  advocacy:    "Advocacy / Comms",
  government:  "Government",
  faith:       "Faith Community",
};

export const RES_META = {
  legal:         { label: "Legal Aid",     color: "#8B5CF6", icon: "⚖" },
  shelter:       { label: "Shelter",       color: "#F59E0B", icon: "🏠" },
  food:          { label: "Food",          color: "#10B981", icon: "🍎" },
  mentalHealth:  { label: "Mental Health", color: "#EC4899", icon: "🧠" },
  financialAid:  { label: "Financial Aid", color: "#3B82F6", icon: "💰" },
  communications:{ label: "Comms",         color: "#06B6D4", icon: "📡" },
};

export const trustColor = s => s >= 90 ? T.green : s >= 75 ? T.amber : T.red;
