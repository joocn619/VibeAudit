import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 text-center">
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
          Built your app with AI? <br />
          <span className="text-gradient">Scan it before it gets hacked.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-8">
          Security scanner for AI-built apps (Cursor / Lovable / Bolt / Claude Code).
          Connect a GitHub repo → get a Security Score (0–100) + plain-English reports → auto-open fix PRs.
        </p>
      </div>
    </section>
  );
}
