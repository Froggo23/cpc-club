import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";

export type Project = {
  id: string;
  repo_url: string;
  owner: string;
  repo: string;
  description: string | null;
  language: string | null;
  stars: number;
  homepage: string | null;
  author_name: string;
  created_at: string;
};

export type UploadState =
  | { status: "idle" }
  | { status: "error"; message: string; values: { repo: string; author: string } }
  | { status: "ok"; repo: string };

export const PROJECTS_TAG = "projects";

export async function getProjects(limit?: number): Promise<Project[]> {
  "use cache";
  cacheTag(PROJECTS_TAG);
  cacheLife("minutes");

  let query = db().from("projects").select("*").order("created_at", { ascending: false });
  if (limit) query = query.limit(limit);
  const { data, error } = await query;
  if (error) {
    console.error("getProjects:", error.message);
    return [];
  }
  return data as Project[];
}

// GitHub renders a social card for every public repo; the first path segment is just a cache key.
export function ogImage(p: Pick<Project, "owner" | "repo">) {
  return `https://opengraph.githubassets.com/cpc/${p.owner}/${p.repo}`;
}
