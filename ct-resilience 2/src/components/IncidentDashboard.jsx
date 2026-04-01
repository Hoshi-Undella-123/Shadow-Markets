import { useState } from "react";
import { T, ORG_COLORS } from "../utils/colors.js";
import { ORGS } from "../data/orgs.js";
import { generateKYRCard } from "../utils/kyrcard.js";

const HOTLINES = [
  { name:"211 CT Helpline",       number:"211",              note:"24/7 · All languages · Resource navigation",     color:"#22C55E" },
  { name:"CIRA Alert Network",    number:"(860) 906-8000",    note:"Statewide alert · 120K+ reach",                 color:"#EF4444" },
  { name:"Make the Road CT",      number:"(203) 549-5220",    note:"SW CT rapid response · Spanish/English",        color:"#F59E0B" },
  { name:"NLG Legal Observer",    number:"(203) 896-7221",    note:"Report arrests · Legal observers dispatch",     color:"#8B5CF6" },
  { name:"CT Legal Services",     number:"(800) 798-0671",    note:"Immigration legal hotline · Statewide",         color:"#3B82F6" },
  { name:"Sanctuary CT",          number:"(860) 519-0966",    note:"Physical sanctuary placement",                  color:"#D97706" },
  { name:"CT Bail Fund",          number:"ctbailfund.org",    note:"Immigration bond payment assistance",           color:"#EC4899" },
  { name:"IRIS",                  number:"(203) 562-2095",    note:"New Haven hub · 12 languages",                 color:"#06B6D4" },
];

const KYR_RIGHTS = [
  { right:"REMAIN SILENT", detail:"You have the right to remain silent. Do not answer questions about your immigration status, where you were born, or how you entered the US." },
  { right:"REFUSE ENTRY", detail:'You do not have to open the door. ICE cannot enter your home without a judicial warrant signed by a judge. Ask to see the warrant through the door.' },
  { right:"REQUEST A LAWYER", detail:'Say clearly: "I want to speak to a lawyer." Do not sign any documents without a lawyer present.' },
  { right:"DO NOT SIGN", detail:"Do not sign anything ICE gives you, especially if you do not understand it. Signing could waive your rights." },
  { right:"DOCUMENT EVERYTHING", detail:"If safe to do so: write down agent names, badge numbers, vehicles, what was said. Call NLG legal observers: (203) 896-7221." },
  { right:"CHILDREN ARE PROTECTED", detail:"Schools cannot turn over children to ICE. Plyler v. Doe: all children have right to public education regardless of status." },
];

const CHECKLIST_ITEMS = [
  { id:"alert_sent",    label:"Alert sent via CIRA + Make the Road hotlines",         critical:true },
  { id:"legal_notified",label:"CT Legal Services + NLG legal observers notified",      critical:true },
  { id:"iris_activated",label:"IRIS rapid response team activated",                    critical:true },
  { id:"211_updated",   label:"211 database updated with emergency resources",         critical:true },
  { id:"ag_notified",   label:"AG office notified of rights violations (if any)",     critical:false },
  { id:"sanctuary",     label:"Sanctuary CT contacted for physical placement needs",   critical:false },
  { id:"bail_fund",     label:"CT Bail Fund alerted to expected bond requests",        critical:false },
  { id:"food_orgs",     label:"Foodshare + CT Food Bank alerted to surge needs",       critical:false },
  { id:"hospitals",     label:"Yale + Hartford HealthCare trauma services activated",  critical:false },
  { id:"schools",       label:"CT Dept of Education guidance issued to districts",     critical:false },
  { id:"funders",       label:"CCP emergency funder call scheduled within 24 hrs",     critical:false },
  { id:"mayor_comms",   label:"Hartford + New Haven mayors issued public statements",  critical:false },
];

