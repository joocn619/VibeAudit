// Ephemeral Scan Worker Entry Point
// This runs on Railway / Fly as a separate service to execute Semgrep CLI

export async function runWorkerJob(jobId: string) {
  console.log(`[Worker] Starting scan job: ${jobId}`);
  return { status: "completed", jobId };
}
