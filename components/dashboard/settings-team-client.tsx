"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Lock,
  Mail,
  Check,
  X,
  Trash2,
  RefreshCw,
  Key,
  Globe,
  Building2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Owner / CISO" | "Security Architect" | "Senior DevOps" | "External Auditor";
  status: "active" | "invited" | "suspended";
  twoFactor: boolean;
  lastActive: string;
  avatar: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: "usr-1",
    name: "Alex Trend",
    email: "trend@july-saas.studio",
    role: "Owner / CISO",
    status: "active",
    twoFactor: true,
    lastActive: "Just now",
    avatar: "AT",
  },
  {
    id: "usr-2",
    name: "Sarah Jenkins",
    email: "s.jenkins@july-saas.studio",
    role: "Security Architect",
    status: "active",
    twoFactor: true,
    lastActive: "2 hours ago",
    avatar: "SJ",
  },
  {
    id: "usr-3",
    name: "Marcus Vance",
    email: "m.vance@july-saas.studio",
    role: "Senior DevOps",
    status: "active",
    twoFactor: true,
    lastActive: "15 mins ago",
    avatar: "MV",
  },
  {
    id: "usr-4",
    name: "KPMG Compliance Auditor",
    email: "soc2-audit@kpmg-enterprise.com",
    role: "External Auditor",
    status: "invited",
    twoFactor: false,
    lastActive: "Pending Invitation",
    avatar: "KA",
  },
];

const ROLES_INFO = [
  {
    title: "Owner / CISO",
    badge: "Full Control",
    color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    desc: "Unrestricted access to billing, cryptographic audit logs, enterprise SAML/SSO settings, and repository deletion.",
  },
  {
    title: "Security Architect",
    badge: "Admin",
    color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    desc: "Can trigger autonomous AST scans, tune AI engineering prompt policies, and approve/merge security pull requests.",
  },
  {
    title: "Senior DevOps",
    badge: "Write / Merge",
    color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
    desc: "Can review side-by-side AST diffs, run sandboxed Nitro Enclave tests, and merge PRs to connected GitHub branches.",
  },
  {
    title: "External Auditor",
    badge: "Read-Only / SOC2",
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    desc: "Read-only access restricted to VibeScore metrics, vulnerability breakdowns, and exporting SOC2 / ISO 27001 PDF reports.",
  },
];

