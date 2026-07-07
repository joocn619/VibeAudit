import React from "react";
import { ComplianceClient } from "@/components/dashboard/compliance-client";

export const metadata = {
  title: "Compliance Command Center — VibeAudit Enterprise",
  description: "Automated SOC2 Type II, ISO 27001, GDPR, and HIPAA compliance readiness tracking with automated evidence collection and one-click audit PDF generation.",
};

export default function CompliancePage() {
  return <ComplianceClient />;
}
