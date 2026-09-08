import React from "react";
import { CertificateClient } from "@/components/cert/certificate-client";

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  return {
    title: `${handle} — A+ Security Certificate | VibeAudit`,
    description: `${handle} has achieved an A+ VibeScore security grade. Verified by VibeAudit AI — zero critical vulnerabilities, SOC2-ready codebase.`,
    openGraph: {
      title: `${handle} earned an A+ Security Grade`,
      description: "Verified by VibeAudit AI — autonomous AST scanning, zero-retention RAM sandbox.",
      images: ["/og-cert.png"],
    },
  };
}

export default async function CertPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;

  // In production this would fetch real scan data from Supabase
  const certData = {
    handle,
    score: 98,
    grade: "A+",
    vulnsFixed: 14,
    prsOpened: 9,
    issuedAt: new Date().toISOString(),
    certId: `VA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    checks: [
      { label: "SQL / NoSQL Injection",    status: "clear" },
      { label: "Payment Logic Bypass",     status: "clear" },
      { label: "LLM Prompt Injection",     status: "clear" },
      { label: "Hardcoded Secrets",        status: "clear" },
      { label: "CSRF / Auth Bypass",       status: "clear" },
      { label: "Dependency CVEs",          status: "clear" },
    ],
  };

  return <CertificateClient cert={certData} />;
}
