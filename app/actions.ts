"use server";

import { updateTag } from "next/cache";
import { db } from "@/lib/db";
import { PROJECTS_TAG, type UploadState } from "@/lib/projects";

const REPO_RE = /^(?:https?:\/\/)?(?:www\.)?(?:github\.com\/)?([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]{1,100}?)(?:\.git)?(?:[/?#].*)?$/;

type RepoInfo = {
  owner: string;
  repo: string;
  description: string | null;
  language: string | null;
  stars: number;
  homepage: string | null;
};

async function lookupRepo(owner: string, repo: string): Promise<RepoInfo | "missing"> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "cpc-club-showcase",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers, cache: "no-store" });
  if (res.ok) {
    const r = await res.json();
    if (r.private) return "missing";
    const [o, n] = String(r.full_name).split("/");
    return {
      owner: o,
      repo: n,
      description: r.description,
      language: r.language,
      stars: r.stargazers_count ?? 0,
      homepage: r.homepage || null,
    };
  }
  if (res.status === 404) return "missing";

  // Rate-limited or GitHub hiccup: fall back to checking the public page exists.
  const page = await fetch(`https://github.com/${owner}/${repo}`, { method: "HEAD", cache: "no-store" });
  if (!page.ok) return "missing";
  return { owner, repo, description: null, language: null, stars: 0, homepage: null };
}

export async function uploadProject(_prev: UploadState, form: FormData): Promise<UploadState> {
  // Honeypot: real people never see this field.
  if (String(form.get("website") ?? "")) return { status: "ok", repo: "" };

  const rawUrl = String(form.get("repo") ?? "").trim();
  const author = String(form.get("author") ?? "").trim().replace(/\s+/g, " ");

  // React resets the form after an action, so hand the inputs back on failure.
  const fail = (message: string): UploadState => ({ status: "error", message, values: { repo: rawUrl, author } });

  const match = rawUrl.match(REPO_RE);
  if (!match) return fail("That doesn't look like a GitHub repo link. Try github.com/you/your-project.");
  if (!author) return fail("Add your name so people know who built it.");
  if (author.length > 60) return fail("Keep your name under 60 characters.");

  let info: RepoInfo | "missing";
  try {
    info = await lookupRepo(match[1], match[2]);
  } catch {
    return fail("Couldn't reach GitHub. Try again in a minute.");
  }
  if (info === "missing") return fail("Repo not found. Make sure it exists and is public.");

  const repo_url = `https://github.com/${info.owner}/${info.repo}`;
  const { error } = await db().from("projects").insert({ ...info, repo_url, author_name: author });
  if (error) {
    if (error.code === "23505") return fail("That repo is already on the showcase.");
    console.error("uploadProject:", error.message);
    return fail("Something went wrong saving your project. Try again.");
  }

  updateTag(PROJECTS_TAG);
  return { status: "ok", repo: `${info.owner}/${info.repo}` };
}
