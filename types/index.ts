import { Database } from "./database";

export * from "./database";

export type PlanType = "free" | "pro" | "agency";
export type SeverityType = "critical" | "high" | "medium" | "low";
export type ScanStatusType = "queued" | "running" | "done" | "failed";
export type FixPrStatusType = "open" | "merged" | "closed";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Repo = Database["public"]["Tables"]["repos"]["Row"];
export type Scan = Database["public"]["Tables"]["scans"]["Row"];
export type Finding = Database["public"]["Tables"]["findings"]["Row"];
export type FixPr = Database["public"]["Tables"]["fix_prs"]["Row"];
export type MonitoringConfig = Database["public"]["Tables"]["monitoring_config"]["Row"];

export type RepoWithLatestScan = Repo & {
  latest_scan?: Scan | null;
};

export type ScanWithFindings = Scan & {
  findings: Finding[];
  fix_prs: FixPr[];
};
