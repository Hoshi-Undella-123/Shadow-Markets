import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { T, ORG_COLORS } from "../utils/colors.js";
import { fmtMoney } from "../utils/helpers.js";

// Funding relationships: [funder_id, grantee_id, estimated_annual_$, notes]
const FUNDING_FLOWS = [
  // CCP members grant to service orgs
  ["hartford_fdn",   "iris",            500000,  "Core operating + emergency grants"],
  ["hartford_fdn",   "ct_legal",        300000,  "Immigration legal services"],
  ["hartford_fdn",   "columbus_house",  400000,  "Shelter operations"],
  ["hartford_fdn",   "foodshare",       600000,  "Food bank operations"],
  ["hartford_fdn",   "mental_health_ct",350000,  "Mental health services"],
  ["hartford_fdn",   "catholic_charities",250000,"Immigration + food programs"],
  ["hartford_fdn",   "chc",             400000,  "FQHC support"],
  ["hartford_fdn",   "aclu_ct",         150000,  "Civil rights"],
  ["hartford_fdn",   "cira",            80000,   "Coalition support"],
  ["hartford_fdn",   "charter_oak",     300000,  "Health center support"],
  ["hartford_fdn",   "greater_hartford_legal", 250000, "Civil legal aid"],
  ["hartford_fdn",   "carc",            120000,  "Refugee trauma therapy"],
  ["fairfield_fdn",  "make_road",       300000,  "Immigrant rights"],
  ["fairfield_fdn",  "int_institute",   200000,  "Resettlement services"],
  ["fairfield_fdn",  "ciri",            150000,  "Legal services"],
  ["fairfield_fdn",  "sw_community_health", 200000, "FQHC support"],
  ["fairfield_fdn",  "b1c",             250000,  "Immigrant integration"],
  ["fairfield_fdn",  "wave_bridgeport", 80000,   "Community org"],
  ["new_haven_fdn",  "iris",            600000,  "Core operating support"],
  ["new_haven_fdn",  "nhla",            200000,  "Legal aid"],
  ["new_haven_fdn",  "columbus_house",  300000,  "Shelter support"],
  ["new_haven_fdn",  "junta",           150000,  "Latino community services"],
  ["new_haven_fdn",  "unidad_latina",   100000,  "Immigrant advocacy"],
  ["new_haven_fdn",  "open_doors",      120000,  "Resettlement"],
  ["new_haven_fdn",  "clifford_beers",  180000,  "Behavioral health"],
  ["new_haven_fdn",  "community_soup_kitchen", 120000, "Food access"],
  ["ccf",            "caritas",         80000,   "Food + emergency aid"],
  ["ccf",            "new_britain_legal",100000, "Legal aid"],
  ["ccp",            "cira",            50000,   "Coalition coordination"],
  ["ccp",            "iris",            100000,  "Emergency rapid response"],
  ["cfect",          "iasc",            60000,   "Legal services"],
  ["cfect",          "neighbor_fund",   40000,   "Bail + legal fund"],
  ["cfect",          "catholic_norwich",80000,   "Basic needs"],
  ["cfect",          "united_services", 120000,  "Behavioral health"],
  ["uw_hartford",    "foodshare",       400000,  "Food bank"],
  ["uw_hartford",    "cceh",            200000,  "Homeless services"],
  ["uw_fairfield",   "ct_food_bank",    350000,  "Food bank"],
  ["uw_fairfield",   "make_road",       100000,  "Basic needs"],
  ["uw_new_haven",   "columbus_house",  150000,  "Shelter"],
  ["uw_new_haven",   "loaves_fishes",   80000,   "Meals program"],
  ["nccf",           "susan_anthony_project", 60000, "DV services"],
];

const FUNDER_IDS = new Set([
  "hartford_fdn","fairfield_fdn","new_haven_fdn","ccf","ccp",
  "cfect","uw_hartford","uw_fairfield","uw_new_haven","nccf"
]);

