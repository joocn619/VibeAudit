// ============================================================================
// VibeAudit — Demo account + data seeder (for walkthrough recordings)
// ----------------------------------------------------------------------------
// Creates a confirmed demo auth user, seeds realistic repos/scans/findings/
// fix PRs/monitoring, and prints a one-click magic login link so you can sign
// in for a video without email delivery or a password field.
//
// Usage:
//   1. Put your CURRENT Supabase keys in .env.local:
//        NEXT_PUBLIC_SUPABASE_URL=...
//        SUPABASE_SERVICE_ROLE_KEY=...        (rotate first if it leaked)
//        NEXT_PUBLIC_APP_URL=http://localhost:3000   (optional)
//   2. Run:  node scripts/seed-demo.mjs
//   3. Click the printed login link (app must be running).
//
// Re-running is safe: it wipes and re-seeds this demo user's rows only.
// ============================================================================

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ---- load .env.local (no dependency on dotenv) ----------------------------
function loadEnv(file = ".env.local") {
  try {
    for (const raw of readFileSync(file, "utf8").split(/\r?\n/)) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const eq = line.indexOf("=");
      if (eq === -1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // .env.local optional if the vars are already exported
  }
}
loadEnv();

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const DEMO_EMAIL = process.env.DEMO_EMAIL || "demo@vibeaudit.ai";
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "VibeAudit-Demo-2026!";

if (!URL || !SERVICE_KEY) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ---- find or create the demo auth user ------------------------------------
async function getOrCreateUser() {
  // Try to find an existing demo user by paging through users.
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const found = data.users.find((u) => u.email === DEMO_EMAIL);
    if (found) return found.id;
    if (data.users.length < 200) break;
  }
  const { data, error } = await supabase.auth.admin.createUser({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: "Alex Rivera (Demo)" },
  });
  if (error) throw error;
  return data.user.id;
}

