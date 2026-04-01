import { SCENARIOS } from "../data/scenarios.js";
import { ORGS } from "../data/orgs.js";

const parseRT = rt => {
  if (!rt) return 5;
  const s = rt.toLowerCase();
  if (s.includes("immediate") || s.includes("30 min")) return 0;
  if (s.includes("1-2 hr") || s.includes("1–2 hr") || s.includes("2 hr")) return 1;
  if (s.includes("4") || s.includes("8")) return 2;
  if (s.includes("24")) return 3;
  if (s.includes("48") || s.includes("72")) return 4;
  return 5;
};

export const generatePlaybook = (scenario) => {
  if (scenario === "normal") return;
  const s = SCENARIOS[scenario];

  const committed = ORGS
    .filter(o => o.scenarioCommitments?.[scenario]?.committed)
    .map(o => ({ ...o, c: o.scenarioCommitments[scenario], tier: parseRT(o.scenarioCommitments[scenario]?.responseTime) }))
    .sort((a, b) => a.tier - b.tier);

  const uncommitted = ORGS.filter(o => !o.scenarioCommitments?.[scenario]?.committed);
  const today = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });

  const tierGroups = [
    { label:"IMMEDIATE (0–2 hrs)",  color:"#DC2626", bg:"#FEF2F2", border:"#FECACA", orgs: committed.filter(o => o.tier <= 1) },
    { label:"SAME DAY (2–8 hrs)",   color:"#D97706", bg:"#FFFBEB", border:"#FDE68A", orgs: committed.filter(o => o.tier === 2) },
    { label:"WITHIN 24 HRS",        color:"#2563EB", bg:"#EFF6FF", border:"#BFDBFE", orgs: committed.filter(o => o.tier === 3) },
    { label:"2–3 DAYS",             color:"#7C3AED", bg:"#F5F3FF", border:"#DDD6FE", orgs: committed.filter(o => o.tier === 4) },
    { label:"WEEK+",                color:"#4B5563", bg:"#F9FAFB", border:"#E5E7EB", orgs: committed.filter(o => o.tier >= 5) },
  ].filter(g => g.orgs.length > 0);

  // Hotlines section
  const hotlineOrgs = ORGS.filter(o => o.contact?.hotline && o.scenarioCommitments?.[scenario]?.committed);

  const tierHTML = tierGroups.map(group => `
    <div style="margin-bottom:20px">
      <div style="background:${group.bg};border:2px solid ${group.border};border-radius:6px;padding:8px 14px;margin-bottom:10px">
        <span style="font-size:12px;font-weight:800;color:${group.color};letter-spacing:0.06em">${group.label}</span>
        <span style="font-size:11px;color:#6B7280;margin-left:8px">${group.orgs.length} organization${group.orgs.length!==1?"s":""}</span>
      </div>
      ${group.orgs.map(org => `
        <div style="border:1px solid #E5E7EB;border-radius:6px;padding:10px 14px;margin-bottom:8px;background:#fff">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
            <div>
              <span style="font-size:12px;font-weight:700;color:#111827">${org.name}</span>
              <span style="font-size:10px;color:#6B7280;margin-left:8px">${org.county} County</span>
            </div>
            <span style="font-size:10px;font-weight:700;color:${group.color};background:${group.bg};border:1px solid ${group.border};border-radius:4px;padding:1px 7px;white-space:nowrap">${org.c.responseTime || "TBD"}</span>
          </div>
          <div style="font-size:11px;color:#374151;margin-bottom:4px"><strong>Role:</strong> ${org.c.role || "—"}</div>
          ${org.c.notes ? `<div style="font-size:10px;color:#6B7280;line-height:1.6;border-left:3px solid ${group.border};padding-left:8px;margin-top:6px">${org.c.notes}</div>` : ""}
          ${org.contact ? `
            <div style="margin-top:8px;font-size:10px;display:flex;gap:16px;flex-wrap:wrap">
              ${org.contact.hotline ? `<span style="color:#DC2626;font-weight:700">🚨 ${org.contact.hotline}</span>` : ""}
              ${org.contact.phone ? `<span style="color:#374151">📞 ${org.contact.phone}</span>` : ""}
              ${org.contact.address ? `<span style="color:#6B7280">📍 ${org.contact.address}</span>` : ""}
              ${org.website ? `<span style="color:#2563EB">🌐 ${org.website}</span>` : ""}
            </div>
          ` : ""}
        </div>
      `).join("")}
    </div>
  `).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>${s.label} — CT Incident Playbook ${today}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; color:#1a2a3a; padding:32px 40px; max-width:920px; margin:0 auto; }
  h1 { font-size:22px; font-weight:800; color:#0D1829; }
  h2 { font-size:13px; font-weight:700; color:#1D4ED8; margin:24px 0 10px; border-bottom:2px solid #DBEAFE; padding-bottom:5px; }
  .header { border-bottom:3px solid #1D4ED8; padding-bottom:16px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:flex-end; }
  .scenario-badge { background:#EF444422; border:2px solid #EF4444; border-radius:8px; padding:8px 16px; font-weight:800; font-size:14px; color:#EF4444; }
  .meta { color:#6B7280; font-size:10px; margin-top:4px; }
  .summary-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; margin-bottom:24px; }
  .summary-box { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; text-align:center; }
  .summary-box .val { font-size:24px; font-weight:800; color:#1D4ED8; }
  .summary-box .lbl { font-size:9px; color:#6B7280; text-transform:uppercase; letter-spacing:.08em; margin-top:3px; }
  .hotline-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; margin-bottom:8px; }
  .hotline-box { background:#FEF2F2; border:1px solid #FECACA; border-radius:6px; padding:8px 10px; text-align:center; }
  .hotline-box .num { font-size:14px; font-weight:800; color:#DC2626; }
  .hotline-box .name { font-size:8px; color:#7F1D1D; margin-top:2px; }
  .outreach-box { background:#FFFBEB; border:1px solid #FDE68A; border-radius:6px; padding:10px 14px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; }
  .footer { margin-top:40px; padding-top:14px; border-top:1px solid #E5E7EB; color:#9CA3AF; font-size:9px; display:flex; justify-content:space-between; }
  @media print { body { padding:20px; } .no-print { display:none; } h2 { break-after:avoid; } }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>🗺 CT Resilience Network — Incident Playbook</h1>
    <div class="meta">Connecticut Council for Philanthropy · Generated ${today}</div>
    <div class="meta" style="color:#DC2626;font-weight:600;margin-top:4px">FOR IMMEDIATE DISTRIBUTION TO ALL COMMITTED ORGANIZATIONS</div>
  </div>
  <div class="scenario-badge">${s.icon} ${s.label}</div>
</div>

<div class="summary-grid">
  <div class="summary-box"><div class="val" style="color:#22C55E">${committed.length}</div><div class="lbl">Orgs Activated</div></div>
  <div class="summary-box"><div class="val" style="color:#EF4444">${tierGroups[0]?.orgs.length || 0}</div><div class="lbl">Immediate Response</div></div>
  <div class="summary-box"><div class="val" style="color:#F59E0B">${uncommitted.length}</div><div class="lbl">Outreach Needed</div></div>
  <div class="summary-box"><div class="val">${ORGS.length}</div><div class="lbl">Total Orgs Mapped</div></div>
</div>

${scenario === "ice_raid" ? `
<h2>🚨 Rapid Response Hotlines — SHARE IMMEDIATELY</h2>
<div class="hotline-grid">
  <div class="hotline-box"><div class="num">211</div><div class="name">CT 211 — Resource Navigation (24/7, all languages)</div></div>
  <div class="hotline-box"><div class="num">(860) 906-8000</div><div class="name">CIRA — Statewide Alert Network</div></div>
  <div class="hotline-box"><div class="num">(203) 549-5220</div><div class="name">Make the Road CT — SW CT Rapid Response</div></div>
  <div class="hotline-box"><div class="num">(203) 896-7221</div><div class="name">NLG CT — Legal Observers / Arrest Hotline</div></div>
  <div class="hotline-box"><div class="num">(800) 798-0671</div><div class="name">CT Legal Services — Immigration Hotline</div></div>
  <div class="hotline-box"><div class="num">(860) 519-0966</div><div class="name">Sanctuary CT — Physical Sanctuary Network</div></div>
</div>
` : ""}

<h2>Activation Timeline — Who Does What, When</h2>
${tierHTML}

${uncommitted.length > 0 ? `
<h2>⚠ Outreach Needed — Not Yet Committed</h2>
${uncommitted.map(org => `
  <div class="outreach-box">
    <div>
      <span style="font-size:11px;font-weight:600;color:#374151">${org.name}</span>
      <span style="font-size:10px;color:#6B7280;margin-left:8px">${org.county} County · ${org.type}</span>
    </div>
    ${org.contact?.phone ? `<span style="font-size:11px;font-weight:600;color:#D97706">${org.contact.phone}</span>` : ""}
  </div>
`).join("")}
` : ""}

<h2>Scenario Context</h2>
<p style="line-height:1.7;color:#374151;margin-bottom:8px">${s.description}</p>
${scenario === "ice_raid" ? `
<p style="line-height:1.7;color:#374151">
  <strong>CT Context (2025):</strong> ICE actively operating in CT. AG Tong challenging unlawful actions. 
  CT TRUST Act limits local cooperation. 5 sanctuary cities: Hartford, New Haven, Bridgeport, Stamford, Middletown.
  ~120,000–140,000 undocumented residents. 60,000 US citizens live with undocumented family member. 
  Legislature in special session on civil rights lawsuit bill.
</p>
` : ""}

<div class="footer">
  <span>CT Resilience Network · Connecticut Council for Philanthropy · ctphilanthropy.org</span>
  <span>Data from public sources. Last updated: ${today}</span>
</div>

<div class="no-print" style="margin-top:24px;text-align:center">
  <button onclick="window.print()" style="background:#1D4ED8;color:#fff;border:none;padding:10px 24px;border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;margin-right:8px">🖨 Print / Save PDF</button>
  <button onclick="window.close()" style="background:#F1F5F9;color:#374151;border:1px solid #CBD5E1;padding:10px 24px;border-radius:6px;font-size:13px;cursor:pointer">Close</button>
</div>

</body>
</html>`;

  const win = window.open("", "_blank", "width=980,height=860");
  if (!win) {
    const blob = new Blob([html], { type:"text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `CT-Playbook-${scenario}-${new Date().toISOString().split("T")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }
  win.document.write(html);
  win.document.close();
};
