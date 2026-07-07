import React from "react";
import { FleetClient } from "@/components/dashboard/fleet-client";

export const metadata = {
  title: "Fleet Topology & AI Supply Chain — VibeAudit Enterprise",
  description: "Real-time multi-cloud architecture mapping, AI model supply chain security, OWASP LLM01 prompt injection monitoring, and blast radius simulation.",
};

export default function FleetPage() {
  return <FleetClient />;
}
