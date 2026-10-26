import Link from "next/link";
import type { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

// Pure-CSS marquee: the track holds the list twice and slides by exactly half its width.
export default function Marquee({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="win empty">
        <div className="win-bar">
          <span className="win-title">recent_projects.exe</span>
        </div>
        <div className="empty-body">
          <p>No projects uploaded yet.</p>
          <Link href="/upload" className="btn-aqua btn-small">
            Be the first →
          </Link>
        </div>
      </div>
    );
  }

  // Repeat short lists so one half of the track is always wider than the screen.
  const reps = Math.ceil(6 / projects.length);
  const half = Array.from({ length: reps }, () => projects).flat();
  const seconds = half.length * 6;

  return (
    <div className="marquee" style={{ ["--dur" as string]: `${seconds}s` }}>
      <div className="marquee-track">
        {[...half, ...half].map((p, i) => (
          <div key={i} className="marquee-item" aria-hidden={i >= projects.length ? true : undefined}>
            <ProjectCard p={p} eager={i < 4} inert={i >= projects.length} />
          </div>
        ))}
      </div>
    </div>
  );
}
