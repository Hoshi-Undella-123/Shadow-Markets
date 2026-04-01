import { useState } from "react";
import { T } from "./utils/colors.js";
import { ORGS, EDGES } from "./data/orgs.js";
import { generateReport }   from "./utils/report.js";
import { generatePlaybook } from "./utils/playbook.js";
import { exportCSV }        from "./utils/csvexport.js";
import NetworkGraph        from "./components/NetworkGraph.jsx";
import GeoMap              from "./components/GeoMap.jsx";
import OrgPanel            from "./components/OrgPanel.jsx";
import GapPanel            from "./components/GapPanel.jsx";
import CoordinationPanel   from "./components/CoordinationPanel.jsx";
import ScenarioComparison  from "./components/ScenarioComparison.jsx";
import CountyCoveragePanel from "./components/CountyCoveragePanel.jsx";
import FundingFlows        from "./components/FundingFlows.jsx";
import IncidentDashboard   from "./components/IncidentDashboard.jsx";
import Toolbar             from "./components/Toolbar.jsx";
import DataEntryPanel      from "./components/DataEntryPanel.jsx";
import ProblemMap          from "./components/ProblemMap.jsx";
import HotlineCard         from "./components/HotlineCard.jsx";
import WelcomeOverlay      from "./components/WelcomeOverlay.jsx";

export default function App() {
  const [scenario,     setScenario]     = useState("ice_raid");
  const [viewMode,     setViewMode]     = useState("network");
  const [selectedOrg,  setSelectedOrg]  = useState(null);
  const [rightPanel,   setRightPanel]   = useState("gap");
  const [filters,      setFilters]      = useState({ types:[], county:null, minTrust:0 });
  const [showDataEntry,setShowDataEntry]= useState(false);
  const [showWelcome,  setShowWelcome]  = useState(true);

  const selectedOrgData = ORGS.find(o => o.id === selectedOrg);

  const handleSelectOrg = (id) => {
    setSelectedOrg(id);
    if (id) setRightPanel("org");
    if (id && ["compare","problems","funding"].includes(viewMode)) setViewMode("network");
  };
  const handleCloseOrg = () => { setSelectedOrg(null); setRightPanel("gap"); };

  const fullWidth = ["problems","compare","funding"].includes(viewMode);
  const PANEL_IDS = ["gap","coord","county","incident"];
  const showRight = !fullWidth &&
    (PANEL_IDS.includes(rightPanel) || (rightPanel === "org" && !!selectedOrgData));

  return (
    <div style={{
      height:"100vh", display:"flex", flexDirection:"column",
      background:T.bg, color:T.text,
      fontFamily:"system-ui,-apple-system,sans-serif", overflow:"hidden",
    }}>
      <Toolbar
        scenario={scenario}       setScenario={setScenario}
        viewMode={viewMode}       setViewMode={setViewMode}
        rightPanel={rightPanel}   setRightPanel={setRightPanel}
        filters={filters}         setFilters={setFilters}
        onSubmitData={() => setShowDataEntry(true)}
        onExportReport={() => generateReport(scenario, ORGS)}
        onExportPlaybook={() => generatePlaybook(scenario)}
        onExportCSV={() => exportCSV()}
        onSelectOrg={handleSelectOrg}
      />

      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        {/* ── Main canvas ── */}
        <div style={{ flex:1, position:"relative", overflow:"hidden" }}>
          {viewMode === "network"  && <NetworkGraph orgs={ORGS} edges={EDGES} selectedOrg={selectedOrg} onSelectOrg={handleSelectOrg} scenario={scenario} filters={filters}/>}
          {viewMode === "geo"      && <GeoMap orgs={ORGS} selectedOrg={selectedOrg} onSelectOrg={handleSelectOrg} scenario={scenario} filters={filters}/>}
          {viewMode === "problems" && <ProblemMap orgs={ORGS} onSelectOrg={handleSelectOrg}/>}
          {viewMode === "compare"  && <ScenarioComparison orgs={ORGS}/>}
          {viewMode === "funding"  && <FundingFlows orgs={ORGS} onSelectOrg={handleSelectOrg}/>}

          {!fullWidth && <Legend scenario={scenario}/>}
          {(viewMode==="network"||viewMode==="geo") && <HotlineCard scenario={scenario}/>}
          {(viewMode==="network"||viewMode==="geo") && (
            <div style={{
              position:"absolute", bottom:"12px", right:"12px",
              background:"rgba(13,24,41,0.88)", backdropFilter:"blur(6px)",
              border:`1px solid ${T.border}`, borderRadius:"6px",
              padding:"5px 10px", fontSize:"9px", color:T.muted,
              display:"flex", gap:"10px",
            }}>
              <span>{ORGS.length} orgs</span>
              <span style={{color:T.dim}}>·</span>
              <span>{EDGES.length} connections</span>
              {viewMode === "network" && <><span style={{color:T.dim}}>·</span><span style={{color:T.dim}}>Drag · Zoom · Click</span></>}
            </div>
          )}
        </div>

        {/* ── Right panel ── */}
        {showRight && (
          <div style={{
            width:"300px", flexShrink:0,
            borderLeft:`1px solid ${T.border}`,
            background:T.panel, overflow:"hidden", display:"flex", flexDirection:"column",
          }}>
            {rightPanel === "org" && selectedOrgData
              ? <OrgPanel org={selectedOrgData} scenario={scenario} onClose={handleCloseOrg}/>
              : rightPanel === "coord"
              ? <CoordinationPanel scenario={scenario} orgs={ORGS} onSelectOrg={handleSelectOrg}/>
              : rightPanel === "county"
              ? <CountyCoveragePanel orgs={ORGS} scenario={scenario} onSelectOrg={handleSelectOrg}/>
              : rightPanel === "incident"
              ? <IncidentDashboard scenario={scenario}/>
              : <GapPanel scenario={scenario} orgs={ORGS}/>
            }
          </div>
        )}
      </div>

      {showDataEntry && <DataEntryPanel onClose={() => setShowDataEntry(false)}/>}
      {showWelcome && <WelcomeOverlay
        onDismiss={() => setShowWelcome(false)}
        onSelectScenario={(s) => { setScenario(s); setShowWelcome(false); }}
      />}
    </div>
  );
}

