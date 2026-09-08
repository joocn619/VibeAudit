import { RULES, type ScanFile } from "./rules";
import { calculateSecurityScore } from "./scorer";
import { explainFinding } from "@/lib/ai/explain";
import type { SeverityType } from "@/types";

export interface EngineFinding {
  check_type: string;
  severity: SeverityType;
  file_path: string;
  line: number;
  title: string;
  plain_english: string;
  fix_suggestion: string;
  cwe: string;
}

export interface ScanResult {
  status: "completed";
  score: number;
  findings: EngineFinding[];
  filesScanned: number;
}

/** Files that should never be scanned (noise / not user source). */
function isScannable(path: string): boolean {
  if (/(^|\/)node_modules\//.test(path)) return false;
  if (/(^|\/)\.next\//.test(path)) return false;
  if (/\.(png|jpg|jpeg|gif|webp|svg|ico|lock|map)$/.test(path)) return false;
  if (/package-lock\.json$/.test(path)) return false;
  return true;
}

/**
 * Real static-analysis scan engine. Runs every rule against every applicable
 * file and returns concrete findings plus a 0-100 security score.
 *
 * This is intentionally source-agnostic: callers pass file contents (from a
 * GitHub App fetch, an upload, or a local read), so the engine itself needs no
 * external service and is fully unit-testable.
 */
export function runScanEngine(files: ScanFile[]): ScanResult {
  const scannable = files.filter((f) => isScannable(f.path));
  const findings: EngineFinding[] = [];

  for (const file of scannable) {
    for (const rule of RULES) {
      if (!rule.appliesTo(file)) continue;
      for (const match of rule.detect(file)) {
        const explanation = explainFinding(rule.id);
        findings.push({
          check_type: rule.id,
          severity: rule.severity,
          file_path: file.path,
          line: match.line,
          title: match.detail ? `${rule.name}: ${match.detail}` : rule.name,
          plain_english: explanation.plainEnglish,
          fix_suggestion: explanation.fixSuggestion,
          cwe: rule.cwe,
        });
      }
    }
  }

  // Deterministic ordering: worst severity first, then by file/line.
  const order: Record<SeverityType, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  findings.sort(
    (a, b) =>
      order[a.severity] - order[b.severity] ||
      a.file_path.localeCompare(b.file_path) ||
      a.line - b.line
  );

  return {
    status: "completed",
    score: calculateSecurityScore(findings),
    findings,
    filesScanned: scannable.length,
  };
}
