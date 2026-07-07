import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { syncInstallationRepos } from "@/lib/github/app";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const installationId = body.installation_id || 999999;

    // Sync repositories for this user
    const repos = await syncInstallationRepos(user.id, installationId);

    // Mark onboarding as completed
    await (supabase.from("profiles") as any)
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    return NextResponse.json({ status: "success", repos });
  } catch (err: any) {
    console.error("[API/github/connect] Error:", err);
    return NextResponse.json({ error: err.message || "Failed to connect repository" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const installationId = requestUrl.searchParams.get("installation_id");

  // If redirected from GitHub App installation
  if (installationId) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await syncInstallationRepos(user.id, parseInt(installationId, 10)).catch(console.error);
      await (supabase.from("profiles") as any).update({ onboarding_completed: true }).eq("id", user.id);
    }
  }

  const appSlug = process.env.GITHUB_APP_SLUG || "vibeaudit";
  const githubInstallUrl = `https://github.com/apps/${appSlug}/installations/new`;

  // If GITHUB_APP_ID is stub, redirect directly to dashboard
  if (!process.env.GITHUB_APP_ID || process.env.GITHUB_APP_ID === "123456") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.redirect(githubInstallUrl);
}

