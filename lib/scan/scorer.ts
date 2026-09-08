export function calculateSecurityScore(findings: { severity: string }[]): number {
  let score = 100;
  for (const finding of findings) {
    if (finding.severity === "critical") score -= 25;
    else if (finding.severity === "high") score -= 12;
    else if (finding.severity === "medium") score -= 5;
    else if (finding.severity === "low") score -= 2;
  }
  return Math.max(0, score);
}
