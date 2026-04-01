import { ORGS, EDGES } from "../data/orgs.js";
import { fmtMoney } from "./helpers.js";

export const exportCSV = () => {
  const rows = [
    // Header
    ["ID","Name","Short Name","Type","County","Budget","Website","Trust Score","Data Source",
     "Phone","Hotline","Address",
     "ICE Committed","ICE Role","ICE Response Time",
     "Economic Committed","Natural Disaster Committed","Pandemic Committed",
     "Connections Count","Description"].join(",")
  ];

  ORGS.forEach(org => {
    const esc = (s) => `"${String(s||"").replace(/"/g,'""')}"`;
    const ice = org.scenarioCommitments?.ice_raid;
    const econ = org.scenarioCommitments?.economic_crisis;
    const nat = org.scenarioCommitments?.natural_disaster;
    const pan = org.scenarioCommitments?.pandemic;

    rows.push([
      esc(org.id),
      esc(org.name),
      esc(org.shortName),
      esc(org.type),
      esc(org.county),
      esc(org.budget || ""),
      esc(org.website || ""),
      esc(org.trustScore || ""),
      esc(org.dataSource || ""),
      esc(org.contact?.phone || ""),
      esc(org.contact?.hotline || ""),
      esc(org.contact?.address || ""),
      esc(ice?.committed ? "YES" : "NO"),
      esc(ice?.role || ""),
      esc(ice?.responseTime || ""),
      esc(econ?.committed ? "YES" : "NO"),
      esc(nat?.committed ? "YES" : "NO"),
      esc(pan?.committed ? "YES" : "NO"),
      esc((org.connections || []).length),
      esc(org.description || ""),
    ].join(","));
  });

  const csv = rows.join("\n");
  const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CT-Resilience-Orgs-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportEdgesCSV = () => {
  const rows = [["Source ID","Source Name","Target ID","Target Name"].join(",")];
  EDGES.forEach(e => {
    const src = ORGS.find(o=>o.id===e.source);
    const tgt = ORGS.find(o=>o.id===e.target);
    if (src && tgt) {
      rows.push([`"${e.source}"`,`"${src.name}"`,`"${e.target}"`,`"${tgt.name}"`].join(","));
    }
  });
  const csv = rows.join("\n");
  const blob = new Blob([csv], { type:"text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `CT-Resilience-Connections-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
