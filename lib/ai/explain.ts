/**
 * Deterministic, plain-English explanations for each scan rule. These are real
 * (not simulated) and require no external API. An optional AI enrichment layer
 * can be layered on later without changing callers.
 */
interface Explanation {
  plainEnglish: string;
  consequence: string;
  fix: string;
}

const EXPLANATIONS: Record<string, Explanation> = {
  "exposed-api-keys": {
    plainEnglish: "A secret API key or private key is written directly into your code.",
    consequence: "Anyone who sees this file (including in your Git history) can use the key to run up charges or access your data.",
    fix: "Move the secret to an environment variable and rotate the exposed key immediately.",
  },
  "public-service-role-key": {
    plainEnglish: "A secret is exposed to the browser through a NEXT_PUBLIC_ variable.",
    consequence: "NEXT_PUBLIC_ variables are shipped to every visitor. A service-role or secret key here gives attackers full access.",
    fix: "Rename the variable without the NEXT_PUBLIC_ prefix and read it only on the server.",
  },
  "rls-disabled": {
    plainEnglish: "A database table was created without Row Level Security turned on.",
    consequence: "Without RLS, any user with the public API key can read or modify every row in the table, including other users' data.",
    fix: "Run `alter table <name> enable row level security;` and add policies scoped to auth.uid().",
  },
  "missing-auth": {
    plainEnglish: "This API route runs without checking who is calling it.",
    consequence: "Anyone on the internet can call this endpoint and perform actions or read data as if they were logged in.",
    fix: "Call supabase.auth.getUser() at the top and return 401 when there is no authenticated user.",
  },
  "payment-bypass": {
    plainEnglish: "The payment amount or price is taken from the request instead of your server.",
    consequence: "A user can change the price in the request and pay $0 (or any amount) for a paid plan.",
    fix: "Look up the price/amount server-side from a trusted source (a fixed price ID), never from client input.",
  },
  "sql-injection": {
    plainEnglish: "A database query is built by gluing strings together with variables.",
    consequence: "Attackers can inject SQL to read, modify, or delete your entire database.",
    fix: "Use parameterized queries or the query builder instead of string concatenation/interpolation.",
  },
  "xss-dangerous-html": {
    plainEnglish: "Raw HTML is injected into the page with dangerouslySetInnerHTML.",
    consequence: "If any of that HTML comes from users, an attacker can run scripts in other users' browsers.",
    fix: "Avoid dangerouslySetInnerHTML, or sanitize the HTML with a library like DOMPurify first.",
  },
  "prompt-injection": {
    plainEnglish: "User input is placed directly into an AI prompt.",
    consequence: "Users can override your instructions, leak your system prompt, or make the model take unintended actions.",
    fix: "Separate user input from instructions, validate it, and never interpolate it into the system prompt.",
  },
  "no-rate-limiting": {
    plainEnglish: "This endpoint can be called as fast and as often as an attacker wants.",
    consequence: "It can be abused to exhaust resources, run up API bills, or brute-force values.",
    fix: "Add per-user/per-IP rate limiting (e.g. the rateLimit helper or @upstash/ratelimit).",
  },
};

const FALLBACK: Explanation = {
  plainEnglish: "A potential security issue was detected.",
  consequence: "This may allow unauthorized access or unexpected behavior in production.",
  fix: "Review the flagged line and apply the recommended secure pattern.",
};

export function explainFinding(ruleId: string) {
  const e = EXPLANATIONS[ruleId] ?? FALLBACK;
  return { plainEnglish: e.plainEnglish, consequence: e.consequence, fixSuggestion: e.fix };
}

/** Back-compat shape kept for existing callers. */
export async function generatePlainEnglishExplanation(cwe: string, ruleId: string) {
  const e = explainFinding(ruleId);
  return { plainEnglish: e.plainEnglish, consequence: e.consequence };
}