async function main() {
  console.log(`→ Seeding demo account: ${DEMO_EMAIL}`);
  const userId = await getOrCreateUser();
  console.log(`  user id: ${userId}`);

  // Profile on the Agency plan so every feature/module is unlocked in the UI.
  const { error: profErr } = await supabase.from("profiles").upsert(
    {
      id: userId,
      email: DEMO_EMAIL,
      plan: "agency",
      onboarding_completed: true,
    },
    { onConflict: "id" }
  );
  if (profErr) throw profErr;

  // Idempotency: deleting the demo user's repos cascades to scans/findings/
  // fix_prs/monitoring via FK ON DELETE CASCADE.
  await supabase.from("repos").delete().eq("user_id", userId);

  const now = Date.now();
  const iso = (msAgo) => new Date(now - msAgo).toISOString();
  const H = 3600_000;
  const D = 24 * H;

  // ---- repos --------------------------------------------------------------
  const repos = [
    { github_repo_id: 100001, full_name: "cursor-ai/ecommerce-ai-store", default_branch: "main", installation_id: 50001, connected_at: iso(5 * D) },
    { github_repo_id: 100002, full_name: "lovable-dev/llm-agent-portal", default_branch: "main", installation_id: 50002, connected_at: iso(3 * D) },
    { github_repo_id: 100003, full_name: "v0-vercel/fintech-saas-dashboard", default_branch: "main", installation_id: 50003, connected_at: iso(1 * D) },
    { github_repo_id: 100004, full_name: "windsurf/crypto-wallet-bot", default_branch: "main", installation_id: 50004, connected_at: iso(2 * H) },
  ].map((r) => ({ ...r, user_id: userId }));

  const { data: repoRows, error: repoErr } = await supabase.from("repos").insert(repos).select();
  if (repoErr) throw repoErr;
  const byName = Object.fromEntries(repoRows.map((r) => [r.full_name, r.id]));

  // ---- scans --------------------------------------------------------------
  const scans = [
    { repo: "cursor-ai/ecommerce-ai-store", status: "done", score: 98, commit_sha: "a7f93b2c4e1d", started: 4 * D, dur: 45_000 },
    { repo: "lovable-dev/llm-agent-portal", status: "done", score: 76, commit_sha: "c3d82a1f9e0b", started: 2 * D, dur: 52_000 },
    { repo: "v0-vercel/fintech-saas-dashboard", status: "done", score: 41, commit_sha: "e5b14c8d2a9f", started: 12 * H, dur: 58_000 },
    { repo: "windsurf/crypto-wallet-bot", status: "running", score: null, commit_sha: "f8a21b3c6e4d", started: 30_000, dur: null },
  ];
  const scanInsert = scans.map((s) => ({
    repo_id: byName[s.repo],
    user_id: userId,
    status: s.status,
    score: s.score,
    commit_sha: s.commit_sha,
    started_at: iso(s.started),
    finished_at: s.dur ? iso(s.started - s.dur) : null,
  }));
  const { data: scanRows, error: scanErr } = await supabase.from("scans").insert(scanInsert).select();
  if (scanErr) throw scanErr;
  const scanByRepo = Object.fromEntries(
    scanRows.map((row) => [repoRows.find((r) => r.id === row.repo_id).full_name, row.id])
  );

  // ---- findings (use the real scan engine rule ids) -----------------------
  const scanPortal = scanByRepo["lovable-dev/llm-agent-portal"];
  const scanFintech = scanByRepo["v0-vercel/fintech-saas-dashboard"];
  const scanStore = scanByRepo["cursor-ai/ecommerce-ai-store"];

  const findings = [
    { scan_id: scanFintech, check_type: "payment-bypass", severity: "critical", file_path: "app/api/checkout/route.ts", line: 18, title: "Payment amount/price trusted from client input", plain_english: "The payment amount is taken from the request instead of your server.", fix_suggestion: "Look up the price server-side from a fixed price ID, never from client input.", cwe: "CWE-602" },
    { scan_id: scanFintech, check_type: "sql-injection", severity: "high", file_path: "app/api/search/route.ts", line: 42, title: "Possible SQL/NoSQL injection (string-built query)", plain_english: "A database query is built by gluing strings together with variables.", fix_suggestion: "Use parameterized queries instead of string interpolation.", cwe: "CWE-89" },
    { scan_id: scanFintech, check_type: "missing-auth", severity: "high", file_path: "app/api/admin/users/route.ts", line: 1, title: "API route without authentication check", plain_english: "This API route runs without checking who is calling it.", fix_suggestion: "Call supabase.auth.getUser() and return 401 when there is no user.", cwe: "CWE-306" },
    { scan_id: scanPortal, check_type: "public-service-role-key", severity: "critical", file_path: "lib/supabase.ts", line: 4, title: "Service-role/secret exposed via NEXT_PUBLIC_ env", plain_english: "A secret is exposed to the browser through a NEXT_PUBLIC_ variable.", fix_suggestion: "Remove the NEXT_PUBLIC_ prefix and read the key only on the server.", cwe: "CWE-200" },
    { scan_id: scanPortal, check_type: "no-rate-limiting", severity: "medium", file_path: "app/api/ai/generate/route.ts", line: 1, title: "Mutating API route without rate limiting", plain_english: "This endpoint can be called as fast and as often as an attacker wants.", fix_suggestion: "Add per-user/per-IP rate limiting.", cwe: "CWE-770" },
    { scan_id: scanStore, check_type: "exposed-api-keys", severity: "low", file_path: "components/analytics.tsx", line: 12, title: "Exposed API Keys / Secrets: analytics token", plain_english: "A key is written directly into your code.", fix_suggestion: "Move it to an environment variable and rotate it.", cwe: "CWE-798" },
  ];
  const { data: findingRows, error: findErr } = await supabase.from("findings").insert(findings).select();
  if (findErr) throw findErr;

  // ---- fix PRs ------------------------------------------------------------
  const fPayment = findingRows.find((f) => f.check_type === "payment-bypass");
  const fSql = findingRows.find((f) => f.check_type === "sql-injection");
  const fixPrs = [
    { finding_id: fPayment.id, scan_id: fPayment.scan_id, pr_url: "https://github.com/v0-vercel/fintech-saas-dashboard/pull/28", status: "merged", created_at: iso(1 * D) },
    { finding_id: fSql.id, scan_id: fSql.scan_id, pr_url: "https://github.com/v0-vercel/fintech-saas-dashboard/pull/31", status: "open", created_at: iso(10 * H) },
  ];
  const { error: prErr } = await supabase.from("fix_prs").insert(fixPrs);
  if (prErr) throw prErr;

  // ---- monitoring ---------------------------------------------------------
  const monitoring = [
    { repo_id: byName["cursor-ai/ecommerce-ai-store"], enabled: true, alert_email: DEMO_EMAIL, alert_discord_webhook: "https://discord.com/api/webhooks/demo/1" },
    { repo_id: byName["lovable-dev/llm-agent-portal"], enabled: true, alert_email: DEMO_EMAIL, alert_discord_webhook: null },
    { repo_id: byName["v0-vercel/fintech-saas-dashboard"], enabled: true, alert_email: DEMO_EMAIL, alert_discord_webhook: null },
    { repo_id: byName["windsurf/crypto-wallet-bot"], enabled: false, alert_email: null, alert_discord_webhook: null },
  ];
  const { error: monErr } = await supabase.from("monitoring_config").upsert(monitoring, { onConflict: "repo_id" });
  if (monErr) throw monErr;

  // ---- one-click login link ----------------------------------------------
  const { data: link, error: linkErr } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: DEMO_EMAIL,
    options: { redirectTo: `${APP_URL}/api/auth/callback?redirect=/dashboard` },
  });

  console.log("\n✅ Seeded: 4 repos, 4 scans, 6 findings, 2 fix PRs, monitoring configs.");
  console.log(`   Plan: agency (all modules unlocked)\n`);
  console.log("── Log in for your video ─────────────────────────────────────");
  console.log(`   Email:    ${DEMO_EMAIL}`);
  console.log(`   Password: ${DEMO_PASSWORD}   (if you add a password login)`);
  if (!linkErr && link?.properties?.action_link) {
    console.log(`\n   One-click login link (app must be running):`);
    console.log(`   ${link.properties.action_link}`);
  } else if (linkErr) {
    console.log(`\n   (magic link generation failed: ${linkErr.message})`);
    console.log(`   Log in via the app using the magic-link option with ${DEMO_EMAIL}.`);
  }
  console.log("──────────────────────────────────────────────────────────────");
}

main().catch((err) => {
  console.error("\n✗ Seeding failed:", err.message || err);
  console.error("  If this is an auth/permission error, your SUPABASE_SERVICE_ROLE_KEY");
  console.error("  in .env.local is likely stale (rotated). Update it and re-run.");
  process.exit(1);
});
