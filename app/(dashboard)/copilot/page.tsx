import React from "react";
import { CopilotClient } from "@/components/dashboard/copilot-client";

export const metadata = {
  title: "VibeAudit Copilot — Neural AI Security Assistant & Threat Hunter",
  description: "Interactive AI security chat, automated threat hunting, AST vulnerability analysis, and IDE/CLI integration guides.",
};

export default function CopilotPage() {
  return <CopilotClient />;
}
