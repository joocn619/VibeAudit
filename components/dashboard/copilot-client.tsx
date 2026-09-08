"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  User,
  Send,
  Terminal,
  Code2,
  ShieldAlert,
  ShieldCheck,
  Check,
  Copy,
  RefreshCw,
  ArrowRight,
  GitPullRequest,
  FileText,
  Cpu,
  Lock,
  Zap,
  Layers,
  HelpCircle,
  ExternalLink,
  Github,
  Laptop,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  timestamp: string;
  content: string;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  actions?: {
    label: string;
    icon: any;
    actionType: "pr" | "copy" | "scan";
  }[];
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "ai",
    timestamp: "Just now",
    content:
      "Hello Alex! I am your **VibeAudit Autonomous Security Copilot**. I have real-time AST context across your **4 connected repositories** (`vibeaudit/saas-core`, `ai-billing-engine`, `nextjs-starter-pro`, and `crypto-auth-service`) operating in zero-retention RAM.\n\nI can hunt for complex vulnerabilities, generate CI/CD enforcement workflows, explain AST refactoring patches, or draft executive security compliance summaries. How can I assist your engineering team today?",
    actions: [
      { label: "Scan app/api/ for Auth Bypass", icon: ShieldAlert, actionType: "scan" },
      { label: "Generate GitHub Actions CI YAML", icon: Terminal, actionType: "copy" },
      { label: "Explain PR #117 SQLi Fix", icon: GitPullRequest, actionType: "pr" },
    ],
  },
];

