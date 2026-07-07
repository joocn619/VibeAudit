"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  CreditCard,
  Settings,
  Github,
  Sparkles,
  LogOut,
  Activity,
  ChevronRight,
  Terminal,
  ShieldCheck,
  Zap,
  BarChart3,
  Users,
  FileText,
  Bot,
  Globe,
  Swords,
  Webhook,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  userEmail?: string;
  plan?: string;
  onboardingCompleted?: boolean;
}

export function DashboardSidebar({
  userEmail = "developer@vibeaudit.ai",
  plan = "pro",
}: SidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Analytics & Intel",
      href: "/analytics",
      icon: BarChart3,
      badge: "New",
    },
    {
      name: "Monitoring & Alerts",
      href: "/monitoring",
      icon: Activity,
      badge: "Live",
    },
    {
      name: "AI Fix Engine",
      href: "/fixes",
      icon: Sparkles,
      badge: "Auto",
    },
    {
      name: "AI Copilot",
      href: "/copilot",
      icon: Bot,
      badge: "AI",
    },
    {
      name: "Compliance & SOC2",
      href: "/compliance",
      icon: ShieldCheck,
      badge: "SOC2",
    },
    {
      name: "Fleet Topology",
      href: "/fleet",
      icon: Globe,
      badge: "MESH",
    },
    {
      name: "Red Team Arena",
      href: "/redteam",
      icon: Swords,
      badge: "ARENA",
    },
    {
      name: "GitHub App & Webhooks",
      href: "/onboarding",
      icon: Webhook,
      badge: "APP",
    },
    {
      name: "Team & RBAC",
      href: "/settings/team",
      icon: Users,
      badge: "RBAC",
    },
    {
      name: "Audit Logs",
      href: "/settings/logs",
      icon: FileText,
      badge: "LOGS",
    },
    {
      name: "Billing & Plans",
      href: "/settings/billing",
      icon: CreditCard,
      badge: null,
    },
    {
      name: "Settings",
      href: "/settings/profile",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0a0a0f]/80 backdrop-blur-2xl flex flex-col justify-between p-5 relative z-20 shrink-0">
      {/* Top Section: Brand & Nav */}
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="px-2">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 p-[1px] shadow-glow transition-all duration-300 group-hover:shadow-glow-lg">
              <div className="h-full w-full bg-[#0a0a0f] rounded-[11px] flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-indigo-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                Vibe<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Audit</span>
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">AI Engine v2.4</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Security Command
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border border-indigo-500/30 shadow-glow"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      item.badge === "Live"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse"
                        : item.badge === "New"
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : item.badge === "AI"
                        ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-200 border border-indigo-500/40 shadow-glow"
                        : item.badge === "RBAC"
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                        : item.badge === "SOC2"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : item.badge === "MESH"
                        ? "bg-gradient-to-r from-purple-500/30 to-indigo-500/30 text-purple-200 border border-purple-500/40 shadow-glow animate-pulse"
                        : item.badge === "ARENA"
                        ? "bg-gradient-to-r from-red-500/30 to-purple-500/30 text-red-200 border border-red-500/40 shadow-glow animate-pulse"
                        : item.badge === "APP"
                        ? "bg-gradient-to-r from-emerald-500/30 to-indigo-500/30 text-emerald-200 border border-emerald-500/40 shadow-glow animate-pulse"
                        : item.badge === "LOGS"
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full shadow-glow"></span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Plan Usage & User Profile */}
      <div className="space-y-4">
        {/* $100K SaaS Plan Widget */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 h-20 w-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-indigo-400 fill-indigo-400/30" />
              {plan === "pro" ? "Pro Plan" : plan === "agency" ? "Agency Tier" : "Free Starter"}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Unlimited AI</span>
          </div>
          <p className="text-xs text-slate-300 mb-3 font-medium">
            Autonomous AI security audits active across all connected repositories.
          </p>
          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden mb-3 border border-white/5">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full w-[85%] rounded-full shadow-glow"></div>
          </div>
          <Link
            href="/settings/billing"
            className="block w-full rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 py-2 text-center text-xs font-semibold text-white transition-all hover:shadow-glow"
          >
            Manage Subscription
          </Link>
        </div>

        {/* User Profile Card */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-glow shrink-0">
              {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{userEmail.split("@")[0]}</p>
              <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign Out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
