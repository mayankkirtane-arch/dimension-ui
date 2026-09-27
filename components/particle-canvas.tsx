"use client";

import { useEffect, useRef, useState } from "react";

import {
  DEFAULT_CONFIG,
  ParticleField,
  type FieldConfig,
} from "@/lib/particle-field";

/* ------------------------------------------------------------------ */
/*  Colour helpers                                                    */
/* ------------------------------------------------------------------ */

type Rgb = { r: number; g: number; b: number };

const PURPLE: Rgb = { r: 167, g: 139, b: 250 }; // #a78bfa
const PURPLE_DEEP: Rgb = { r: 139, g: 92, b: 246 }; // #8b5cf6
const CYAN: Rgb = { r: 34, g: 211, b: 238 }; // #22d3ee

/** Blend cyan → purple across t (0..1). */
function mixAccent(t: number): Rgb {
  const a = t < 0.5 ? CYAN : PURPLE_DEEP;
  const b = t < 0.5 ? PURPLE_DEEP : PURPLE;
  const k = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  return {
    r: Math.round(a.r + (b.r - a.r) * k),
    g: Math.round(a.g + (b.g - a.g) * k),
    b: Math.round(a.b + (b.b - a.b) * k),
  };
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export type ParticleCanvasProps = {
  /** Extra classes on the wrapper */
  className?: string;
  /** Density override — the component also adapts this to viewport size. */
  density?: number;
  /** Config overrides merged over DEFAULT_CONFIG */
  config?: Partial<FieldConfig>;
  /** Disable the mouse magnetic interaction */
  interactive?: boolean;
};

export function ParticleCanvas({
  className,
  density,
  config,
  interactive = true,
}: ParticleCanvasProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fieldRef = useRef<ParticleField | null>(null);

  /** Pointer in unit-cube space + whether it is currently active. */
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  /** Smoothed camera rotation, driven by the pointer. */
  const rotRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const [reducedMotion, setReducedMotion] = useState(false);

  /* ---- Reduced-motion preference ---- */
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  /* ---- Simulation + render loop ---- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    /* -------- Sizing (DPR-aware, capped at 2 for perf) -------- */
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;

    const field = new ParticleField(config);
    fieldRef.current = field;

    const resolveCount = (w: number, h: number): number => {
      if (typeof density === "number") return density;
      const area = w * h;
      // Scale density with area but keep it inside a predictable band.
      const base = Math.round(area / 7200);
      return Math.max(58, Math.min(148, base));
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const w = Math.max(rect.width, 1);
      const h = Math.max(rect.height, 1);

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = w;
      cssH = h;

      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      // Draw in CSS pixels; the DPR transform handles the rest.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      field.setCount(resolveCount(w, h));
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    /* -------- Pointer tracking -------- */
    const onPointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
      pointerRef.current.active =
        nx > -1.35 && nx < 1.35 && ny > -1.35 && ny < 1.35;

      // Camera reacts gently — deliberately subtle so it reads as parallax,
      // not as a spinning object.
      rotRef.current.tx = -ny * 0.2;
      rotRef.current.ty = nx * 0.28;
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
      rotRef.current.tx = 0;
      rotRef.current.ty = 0;
    };

    // Listen on the window so the field keeps reacting as the cursor crosses
    // neighbouring elements in the hero.
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave);

    /* -------- Visibility: skip work when offscreen/hidden -------- */
    let visible = true;
    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !document.hidden && entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    /* -------- Frame loop -------- */
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    let running = true;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!running) return;
      if (!visible) {
        last = now; // keep dt sane across a hidden stretch
        return;
      }

      // Clamp dt so a tab-switch stall can't teleport the particles.
      let dt = (now - last) / 1000;
      if (dt > 0.05) dt = 0.05;
      if (dt <= 0) dt = 1 / 60;
      last = now;
      // Reduced motion: slow the world down rather than freezing it.
      elapsed += reducedMotion ? dt * 0.22 : dt;

      /* Camera smoothing */
      const rot = rotRef.current;
      const ease = 1 - Math.pow(0.0016, dt); // frame-rate independent lerp
      rot.x += (rot.tx - rot.x) * ease;
      rot.y += (rot.ty - rot.y) * ease;

      /* Physics */
      const aspect = cssW / Math.max(cssH, 1);
      const pointer = pointerRef.current.active
        ? { x: pointerRef.current.x, y: pointerRef.current.y }
        : null;

      field.update(dt, elapsed, pointer, aspect);
      field.project(cssW, cssH, rot.x, rot.y);

      /* ---------- Draw ---------- */
      ctx.clearRect(0, 0, cssW, cssH);
      ctx.lineCap = "round";

      const linkDistance = field.config.linkDistance;
      const links = field.collectLinks(linkDistance);

      /* Links first so nodes sit on top of the web. */
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < links.length; i += 4) {
        const a = field.projected[links[i]];
        const b = field.projected[links[i + 1]];
        const alpha = links[i + 2];
        const depth = links[i + 3];

        const c = mixAccent(1 - depth);
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
        ctx.lineWidth = 0.35 + depth * 0.85;

        ctx.beginPath();
        ctx.moveTo(a.sx, a.sy);
        ctx.lineTo(b.sx, b.sy);
        ctx.stroke();
      }

      /* Nodes */
      for (let i = 0; i < field.particles.length; i += 1) {
        const p = field.particles[i];
        const proj = field.projected[i];
        const r = field.pulseRadius(i, elapsed);

        // Skip sub-pixel far nodes — invisible anyway, saves fill work.
        if (proj.sx < -20 || proj.sx > cssW + 20) continue;
        if (proj.sy < -20 || proj.sy > cssH + 20) continue;
        if (r < 0.55 && proj.depth < 0.42) continue;

        const c = mixAccent(p.hue);
        const coreAlpha = 0.16 + proj.depth * 0.82;

        /* Soft outer bloom on the larger, nearer particles only. */
        if (r > 1.1) {
          const glowR = r * 5.2;
          const grd = ctx.createRadialGradient(
            proj.sx,
            proj.sy,
            0,
            proj.sx,
            proj.sy,
            glowR,
          );
          grd.addColorStop(0, `rgba(${c.r},${c.g},${c.b},${coreAlpha * 0.42})`);
          grd.addColorStop(0.45, `rgba(${c.r},${c.g},${c.b},${coreAlpha * 0.12})`);
          grd.addColorStop(1, `rgba(${c.r},${c.g},${c.b},0)`);

          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, glowR, 0, Math.PI * 2);
          ctx.fill();
        }

        /* Bright core */
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${coreAlpha})`;
        ctx.beginPath();
        ctx.arc(proj.sx, proj.sy, r, 0, Math.PI * 2);
        ctx.fill();

        /* Near-white hot centre on the closest particles */
        if (proj.depth > 0.78 && r > 1.2) {
          ctx.fillStyle = `rgba(255,255,255,${(proj.depth - 0.78) * 1.9})`;
          ctx.beginPath();
          ctx.arc(proj.sx, proj.sy, r * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalCompositeOperation = "source-over";

      /* Cursor halo — a subtle magnetic-field indicator */
      if (pointer) {
        const px = (pointer.x * 0.5 + 0.5) * cssW;
        const py = (pointer.y * 0.5 + 0.5) * cssH;
        const halo = ctx.createRadialGradient(px, py, 0, px, py, 96);
        halo.addColorStop(0, "rgba(139,92,246,0.13)");
        halo.addColorStop(0.5, "rgba(6,182,212,0.05)");
        halo.addColorStop(1, "rgba(6,182,212,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(px, py, 96, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      fieldRef.current = null;
    };
  }, [config, density, interactive, reducedMotion]);

  return (
    <div ref={wrapRef} className={className}>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        role="presentation"
        className="block h-full w-full touch-none select-none"
      />
    </div>
  );
}

export default ParticleCanvas;

/** Re-exported so consumers can tune the field without a second import. */
export { DEFAULT_CONFIG as PARTICLE_FIELD_DEFAULTS };
