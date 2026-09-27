/**
 * AmbientBackdrop
 *
 * The fixed, non-interactive atmosphere behind the entire page:
 *   1. base obsidian fill
 *   2. dot-grid with a radial fade so it dissolves toward the edges
 *   3. soft purple + cyan radial glow blobs
 *   4. a faint top light-leak and a bottom vignette for depth
 *
 * Purely decorative — rendered once in the root layout and never re-mounted.
 * All layers are `pointer-events-none` so they can never intercept clicks.
 */
export function AmbientBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-obsidian"
    >
      {/* ---- Dot grid ---- */}
      <div className="absolute inset-0 bg-dot-grid mask-radial-fade" />

      {/* ---- Fine secondary grid for parallax depth ---- */}
      <div className="absolute inset-0 bg-dot-grid-fine opacity-40 mask-radial-fade" />

      {/* ---- Purple glow, upper-left of the hero ---- */}
      <div className="glow-purple absolute -top-[18rem] -left-[14rem] h-[46rem] w-[46rem] animate-glow-pulse rounded-full blur-[110px]" />

      {/* ---- Cyan glow, upper-right ---- */}
      <div
        className="glow-cyan absolute -top-[14rem] -right-[16rem] h-[42rem] w-[42rem] animate-glow-pulse rounded-full blur-[120px]"
        style={{ animationDelay: "-1.5s" }}
      />

      {/* ---- Deep violet floor glow near the fold ---- */}
      <div
        className="glow-purple absolute top-[52rem] left-1/2 h-[40rem] w-[70rem] -translate-x-1/2 rounded-full opacity-45 blur-[130px]"
        style={{ animationDelay: "-0.75s" }}
      />

      {/* ---- Top light leak ---- */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />

      {/* ---- Bottom vignette ---- */}
      <div className="absolute inset-x-0 bottom-0 h-[28rem] bg-gradient-to-t from-obsidian via-obsidian/70 to-transparent" />
    </div>
  );
}
