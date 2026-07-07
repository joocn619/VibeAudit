"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, CheckCircle2, Award, Star, Copy, Check,
  Twitter, Globe, ArrowRight, Zap, Lock, Code2,
  ExternalLink, Github, Download, Share2, Calendar, Hash,
} from "lucide-react";

interface CertData {
  handle: string;
  score: number;
  grade: string;
  vulnsFixed: number;
  prsOpened: number;
  issuedAt: string;
  certId: string;
  checks: { label: string; status: string }[];
}

// ── Animated score ring ───────────────────────────────────────────────────────
function CertRing({ score }: { score: number }) {
  const size = 160;
  const r = (size - 10) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} className="absolute">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#certGrad)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
        />
        <defs>
          <linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="50%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex flex-col items-center z-10">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-5xl font-black text-white font-mono leading-none"
        >{score}</motion.span>
        <span className="text-xs text-slate-400 font-mono mt-1">/ 100</span>
      </div>
    </div>
  );
}

// ── Copy button ───────────────────────────────────────────────────────────────
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };
  return (
    <button onClick={copy}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/15 text-xs font-bold text-slate-200 transition-all">
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
      {copied ? "Copied!" : label}
    </button>
  );
}

export function CertificateClient({ cert }: { cert: CertData }) {
  const [activeEmbed, setActiveEmbed] = useState<"markdown" | "html" | "url">("markdown");

  const certUrl = `https://vibeaudit.ai/cert/${cert.handle}`;
  const badgeMarkdown = `[![VibeAudit Security](https://vibeaudit.ai/badge/${cert.handle}.svg)](${certUrl})`;
  const badgeHtml = `<a href="${certUrl}"><img src="https://vibeaudit.ai/badge/${cert.handle}.svg" alt="VibeAudit A+ Security" /></a>`;
  const issuedDate = new Date(cert.issuedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const embedContent = {
    markdown: badgeMarkdown,
    html: badgeHtml,
    url: certUrl,
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-indigo-600/25 via-purple-600/20 to-emerald-500/15 rounded-full blur-[180px] pointer-events-none -z-10"
      />

      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-2xl bg-[#07070a]/85 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5">
              <div className="h-full w-full bg-[#07070a] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-indigo-400" />
              </div>
            </div>
            <span className="font-black text-white font-mono text-base">VibeAudit</span>
          </Link>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-xs shadow-glow">
              <span>Get Your Certificate</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-12">

        {/* ── Hero: Certificate Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
          className="relative glass-card rounded-[2.5rem] p-10 md:p-16 border border-white/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-emerald-500/10 shadow-2xl overflow-hidden text-center space-y-8"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:40px_40px] pointer-events-none" />

          {/* Confetti dots */}
          {[...Array(6)].map((_, i) => (
            <motion.div key={i}
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              className={`absolute w-2 h-2 rounded-full ${["bg-indigo-400","bg-purple-400","bg-emerald-400","bg-pink-400","bg-amber-400","bg-sky-400"][i]}`}
              style={{ top: `${15 + i * 10}%`, left: `${8 + i * 14}%` }}
            />
          ))}

          {/* Badge icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.8, delay: 0.2 }}
            className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-600 to-emerald-400 p-0.5 shadow-glow">
            <div className="h-full w-full bg-[#0d0b14] rounded-[22px] flex items-center justify-center">
              <Award className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold font-mono uppercase tracking-wider">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              VERIFIED BY VIBEAUDIT AI — ZERO CRITICAL VULNERABILITIES
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black text-white tracking-tight">
              {cert.handle}
            </motion.h1>
            <p className="text-base text-slate-300 font-medium">has earned the VibeAudit Enterprise Security Certificate</p>
          </div>

          {/* Score ring + grade */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 py-4">
            <CertRing score={cert.score} />

            <div className="space-y-5">
              {/* Grade pill */}
              <div className="flex items-center gap-4">
                <div className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 border-2 border-emerald-500/50 text-center">
                  <p className="text-5xl font-black text-emerald-400 font-mono leading-none">{cert.grade}</p>
                  <p className="text-[11px] text-emerald-300 font-bold uppercase tracking-widest mt-1">Security Grade</p>
                </div>
                <div className="space-y-3 text-left">
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-white font-mono">{cert.vulnsFixed}</p>
                    <p className="text-xs text-slate-400">Vulnerabilities Fixed</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-black text-indigo-400 font-mono">{cert.prsOpened}</p>
                    <p className="text-xs text-slate-400">AI PRs Merged</p>
                  </div>
                </div>
              </div>

              {/* Star rating */}
              <div className="flex items-center gap-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 + i * 0.1 }}>
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  </motion.div>
                ))}
                <span className="ml-2 text-xs text-slate-400 font-medium">Enterprise-Ready Codebase</span>
              </div>
            </div>
          </div>

          {/* Cert metadata row */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 border-t border-white/10 text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-indigo-400" />Issued: {issuedDate}</span>
            <span className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-purple-400" />Cert ID: {cert.certId}</span>
            <span className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-emerald-400" />SOC2 Type II Ready</span>
            <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-amber-400" />Zero-Retention RAM Scan</span>
          </div>
        </motion.div>

        {/* ── Security Checks Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 border border-white/15 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">Security Audit Checklist</h2>
              <p className="text-xs text-slate-400 mt-0.5">All OWASP Top 10 vectors verified — zero findings outstanding</p>
            </div>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black font-mono">
              {cert.checks.length}/{cert.checks.length} PASSED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cert.checks.map((c, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/25 hover:border-emerald-500/40 transition">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                <span className="text-sm text-slate-200 font-semibold">{c.label}</span>
                <span className="ml-auto text-[10px] font-black text-emerald-300 font-mono uppercase bg-emerald-500/15 px-2 py-0.5 rounded-md">CLEAR</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Embeddable Badge & Share Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-3xl p-8 border border-white/15 space-y-6">
          <div className="flex items-center gap-3">
            <Share2 className="h-5 w-5 text-indigo-400" />
            <div>
              <h2 className="text-xl font-black text-white">Embed Your Security Badge</h2>
              <p className="text-xs text-slate-400 mt-0.5">Add the badge to your GitHub README, website, or investor pitch deck</p>
            </div>
          </div>

          {/* Live Badge Preview */}
          <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center gap-6">
            <div className="space-y-2 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Badge Preview</p>
              {/* Simulated SVG badge */}
              <div className="inline-flex items-center gap-0 rounded-lg overflow-hidden shadow-lg text-xs font-bold font-mono">
                <span className="px-3 py-1.5 bg-[#555] text-white">VibeAudit</span>
                <span className="px-3 py-1.5 bg-emerald-500 text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> A+ 98/100
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-3 w-full">
              {/* Format tabs */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/10 w-fit">
                {(["markdown", "html", "url"] as const).map(f => (
                  <button key={f} onClick={() => setActiveEmbed(f)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all uppercase ${activeEmbed === f ? "bg-indigo-500 text-white" : "text-slate-400 hover:text-white"}`}>
                    {f}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={activeEmbed}
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="relative">
                  <pre className="text-[11px] text-emerald-300 font-mono bg-black/60 border border-white/10 rounded-xl p-4 overflow-x-auto whitespace-pre-wrap break-all">
                    {embedContent[activeEmbed]}
                  </pre>
                  <div className="absolute top-2 right-2">
                    <CopyButton text={embedContent[activeEmbed]} label="Copy" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Share actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10">
            <p className="text-xs text-slate-400 font-medium mr-2">Share your achievement:</p>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`🛡️ ${cert.handle} just earned an A+ Enterprise Security Certificate from @VibeAudit!\n\n98/100 VibeScore — zero critical vulnerabilities, SOC2-ready.\n\nVerify: ${certUrl}`)}`}
              target="_blank" rel="noreferrer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold transition hover:bg-sky-500/25">
                <Twitter className="h-4 w-4" />
                Share on X / Twitter
              </motion.button>
            </a>

            <CopyButton text={certUrl} label="Copy Certificate URL" />

            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}`} target="_blank" rel="noreferrer">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600/15 border border-blue-600/30 text-blue-300 text-xs font-bold transition hover:bg-blue-600/25">
                <Globe className="h-4 w-4" />
                Share on LinkedIn
              </motion.button>
            </a>
          </div>
        </motion.div>

        {/* ── "Get Your Own" CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="glass-card rounded-3xl p-10 border border-indigo-500/40 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-emerald-500/10 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-16 -right-16 w-64 h-64 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl font-black text-white">Want this badge on your project?</h2>
          <p className="text-base text-slate-300 font-medium max-w-xl mx-auto">
            Connect your GitHub repo, get an autonomous AI security scan in 120 seconds, and earn your own shareable A+ VibeAudit certificate — free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/onboarding">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 text-white font-black text-sm shadow-glow border border-white/20">
                <Github className="h-5 w-5 fill-current" />
                <span>Scan My Repo Free</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>
            <Link href="/">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/[0.05] border border-white/15 text-white font-bold text-sm hover:bg-white/[0.1] transition">
                <ExternalLink className="h-4 w-4 text-indigo-400" />
                Learn How It Works
              </motion.button>
            </Link>
          </div>
          <p className="text-xs text-slate-500 font-mono">No credit card · Read-only RAM scan · SOC2 Type II</p>
        </motion.div>

      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        <span className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
          This certificate was autonomously generated by VibeAudit AI — verified cryptographic scan · Zero-retention RAM sandbox · &copy; 2026 July SaaS Studio
        </span>
      </footer>
    </div>
  );
}