const PRESET_PROMPTS = [
  {
    title: "🔍 Audit app/api/ for OWASP Top 10 Vulnerabilities",
    sub: "Scan Next.js App Router endpoints for broken access control & injection",
    promptText: "Audit our connected repositories for OWASP Top 10 vulnerabilities in app/api/ endpoints and highlight critical risks.",
    response: {
      content:
        "### 🚨 Security Audit Report: `app/api/` Endpoints\n\nI just performed a deep AST analysis across your active repositories in volatile AWS Nitro memory. I identified **1 critical vulnerability** and **2 hardening recommendations**:\n\n1. **Critical Injection Risk (`app/api/checkout/route.ts:42`)**: Direct string interpolation detected in SQL query construction. This has already been remediated via **Autonomous PR #117**.\n2. **Rate Limiting Hardening (`app/api/ai/generate/route.ts`)**: Upstash Redis sliding window rate limiter (10 req/min per IP) successfully verified.\n3. **JWT Expiration Check**: Ensure access tokens in `crypto-auth-service` enforce a maximum 15-minute TTL.",
      codeSnippet: {
        language: "typescript",
        filename: "lib/security/jwt-guard.ts",
        code: `// ✅ Recommended JWT Hardening Policy\nimport { jwtVerify } from "jose";\n\nexport async function verifySecureToken(token: string) {\n  const secret = new TextEncoder().encode(process.env.JWT_SECRET);\n  const { payload } = await jwtVerify(token, secret, {\n    issuer: "urn:vibeaudit:enterprise",\n    maxTokenAge: "15m", // Enforce strict 15-minute window\n  });\n  return payload;\n}`,
      },
      actions: [
        { label: "⚡ Review PR #117 in Fix Engine", icon: GitPullRequest, actionType: "pr" },
        { label: "📋 Copy JWT Guard Code", icon: Copy, actionType: "copy" },
      ],
    },
  },
  {
    title: "🛡️ Generate GitHub Actions CI/CD Blocking Workflow",
    sub: "Block insecure pull requests before merging into main",
    promptText: "Generate a production-ready GitHub Actions YAML workflow that runs VibeAudit AST scanning and blocks PRs with A- or lower grades.",
    response: {
      content:
        "### ⚡ Automated CI/CD Enforcement Workflow\n\nHere is your drop-in GitHub Actions workflow file. This configuration executes our CLI scanner inside a sandboxed runner, verifies your code against OWASP Top 10 standards, and **blocks pull requests** if the VibeScore drops below **90/100 (A Grade)**.",
      codeSnippet: {
        language: "yaml",
        filename: ".github/workflows/vibeaudit-security.yml",
        code: `name: VibeAudit Zero-Retention AST Scan\n\non:\n  pull_request:\n    branches: [main, staging]\n\njobs:\n  security-audit:\n    runs-on: ubuntu-latest\n    steps:\n      - name: Checkout Code Repository\n        uses: actions/checkout@v4\n\n      - name: Execute VibeAudit AST Scanner\n        uses: vibeaudit/action-scanner@v2\n        with:\n          api-key: \${{ secrets.VIBEAUDIT_API_TOKEN }}\n          enforce-zero-retention: true\n          min-vibescore: 90\n          fail-on-critical: true`,
      },
      actions: [
        { label: "📋 Copy Workflow YAML", icon: Copy, actionType: "copy" },
        { label: "✔ Mark CI Policy Active", icon: ShieldCheck, actionType: "scan" },
      ],
    },
  },
  {
    title: "📊 Draft Executive Security Summary for Board / Investors",
    sub: "Generate an SOC2 & ISO 27001 executive briefing",
    promptText: "Generate an executive security summary of our SaaS platform suitable for presenting to enterprise clients and series-A investors.",
    response: {
      content:
        "### 🏛️ Executive Security & Compliance Briefing\n\n**Prepared For:** Board of Directors & Enterprise Buyers\n**Date:** July 5, 2026\n**Platform Status:** **SOC2 Type II & ISO 27001 Ready**\n\n#### Executive Summary\nJuly SaaS Studio has achieved an exemplary **98/100 Fleet-Wide Security VibeScore** across 4 production repositories. Our architecture enforces a **Zero-Retention RAM Sandbox**, ensuring zero proprietary code is ever stored on third-party disks.\n\n#### Key Security Highlights:\n- **Automated Remediation:** 27 critical and moderate vulnerabilities autonomously patched via AST refactoring with a **99.8% CI/CD pass rate**.\n- **Tamper-Proof Audit Trail:** All administrative actions and merges are logged into an immutable SHA-256 Merkle tree ledger.\n- **Enterprise Identity:** SAML 2.0 Single Sign-On (SSO) and Okta SCIM automated provisioning enforced across all engineering roles.",
      actions: [
        { label: "📥 Download Compliance PDF", icon: FileText, actionType: "pr" },
        { label: "📋 Copy Executive Briefing", icon: Copy, actionType: "copy" },
      ],
    },
  },
  {
    title: "🔧 Explain PR #117 (Parameterized SQL Binding Fix)",
    sub: "Understand the AST mechanics behind our autonomous patch",
    promptText: "Explain how VibeAudit's AST engine detected the SQL injection in route.ts and why the parameterized array binding patch is secure.",
    response: {
      content:
        "### 🧠 AST Refactoring Mechanics: PR #117\n\nWhen our scanner analyzed `app/api/checkout/route.ts`, our Abstract Syntax Tree (AST) parser flagged a **BinaryExpression** node concatenating a raw string literal with user-controlled input (`userId`).\n\n#### Why this was dangerous:\nAn attacker could send a JSON payload like `{\"userId\": \"' OR '1'='1\"}`, bypassing authentication and exposing all customer billing profiles.\n\n#### How our AI Engine repaired it:\n1. Replaced the concatenation with a parameterized placeholder (`$1`).\n2. Injected an array binding `[userId]` into the database driver call.\n3. Added a runtime TypeScript type guard (`typeof userId !== 'string'`) before database execution.",
      codeSnippet: {
        language: "typescript",
        filename: "app/api/checkout/route.ts (AST Diff Preview)",
        code: `// Before (Vulnerable):\n// const query = "SELECT * FROM billing_profiles WHERE user_id = '" + userId + "'";\n\n// After (VibeAudit AST Patch):\nconst query = "SELECT * FROM billing_profiles WHERE user_id = $1";\nconst profile = await db.query(query, [userId]);`,
      },
      actions: [
        { label: "⚡ View in PR Command Center", icon: GitPullRequest, actionType: "pr" },
      ],
    },
  },
];

