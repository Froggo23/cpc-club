"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/showcase", label: "Showcase" },
  { href: "/upload", label: "Upload" },
];

export default function Nav() {
  const path = usePathname();
  return (
    <header className="nav">
      <Link href="/" className="nav-logo">
        CPC
      </Link>
      <nav className="nav-links">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="nav-link" aria-current={path === l.href ? "page" : undefined}>
            [{l.label}]
          </Link>
        ))}
      </nav>
    </header>
  );
}
