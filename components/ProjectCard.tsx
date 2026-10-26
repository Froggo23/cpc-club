import { ogImage, type Project } from "@/lib/projects";
import RepoShot from "./RepoShot";

const LANG_COLORS: Record<string, string> = {
  "C++": "#f34b7d",
  C: "#8aa0b5",
  Python: "#5aa9ff",
  Java: "#e8a33d",
  JavaScript: "#f1e05a",
  TypeScript: "#4fa3ff",
  Rust: "#dea584",
  Go: "#00add8",
  Kotlin: "#a97bff",
  Swift: "#f05138",
  "C#": "#68d36b",
  HTML: "#e34c26",
  Lua: "#7b7bff",
};

export default function ProjectCard({ p, eager = false, inert = false }: { p: Project; eager?: boolean; inert?: boolean }) {
  return (
    <a className="win card" href={p.repo_url} target="_blank" rel="noreferrer" tabIndex={inert ? -1 : undefined}>
      <div className="win-bar">
        <span className="win-title">
          {p.owner}/{p.repo}
        </span>
        <span className="win-btns" aria-hidden>
          <b>_</b>
          <b>□</b>
          <b>×</b>
        </span>
      </div>
      <div className="card-screen">
        <RepoShot src={ogImage(p)} name={p.repo} eager={eager} />
      </div>
      <div className="card-body">
        <h3 className="card-name">{p.repo.replace(/[-_]/g, " ")}</h3>
        <p className="card-desc">{p.description || "No description yet."}</p>
        <div className="card-meta">
          {p.language && (
            <span>
              <i style={{ background: LANG_COLORS[p.language] ?? "#cfe3ff" }} />
              {p.language}
            </span>
          )}
          <span>★ {p.stars}</span>
          <span className="card-author">by {p.author_name}</span>
        </div>
      </div>
    </a>
  );
}
