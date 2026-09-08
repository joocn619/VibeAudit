"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Layers,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Cpu,
  Server,
  Database,
  Lock,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Eye,
  Activity,
  Sparkles,
  Share2,
  Check,
  Terminal,
  GitPullRequest,
  Network,
} from "lucide-react";

interface FleetNode {
  id: string;
  name: string;
  repo: string;
  cloud: "AWS EKS" | "GCP Cloud Run" | "Cloudflare Edge" | "Azure AKS";
  region: string;
  category: "LLM Pipeline" | "Core Service" | "Data & Auth" | "Edge Compute";
  techStack: string;
  aiModel?: string;
  vibeScore: number;
  grade: "A+" | "A" | "B+";
  status: "healthy" | "warning" | "patched";
  piiScrubbing: boolean;
  zeroRetention: boolean;
  latencyMs: number;
}

const INITIAL_NODES: FleetNode[] = [
  {
    id: "node-1",
    name: "AI Security Gateway & AST Scanner",
    repo: "vibeaudit/saas-core",
    cloud: "AWS EKS",
    region: "us-east-1 (N. Virginia)",
    category: "Core Service",
    techStack: "Next.js 15 • Node.js • Nitro Enclaves",
    aiModel: "Claude 3.5 Sonnet (Bedrock)",
    vibeScore: 98,
    grade: "A+",
    status: "healthy",
    piiScrubbing: true,
    zeroRetention: true,
    latencyMs: 12,
  },
  {
    id: "node-2",
    name: "Autonomous AI Billing & Quota Engine",
    repo: "ai-billing-engine",
    cloud: "GCP Cloud Run",
    region: "us-central1 (Iowa)",
    category: "Core Service",
    techStack: "Go 1.22 • Stripe API • gRPC",
    vibeScore: 96,
    grade: "A+",
    status: "healthy",
    piiScrubbing: true,
    zeroRetention: true,
    latencyMs: 18,
  },
  {
    id: "node-3",
    name: "LLM Prompt Injection Guard & Router",
    repo: "llm-gateway-proxy",
    cloud: "Cloudflare Edge",
    region: "Global Anycast (300+ Cities)",
    category: "LLM Pipeline",
    techStack: "Cloudflare Workers • Rust • Wasm",
    aiModel: "GPT-4o & Llama 3.1 405B",
    vibeScore: 99,
    grade: "A+",
    status: "healthy",
    piiScrubbing: true,
    zeroRetention: true,
    latencyMs: 4,
  },
  {
    id: "node-4",
    name: "Vector Embedding & RAG Indexer",
    repo: "vector-embedding-worker",
    cloud: "AWS EKS",
    region: "us-west-2 (Oregon)",
    category: "LLM Pipeline",
    techStack: "Python • Fastify • Pinecone Vector DB",
    aiModel: "text-embedding-3-large",
    vibeScore: 95,
    grade: "A",
    status: "healthy",
    piiScrubbing: true,
    zeroRetention: true,
    latencyMs: 24,
  },
  {
    id: "node-5",
    name: "Cryptographic Merkle Ledger & Auth",
    repo: "crypto-auth-service",
    cloud: "Azure AKS",
    region: "westeurope (Amsterdam)",
    category: "Data & Auth",
    techStack: "Rust • Supabase PostgreSQL • WebAuthn",
    vibeScore: 100,
    grade: "A+",
    status: "healthy",
    piiScrubbing: true,
    zeroRetention: true,
    latencyMs: 15,
  },
  {
    id: "node-6",
    name: "Real-Time SIEM Webhook Streamer",
    repo: "siem-datadog-streamer",
    cloud: "Cloudflare Edge",
    region: "Global Anycast",
    category: "Edge Compute",
    techStack: "Cloudflare Workers • Datadog API",
    vibeScore: 97,
    grade: "A+",
    status: "healthy",
    piiScrubbing: true,
    zeroRetention: true,
    latencyMs: 6,
  },
];

