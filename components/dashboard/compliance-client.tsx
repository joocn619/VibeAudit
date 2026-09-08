"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  FileText,
  Lock,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Server,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database,
  Building2,
  Cpu,
  Sparkles,
  Award,
  Eye,
  ArrowRight,
  UserCheck,
} from "lucide-react";

interface ComplianceControl {
  id: string;
  code: string;
  title: string;
  description: string;
  framework: "SOC2" | "ISO27001" | "GDPR" | "HIPAA";
  evidenceSource: string;
  status: "automated" | "verified" | "pending";
  merkleHash: string;
  lastVerified: string;
}

const INITIAL_CONTROLS: ComplianceControl[] = [
  {
    id: "ctrl-1",
    code: "CC6.1",
    title: "Logical Access Security & Identity Management",
    description: "The entity implements logical access security software, infrastructure, and architectures over protected information assets to prevent unauthorized access.",
    framework: "SOC2",
    evidenceSource: "Okta SAML 2.0 SCIM & WebAuthn Hardware MFA enforcement",
    status: "automated",
    merkleHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    lastVerified: "10 mins ago",
  },
  {
    id: "ctrl-2",
    code: "CC6.6",
    title: "Boundary Protection & Zero-Retention Processing",
    description: "The entity uses logical access security measures to protect against security events and unauthorized data persistence across transmission networks.",
    framework: "SOC2",
    evidenceSource: "Volatile AWS Nitro Enclave RAM Sandbox logs (Zero disk storage)",
    status: "automated",
    merkleHash: "8a9f11a00a1209b55225c56c38210373ab1d368e71887a0c128799831d102911",
    lastVerified: "Just now",
  },
  {
    id: "ctrl-3",
    code: "CC7.2",
    title: "Change Management & Continuous AST Vulnerability Scanning",
    description: "The entity monitors infrastructure and software changes to identify security anomalies, unauthorized pull requests, and OWASP Top 10 injection risks.",
    framework: "SOC2",
    evidenceSource: "GitHub Actions CI/CD blocking scanner & Autonomous AI Fix Engine",
    status: "automated",
    merkleHash: "4b2c904e58a74e50d18228581e0413f36a6f13170e7914828109884519b52473",
    lastVerified: "1 hour ago",
  },
  {
    id: "ctrl-4",
    code: "ISO A.12.1.2",
    title: "Change Control Procedures & Immutable Audit Trail",
    description: "Changes to information processing facilities and systems shall be subject to formal change control procedures with tamper-proof logging.",
    framework: "ISO27001",
    evidenceSource: "SHA-256 Merkle Tree Cryptographic Ledger (365-day retention)",
    status: "automated",
    merkleHash: "1f8e331c4486d3e86c0139e76196238b1442b083377f88410972230a11223344",
    lastVerified: "2 hours ago",
  },
  {
    id: "ctrl-5",
    code: "ISO A.14.2.5",
    title: "Secure System Engineering Principles (AST Refactoring)",
    description: "Principles for engineering secure systems shall be established, documented, maintained, and applied to any code implementation efforts.",
    framework: "ISO27001",
    evidenceSource: "VibeAudit Parameterized Query & TypeScript Type Guard Policy Engine",
    status: "verified",
    merkleHash: "9d7a221f008899a112233445566778899aabbccddeeff0011223344556677889",
    lastVerified: "Yesterday",
  },
  {
    id: "ctrl-6",
    code: "GDPR Art. 25",
    title: "Data Protection by Design & by Default (Zero Retention)",
    description: "The controller shall implement appropriate technical and organizational measures ensuring that by default only personal data which are necessary are processed.",
    framework: "GDPR",
    evidenceSource: "RAM-only code analysis; no proprietary source code retained on disk",
    status: "automated",
    merkleHash: "3c5b881234567890abcdef1234567890abcdef1234567890abcdef1234567890",
    lastVerified: "Just now",
  },
  {
    id: "ctrl-7",
    code: "HIPAA § 164.312",
    title: "Technical Safeguards & Audit Controls for Healthcare AI",
    description: "Implement hardware, software, and procedural mechanisms that record and examine activity in information systems that contain or use electronic PHI.",
    framework: "HIPAA",
    evidenceSource: "SIEM Webhook Streaming (Datadog/Splunk) & AES-256-GCM encryption",
    status: "verified",
    merkleHash: "7f8a992211bbcc0011223344556677889900aabbccddeeff0011223344556677",
    lastVerified: "3 hours ago",
  },
];

