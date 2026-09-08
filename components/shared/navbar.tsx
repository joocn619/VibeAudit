import Link from "next/link";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
          <span className="h-3 w-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-glow"></span>
          Vibe<span className="text-indigo-400">Audit</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="#features" className="hover:text-white transition">Features</Link>
          <Link href="#pricing" className="hover:text-white transition">Pricing</Link>
          <Link href="/login" className="hover:text-white transition">Sign In</Link>
          <Link href="/signup" className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 font-semibold text-white shadow-glow hover:opacity-90 transition">
            Scan Free →
          </Link>
        </nav>
      </div>
    </header>
  );
}
