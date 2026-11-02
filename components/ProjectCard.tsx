import { ogImage, type Project } from "@/lib/projects";
import RepoShot from "./RepoShot";

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
            <span>{p.language}</span>
          )}
          <span>★ {p.stars}</span>
          <span className="card-author">by {p.author_name}</span>
        </div>
      </div>
    </a>
  );
}
