"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Flame,
  Swords,
  Terminal,
  FileText,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Eye,
  Activity,
  Sparkles,
  Check,
  Code2,
  Bug,
  Server,
  Award,
} from "lucide-react";

interface AttackVector {
  id: string;
  code: string;
  title: string;
  category: "LLM & AI Attacks" | "API & Auth Attacks" | "Injection & Denial";
  redTeamAttack: string;
  blueTeamDefense: string;
  latencyMs: number;
  status: "blocked" | "neutralized" | "sanitized";
  timestamp: string;
  repoTarget: string;
}

const INITIAL_ATTACKS: AttackVector[] = [
  {
    id: "atk-1",
    code: "OWASP API8:2023",
    title: "JWT Signature Forgery & Privilege Escalation Attempt",
    category: "API & Auth Attacks",
    redTeamAttack: "VibeStriker AI injected an algorithm-none JWT payload targeting admin billing endpoints in app/api/checkout.",
    blueTeamDefense: "VibeShield AI intercepted token at Nitro Enclave boundary; enforced strict RSA-4096 signature verification & banned IP.",
    latencyMs: 0.8,
    status: "blocked",
    timestamp: "12 secs ago",
    repoTarget: "vibeaudit/saas-core",
  },
  {
    id: "atk-2",
    code: "LLM01:2025",
    title: "System Prompt Injection via RAG Vector Embedding",
    category: "LLM & AI Attacks",
    redTeamAttack: "Simulated adversary embedded instructions inside user document to override AI assistant security guardrails.",
    blueTeamDefense: "AST NLP Sanitizer detected adversarial tokens; stripped malicious override strings before hitting Claude 3.5 Sonnet API.",
    latencyMs: 0.5,
    status: "sanitized",
    timestamp: "45 secs ago",
    repoTarget: "llm-gateway-proxy",
  },
  {
    id: "atk-3",
    code: "CVE-2026-8821",
    title: "GraphQL Introspection & Recursive Query Overload",
    category: "Injection & Denial",
    redTeamAttack: "VibeStriker AI launched a 50,000-depth nested GraphQL query to induce memory exhaustion and denial of service.",
    blueTeamDefense: "Upstash Redis Token Bucket Rate Limiter (50 req/sec) & AST Query Depth Limiter (max depth: 10) neutralized attack.",
    latencyMs: 1.2,
    status: "neutralized",
    timestamp: "2 mins ago",
    repoTarget: "ai-billing-engine",
  },
  {
    id: "atk-4",
    code: "OWASP A03:2021",
    title: "SQL Injection via Stripe Webhook Metadata Parameter",
    category: "Injection & Denial",
    redTeamAttack: "Adversary attempted SQL union injection inside webhook event payload metadata.",
    blueTeamDefense: "Autonomous PR #117 parameterized array binding ($1) prevented query manipulation; query executed safely in RAM.",
    latencyMs: 0.4,
    status: "blocked",
    timestamp: "5 mins ago",
    repoTarget: "crypto-auth-service",
  },
  {
    id: "atk-5",
    code: "LLM02:2025",
    title: "Insecure LLM Output Handling & DOM XSS Execution",
    category: "LLM & AI Attacks",
    redTeamAttack: "Attempted to force LLM generation of malicious <script> tag to execute DOM cross-site scripting on admin dashboard.",
    blueTeamDefense: "VibeShield DOM Sanitizer & strict Content Security Policy (CSP) headers neutralized script tags in volatile memory.",
    latencyMs: 0.7,
    status: "sanitized",
    timestamp: "12 mins ago",
    repoTarget: "vibeaudit/saas-core",
  },
  {
    id: "atk-6",
    code: "OWASP API1:2023",
    title: "Broken Object Level Authorization (IDOR) on /api/user/[id]",
    category: "API & Auth Attacks",
    redTeamAttack: "Fuzzed user ID parameters in API request headers to access unauthorized organization billing profiles.",
    blueTeamDefense: "RBAC Enforcer validated session JWT against Supabase Row-Level Security (RLS) policies; access denied with 403 Forbidden.",
    latencyMs: 0.9,
    status: "blocked",
    timestamp: "18 mins ago",
    repoTarget: "ai-billing-engine",
  },
];

