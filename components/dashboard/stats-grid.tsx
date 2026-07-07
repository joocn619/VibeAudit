"use client";

import React from "react";
import { ShieldCheck, GitBranch, AlertOctagon, Sparkles, TrendingUp } from "lucide-react";

interface StatsGridProps {
  totalRepos?: number;
  averageScore?: number;
  criticalFindings?: number;
  aiFixRate?: number;
}

export function DashboardStatsGrid({
  totalRepos = 4,
  averageScore = 92,
  criticalFindings = 0,
  aiFixRate = 98.4,
}: StatsGridProps) {
  const stats = [
    {
      title: "Overall VibeScore",
      value: `${averageScore}`,
      suffix: "/100",
      change: "+4 pts this week",
      trend: "up",
      icon: ShieldCheck,
      color: "from-emerald-500/20 via-emerald-500/5 to-transparent",
      borderColor: "border-emerald-500/40",
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      glow: "shadow-glow-green",
      badgeText: "A+ GRADE SECURE",
      badgeColor: "bg-emerald-500/20 text-emerald-200 border-emerald-500/40 font-extrabold",
    },
    {
      title: "Active AI Repositories",
      value: `${totalRepos}`,
      suffix: " Repos",
      change: "Continuous Audit",
      trend: "neutral",
      icon: GitBranch,
      color: "from-indigo-500/20 via-indigo-500/5 to-transparent",
      borderColor: "border-indigo-500/40",
      iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      glow: "shadow-glow",
      badgeText: "WEBHOOKS ACTIVE",
      badgeColor: "bg-indigo-500/20 text-indigo-200 border-indigo-500/40 font-extrabold",
    },
    {
      title: "Critical Vulnerabilities",
      value: `${criticalFindings}`,
      suffix: " Open",
      change: "100% Zero-Day Shield",
      trend: "good",
      icon: AlertOctagon,
      color: "from-rose-500/20 via-rose-500/5 to-transparent",
      borderColor: "border-rose-500/40",
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      glow: "shadow-glow-red",
      badgeText: criticalFindings === 0 ? "ZERO THREATS" : "ACTION REQUIRED",
      badgeColor:
        criticalFindings === 0
          ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/40 font-extrabold"
          : "bg-rose-500/20 text-rose-200 border-rose-500/40 font-extrabold",
    },
    {
      title: "AI Auto-Fix Rate",
      value: `${aiFixRate}%`,
      suffix: "",
      change: "Saved ~$4,200 dev hrs",
      trend: "up",
      icon: Sparkles,
      color: "from-purple-500/20 via-purple-500/5 to-transparent",
      borderColor: "border-purple-500/40",
      iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      glow: "shadow-glow-lg",
      badgeText: "AUTONOMOUS PRS",
      badgeColor: "bg-purple-500/20 text-purple-200 border-purple-500/40 font-extrabold",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className={`glass-card rounded-3xl p-7 border ${stat.borderColor} bg-gradient-to-br ${stat.color} relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-300 hover:${stat.glow} shadow-lg`}
          >
            {/* Background Shimmer Effect */}
            <div className="absolute -right-12 -bottom-12 h-36 w-36 bg-white/[0.04] rounded-full blur-2xl group-hover:bg-white/[0.1] transition-all pointer-events-none"></div>

            {/* Header: Title & Icon */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors font-mono">
                {stat.title}
              </span>
              <div className={`p-3 rounded-2xl border ${stat.iconColor} shadow-sm group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Value & Suffix */}
            <div className="flex items-baseline gap-1.5 mb-4">
              <span className="text-4xl font-black text-white tracking-tight font-mono drop-shadow-sm">
                {stat.value}
              </span>
              {stat.suffix && <span className="text-sm font-bold text-slate-300">{stat.suffix}</span>}
            </div>

            {/* Bottom Row: Trend & Crisp High-Contrast Badge */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                {stat.trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-400" />}
                <span>{stat.change}</span>
              </div>
              <span className={`text-[11px] px-3 py-1 rounded-full border tracking-wider uppercase shadow-sm ${stat.badgeColor}`}>
                {stat.badgeText}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
