import React from "react";
import { ScanReportClient } from "@/components/scan/scan-report-client";

interface ScanResultPageProps {
  params: Promise<{ repoId: string }> | { repoId: string };
}

export default async function ScanResultPage({ params }: ScanResultPageProps) {
  const resolvedParams = await params;
  const decodedRepoId = decodeURIComponent(resolvedParams.repoId);
  return <ScanReportClient repoId={decodedRepoId} />;
}