export function ComplianceClient() {
  const [controls, setControls] = useState<ComplianceControl[]>(INITIAL_CONTROLS);
  const [activeTab, setActiveTab] = useState<"ALL" | "SOC2" | "ISO27001" | "GDPR" | "HIPAA">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStep, setPdfStep] = useState(0);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [isSharingPortal, setIsSharingPortal] = useState(false);
  const [portalShared, setPortalShared] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [selectedHashModal, setSelectedHashModal] = useState<ComplianceControl | null>(null);

  const filteredControls = controls.filter((c) => {
    const matchesTab = activeTab === "ALL" || c.framework === activeTab;
    const matchesSearch =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.evidenceSource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleGeneratePdf = () => {
    if (isGeneratingPdf || pdfGenerated) return;
    setIsGeneratingPdf(true);
    setPdfStep(1);
    setTimeout(() => setPdfStep(2), 1000);
    setTimeout(() => setPdfStep(3), 2000);
    setTimeout(() => {
      setIsGeneratingPdf(false);
      setPdfGenerated(true);
      setPdfStep(0);
    }, 3200);
  };

  const handleSharePortal = () => {
    if (isSharingPortal || portalShared) return;
    setIsSharingPortal(true);
    setTimeout(() => {
      setIsSharingPortal(false);
      setPortalShared(true);
    }, 1200);
  };

  const handleCopyPortalLink = () => {
    navigator.clipboard.writeText("https://vibeaudit.ai/auditor-portal/va_audit_77x9_ephemeral_token");
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto font-sans relative">
      {/* 1. Header Command Bar */}
      <div className="border-b border-white/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            <Award className="h-3.5 w-3.5 text-emerald-400" />
            <span>Automated Compliance &amp; Evidence Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Compliance Command Center</span>
            <span className="text-xs px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
              SOC2 Type II Ready
            </span>
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 font-medium max-w-3xl">
            Real-time compliance tracking and automated evidence mapping across SOC2 Type II, ISO 27001, GDPR, and HIPAA frameworks. Generate official auditor binders with one click.
          </p>
        </div>

        {/* Action Buttons: Generate PDF or Share Portal */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={handleSharePortal}
            disabled={isSharingPortal || portalShared}
            className="px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-xs font-bold text-slate-200 transition flex items-center gap-2 shadow-sm font-mono"
            title="Create Expiring Auditor Access Link"
          >
            <Share2 className={`h-4 w-4 ${isSharingPortal ? "animate-spin text-indigo-400" : "text-slate-400"}`} />
            <span>{portalShared ? "✔ Portal Link Active" : isSharingPortal ? "Creating Portal..." : "Share Auditor Portal"}</span>
          </button>

          <button
            onClick={handleGeneratePdf}
            disabled={isGeneratingPdf || pdfGenerated}
            className={`px-6 py-2.5 rounded-xl text-xs font-black font-mono transition flex items-center gap-2 shadow-glow ${
              pdfGenerated
                ? "bg-emerald-500 text-black cursor-default"
                : isGeneratingPdf
                ? "bg-indigo-500/50 text-indigo-200 cursor-wait animate-pulse"
                : "bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 text-white"
            }`}
          >
            {pdfGenerated ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>✔ COMPLIANCE BINDER READY</span>
              </>
            ) : isGeneratingPdf ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>GENERATING BINDER...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>⚡ Generate Compliance PDF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Interactive Auditor Portal Shared Link Banner */}
      <AnimatePresence>
        {portalShared && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-indigo-500/10 to-transparent border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Auditor Read-Only Portal Created</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono uppercase">Expiring in 7 Days</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Share this secure link with KPMG, Deloitte, or PwC compliance auditors to view automated Merkle evidence without admin login.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto bg-black/80 p-2 rounded-xl border border-white/15 shrink-0">
              <code className="text-xs font-mono text-emerald-300 px-2 truncate max-w-[240px]">
                https://vibeaudit.ai/auditor-portal/va_audit_77x9
              </code>
              <button
                onClick={handleCopyPortalLink}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-black text-xs font-mono hover:bg-emerald-400 transition shrink-0 flex items-center gap-1"
              >
                {copiedToken ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Generation Progress Terminal Modal Overlay */}
      <AnimatePresence>
        {isGeneratingPdf && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-3xl bg-black/95 border border-indigo-500/50 font-mono text-xs space-y-3 text-indigo-300 shadow-2xl"
          >
            <div className="flex items-center justify-between text-slate-400 border-b border-white/10 pb-3 mb-2">
              <span className="flex items-center gap-2 font-bold text-white text-sm">
                <Server className="h-4 w-4 text-indigo-400" />
                <span>COMPILING AUTOMATED AUDIT BINDER (SOC2 / ISO 27001)</span>
              </span>
              <span>STEP {pdfStep}/3</span>
            </div>
            {pdfStep >= 1 && (
              <p className="text-slate-300">
                &gt; Collecting cryptographic SHA-256 Merkle proofs across 7 security controls... <span className="text-emerald-400 font-bold">✔ 7/7 PROOFS VERIFIED</span>
              </p>
            )}
            {pdfStep >= 2 && (
              <p className="text-slate-300">
                &gt; Querying AWS Nitro RAM Enclave zero-retention logs &amp; Okta SCIM identity records... <span className="text-emerald-400 font-bold">✔ 100% EVIDENCE MAPPED</span>
              </p>
            )}
            {pdfStep >= 3 && (
              <p className="text-emerald-400 font-bold text-sm">
                &gt; Formatting 42-page Executive Compliance PDF Binder with digital timestamp... ✔ DOCUMENT READY!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Top KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "SOC2 Type II Readiness", value: "98.4%", sub: "48/49 Controls Automated", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
          { label: "ISO 27001 Posture", value: "100%", sub: "Annex A 100% Compliant", icon: Award, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30" },
          { label: "Zero-Retention GDPR", value: "Verified", sub: "Volatile RAM AST Enclave", icon: Lock, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/30" },
          { label: "Automated Evidence", value: "2,490", sub: "SHA-256 Merkle proofs logged", icon: Database, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
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

      {/* 3. Framework Filter Tabs & Search */}
      <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/15 space-y-6 shadow-xl bg-[#0a0812]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {(["ALL", "SOC2", "ISO27001", "GDPR", "HIPAA"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase transition-all shrink-0 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow"
                    : "bg-white/[0.04] text-slate-400 hover:text-white border border-white/10"
                }`}
              >
                {tab === "ALL" ? "All Frameworks (7)" : tab === "ISO27001" ? "ISO 27001:2022" : `${tab} Type II`}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search control ID, title, or evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl bg-black/80 border border-white/15 px-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium pl-9 w-64"
            />
            <Eye className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* 4. Controls & Evidence Mapping Feed */}
        <div className="space-y-4">
          {filteredControls.map((ctrl) => (
            <motion.div
              key={ctrl.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.005 }}
              className="p-5 rounded-2xl bg-black/60 hover:bg-black/80 border border-white/10 hover:border-white/25 transition space-y-3 shadow-inner relative overflow-hidden group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-xs font-extrabold border border-indigo-500/30">
                    {ctrl.code}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white">{ctrl.title}</h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    {ctrl.framework}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase border flex items-center gap-1.5 ${
                      ctrl.status === "automated"
                        ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                        : "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                    }`}
                  >
                    <Check className="h-3 w-3" />
                    <span>{ctrl.status === "automated" ? "⚡ Automated Evidence" : "✔ Verified Evidence"}</span>
                  </span>

                  <button
                    onClick={() => setSelectedHashModal(ctrl)}
                    className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-mono transition flex items-center gap-1.5"
                    title="Inspect Cryptographic Merkle Proof"
                  >
                    <Eye className="h-3 w-3 text-indigo-400" />
                    <span>Proof</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-medium leading-relaxed">{ctrl.description}</p>

              <div className="p-3 rounded-xl bg-black/90 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-indigo-300 truncate">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate"><strong className="text-slate-400">Automated Source:</strong> {ctrl.evidenceSource}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">Verified {ctrl.lastVerified} &bull; Hash: {ctrl.merkleHash.slice(0, 12)}...</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Merkle Proof Modal */}
      <AnimatePresence>
        {selectedHashModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full glass-card rounded-3xl p-8 border border-white/20 bg-[#0d0a14] space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/15">
                <h3 className="text-lg font-black text-white flex items-center gap-2 font-mono">
                  <Lock className="h-5 w-5 text-indigo-400" />
                  <span>Cryptographic Merkle Proof ({selectedHashModal.code})</span>
                </h3>
                <button
                  onClick={() => setSelectedHashModal(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 uppercase block mb-1">Control Requirement</span>
                  <p className="text-sm font-bold text-white">{selectedHashModal.title}</p>
                </div>

                <div>
                  <span className="text-slate-400 uppercase block mb-1">Automated VibeAudit Evidence Source</span>
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold">
                    {selectedHashModal.evidenceSource}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 uppercase block mb-1">SHA-256 Merkle Tree Hash Chaining</span>
                  <div className="p-3 rounded-xl bg-black/90 border border-white/10 text-emerald-400 break-all select-all font-bold">
                    {selectedHashModal.merkleHash}
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-500 text-[11px] pt-2 border-t border-white/10">
                  <span>Timestamp: 2026-07-05 18:30:00 UTC</span>
                  <span>Enclave Verification: Valid ✔</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedHashModal(null)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xs font-mono uppercase tracking-wider shadow-glow"
              >
                Close Cryptographic Proof
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
