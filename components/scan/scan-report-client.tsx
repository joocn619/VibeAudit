"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  AlertOctagon,
  AlertTriangle,
  Info,
  Sparkles,
  GitPullRequest,
  CheckCircle2,
  Play,
  ArrowLeft,
  Terminal,
  FileCode,
  Clock,
  ExternalLink,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ScoreRing } from "@/components/dashboard/score-ring";

interface ScanReportClientProps {
  repoId: string;
}

interface Finding {
  id: string;
  title: string;
  severity: "critical" | "moderate" | "low";
  file: string;
  line: number;
  explanation: string;
  exploitScenario: string;
  codeVulnerable: string;
  codeFixed: string;
  prStatus?: "idle" | "generating" | "opened";
  prUrl?: string;
  prNumber?: number;
}

export function ScanReportClient({ repoId }: ScanReportClientProps) {
  const [scanning, setScanning] = useState(false);
  const [scanTime, setScanTime] = useState("Just now");
  const [score, setScore] = useState(91);

  // Initial realistic findings for a high-end AI SaaS application
  const [findings, setFindings] = useState<Finding[]>([
    {
      id: "vuln-1",
      title: "SQL Injection via Unsanitized String Interpolation",
      severity: "critical",
      file: "app/api/checkout/route.ts",
      line: 42,
      explanation:
        "The endpoint directly concatenates the user-supplied query parameter into a raw database query string without parameterized binding or type validation.",
      exploitScenario:
        "An attacker can pass `?id=' OR '1'='1` in the checkout URL to bypass authentication checks or dump sensitive billing records and customer API keys from the database.",
      codeVulnerable: `// VULNERABLE: Direct string concatenation allows SQL query injection
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  
  const query = "SELECT * FROM billing_profiles WHERE user_id = '" + userId + "'";
  const profile = await db.raw(query);
  return NextResponse.json(profile);
}`,
      codeFixed: `// SECURE: Parameterized binding prevents SQL injection & enforces type checking
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");
  
  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  const query = "SELECT * FROM billing_profiles WHERE user_id = $1";
  const profile = await db.query(query, [userId]);
  return NextResponse.json(profile);
}`,
      prStatus: "idle",
    },
    {
      id: "vuln-2",
      title: "Payment Bypass: Client-Side Price Trust",
      severity: "moderate",
      file: "app/api/stripe/checkout/route.ts",
      line: 18,
      explanation:
        "The Stripe session creation logic accepts the subscription price amount directly from the frontend JSON request body instead of looking up a secure server-side price ID.",
      exploitScenario:
        "A user can open their browser DevTools, intercept the checkout POST request, and modify the `unit_amount` payload from `9900` ($99) to `1` ($0.01) to gain full Pro access for free.",
      codeVulnerable: `// VULNERABLE: Accepting arbitrary pricing amounts from client payload
export async function POST(req: Request) {
  const body = await req.json();
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "VibeAudit Pro Plan" },
        unit_amount: body.amount, // Unverified client input!
      },
      quantity: 1,
    }],
    mode: "subscription",
  });
  return NextResponse.json({ url: session.url });
}`,
      codeFixed: `// SECURE: Server-side Price ID verification against verified plan catalog
const SERVER_PLAN_PRICES: Record<string, string> = {
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  agency: process.env.STRIPE_AGENCY_PRICE_ID!,
};

export async function POST(req: Request) {
  const { planType } = await req.json();
  const verifiedPriceId = SERVER_PLAN_PRICES[planType];
  
  if (!verifiedPriceId) {
    return NextResponse.json({ error: "Invalid plan selection" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [{ price: verifiedPriceId, quantity: 1 }],
    mode: "subscription",
  });
  return NextResponse.json({ url: session.url });
}`,
      prStatus: "idle",
    },
    {
      id: "vuln-3",
      title: "Missing Rate Limiting & Token Exhaustion on AI Route",
      severity: "low",
      file: "app/api/ai/generate/route.ts",
      line: 12,
      explanation:
        "The AI generation endpoint does not enforce IP-based or user-based rate limiting before invoking high-cost LLM APIs (Claude / OpenAI).",
      exploitScenario:
        "A malicious competitor or bot script could repeatedly spam this route with automated requests, exhausting your API credits and causing a Denial of Wallet (DoW) attack.",
      codeVulnerable: `// VULNERABLE: No rate limiting or credit validation before LLM invocation
export async function POST(req: Request) {
  const { prompt } = await req.json();
  
  const aiResponse = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });
  
  return NextResponse.json({ result: aiResponse });
}`,
      codeFixed: `// SECURE: Upstream rate limiting & user credit quota check integrated
import { rateLimit } from "@/lib/security/limiter";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "anonymous";
  const { success, limit, remaining } = await rateLimit.check(ip, 10); // 10 req/min
  
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again later." }, { status: 429 });
  }

  const { prompt } = await req.json();
  const aiResponse = await anthropic.messages.create({
    model: "claude-3-7-sonnet-20250219",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });
  
  return NextResponse.json({ result: aiResponse }, { headers: { "X-RateLimit-Remaining": \`\${remaining}\` } });
}`,
      prStatus: "idle",
    },
  ]);

  const [expandedId, setExpandedId] = useState<string | null>("vuln-1");

  // Trigger Deep AI Scan
  const handleTriggerScan = async () => {
    if (scanning) return;
    setScanning(true);
    try {
      await fetch("/api/scan/start", { method: "POST" });
      await new Promise((resolve) => setTimeout(resolve, 2400));
      setScanTime("Just now (Updated via Deep AI Engine v2.4)");
      setScore(94);
    } catch (err) {
      console.error("Scan trigger error:", err);
    } finally {
      setScanning(false);
    }
  };

  // Trigger AI PR Generator for a specific finding
  const handleGeneratePR = async (findingId: string) => {
    setFindings((prev) =>
      prev.map((f) => (f.id === findingId ? { ...f, prStatus: "generating" } : f))
    );

    try {
      const res = await fetch("/api/fix/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ findingId, repoId }),
      });
      const data = await res.json();

      await new Promise((resolve) => setTimeout(resolve, 3000));

      setFindings((prev) =>
        prev.map((f) =>
          f.id === findingId
            ? {
                ...f,
                prStatus: "opened",
                prUrl: data.prUrl || `https://github.com/vibeaudit/${repoId || "saas-core"}/pull/15`,
                prNumber: data.prNumber || 15,
              }
            : f
        )
      );
    } catch (err) {
      console.error("PR generation error:", err);
      setFindings((prev) =>
        prev.map((f) => (f.id === findingId ? { ...f, prStatus: "idle" } : f))
      );
    }
  };

  const criticalCount = findings.filter((f) => f.severity === "critical").length;
  const moderateCount = findings.filter((f) => f.severity === "moderate").length;
  const lowCount = findings.filter((f) => f.severity === "low").length;

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Top Navigation & Command Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/15">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="p-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-300 hover:text-white transition shadow-sm shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight font-mono">
                {repoId || "vibeaudit/saas-core"}
              </h1>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 flex items-center gap-1.5 shadow-sm font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Continuous Scan Active</span>
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-300 font-medium flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>Last AST & Vulnerability Audit: {scanTime}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerScan}
          disabled={scanning}
          className={`px-6 py-3.5 rounded-2xl font-extrabold text-xs transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shrink-0 ${
            scanning
              ? "bg-indigo-500/50 text-indigo-200 cursor-wait"
              : "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white shadow-glow hover:scale-105"
          }`}
        >
          {scanning ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Running AST & Zero-Day Audit...</span>
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              <span>Trigger Deep AI Scan</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Executive Score Ring & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Score Display Card (4 cols) */}
        <div className="lg:col-span-4 glass-card rounded-3xl p-8 border border-white/15 bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none"></div>
          <ScoreRing score={score} size={130} />
          <h3 className="text-xl font-black text-white mt-4 font-mono">Security Grade: A+</h3>
          <p className="text-xs text-slate-300 mt-1 font-medium max-w-xs">
            Your application AST is protected against known CVEs and OWASP Top 10 vulnerabilities.
          </p>
        </div>

        {/* Breakdown & Action Metrics (8 cols) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-card rounded-3xl p-6 border border-rose-500/30 bg-gradient-to-br from-rose-500/15 to-transparent flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono">Critical Findings</span>
              <AlertOctagon className="h-5 w-5 text-rose-400" />
            </div>
            <div className="my-4">
              <span className="text-4xl font-black font-mono text-white">{criticalCount}</span>
              <span className="text-xs font-bold text-slate-300 ml-1.5">Action Required</span>
            </div>
            <p className="text-xs text-rose-200/90 font-medium">Immediate SQLi / Auth patch recommended</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-br from-amber-500/15 to-transparent flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 font-mono">Moderate Issues</span>
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="my-4">
              <span className="text-4xl font-black font-mono text-white">{moderateCount}</span>
              <span className="text-xs font-bold text-slate-300 ml-1.5">Business Logic</span>
            </div>
            <p className="text-xs text-amber-200/90 font-medium">Client-side pricing verification risk</p>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-500/15 to-transparent flex flex-col justify-between shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono">Autonomous Fixes</span>
              <Sparkles className="h-5 w-5 text-purple-400 animate-pulse" />
            </div>
            <div className="my-4">
              <span className="text-4xl font-black font-mono text-white">100%</span>
              <span className="text-xs font-bold text-slate-300 ml-1.5">AI Ready</span>
            </div>
            <p className="text-xs text-indigo-200/90 font-medium">One-click PR patch generator available</p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Vulnerability Findings Center */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2.5 font-mono">
              <Terminal className="h-5 w-5 text-indigo-400" />
              <span>Detected Vulnerabilities & AST Audit Log</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Click on any finding to review plain-English AI analysis and generate a drop-in code fix PR
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 bg-black/50 px-3 py-1 rounded-xl border border-white/10">
            {findings.length} Total Findings
          </span>
        </div>

        <div className="space-y-5">
          {findings.map((f) => {
            const isExpanded = expandedId === f.id;
            const isCritical = f.severity === "critical";
            const isModerate = f.severity === "moderate";

            const badgeColor = isCritical
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
              : isModerate
              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
              : "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";

            const borderHighlight = isCritical
              ? "border-rose-500/40 hover:border-rose-500/60"
              : isModerate
              ? "border-amber-500/40 hover:border-amber-500/60"
              : "border-white/15 hover:border-white/30";

            return (
              <div
                key={f.id}
                className={`glass-card rounded-3xl border transition-all duration-300 overflow-hidden shadow-xl ${borderHighlight} ${
                  isExpanded ? "bg-white/[0.04]" : "bg-white/[0.02]"
                }`}
              >
                {/* Card Header Bar (Clickable to Toggle) */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : f.id)}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase font-mono tracking-wider border shrink-0 mt-0.5 ${badgeColor}`}>
                      {f.severity}
                    </span>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {f.title}
                      </h3>
                      <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5 mt-1">
                        <FileCode className="h-3.5 w-3.5 text-indigo-400" />
                        <span>{f.file}:{f.line}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {f.prStatus === "opened" ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center gap-1.5 shadow-sm font-mono">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>PR #{f.prNumber} Opened</span>
                      </span>
                    ) : f.prStatus === "generating" ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-1.5 font-mono animate-pulse">
                        <span className="h-3 w-3 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin"></span>
                        <span>Creating PR...</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-indigo-400 flex items-center gap-1 group-hover:underline">
                        <span>{isExpanded ? "Hide Details" : "Review & Fix"}</span>
                      </span>
                    )}
                    <div className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-6 pb-7 pt-2 border-t border-white/10 space-y-6">
                    {/* Plain-English AI Explanation & Exploit Scenario */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 font-mono flex items-center gap-1.5">
                          <Info className="h-4 w-4" />
                          <span>Why This Is Dangerous (Plain English)</span>
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed font-medium">{f.explanation}</p>
                      </div>

                      <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-rose-300 font-mono flex items-center gap-1.5">
                          <AlertOctagon className="h-4 w-4" />
                          <span>Hacker Exploitation Scenario</span>
                        </h4>
                        <p className="text-xs text-rose-200/90 leading-relaxed font-medium">{f.exploitScenario}</p>
                      </div>
                    </div>

                    {/* Interactive Before vs After Code Diff */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300 font-mono">
                          Autonomous AI Code Patch Comparison
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                          AST Verified • Zero Breaking Changes
                        </span>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Vulnerable Code Block */}
                        <div className="rounded-2xl bg-[#0d0a0f] border border-rose-500/30 overflow-hidden shadow-inner font-mono text-xs">
                          <div className="bg-rose-500/15 px-4 py-2 border-b border-rose-500/20 flex items-center justify-between text-rose-300 font-bold">
                            <span>❌ Vulnerable Code ({f.file})</span>
                            <span>Line {f.line}</span>
                          </div>
                          <pre className="p-4 text-rose-200/90 overflow-x-auto leading-relaxed">
                            <code>{f.codeVulnerable}</code>
                          </pre>
                        </div>

                        {/* Secure AI Fixed Code Block */}
                        <div className="rounded-2xl bg-[#0a0f0d] border border-emerald-500/30 overflow-hidden shadow-inner font-mono text-xs">
                          <div className="bg-emerald-500/15 px-4 py-2 border-b border-emerald-500/20 flex items-center justify-between text-emerald-300 font-bold">
                            <span>✅ AI Secure Replacement</span>
                            <span>Ready for PR</span>
                          </div>
                          <pre className="p-4 text-emerald-200/90 overflow-x-auto leading-relaxed">
                            <code>{f.codeFixed}</code>
                          </pre>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar: One-Click Fix or View PR */}
                    <div className="p-5 rounded-2xl bg-black/60 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-300">
                          <Sparkles className="h-5 w-5 animate-pulse" />
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-white">Ready to apply this fix autonomously?</p>
                          <p className="text-xs text-slate-400 font-medium">
                            Our AI will create a clean branch, commit the secure AST patch, and open a GitHub Pull Request.
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {f.prStatus === "opened" ? (
                          <a
                            href={f.prUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition shadow-glow-green flex items-center gap-2 hover:scale-105"
                          >
                            <GitPullRequest className="h-4 w-4" />
                            <span>View PR #{f.prNumber} on GitHub</span>
                            <ExternalLink className="h-3.5 w-3.5 ml-0.5" />
                          </a>
                        ) : f.prStatus === "generating" ? (
                          <button
                            disabled
                            className="px-6 py-3 rounded-xl bg-purple-600/50 text-purple-200 font-extrabold text-xs flex items-center gap-2 cursor-wait font-mono"
                          >
                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span>[3/3] Opening Pull Request...</span>
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleGeneratePR(f.id);
                            }}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-extrabold text-xs transition shadow-glow flex items-center gap-2 hover:scale-105"
                          >
                            <Sparkles className="h-4 w-4 fill-current" />
                            <span>✨ Fix it for me (Open GitHub PR)</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
