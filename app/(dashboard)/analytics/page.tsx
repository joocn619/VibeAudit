import React from "react";
import { AnalyticsClient } from "@/components/dashboard/analytics-client";

export const metadata = {
  title: "Analytics & Intelligence — VibeAudit",
  description: "Executive security posture analytics, vulnerability trend heatmap, and AI threat intelligence reports.",
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
