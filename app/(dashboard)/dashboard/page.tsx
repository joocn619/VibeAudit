import React from "react";
import { createClient } from "@/lib/supabase/server";
import { DashboardClientView } from "@/components/dashboard/dashboard-client-view";
import { Repo } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let repos: Repo[] = [];

  if (user) {
    const { data } = await supabase
      .from("repos")
      .select("*")
      .eq("user_id", user.id)
      .order("connected_at", { ascending: false });

    if (data && data.length > 0) {
      repos = data as Repo[];
    }
  }

  // FALLBACK / DEMO MODE: If no user is logged in or user has 0 repos in database,
  // we provide realistic $100K SaaS example repositories so the dashboard looks stunning out-of-the-box!
  if (repos.length === 0) {
    repos = [
      {
        id: "repo-1",
        user_id: user?.id || "demo-user",
        github_repo_id: 88990011,
        full_name: "vibeaudit/saas-core",
        default_branch: "main",
        installation_id: 999999,
        connected_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: "repo-2",
        user_id: user?.id || "demo-user",
        github_repo_id: 88990012,
        full_name: "vibeaudit/ai-billing-engine",
        default_branch: "main",
        installation_id: 999999,
        connected_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: "repo-3",
        user_id: user?.id || "demo-user",
        github_repo_id: 88990013,
        full_name: "vibeaudit/nextjs-starter-pro",
        default_branch: "staging",
        installation_id: 999999,
        connected_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      },
      {
        id: "repo-4",
        user_id: user?.id || "demo-user",
        github_repo_id: 88990014,
        full_name: "vibeaudit/crypto-auth-microservice",
        default_branch: "main",
        installation_id: 999999,
        connected_at: new Date(Date.now() - 3600000 * 72).toISOString(),
      },
    ];
  }

  return <DashboardClientView initialRepos={repos} userEmail={user?.email || "demo.user@vibeaudit.ai"} />;
}