export default function FundingFlows({ orgs, onSelectOrg }) {
  const svgRef = useRef(null);
  const [hoveredFlow, setHoveredFlow] = useState(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const W = svgRef.current.clientWidth  || 900;
    const H = svgRef.current.clientHeight || 580;
    svg.selectAll("*").remove();

    // Background
    svg.append("rect").attr("width", W).attr("height", H).attr("fill", T.bg);

    const funders  = orgs.filter(o => FUNDER_IDS.has(o.id));
    const grantees = [...new Set(FUNDING_FLOWS.map(f => f[1]))]
      .map(id => orgs.find(o => o.id === id)).filter(Boolean);

    const PAD = 80;
    // Funders on left, grantees on right
    const fY  = (i) => PAD + i * ((H - PAD*2) / Math.max(funders.length - 1, 1));
    const gY  = (i) => PAD + i * ((H - PAD*2) / Math.max(grantees.length - 1, 1));
    const LX  = 160;
    const RX  = W - 160;

    // Draw flows
    const maxFlow = Math.max(...FUNDING_FLOWS.map(f => f[2]));
    FUNDING_FLOWS.forEach(([funderId, granteeId, amount, note]) => {
      const fi = funders.findIndex(f => f.id === funderId);
      const gi = grantees.findIndex(g => g.id === granteeId);
      if (fi < 0 || gi < 0) return;

      const x0 = LX + 60, y0 = fY(fi);
      const x1 = RX - 60, y1 = gY(gi);
      const sw = Math.max(1, (amount / maxFlow) * 12);
      // Color by grantee type so the receiving org sector is visible
      const col = ORG_COLORS[grantees[gi]?.type] || ORG_COLORS[funders[fi]?.type] || T.muted;

      svg.append("path")
        .attr("d", `M${x0},${y0} C${(x0+x1)/2},${y0} ${(x0+x1)/2},${y1} ${x1},${y1}`)
        .attr("fill", "none")
        .attr("stroke", col)
        .attr("stroke-width", sw)
        .attr("opacity", 0.4)
        .attr("cursor", "pointer")
        .on("mouseover", function() {
          d3.select(this).attr("opacity", 0.9).attr("stroke-width", sw + 3);
          setHoveredFlow({ funder: funderId, grantee: granteeId, amount, note });
        })
        .on("mouseout", function() {
          d3.select(this).attr("opacity", 0.4).attr("stroke-width", sw);
          setHoveredFlow(null);
        });
    });

    // Funder nodes (left)
    funders.forEach((org, i) => {
      const x = LX, y = fY(i);
      const col = ORG_COLORS[org.type] || T.muted;
      const totalGrants = FUNDING_FLOWS.filter(f => f[0] === org.id).reduce((s,f) => s+f[2], 0);

      const g = svg.append("g").attr("cursor","pointer")
        .on("click", () => onSelectOrg(org.id));

      g.append("circle").attr("cx", x).attr("cy", y)
        .attr("r", 22).attr("fill", col+"22").attr("stroke", col).attr("stroke-width", 2);
      g.append("text").attr("x", x).attr("y", y - 2)
        .attr("text-anchor","middle").attr("fill", col)
        .attr("font-size","8px").attr("font-weight","700").attr("font-family","system-ui")
        .text(org.shortName.split(" ").slice(0,2).join(" "));
      g.append("text").attr("x", x).attr("y", y + 8)
        .attr("text-anchor","middle").attr("fill", col)
        .attr("font-size","7px").attr("font-family","system-ui")
        .text(fmtMoney(totalGrants)+"/yr");

      // Budget ring
      const r = 22 + Math.log((org.budget||1)/100000) * 2;
      g.append("circle").attr("cx", x).attr("cy", y)
        .attr("r", r).attr("fill", "none").attr("stroke", col).attr("stroke-width", 0.5).attr("opacity", 0.3);
    });

    // Grantee nodes (right)
    grantees.forEach((org, i) => {
      const x = RX, y = gY(i);
      const col = ORG_COLORS[org.type] || T.muted;
      const totalReceived = FUNDING_FLOWS.filter(f => f[1] === org.id).reduce((s,f) => s+f[2], 0);

      const g = svg.append("g").attr("cursor","pointer")
        .on("click", () => onSelectOrg(org.id));

      g.append("circle").attr("cx", x).attr("cy", y)
        .attr("r", 18).attr("fill", col+"22").attr("stroke", col).attr("stroke-width", 1.5);
      g.append("text").attr("x", x).attr("y", y - 1)
        .attr("text-anchor","middle").attr("fill", col)
        .attr("font-size","7.5px").attr("font-weight","600").attr("font-family","system-ui")
        .text(org.shortName.split(" ").slice(0,2).join(" "));
      g.append("text").attr("x", x).attr("y", y + 9)
        .attr("text-anchor","middle").attr("fill", T.dim)
        .attr("font-size","6.5px").attr("font-family","system-ui")
        .text(fmtMoney(totalReceived));
    });

    // Column headers
    svg.append("text").attr("x", LX).attr("y", 24)
      .attr("text-anchor","middle").attr("fill", T.muted)
      .attr("font-size","11px").attr("font-weight","800").attr("font-family","system-ui")
      .attr("letter-spacing","0.06em")
      .text("FUNDERS");
    svg.append("text").attr("x", RX).attr("y", 24)
      .attr("text-anchor","middle").attr("fill", T.muted)
      .attr("font-size","11px").attr("font-weight","800").attr("font-family","system-ui")
      .attr("letter-spacing","0.06em")
      .text("SERVICE ORGS");

    // Total flow annotation
    const totalFlow = FUNDING_FLOWS.reduce((s,f) => s+f[2], 0);
    svg.append("text").attr("x", W/2).attr("y", H - 12)
      .attr("text-anchor","middle").attr("fill", T.dim)
      .attr("font-size","9px").attr("font-family","system-ui")
      .text(`${FUNDING_FLOWS.length} tracked funding relationships · ~${fmtMoney(totalFlow)}/yr mapped`);

  }, [orgs]);

  return (
    <div style={{ width:"100%", height:"100%", position:"relative" }}>
      <svg ref={svgRef} style={{ width:"100%", height:"100%", display:"block" }}/>
      {hoveredFlow && (
        <div style={{
          position:"absolute", top:"12px", right:"12px",
          background:"rgba(13,24,41,0.94)", backdropFilter:"blur(8px)",
          border:`1px solid ${T.border}`, borderRadius:"8px",
          padding:"10px 14px", fontSize:"10px", color:T.text,
          maxWidth:"240px", pointerEvents:"none",
        }}>
          <div style={{ fontWeight:700, marginBottom:"4px" }}>
            {orgs.find(o=>o.id===hoveredFlow.funder)?.shortName}
            <span style={{ color:T.muted, fontWeight:400 }}> → </span>
            {orgs.find(o=>o.id===hoveredFlow.grantee)?.shortName}
          </div>
          <div style={{ color:"#22C55E", fontWeight:700, fontSize:"12px" }}>
            {fmtMoney(hoveredFlow.amount)}/yr
          </div>
          <div style={{ color:T.muted, marginTop:"4px", fontSize:"9px" }}>{hoveredFlow.note}</div>
        </div>
      )}
    </div>
  );
}
