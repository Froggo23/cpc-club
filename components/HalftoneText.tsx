"use client";

import { useEffect, useRef, type ElementType } from "react";

type Props = {
  /** Each entry is drawn on its own line, scaled so the widest line fills the width. */
  lines: string[];
  /** Accessible text; the canvas itself is decorative. */
  label: string;
  as?: ElementType;
  /** Grid pitch in px per 1000px of width — smaller means finer dots. */
  cell?: number;
  /** Glyph softness as a fraction of the font size; this is what makes dot sizes taper at the edges. */
  blur?: number;
  /** Horizontal ghost trail to the left, as a fraction of the width (the "Wild West" smear). */
  smear?: number;
  lineHeight?: number;
  align?: "left" | "center";
  /** Dots shrink away from the cursor. */
  interactive?: boolean;
  color?: string;
  className?: string;
};

export default function HalftoneText({
  lines,
  label,
  as: Tag = "div",
  cell = 7,
  blur = 0.045,
  smear = 0,
  lineHeight = 0.92,
  align = "left",
  interactive = false,
  color = "#f2fbff",
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const key = lines.join("\n");

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const family = getComputedStyle(canvas).fontFamily;
    const text = key.split("\n");

    let samples = new Float32Array(0);
    let cols = 0;
    let rows = 0;
    let pitch = 0;
    let W = 0;
    let H = 0;
    let raf = 0;
    let visible = true;
    let disposed = false;
    const mouse = { x: -1e4, y: -1e4 };

    function build() {
      W = wrap!.clientWidth;
      if (!W) return;

      const probe = document.createElement("canvas").getContext("2d")!;
      probe.font = `100px ${family}`;
      const widest = Math.max(...text.map((l) => probe.measureText(l).width));
      const size = ((100 * W) / widest) * 0.97;
      const lh = size * lineHeight;
      H = Math.ceil(lh * (text.length - 1) + size * 0.86);

      const src = document.createElement("canvas");
      src.width = W;
      src.height = H;
      const s = src.getContext("2d", { willReadFrequently: true })!;
      s.fillStyle = "#000";
      s.fillRect(0, 0, W, H);
      s.font = `${size}px ${family}`;
      s.textAlign = align;
      s.fillStyle = "#fff";
      s.filter = `blur(${Math.max(0.5, size * blur)}px)`;
      const x = align === "center" ? W / 2 : W * 0.015;
      text.forEach((line, i) => {
        const y = lh * i + size * 0.76;
        if (smear) {
          for (let k = 8; k >= 1; k--) {
            s.globalAlpha = 0.16 * (1 - k / 9);
            s.fillText(line, x - (k / 8) * smear * W, y);
          }
        }
        s.globalAlpha = 1;
        s.fillText(line, x, y);
      });

      pitch = Math.max(3, Math.round((cell * W) / 1000));
      cols = Math.floor(W / pitch);
      rows = Math.floor(H / pitch);
      const data = s.getImageData(0, 0, W, H).data;
      samples = new Float32Array(cols * rows);
      const half = Math.floor(pitch / 2);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          samples[r * cols + c] = data[((r * pitch + half) * W + c * pitch + half) * 4] / 255;
        }
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = W * dpr;
      canvas!.height = H * dpr;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(performance.now());
    }

    function draw(now: number) {
      const t = now / 1000;
      const R = W * 0.12;
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = color;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let v = samples[r * cols + c];
          if (v < 0.05) continue;
          const cx = c * pitch + pitch / 2;
          const cy = r * pitch + pitch / 2;
          if (!reduceMotion) v *= 0.86 + 0.14 * Math.sin(t * 1.6 + c * 0.16 + r * 0.09);
          if (interactive) {
            const d = Math.hypot(cx - mouse.x, cy - mouse.y);
            if (d < R) v *= 0.25 + 0.75 * (d / R);
          }
          const sz = pitch * Math.min(1, Math.pow(v, 0.85)) * 0.9;
          if (sz < 0.6) continue;
          ctx!.fillRect(cx - sz / 2, cy - sz / 2, sz, sz);
        }
      }
    }

    function loop(now: number) {
      if (disposed) return;
      if (visible) draw(now);
      raf = requestAnimationFrame(loop);
    }

    const onMove = (e: PointerEvent) => {
      const b = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - b.left;
      mouse.y = e.clientY - b.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -1e4;
    };

    let resizeRaf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(build);
    });
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));

    document.fonts.load(`100px ${family}`).finally(() => {
      if (disposed) return;
      build();
      ro.observe(wrap);
      io.observe(canvas);
      if (interactive) {
        window.addEventListener("pointermove", onMove);
        document.addEventListener("pointerleave", onLeave);
      }
      if (!reduceMotion) raf = requestAnimationFrame(loop);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizeRaf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [key, cell, blur, smear, lineHeight, align, interactive, color]);

  return (
    <Tag ref={wrapRef} className={`halftone ${className}`}>
      <span className="sr-only">{label}</span>
      <canvas ref={canvasRef} aria-hidden className="halftone-canvas" />
    </Tag>
  );
}
