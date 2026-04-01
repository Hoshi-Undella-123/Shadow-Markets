import { SCENARIOS, DEMANDS, computeGaps, SCENARIO_GAPS } from "../data/scenarios.js";
import { RES_META } from "../utils/colors.js";
import { fmtMoney } from "../utils/helpers.js";

const RES_KEYS = ["financialAid","legal","shelter","food","mentalHealth","communications"];

/**
 * Opens a print-ready HTML report in a new window.
 * Uses native browser print → PDF flow.
 */
export const generateReport = (scenario, orgs) => {
  if (scenario === "normal") return;
  const s        = SCENARIOS[scenario];
  const gaps     = computeGaps(scenario, orgs);
  const dem      = DEMANDS[scenario];
  const committed   = orgs.filter(o => o.scenarioCommitments?.[scenario]?.committed);
  const uncommitted = orgs.filter(o => !o.scenarioCommitments?.[scenario]?.committed);
  const knownGaps   = SCENARIO_GAPS[scenario] || [];
  const today       = new Date().toLocaleDateString("en-US", { year:"numeric", month:"long", day:"numeric" });

  // Build org rows by response time
  const parseRT = rt => {
    if (!rt) return 99;
    const s = rt.toLowerCase();
    if (s.includes("30 min") || s.includes("1-2 hr") || s.includes("1–2 hr")) return 0;
    if (s.includes("4") || s.includes("8")) return 1;
    if (s.includes("24")) return 2;
    if (s.includes("48") || s.includes("72")) return 3;
    return 4;
  };
  const sorted = [...committed].sort((a,b) =>
    parseRT(a.scenarioCommitments[scenario].responseTime) -
    parseRT(b.scenarioCommitments[scenario].responseTime)
  );

  const coverageHTML = RES_KEYS.map(k => {
    const pct = Math.round(gaps?.coverage?.[k] || 0);
    const col = pct >= 70 ? "#22C55E" : pct >= 40 ? "#F59E0B" : "#EF4444";
    const m = RES_META[k];
    const d = dem[k];
    return `
      <div class="res-row">
        <span class="res-label">${m.icon} ${m.label}</span>
        <div class="res-bar-wrap">
          <div class="res-bar" style="width:${pct}%;background:${col}"></div>
        </div>
        <span class="res-pct" style="color:${col}">${pct}%</span>
        <span class="res-demand">${d.label}</span>
      </div>`;
  }).join("");

  const orgRows = sorted.map(org => {
    const c = org.scenarioCommitments[scenario];
    return `
      <tr>
        <td><strong>${org.name}</strong><br/><small>${org.county} County</small></td>
        <td>${c.role || "—"}</td>
        <td style="color:#F59E0B;font-weight:600">${c.responseTime || "—"}</td>
        <td><small>${c.notes ? c.notes.substring(0,120)+"…" : "—"}</small></td>
      </tr>`;
  }).join("");

  const gapRows = knownGaps.map(g => `<li>${g}</li>`).join("");

  const uncommittedRows = uncommitted.map(o =>
    `<li>${o.name} (${o.county})</li>`
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>CT Resilience Network — ${s.label} Report</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; color:#1a2a3a;
         padding:32px 40px; max-width:900px; margin:0 auto; }
  h1 { font-size:22px; font-weight:800; color:#0D1829; margin-bottom:4px; }
  h2 { font-size:14px; font-weight:700; color:#1D4ED8; margin:20px 0 8px;
       border-bottom:2px solid #DBEAFE; padding-bottom:4px; }
  h3 { font-size:12px; font-weight:700; color:#374151; margin:12px 0 6px; }
  .header { display:flex; justify-content:space-between; align-items:flex-end;
            border-bottom:3px solid #1D4ED8; padding-bottom:12px; margin-bottom:20px; }
  .scenario-badge { background:#EF444422; border:2px solid #EF4444;
    border-radius:8px; padding:6px 14px; font-weight:800; font-size:14px; color:#EF4444; }
  .meta { color:#6B7280; font-size:10px; margin-top:4px; }
  .summary-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; margin-bottom:20px; }
  .summary-box { background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px;
    padding:12px; text-align:center; }
  .summary-box .val { font-size:28px; font-weight:800; color:#1D4ED8; }
  .summary-box .lbl { font-size:9px; color:#6B7280; text-transform:uppercase;
    letter-spacing:.08em; margin-top:3px; }
  .res-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; }
  .res-label { width:120px; font-weight:600; flex-shrink:0; }
  .res-bar-wrap { flex:1; height:8px; background:#E5E7EB; border-radius:4px; overflow:hidden; }
  .res-bar { height:100%; border-radius:4px; }
  .res-pct { width:40px; font-weight:700; text-align:right; flex-shrink:0; }
  .res-demand { width:80px; color:#9CA3AF; font-size:9px; text-align:right; flex-shrink:0; }
  table { width:100%; border-collapse:collapse; font-size:10px; }
  th { background:#F1F5F9; padding:6px 8px; text-align:left; font-weight:700;
    font-size:9px; text-transform:uppercase; letter-spacing:.06em; color:#6B7280; }
  td { padding:6px 8px; border-bottom:1px solid #F1F5F9; vertical-align:top; }
  tr:hover td { background:#FAFAFA; }
  .gap-box { background:#FEF2F2; border:1px solid #FECACA; border-radius:8px;
    padding:12px 16px; margin:8px 0; }
  .gap-box li { margin-bottom:5px; color:#7F1D1D; }
  .uncommit-box { background:#FFFBEB; border:1px solid #FDE68A; border-radius:8px;
    padding:12px 16px; margin:8px 0; }
  .uncommit-box li { margin-bottom:4px; color:#78350F; }
  .footer { margin-top:32px; padding-top:12px; border-top:1px solid #E5E7EB;
    color:#9CA3AF; font-size:9px; display:flex; justify-content:space-between; }
  @media print {
    body { padding:20px; }
    .no-print { display:none; }
    h2 { break-after:avoid; }
  }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>🗺 CT Resilience Network</h1>
    <div class="meta">Connecticut Council for Philanthropy · Generated ${today}</div>
  </div>
  <div class="scenario-badge">${s.icon} ${s.label}</div>
</div>

<div class="summary-grid">
  <div class="summary-box">
    <div class="val" style="color:#22C55E">${gaps?.committedCount || 0}</div>
    <div class="lbl">Organizations Committed</div>
  </div>
  <div class="summary-box">
    <div class="val" style="color:#F59E0B">${uncommitted.length}</div>
    <div class="lbl">Not Yet Committed</div>
  </div>
  <div class="summary-box">
    <div class="val">${orgs.length}</div>
    <div class="lbl">Total Orgs Mapped</div>
  </div>
</div>

<h2>Resource Coverage vs Estimated Demand</h2>
<div>${coverageHTML}</div>

<h2>Coordination Timeline — Who Does What, When</h2>
<table>
  <thead>
    <tr>
      <th>Organization</th>
      <th>Role in Scenario</th>
      <th>Response Time</th>
      <th>Notes</th>
    </tr>
  </thead>
  <tbody>${orgRows}</tbody>
</table>

${knownGaps.length ? `
<h2>Critical Gaps Identified</h2>
<div class="gap-box"><ul>${gapRows}</ul></div>
` : ""}

${uncommitted.length ? `
<h2>Organizations Not Yet Committed (Outreach Needed)</h2>
<div class="uncommit-box"><ul>${uncommittedRows}</ul></div>
` : ""}


${scenario === 'ice_raid' ? `
<h2>🚨 Rapid Response Hotlines</h2>
<div style='display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:16px'>
  <div style='background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:8px 10px;text-align:center'>
    <div style='font-size:15px;font-weight:800;color:#DC2626'>211</div>
    <div style='font-size:8px;color:#7F1D1D'>CT 211 — Resource Navigation (24/7)</div>
  </div>
  <div style='background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:8px 10px;text-align:center'>
    <div style='font-size:15px;font-weight:800;color:#DC2626'>(860) 906-8000</div>
    <div style='font-size:8px;color:#7F1D1D'>CIRA — Statewide Alert Hotline</div>
  </div>
  <div style='background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:8px 10px;text-align:center'>
    <div style='font-size:15px;font-weight:800;color:#DC2626'>(203) 549-5220</div>
    <div style='font-size:8px;color:#7F1D1D'>Make the Road CT — SW CT Rapid Response</div>
  </div>
  <div style='background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:8px 10px;text-align:center'>
    <div style='font-size:15px;font-weight:800;color:#DC2626'>(203) 896-7221</div>
    <div style='font-size:8px;color:#7F1D1D'>NLG CT — Legal Observers / Arrest Hotline</div>
  </div>
  <div style='background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:8px 10px;text-align:center'>
    <div style='font-size:15px;font-weight:800;color:#DC2626'>(800) 798-0671</div>
    <div style='font-size:8px;color:#7F1D1D'>CT Legal Services — Immigration Hotline</div>
  </div>
  <div style='background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:8px 10px;text-align:center'>
    <div style='font-size:15px;font-weight:800;color:#DC2626'>(860) 519-0966</div>
    <div style='font-size:8px;color:#7F1D1D'>Sanctuary CT — Physical Sanctuary Network</div>
  </div>
</div>` : ''}
<h2>Scenario Overview</h2>
<p style="line-height:1.7;color:#374151">${s.description}</p>
<h3>Estimated Resource Demands</h3>
<ul style="padding-left:20px;line-height:2">
  ${RES_KEYS.map(k => `<li><strong>${RES_META[k].label}:</strong> ${dem[k].label} — ${dem[k].note}</li>`).join("")}
</ul>

<div class="footer">
  <span>CT Resilience Network · Connecticut Council for Philanthropy · ctphilanthropy.org</span>
  <span>Data reflects public sources. For private org data contact CCP.</span>
</div>

<div class="no-print" style="margin-top:24px;text-align:center">
  <button onclick="window.print()" style="
    background:#1D4ED8;color:#fff;border:none;padding:10px 24px;
    border-radius:6px;font-size:13px;font-weight:700;cursor:pointer;margin-right:8px;
  ">🖨 Print / Save as PDF</button>
  <button onclick="window.close()" style="
    background:#F1F5F9;color:#374151;border:1px solid #CBD5E1;
    padding:10px 24px;border-radius:6px;font-size:13px;cursor:pointer;
  ">Close</button>
</div>

</body>
</html>`;

  const win = window.open("", "_blank", "width=960,height=800");
  if (!win) {
    // Popup blocked — create downloadable blob instead
    const blob = new Blob([html], { type: "text/html" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `CT-Resilience-${scenario}-Report.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return;
  }
  win.document.write(html);
  win.document.close();
};
