import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, clientKey, tooManyRequests } from "@/lib/rate-limit";
import { runScanEngine } from "@/lib/scan/engine";

const MAX_FILES = 2000;
const MAX_FILE_BYTES = 512 * 1024; // 512 KB per file

const bodySchema = z.object({
  repoId: z.string().uuid().optional(),
  files: z
    .array(
      z.object({
        path: z.string().min(1).max(1024),
        content: z.string().max(MAX_FILE_BYTES),
      })
    )
    .min(1)
    .max(MAX_FILES)
    .optional(),
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(clientKey(request, `scan:${user.id}`), { limit: 10, windowMs: 60_000 });
  if (!limited.ok) return tooManyRequests(limited);

  const parsed = bodySchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Real scan path: caller supplies file contents (upload or future GitHub App
  // fetch) and the engine runs actual static analysis.
  if (parsed.data.files && parsed.data.files.length > 0) {
    const result = runScanEngine(parsed.data.files);
    return NextResponse.json({
      status: result.status,
      score: result.score,
      findingsCount: result.findings.length,
      filesScanned: result.filesScanned,
      findings: result.findings,
      timestamp: new Date().toISOString(),
    });
  }

  // repoId-only path needs the GitHub App fetch layer, which is not yet wired.
  return NextResponse.json(
    {
      error: "not_implemented",
      message:
        "Fetching repository contents via the GitHub App is not yet implemented. " +
        "Send `files` in the request body to run the analysis engine directly.",
    },
    { status: 501 }
  );
}
