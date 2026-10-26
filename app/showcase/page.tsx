import type { Metadata } from "next";
import Link from "next/link";
import HalftoneText from "@/components/HalftoneText";
import ProjectCard from "@/components/ProjectCard";
import Scene from "@/components/Scene";
import { getProjects } from "@/lib/projects";

export const metadata: Metadata = { title: "Showcase · Competitive Programming Club" };

export default async function Showcase() {
  const projects = await getProjects();

  return (
    <main className="page">
      <Scene tone="indigo" />

      <header className="page-head">
        <p className="kicker pixel">student projects // live archive</p>
        <HalftoneText as="h1" label="Showcase" lines={["SHOWCASE"]} cell={6} smear={0.06} blur={0.035} interactive />
        <div className="page-sub">
          <p className="serif-lede">
            Everything our students have <em>built, broken &amp; shipped.</em>
          </p>
          <p className="pixel counter">{String(projects.length).padStart(3, "0")} projects loaded</p>
        </div>
      </header>

      {projects.length ? (
        <section className="grid">
          {projects.map((p, i) => (
            <div key={p.id} className="reveal">
              <ProjectCard p={p} eager={i < 6} />
            </div>
          ))}
        </section>
      ) : (
        <div className="win empty">
          <div className="win-bar">
            <span className="win-title">showcase.exe</span>
          </div>
          <div className="empty-body">
            <p>The showcase is empty — for now.</p>
            <Link href="/upload" className="btn-aqua btn-small">
              Upload a project →
            </Link>
          </div>
        </div>
      )}

      <footer className="foot pixel">© 2026 Competitive Programming Club</footer>
    </main>
  );
}
