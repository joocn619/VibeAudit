import React from "react";
import { SettingsTeamClient } from "@/components/dashboard/settings-team-client";

export const metadata = {
  title: "Team & RBAC Command Center — VibeAudit Enterprise",
  description: "Granular Role-Based Access Control, Okta SAML SSO, SCIM automated provisioning, and developer invitation management.",
};

export default function TeamSettingsPage() {
  return <SettingsTeamClient />;
}
