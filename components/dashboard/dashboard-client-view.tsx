"use client";

import React, { useState } from "react";
import { Search, Plus, RefreshCw, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { Repo } from "@/types";
import { DashboardStatsGrid } from "./stats-grid";
import { RepoCard } from "./repo-card";
import { DashboardEmptyState } from "./empty-state";
import { DashboardActivityFeed } from "./activity-feed";
import { createClient } from "@/lib/supabase/client";

interface DashboardClientViewProps {
  initialRepos: Repo[];
  userEmail?: string;
}

export function DashboardClientView({ initialRepos, userEmail }: DashboardClientViewProps) {
  const [repos, setRepos] = useState<Repo[]>(initialRepos);
  const [activeTab, setActiveTab] = useState<"all" | "attention" | "secure">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const supabase = createClient();

  const getRepoStats = (repoId: string, index: number) => {
    const scores = [91, 96, 84, 98, 76];
    const score = scores[index % scores.length];
    return {
      score,
      critical: score < 80 ? 1 : 0,
      moderate: score < 90 ? 2 : 1,
      low: 3,
      aiFixReady: score < 95,
      lastScan: index === 0 ? "14 mins ago" : index === 1 ? "2 hours ago" : "Yesterday",
    };
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const { data } = await supabase.from("repos").select("*").order("connected_at", { ascending: false });
      if (data) setRepos(data);
    } catch (err) {
      console.error("Error refreshing repos:", err);
    } finally {
      setTimeout(() => setRefreshing(false), 600);
    }
  };

  const handleLoadDemo = async () => {
    window.location.href = "/api/github/connect?installation_id=999999";
  };

  const filteredRepos = repos.filter((repo, idx) => {
    const stats = getRepoStats(repo.id, idx);
    const matchesSearch =
      repo.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.default_branch.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "attention") return stats.score < 90 || stats.critical > 0;
    if (activeTab === "secure") return stats.score >= 90 && stats.critical === 0;
    return true;
  });

  const totalRepos = repos.length;
  const avgScore = totalRepos > 0
    ? Math.round(repos.reduce((acc, _, idx) => acc + getRepoStats("id", idx).score, 0) / totalRepos)
    : 92;
  const criticalCount = repos.reduce((acc, _, idx) => acc + getRepoStats("id", idx).critical, 0);

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Executive Security Overview (Stats Grid) */}
      <DashboardStatsGrid
        totalRepos={totalRepos || 4}
        averageScore={avgScore}
        criticalFindings={criticalCount}
        aiFixRate={98.4}
      />

      {/* 2. Main Content Area: Repositories Command Center */}
      <div className="space-y-6">
        {/* Section Header & Interactive Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/15">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>Connected Repositories</span>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-xs font-mono font-bold text-indigo-300 shadow-sm">
                {repos.length} Total
              </span>
            </h2>
            <p className="text-sm text-slate-300 mt-1 font-medium">
              Select a repository to run an autonomous AI scan or review generated code fixes
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Grid / List View Toggle */}
            <div className="flex items-center p-1 rounded-xl bg-black/50 border border-white/15">
              <button
                onClick={() => setViewMode("grid")}
                title="Spacious Grid View"
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "grid" ? "bg-white/15 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                title="Compact List View"
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list" ? "bg-white/15 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              title="Refresh repositories"
              className="p-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-300 hover:text-white transition shadow-sm"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin text-indigo-400" : ""}`} />
            </button>

            {/* Connect New Repo CTA */}
            <Link
              href="/onboarding"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 px-5 py-3 text-xs font-extrabold text-white shadow-glow hover:opacity-95 transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Connect Repo</span>
            </Link>
          </div>
        </div>

        {/* Filter Tabs & Search Box Row */}
        {repos.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-black/60 border border-white/15 w-fit shadow-inner">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === "all"
                    ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-white border border-indigo-500/50 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                All Repos ({repos.length})
              </button>
              <button
                onClick={() => setActiveTab("attention")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "attention"
                    ? "bg-rose-500/30 text-rose-200 border border-rose-500/50 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>Needs Attention</span>
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_#f43f5e]"></span>
              </button>
              <button
                onClick={() => setActiveTab("secure")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === "secure"
                    ? "bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                A+ Secure
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by repo name or branch..."
                className="w-full rounded-2xl bg-black/60 border border-white/15 pl-11 pr-4 py-3 text-xs text-white placeholder:text-slate-400 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition shadow-inner"
              />
            </div>
          </div>
        )}

        {/* 3. Repositories Spacious 2-Column Grid OR List View */}
        {repos.length === 0 ? (
          <DashboardEmptyState onLoadDemo={handleLoadDemo} />
        ) : filteredRepos.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center border border-white/15">
            <p className="text-slate-300 text-base mb-3 font-semibold">No repositories match your filter criteria.</p>
            <button
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div
            className={`grid gap-7 ${
              viewMode === "grid" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
            }`}
          >
            {filteredRepos.map((repo, idx) => {
              const stats = getRepoStats(repo.id, idx);
              return (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  lastScanScore={stats.score}
                  lastScanTime={stats.lastScan}
                  criticalCount={stats.critical}
                  moderateCount={stats.moderate}
                  lowCount={stats.low}
                  aiFixReady={stats.aiFixReady}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Autonomous AI Security Feed */}
      <DashboardActivityFeed />
    </div>
  );
}
