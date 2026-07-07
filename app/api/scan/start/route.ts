import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit, clientKey, tooManyRequests } from "@/lib/rate-limit";

const bodySchema = z.object({
  repoId: z.string().uuid().optional(),
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

  // NOTE: The real scan pipeline (worker + Semgrep/AST engine) is not yet
  // implemented. This response is SIMULATED and marked as such so callers do
  // not treat it as a genuine security result. See lib/scan/engine.ts.
  const scanId = `scan_sim_${Date.now()}`;
  return NextResponse.json({
    simulated: true,
    status: "completed",
    scanId,
    score: null,
    findingsCount: 0,
    timestamp: new Date().toISOString(),
    message: "Scan engine not yet implemented — simulated response.",
  });
}
