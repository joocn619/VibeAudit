import type { ScanFile } from "@/lib/scan/rules";

const CODE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|sql|py|rb|go|php|env|yml|yaml|json)$/i;
const SKIP_PATH = /(^|\/)(node_modules|\.next|dist|build|\.git|vendor|coverage)\//;
const MAX_FILES = 400;
const MAX_FILE_BYTES = 512 * 1024;
const CONCURRENCY = 12;

export interface FetchedRepo {
  fullName: string;
  githubRepoId: number;
  branch: string;
  commitSha: string | null;
  files: ScanFile[];
  truncated: boolean;
}

function ghHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "VibeAudit-Scanner",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  // Optional token raises rate limits and enables private repos. Never hardcoded.
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function ghJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: ghHeaders(), cache: "no-store" });
  if (res.status === 404) throw new Error("Repository or branch not found (is it public?)");
  if (res.status === 403) throw new Error("GitHub API rate limit hit — set GITHUB_TOKEN to raise it");
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  return res.json();
}

/** Run an async mapper over items with a bounded concurrency pool. */
async function pool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (cursor < items.length) {
      const i = cursor++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

/** Parse "owner/repo", a full GitHub URL, or "owner/repo/tree/branch". */
export function parseRepoInput(input: string): { fullName: string; branch?: string } | null {
  const cleaned = input.trim().replace(/^https?:\/\/github\.com\//i, "").replace(/\.git$/i, "");
  const treeMatch = cleaned.match(/^([^/]+)\/([^/]+)\/tree\/(.+)$/);
  if (treeMatch) return { fullName: `${treeMatch[1]}/${treeMatch[2]}`, branch: treeMatch[3] };
  const m = cleaned.match(/^([^/\s]+)\/([^/\s]+)$/);
  if (m) return { fullName: `${m[1]}/${m[2]}` };
  return null;
}

/**
 * Fetch a repository's scannable files. Uses the Git Trees API to list files
 * (one API call) and raw.githubusercontent.com to download contents (which is
 * NOT counted against the API rate limit), so a public repo scans without a
 * token. Provide GITHUB_TOKEN for private repos or higher limits.
 */
export async function fetchRepoFiles(fullName: string, branch?: string): Promise<FetchedRepo> {
  // Repo metadata gives us the numeric id and the default branch.
  const repo = await ghJson(`https://api.github.com/repos/${fullName}`);
  const githubRepoId: number = repo.id;
  const ref = branch || repo.default_branch || "main";

  const tree = await ghJson(
    `https://api.github.com/repos/${fullName}/git/trees/${encodeURIComponent(ref!)}?recursive=1`
  );
  const commitSha: string | null = tree.sha ?? null;

  const blobs = (tree.tree || [])
    .filter((n: any) => n.type === "blob" && typeof n.path === "string")
    .filter((n: any) => CODE_EXT.test(n.path) && !SKIP_PATH.test(n.path))
    .filter((n: any) => typeof n.size !== "number" || n.size <= MAX_FILE_BYTES);

  const truncated = Boolean(tree.truncated) || blobs.length > MAX_FILES;
  const selected = blobs.slice(0, MAX_FILES);

  const files = await pool(selected, CONCURRENCY, async (node: any): Promise<ScanFile | null> => {
    const rawUrl = `https://raw.githubusercontent.com/${fullName}/${encodeURIComponent(ref!)}/${node.path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;
    try {
      const res = await fetch(rawUrl, { headers: ghHeaders(), cache: "no-store" });
      if (!res.ok) return null;
      const content = await res.text();
      if (content.length > MAX_FILE_BYTES) return null;
      return { path: node.path, content };
    } catch {
      return null;
    }
  });

  return {
    fullName,
    githubRepoId,
    branch: ref,
    commitSha,
    files: files.filter((f): f is ScanFile => f !== null),
    truncated,
  };
}
