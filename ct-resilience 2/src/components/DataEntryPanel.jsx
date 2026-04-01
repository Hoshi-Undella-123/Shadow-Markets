import { useState } from "react";
import { T, ORG_COLORS } from "../utils/colors.js";
import { sH } from "../utils/helpers.js";
import { ORGS } from "../data/orgs.js";
import { SCENARIOS } from "../data/scenarios.js";

const INPUT_STYLE = {
  background:T.bg, border:`1px solid ${T.border}`, borderRadius:"5px",
  color:T.text, padding:"7px 10px", fontSize:"11px", width:"100%",
  boxSizing:"border-box", outline:"none", fontFamily:"system-ui",
};

const LABEL_STYLE = {
  fontSize:"9px", fontWeight:700, color:T.muted,
  letterSpacing:"0.08em", textTransform:"uppercase",
  marginBottom:"4px", display:"block",
};

export default function DataEntryPanel({ onClose }) {
  const [step, setStep] = useState(0); // 0=org select, 1=baseline, 2=scenario, 3=contact, 4=done
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [form, setForm] = useState({
    // baseline
    budgetConfirm: "",
    staffFTE: "",
    volunteerCount: "",
    // resources
    legalCapacity: "",
    shelterBeds: "",
    foodCapacity: "",
    mentalHealthSlots: "",
    emergencyFund: "",
    // scenario
    selectedScenario: "ice_raid",
    wouldCommit: "",
    responseTime: "",
    primaryRole: "",
    surgeCapacity: "",
    constraints: "",
    partnersWith: "",
    // contact
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    lastUpdated: new Date().toISOString().split("T")[0],
    dataPublic: true,
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selectedOrg = ORGS.find(o => o.id === selectedOrgId);

  const STEPS = [
    "Select Organization",
    "Baseline Resources",
    "Scenario Commitment",
    "Contact & Trust",
    "Submitted",
  ];

  const handleSubmit = () => {
    // In production this would POST to a backend
    // For now, log and advance to thank-you step
    console.log("Org submission:", { orgId: selectedOrgId, ...form });
    setStep(4);
  };

  return (
    <div style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.7)",
      backdropFilter:"blur(4px)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center",
    }}
      onClick={onClose}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:T.panel, border:`1px solid ${T.border}`,
          borderRadius:"12px", width:"520px", maxHeight:"85vh",
          overflow:"hidden", display:"flex", flexDirection:"column",
          fontFamily:"system-ui, sans-serif",
        }}>

        {/* Header */}
        <div style={{
          padding:"16px 20px", borderBottom:`1px solid ${T.border}`,
          display:"flex", justifyContent:"space-between", alignItems:"center"
        }}>
          <div>
            <div style={{ fontSize:"14px", fontWeight:700, color:T.text }}>
              Submit Organization Data
            </div>
            <div style={{ fontSize:"10px", color:T.muted, marginTop:"2px" }}>
              Private — reviewed by CT Council for Philanthropy before publishing
            </div>
          </div>
          <button onClick={onClose} style={{
            background:"none", border:`1px solid ${T.border}`,
            color:T.muted, cursor:"pointer", borderRadius:"5px",
            width:"28px", height:"28px", fontSize:"14px",
          }}>✕</button>
        </div>

        {/* Step indicator */}
        <div style={{
          display:"flex", gap:"4px", padding:"12px 20px",
          borderBottom:`1px solid ${T.border}`, background:T.bg
        }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ flex:1, textAlign:"center" }}>
              <div style={{
                height:"3px", borderRadius:"2px", marginBottom:"5px",
                background: i <= step ? T.accent : T.border,
                transition:"background 0.3s",
              }}/>
              <div style={{
                fontSize:"8px", color: i === step ? T.accent : T.muted,
                fontWeight: i === step ? 700 : 400, letterSpacing:"0.04em"
              }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Form body */}
        <div style={{ padding:"20px", overflowY:"auto", flex:1 }}>

          {/* Step 0: Select org */}
          {step === 0 && (
            <div>
              <div style={{ fontSize:"11px", color:T.muted, marginBottom:"16px", lineHeight:1.6 }}>
                Select your organization from the list below, or enter a new one.
                Your submission will be reviewed by CCP staff before appearing on the public map.
              </div>
              <label style={LABEL_STYLE}>Your Organization</label>
              <select value={selectedOrgId} onChange={e => setSelectedOrgId(e.target.value)}
                style={{ ...INPUT_STYLE, marginBottom:"16px" }}>
                <option value="">— Select an organization —</option>
                {ORGS.map(o => (
                  <option key={o.id} value={o.id}>{o.name} ({o.county})</option>
                ))}
                <option value="__new__">➕ My organization isn't listed</option>
              </select>

              {selectedOrg && (
                <div style={{
                  background:T.bg, border:`1px solid ${ORG_COLORS[selectedOrg.type]}44`,
                  borderRadius:"8px", padding:"12px", fontSize:"10px", lineHeight:1.7
                }}>
                  <div style={{ color:ORG_COLORS[selectedOrg.type], fontWeight:700, marginBottom:"4px" }}>
                    {selectedOrg.name}
                  </div>
                  <div style={{ color:T.muted }}>{selectedOrg.description}</div>
                  <div style={{ marginTop:"6px", fontSize:"9px", color:T.dim }}>
                    Current trust score: <span style={{ color:T.amber }}>{selectedOrg.trustScore}/100</span> (based on: {selectedOrg.dataSource})
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Baseline resources */}
          {step === 1 && (
            <div>
              <div style={{ ...sH, marginBottom:"14px" }}>BASELINE CAPACITY</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px", marginBottom:"16px" }}>
                {[
                  ["Annual Budget ($)", "budgetConfirm", "e.g. 5000000"],
                  ["Full-Time Staff (FTE)", "staffFTE", "e.g. 42"],
                  ["Regular Volunteers", "volunteerCount", "e.g. 150"],
                  ["Emergency Fund Available ($)", "emergencyFund", "e.g. 250000"],
                ].map(([label, key, placeholder]) => (
                  <div key={key}>
                    <label style={LABEL_STYLE}>{label}</label>
                    <input type="text" placeholder={placeholder}
                      value={form[key]} onChange={e => set(key, e.target.value)}
                      style={INPUT_STYLE}/>
                  </div>
                ))}
              </div>

              <div style={{ ...sH }}>RESOURCE CAPACITY (current %)</div>
              <div style={{ fontSize:"9px", color:T.dim, marginBottom:"12px" }}>
                Estimate your organization's current capacity in each area (0–100%).
                Leave blank if not applicable.
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
                {[
                  ["Legal Aid Capacity %", "legalCapacity"],
                  ["Shelter Beds (count)", "shelterBeds"],
                  ["Food Distribution Capacity %", "foodCapacity"],
                  ["Mental Health Slots/month", "mentalHealthSlots"],
                ].map(([label, key]) => (
                  <div key={key}>
                    <label style={LABEL_STYLE}>{label}</label>
                    <input type="text" value={form[key]}
                      onChange={e => set(key, e.target.value)} style={INPUT_STYLE}/>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Scenario commitment */}
          {step === 2 && (
            <div>
              <div style={{ ...sH, marginBottom:"14px" }}>SCENARIO COMMITMENT</div>
              <label style={LABEL_STYLE}>Which scenario are you confirming for?</label>
              <select value={form.selectedScenario}
                onChange={e => set("selectedScenario", e.target.value)}
                style={{ ...INPUT_STYLE, marginBottom:"14px" }}>
                {Object.values(SCENARIOS).filter(s => s.id !== "normal").map(s => (
                  <option key={s.id} value={s.id}>{s.icon} {s.label}</option>
                ))}
              </select>

              <label style={LABEL_STYLE}>Would your org activate for this scenario?</label>
              <div style={{ display:"flex", gap:"8px", marginBottom:"14px" }}>
                {["Yes — fully committed","Yes — partial/likely","Uncertain","No — not our role"].map(opt => (
                  <button key={opt} onClick={() => set("wouldCommit", opt)} style={{
                    flex:1, padding:"7px 4px", borderRadius:"5px", fontSize:"9px",
                    textAlign:"center", cursor:"pointer",
                    background: form.wouldCommit === opt ? T.green+"33" : T.bg,
                    border: `1px solid ${form.wouldCommit===opt ? T.green : T.border}`,
                    color: form.wouldCommit===opt ? T.green : T.muted,
                    fontWeight: form.wouldCommit===opt ? 700 : 400,
                  }}>{opt}</button>
                ))}
              </div>

              {[
                ["Your Primary Role in this scenario", "primaryRole", "e.g. Lead legal intake hub for New Haven County", true],
                ["Response Time", "responseTime", "e.g. 2–4 hours, 24 hours, 1 week", false],
                ["Surge Capacity (% above baseline)", "surgeCapacity", "e.g. 30% surge on legal, 50% on food distribution", false],
                ["Key Constraints", "constraints", "e.g. Need 72-hr notice, limited Spanish-speaking staff, at 90% capacity", true],
                ["Organizations you'd partner with", "partnersWith", "e.g. IRIS, CT Legal Services, Foodshare", true],
              ].map(([label, key, placeholder, multiline]) => (
                <div key={key} style={{ marginBottom:"12px" }}>
                  <label style={LABEL_STYLE}>{label}</label>
                  {multiline ? (
                    <textarea value={form[key]} onChange={e => set(key, e.target.value)}
                      placeholder={placeholder} rows={2}
                      style={{ ...INPUT_STYLE, resize:"vertical" }}/>
                  ) : (
                    <input type="text" value={form[key]} placeholder={placeholder}
                      onChange={e => set(key, e.target.value)} style={INPUT_STYLE}/>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <div>
              <div style={{ ...sH, marginBottom:"14px" }}>CONTACT & DATA QUALITY</div>
              <div style={{ fontSize:"10px", color:T.muted, marginBottom:"14px", lineHeight:1.6 }}>
                Contact info is kept private and used only for CCP verification.
                It will never appear publicly on the map.
              </div>
              {[
                ["Your Name & Title", "contactName", "e.g. Jane Smith, Executive Director"],
                ["Email", "contactEmail", "secure@yourorg.org"],
                ["Phone (optional)", "contactPhone", ""],
              ].map(([label, key, ph]) => (
                <div key={key} style={{ marginBottom:"12px" }}>
                  <label style={LABEL_STYLE}>{label}</label>
                  <input type="text" value={form[key]} placeholder={ph}
                    onChange={e => set(key, e.target.value)} style={INPUT_STYLE}/>
                </div>
              ))}

              <div style={{ marginTop:"16px" }}>
                <label style={LABEL_STYLE}>Data visibility</label>
                <div style={{ display:"flex", gap:"8px" }}>
                  {[["Public — show on map", true],["CCP only — private verification", false]].map(([label, val]) => (
                    <button key={String(val)} onClick={() => set("dataPublic", val)} style={{
                      flex:1, padding:"8px", borderRadius:"5px", fontSize:"10px",
                      cursor:"pointer",
                      background: form.dataPublic===val ? T.blue+"33" : T.bg,
                      border:`1px solid ${form.dataPublic===val ? T.blue : T.border}`,
                      color: form.dataPublic===val ? T.blue : T.muted,
                      fontWeight: form.dataPublic===val ? 700 : 400,
                    }}>{label}</button>
                  ))}
                </div>
              </div>

              <div style={{
                marginTop:"16px", background:T.bg, borderRadius:"7px",
                padding:"12px", border:`1px solid ${T.border}`,
                fontSize:"9px", color:T.dim, lineHeight:1.7
              }}>
                <strong style={{ color:T.muted }}>How trust scores work</strong><br/>
                Submissions reviewed by CCP staff → verified = score boost.
                Self-reported data that matches public records = higher score.
                Data confirmed by 2+ independent sources = highest trust.
                Stale data (12+ months) = score penalty until refreshed.
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <div style={{ textAlign:"center", padding:"24px 0" }}>
              <div style={{ fontSize:"48px", marginBottom:"16px" }}>✅</div>
              <div style={{ fontSize:"15px", fontWeight:700, color:T.text, marginBottom:"8px" }}>
                Submission received
              </div>
              <div style={{ fontSize:"11px", color:T.muted, lineHeight:1.7, maxWidth:"360px", margin:"0 auto 20px" }}>
                Thank you. CCP staff will review your submission and update the map
                within 2–3 business days. You'll receive a confirmation at {form.contactEmail || "your email"}.
              </div>
              <button onClick={onClose} style={{
                background:T.accent, border:"none", color:"#fff",
                padding:"10px 24px", borderRadius:"6px", fontSize:"12px",
                fontWeight:700, cursor:"pointer",
              }}>Close</button>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {step < 4 && (
          <div style={{
            padding:"12px 20px", borderTop:`1px solid ${T.border}`,
            display:"flex", justifyContent:"space-between", alignItems:"center",
          }}>
            <button
              onClick={() => setStep(s => Math.max(0, s-1))}
              disabled={step === 0}
              style={{
                background:"none", border:`1px solid ${T.border}`,
                color: step===0 ? T.dim : T.muted, cursor: step===0 ? "default" : "pointer",
                padding:"7px 16px", borderRadius:"5px", fontSize:"11px",
              }}>← Back</button>

            <div style={{ fontSize:"9px", color:T.dim }}>
              Step {step+1} of {STEPS.length-1}
            </div>

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s+1)}
                disabled={step===0 && !selectedOrgId}
                style={{
                  background: (step===0 && !selectedOrgId) ? T.dim : T.accent,
                  border:"none", color:"#fff", cursor: (step===0 && !selectedOrgId) ? "default":"pointer",
                  padding:"7px 16px", borderRadius:"5px", fontSize:"11px", fontWeight:600,
                }}>Next →</button>
            ) : (
              <button onClick={handleSubmit} style={{
                background:T.green, border:"none", color:"#fff",
                padding:"7px 16px", borderRadius:"5px", fontSize:"11px",
                fontWeight:700, cursor:"pointer",
              }}>✓ Submit</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
