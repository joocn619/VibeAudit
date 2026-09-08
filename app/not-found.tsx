import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0f] text-slate-100">
      <div className="glass-card max-w-md w-full rounded-2xl p-8 border border-white/10 text-center">
        <p className="text-5xl font-black text-gradient mb-3">404</p>
        <h1 className="text-xl font-extrabold mb-2 text-white">Page not found</h1>
        <p className="text-slate-400 text-sm mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 px-6 font-semibold text-white shadow-glow hover:opacity-95 transition"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}