export function CopilotClient() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "integrations">("chat");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendPrompt = (promptText: string, presetResponse?: any) => {
    if (isTyping || !promptText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      timestamp: "Just now",
      content: promptText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponseContent = presetResponse || {
        content: `### 🛡️ AI Security Analysis Complete\n\nI have evaluated your request against our real-time AST graphs and OWASP Top 10 compliance rules. All connected repositories are currently maintaining an **A+ Security Posture (Score: 98/100)**.\n\nNo active anomalies or unpatched zero-day vulnerabilities were detected in volatile memory. Would you like me to trigger an active regression test across your staging branch?`,
        actions: [
          { label: "⚡ Trigger Staging Regression Test", icon: Terminal, actionType: "scan" },
          { label: "📋 Copy Security Certificate URL", icon: Copy, actionType: "copy" },
        ],
      };

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        timestamp: "Just now",
        content: aiResponseContent.content,
        codeSnippet: aiResponseContent.codeSnippet,
        actions: aiResponseContent.actions,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleActionClick = (actionType: string) => {
    if (actionType === "pr") {
      window.location.href = "/fixes";
    } else if (actionType === "copy") {
      alert("Snippet / report copied to clipboard successfully!");
    } else {
      alert("Autonomous scan initiated across connected repositories!");
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto font-sans">
      {/* 1. Header Command Bar */}
      <div className="border-b border-white/15 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Neural AI Security Assistant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>VibeAudit Copilot</span>
            <span className="text-xs px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
              ● 0.4s Latency
            </span>
          </h1>
          <p className="text-slate-300 text-sm mt-1.5 font-medium max-w-3xl">
            Interactive AST threat hunting, automated CI/CD workflow generation, and instant code refactoring explanations powered by volatile RAM context.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs font-mono transition-all ${
              activeTab === "chat"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow"
                : "bg-white/[0.05] text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Neural Threat Hunter</span>
          </button>
          <button
            onClick={() => setActiveTab("integrations")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs font-mono transition-all ${
              activeTab === "integrations"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-glow"
                : "bg-white/[0.05] text-slate-400 hover:text-white border border-white/10"
            }`}
          >
            <Laptop className="h-4 w-4" />
            <span>IDE &amp; CLI Ecosystem</span>
          </button>
        </div>
      </div>

      {/* 2. Main Content: Neural Chat OR Integrations */}
      {activeTab === "chat" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Main Chat Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Chat Feed Box */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/20 bg-[#0d0a14]/95 shadow-2xl space-y-6 min-h-[520px] max-h-[650px] overflow-y-auto flex flex-col justify-between">
              <div className="space-y-6">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                        msg.sender === "ai"
                          ? "bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-glow"
                          : "bg-slate-800 text-slate-300 border border-white/15"
                      }`}
                    >
                      {msg.sender === "ai" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl p-5 space-y-3 ${
                        msg.sender === "ai"
                          ? "bg-white/[0.04] border border-white/15 text-slate-200 shadow-md"
                          : "bg-indigo-600 text-white shadow-lg"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-slate-400 pb-2 border-b border-white/10">
                        <span className="font-bold text-white uppercase">{msg.sender === "ai" ? "VibeAudit Copilot" : "Alex Trend (Owner)"}</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">
                        {msg.content}
                      </div>

                      {/* Code Snippet Box */}
                      {msg.codeSnippet && (
                        <div className="mt-3 rounded-2xl bg-black/80 border border-white/15 overflow-hidden font-mono text-xs">
                          <div className="px-4 py-2 bg-white/[0.05] border-b border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                            <span className="text-indigo-300 font-bold flex items-center gap-1.5">
                              <Code2 className="h-3.5 w-3.5" />
                              <span>{msg.codeSnippet.filename}</span>
                            </span>
                            <button
                              onClick={() => handleCopyCode(msg.codeSnippet!.code, msg.id)}
                              className="flex items-center gap-1 px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white transition"
                            >
                              {copiedCode === msg.id ? (
                                <>
                                  <Check className="h-3 w-3 text-emerald-400" />
                                  <span className="text-emerald-400 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto text-indigo-200/90 leading-relaxed">
                            <code>{msg.codeSnippet.code}</code>
                          </pre>
                        </div>
                      )}

                      {/* Interactive Action Buttons */}
                      {msg.actions && (
                        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
                          {msg.actions.map((act, idx) => {
                            const ActIcon = act.icon;
                            return (
                              <button
                                key={idx}
                                onClick={() => handleActionClick(act.actionType)}
                                className="px-3.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-[11px] font-bold text-white transition flex items-center gap-1.5 shadow-sm font-mono"
                              >
                                <ActIcon className="h-3.5 w-3.5 text-indigo-400" />
                                <span>{act.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-xs font-mono text-indigo-300 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 w-fit">
                    <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                    <span>🧠 VibeAudit Neural Engine analyzing AST graph in volatile RAM...</span>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Bar */}
              <div className="pt-4 border-t border-white/10">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendPrompt(inputVal);
                  }}
                  className="flex items-center gap-3"
                >
                  <input
                    type="text"
                    placeholder="Ask Copilot to audit endpoints, write CI YAML, or explain CVEs..."
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    className="flex-1 rounded-2xl bg-black/80 border border-white/20 px-5 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition shadow-inner font-medium"
                  />
                  <button
                    type="submit"
                    disabled={isTyping || !inputVal.trim()}
                    className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-600 to-emerald-500 hover:opacity-95 text-white transition shadow-glow disabled:opacity-50 shrink-0"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Preset Threat Hunt Prompts (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-1 px-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold uppercase tracking-wider w-fit">
              ⚡ One-Click Threat Hunt Prompts
            </div>
            <div className="space-y-3">
              {PRESET_PROMPTS.map((preset, idx) => (
                <motion.div
                  key={idx}
                  onClick={() => handleSendPrompt(preset.promptText, preset.response)}
                  whileHover={{ scale: 1.02 }}
                  className="p-5 rounded-2xl glass-card border border-white/15 hover:border-indigo-500/50 bg-white/[0.02] hover:bg-white/[0.05] transition cursor-pointer space-y-1.5 shadow-md group relative overflow-hidden"
                >
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center justify-between">
                    <span>{preset.title}</span>
                    <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1 shrink-0" />
                  </h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">{preset.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* RAM Security Assurance Box */}
            <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 space-y-2 text-indigo-200">
              <div className="flex items-center gap-2 text-white font-bold text-xs font-mono uppercase tracking-wider">
                <Lock className="h-4 w-4 text-indigo-400" />
                <span>Zero-Retention Assurance</span>
              </div>
              <p className="text-xs text-indigo-100/80 leading-relaxed">
                All Copilot prompts and AST code snippets are processed inside volatile AWS Nitro Enclaves and discarded immediately after session termination.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* IDE & CLI Integrations Ecosystem Tab */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-indigo-400 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              Developer Ecosystem &amp; Plugins
            </span>
            <h2 className="text-3xl font-black text-white">Embed VibeAudit Into Your Workflow</h2>
            <p className="text-sm text-slate-300 font-medium">
              Install our zero-retention scanner directly into your favorite IDEs, local terminal CLI, or continuous integration pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Cursor IDE & VS Code Extension",
                badge: "v2.4.0 — Recommended",
                desc: "Real-time inline squiggly red security warnings and one-click AST refactoring suggestions as you type code in your editor.",
                cmd: "ext install vibeaudit.security-copilot",
                icon: Laptop,
                color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
              },
              {
                title: "GitHub Actions CI/CD Scanner",
                badge: "Official Action v2",
                desc: "Automatically scan pull requests in an isolated Docker container and block merges if critical OWASP vulnerabilities are detected.",
                cmd: "uses: vibeaudit/action-scanner@v2",
                icon: Github,
                color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
              },
              {
                title: "Local Terminal CLI (@vibeaudit/cli)",
                badge: "npm / pnpm / bun",
                desc: "Run lightning-fast offline AST audits from your terminal before pushing commits to your remote repository.",
                cmd: "npx -y @vibeaudit/cli scan --dir ./",
                icon: Terminal,
                color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
              },
              {
                title: "GitLab CI & Bitbucket Pipelines",
                badge: "Docker Container",
                desc: "Drop-in Docker container image compatible with self-hosted GitLab Runners and AWS CodeBuild environments.",
                cmd: "image: registry.vibeaudit.ai/scanner:latest",
                icon: Cpu,
                color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="glass-card rounded-3xl p-8 border border-white/15 bg-gradient-to-br from-white/[0.03] to-transparent space-y-5 shadow-xl hover:border-white/25 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-2xl border ${item.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-white">{item.title}</h3>
                        <span className="text-[11px] font-mono font-bold text-slate-400 uppercase">{item.badge}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 font-medium leading-relaxed">{item.desc}</p>

                  <div className="p-3.5 rounded-2xl bg-black/80 border border-white/15 font-mono text-xs text-indigo-300 flex items-center justify-between gap-2 shadow-inner">
                    <span className="truncate">{item.cmd}</span>
                    <button
                      onClick={() => handleCopyCode(item.cmd, `item-${idx}`)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition shrink-0 text-[11px]"
                    >
                      {copiedCode === `item-${idx}` ? "Copied!" : "Copy Command"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
