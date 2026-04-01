import { T, ORG_COLORS, ORG_LABELS } from "../utils/colors.js";
import { SCENARIOS } from "../data/scenarios.js";
import SearchBar from "./SearchBar.jsx";

const ALL_TYPES    = Object.keys(ORG_LABELS);
const ALL_COUNTIES = ["Hartford","Fairfield","New Haven","Middlesex","New London","Tolland","Windham","Litchfield"];

const Btn = ({ active, color, onClick, children, style={} }) => (
  <button onClick={onClick} style={{
    padding:"3px 8px", borderRadius:"4px", fontSize:"10px", cursor:"pointer",
    background: active ? (color||T.blue)+"33" : T.bg,
    border: `1px solid ${active ? (color||T.blue) : T.border}`,
    color: active ? (color||T.blue) : T.muted,
    fontWeight: active ? 700 : 400,
    transition:"all 0.12s", display:"flex", alignItems:"center", gap:"3px",
    whiteSpace:"nowrap", flexShrink:0, ...style,
  }}>{children}</button>
);

const Sep = () => <div style={{width:"1px",height:"20px",background:T.border,flexShrink:0,marginLeft:2,marginRight:2}}/>;

// Scenario short labels to save space
const SCENARIO_SHORT = {
  normal:          { icon:"🌐", label:"Normal" },
  ice_raid:        { icon:"🚨", label:"ICE" },
  economic_crisis: { icon:"📉", label:"Economic" },
  natural_disaster:{ icon:"🌪", label:"Disaster" },
  pandemic:        { icon:"🏥", label:"Public Health" },
};

