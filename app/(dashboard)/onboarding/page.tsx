"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Lock,
  Terminal,
  GitPullRequest,
  Zap,
  Key,
  Server,
  Activity,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Check,
  Webhook,
  Radio,
  FolderGit2,
} from "lucide-react";
import Link from "next/link";

interface RepoItem {
  id: string;
  name: string;
  lang: string;
  loc: string;
  branch: string;
  selected: boolean;
}

interface WebhookEvent {
  id: string;
  event: string;
  repo: string;
  sender: string;
  action: string;
  timestamp: string;
  status: "200 OK" | "Processing";
}

const INITIAL_REPOS: RepoItem[] = [
  { id: "repo-1", name: "vibeaudit/saas-core", lang: "Next.js 15 • TS", loc: "142k LOC", branch: "main", selected: true },
  { id: "repo-2", name: "ai-billing-engine", lang: "Go 1.22 • gRPC", loc: "45k LOC", branch: "production", selected: true },
  { id: "repo-3", name: "crypto-auth-service", lang: "Rust • WebAuthn", loc: "28k LOC", branch: "main", selected: true },
  { id: "repo-4", name: "llm-gateway-proxy", lang: "Cloudflare Workers", loc: "12k LOC", branch: "main", selected: false },
  { id: "repo-5", name: "siem-datadog-streamer", lang: "Python • Fastify", loc: "18k LOC", branch: "main", selected: false },
];

const INITIAL_WEBHOOKS: WebhookEvent[] = [
  { id: "wh-1", event: "push", repo: "vibeaudit/saas-core", sender: "@sarah-dev", action: "Commit a9b8c7: Fix JWT validation", timestamp: "14 secs ago", status: "200 OK" },
  { id: "wh-2", event: "pull_request.opened", repo: "ai-billing-engine", sender: "@alex-eng", action: "PR #142: Add Stripe rate limiter", timestamp: "1 min ago", status: "200 OK" },
  { id: "wh-3", event: "check_suite.requested", repo: "crypto-auth-service", sender: "github-actions[bot]", action: "Nitro Enclave RAM Sandbox initialized", timestamp: "3 mins ago", status: "200 OK" },
];

