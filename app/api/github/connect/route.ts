import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { syncInstallationRepos } from "@/lib/github/app";
import { rateLimit, clientKey, tooManyRequests } from "@/lib/rate-limit";

const bodySchema = z.object({
  installation_id: z.coerce.number().int().positive().optional(),
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = rateLimit(clientKey(request, `gh-connect:${user.id}`), {
      limit: 10,
      windowMs: 60_000,
    });
    if (!limited.ok) return tooManyRequests(limited);

    const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const installationId = parsed.data.installation_id;
    if (!installationId) {
      return NextResponse.json({ error: "Missing installation_id" }, { status: 400 });
    }

    const repos = await syncInstallationRepos(user.id, installationId);

    await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user.id);

    return NextResponse.json({ status: "success", repos });
  } catch (err) {
    console.error("[API/github/connect] Error:", err);
    return NextResponse.json({ error: "Failed to connect repository" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const installationIdParam = requestUrl.searchParams.get("installation_id");

  if (installationIdParam) {
    const installationId = Number.parseInt(installationIdParam, 10);
    if (Number.isFinite(installationId) && installationId > 0) {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await syncInstallationRepos(user.id, installationId).catch(console.error);
        await supabase.from("profiles").update({ onboarding_completed: true }).eq("id", user.id);
      }
    }
  }

  const appSlug = process.env.GITHUB_APP_SLUG || "vibeaudit";
  const githubInstallUrl = `https://github.com/apps/${appSlug}/installations/new`;

  // If the GitHub App is not configured, send the user back to the dashboard.
  if (!process.env.GITHUB_APP_ID || process.env.GITHUB_APP_ID === "123456") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.redirect(githubInstallUrl);
}
