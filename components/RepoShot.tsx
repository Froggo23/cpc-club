"use client";

import { useState } from "react";

// GitHub's social card, or a dotted placeholder if GitHub can't render one.
export default function RepoShot({ src, name, eager }: { src: string; name: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="card-screen-fallback">{name}</div>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading={eager ? "eager" : "lazy"}
      onError={() => setFailed(true)}
      // the error can fire before hydration attaches onError
      ref={(el) => {
        if (el?.complete && el.naturalWidth === 0) setFailed(true);
      }}
    />
  );
}
