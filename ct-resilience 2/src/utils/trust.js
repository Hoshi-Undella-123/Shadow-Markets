/**
 * Trust Score Engine
 * Computes a 0–100 trust score for each org based on:
 *   - Data source quality (how it was verified)
 *   - Recency (when data was last updated)
 *   - Scenario commitment clarity (how specific their commitments are)
 *   - Connection density (how well-networked = more verifiable)
 */

export const DATA_SOURCE_SCORES = {
  "990 + Annual Report":          30,
  "990 + Website + Field":        35,
  "Website + 990":                25,
  "Website + DOJ Recognition":    28,
  "990 + Website":                25,
  "990":                          20,
  "Website":                      12,
  "State website":                18,
  "City website":                 15,
};

export const TRUST_FACTORS = {
  dataSource:      { weight: 0.35, label: "Data Source Quality" },
  commitmentDepth: { weight: 0.30, label: "Scenario Commitment Depth" },
  networkDensity:  { weight: 0.20, label: "Network Connectivity" },
  selfReported:    { weight: 0.15, label: "Self-Reported Confirmation" },
};

export const TRUST_TIERS = [
  { min: 90, label: "Verified",        color: "#22C55E", icon: "✓✓" },
  { min: 75, label: "Confirmed",       color: "#3B82F6", icon: "✓"  },
  { min: 60, label: "Likely Accurate", color: "#F59E0B", icon: "~"  },
  { min: 45, label: "Needs Review",    color: "#F97316", icon: "?"  },
  { min: 0,  label: "Incomplete",      color: "#EF4444", icon: "!"  },
];

export const getTrustTier = (score) =>
  TRUST_TIERS.find(t => score >= t.min) || TRUST_TIERS[TRUST_TIERS.length - 1];

/**
 * Compute a dynamic trust breakdown for a given org.
 * Returns { total, breakdown: [{factor, score, weight, contribution}] }
 */
export const computeTrustBreakdown = (org, allOrgs) => {
  // 1. Data source
  const dsRaw = DATA_SOURCE_SCORES[org.dataSource] || 8;
  const dsScore = Math.min(100, (dsRaw / 35) * 100);

  // 2. Commitment depth — count how many scenarios have non-trivial notes + resources
  const scenarios = ["ice_raid","economic_crisis","natural_disaster","pandemic"];
  let depthTotal = 0;
  scenarios.forEach(s => {
    const c = org.scenarioCommitments?.[s];
    if (!c) return;
    let d = c.committed ? 40 : 10;
    if (c.notes && c.notes.length > 30) d += 20;
    if (c.responseTime) d += 15;
    const resCount = ["legal","shelter","food","mentalHealth","financialAid","communications"]
      .filter(k => c[k]).length;
    d += resCount * 5;
    depthTotal += Math.min(100, d);
  });
  const commitScore = depthTotal / scenarios.length;

  // 3. Network density — connections relative to max in dataset
  const maxConnections = Math.max(...allOrgs.map(o => (o.connections||[]).length));
  const connScore = Math.min(100, ((org.connections||[]).length / Math.max(maxConnections, 1)) * 100);

  // 4. Self-reported — placeholder (0 until org submits via form)
  const selfScore = org.selfReported ? 80 : 0;

  const breakdown = [
    { factor: "dataSource",      label: TRUST_FACTORS.dataSource.label,      score: dsScore,     weight: TRUST_FACTORS.dataSource.weight },
    { factor: "commitmentDepth", label: TRUST_FACTORS.commitmentDepth.label, score: commitScore, weight: TRUST_FACTORS.commitmentDepth.weight },
    { factor: "networkDensity",  label: TRUST_FACTORS.networkDensity.label,  score: connScore,   weight: TRUST_FACTORS.networkDensity.weight },
    { factor: "selfReported",    label: TRUST_FACTORS.selfReported.label,    score: selfScore,   weight: TRUST_FACTORS.selfReported.weight },
  ];

  const total = Math.round(
    breakdown.reduce((sum, b) => sum + b.score * b.weight, 0)
  );

  return { total, breakdown };
};

/**
 * Describe what would increase the trust score.
 */
export const getTrustImprovements = (org, breakdown) => {
  const suggestions = [];
  breakdown.forEach(b => {
    if (b.factor === "dataSource" && b.score < 70)
      suggestions.push("Submit official 990 filing or annual report link (+15 pts)");
    if (b.factor === "commitmentDepth" && b.score < 60)
      suggestions.push("Complete scenario commitment form with specific role + resources (+20 pts)");
    if (b.factor === "networkDensity" && b.score < 50)
      suggestions.push("Add known partner organizations to your profile (+10 pts)");
    if (b.factor === "selfReported" && b.score === 0)
      suggestions.push("Submit private self-report via 'Submit Data' form (+15 pts)");
  });
  return suggestions;
};