export function SettingsTeamClient() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<TeamMember["role"]>("Senior DevOps");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  // Enterprise SSO Toggle states
  const [samlEnabled, setSamlEnabled] = useState(true);
  const [scimEnabled, setScimEnabled] = useState(true);
  const [mfaEnforced, setMfaEnforced] = useState(true);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || isInviting) return;
    setIsInviting(true);

    setTimeout(() => {
      const nameGuess = newEmail.split("@")[0].replace(/[._-]/g, " ");
      const formattedName = nameGuess
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      const initials = formattedName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

      const newMember: TeamMember = {
        id: `usr-${Date.now()}`,
        name: formattedName || newEmail,
        email: newEmail,
        role: newRole,
        status: "invited",
        twoFactor: false,
        lastActive: "Pending Invitation",
        avatar: initials || "U",
      };

      setMembers((prev) => [newMember, ...prev]);
      setNewEmail("");
      setIsInviting(false);
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    }, 1000);
  };

  const handleRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRoleChange = (id: string, updatedRole: TeamMember["role"]) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role: updatedRole } : m))
    );
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "ALL" || m.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-10 pb-20 max-w-6xl mx-auto font-sans">
      {/* 1. Header */}
      <div className="border-b border-white/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            <Users className="h-3.5 w-3.5 text-purple-400" />
            <span>Enterprise Access Control</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Team &amp; RBAC Command</span>
            <span className="text-xs px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-bold border border-indigo-500/30">
              SAML 2.0 / SCIM Active
            </span>
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 font-medium max-w-2xl">
            Manage developer invitations, enforce Role-Based Access Control (RBAC), and configure Okta / Azure AD automated SCIM identity provisioning.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/[0.04] px-4 py-2.5 rounded-2xl border border-white/10 shrink-0">
          <Building2 className="h-4 w-4 text-indigo-400" />
          <span>Domain: <strong className="text-white">july-saas.studio</strong> (Verified ✔)</span>
        </div>
      </div>

      {/* 2. Enterprise SSO & SAML Provisioning Banner */}
      <div className="glass-card rounded-3xl p-8 border border-white/20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent space-y-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white flex items-center gap-2.5">
              <ShieldCheck className="h-5 w-5 text-indigo-400" />
              <span>Enterprise Identity &amp; Single Sign-On (SSO)</span>
            </h2>
            <p className="text-xs text-slate-300 font-medium">
              Automate user onboarding and offboarding through your corporate identity provider.
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase w-fit">
            ● Okta / Azure AD Connected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[
            {
              title: "Enforce SAML 2.0 SSO",
              desc: "Require all team members with @july-saas.studio emails to authenticate exclusively via SAML SSO.",
              state: samlEnabled,
              setter: setSamlEnabled,
            },
            {
              title: "Okta SCIM Provisioning",
              desc: "Automatically provision or suspend developer accounts in VibeAudit when changed in Okta.",
              state: scimEnabled,
              setter: setScimEnabled,
            },
            {
              title: "Enforce Hardware MFA / 2FA",
              desc: "Require WebAuthn or FIDO2 hardware passkeys for all users accessing production AST patches.",
              state: mfaEnforced,
              setter: setMfaEnforced,
            },
          ].map((sso, idx) => (
            <div
              key={idx}
              onClick={() => sso.setter(!sso.state)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                sso.state
                  ? "bg-black/60 border-indigo-500/40 shadow-md"
                  : "bg-white/[0.02] border-white/10 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white">{sso.title}</span>
                <div
                  className={`w-10 h-6 rounded-full transition-colors relative shrink-0 p-1 ${
                    sso.state ? "bg-gradient-to-r from-indigo-500 to-purple-600" : "bg-white/20"
                  }`}
                >
                  <motion.div
                    animate={{ x: sso.state ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="w-4 h-4 rounded-full bg-white shadow-md"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{sso.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Role-Based Access Control (RBAC) Explainer Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Lock className="h-5 w-5 text-purple-400" />
          <span>Granular Role Permissions (RBAC)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ROLES_INFO.map((role, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-5 border border-white/15 bg-white/[0.02] space-y-3 hover:border-white/25 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">{role.title}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase border ${role.color}`}>
                  {role.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Invite Member Form Bar */}
      <div className="glass-card rounded-3xl p-8 border border-white/15 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-indigo-400" />
              <span>Invite Developer or Auditor</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Invited members will receive an encrypted verification email with custom RBAC permissions.
            </p>
          </div>
          {inviteSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              <span>Invitation Sent Successfully!</span>
            </motion.div>
          )}
        </div>

        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <input
              type="email"
              placeholder="engineer@july-saas.studio or auditor@company.com..."
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full rounded-2xl bg-black/60 border border-white/15 px-4 py-3.5 text-sm text-white font-medium focus:outline-none focus:border-indigo-500 transition shadow-inner pl-11"
              required
            />
            <Mail className="h-4 w-4 text-slate-500 absolute left-4 top-4" />
          </div>

          <div className="w-full sm:w-56 shrink-0">
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as TeamMember["role"])}
              className="w-full rounded-2xl bg-black/80 border border-white/15 px-4 py-3.5 text-sm text-white font-bold focus:outline-none focus:border-indigo-500 transition shadow-inner cursor-pointer"
            >
              <option value="Senior DevOps">Senior DevOps (Write)</option>
              <option value="Security Architect">Security Architect (Admin)</option>
              <option value="External Auditor">External Auditor (Read-Only)</option>
              <option value="Owner / CISO">Owner / CISO (Full)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isInviting || !newEmail}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-xs font-mono transition flex items-center justify-center gap-2 shrink-0 ${
              isInviting
                ? "bg-indigo-500/50 text-indigo-200 cursor-wait"
                : "bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 hover:opacity-95 text-white shadow-glow"
            }`}
          >
            {isInviting ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Inviting...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                <span>Send Invite</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 5. Active Team Members List */}
      <div className="glass-card rounded-3xl p-8 border border-white/15 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-black text-white">Active Team &amp; Invitations ({members.length})</h3>
            <p className="text-xs text-slate-400 mt-0.5">Manage existing member roles and security status</p>
          </div>

          {/* Search & Role Filter */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search member..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl bg-black/60 border border-white/15 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl bg-black/80 border border-white/15 px-3 py-2 text-xs text-slate-300 font-bold focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="Owner / CISO">Owner / CISO</option>
              <option value="Security Architect">Security Architect</option>
              <option value="Senior DevOps">Senior DevOps</option>
              <option value="External Auditor">External Auditor</option>
            </select>
          </div>
        </div>

        {/* Member Grid/Table */}
        <div className="space-y-3">
          {filteredMembers.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black font-mono text-sm shrink-0 shadow-md ${
                    m.status === "invited"
                      ? "bg-slate-800 text-slate-400 border border-dashed border-slate-600"
                      : "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-glow"
                  }`}
                >
                  {m.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-white truncate">{m.name}</h4>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase border ${
                        m.status === "active"
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse"
                      }`}
                    >
                      {m.status === "active" ? "● Active" : "○ Invited"}
                    </span>
                    {m.twoFactor && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1" title="Hardware MFA Enforced">
                        <ShieldCheck className="h-3 w-3 text-indigo-400" />
                        <span>2FA Protected</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 truncate">{m.email} &bull; <span className="text-slate-500">{m.lastActive}</span></p>
                </div>
              </div>

              {/* Role Dropdown & Remove Button */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <select
                  value={m.role}
                  onChange={(e) => handleRoleChange(m.id, e.target.value as TeamMember["role"])}
                  className="rounded-xl bg-black/80 border border-white/15 px-3 py-1.5 text-xs font-bold text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Owner / CISO">Owner / CISO</option>
                  <option value="Security Architect">Security Architect</option>
                  <option value="Senior DevOps">Senior DevOps</option>
                  <option value="External Auditor">External Auditor</option>
                </select>

                {m.email !== "trend@july-saas.studio" && (
                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    title="Revoke Member Access"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