export function RedTeamClient() {
  const [attacks, setAttacks] = useState<AttackVector[]>(INITIAL_ATTACKS);
  const [activeTab, setActiveTab] = useState<"ALL" | "LLM & AI Attacks" | "API & Auth Attacks" | "Injection & Denial">("ALL");
  const [isSimulatingPenTest, setIsSimulatingPenTest] = useState(false);
  const [penTestStep, setPenTestStep] = useState(0);
  const [penTestCompleted, setPenTestCompleted] = useState(false);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const [certGenerated, setCertGenerated] = useState(false);
  const [selectedAttackModal, setSelectedAttackModal] = useState<AttackVector | null>(null);

  const filteredAttacks = attacks.filter((a) => activeTab === "ALL" || a.category === activeTab);

  const handleLaunchPenTest = () => {
    if (isSimulatingPenTest || penTestCompleted) {
      if (penTestCompleted) {
        setPenTestCompleted(false);
        setCertGenerated(false);
        setPenTestStep(0);
      }
      return;
    }
    setIsSimulatingPenTest(true);
    setPenTestStep(1);
    setTimeout(() => setPenTestStep(2), 1200);
    setTimeout(() => setPenTestStep(3), 2400);
    setTimeout(() => setPenTestStep(4), 3600);
    setTimeout(() => {
      setIsSimulatingPenTest(false);
      setPenTestCompleted(true);
      setPenTestStep(0);
    }, 4800);
  };

  const handleGenerateCert = () => {
    if (isGeneratingCert || certGenerated) return;
    setIsGeneratingCert(true);
    setTimeout(() => {
      setIsGeneratingCert(false);
      setCertGenerated(true);
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto font-sans relative">
      {/* 1. Header Command Bar */}
      <div className="border-b border-white/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            <Swords className="h-3.5 w-3.5 text-red-400 animate-bounce" />
            <span>Autonomous Cyber Defense Grid &amp; Pen-Test Arena</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Red Team Arena</span>
            <span className="text-xs px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
              ● 100% Defended (0.8ms Latency)
            </span>
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 font-medium max-w-3xl">
            Live autonomous battleground where VibeStriker AI (Red Team) launches continuous penetration attacks while VibeShield AI (Blue Team) neutralizes zero-day threats in volatile RAM.
          </p>
        </div>

        {/* Action Button: Launch Pen Test */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={handleLaunchPenTest}
            disabled={isSimulatingPenTest}
            className={`px-6 py-3 rounded-xl text-xs font-black font-mono transition flex items-center gap-2 shadow-glow ${
              penTestCompleted
                ? "bg-emerald-500 hover:bg-emerald-600 text-black"
                : isSimulatingPenTest
                ? "bg-red-500/50 text-red-200 cursor-wait animate-pulse"
                : "bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white"
            }`}
          >
            {isSimulatingPenTest ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>PEN-TEST IN PROGRESS...</span>
              </>
            ) : penTestCompleted ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>✔ Pen-Test Passed! (Reset)</span>
              </>
            ) : (
              <>
                <Flame className="h-4 w-4" />
                <span>⚡ Launch 1,000+ Vector Pen-Test</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Pen-Test Simulation Terminal Banner */}
      <AnimatePresence>
        {(isSimulatingPenTest || penTestCompleted) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl transition-all ${
              penTestCompleted
                ? "bg-gradient-to-r from-emerald-500/20 via-indigo-500/10 to-transparent border-emerald-500/50"
                : "bg-black/95 border-red-500/50 font-mono"
            }`}
          >
            <div className="flex items-start gap-4 w-full">
              <div
                className={`p-3 rounded-2xl border shrink-0 ${
                  penTestCompleted ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}
              >
                {penTestCompleted ? <Award className="h-6 w-6" /> : <Terminal className="h-6 w-6 animate-pulse" />}
              </div>
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base font-black text-white font-mono">
                    {penTestCompleted
                      ? "✔ Autonomous Penetration Test Completed Successfully"
                      : `⚡ AUTONOMOUS PEN-TEST IN PROGRESS — STAGE ${penTestStep}/4`}
                  </h3>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                      penTestCompleted ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300 animate-pulse"
                    }`}
                  >
                    {penTestCompleted ? "0 Exploitable Vulnerabilities" : "1,420 Attack Vectors Active"}
                  </span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed font-mono">
                  {penTestStep === 1 && "&gt; [Stage 1/4] Fuzzing API endpoints & testing JWT algorithm-none signature bypass across 4 repositories... ✔ BLOCKED (0.8ms)"}
                  {penTestStep === 2 && "&gt; [Stage 2/4] Injecting adversarial prompt overrides into RAG vector embeddings & LLM system instructions... ✔ SANITIZED (0.5ms)"}
                  {penTestStep === 3 && "&gt; [Stage 3/4] Executing recursive GraphQL introspection queries & SQL union injection payloads... ✔ NEUTRALIZED (1.1ms)"}
                  {penTestStep === 4 && "&gt; [Stage 4/4] Verifying zero-retention AWS Nitro RAM Enclave boundaries against memory dump attempts... ✔ 100% SECURE"}
                  {penTestCompleted && "All 1,420 simulated attack vectors were autonomously intercepted by VibeShield AI. Your SaaS fleet complies with SOC2 Type II and ISO 27001 penetration testing standards."}
                </div>
              </div>
            </div>

            {penTestCompleted && (
              <button
                onClick={handleGenerateCert}
                disabled={isGeneratingCert || certGenerated}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs font-mono uppercase tracking-wider shadow-glow transition shrink-0 flex items-center gap-2"
              >
                {certGenerated ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>✔ PEN-TEST CERTIFICATE READY</span>
                  </>
                ) : isGeneratingCert ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>GENERATING CERTIFICATE...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>📄 Download Pen-Test Certificate</span>
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Top KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Simulated Attacks", value: "1,420 Vectors", sub: "SQLi, SSRF, IDOR, LLM01", icon: Swords, color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
          { label: "Defense Success Rate", value: "100% Blocked", sub: "Zero-Retention RAM Enclave", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
          { label: "Mean Time To Detect", value: "0.4ms", sub: "Real-Time AST Firewall", icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
          { label: "Pen-Test Certification", value: "Verified", sub: "Auditor & Insurance Ready", icon: Award, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" },
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

      {/* 4. Attack Vector & Defense Feed Table */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/15 space-y-6 shadow-xl bg-[#0a0812]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(["ALL", "LLM & AI Attacks", "API & Auth Attacks", "Injection & Denial"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all shrink-0 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-red-600 to-indigo-600 text-white shadow-glow"
                    : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {tab === "ALL" ? "All Cyber Battles (6)" : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <span>VibeStriker vs. VibeShield Live Arena</span>
          </div>
        </div>

        {/* Battle Cards Grid */}
        <div className="space-y-4">
          {filteredAttacks.map((atk) => (
            <motion.div
              key={atk.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.005 }}
              className="p-6 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 hover:border-white/25 transition space-y-4 shadow-inner relative overflow-hidden group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-red-500 via-purple-500 to-indigo-500" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 font-mono text-xs font-extrabold border border-red-500/30 flex items-center gap-1.5">
                    <Bug className="h-3.5 w-3.5" />
                    <span>{atk.code}</span>
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white">{atk.title}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {atk.category}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase border flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                  >
                    <Check className="h-3 w-3" />
                    <span>🛡️ {atk.status.toUpperCase()} IN {atk.latencyMs}ms</span>
                  </span>

                  <button
                    onClick={() => setSelectedAttackModal(atk)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono transition flex items-center gap-1.5"
                    title="Inspect Battle Log"
                  >
                    <Eye className="h-3 w-3 text-indigo-400" />
                    <span>Battle Log</span>
                  </button>
                </div>
              </div>

              {/* Red Team vs Blue Team Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="p-4 rounded-xl bg-red-500/[0.05] border border-red-500/20 space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-red-400 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span>🔴 Red Team Agent (VibeStriker v4)</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed">{atk.redTeamAttack}</p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-500/[0.05] border border-indigo-500/20 space-y-1.5">
                  <span className="text-[11px] font-mono font-bold text-indigo-300 uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                    <span>🔵 Blue Team Agent (VibeShield v4)</span>
                  </span>
                  <p className="text-slate-200 leading-relaxed font-semibold">{atk.blueTeamDefense}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
                <span>Target Repository: <strong className="text-indigo-400">{atk.repoTarget}</strong></span>
                <span>Simulated {atk.timestamp} &bull; Nitro Enclave Boundary Verified ✔</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Battle Log Modal */}
      <AnimatePresence>
        {selectedAttackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full glass-card rounded-3xl p-8 border border-white/20 bg-[#0d0a14] space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <h3 className="text-lg font-black text-white flex items-center gap-2 font-mono">
                  <Swords className="h-5 w-5 text-red-400" />
                  <span>Autonomous Battle Log ({selectedAttackModal.code})</span>
                </h3>
                <button
                  onClick={() => setSelectedAttackModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 uppercase block mb-1">Attack Vector Specification</span>
                  <p className="text-sm font-bold text-white">{selectedAttackModal.title}</p>
                </div>

                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-1">
                  <strong className="block text-red-400 uppercase text-[11px]">🔴 Red Team Execution Payload:</strong>
                  <p>{selectedAttackModal.redTeamAttack}</p>
                  <code className="block mt-2 p-2 rounded bg-black/80 text-red-200 text-[10px]">
                    POST /api/v1/auth/verify HTTP/1.1<br />
                    Authorization: Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0...
                  </code>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                  <strong className="block text-emerald-400 uppercase text-[11px]">🔵 Blue Team Nitro Enclave Interception:</strong>
                  <p>{selectedAttackModal.blueTeamDefense}</p>
                  <code className="block mt-2 p-2 rounded bg-black/80 text-emerald-200 text-[10px]">
                    [NITRO ENCLAVE FIREWALL] Intercepted in {selectedAttackModal.latencyMs}ms.<br />
                    Result: 403 Forbidden | Signature verification mismatch | IP flagged.
                  </code>
                </div>

                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-2 border-t border-white/10">
                  <span>Target: {selectedAttackModal.repoTarget}</span>
                  <span>Status: 100% Neutralized ✔</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedAttackModal(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 via-purple-600 to-indigo-600 text-white font-black text-xs font-mono uppercase tracking-wider shadow-glow"
              >
                Close Battle Telemetry
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
