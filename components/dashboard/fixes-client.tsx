"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  GitPullRequest,
  GitMerge,
  GitBranch,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Play,
  RefreshCw,
  Code2,
  FileText,
  Sliders,
  Check,
  X,
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Clock,
  Github,
  Zap,
  Lock,
  Eye,
  Server,
  Layers,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface PullRequestItem {
  id: string;
  prNumber: number;
  title: string;
  repo: string;
  branch: string;
  severity: "critical" | "moderate" | "low";
  status: "open" | "testing" | "merged";
  cve: string;
  filePath: string;
  line: number;
  timeAgo: string;
  vulnerableCode: string;
  secureCode: string;
  explanation: string;
  ciPassed: boolean;
}

const INITIAL_PRS: PullRequestItem[] = [
  {
    id: "pr-117",
    prNumber: 117,
    title: "Refactor raw SQL query concatenation to parameterized binding",
    repo: "vibeaudit/saas-core",
    branch: "fix/sqli-checkout-route",
    severity: "critical",
    status: "open",
    cve: "OWASP A03:2021 - Injection",
    filePath: "app/api/checkout/route.ts",
    line: 42,
    timeAgo: "12 mins ago",
    vulnerableCode: `// ❌ VULNERABLE: Direct string interpolation allows SQL injection\nexport async function POST(req: Request) {\n  const { userId } = await req.json();\n  const query = "SELECT * FROM billing_profiles WHERE user_id = '" + userId + "'";\n  const profile = await db.raw(query);\n  return Response.json({ profile });\n}`,
    secureCode: `// ✅ SECURE: Parameterized query binding prevents AST manipulation\nexport async function POST(req: Request) {\n  const { userId } = await req.json();\n  if (typeof userId !== "string" || !userId) {\n    return Response.json({ error: "Invalid user ID" }, { status: 400 });\n  }\n  const query = "SELECT * FROM billing_profiles WHERE user_id = $1";\n  const profile = await db.query(query, [userId]);\n  return Response.json({ profile });\n}`,
    explanation: "Replaced raw string concatenation with PostgreSQL parameterized query ($1 array binding). Added type guard validation to reject non-string payload injections before reaching the database driver.",
    ciPassed: true,
  },
  {
    id: "pr-112",
    prNumber: 112,
    title: "Enforce server-side Stripe price verification in checkout session",
    repo: "vibeaudit/ai-billing-engine",
    branch: "fix/stripe-price-trust",
    severity: "critical",
    status: "open",
    cve: "OWASP A04:2021 - Insecure Design",
    filePath: "lib/stripe/checkout.ts",
    line: 88,
    timeAgo: "1 hour ago",
    vulnerableCode: `// ❌ VULNERABLE: Trusting frontend unit_amount allows $0.01 checkout bypass\nexport async function createCheckoutSession(req: Request) {\n  const body = await req.json();\n  const session = await stripe.checkout.sessions.create({\n    payment_method_types: ['card'],\n    line_items: [{ price_data: { unit_amount: body.amount, currency: 'usd' } }],\n    mode: 'subscription'\n  });\n  return Response.json({ url: session.url });\n}`,
    secureCode: `// ✅ SECURE: Server-side lookup maps plan key to verified Stripe Price ID\nimport { SERVER_PLAN_PRICES } from "@/config/pricing";\n\nexport async function createCheckoutSession(req: Request) {\n  const { planTier } = await req.json();\n  const verifiedPriceId = SERVER_PLAN_PRICES[planTier];\n  if (!verifiedPriceId) throw new Error("Tampered or invalid subscription plan");\n  const session = await stripe.checkout.sessions.create({\n    payment_method_types: ['card'],\n    line_items: [{ price: verifiedPriceId, quantity: 1 }],\n    mode: 'subscription'\n  });\n  return Response.json({ url: session.url });\n}`,
    explanation: "Eliminated client-side price payload acceptance. The checkout session now strictly references an immutable server-side environment dictionary (SERVER_PLAN_PRICES), preventing attackers from altering subscription costs.",
    ciPassed: true,
  },
  {
    id: "pr-108",
    prNumber: 108,
    title: "Implement IP rate limiting and prompt quota guard on LLM endpoint",
    repo: "vibeaudit/nextjs-starter-pro",
    branch: "fix/llm-rate-limit",
    severity: "moderate",
    status: "open",
    cve: "OWASP A05:2021 - Security Misconfiguration",
    filePath: "app/api/ai/generate/route.ts",
    line: 19,
    timeAgo: "3 hours ago",
    vulnerableCode: `// ❌ VULNERABLE: No rate limit or token cap; susceptible to wallet draining\nexport async function POST(req: Request) {\n  const { prompt } = await req.json();\n  const response = await anthropic.messages.create({\n    model: "claude-3-5-sonnet-20241022",\n    messages: [{ role: "user", content: prompt }]\n  });\n  return Response.json(response);\n}`,
    secureCode: `// ✅ SECURE: Upstash Redis sliding window rate limit + token cap enforced\nimport { rateLimit } from "@/lib/redis-guard";\n\nexport async function POST(req: Request) {\n  const ip = req.headers.get("x-forwarded-for") ?? "anon";\n  const { success, limit, reset } = await rateLimit.check(ip, 10, "1 m");\n  if (!success) return Response.json({ error: "Rate limit exceeded" }, { status: 429 });\n  const { prompt } = await req.json();\n  const response = await anthropic.messages.create({\n    model: "claude-3-5-sonnet-20241022",\n    max_tokens: 1024,\n    messages: [{ role: "user", content: prompt.slice(0, 2000) }]\n  });\n  return Response.json(response);\n}`,
    explanation: "Integrated Upstash sliding window rate limiter (10 req/min per IP) and enforced a strict 1,024 max_tokens output ceiling with prompt truncation to prevent denial of wallet and infinite generation loops.",
    ciPassed: true,
  },
  {
    id: "pr-104",
    prNumber: 104,
    title: "Sanitize OAuth redirect URI against open redirect phishing attacks",
    repo: "vibeaudit/crypto-auth-service",
    branch: "fix/oauth-open-redirect",
    severity: "moderate",
    status: "merged",
    cve: "OWASP A01:2021 - Broken Access Control",
    filePath: "app/auth/callback/route.ts",
    line: 55,
    timeAgo: "Yesterday",
    vulnerableCode: `// ❌ VULNERABLE: Unvalidated redirect parameter allows external domain redirect\nconst returnTo = req.nextUrl.searchParams.get("next") || "/dashboard";\nreturn NextResponse.redirect(new URL(returnTo, req.url));`,
    secureCode: `// ✅ SECURE: Whitelisted relative path enforcement prevents open redirect\nconst rawNext = req.nextUrl.searchParams.get("next") || "/dashboard";\nconst safeReturnTo = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";\nreturn NextResponse.redirect(new URL(safeReturnTo, req.url));`,
    explanation: "Enforced relative URL validation by ensuring the target starts with a single slash and rejecting protocol-relative double slash (//evil.com) payloads.",
    ciPassed: true,
  },
];