export default function IncidentDashboard({ scenario }) {
  const [checked, setChecked] = useState({});
  const [location, setLocation] = useState("");
  const [tab, setTab] = useState("hotlines"); // hotlines | kyr | checklist | orgs

  if (scenario !== "ice_raid") {
    return (
      <div style={{ padding:"32px 24px", textAlign:"center", color:T.muted,
        fontFamily:"system-ui", fontSize:"11px" }}>
        <div style={{ fontSize:"32px", marginBottom:"12px" }}>🛡</div>
        <div style={{ fontWeight:700, color:T.text, marginBottom:"8px" }}>Incident Dashboard</div>
        <div>Switch to the <span style={{color:"#EF4444"}}>🚨 ICE Enforcement</span> scenario<br/>to activate the real-time coordination dashboard.</div>
      </div>
    );
  }

  const completedCritical = CHECKLIST_ITEMS.filter(i => i.critical && checked[i.id]).length;
  const totalCritical = CHECKLIST_ITEMS.filter(i => i.critical).length;
  const completedAll = Object.keys(checked).filter(k => checked[k]).length;

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column",
      fontFamily:"system-ui, sans-serif", color:T.text, overflow:"hidden" }}>

      {/* Header */}
      <div style={{
        padding:"10px 14px",
        background:"#1A0808",
        borderBottom:`1px solid #EF444444`,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"6px" }}>
          <div style={{
            width:"10px", height:"10px", borderRadius:"50%",
            background:"#EF4444", boxShadow:"0 0 6px #EF4444",
            animation:"pulse 1.5s infinite",
          }}/>
          <span style={{ fontSize:"11px", fontWeight:800, color:"#EF4444", letterSpacing:"0.04em" }}>
            INCIDENT ACTIVE — ICE ENFORCEMENT
          </span>
        </div>
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          placeholder="Enter location (e.g. Hamden, Hartford, Danbury...)"
          style={{
            width:"100%", background:"#0D0404", border:"1px solid #EF444444",
            borderRadius:"5px", color:T.text, padding:"6px 10px",
            fontSize:"10px", outline:"none", boxSizing:"border-box",
          }}
        />
        {/* Critical progress */}
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"9px",
          color:T.muted, marginTop:"6px" }}>
          <span>Critical steps: <span style={{
            color: completedCritical === totalCritical ? T.green : T.amber,
            fontWeight:700
          }}>{completedCritical}/{totalCritical}</span></span>
          <span>Total: {completedAll}/{CHECKLIST_ITEMS.length}</span>
        </div>
        <div style={{ height:"3px", background:T.border, borderRadius:"2px", marginTop:"4px", overflow:"hidden" }}>
          <div style={{
            height:"100%",
            width:`${(completedAll/CHECKLIST_ITEMS.length)*100}%`,
            background: completedCritical === totalCritical ? T.green : T.amber,
            transition:"width 0.3s ease",
          }}/>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{
        display:"flex", borderBottom:`1px solid ${T.border}`,
        background:T.panel, flexShrink:0,
      }}>
        {[
          { id:"hotlines",  label:"📞 Hotlines" },
          { id:"checklist", label:"✅ Steps" },
          { id:"kyr",       label:"⚖ KYR" },
          { id:"orgs",      label:"🏢 Orgs" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, padding:"7px 4px", border:"none", cursor:"pointer",
            background: tab===t.id ? T.bg : T.panel,
            color: tab===t.id ? T.text : T.muted,
            fontSize:"9px", fontWeight: tab===t.id ? 700 : 400,
            borderBottom: tab===t.id ? "2px solid #EF4444" : "2px solid transparent",
            fontFamily:"system-ui",
          }}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:"auto" }}>

        {/* HOTLINES */}
        {tab === "hotlines" && (
          <div style={{ padding:"10px" }}>
            <div style={{ fontSize:"9px", color:T.dim, marginBottom:"8px", padding:"0 2px" }}>
              Call these in order. First 4 are critical.
            </div>
            {HOTLINES.map((h, i) => (
              <div key={h.number} style={{
                background:T.bg, borderRadius:"7px", padding:"10px 12px",
                marginBottom:"6px",
                border:`1px solid ${i < 4 ? h.color+"66" : T.border}`,
              }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:"8px" }}>
                  <span style={{
                    minWidth:"18px", height:"18px", borderRadius:"50%",
                    background: i < 4 ? h.color : T.border,
                    color:"#fff", fontSize:"9px", fontWeight:800,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    flexShrink:0, marginTop:"1px",
                  }}>{i+1}</span>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"9px", color:T.muted, marginBottom:"2px" }}>{h.name}</div>
                    <div style={{
                      fontSize:"15px", fontWeight:800, color:h.color,
                      letterSpacing:"0.02em", fontVariantNumeric:"tabular-nums",
                    }}>{h.number}</div>
                    <div style={{ fontSize:"8.5px", color:T.dim, marginTop:"2px" }}>{h.note}</div>
                  </div>
                  {/* Copy button */}
                  <button
                    onClick={() => navigator.clipboard?.writeText(h.number)}
                    style={{
                      background:"none", border:`1px solid ${T.border}`,
                      color:T.dim, fontSize:"8px", padding:"2px 6px",
                      borderRadius:"3px", cursor:"pointer", flexShrink:0,
                    }}>
                    Copy
                  </button>
                </div>
              </div>
            ))}
            <div style={{ padding:"8px 10px", background:"#0A0A0A",
              borderRadius:"6px", border:`1px solid ${T.border}`,
              fontSize:"9px", color:T.dim, lineHeight:1.7, marginTop:"4px" }}>
              📲 Share this list: take a screenshot or use 📋 Playbook export from toolbar
            </div>
          </div>
        )}

        {/* CHECKLIST */}
        {tab === "checklist" && (
          <div style={{ padding:"10px" }}>
            {["CRITICAL — Do First", "IMPORTANT — Within 8 hrs"].map((group, gi) => {
              const items = CHECKLIST_ITEMS.filter(i => gi===0 ? i.critical : !i.critical);
              return (
                <div key={group}>
                  <div style={{
                    fontSize:"8px", fontWeight:800, color: gi===0 ? T.red : T.amber,
                    letterSpacing:"0.08em", textTransform:"uppercase",
                    padding:"5px 2px 4px", borderBottom:`1px solid ${T.border}`, marginBottom:"6px",
                  }}>{group}</div>
                  {items.map(item => (
                    <div key={item.id}
                      onClick={() => setChecked(c => ({...c, [item.id]: !c[item.id]}))}
                      style={{
                        display:"flex", alignItems:"flex-start", gap:"8px",
                        padding:"8px 10px", marginBottom:"4px",
                        background: checked[item.id] ? T.green+"11" : T.bg,
                        border:`1px solid ${checked[item.id] ? T.green+"44" : T.border}`,
                        borderRadius:"6px", cursor:"pointer",
                      }}>
                      <div style={{
                        width:"16px", height:"16px", borderRadius:"4px", flexShrink:0,
                        marginTop:"1px",
                        background: checked[item.id] ? T.green : "transparent",
                        border:`2px solid ${checked[item.id] ? T.green : T.muted}`,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        fontSize:"10px", color:"#fff",
                      }}>
                        {checked[item.id] ? "✓" : ""}
                      </div>
                      <span style={{
                        fontSize:"10px",
                        color: checked[item.id] ? T.muted : T.text,
                        textDecoration: checked[item.id] ? "line-through" : "none",
                        lineHeight:1.5,
                      }}>{item.label}</span>
                    </div>
                  ))}
                  <div style={{ height:"8px" }}/>
                </div>
              );
            })}
          </div>
        )}

        {/* KNOW YOUR RIGHTS */}
        {tab === "kyr" && (
          <div style={{ padding:"10px" }}>
            <div style={{
              background:"#1A0808", border:`1px solid #EF444433`,
              borderRadius:"7px", padding:"10px 12px", marginBottom:"10px",
              fontSize:"9.5px", color:"#FCA5A5", lineHeight:1.7,
            }}>
              <strong style={{color:"#EF4444"}}>Print and distribute to community</strong>
              <br/>These rights apply to ALL people in the US regardless of immigration status.
            </div>
            {KYR_RIGHTS.map((kyr, i) => (
              <div key={i} style={{
                background:T.bg, borderRadius:"7px", padding:"10px 12px",
                marginBottom:"6px", border:`1px solid ${T.border}`,
              }}>
                <div style={{ fontSize:"10px", fontWeight:800, color:T.text,
                  marginBottom:"5px", letterSpacing:"0.02em" }}>
                  {i+1}. {kyr.right}
                </div>
                <div style={{ fontSize:"10px", color:T.muted, lineHeight:1.7 }}>
                  {kyr.detail}
                </div>
              </div>
            ))}
            <div style={{ padding:"10px 12px", background:T.bg,
              borderRadius:"7px", border:`1px solid ${T.border}`,
              fontSize:"9px", color:T.dim, lineHeight:1.7, marginTop:"4px" }}>
              🌐 More resources: ilrc.org/red-card · acluct.org · irisct.org
              <br/>Available in Spanish, Portuguese, French Creole, and 12+ languages from IRIS
            </div>
            <button
              onClick={generateKYRCard}
              style={{
                width:"100%", marginTop:"8px", padding:"9px", borderRadius:"6px",
                background:"#1D4ED8", border:"none", color:"#fff",
                fontSize:"10px", fontWeight:700, cursor:"pointer",
                letterSpacing:"0.02em",
              }}>
              🖨 Print KYR Wallet Card (4 languages)
            </button>
          </div>
        )}

        {/* COMMITTED ORGS QUICK LIST */}
        {tab === "orgs" && (
          <div style={{ padding:"10px" }}>
            <div style={{ fontSize:"9px", color:T.dim, marginBottom:"8px" }}>
              Orgs committed to ICE scenario — click to see full details
            </div>
            {ORGS
              .filter(o => o.scenarioCommitments?.ice_raid?.committed)
              .sort((a, b) => {
                const rt = r => {
                  const s = (r.scenarioCommitments?.ice_raid?.responseTime||"").toLowerCase();
                  if (s.includes("immediate")||s.includes("30 min")) return 0;
                  if (s.includes("1-2")||s.includes("1–2")||s.includes("2 hr")) return 1;
                  if (s.includes("4")||s.includes("8")) return 2;
                  return 3;
                };
                return rt(a) - rt(b);
              })
              .map(org => {
                const c = org.scenarioCommitments.ice_raid;
                return (
                  <div key={org.id} style={{
                    background:T.bg, borderRadius:"6px", padding:"7px 10px",
                    marginBottom:"4px", border:`1px solid ${ORG_COLORS[org.type]}33`,
                    display:"flex", alignItems:"center", gap:"8px",
                  }}>
                    <span style={{
                      width:"7px", height:"7px", borderRadius:"50%",
                      background:ORG_COLORS[org.type], flexShrink:0,
                    }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:"10px", fontWeight:600, color:T.text,
                        overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                        {org.shortName}
                      </div>
                      <div style={{ fontSize:"8.5px", color:T.muted }}>
                        {org.county} · {c.responseTime}
                      </div>
                    </div>
                    {org.contact?.hotline && (
                      <span style={{ fontSize:"8px", color:"#EF4444",
                        fontWeight:700, flexShrink:0 }}>
                        {org.contact.hotline}
                      </span>
                    )}
                    {org.contact?.phone && !org.contact?.hotline && (
                      <span style={{ fontSize:"8px", color:T.muted, flexShrink:0 }}>
                        {org.contact.phone}
                      </span>
                    )}
                  </div>
                );
              })
            }
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
