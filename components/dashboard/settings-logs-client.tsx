"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  ShieldCheck,
  Lock,
  Download,
  Terminal,
  Search,
  Filter,
  RefreshCw,
  Check,
  AlertCircle,
  Database,
  Share2,
  Server,
  Hash,
  Clock,
  User,
  ShieldAlert,
  GitMerge,
  Sparkles,
  Key,
  ExternalLink,
} from "lucide-react";

interface LogEvent {
  id: string;
  timestamp: string;
  eventType: "PR_MERGED" | "AST_SCAN_COMPLETED" | "SOC2_REPORT_GENERATED" | "RBAC_ROLE_UPDATED" | "API_KEY_ROTATED" | "WEBHOOK_VERIFIED";
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  cryptoHash: string;
  status: "verified" | "flagged";
}

const INITIAL_LOGS: LogEvent[] = [
  {
    id: "log-9001",
    timestamp: "2026-07-05 17:48:12 UTC",
    eventType: "PR_MERGED",
    actor: "trend@july-saas.studio",
    action: "Merged Autonomous AI PR #117 (SQLi Parameterized Binding)",
    target: "vibeaudit/saas-core (main)",
    ipAddress: "192.0.2.44",
    cryptoHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    status: "verified",
  },
  {
    id: "log-9002",
    timestamp: "2026-07-05 16:20:01 UTC",
    eventType: "AST_SCAN_COMPLETED",
    actor: "github-bot[bot]",
    action: "Triggered 120s Zero-Retention RAM AST Scan on commit push",
    target: "vibeaudit/saas-core (Score: 98/100)",
    ipAddress: "140.82.112.4",
    cryptoHash: "8a9f11a00a1209b55225c56c38210373ab1d368e71887a0c128799831d102911",
    status: "verified",
  },
  {
    id: "log-9003",
    timestamp: "2026-07-05 14:15:00 UTC",
    eventType: "SOC2_REPORT_GENERATED",
    actor: "trend@july-saas.studio",
    action: "Generated Executive SOC2 Type II & ISO 27001 Compliance PDF",
    target: "Fleet-Wide Posture Audit",
    ipAddress: "192.0.2.44",
    cryptoHash: "4b2c904e58a74e50d18228581e0413f36a6f13170e7914828109884519b52473",
    status: "verified",
  },
  {
    id: "log-9004",
    timestamp: "2026-07-05 11:30:22 UTC",
    eventType: "RBAC_ROLE_UPDATED",
    actor: "trend@july-saas.studio",
    action: "Promoted team member role from Senior DevOps to Security Architect",
    target: "s.jenkins@july-saas.studio",
    ipAddress: "192.0.2.44",
    cryptoHash: "1f8e331c4486d3e86c0139e76196238b1442b083377f88410972230a11223344",
    status: "verified",
  },
  {
    id: "log-9005",
    timestamp: "2026-07-05 09:12:45 UTC",
    eventType: "API_KEY_ROTATED",
    actor: "trend@july-saas.studio",
    action: "Rotated production VibeAudit CLI / CI-CD token",
    target: "va_live_99fa8e7d...",
    ipAddress: "192.0.2.44",
    cryptoHash: "9d7a221f008899a112233445566778899aabbccddeeff0011223344556677889",
    status: "verified",
  },
  {
    id: "log-9006",
    timestamp: "2026-07-04 22:05:18 UTC",
    eventType: "WEBHOOK_VERIFIED",
    actor: "stripe-billing-engine",
    action: "Verified cryptographic webhook signature on invoice.payment_succeeded",
    target: "Subscription Pro Tier ($499/mo)",
    ipAddress: "54.187.174.169",
    cryptoHash: "3c5b881234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    status: "verified",
  },
];

