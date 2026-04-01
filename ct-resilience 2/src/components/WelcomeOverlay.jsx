import { useState } from "react";
import { T } from "../utils/colors.js";
import { ORGS, EDGES } from "../data/orgs.js";

const SCENARIO_OPTIONS = [
  { id:"ice_raid",         icon:"🚨", label:"ICE Enforcement Action",
    desc:"405 arrests Jan–Jul 2025. Happening NOW.", color:"#EF4444" },
  { id:"economic_crisis",  icon:"📉", label:"Economic Crisis",
    desc:"Funding cuts, job losses, benefit cliffs.", color:"#F59E0B" },
  { id:"natural_disaster", icon:"🌪", label:"Natural Disaster",
    desc:"Hurricanes, floods, extreme weather.", color:"#3B82F6" },
  { id:"pandemic",         icon:"🏥", label:"Public Health Emergency",
    desc:"Disease outbreak, hospital surge.", color:"#8B5CF6" },
];

export default function WelcomeOverlay({ onDismiss, onSelectScenario }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:500,
      background:"rgba(6,12,22,0.90)", backdropFilter:"blur(8px)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontFamily:"system-ui,-apple-system,sans-serif",
    }}>
      <div style={{
        background:T.panel, border:`1px solid ${T.border}`,
        borderRadius:"16px", width:"560px", padding:"28px 32px",
        boxShadow:"0 24px 64px rgba(0,0,0,0.7)",
      }}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",gap:"14px",marginBottom:"18px"}}>
          <div style={{
            width:"48px",height:"48px",borderRadius:"10px",flexShrink:0,
            background:"linear-gradient(135deg,#1D4ED8,#0D9488)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",
          }}>🗺</div>
          <div>
            <div style={{fontSize:"17px",fontWeight:800,color:T.text,letterSpacing:"0.01em"}}>
              CT Resilience Network
            </div>
            <div style={{fontSize:"10px",color:T.muted,marginTop:"2px"}}>
              Connecticut Council for Philanthropy · Crisis Ecosystem Map
            </div>
          </div>
        </div>

        {/* Alert callout */}
        <div style={{
          background:"#1A0808",border:`1px solid #EF444433`,
          borderRadius:"8px",padding:"11px 14px",marginBottom:"20px",
          fontSize:"10.5px",lineHeight:1.8,color:"#FCA5A5",
        }}>
          <strong style={{color:"#EF4444"}}>🚨 This is happening now — not a hypothetical</strong>
          <br/>
          ICE arrested <strong style={{color:"#fff"}}>405 people in CT</strong> in the first 7 months of 2025 — up 
          <strong style={{color:"#fff"}}> 134%</strong> from 2024. Hartford, Danbury, Stamford are hotspots.
          Schools are reporting enrollment drops. <strong style={{color:"#fff"}}>This map is CT's preparation tool.</strong>
        </div>

        {/* Scenario chooser */}
        <div style={{fontSize:"9px",fontWeight:700,color:T.dim,
          letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:"10px"}}>
          SELECT A SCENARIO TO EXPLORE
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px",marginBottom:"20px"}}>
          {SCENARIO_OPTIONS.map(s => (
            <button
              key={s.id}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { onSelectScenario(s.id); onDismiss(); }}
              style={{
                padding:"10px 14px",borderRadius:"8px",cursor:"pointer",textAlign:"left",
                background: hovered===s.id ? s.color+"20" : T.bg,
                border:`1px solid ${hovered===s.id ? s.color : T.border}`,
                transition:"all 0.12s",
              }}
            >
              <div style={{display:"flex",alignItems:"center",gap:"7px",marginBottom:"3px"}}>
                <span style={{fontSize:"16px"}}>{s.icon}</span>
                <span style={{fontSize:"10px",fontWeight:700,color:s.color}}>{s.label}</span>
              </div>
              <div style={{fontSize:"9px",color:T.muted,paddingLeft:"23px"}}>{s.desc}</div>
            </button>
          ))}
        </div>

        {/* Stats row */}
        <div style={{
          display:"flex",gap:"16px",justifyContent:"center",
          padding:"10px",background:T.bg,borderRadius:"8px",
          marginBottom:"16px",
        }}>
          {[
            {val:ORGS.length,  label:"Orgs Mapped"},
            {val:EDGES.length, label:"Connections"},
            {val:"8",          label:"CT Counties"},
            {val:"4",          label:"Scenarios"},
          ].map(stat => (
            <div key={stat.label} style={{textAlign:"center",flex:1}}>
              <div style={{fontSize:"18px",fontWeight:800,color:T.text}}>{stat.val}</div>
              <div style={{fontSize:"8px",color:T.dim,textTransform:"uppercase",
                letterSpacing:"0.06em",marginTop:"1px"}}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{display:"flex",gap:"8px"}}>
          <button
            onClick={onDismiss}
            style={{
              flex:1,padding:"10px",borderRadius:"7px",
              background:"linear-gradient(135deg,#1D4ED8,#0D9488)",
              border:"none",color:"#fff",fontSize:"12px",fontWeight:700,
              cursor:"pointer",letterSpacing:"0.02em",
            }}>
            Open Full Map →
          </button>
          <button onClick={onDismiss} style={{
            padding:"10px 14px",borderRadius:"7px",
            background:T.bg,border:`1px solid ${T.border}`,
            color:T.muted,fontSize:"10px",cursor:"pointer",
          }}>Skip</button>
        </div>

        <div style={{
          marginTop:"10px",fontSize:"8px",color:T.dim,textAlign:"center",lineHeight:1.6
        }}>
          Data from CT Mirror, CT Public Radio, CTData.org (Deportation Data Project FOIA),
          IRIS, and public org records. Updated April 2026.
        </div>
      </div>
    </div>
  );
}