export default function OnboardingPage() {
  const [installMethod, setInstallMethod] = useState<"app" | "oauth" | "pat">("app");
  const [scopeType, setScopeType] = useState<"all" | "selected">("selected");
  const [repos, setRepos] = useState<RepoItem[]>(INITIAL_REPOS);
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>(INITIAL_WEBHOOKS);
  
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  const handleToggleRepo = (id: string) => {
    setRepos((prev) => prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)));
  };

  const handleStartHandshake = () => {
    if (isHandshaking || isConnected) {
      if (isConnected) {
        setIsConnected(false);
        setHandshakeStep(0);
        setPingSuccess(false);
      }
      return;
    }
    setIsHandshaking(true);
    setHandshakeStep(1);
    setTimeout(() => setHandshakeStep(2), 1100);
    setTimeout(() => setHandshakeStep(3), 2200);
    setTimeout(() => setHandshakeStep(4), 3300);
    setTimeout(() => {
      setIsHandshaking(false);
      setIsConnected(true);
      setHandshakeStep(0);
      // Add a fresh webhook event
      setWebhooks((prev) => [
        {
          id: `wh-${Date.now()}`,
          event: "installation.created",
          repo: "4 Repositories Synced",
          sender: "api.github.com",
          action: "VibeAudit GitHub App v2.4 Authorize Handshake",
          timestamp: "Just now",
          status: "200 OK",
        },
        ...prev,
      ]);
    }, 4500);
  };

  const handlePingWebhook = () => {
    if (isPinging) return;
    setIsPinging(true);
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
      setWebhooks((prev) => [
        {
          id: `wh-${Date.now()}`,
          event: "ping",
          repo: "vibeaudit/saas-core",
          sender: "VibeAudit Webhook Tester",
          action: "HMAC SHA-256 Signature verification test",
          timestamp: "Just now",
          status: "200 OK",
        },
        ...prev,
      ]);
      setTimeout(() => setPingSuccess(false), 3000);
    }, 1200);
  };

  const selectedCount = scopeType === "all" ? repos.length : repos.filter((r) => r.selected).length;

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto font-sans relative">
      {/* 1. Header Command Bar */}
      <div className="border-b border-white/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            <Github className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span>Enterprise GitHub App Onboarding &amp; Webhook Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>GitHub App Connect</span>
            <span className="text-xs px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
              ● Zero-Retention RAM Enclave
            </span>
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 font-medium max-w-3xl">
            Configure your B2B customer GitHub App installation, select repository inspection scopes, and monitor real-time CI/CD webhook telemetry with HMAC SHA-256 verification.
          </p>
        </div>

        {/* Action Button: Authorize Handshake */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleStartHandshake}
            disabled={isHandshaking}
            className={`px-6 py-3.5 rounded-2xl text-xs font-black font-mono transition flex items-center gap-2 shadow-glow ${
              isConnected
                ? "bg-emerald-500 hover:bg-emerald-600 text-black"
                : isHandshaking
                ? "bg-purple-500/50 text-purple-200 cursor-wait animate-pulse"
                : "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white"
            }`}
          >
            {isHandshaking ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>HANDSHAKE IN PROGRESS...</span>
              </>
            ) : isConnected ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>✔ GitHub App Active (Reset)</span>
              </>
            ) : (
              <>
                <Github className="h-4 w-4" />
                <span>⚡ Authorize &amp; Install GitHub App</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Handshake Terminal Banner */}
      <AnimatePresence>
        {(isHandshaking || isConnected) && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl transition-all ${
              isConnected
                ? "bg-gradient-to-r from-emerald-500/20 via-indigo-500/10 to-transparent border-emerald-500/50"
                : "bg-black/95 border-indigo-500/50 font-mono"
            }`}
          >
            <div className="flex items-start gap-4 w-full">
              <div
                className={`p-3 rounded-2xl border shrink-0 ${
                  isConnected ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
                }`}
              >
                {isConnected ? <Webhook className="h-6 w-6" /> : <Terminal className="h-6 w-6 animate-pulse" />}
              </div>
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base font-black text-white font-mono">
                    {isConnected
                      ? "✔ VibeAudit GitHub App Installed & Webhooks Registered"
                      : `⚡ OAUTH & WEBHOOK HANDSHAKE IN PROGRESS — STEP ${handshakeStep}/4`}
                  </h3>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                      isConnected ? "bg-emerald-500/20 text-emerald-300" : "bg-indigo-500/20 text-indigo-300 animate-pulse"
                    }`}
                  >
                    {isConnected ? "HMAC SHA-256 Verified" : "api.github.com"}
                  </span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed font-mono">
                  {handshakeStep === 1 && "&gt; [Step 1/4] Requesting OAuth installation token from api.github.com/app/installations/449102... ✔ OK"}
                  {handshakeStep === 2 && "&gt; [Step 2/4] Verifying read-only code access & write permissions for pull_requests & commit_status... ✔ VERIFIED"}
                  {handshakeStep === 3 && "&gt; [Step 3/4] Registering webhook endpoint https://api.vibeaudit.ai/webhooks/github with HMAC SHA-256 secret... ✔ REGISTERED"}
                  {handshakeStep === 4 && `&gt; [Step 4/4] Syncing ${selectedCount} selected repositories into AWS Nitro RAM Enclave sandboxes... ✔ COMPLETED`}
                  {isConnected && `Successfully synced ${selectedCount} production repositories. Continuous background security monitoring and automated PR fix generation are now active.`}
                </div>
              </div>
            </div>

            {isConnected && (
              <button
                onClick={handlePingWebhook}
                disabled={isPinging}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs font-mono uppercase tracking-wider shadow-glow transition shrink-0 flex items-center gap-2"
              >
                {isPinging ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>PINGING WEBHOOK...</span>
                  </>
                ) : pingSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>✔ PING 200 OK!</span>
                  </>
                ) : (
                  <>
                    <Radio className="h-4 w-4" />
                    <span>⚡ Test Webhook Delivery (Ping)</span>
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Method Switcher & Permission Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Installation Method & Repos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Method Tabs */}
          <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-6 shadow-xl bg-[#0a0812]/90">
            <h3 className="text-sm font-mono uppercase font-bold text-slate-400 flex items-center gap-2">
              <FolderGit2 className="h-4 w-4 text-indigo-400" />
              <span>1. Choose B2B Customer Connection Method</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "app" as const, title: "Official GitHub App", sub: "Recommended for Teams", icon: Github, badge: "Best Practice", desc: "Fine-grained read-only code access, automated PR fixes & real-time webhooks." },
                { id: "oauth" as const, title: "GitHub OAuth Login", sub: "Quick Developer Connect", icon: Zap, badge: "Fastest", desc: "Connect personal workspace or public repos with 1-click login." },
                { id: "pat" as const, title: "Enterprise PAT / SSH", sub: "On-Premise / Self-Hosted", icon: Key, badge: "Air-Gapped", desc: "For self-hosted GitHub Enterprise, GitLab, or Bitbucket servers." },
              ].map((m) => {
                const Icon = m.icon;
                const active = installMethod === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setInstallMethod(m.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition space-y-3 relative ${
                      active
                        ? "bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent border-indigo-500 shadow-glow"
                        : "bg-white/[0.02] hover:bg-white/[0.05] border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-xl ${active ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-400"}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${active ? "bg-indigo-500/30 text-indigo-200 border border-indigo-500/40" : "bg-white/10 text-slate-400"}`}>
                        {m.badge}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{m.title}</h4>
                      <span className="text-[11px] text-indigo-400 font-mono font-semibold block">{m.sub}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{m.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Repository Scope Selection */}
          <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-6 shadow-xl bg-[#0a0812]/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <h3 className="text-sm font-mono uppercase font-bold text-slate-400 flex items-center gap-2">
                <GitPullRequest className="h-4 w-4 text-purple-400" />
                <span>2. Select Repository Scope ({selectedCount} Selected)</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScopeType("selected")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    scopeType === "selected" ? "bg-indigo-500 text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  Select Specific Repos
                </button>
                <button
                  onClick={() => setScopeType("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    scopeType === "all" ? "bg-indigo-500 text-white shadow-sm" : "bg-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  All Repositories (5)
                </button>
              </div>
            </div>

            {/* Repo List */}
            <div className="space-y-3">
              {repos.map((r) => {
                const checked = scopeType === "all" || r.selected;
                return (
                  <div
                    key={r.id}
                    onClick={() => scopeType === "selected" && handleToggleRepo(r.id)}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition cursor-pointer ${
                      checked
                        ? "bg-indigo-500/[0.07] border-indigo-500/40"
                        : "bg-black/40 hover:bg-black/60 border-white/10 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          checked ? "bg-indigo-500 border-indigo-400 text-white" : "border-white/20 bg-black/60"
                        }`}
                      >
                        {checked && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                          <span>{r.name}</span>
                          <span className="text-[10px] px-2 py-0.2 rounded bg-purple-500/20 text-purple-300 font-normal">
                            {r.branch}
                          </span>
                        </h4>
                        <span className="text-xs text-slate-400 font-medium">{r.lang} &bull; {r.loc}</span>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-emerald-400 font-bold hidden sm:inline">
                      ✔ Enclave Ready
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Col: Permissions & Security Guarantee */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-5 shadow-xl bg-gradient-to-br from-[#0a0812] via-[#110d1e] to-[#0a0812]">
            <h3 className="text-sm font-mono uppercase font-bold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>3. Customer Security Guarantee</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                <span className="font-bold text-emerald-300 font-mono uppercase block flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Zero-Retention RAM Processing</span>
                </span>
                <p className="text-slate-300 leading-relaxed font-medium">
                  Source code is never persisted to disk or stored in any database. Files are processed in volatile AWS Nitro RAM Enclaves and destroyed immediately after AST analysis.
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <span className="text-slate-400 font-mono uppercase font-bold text-[11px] block">Requested GitHub Permissions:</span>
                {[
                  { title: "Repository Contents", access: "READ-ONLY", color: "text-emerald-400 bg-emerald-500/20 border-emerald-500/30", desc: "To scan AST nodes for SQLi, XSS, and auth bugs." },
                  { title: "Pull Requests", access: "READ & WRITE", color: "text-indigo-300 bg-indigo-500/20 border-indigo-500/30", desc: "To autonomously open 1-click security patch PRs." },
                  { title: "Commit Status & Checks", access: "READ & WRITE", color: "text-purple-300 bg-purple-500/20 border-purple-500/30", desc: "To display real-time CI/CD security badges." },
                  { title: "Admin & Repo Deletion", access: "NO ACCESS", color: "text-red-300 bg-red-500/20 border-red-500/30", desc: "0% administrative or destructive permissions." },
                ].map((perm, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white font-mono">{perm.title}</span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${perm.color}`}>
                        {perm.access}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">{perm.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartHandshake}
              disabled={isHandshaking}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white font-black text-xs font-mono uppercase tracking-wider shadow-glow transition flex items-center justify-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span>⚡ Install GitHub App Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Real-Time Webhook Telemetry Stream */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/15 space-y-6 shadow-xl bg-[#0a0812]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-black text-white font-mono flex items-center gap-2">
              <Webhook className="h-5 w-5 text-indigo-400" />
              <span>Real-Time Webhook Telemetry Stream</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">
              Live event feed from GitHub Webhooks (`https://api.vibeaudit.ai/webhooks/github`) authenticated via HMAC SHA-256 signatures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Listening on Port 443</span>
            </span>
          </div>
        </div>

        {/* Webhooks Feed List */}
        <div className="space-y-3">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className="p-4 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs hover:border-white/20 transition"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white px-2 py-0.5 rounded bg-white/10 text-[11px]">
                      {wh.event}
                    </span>
                    <span className="text-indigo-300 font-bold">{wh.repo}</span>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-400">{wh.sender}</span>
                  </div>
                  <p className="text-slate-300 mt-1 font-medium">{wh.action}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  ✔ {wh.status}
                </span>
                <span className="text-slate-500 text-[11px]">{wh.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