function Legend({ scenario }) {
  const items = scenario === "normal"
    ? [
        {color:"#3B82F6",label:"Foundation"}, {color:"#8B5CF6",label:"Legal"},
        {color:"#F59E0B",label:"Shelter"},    {color:"#10B981",label:"Food"},
        {color:"#EC4899",label:"Mental Health"},{color:"#06B6D4",label:"Advocacy"},
        {color:"#64748B",label:"Government"}, {color:"#D97706",label:"Faith"},
      ]
    : [
        {color:"#22C55E",label:"Committed"},
        {color:"#F59E0B",label:"Partial / Uncommitted"},
        {color:"#0D1829",label:"Not Applicable"},
      ];
  return (
    <div style={{
      position:"absolute", top:"12px", left:"12px",
      background:"rgba(13,24,41,0.88)", backdropFilter:"blur(6px)",
      border:"1px solid #1E3050", borderRadius:"8px",
      padding:"10px 12px", minWidth:"128px",
    }}>
      <div style={{fontSize:"8px",fontWeight:700,color:"#5A7AA0",
        letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"8px"}}>LEGEND</div>
      {items.map(({color,label})=>(
        <div key={label} style={{display:"flex",alignItems:"center",
          gap:"6px",marginBottom:"5px",fontSize:"10px",color:"#5A7AA0"}}>
          <span style={{width:"8px",height:"8px",borderRadius:"50%",background:color,flexShrink:0}}/>
          {label}
        </div>
      ))}
      <div style={{marginTop:"8px",paddingTop:"6px",borderTop:"1px solid #1E3050",
        fontSize:"8px",color:"#2A4060"}}>Node size = budget</div>
    </div>
  );
}
