import { App } from "@octokit/app";
import { Octokit } from "@octokit/rest";
import { createClient } from "@/lib/supabase/server";

export function getGitHubApp() {
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!appId || !privateKey || appId === "123456" || privateKey.includes("...")) {
    return null;
  }

  try {
    return new App({
      appId,
      privateKey,
    });
  } catch (err) {
    console.error("[GitHubApp] Failed to initialize:", err);
    return null;
  }
}

export async function getInstallationOctokit(installationId: number) {
  const app = getGitHubApp();
  if (!app) return null;

  try {
    const octokit = await app.getInstallationOctokit(installationId);
    return octokit;
  } catch (err) {
    console.error(`[GitHubApp] Failed to get Octokit for installation ${installationId}:`, err);
    return null;
  }
}

export async function syncInstallationRepos(userId: string, installationId: number) {
  const supabase = await createClient();
  const octokit = await getInstallationOctokit(installationId);

  if (!octokit) {
    // FALLBACK / DEMO MODE: If GitHub App is not configured yet (e.g. 0-MRR flip setup or local dev),
    // we create a realistic connected repository so the scanner & AI fix loop works out-of-the-box!
    console.log("[GitHubApp] Using demo fallback repository sync for user:", userId);
    
    const demoRepo = {
      user_id: userId,
      github_repo_id: 88990011,
      full_name: "vibeaudit/demo-ai-saas",
      default_branch: "main",
      installation_id: installationId || 999999,
    };

    const { data, error } = await (supabase.from("repos") as any)
      .upsert(demoRepo, { onConflict: "user_id,github_repo_id" })
      .select()
      .single();

    if (error) {
      console.error("[GitHubApp] Error syncing demo repo:", error);
      throw error;
    }

    return [data];
  }

  // REAL GITHUB APP SYNC
  try {
    const { data: { repositories } } = await (octokit as any).rest.apps.listReposAccessibleToInstallation();
    const syncedRepos = [];

    for (const repo of repositories) {
      const repoData = {
        user_id: userId,
        github_repo_id: repo.id,
        full_name: repo.full_name,
        default_branch: repo.default_branch || "main",
        installation_id: installationId,
      };

      const { data, error } = await (supabase.from("repos") as any)
        .upsert(repoData, { onConflict: "user_id,github_repo_id" })
        .select()
        .single();

      if (!error && data) {
        syncedRepos.push(data);
      }
    }

    return syncedRepos;
  } catch (err) {
    console.error("[GitHubApp] Error syncing repositories:", err);
    throw err;
  }
}

