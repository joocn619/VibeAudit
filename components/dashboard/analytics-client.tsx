"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp, TrendingDown, ShieldCheck, ShieldAlert, AlertTriangle,
  Activity, Zap, FileText, Download, RefreshCw, BarChart3,
  CheckCircle2, Clock, GitPullRequest, Eye, Flame, Target,
  ArrowUpRight, ArrowDownRight, Star, Award, Globe
} from "lucide-react";

// ─── Sparkline mini-chart (pure SVG, no library needed) ─────────────────────
function Sparkline({ data, color = "#6366f1", height = 40 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 120, h = height;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Circular progress ring ──────────────────────────────────────────────────
function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 90 ? "#10b981" : score >= 70 ? "#f59e0b" : "#f43f5e";
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - dash }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

// ─── Static demo data ────────────────────────────────────────────────────────
const SCORE_HISTORY = [72, 74, 69, 78, 81, 79, 85, 88, 84, 90, 93, 96];
const PR_HISTORY    = [2, 3, 1, 4, 5, 3, 6, 4, 7, 5, 8, 9];
const VULN_HISTORY  = [12, 10, 11, 8, 9, 7, 6, 5, 4, 3, 2, 1];

const REPOS = [
  { name: "vibeaudit/saas-core",            score: 96, delta: +4, vulns: 1,  prs: 3,  last: "8 min ago",   status: "secure" },
  { name: "vibeaudit/ai-billing-engine",     score: 91, delta: +7, vulns: 2,  prs: 2,  last: "2 hrs ago",   status: "secure" },
  { name: "vibeaudit/nextjs-starter-pro",    score: 84, delta: -2, vulns: 4,  prs: 5,  last: "Yesterday",   status: "warning" },
  { name: "vibeaudit/crypto-auth-service",   score: 76, delta: +12,vulns: 6,  prs: 8,  last: "2 days ago",  status: "critical" },
  { name: "vibeaudit/admin-portal",          score: 98, delta: +1, vulns: 0,  prs: 1,  last: "4 hrs ago",   status: "secure" },
];

const THREAT_FEED = [
  { time: "Just now",   sev: "critical", msg: "SQL Injection (Line 42) blocked in saas-core — PR #117 auto-generated",      icon: "🚨" },
  { time: "18 min ago", sev: "moderate", msg: "Stripe price-bypass attempt detected in ai-billing-engine — fix merged",       icon: "⚠️" },
  { time: "1 hr ago",   sev: "info",     msg: "LLM rate-limit shield activated across 3 repos — 240 bot requests blocked",    icon: "🤖" },
  { time: "3 hrs ago",  sev: "secure",   msg: "crypto-auth-service VibeScore improved from 64 → 76 after 8 PR merges",       icon: "✅" },
  { time: "5 hrs ago",  sev: "critical", msg: "Hardcoded Anthropic API key found in admin-portal env — rotated automatically",icon: "🔑" },
  { time: "Yesterday",  sev: "info",     msg: "SOC2 compliance report generated & emailed to security@vibeaudit.ai",          icon: "📄" },
];

const VULN_TYPES = [
  { label: "SQL / NoSQL Injection",   count: 14, color: "bg-rose-500",   pct: 35 },
  { label: "Payment Logic Bypass",    count: 9,  color: "bg-amber-500",  pct: 22 },
  { label: "LLM Prompt Injection",    count: 8,  color: "bg-purple-500", pct: 20 },
  { label: "Hardcoded Secrets",       count: 6,  color: "bg-orange-500", pct: 15 },
  { label: "CSRF / Auth Bypass",      count: 3,  color: "bg-indigo-500", pct: 8  },
];

const MONTHS = ["Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul"];

export function AnalyticsClient() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("90d");
  const [generating, setGenerating] = useState(false);
  const [reportReady, setReportReady] = useState(false);
  const [liveScore, setLiveScore] = useState(92);

  // tiny score drift animation
  useEffect(() => {
    const t = setInterval(() => setLiveScore(prev => Math.min(100, Math.max(85, prev + (Math.random() > 0.5 ? 1 : -1)))), 6000);
    return () => clearInterval(t);
  }, []);

  const generateReport = () => {
    if (generating) return;
    setGenerating(true);
    setReportReady(false);
    setTimeout(() => { setGenerating(false); setReportReady(true); }, 2200);
  };

  return (
    <div className="space-y-10 pb-20">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-indigo-400" />
            Analytics & Intelligence
          </h1>
          <p className="text-slate-300 text-sm mt-1 font-medium">Executive security posture · AI threat intelligence · Compliance reporting</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-black/60 border border-white/10">
            {(["7d","30d","90d"] as const).map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === p ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"}`}>
                {p}
              </button>
            ))}
          </div>

          {/* PDF Report Generator */}
          <motion.button
            onClick={generateReport} disabled={generating}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
              reportReady ? "bg-emerald-500 text-black" :
              generating  ? "bg-white/10 text-slate-300 border border-white/15 animate-pulse" :
                            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow"
            }`}>
            {generating ? <RefreshCw className="h-4 w-4 animate-spin" /> :
             reportReady ? <><CheckCircle2 className="h-4 w-4" /><span>Report Ready — Download</span></> :
                          <><FileText className="h-4 w-4" /><span>Generate SOC2 PDF Report</span></>}
            {!generating && !reportReady && <Download className="h-3.5 w-3.5" />}
          </motion.button>
        </div>
      </div>

      {/* ── KPI Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Fleet VibeScore",   value: `${liveScore}/100`, sub: "+11 pts this month",  icon: ShieldCheck,  color: "text-emerald-400", trend: "up" },
          { label: "Vulns Neutralised", value: "41",               sub: "Past 90 days",        icon: ShieldAlert,  color: "text-rose-400",    trend: "down" },
          { label: "AI PRs Merged",     value: "27",               sub: "Zero breaking changes",icon: GitPullRequest,color:"text-indigo-400", trend: "up" },
          { label: "Avg Fix Time",      value: "< 4 min",          sub: "vs. 3–6 wks manual",  icon: Clock,        color: "text-amber-400",   trend: "up" },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent space-y-3 hover:border-white/25 transition">
              <div className="flex items-center justify-between">
                <Icon className={`h-5 w-5 ${kpi.color}`} />
                {kpi.trend === "up"
                  ? <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  : <ArrowDownRight className="h-4 w-4 text-rose-400" />}
              </div>
              <div>
                <p className="text-2xl font-black text-white font-mono">{kpi.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{kpi.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{kpi.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Security Score Trend Chart + Live Score Ring ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart — 2/3 width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 border border-white/15 lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Fleet Security Score Trend</h2>
              <p className="text-xs text-slate-400 mt-0.5">12-month VibeScore trajectory across all connected repositories</p>
            </div>
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </div>

          {/* Bar Chart (CSS only, no lib) */}
          <div className="flex items-end gap-2 h-40">
            {SCORE_HISTORY.map((v, i) => {
              const color = v >= 90 ? "from-emerald-500 to-emerald-400" : v >= 80 ? "from-indigo-500 to-purple-400" : "from-amber-500 to-amber-400";
              return (
                <motion.div key={i} className="flex-1 flex flex-col items-center gap-1 group"
                  initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                  style={{ originY: 1 }}>
                  <div className={`w-full rounded-t-lg bg-gradient-to-t ${color} opacity-80 group-hover:opacity-100 transition cursor-default relative`}
                    style={{ height: `${(v / 100) * 140}px` }}>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition whitespace-nowrap">{v}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">{MONTHS[i]}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Live Fleet Score Ring — 1/3 width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 border border-white/15 flex flex-col items-center justify-center space-y-5 text-center">
          <h2 className="text-base font-black text-white">Live Fleet Score</h2>
          <div className="relative flex items-center justify-center">
            <ScoreRing score={liveScore} size={120} />
            <div className="absolute flex flex-col items-center">
              <AnimatePresence mode="wait">
                <motion.span key={liveScore}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="text-3xl font-black text-white font-mono">{liveScore}</motion.span>
              </AnimatePresence>
              <span className="text-[10px] text-emerald-400 font-bold">/ 100</span>
            </div>
          </div>
          <div className="space-y-2 w-full text-xs font-medium">
            <div className="flex justify-between text-slate-300 px-2">
              <span>Repos Monitored</span><strong className="text-white">5</strong>
            </div>
            <div className="flex justify-between text-slate-300 px-2">
              <span>Active Shields</span><strong className="text-emerald-400">5 / 5</strong>
            </div>
            <div className="flex justify-between text-slate-300 px-2">
              <span>Fleet Grade</span>
              <strong className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">A+</strong>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Vulnerability Breakdown + Repo Leaderboard ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vulnerability Type Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 border border-white/15 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Vulnerability Breakdown</h2>
              <p className="text-xs text-slate-400 mt-0.5">By attack vector — 90-day cumulative</p>
            </div>
            <Flame className="h-5 w-5 text-rose-400" />
          </div>

          <div className="space-y-4">
            {VULN_TYPES.map((v, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-semibold">{v.label}</span>
                  <span className="text-slate-400 font-mono font-bold">{v.count} fixed</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} whileInView={{ width: `${v.pct}%` }} viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.1, ease: "easeOut" }}
                    className={`h-full rounded-full ${v.color}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Mini sparklines row */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
            {[
              { label: "Score Trend",  data: SCORE_HISTORY,  color: "#10b981" },
              { label: "PRs Opened",   data: PR_HISTORY,     color: "#6366f1" },
              { label: "Vulns Found",  data: VULN_HISTORY,   color: "#f43f5e" },
            ].map((s, i) => (
              <div key={i} className="space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{s.label}</span>
                <Sparkline data={s.data} color={s.color} height={32} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Repo Security Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 border border-white/15 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-white">Repo Security Leaderboard</h2>
              <p className="text-xs text-slate-400 mt-0.5">Live VibeScore ranking for all connected repos</p>
            </div>
            <Award className="h-5 w-5 text-amber-400" />
          </div>

          <div className="space-y-3">
            {REPOS.map((r, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 hover:border-white/20 transition group cursor-pointer">
                {/* Rank */}
                <span className="text-xs font-black text-slate-500 font-mono w-5">#{i + 1}</span>

                {/* Score ring mini */}
                <div className="relative w-10 h-10 shrink-0">
                  <ScoreRing score={r.score} size={40} />
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white">{r.score}</span>
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate font-mono">{r.name}</p>
                  <p className="text-[10px] text-slate-400">{r.vulns} vulns remaining · {r.prs} PRs merged · {r.last}</p>
                </div>

                {/* Delta */}
                <div className={`flex items-center gap-0.5 text-xs font-extrabold font-mono ${r.delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  {r.delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                  {Math.abs(r.delta)}
                </div>

                {/* Status Badge */}
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg border ${
                  r.status === "secure"   ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" :
                  r.status === "warning"  ? "bg-amber-500/15  text-amber-300  border-amber-500/30"  :
                                           "bg-rose-500/15   text-rose-300   border-rose-500/30"
                }`}>{r.status === "secure" ? "A+ SECURE" : r.status === "warning" ? "⚠ REVIEW" : "🚨 CRITICAL"}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── AI Threat Intelligence Live Feed ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 border border-white/15 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              AI Threat Intelligence Feed
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time autonomous security events across your entire fleet</p>
          </div>
          <span className="flex items-center gap-2 text-xs font-bold text-emerald-300 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
        </div>

        <div className="space-y-3">
          {THREAT_FEED.map((e, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`flex items-start gap-4 p-4 rounded-2xl border transition ${
                e.sev === "critical" ? "bg-rose-500/[0.07]   border-rose-500/25   hover:border-rose-500/40" :
                e.sev === "moderate" ? "bg-amber-500/[0.07]  border-amber-500/25  hover:border-amber-500/40" :
                e.sev === "secure"   ? "bg-emerald-500/[0.07]border-emerald-500/25 hover:border-emerald-500/40" :
                                      "bg-white/[0.02]      border-white/10      hover:border-white/20"
              }`}>
              <span className="text-lg shrink-0 mt-0.5">{e.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-100 font-medium leading-snug">{e.msg}</p>
                <p className="text-[11px] text-slate-500 mt-1 font-mono">{e.time}</p>
              </div>
              <span className={`shrink-0 text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                e.sev === "critical" ? "bg-rose-500/20 text-rose-300" :
                e.sev === "moderate" ? "bg-amber-500/20 text-amber-300" :
                e.sev === "secure"   ? "bg-emerald-500/20 text-emerald-300" :
                                      "bg-indigo-500/20 text-indigo-300"
              }`}>{e.sev}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── SOC2 Compliance Report Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass-card rounded-3xl p-8 md:p-10 border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              Executive Compliance Suite
            </span>
            <h2 className="text-2xl font-black text-white">SOC2 · HIPAA · ISO 27001 Compliance Report</h2>
            <p className="text-sm text-slate-300 font-medium max-w-xl">
              Generate a cryptographically timestamped executive PDF audit report — ready for investor due diligence, enterprise client security reviews, and regulatory compliance submissions.
            </p>
          </div>

          <motion.button onClick={generateReport} disabled={generating}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            className={`shrink-0 flex items-center gap-2.5 px-8 py-4 rounded-2xl font-black text-sm transition-all ${
              reportReady ? "bg-emerald-500 text-black shadow-glow" :
              generating  ? "bg-white/10 text-slate-300 border border-white/15 animate-pulse cursor-wait" :
                            "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow"
            }`}>
            {generating
              ? <><RefreshCw className="h-5 w-5 animate-spin" /> Generating Report...</>
              : reportReady
              ? <><CheckCircle2 className="h-5 w-5" /> Download PDF Report</>
              : <><FileText className="h-5 w-5" /> Generate PDF Report <Download className="h-4 w-4" /></>}
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "SOC2 Type II",      status: "COMPLIANT",  color: "emerald" },
            { label: "OWASP Top 10",      status: "A+ PASS",    color: "emerald" },
            { label: "GDPR / Privacy",    status: "COMPLIANT",  color: "emerald" },
            { label: "HIPAA Controls",    status: "REVIEW REQ", color: "amber"   },
          ].map((c, i) => (
            <div key={i} className={`p-4 rounded-2xl border text-center space-y-1 ${
              c.color === "emerald" ? "bg-emerald-500/10 border-emerald-500/30" : "bg-amber-500/10 border-amber-500/30"
            }`}>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{c.label}</p>
              <p className={`text-sm font-black font-mono ${c.color === "emerald" ? "text-emerald-300" : "text-amber-300"}`}>{c.status}</p>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}
