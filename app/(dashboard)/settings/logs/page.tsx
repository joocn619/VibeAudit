import React from "react";
import { SettingsLogsClient } from "@/components/dashboard/settings-logs-client";

export const metadata = {
  title: "Cryptographic Audit Logs — VibeAudit Enterprise",
  description: "Tamper-proof SOC2 Type II and ISO 27001 audit trails. Export to SIEM, Datadog, Splunk, or CSV with cryptographic hash verification.",
};

export default function LogsSettingsPage() {
  return <SettingsLogsClient />;
}
