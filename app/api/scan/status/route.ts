import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const scanId = new URL(request.url).searchParams.get("scanId");
  if (!scanId) {
    return NextResponse.json({ error: "Missing scanId" }, { status: 400 });
  }

  // Return the real scan row (RLS scopes it to the authenticated user).
  const { data } = await supabase
    .from("scans")
    .select("id, status, score, started_at, finished_at")
    .eq("id", scanId)
    .maybeSingle();

  if (!data) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  return NextResponse.json(data);
}
