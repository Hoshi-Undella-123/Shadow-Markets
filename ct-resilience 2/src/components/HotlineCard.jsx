import { useState } from "react";
import { T } from "../utils/colors.js";

// Curated ICE rapid-response hotlines — manually verified, ordered by priority
const ICE_HOTLINES = [
  { name:"211 CT Helpline",      number:"211",              note:"24/7 · Resource navigation · All languages",   color:"#22C55E" },
  { name:"CIRA Statewide Alert", number:"(860) 906-8000",   note:"Rapid alert network · 120K+ community reach",  color:"#EF4444" },
  { name:"Make the Road CT",     number:"(203) 549-5220",   note:"SW CT rapid response · Spanish & English",     color:"#F59E0B" },
  { name:"NLG Legal Observers",  number:"(203) 896-7221",   note:"Report arrests · Dispatch legal observers",    color:"#8B5CF6" },
  { name:"CT Legal Services",    number:"(800) 798-0671",   note:"Immigration legal hotline · Statewide",        color:"#3B82F6" },
  { name:"Sanctuary CT",         number:"(860) 519-0966",   note:"Physical sanctuary placement network",         color:"#D97706" },
  { name:"CT Bail Fund",         number:"ctbailfund.org",   note:"Immigration bond payment assistance",          color:"#EC4899" },
  { name:"IRIS New Haven Hub",   number:"(203) 562-2095",   note:"12 languages · KYR cards available",          color:"#06B6D4" },
];

const DISASTER_HOTLINES = [
  { name:"211 CT Helpline",      number:"211",              note:"24/7 · Shelter, food, emergency resources",    color:"#22C55E" },
  { name:"CT DMHAS Crisis",      number:"(800) 563-4086",   note:"Mental health emergency · Statewide",          color:"#EC4899" },
  { name:"Red Cross CT",         number:"(800) 435-7669",   note:"Disaster relief · Shelter placement",          color:"#EF4444" },
  { name:"CT Food Bank",         number:"(203) 469-5000",   note:"Emergency food distribution",                  color:"#10B981" },
  { name:"CCEH",                 number:"(860) 721-7876",   note:"Emergency shelter coordination",               color:"#F59E0B" },
];

const PANDEMIC_HOTLINES = [
  { name:"211 CT Helpline",      number:"211",              note:"24/7 · Health resources navigation",           color:"#22C55E" },
  { name:"CT DPH Hotline",       number:"(860) 509-7994",   note:"CT Dept of Public Health",                    color:"#EF4444" },
  { name:"Yale New Haven Health",number:"(866) 388-8996",   note:"Hospital system COVID line",                   color:"#3B82F6" },
  { name:"Husky 4 Immigrants",   number:"husky4immigrants.org", note:"Healthcare access for immigrants",         color:"#8B5CF6" },
  { name:"CHC Federally Qualified",number:"(860) 347-6971", note:"FQHC network · No-cost care",                 color:"#10B981" },
];

const HOTLINES_BY_SCENARIO = {
  ice_raid:         ICE_HOTLINES,
  natural_disaster: DISASTER_HOTLINES,
  pandemic:         PANDEMIC_HOTLINES,
};

const LABELS = {
  ice_raid:         "🚨 ICE Rapid Response",
  natural_disaster: "🌪 Disaster Emergency",
  pandemic:         "🏥 Health Emergency",
};

export default function HotlineCard({ scenario }) {
  const [collapsed, setCollapsed] = useState(false);
  const hotlines = HOTLINES_BY_SCENARIO[scenario];
  if (!hotlines) return null;

  const label = LABELS[scenario];
  const accentColor = scenario === "ice_raid" ? "#EF4444" : scenario === "natural_disaster" ? "#F59E0B" : "#3B82F6";

  return (
    <div style={{
      position:"absolute", bottom:"48px", left:"12px",
      background:"rgba(6,12,22,0.96)", backdropFilter:"blur(8px)",
      border:`1px solid ${accentColor}44`,
      borderRadius:"10px", width:"248px", zIndex:100,
      boxShadow:"0 8px 32px rgba(0,0,0,0.5)",
      fontFamily:"system-ui, sans-serif", overflow:"hidden",
    }}>
      <div onClick={() => setCollapsed(c=>!c)} style={{
        padding:"8px 12px", cursor:"pointer",
        background:`${accentColor}11`,
        borderBottom: collapsed ? "none" : `1px solid ${T.border}`,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <div style={{ width:"7px", height:"7px", borderRadius:"50%",
            background:accentColor, boxShadow:`0 0 5px ${accentColor}` }}/>
          <span style={{ fontSize:"10px", fontWeight:800, color:T.text, letterSpacing:"0.04em" }}>
            {label}
          </span>
        </div>
        <span style={{ fontSize:"9px", color:T.muted }}>{collapsed?"▲":"▼"}</span>
      </div>

      {!collapsed && (
        <div style={{ maxHeight:"320px", overflowY:"auto" }}>
          {hotlines.map((h, i) => (
            <div key={i} style={{
              padding:"6px 12px",
              borderBottom:`1px solid ${T.border}22`,
              display:"flex", alignItems:"center", gap:"8px",
            }}>
              <span style={{
                minWidth:"16px", height:"16px", borderRadius:"50%",
                background: i < 4 ? h.color : "#1E2A3A",
                color:"#fff", fontSize:"8px", fontWeight:800,
                display:"flex", alignItems:"center", justifyContent:"center",
                flexShrink:0, border: i >= 4 ? `1px solid ${h.color}66` : "none",
              }}>{i+1}</span>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:"8.5px", color:T.muted, lineHeight:1.2,
                  overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {h.name}
                </div>
                <div style={{ fontSize:"12px", fontWeight:800, color:h.color,
                  fontVariantNumeric:"tabular-nums", lineHeight:1.3 }}>
                  {h.number}
                </div>
                <div style={{ fontSize:"8px", color:T.dim, lineHeight:1.3 }}>{h.note}</div>
              </div>
            </div>
          ))}
          <div style={{ padding:"6px 12px 8px", fontSize:"8px", color:T.dim, lineHeight:1.6 }}>
            📋 Full playbook: use Playbook button in toolbar
          </div>
        </div>
      )}
    </div>
  );
}
