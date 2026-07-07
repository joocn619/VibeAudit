import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/database";
import { Repo } from "@/types";

// Service role client for webhook handling (bypasses RLS)
function getServiceRoleClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export async function POST(request: Request) {
  try {
    const event = request.headers.get("x-github-event");
    const body = await request.json();

    console.log(`[GitHub Webhook] Received event: ${event}`, body.action);

    const supabase = getServiceRoleClient();

    if (event === "installation") {
      if (body.action === "deleted" || body.action === "suspend") {
        const installationId = body.installation.id;
        await supabase.from("repos").delete().eq("installation_id", installationId);
      }
    } else if (event === "installation_repositories") {
      const installationId = body.installation.id;

      if (body.action === "added" && body.repositories_added) {
        // Find user by installation
        const { data } = await supabase
          .from("repos")
          .select("*")
          .eq("installation_id", installationId)
          .limit(1);

        const existingRepos = data as Repo[] | null;
        const userId = existingRepos?.[0]?.user_id;
        if (userId) {
          for (const repo of body.repositories_added) {
            await (supabase.from("repos") as any).upsert({
              user_id: userId,
              github_repo_id: repo.id,
              full_name: repo.full_name,
              default_branch: "main",
              installation_id: installationId,
            }, { onConflict: "user_id,github_repo_id" });
          }
        }
      } else if (body.action === "removed" && body.repositories_removed) {
        for (const repo of body.repositories_removed) {
          await supabase.from("repos").delete().eq("github_repo_id", repo.id);
        }
      }
    } else if (event === "push") {
      // Continuous monitoring hook — will trigger auto re-scan in Phase 6
      console.log(`[GitHub Webhook] Push event on ref: ${body.ref} for repo: ${body.repository?.full_name}`);
    }

    return NextResponse.json({ status: "processed" });
  } catch (err: any) {
    console.error("[GitHub Webhook] Error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

