import type { SeverityType } from "@/types";

export interface ScanFile {
  /** Repo-relative path, e.g. "app/api/scan/route.ts". */
  path: string;
  content: string;
}

export interface RuleMatch {
  line: number;
  /** Optional extra context appended to the finding title. */
  detail?: string;
}

export interface Rule {
  id: string;
  name: string;
  severity: SeverityType;
  cwe: string;
  /** Which files this rule applies to. */
  appliesTo: (file: ScanFile) => boolean;
  /** Return one match per occurrence found in the file. */
  detect: (file: ScanFile) => RuleMatch[];
}

// ---------- helpers ----------

const isCodePath = (p: string) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(p);
const isApiRoutePath = (p: string) => /(^|\/)route\.(ts|js)$/.test(p) && p.includes("api/");
const isSqlPath = (p: string) => /\.sql$/.test(p);
const isEnvFile = (p: string) => /\.env(\.|$)/.test(p);

// ScanFile-level predicates so they can be used directly as `appliesTo`.
const isCode = (f: ScanFile) => isCodePath(f.path);
const isApiRoute = (f: ScanFile) => isApiRoutePath(f.path);
const isSql = (f: ScanFile) => isSqlPath(f.path);

/** Find 1-indexed line numbers where a regex matches. */
function matchLines(content: string, regex: RegExp): RuleMatch[] {
  const lines = content.split(/\r?\n/);
  const out: RuleMatch[] = [];
  lines.forEach((line, i) => {
    // Reset lastIndex for global regexes reused across lines.
    regex.lastIndex = 0;
    if (regex.test(line)) out.push({ line: i + 1 });
  });
  return out;
}

// Secret patterns commonly hardcoded by AI-generated code.
const SECRET_PATTERNS: { label: string; re: RegExp }[] = [
  { label: "Anthropic API key", re: /sk-ant-[a-z0-9-]{20,}/i },
  { label: "OpenAI API key", re: /sk-[a-zA-Z0-9]{32,}/ },
  { label: "Stripe live secret key", re: /sk_live_[a-zA-Z0-9]{16,}/ },
  { label: "Stripe restricted key", re: /rk_live_[a-zA-Z0-9]{16,}/ },
  { label: "AWS access key id", re: /AKIA[0-9A-Z]{16}/ },
  { label: "GitHub token", re: /gh[pousr]_[A-Za-z0-9]{20,}/ },
  { label: "Google API key", re: /AIza[0-9A-Za-z_-]{35}/ },
  { label: "RSA/EC private key", re: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/ },
  { label: "Supabase service_role JWT", re: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]*"?role"?\s*:\s*"?service_role/ },
];

export const RULES: Rule[] = [
  {
    id: "exposed-api-keys",
    name: "Exposed API Keys / Secrets",
    severity: "critical",
    cwe: "CWE-798",
    appliesTo: (f) => (isCodePath(f.path) || isEnvFile(f.path)) && !f.path.endsWith(".env.example"),
    detect: (f) => {
      const out: RuleMatch[] = [];
      const lines = f.content.split(/\r?\n/);
      lines.forEach((line, i) => {
        for (const { label, re } of SECRET_PATTERNS) {
          if (re.test(line)) {
            out.push({ line: i + 1, detail: label });
            break;
          }
        }
      });
      return out;
    },
  },
  {
    id: "public-service-role-key",
    name: "Service-role/secret exposed via NEXT_PUBLIC_ env",
    severity: "critical",
    cwe: "CWE-200",
    appliesTo: isCode,
    detect: (f) =>
      matchLines(
        f.content,
        /NEXT_PUBLIC_[A-Z_]*(SERVICE_ROLE|SECRET|PRIVATE|_KEY)\b/
      ),
  },
  {
    id: "rls-disabled",
    name: "Table created without Row Level Security",
    severity: "critical",
    cwe: "CWE-284",
    appliesTo: isSql,
    detect: (f) => {
      const content = f.content.toLowerCase();
      const out: RuleMatch[] = [];
      const lines = f.content.split(/\r?\n/);
      lines.forEach((line, i) => {
        const m = /create table(?:\s+if not exists)?\s+(?:public\.)?["']?(\w+)/i.exec(line);
        if (m) {
          const table = m[1].toLowerCase();
          const rlsOn = new RegExp(
            `alter table\\s+(public\\.)?["']?${table}["']?\\s+enable row level security`,
            "i"
          ).test(content);
          if (!rlsOn) out.push({ line: i + 1, detail: table });
        }
      });
      return out;
    },
  },
  {
    id: "missing-auth",
    name: "API route without authentication check",
    severity: "high",
    cwe: "CWE-306",
    appliesTo: isApiRoute,
    detect: (f) => {
      // Webhooks authenticate via signatures, not user sessions.
      if (/webhook/i.test(f.path)) return [];
      const hasHandler = /export\s+(async\s+)?function\s+(POST|PUT|PATCH|DELETE|GET)/.test(f.content);
      const hasAuth =
        /auth\.getUser\(/.test(f.content) ||
        /getSession\(/.test(f.content) ||
        /requireAuth|requireUser|authorize\(/.test(f.content);
      if (hasHandler && !hasAuth) return [{ line: 1 }];
      return [];
    },
  },
  {
    id: "payment-bypass",
    name: "Payment amount/price trusted from client input",
    severity: "critical",
    cwe: "CWE-602",
    appliesTo: isCode,
    detect: (f) => {
      if (!/stripe|checkout|payment|charge/i.test(f.content)) return [];
      return matchLines(
        f.content,
        /(amount|unit_amount|price)\s*[:=]\s*(body|req|request|params|searchParams|data)\b/i
      );
    },
  },
  {
    id: "sql-injection",
    name: "Possible SQL/NoSQL injection (string-built query)",
    severity: "high",
    cwe: "CWE-89",
    appliesTo: isCode,
    detect: (f) => {
      const out: RuleMatch[] = [];
      // Template-literal query containing an interpolation.
      out.push(...matchLines(f.content, /\.(query|raw|rpc|execute)\s*\(\s*`[^`]*\$\{/i));
      // String-concatenated SQL keywords with a variable.
      out.push(...matchLines(f.content, /(select|insert|update|delete)\b[^;]*["'`]\s*\+\s*\w/i));
      return out;
    },
  },
  {
    id: "xss-dangerous-html",
    name: "dangerouslySetInnerHTML with non-sanitized input",
    severity: "high",
    cwe: "CWE-79",
    appliesTo: (f) => /\.(tsx|jsx)$/.test(f.path),
    detect: (f) => matchLines(f.content, /dangerouslySetInnerHTML/),
  },
  {
    id: "prompt-injection",
    name: "User input concatenated directly into AI prompt",
    severity: "high",
    cwe: "CWE-1427",
    appliesTo: isCode,
    detect: (f) => {
      if (!/messages\s*:|prompt|anthropic|openai/i.test(f.content)) return [];
      return matchLines(f.content, /(prompt|content)\s*[:=]\s*`[^`]*\$\{(body|req|request|input|user)/i);
    },
  },
  {
    id: "no-rate-limiting",
    name: "Mutating API route without rate limiting",
    severity: "medium",
    cwe: "CWE-770",
    appliesTo: isApiRoute,
    detect: (f) => {
      if (/webhook/i.test(f.path)) return [];
      const isMutating = /export\s+(async\s+)?function\s+(POST|PUT|PATCH|DELETE)/.test(f.content);
      const hasLimit = /rateLimit|ratelimit|Ratelimit|@upstash\/ratelimit/.test(f.content);
      if (isMutating && !hasLimit) return [{ line: 1 }];
      return [];
    },
  },
];
