import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vibeaudit.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "VibeAudit — Security Scanner for AI-Built Apps",
  description:
    "Built your app with AI? Scan it before it gets hacked. Connect GitHub repo → get Security Score + plain-English report → click Fix it for me to auto-open a GitHub PR.",
  openGraph: {
    title: "VibeAudit — Security Scanner for AI-Built Apps",
    description:
      "Connect GitHub repo → get Security Score (0-100) + plain-English report → click Fix it for me to auto-open a GitHub PR.",
    type: "website",
    url: appUrl,
    siteName: "VibeAudit",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeAudit — Security Scanner for AI-Built Apps",
    description:
      "Connect GitHub repo → get Security Score (0-100) + plain-English report → click Fix it for me to auto-open a GitHub PR.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${jakarta.variable}`} style={{ colorScheme: "dark" }}>
      <body className={`${jakarta.className} min-h-screen bg-[#0a0a0f] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}>
        {children}
      </body>
    </html>
  );
}
