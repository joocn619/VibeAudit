"use client";

import React from "react";
import { Sparkles, Terminal, CheckCircle2, ShieldAlert, GitPullRequest, Clock, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function DashboardActivityFeed() {
  const events = [
    {
      id: "ev-1",
      time: "12 mins ago",
      type: "fix",
      title: "AI Fix PR #14 Generated & Ready for Review",
      repo: "vibeaudit/saas-core",
      desc: "Autonomously patched SQL Injection vulnerability in /api/checkout/route.ts using parameter binding.",
      badge: "PR #14",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: "ev-2",
      time: "1 hour ago",
      type: "scan",
      title: "Continuous Webhook Scan Completed",
      repo: "vibeaudit/saas-core",
      desc: "Triggered by push to branch main (commit 8f9a2e). Scanned 42 files in 3.4 seconds. Found 1 moderate issue.",
      badge: "Score 91",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      id: "ev-3",
      time: "3 hours ago",
      type: "shield",
      title: "Zero-Day Threat Shield Activated",
      repo: "All Repositories",
      desc: "Cross-checked dependencies against newly published CVE-2026-4821 (Next.js middleware bypass). Zero affected repos.",
      badge: "Protected",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      id: "ev-4",
      time: "Yesterday",
      type: "fix",
      title: "AI Fix PR #12 Merged to Main",
      repo: "vibeaudit/ai-billing-engine",
      desc: "Resolved CORS misconfiguration and missing CSRF headers on billing webhook routes.",
      badge: "Merged",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 mb-6 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-400">
            <Terminal className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <span>Autonomous AI Security Feed</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-xs text-slate-400">Real-time audit logs, background webhooks, and automated fix PRs</p>
          </div>
        </div>
        <Link
          href="/monitoring"
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
        >
          <span>View All Logs</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Timeline Feed */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:left-[19px] before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-purple-500/30 before:to-transparent">
        {events.map((ev, idx) => (
          <div key={ev.id} className="relative flex items-start gap-4 group">
            {/* Timeline Node Icon */}
            <div className="h-10 w-10 rounded-xl bg-[#0e0e16] border border-white/10 flex items-center justify-center shrink-0 z-10 shadow-sm group-hover:border-indigo-500/50 transition-colors">
              {ev.type === "fix" && <Sparkles className="h-4 w-4 text-purple-400 animate-pulse" />}
              {ev.type === "scan" && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
              {ev.type === "shield" && <ShieldAlert className="h-4 w-4 text-indigo-400" />}
            </div>

            {/* Event Card Content */}
            <div className="flex-1 rounded-xl bg-white/[0.02] border border-white/5 p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {ev.title}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[10px] font-mono text-slate-400">
                    {ev.repo}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${ev.badgeColor}`}>
                    {ev.badge}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ev.time}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{ev.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
