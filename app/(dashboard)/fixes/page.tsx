import React from "react";
import { FixesClient } from "@/components/dashboard/fixes-client";

export const metadata = {
  title: "AI Fix Engine & PR Command Center — VibeAudit",
  description: "Autonomous AST vulnerability refactoring, side-by-side code diffs, sandboxed CI verification, and one-click GitHub PR merging.",
};

export default function FixesPage() {
  return <FixesClient />;
}
