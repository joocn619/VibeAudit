import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Verify the GitHub webhook HMAC-SHA256 signature over the raw request body.
 * Returns true only when the signature is present, well-formed, and matches.
 */
function verifySignature(rawBody: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;
  const expected = "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return false;
  return timingSafeEqual(sigBuf, expBuf);
}

export async function POST(request: Request) {
  const secret = process.env.GITHUB_APP_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[GitHub Webhook] GITHUB_APP_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  // Read the raw body BEFORE parsing — HMAC must be computed over exact bytes.
  const rawBody = await request.text();
  const signature = request.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const event = request.headers.get("x-github-event");
    const supabase = createAdminClient();

    if (event === "installation") {
      if (body.action === "deleted" || body.action === "suspend") {
        const installationId = body.installation?.id;
        if (installationId) {
          await supabase.from("repos").delete().eq("installation_id", installationId);
        }
      }
    } else if (event === "installation_repositories") {
      const installationId = body.installation?.id;

      if (body.action === "added" && Array.isArray(body.repositories_added)) {
        const { data } = await supabase
          .from("repos")
          .select("user_id")
          .eq("installation_id", installationId)
          .limit(1);

        const userId = data?.[0]?.user_id;
        if (userId) {
          for (const repo of body.repositories_added) {
            await supabase.from("repos").upsert(
              {
                user_id: userId,
                github_repo_id: repo.id,
                full_name: repo.full_name,
                default_branch: "main",
                installation_id: installationId,
              },
              { onConflict: "user_id,github_repo_id" }
            );
          }
        }
      } else if (body.action === "removed" && Array.isArray(body.repositories_removed)) {
        // Scope deletion to the installation to avoid cross-tenant deletes.
        for (const repo of body.repositories_removed) {
          await supabase
            .from("repos")
            .delete()
            .eq("github_repo_id", repo.id)
            .eq("installation_id", installationId);
        }
      }
    } else if (event === "push") {
      // Continuous monitoring hook — auto re-scan trigger point.
      console.log(`[GitHub Webhook] Push on ${body.ref} for ${body.repository?.full_name}`);
    }

    return NextResponse.json({ status: "processed" });
  } catch (err) {
    console.error("[GitHub Webhook] Error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
