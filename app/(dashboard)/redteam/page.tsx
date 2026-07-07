import React from "react";
import { RedTeamClient } from "@/components/dashboard/redteam-client";

export const metadata = {
  title: "Red Team Arena & Cyber Defense Grid — VibeAudit Enterprise",
  description: "Autonomous Red Team vs. Blue Team simulation, real-time penetration testing engine, zero-day threat simulation, and official pen-test certification.",
};

export default function RedTeamPage() {
  return <RedTeamClient />;
}