export function FixesClient() {
  const [prs, setPrs] = useState<PullRequestItem[]>(INITIAL_PRS);
  const [selectedPrId, setSelectedPrId] = useState<string>("pr-117");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "merged">("open");
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "moderate">("all");
  const [isSimulatingCi, setIsSimulatingCi] = useState(false);
  const [ciStep, setCiStep] = useState(0);
  const [isMerging, setIsMerging] = useState(false);
  const [mergeSuccessId, setMergeSuccessId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"diff" | "policy">("diff");

  // Policy toggle states
  const [policyParameterized, setPolicyParameterized] = useState(true);
  const [policyStrictTypes, setPolicyStrictTypes] = useState(true);
  const [policyJsdoc, setPolicyJsdoc] = useState(true);
  const [policyAutoMergeLow, setPolicyAutoMergeLow] = useState(false);

  const selectedPr = prs.find((p) => p.id === selectedPrId) || prs[0];

  const filteredPrs = prs.filter((p) => {
    if (filterStatus !== "all" && p.status !== filterStatus) return false;
    if (filterSeverity !== "all" && p.severity !== filterSeverity) return false;
    return true;
  });

  const handleRunCi = () => {
    if (isSimulatingCi || selectedPr.status === "merged") return;
    setIsSimulatingCi(true);
    setCiStep(1);
    setTimeout(() => setCiStep(2), 900);
    setTimeout(() => setCiStep(3), 1800);
    setTimeout(() => {
      setIsSimulatingCi(false);
      setCiStep(0);
    }, 2800);
  };

  const handleMerge = (id: string) => {
    if (isMerging || mergeSuccessId === id) return;
    setIsMerging(true);
    setTimeout(() => {
      setIsMerging(false);
      setMergeSuccessId(id);
      setPrs((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: "merged" as const } : item))
      );
    }, 1500);
  };

  const openCount = prs.filter((p) => p.status === "open").length;
  const mergedCount = prs.filter((p) => p.status === "merged").length;

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* 1. Header Command Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Autonomous AST Refactoring Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>AI Fix Engine &amp; PR Command</span>
            <span className="text-sm px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
              100% CI/CD Pass Rate
            </span>
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 font-medium max-w-3xl">
            Review, test, and merge AI-generated pull requests in real-time. Our zero-retention AST engine parses code in volatile memory to replace security vulnerabilities with drop-in production patches.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setActiveTab("diff")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs font-mono transition-all ${
              activeTab === "diff"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow"
                : "bg-white/[0.05] text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>PR Diff Inspector</span>
          </button>
          <button
            onClick={() => setActiveTab("policy")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs font-mono transition-all ${
              activeTab === "policy"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow"
                : "bg-white/[0.05] text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            <Sliders className="h-4 w-4" />
            <span>AI Prompt Tuner</span>
          </button>
        </div>
      </div>

      {/* 2. Top KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Open AI PRs", value: `${openCount}`, sub: "Ready for review & merge", icon: GitPullRequest, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
          { label: "Merged Autonomously", value: `${mergedCount + 26}`, sub: "Zero breaking changes", icon: GitMerge, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
          { label: "AST Parse Speed", value: "1.4s", sub: "Volatile AWS Nitro Enclave", icon: Zap, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" },
          { label: "Sandbox CI Accuracy", value: "99.8%", sub: "TypeScript & Jest verified", icon: ShieldCheck, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent space-y-3 shadow-md hover:border-white/25 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-slate-400">{stat.label}</span>
                <div className={`p-2 rounded-xl border ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stat.value}</span>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Main Content: PR Diff Inspector OR Policy Tuner */}
      {activeTab === "diff" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: PR List & Filters (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Filter Tabs */}
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/15">
              {(["open", "merged", "all"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterStatus(tab)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all ${
                    filterStatus === tab
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab} {tab === "open" && `(${openCount})`}
                </button>
              ))}
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-2 px-1">
              <span className="text-[11px] font-bold text-slate-400 font-mono uppercase">Severity:</span>
              {(["all", "critical", "moderate"] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono uppercase transition-all ${
                    filterSeverity === sev
                      ? "bg-white/15 text-white border border-white/20"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>

            {/* PR Cards List */}
            <div className="space-y-3">
              {filteredPrs.map((pr) => {
                const isSelected = pr.id === selectedPrId;
                return (
                  <motion.div
                    key={pr.id}
                    onClick={() => setSelectedPrId(pr.id)}
                    whileHover={{ scale: 1.01 }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent border-indigo-500/60 shadow-glow"
                        : "bg-white/[0.03] hover:bg-white/[0.06] border-white/10"
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500" />
                    )}

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-black font-mono text-indigo-400 flex items-center gap-1.5">
                        <GitPullRequest className="h-3.5 w-3.5" />
                        <span>#{pr.prNumber}</span>
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md font-mono uppercase border ${
                          pr.severity === "critical"
                            ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                            : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {pr.severity}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug mb-3 line-clamp-2">{pr.title}</h4>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-2 border-t border-white/10">
                      <span className="truncate max-w-[180px]">{pr.repo}</span>
                      <span className={`font-bold ${pr.status === "merged" ? "text-emerald-400" : "text-amber-400"}`}>
                        {pr.status === "merged" ? "✔ MERGED" : "● OPEN"}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Side-by-Side Diff Inspector & Merge Command (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/20 bg-[#0d0a14]/95 shadow-2xl space-y-6">
              {/* PR Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/15">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <span className="text-indigo-300 font-bold">{selectedPr.repo}</span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <GitBranch className="h-3.5 w-3.5 text-indigo-400" />
                      {selectedPr.branch}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white leading-tight">{selectedPr.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs pt-1 font-mono">
                    <span className="text-rose-400 font-bold">{selectedPr.cve}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-300">{selectedPr.filePath}:{selectedPr.line}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-400">{selectedPr.timeAgo}</span>
                  </div>
                </div>

                {/* Action Buttons: Run CI or Merge */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={handleRunCi}
                    disabled={isSimulatingCi || selectedPr.status === "merged"}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-xs font-bold text-slate-200 transition flex items-center gap-2 shadow-sm"
                    title="Simulate Sandboxed CI Verification"
                  >
                    <Terminal className={`h-4 w-4 ${isSimulatingCi ? "text-indigo-400 animate-spin" : "text-slate-400"}`} />
                    <span>{isSimulatingCi ? "Running CI..." : "Verify in Sandbox"}</span>
                  </button>

                  <motion.button
                    onClick={() => handleMerge(selectedPr.id)}
                    disabled={isMerging || selectedPr.status === "merged" || mergeSuccessId === selectedPr.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`px-6 py-2.5 rounded-xl text-xs font-black font-mono transition flex items-center gap-2 shadow-glow ${
                      selectedPr.status === "merged" || mergeSuccessId === selectedPr.id
                        ? "bg-emerald-500 text-black cursor-default"
                        : isMerging
                        ? "bg-indigo-500/50 text-indigo-200 cursor-wait animate-pulse"
                        : "bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 text-white"
                    }`}
                  >
                    {selectedPr.status === "merged" || mergeSuccessId === selectedPr.id ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>✔ MERGED TO MAIN</span>
                      </>
                    ) : isMerging ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>MERGING PR...</span>
                      </>
                    ) : (
                      <>
                        <GitMerge className="h-4 w-4" />
                        <span>⚡ MERGE PR TO GITHUB</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Sandboxed CI Simulation Terminal Overlay */}
              <AnimatePresence>
                {isSimulatingCi && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-5 rounded-2xl bg-black/90 border border-indigo-500/40 font-mono text-xs space-y-2 text-indigo-300 shadow-inner"
                  >
                    <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-2 mb-2">
                      <span className="flex items-center gap-2 font-bold text-white">
                        <Server className="h-4 w-4 text-indigo-400" />
                        <span>EPHEMERAL AWS NITRO ENCLAVE (SANDBOX CI)</span>
                      </span>
                      <span>STEP {ciStep}/3</span>
                    </div>
                    {ciStep >= 1 && (
                      <p className="text-slate-300">
                        &gt; Spawning isolated Docker container (Node 20.x, TypeScript 5.4)... <span className="text-emerald-400 font-bold">✔ DONE</span>
                      </p>
                    )}
                    {ciStep >= 2 && (
                      <p className="text-slate-300">
                        &gt; Applying AST refactoring patch &amp; checking type checking... <span className="text-emerald-400 font-bold">✔ ZERO TYPE ERRORS</span>
                      </p>
                    )}
                    {ciStep >= 3 && (
                      <p className="text-emerald-400 font-bold">
                        &gt; Running Jest &amp; Playwright security suite... ✔ 48/48 TESTS PASSED (0.84s)! PR IS READY FOR MERGE.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI Explanation Banner */}
              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="text-white font-bold text-xs font-mono block uppercase tracking-wider">
                    AST Refactoring Rationale &amp; Security Shield
                  </strong>
                  <p className="text-xs text-indigo-100/90 leading-relaxed font-medium">
                    {selectedPr.explanation}
                  </p>
                </div>
              </div>

              {/* Side-by-Side Diff Viewer */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <X className="h-4 w-4" />
                    <span>VULNERABLE AI-GENERATED CODE</span>
                  </span>
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    <span>VIBEAUDIT PARAMETERIZED AST REPLACEMENT</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                  {/* Vulnerable Code */}
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 overflow-x-auto relative group">
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase">
                      Before
                    </div>
                    <pre className="text-rose-200/90 leading-relaxed pt-3">
                      <code>{selectedPr.vulnerableCode}</code>
                    </pre>
                  </div>

                  {/* Secure Code */}
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 overflow-x-auto relative group shadow-glow-green">
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                      After (PR Patch)
                    </div>
                    <pre className="text-emerald-200/90 leading-relaxed pt-3">
                      <code>{selectedPr.secureCode}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Bottom Verification Footer */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <span>Verified against OWASP Top 10 &amp; SOC2 Type II guidelines</span>
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-400" />
                  <span>Zero code retained on VibeAudit disk servers</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* AI Prompt Tuner & Refactoring Policy Panel */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto glass-card rounded-3xl p-8 md:p-12 border border-white/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent space-y-8 shadow-2xl"
        >
          <div className="space-y-2">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              Custom AI Engineering Policy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Tune How Our AI Generates Pull Requests</h2>
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              Configure strict architectural rules for our AST refactoring engine. These rules are injected into every ephemeral scan session across your repositories.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                title: "Enforce Parameterized SQL & ORM Bindings",
                desc: "Never allow raw string interpolation in database queries. Automatically convert strings to Prisma, Drizzle, or raw PostgreSQL parameterized array bindings ($1, $2).",
                state: policyParameterized,
                setter: setPolicyParameterized,
              },
              {
                title: "Strict TypeScript Type Guards",
                desc: "Reject any AI patches that introduce 'any' types or ignore TypeScript compiler flags. Enforce runtime type validation (Zod/Valibot) on all external JSON payloads.",
                state: policyStrictTypes,
                setter: setPolicyStrictTypes,
              },
              {
                title: "Inject OWASP Security JSDoc Comments",
                desc: "Automatically add detailed JSDoc documentation headers above refactored functions explaining which CVE or security vulnerability was remediated for future team audits.",
                state: policyJsdoc,
                setter: setPolicyJsdoc,
              },
              {
                title: "Autonomous Low-Severity PR Merging",
                desc: "Automatically merge low-severity linting and non-breaking dependency patches directly into staging branches without requiring manual engineer review.",
                state: policyAutoMergeLow,
                setter: setPolicyAutoMergeLow,
              },
            ].map((policy, idx) => (
              <div
                key={idx}
                onClick={() => policy.setter(!policy.state)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-6 ${
                  policy.state
                    ? "bg-indigo-500/10 border-indigo-500/50 shadow-md"
                    : "bg-white/[0.03] border-white/10 hover:border-white/20"
                }`}
              >
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{policy.title}</span>
                    {policy.state && <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold uppercase border border-indigo-500/30">Active</span>}
                  </h4>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{policy.desc}</p>
                </div>

                <div
                  className={`w-12 h-7 rounded-full transition-colors relative shrink-0 p-1 ${
                    policy.state ? "bg-gradient-to-r from-indigo-500 to-purple-600" : "bg-white/20"
                  }`}
                >
                  <motion.div
                    animate={{ x: policy.state ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-5 h-5 rounded-full bg-white shadow-md"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400 font-mono">Policy rules sync instantly with your GitHub App installation.</span>
            <button
              onClick={() => alert("AI Engineering Policy saved successfully across all connected repositories!")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 text-white font-black text-xs font-mono shadow-glow hover:opacity-95 transition"
            >
              <span>⚡ Save Policy Configuration</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