export function FleetClient() {
  const [nodes, setNodes] = useState<FleetNode[]>(INITIAL_NODES);
  const [activeTab, setActiveTab] = useState<"ALL" | "LLM Pipeline" | "Core Service" | "Data & Auth" | "Edge Compute">("ALL");
  const [isSimulatingBlast, setIsSimulatingBlast] = useState(false);
  const [simulationActive, setSimulationActive] = useState(false);
  const [isDeployingPatch, setIsDeployingPatch] = useState(false);
  const [patchDeployed, setPatchDeployed] = useState(false);
  const [selectedNodeModal, setSelectedNodeModal] = useState<FleetNode | null>(null);

  const filteredNodes = nodes.filter((n) => activeTab === "ALL" || n.category === activeTab);

  const handleSimulateBlast = () => {
    if (isSimulatingBlast || simulationActive) {
      setSimulationActive(false);
      setPatchDeployed(false);
      setNodes(INITIAL_NODES);
      return;
    }
    setIsSimulatingBlast(true);
    setTimeout(() => {
      setIsSimulatingBlast(false);
      setSimulationActive(true);
      // Mark LLM Gateway and Vector worker as under simulated threat
      setNodes((prev) =>
        prev.map((n) =>
          n.id === "node-3" || n.id === "node-4" ? { ...n, status: "warning", vibeScore: 74, grade: "B+" as const } : n
        )
      );
    }, 1200);
  };

  const handleDeployFleetPatch = () => {
    if (isDeployingPatch || patchDeployed) return;
    setIsDeployingPatch(true);
    setTimeout(() => {
      setIsDeployingPatch(false);
      setPatchDeployed(true);
      setNodes((prev) =>
        prev.map((n) =>
          n.status === "warning" ? { ...n, status: "patched", vibeScore: 99, grade: "A+" as const } : n
        )
      );
    }, 1800);
  };

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto font-sans relative">
      {/* 1. Header Command Bar */}
      <div className="border-b border-white/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            <Globe className="h-3.5 w-3.5 text-indigo-400" />
            <span>Multi-Cloud Fleet Command &amp; AI Supply Chain</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Fleet Topology Map</span>
            <span className="text-xs px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
              ● 4 Cloud Regions Active
            </span>
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 font-medium max-w-3xl">
            Real-time visual architecture map across AWS EKS, GCP Cloud Run, Azure AKS, and Cloudflare Edge. Monitor LLM prompt injection risks and simulate zero-day blast radius across your supply chain.
          </p>
        </div>

        {/* Action Button: Simulate Blast Radius */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleSimulateBlast}
            disabled={isSimulatingBlast}
            className={`px-6 py-3 rounded-xl text-xs font-black font-mono transition flex items-center gap-2 shadow-glow ${
              simulationActive
                ? "bg-amber-500 hover:bg-amber-600 text-black"
                : isSimulatingBlast
                ? "bg-purple-500/50 text-purple-200 cursor-wait animate-pulse"
                : "bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:opacity-95 text-white"
            }`}
          >
            {isSimulatingBlast ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>CALCULATING BLAST RADIUS...</span>
              </>
            ) : simulationActive ? (
              <>
                <AlertTriangle className="h-4 w-4" />
                <span>🛑 Reset Blast Simulation</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                <span>⚡ Simulate Zero-Day Blast Radius</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Interactive Blast Radius Simulation Banner */}
      <AnimatePresence>
        {simulationActive && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-6 rounded-3xl border flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl transition-all ${
              patchDeployed
                ? "bg-gradient-to-r from-emerald-500/20 via-indigo-500/10 to-transparent border-emerald-500/50"
                : "bg-gradient-to-r from-amber-500/20 via-red-500/15 to-transparent border-amber-500/50 animate-pulse"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-2xl border shrink-0 ${
                  patchDeployed ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                }`}
              >
                {patchDeployed ? <ShieldCheck className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-white">
                    {patchDeployed
                      ? "✔ Autonomous Fleet Patch Deployed & Verified"
                      : "🚨 Zero-Day Simulation: OWASP LLM01 Prompt Injection (CVE-2026-9912)"}
                  </h3>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                      patchDeployed ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {patchDeployed ? "Vulnerabilities Sealed" : "2 Nodes Affected"}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {patchDeployed
                    ? "VibeAudit Neural Engine deployed AST sanitization filters to LLM Gateway Proxy and Vector Indexer in volatile RAM. 0% downtime recorded."
                    : "Simulated untrusted user payload traversing Cloudflare Edge -> vector-embedding-worker. Downstream database read access compromised without input validation."}
                </p>
              </div>
            </div>

            {!patchDeployed && (
              <button
                onClick={handleDeployFleetPatch}
                disabled={isDeployingPatch}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-black text-xs font-mono uppercase tracking-wider shadow-glow transition shrink-0 flex items-center gap-2"
              >
                {isDeployingPatch ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>APPLYING AST FIREWALL...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>⚡ Deploy Fleet AST Firewall (1-Click)</span>
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Top KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Active Microservices", value: "14 Nodes", sub: "AWS EKS, GCP Run, Workers", icon: Layers, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" },
          { label: "AI Supply Chain Health", value: "99.2%", sub: "0 Prompt Injections / Leaks", icon: Sparkles, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
          { label: "Cross-Cloud Latency", value: "14ms", sub: "Global Anycast Edge Mesh", icon: Activity, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
          { label: "Enclave RAM Sandboxes", value: "100%", sub: "Zero Disk Persistence Verified", icon: Lock, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent space-y-3 shadow-md hover:border-white/25 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase font-bold text-slate-400">{stat.label}</span>
                <div className={`p-2 rounded-xl border ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono">{stat.value}</span>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{stat.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Fleet Topology & AI Supply Chain Grid */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/15 space-y-6 shadow-xl bg-[#0a0812]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(["ALL", "LLM Pipeline", "Core Service", "Data & Auth", "Edge Compute"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all shrink-0 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow"
                    : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {tab === "ALL" ? "All Cloud Nodes (6)" : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Real-Time Enclave Mesh Syncing</span>
          </div>
        </div>

        {/* Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNodes.map((node) => (
            <motion.div
              key={node.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-3xl border transition space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between ${
                node.status === "warning"
                  ? "bg-gradient-to-br from-amber-500/15 via-red-500/10 to-transparent border-amber-500/50"
                  : node.status === "patched"
                  ? "bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent border-emerald-500/50"
                  : "bg-black/80 hover:bg-black/95 border-white/15 hover:border-white/30"
              }`}
            >
              <div className="space-y-3">
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-white/[0.06] border border-white/15 text-slate-300 font-mono text-[10px] font-bold uppercase truncate">
                    {node.cloud}
                  </span>
                  <span
                    className={`text-xs font-mono font-black px-3 py-1 rounded-full border ${
                      node.status === "warning"
                        ? "bg-red-500/20 text-red-300 border-red-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {node.vibeScore} / {node.grade}
                  </span>
                </div>

                {/* Title & Repo */}
                <div>
                  <h4 className="text-base font-black text-white leading-snug">{node.name}</h4>
                  <span className="text-xs font-mono text-indigo-400 font-bold block mt-0.5">{node.repo}</span>
                </div>

                {/* Tech Stack & AI Model */}
                <div className="space-y-1.5 text-xs font-medium text-slate-300 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Stack:</span>
                    <span className="font-mono text-[11px] text-slate-200 truncate max-w-[180px]">{node.techStack}</span>
                  </div>
                  {node.aiModel && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">AI Model:</span>
                      <span className="font-mono text-[11px] text-purple-300 font-bold truncate max-w-[180px] flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        <span>{node.aiModel}</span>
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Region:</span>
                    <span className="font-mono text-[11px] text-slate-400 truncate max-w-[180px]">{node.region}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 font-bold">
                  <Check className="h-3 w-3" />
                  <span>PII Scrubbed</span>
                </div>

                <button
                  onClick={() => setSelectedNodeModal(node)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Inspect AST</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Node AST Inspection Modal */}
      <AnimatePresence>
        {selectedNodeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full glass-card rounded-3xl p-8 border border-white/20 bg-[#0d0a14] space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <h3 className="text-lg font-black text-white flex items-center gap-2 font-mono">
                  <Cpu className="h-5 w-5 text-indigo-400" />
                  <span>Node AST Lineage &amp; Supply Chain ({selectedNodeModal.repo})</span>
                </h3>
                <button
                  onClick={() => setSelectedNodeModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-slate-400 uppercase block mb-1">Cloud Deployment</span>
                    <strong className="text-white text-sm">{selectedNodeModal.cloud} ({selectedNodeModal.region})</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <span className="text-slate-400 uppercase block mb-1">Security Posture</span>
                    <strong className="text-emerald-400 text-sm">VibeScore {selectedNodeModal.vibeScore} / {selectedNodeModal.grade} ✔</strong>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 uppercase block mb-1">AI Model Supply Chain Safeguards</span>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold space-y-1">
                    <p>&bull; Prompt Injection Defense: Active (OWASP LLM01 verified)</p>
                    <p>&bull; PII / PHI Data Scrubbing: Enabled (Regex &amp; NLP masking)</p>
                    <p>&bull; Zero-Retention Enclave: Volatile AWS Nitro RAM verified</p>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 uppercase block mb-1">Automated AST Refactoring History</span>
                  <div className="p-3 rounded-xl bg-black/90 border border-white/10 text-slate-300 space-y-2">
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>✔ PR #117: SQLi Parameterized Array Binding</span>
                      <span>Merged</span>
                    </div>
                    <div className="flex items-center justify-between text-indigo-300 font-bold">
                      <span>✔ PR #114: Upstash Redis Sliding Window Rate Limiter</span>
                      <span>Merged</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedNodeModal(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xs font-mono uppercase tracking-wider shadow-glow"
              >
                Close Node Topology
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
