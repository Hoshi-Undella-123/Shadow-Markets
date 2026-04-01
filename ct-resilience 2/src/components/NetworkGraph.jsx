import { useState, useEffect, useRef, useMemo } from "react";
import * as d3 from "d3";
import { T, ORG_COLORS } from "../utils/colors.js";
import { nodeRadius, nodeColor } from "../utils/helpers.js";

export default function NetworkGraph({ orgs, edges, selectedOrg, onSelectOrg, scenario, filters }) {
  const svgRef = useRef(null);
  const simRef = useRef(null);
  const gRef   = useRef(null);
  const [dims, setDims] = useState({ w: 900, h: 600 });

  // Track container size so graph redraws when right panel opens/closes
  useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) setDims({ w: width, h: height });
      }
    });
    ro.observe(svgRef.current.parentElement || svgRef.current);
    return () => ro.disconnect();
  }, []);

  const visible = useMemo(() => orgs.filter(o => {
    if (filters.types?.length && !filters.types.includes(o.type)) return false;
    if (filters.county && o.county !== filters.county) return false;
    if (o.trustScore < (filters.minTrust || 0)) return false;
    return true;
  }), [orgs, filters]);

  const visIds   = useMemo(() => new Set(visible.map(o => o.id)), [visible]);
  const visEdges = useMemo(() =>
    edges.filter(e => visIds.has(e.source) && visIds.has(e.target)),
    [edges, visIds]
  );

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const w = dims.w;
    const h = dims.h;
    svg.selectAll("*").remove();

    const nodes = visible.map(o => ({ ...o }));
    const links = visEdges.map(e => ({ ...e }));

    // Zoom
    const g = svg.append("g");
    gRef.current = g;
    svg.call(
      d3.zoom().scaleExtent([0.15, 5])
        .on("zoom", ev => g.attr("transform", ev.transform))
    );

    // Grid background
    const defs = svg.append("defs");
    const pat = defs.append("pattern")
      .attr("id","netgrid").attr("width",40).attr("height",40)
      .attr("patternUnits","userSpaceOnUse");
    pat.append("path").attr("d","M 40 0 L 0 0 0 40")
      .attr("fill","none").attr("stroke","#1E3050").attr("stroke-width","0.5");
    svg.insert("rect","g").attr("width","100%").attr("height","100%")
      .attr("fill","url(#netgrid)");

    // Simulation — tuned for 73 nodes with good spread
    const sim = d3.forceSimulation(nodes)
      .force("link",    d3.forceLink(links).id(d => d.id).distance(d => {
        // Longer edges for cross-county connections
        return 130;
      }).strength(0.3))
      .force("charge",  d3.forceManyBody().strength(-500).distanceMax(600))
      .force("center",  d3.forceCenter(w / 2, h / 2).strength(0.05))
      .force("collide", d3.forceCollide(d => nodeRadius(d) + 18).strength(0.8).iterations(3))
      .force("x",       d3.forceX(w / 2).strength(0.04))
      .force("y",       d3.forceY(h / 2).strength(0.04))
      .alphaDecay(0.02)
      .velocityDecay(0.4);
    simRef.current = sim;

    // Edges
    const link = g.append("g").selectAll("line").data(links).join("line")
      .attr("stroke", "#1E3050").attr("stroke-width", 1.5).attr("opacity", 0.7);

    // Node groups
    const node = g.append("g").selectAll("g").data(nodes).join("g")
      .attr("cursor", "pointer")
      .on("click", (ev, d) => {
        ev.stopPropagation();
        onSelectOrg(d.id === selectedOrg ? null : d.id);
      })
      .call(
        d3.drag()
          .on("start", (ev, d) => { if (!ev.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
          .on("drag",  (ev, d) => { d.fx = ev.x; d.fy = ev.y; })
          .on("end",   (ev, d) => { if (!ev.active) sim.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    // Selection ring
    node.append("circle").attr("class","ring")
      .attr("r", d => nodeRadius(d) + 5)
      .attr("fill","none").attr("stroke","#FFFFFF").attr("stroke-width", 2)
      .attr("opacity", d => d.id === selectedOrg ? 0.6 : 0);

    // Main circle
    node.append("circle").attr("class","main")
      .attr("r", d => nodeRadius(d))
      .attr("fill", d => nodeColor(d, scenario))
      .attr("stroke", d => d.id === selectedOrg ? "#FFFFFF" : "rgba(255,255,255,0.12)")
      .attr("stroke-width", d => d.id === selectedOrg ? 2.5 : 1);

    // Committed pulse ring (non-normal scenarios)
    if (scenario !== "normal") {
      node.filter(d => d.scenarioCommitments?.[scenario]?.committed)
        .append("circle")
        .attr("r", d => nodeRadius(d) + 2)
        .attr("fill","none").attr("stroke", T.green)
        .attr("stroke-width", 1).attr("opacity", 0.4);
    }

    // Labels — positioned below node, scale with radius
    node.append("text")
      .text(d => d.shortName)
      .attr("text-anchor","middle")
      .attr("dy", d => nodeRadius(d) + 11)
      .attr("fill","#6B8DB5")
      .attr("font-size","9.5px")
      .attr("font-family","system-ui, -apple-system, sans-serif")
      .attr("font-weight","600")
      .attr("letter-spacing","0.02em")
      .attr("pointer-events","none")
      .style("paint-order","stroke")
      .attr("stroke","#060C16")
      .attr("stroke-width","2.5px");

    // Tooltip div (one shared tooltip)
    const tooltip = d3.select(svgRef.current.parentElement)
      .selectAll(".ng-tooltip")
      .data([null])
      .join("div")
      .attr("class", "ng-tooltip")
      .style("position","absolute")
      .style("pointerEvents","none")
      .style("background","rgba(6,12,22,0.96)")
      .style("backdropFilter","blur(8px)")
      .style("border","1px solid #1E3A5F")
      .style("borderRadius","8px")
      .style("padding","8px 12px")
      .style("fontSize","10px")
      .style("color","#CBD5E1")
      .style("fontFamily","system-ui,sans-serif")
      .style("maxWidth","220px")
      .style("zIndex","200")
      .style("opacity","0")
      .style("transition","opacity 0.1s");

    // Hover
    node
      .on("mouseover", function(ev, d) {
        d3.select(this).select(".main").attr("stroke","#FFFFFF").attr("stroke-width", 2.5);
        link
          .attr("stroke", e => (e.source.id===d.id || e.target.id===d.id) ? "#3B82F6" : "#1E3050")
          .attr("stroke-width", e => (e.source.id===d.id || e.target.id===d.id) ? 2.5 : 1.5)
          .attr("opacity", e => (e.source.id===d.id || e.target.id===d.id) ? 1 : 0.3);
        // Show tooltip
        const c = d.scenarioCommitments?.[scenario];
        const committed = c?.committed;
        const role = c?.role || "";
        const phone = d.contact?.hotline || d.contact?.phone || "";
        const countyTag = `<span style="color:#5A7AA0">${d.county} County</span>`;
        const budgetTag = d.budget ? `<span style="color:#22C55E">$${(d.budget/1e6).toFixed(1)}M</span>` : "";
        const statusTag = scenario === "normal" ? "" :
          committed
            ? `<span style="color:#22C55E">● Committed</span>`
            : `<span style="color:#F59E0B">○ Not committed</span>`;
        tooltip.html(`
          <div style="fontWeight:700;color:#E2E8F0;marginBottom:4px">${d.name}</div>
          <div style="display:flex;gap:8px;marginBottom:3px">${countyTag} ${budgetTag} ${statusTag}</div>
          ${role ? `<div style="color:#94A3B8;fontSize:9px;marginBottom:3px">${role}</div>` : ""}
          ${phone ? `<div style="color:#60A5FA;fontWeight:700">${phone}</div>` : ""}
          <div style="color:#475569;fontSize:8px;marginTop:3px">Click to open full profile</div>
        `)
        .style("opacity","1");
      })
      .on("mousemove", function(ev) {
        const rect = svgRef.current.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const tipW = 230, tipH = 80;
        const tx = x + 14 + tipW > w ? x - tipW - 8 : x + 14;
        const ty = y - 10;
        tooltip.style("left", tx + "px").style("top", ty + "px");
      })
      .on("mouseout", function(ev, d) {
        d3.select(this).select(".main")
          .attr("stroke", d.id===selectedOrg ? "#FFFFFF" : "rgba(255,255,255,0.12)")
          .attr("stroke-width", d.id===selectedOrg ? 2.5 : 1);
        link.attr("stroke","#1E3050").attr("stroke-width",1.5).attr("opacity",0.7);
        tooltip.style("opacity","0");
      });

    sim.on("tick", () => {
      link.attr("x1",d=>d.source.x).attr("y1",d=>d.source.y)
          .attr("x2",d=>d.target.x).attr("y2",d=>d.target.y);
      node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    svg.on("click", () => onSelectOrg(null));
    return () => sim.stop();
  }, [visible, visEdges, scenario, filters, dims]);

  // Update rings without re-simulating
  useEffect(() => {
    if (!gRef.current) return;
    gRef.current.selectAll(".ring")
      .attr("opacity", d => d && d.id === selectedOrg ? 0.6 : 0);
    gRef.current.selectAll(".main")
      .attr("stroke", d => d && d.id === selectedOrg ? "#FFFFFF" : "rgba(255,255,255,0.12)")
      .attr("stroke-width", d => d && d.id === selectedOrg ? 2.5 : 1);
  }, [selectedOrg]);

  return (
    <svg ref={svgRef}
      width={dims.w} height={dims.h}
      style={{ width:"100%", height:"100%", background: T.bg, display:"block" }} />
  );
}
