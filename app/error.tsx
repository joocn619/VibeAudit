"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Wire this to your monitoring provider (e.g. Sentry) in production.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0f] text-slate-100">
      <div className="glass-card max-w-md w-full rounded-2xl p-8 border border-white/10 text-center">
        <h1 className="text-2xl font-extrabold mb-2 text-white">Something went wrong</h1>
        <p className="text-slate-400 text-sm mb-6">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-6 font-semibold text-white shadow-glow hover:opacity-95 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