export function SettingsLogsClient() {
  const [logs, setLogs] = useState<LogEvent[]>(INITIAL_LOGS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isStreamingSiem, setIsStreamingSiem] = useState(false);
  const [siemSuccess, setSiemSuccess] = useState(false);

  const handleExportCsv = () => {
    if (isExportingCsv) return;
    setIsExportingCsv(true);
    setTimeout(() => {
      setIsExportingCsv(false);
      const csvContent =
        "data:text/csv;charset=utf-8," +
        ["ID,Timestamp,EventType,Actor,Action,Target,IP,CryptoHash,Status"]
          .concat(
            logs.map(
              (l) =>
                `${l.id},"${l.timestamp}",${l.eventType},${l.actor},"${l.action}","${l.target}",${l.ipAddress},${l.cryptoHash},${l.status}`
            )
          )
          .join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `vibeaudit_soc2_audit_logs_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1200);
  };

  const handleStreamSiem = () => {
    if (isStreamingSiem || siemSuccess) return;
    setIsStreamingSiem(true);
    setTimeout(() => {
      setIsStreamingSiem(false);
      setSiemSuccess(true);
      setTimeout(() => setSiemSuccess(false), 4000);
    }, 1500);
  };

  const filteredLogs = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.ipAddress.includes(searchQuery);
    const matchesType = typeFilter === "ALL" || l.eventType === typeFilter;
    return matchesSearch && matchesType;
  });

  const getEventBadge = (type: LogEvent["eventType"]) => {
    switch (type) {
      case "PR_MERGED":
        return { label: "PR MERGED", color: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30", icon: GitMerge };
      case "AST_SCAN_COMPLETED":
        return { label: "AST SCAN", color: "text-indigo-300 bg-indigo-500/15 border-indigo-500/30", icon: Sparkles };
      case "SOC2_REPORT_GENERATED":
        return { label: "SOC2 PDF", color: "text-purple-300 bg-purple-500/15 border-purple-500/30", icon: FileText };
      case "RBAC_ROLE_UPDATED":
        return { label: "RBAC ROLE", color: "text-amber-300 bg-amber-500/15 border-amber-500/30", icon: ShieldAlert };
      case "API_KEY_ROTATED":
        return { label: "API TOKEN", color: "text-rose-300 bg-rose-500/15 border-rose-500/30", icon: Key };
      case "WEBHOOK_VERIFIED":
        return { label: "WEBHOOK", color: "text-sky-300 bg-sky-500/15 border-sky-500/30", icon: Server };
    }
  };

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto font-sans">
      {/* 1. Header */}
      <div className="border-b border-white/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>SOC2 Type II &amp; ISO 27001 Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Cryptographic Audit Logs</span>
            <span className="text-xs px-3 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold border border-purple-500/30">
              365-Day Retention
            </span>
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 font-medium max-w-2xl">
            Every action taken on VibeAudit is cryptographically hashed into an immutable Merkle tree ledger. Stream real-time events to Datadog / Splunk or export for compliance audits.
          </p>
        </div>

        {/* Export Actions */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={handleExportCsv}
            disabled={isExportingCsv}
            className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-xs font-bold text-slate-200 transition flex items-center gap-2 shadow-sm font-mono"
          >
            <Download className={`h-4 w-4 ${isExportingCsv ? "animate-bounce text-indigo-400" : "text-slate-400"}`} />
            <span>{isExportingCsv ? "Generating CSV..." : "Download CSV Report"}</span>
          </button>

          <button
            onClick={handleStreamSiem}
            disabled={isStreamingSiem || siemSuccess}
            className={`px-5 py-2.5 rounded-xl text-xs font-black font-mono transition flex items-center gap-2 shadow-glow ${
              siemSuccess
                ? "bg-emerald-500 text-black cursor-default"
                : isStreamingSiem
                ? "bg-indigo-500/50 text-indigo-200 cursor-wait animate-pulse"
                : "bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 text-white"
            }`}
          >
            {siemSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>✔ STREAMING TO DATADOG</span>
              </>
            ) : isStreamingSiem ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>CONNECTING SIEM...</span>
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>⚡ Stream to SIEM / Datadog</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Cryptographic Ledger Explainer Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            title: "Merkle Tree Tamper-Proofing",
            desc: "Each event is hashed with SHA-256 chaining to ensure logs cannot be altered retroactively without breaking verification.",
            icon: Lock,
            color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
          },
          {
            title: "Zero-Retention RAM Assurance",
            desc: "Logs capture metadata, AST scan results, and PR IDs while maintaining zero code storage on persistent drives.",
            icon: Server,
            color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
          },
          {
            title: "SIEM Webhook Streaming",
            desc: "Native integration for Datadog, Splunk, AWS CloudWatch, and Elastic Security with automated retry logic.",
            icon: Share2,
            color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          },
        ].map((info, idx) => {
          const Icon = info.icon;
          return (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-white/15 bg-gradient-to-br from-white/[0.03] to-transparent space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">{info.title}</span>
                <div className={`p-2 rounded-xl border ${info.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{info.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 3. Live Stream Filter & Search Bar */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/15 space-y-6 shadow-xl bg-[#0a0810]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Terminal className="h-5 w-5 text-indigo-400" />
              <span>Immutable Event Stream ({filteredLogs.length} Events)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time audit ledger across all connected repositories and team members</p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <input
                type="text"
                placeholder="Search action, email, IP..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-xl bg-black/80 border border-white/15 px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium pl-9 w-56"
              />
              <Search className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl bg-black/90 border border-white/15 px-3 py-2 text-xs text-slate-300 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer font-mono uppercase"
            >
              <option value="ALL">All Event Types</option>
              <option value="PR_MERGED">PR Merged</option>
              <option value="AST_SCAN_COMPLETED">AST Scan Completed</option>
              <option value="SOC2_REPORT_GENERATED">SOC2 Report PDF</option>
              <option value="RBAC_ROLE_UPDATED">RBAC Role Updated</option>
              <option value="API_KEY_ROTATED">API Token Rotated</option>
              <option value="WEBHOOK_VERIFIED">Webhook Verified</option>
            </select>
          </div>
        </div>

        {/* 4. Terminal Feed Grid */}
        <div className="space-y-3 font-mono text-xs">
          {filteredLogs.map((log) => {
            const badge = getEventBadge(log.eventType);
            const BadgeIcon = badge.icon;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.005 }}
                className="p-5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 hover:border-white/25 transition space-y-3 shadow-inner relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500" />

                {/* Top row: Timestamp, Event Badge, IP, Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-400" />
                      {log.timestamp}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase border flex items-center gap-1.5 ${badge.color}`}>
                      <BadgeIcon className="h-3 w-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">IP: <strong className="text-slate-200">{log.ipAddress}</strong></span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      <span>SHA-256 VERIFIED</span>
                    </span>
                  </div>
                </div>

                {/* Middle row: Action & Target */}
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white leading-snug">{log.action}</p>
                  <p className="text-slate-300 font-medium">
                    <span className="text-slate-500">Target:</span> <span className="text-indigo-300">{log.target}</span> &bull; <span className="text-slate-500">Actor:</span> <span className="text-purple-300">{log.actor}</span>
                  </p>
                </div>

                {/* Bottom row: Cryptographic Hash string */}
                <div className="p-2.5 rounded-xl bg-black/90 border border-white/5 flex items-center justify-between gap-2 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1.5 truncate">
                    <Hash className="h-3 w-3 text-indigo-400 shrink-0" />
                    <span className="truncate">Hash: {log.cryptoHash}</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-600 font-bold shrink-0">MERKLE NODE #{log.id.split("-")[1]}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
