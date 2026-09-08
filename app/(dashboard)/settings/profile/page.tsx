"use client";

import React, { useState } from "react";
import { User, Mail, Shield, Key, Copy, Check, Lock, Save, Github, RefreshCw } from "lucide-react";

export default function ProfileSettingsPage() {
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("Alex Trend");
  const [company, setCompany] = useState("July SaaS Studio");
  const [apiKey, setApiKey] = useState("va_live_99fa8e7d6c5b4a39012384756abcdef");

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-10 pb-20 max-w-4xl mx-auto">
      {/* 1. Header */}
      <div className="border-b border-white/15 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Account &amp; <span className="text-gradient">Security Command</span>
        </h1>
        <p className="text-sm text-slate-300 font-medium mt-1">
          Manage your developer workspace profile, generate CLI API tokens, and configure security protocols.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Profile Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSave} className="glass-card rounded-3xl p-8 border border-white/15 space-y-6 shadow-xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-400" />
              <span>Workspace Profile Details</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase font-mono tracking-wider text-slate-300 mb-2">
                  Full Name / Developer Handle
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-2xl bg-black/50 border border-white/15 px-4 py-3.5 text-sm text-white font-medium focus:outline-none focus:border-indigo-500 transition shadow-inner"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase font-mono tracking-wider text-slate-300 mb-2">
                  Organization / Agency Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-2xl bg-black/50 border border-white/15 px-4 py-3.5 text-sm text-white font-medium focus:outline-none focus:border-indigo-500 transition shadow-inner"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase font-mono tracking-wider text-slate-300 mb-2">
                  Primary Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled
                    value="trend@july-saas.studio"
                    className="w-full rounded-2xl bg-black/80 border border-white/10 px-4 py-3.5 text-sm text-slate-400 font-medium cursor-not-allowed pl-11"
                  />
                  <Mail className="h-4 w-4 text-slate-500 absolute left-4 top-4" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-medium">
                  Connected via Supabase Auth. Email changes require verification.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs transition shadow-glow flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Saving Changes...</span>
                </>
              ) : saved ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  <span>Profile Updated!</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Workspace Profile</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: API Tokens & Security (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-white/15 bg-gradient-to-br from-indigo-500/10 to-transparent space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="h-4 w-4 text-indigo-400" />
                <span>VibeAudit CLI / API Token</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Use this secret key to integrate VibeAudit AST scanning directly into your GitHub Actions or GitLab CI pipelines.
            </p>

            <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between gap-2">
              <code className="text-xs font-mono text-indigo-300 truncate">{apiKey}</code>
              <button
                onClick={handleCopy}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition shrink-0"
                title="Copy API Key"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/15 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-400" />
              <span>Security &amp; GitHub Link</span>
            </h3>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-black/80 text-white border border-white/15">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">GitHub Workspace App</p>
                  <p className="text-[11px] text-slate-400">Connected as @trend-admin</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
