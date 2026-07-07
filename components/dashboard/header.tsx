"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Sparkles,
  Github,
  Command,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  repoCount?: number;
}

export function DashboardHeader({ repoCount = 0 }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const notifications = [
    {
      id: 1,
      title: "AI Fix PR #14 Generated",
      desc: "Autonomously patched SQL Injection in /api/checkout/route.ts",
      time: "12m ago",
      type: "success",
    },
    {
      id: 2,
      title: "Continuous Audit Active",
      desc: "Background webhook scan triggered on branch main",
      time: "1h ago",
      type: "info",
    },
    {
      id: 3,
      title: "Zero-Day Threat Shield",
      desc: "Updated CVE database against Next.js middleware bypass",
      time: "3h ago",
      type: "warning",
    },
  ];

  return (
    <header className="h-16 border-b border-white/10 bg-[#0a0a0f]/60 backdrop-blur-xl flex items-center justify-between px-8 relative z-10 shrink-0">
      {/* Left: Live Security Ticker */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>
            AI Security Shield: <strong className="text-white font-semibold">Active Monitoring</strong>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px]">{repoCount} Repos Protected</span>
        </div>
      </div>

      {/* Center / Right: Search & Actions */}
      <div className="flex items-center gap-4">
        {/* Command Palette Search Bar */}
        <div className="relative w-64 lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search repositories, CVEs, or AI fixes..."
            className="w-full rounded-xl bg-black/40 border border-white/10 pl-10 pr-12 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        {/* Connect GitHub Button */}
        <Link
          href="/onboarding"
          className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-glow hover:opacity-95 transition-all duration-200"
        >
          <Github className="h-3.5 w-3.5" />
          <span>Connect Repo</span>
        </Link>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-slate-300 hover:text-white hover:bg-white/[0.08] transition relative"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500 shadow-glow"></span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0e0e16] border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                  AI Security Activity
                </span>
                <span className="text-[10px] text-indigo-400 cursor-pointer hover:underline">Mark read</span>
              </div>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex gap-3 items-start"
                  >
                    <div className="mt-0.5 shrink-0">
                      {notif.type === "success" && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      )}
                      {notif.type === "warning" && (
                        <AlertTriangle className="h-4 w-4 text-amber-400" />
                      )}
                      {notif.type === "info" && <Sparkles className="h-4 w-4 text-indigo-400" />}
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-white">{notif.title}</p>
                        <span className="text-[9px] text-slate-500 font-mono">{notif.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{notif.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 text-center">
                <Link
                  href="/monitoring"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center justify-center gap-1"
                >
                  <span>View All Audit Logs</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
