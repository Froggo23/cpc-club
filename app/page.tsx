import Link from "next/link";
import HalftoneText from "@/components/HalftoneText";
import Marquee from "@/components/Marquee";
import Scene from "@/components/Scene";
import { getProjects } from "@/lib/projects";

export default async function Home() {
  const recent = await getProjects(12);

  return (
    <main className="page">
      <Scene tone="teal" />

      <section className="hero">
        <HalftoneText
          as="h1"
          label="Competitive Programming Club"
          lines={["COMPETITIVE", "PROGRAMMING"]}
          cell={6.5}
          blur={0.07}
          interactive
          className="hero-title"
        />
        <HalftoneText lines={["</>"]} label="" cell={16} blur={0.1} className="hero-glyph" />

        <div className="hero-row">
          <p className="hero-club">
            <span className="tag">2.0</span>
            Club
          </p>
          <p className="hero-stack">
            <span>Where</span>
            <span>Algorithms</span>
            <span className="small">meet</span>
            <span>Imagination</span>
          </p>
        </div>

        <Link href="/showcase" className="btn-aqua btn-explore">
          Explore <span aria-hidden>→</span>
        </Link>
      </section>

      <section className="recent">
        <div className="section-head">
          <h2 className="pixel">recent_projects.exe</h2>
          <span className="rule" />
          <Link href="/showcase" className="pixel link-dim">
            view all ›
          </Link>
        </div>
        <Marquee projects={recent} />
      </section>

      <footer className="foot pixel">© 2026 Competitive Programming Club · compile · submit · repeat</footer>
    </main>
  );
}
