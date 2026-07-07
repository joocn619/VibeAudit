"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Github, GitBranch, Clock, Lock, Sparkles, ArrowUpRight, Play, CheckCircle2, ShieldAlert, Award } from "lucide-react";
import { ScoreRing } from "./score-ring";
import { Repo } from "@/types";

interface RepoCardProps {
  repo: Repo;
  lastScanScore?: number;
  lastScanTime?: string;
  criticalCount?: number;
  moderateCount?: number;
  lowCount?: number;
  aiFixReady?: boolean;
  onScanTrigger?: (repoId: string) => Promise<void>;
}

export function RepoCard({
  repo,
  lastScanScore = 91,
  lastScanTime = "14 mins ago",
  criticalCount = 0,
  moderateCount = 1,
  lowCount = 3,
  aiFixReady = true,
  onScanTrigger,
}: RepoCardProps) {
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const handleScan = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (scanning) return;
    setScanning(true);

    try {
      if (onScanTrigger) {
        await onScanTrigger(repo.id);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
      setScanned(true);
      setTimeout(() => setScanned(false), 3000);
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setScanning(false);
    }
  };

  // Split repo title into org and repo name for ultra-crisp display without truncation
  const parts = repo.full_name.split("/");
  const orgName = parts.length > 1 ? `${parts[0]}/` : "";
  const repoName = parts.length > 1 ? parts[1] : repo.full_name;

  return (
    <div className="glass-card rounded-3xl p-7 border border-white/15 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group hover:shadow-glow-lg relative overflow-hidden bg-gradient-to-br from-white/[0.05] to-transparent">
      {/* Subtle Glow Mesh */}
      <div className="absolute -right-16 -top-16 h-48 w-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/25 transition-all pointer-events-none"></div>

      {/* Top Header Row: Full Name + Badge (Left) & Score Ring (Right) */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div className="flex items-start gap-4 min-w-0 flex-1">
          <div className="p-3.5 rounded-2xl bg-black/60 border border-white/15 text-white shadow-md shrink-0 group-hover:border-indigo-500/50 group-hover:scale-105 transition-all">
            <Github className="h-6 w-6 text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap mb-2">
              <h3 className="text-lg md:text-xl font-extrabold text-white tracking-tight break-all">
                <span className="text-slate-400 font-medium">{orgName}</span>
                <span className="text-white group-hover:text-indigo-300 transition-colors">{repoName}</span>
              </h3>
              <span className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-600 text-xs font-bold text-slate-200 flex items-center gap-1.5 shrink-0 shadow-sm">
                <Lock className="h-3 w-3 text-indigo-400" />
                <span>Private</span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5 font-mono text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                <GitBranch className="h-3.5 w-3.5" />
                {repo.default_branch || "main"}
              </span>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                {lastScanTime}
              </span>
            </div>
          </div>
        </div>

        {/* Spacious Crisp Score Ring */}
        <div className="shrink-0 pl-2">
          <ScoreRing score={lastScanScore} size={80} />
        </div>
      </div>

      {/* Middle Row: High-Contrast Vulnerability Breakdown Bar */}
      <div className="grid grid-cols-3 gap-3 py-4 px-5 rounded-2xl bg-black/50 border border-white/10 mb-6 shadow-inner">
        <div className="flex flex-col items-center justify-center border-r border-white/10 pr-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Critical</span>
          <span className={`text-xl font-black font-mono mt-1 ${criticalCount > 0 ? "text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "text-emerald-400"}`}>
            {criticalCount}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center border-r border-white/10 px-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Moderate</span>
          <span className={`text-xl font-black font-mono mt-1 ${moderateCount > 0 ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" : "text-slate-200"}`}>
            {moderateCount}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center pl-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">Low</span>
          <span className="text-xl font-black font-mono mt-1 text-slate-200">{lowCount}</span>
        </div>
      </div>

      {/* AI Fix PR Ready Banner (if applicable) */}
      {aiFixReady && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-500/20 via-indigo-500/20 to-pink-500/20 border border-purple-500/40 flex items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/30 text-purple-200 shadow-sm shrink-0">
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <div>
              <p className="text-xs md:text-sm font-extrabold text-white tracking-tight">AI Fix PR #14 Ready</p>
              <p className="text-xs text-purple-200 font-medium mt-0.5">SQL Injection auto-patch prepared & verified</p>
            </div>
          </div>
          <Link
            href="/fixes"
            className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md shrink-0 flex items-center gap-1.5 hover:scale-105"
          >
            <span>Review PR</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {/* Bottom Row: Spacious Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-5 border-t border-white/10">
        <Link
          href={`/scan/${repo.id}`}
          className="flex-1 text-center py-3 px-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-xs font-bold text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>Audit Report</span>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
        </Link>

        {lastScanScore >= 90 && (
          <Link
            href={`/cert/${repo.full_name.replace("/", "-")}`}
            className="flex items-center gap-1.5 py-3 px-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-xs font-bold text-emerald-300 hover:text-emerald-200 transition shadow-sm shrink-0"
            title="View & Share A+ Security Certificate"
          >
            <Award className="h-3.5 w-3.5" />
            <span>Certificate</span>
          </Link>
        )}

        <button
          onClick={handleScan}
          disabled={scanning}
          className={`flex-1 py-3 px-3 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md ${
            scanned
              ? "bg-emerald-500 text-white shadow-glow-green"
              : scanning
              ? "bg-indigo-500/50 text-indigo-200 cursor-wait"
              : "bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:opacity-95 text-white shadow-glow hover:scale-[1.02]"
          }`}
        >
          {scanned ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Scanned!</span>
            </>
          ) : scanning ? (
            <>
              <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Scan Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