export default function Toolbar({
  scenario, setScenario, viewMode, setViewMode,
  rightPanel, setRightPanel, filters, setFilters,
  onSubmitData, onExportReport, onExportPlaybook, onExportCSV, onSelectOrg,
}) {
  const toggleType = (type) => {
    const cur = filters.types || [];
    setFilters({...filters, types: cur.includes(type) ? cur.filter(t=>t!==type) : [...cur,type]});
  };
  const fullWidth = ["problems","compare","funding"].includes(viewMode);

  return (
    <div style={{ background:T.panel, borderBottom:`1px solid ${T.border}`, fontFamily:"system-ui,sans-serif", userSelect:"none" }}>

      {/* ── Row 1 ── */}
      <div style={{
        display:"flex", alignItems:"center", gap:"4px",
        padding:"5px 10px",
      }}>
        {/* Brand — compact */}
        <div style={{display:"flex",alignItems:"center",gap:"6px",flexShrink:0,marginRight:"3px"}}>
          <div style={{
            width:"22px",height:"22px",borderRadius:"4px",flexShrink:0,
            background:"linear-gradient(135deg,#1D4ED8,#0D9488)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",
          }}>🗺</div>
          <div style={{lineHeight:1,flexShrink:0}}>
            <div style={{fontSize:"9.5px",fontWeight:800,color:T.text}}>CT RESILIENCE</div>
            <div style={{fontSize:"6.5px",color:T.dim}}>COUNCIL FOR PHILANTHROPY</div>
          </div>
        </div>

        <Sep/>

        {/* Scenarios — use short labels */}
        <div style={{display:"flex",gap:"2px"}}>
          {Object.entries(SCENARIOS).map(([key, s]) => {
            const short = SCENARIO_SHORT[key] || s;
            return (
              <Btn key={key} active={scenario===key} color={s.color} onClick={()=>setScenario(key)}>
                <span>{short.icon}</span><span>{short.label}</span>
              </Btn>
            );
          })}
        </div>

        <Sep/>

        {/* View modes */}
        <div style={{display:"flex",gap:"2px"}}>
          {[
            {id:"network",  icon:"⬡", label:"Network"},
            {id:"geo",      icon:"📍", label:"Map"},
            {id:"problems", icon:"🔗", label:"Problems"},
            {id:"compare",  icon:"⚡", label:"Compare"},
            {id:"funding",  icon:"💰", label:"Funding"},
          ].map(v => (
            <Btn key={v.id} active={viewMode===v.id} color={T.blue} onClick={()=>setViewMode(v.id)}>
              {v.icon} {v.label}
            </Btn>
          ))}
        </div>

        {/* Right panel tabs */}
        {!fullWidth && <>
          <Sep/>
          <div style={{display:"flex",gap:"2px"}}>
            {[
              {id:"gap",      icon:"📊", label:"Gaps"},
              {id:"coord",    icon:"⚡", label:"Coord."},
              {id:"county",   icon:"🗺", label:"Counties"},
              {id:"incident", icon:"🚨", label:"LIVE", red: scenario==="ice_raid"},
            ].map(p => (
              <Btn key={p.id} active={rightPanel===p.id}
                color={p.red ? "#EF4444" : T.accent}
                onClick={()=>setRightPanel(p.id===rightPanel?null:p.id)}
                style={p.red ? {
                  background: rightPanel===p.id ? "#EF444430" : "#EF444410",
                  border: `1px solid ${rightPanel===p.id ? "#EF4444" : "#EF444450"}`,
                  color:"#EF4444",
                } : {}}>
                {p.icon} {p.label}
              </Btn>
            ))}
          </div>
        </>}

        {/* Spacer */}
        <div style={{flex:1, minWidth:0}}/>

        {/* Right-aligned: Search + Actions */}
        <div style={{display:"flex",alignItems:"center",gap:"3px",flexShrink:0}}>
          <SearchBar onSelectOrg={onSelectOrg} scenario={scenario}/>
          <Sep/>
          <Btn active={false} color={T.green} onClick={onSubmitData}
            style={{background:T.green+"18",border:`1px solid ${T.green}55`,color:T.green,fontWeight:600,fontSize:"9px",padding:"3px 6px"}}>
            + Data
          </Btn>
          <Btn active={false} color="#94A3B8" onClick={onExportCSV}
            style={{background:"#1E293B",border:"1px solid #334155",color:"#94A3B8",fontWeight:600,fontSize:"9px",padding:"3px 6px"}}
            title="Download all org data as CSV">
            ⬇ CSV
          </Btn>
          {scenario !== "normal" && <>
            <Btn active={false} color="#60A5FA" onClick={onExportReport}
              style={{background:"#1D4ED815",border:"1px solid #1D4ED850",color:"#60A5FA",fontWeight:600,fontSize:"9px",padding:"3px 6px"}}
              title="Export gap analysis report (HTML/PDF)">
              📄
            </Btn>
            <Btn active={false} color="#A78BFA" onClick={onExportPlaybook}
              style={{background:"#7C3AED15",border:"1px solid #7C3AED50",color:"#A78BFA",fontWeight:600,fontSize:"9px",padding:"3px 6px"}}
              title="Export activation playbook with all org contacts">
              📋
            </Btn>
          </>}
        </div>
      </div>

      {/* ── Row 2: Type filters ── */}
      {(viewMode === "network" || viewMode === "geo") && (
        <div style={{
          display:"flex", alignItems:"center", gap:"3px",
          padding:"3px 10px 4px", flexWrap:"wrap", borderTop:`1px solid ${T.border}`,
        }}>
          <span style={{fontSize:"7.5px",color:T.dim,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",flexShrink:0}}>TYPE:</span>
          <button onClick={()=>setFilters({...filters,types:[]})} style={{
            padding:"1px 6px",borderRadius:"3px",fontSize:"8.5px",cursor:"pointer",
            background:(!filters.types?.length)?T.text+"18":T.bg,
            border:`1px solid ${(!filters.types?.length)?T.borderBright:T.border}`,
            color:(!filters.types?.length)?T.text:T.muted,
          }}>All</button>
          {ALL_TYPES.map(type => {
            const active = filters.types?.includes(type);
            return (
              <button key={type} onClick={()=>toggleType(type)} style={{
                padding:"1px 6px",borderRadius:"3px",fontSize:"8.5px",cursor:"pointer",
                background:active?ORG_COLORS[type]+"18":T.bg,
                border:`1px solid ${active?ORG_COLORS[type]:T.border}`,
                color:active?ORG_COLORS[type]:T.muted,
                display:"flex",alignItems:"center",gap:"3px",
              }}>
                <span style={{width:"5px",height:"5px",borderRadius:"50%",
                  background:ORG_COLORS[type],display:"inline-block",flexShrink:0}}/>
                {ORG_LABELS[type]}
              </button>
            );
          })}
          <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"4px"}}>
            <span style={{fontSize:"7.5px",color:T.dim,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em"}}>COUNTY:</span>
            <select value={filters.county||""} onChange={e=>setFilters({...filters,county:e.target.value||null})}
              style={{background:T.bg,border:`1px solid ${T.border}`,color:T.muted,
                borderRadius:"4px",padding:"1px 5px",fontSize:"8.5px",cursor:"pointer"}}>
              <option value="">All</option>
              {ALL_COUNTIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
