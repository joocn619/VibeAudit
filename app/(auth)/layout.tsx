import React from "react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0f] p-4 text-slate-100 bg-mesh">
      <div className="mb-8">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl tracking-tight">
          <span className="h-3.5 w-3.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-glow"></span>
          Vibe<span className="text-indigo-400">Audit</span>
        </Link>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
      <div className="mt-8 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} VibeAudit. Security monitoring &amp; evidence.
      </div>
    </div>
  );
}
