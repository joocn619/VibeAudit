export const VIBE_CODER_RULES = [
  { id: "exposed-api-keys", name: "Exposed API Keys", severity: "critical" },
  { id: "rls-disabled", name: "Supabase/Firebase RLS Off", severity: "critical" },
  { id: "missing-auth", name: "Missing Auth Checks", severity: "high" },
  { id: "payment-bypass", name: "Payment Bypass", severity: "critical" },
  { id: "injection", name: "SQL / Prompt Injection", severity: "high" },
  { id: "no-rate-limiting", name: "No Rate Limiting", severity: "medium" },
];
