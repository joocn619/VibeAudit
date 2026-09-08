"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  GitCommit,
  Bell,
  CheckCircle2,
  AlertOctagon,
  Play,
  RefreshCw,
  Zap,
  Lock,
  MessageSquare,
  Mail,
  GitBranch,
} from "lucide-react";

interface PushEvent {
  id: string;
  repo: string;
  branch: string;
  commit: string;
  author: string;
  timestamp: string;
  status: "secure" | "blocked" | "scanning";
  vibeScore: number;
  message: string;
}

export default function MonitoringPage() {
  const [simulating, setSimulating] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [discordAlerts, setDiscordAlerts] = useState(true);
  const [branchProtection, setBranchProtection] = useState(true);

  const [events, setEvents] = useState<PushEvent[]>([
    {
      id: "evt-101",
      repo: "vibeaudit/saas-core",
      branch: "main",
      commit: "a8f93e2",
      author: "sarah-dev",
      timestamp: "12 mins ago",
      status: "secure",
      vibeScore: 96,
      message: "AST scan passed across 48 modules. Zero new vulnerabilities detected.",
    },
    {
      id: "evt-102",
      repo: "vibeaudit/ai-billing-engine",
      branch: "feature/stripe-v2",
      commit: "7d8f9a1",
      author: "alex-coder",
      timestamp: "1 hour ago",
      status: "blocked",
      vibeScore: 62,
      message: "🚨 BLOCKED: Client-side pricing trust & missing webhook signature verification detected!",
    },
    {
      id: "evt-103",
      repo: "vibeaudit/crypto-auth-microservice",
      branch: "main",
      commit: "e4c1b09",
      author: "trend-admin",
      timestamp: "3 hours ago",
      status: "secure",
      vibeScore: 98,
      message: "JWT signature validation & rate limiting verified. 100% compliant.",
    },
  ]);

  const handleSimulatePush = () => {
    if (simulating) return;
    setSimulating(true);

    // Create a temporary scanning event
    const newId = `evt-${Date.now()}`;
    const scanningEvent: PushEvent = {
      id: newId,
      repo: "vibeaudit/saas-core",
      branch: "feat/auth-oauth",
      commit: Math.random().toString(16).substring(2, 9),
      author: "demo.user",
      timestamp: "Just now",
      status: "scanning",
      vibeScore: 0,
      message: "⚡ Webhook received: AST analyzer parsing diff & checking OWASP Top 10...",
    };

    setEvents((prev) => [scanningEvent, ...prev]);

    setTimeout(() => {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === newId
            ? {
                ...ev,
                status: "blocked",
                vibeScore: 58,
                message: "🚨 BLOCKED: Hardcoded AWS Secret Access Key detected in auth provider config!",
              }
            : ev
        )
      );
      setSimulating(false);
    }, 2500);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* 1. Header & Simulation Command Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/15">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold font-mono uppercase tracking-wider mb-2 shadow-sm">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Continuous CI/CD Security Shield</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Real-Time <span className="text-gradient">Webhook Monitoring</span>
          </h1>
          <p className="text-sm text-slate-300 font-medium max-w-2xl mt-1">
            Our autonomous engine intercepts every git push and PR creation, analyzing AST diffs in volatile memory before code merges into production.
          </p>
        </div>

        <button
          onClick={handleSimulatePush}
          disabled={simulating}
          className={`px-6 py-4 rounded-2xl font-extrabold text-xs transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shrink-0 ${
            simulating
              ? "bg-indigo-500/50 text-indigo-200 cursor-wait"
              : "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white shadow-glow hover:scale-105"
          }`}
        >
          {simulating ? (
            <>
              <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Simulating Git Push...</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 fill-current" />
              <span>⚡ Simulate Live Git Push</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Alerting & Branch Protection Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent flex flex-col justify-between shadow-lg">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Mail className="h-6 w-6" />
            </div>
            <button
              onClick={() => setEmailAlerts(!emailAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                emailAlerts ? "bg-emerald-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white block transition-transform ${
                  emailAlerts ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white">Instant Email Alerts</h3>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Receive immediate security reports whenever a critical SQLi or Secret Leak is pushed.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent flex flex-col justify-between shadow-lg">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <MessageSquare className="h-6 w-6" />
            </div>
            <button
              onClick={() => setDiscordAlerts(!discordAlerts)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                discordAlerts ? "bg-emerald-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white block transition-transform ${
                  discordAlerts ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white">Discord & Slack Webhooks</h3>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Broadcast real-time AST audit scores and AI auto-fix PR links directly to your team channel.
            </p>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent flex flex-col justify-between shadow-lg">
          <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <GitBranch className="h-6 w-6" />
            </div>
            <button
              onClick={() => setBranchProtection(!branchProtection)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                branchProtection ? "bg-emerald-500" : "bg-slate-700"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white block transition-transform ${
                  branchProtection ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <div className="mt-4">
            <h3 className="text-base font-bold text-white">GitHub Branch Protection</h3>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Automatically block pull request merging if VibeScore drops below 85/100.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Live Git Push Interception Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2.5 font-mono">
              <GitCommit className="h-5 w-5 text-indigo-400" />
              <span>Live Git Push Interception Log</span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Real-time AST security analysis triggered via GitHub App webhooks
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 bg-black/50 px-3 py-1 rounded-xl border border-white/10">
            {events.length} Events Logged
          </span>
        </div>

        <div className="space-y-4">
          {events.map((ev) => {
            const isBlocked = ev.status === "blocked";
            const isScanning = ev.status === "scanning";

            const badgeStyle = isBlocked
              ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
              : isScanning
              ? "bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse"
              : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";

            return (
              <div
                key={ev.id}
                className={`glass-card rounded-3xl p-6 border transition-all duration-300 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                  isBlocked ? "border-rose-500/40 bg-rose-500/[0.03]" : "border-white/15 bg-white/[0.02]"
                }`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-extrabold text-white font-mono">{ev.repo}</span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white/10 text-indigo-300 border border-white/10 flex items-center gap-1">
                      <GitBranch className="h-3 w-3" />
                      <span>{ev.branch}</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">commit #{ev.commit}</span>
                    <span className="text-xs text-slate-400 font-medium">• by {ev.author}</span>
                  </div>

                  <p className={`text-xs md:text-sm font-medium leading-relaxed ${isBlocked ? "text-rose-200 font-bold" : "text-slate-300"}`}>
                    {ev.message}
                  </p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">VibeScore</span>
                    <span className={`text-xl font-black font-mono ${isBlocked ? "text-rose-400" : isScanning ? "text-purple-400" : "text-emerald-400"}`}>
                      {isScanning ? "..." : `${ev.vibeScore}/100`}
                    </span>
                  </div>

                  <span className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase font-mono tracking-wider border flex items-center gap-1.5 shadow-sm ${badgeStyle}`}>
                    {isBlocked ? (
                      <>
                        <AlertOctagon className="h-4 w-4" />
                        <span>BLOCKED</span>
                      </>
                    ) : isScanning ? (
                      <>
                        <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>SCANNING</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>PASSED</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
