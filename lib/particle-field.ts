/**
 * Particle-field simulation for the DimensionUI hero canvas.
 *
 * Pure math + state, zero DOM. The React component owns the canvas and the
 * rAF loop; this module owns the particles so the render loop stays thin and
 * the physics stays independently testable.
 *
 * Coordinate space
 * ----------------
 * Particles live in a 3D box spanning x:[-1,1], y:[-1,1], z:[-1,1] (a unit
 * cube). A lightweight perspective projection maps that cube onto the canvas
 * each frame, so we get real depth cueing (near particles are larger, brighter
 * and connected by shorter-looking lines) without pulling in three.js.
 */

export type Particle = {
  /** Position in unit-cube space */
  x: number;
  y: number;
  z: number;
  /** Velocity in unit-cube space, per second */
  vx: number;
  vy: number;
  vz: number;
  /** Base radius multiplier, keeps particle sizes varied */
  size: number;
  /** 0 → cyan, 1 → purple. Fixed per particle so hues stay stable. */
  hue: number;
  /** Phase offset so the pulse never looks synchronised */
  phase: number;
};

export type ProjectedParticle = {
  /** Canvas-space position */
  sx: number;
  sy: number;
  /** Perspective scale factor (1 = at the z=0 plane) */
  scale: number;
  /** 0 (far) → 1 (near), used for alpha + line-width falloff */
  depth: number;
  radius: number;
};

export type FieldConfig = {
  /** Particle count. Density is capped by the caller for small viewports. */
  count: number;
  /** Field half-extent in unit space (1 = fills the cube) */
  extent: number;
  /** Drift speed in unit-space units per second */
  speed: number;
  /** Max distance (in *screen* px) at which two particles link */
  linkDistance: number;
  /** Magnetic pull radius in screen px */
  magnetRadius: number;
  /** Magnetic pull strength */
  magnetForce: number;
};

export const DEFAULT_CONFIG: FieldConfig = {
  count: 110,
  extent: 1,
  speed: 0.055,
  linkDistance: 132,
  magnetRadius: 230,
  magnetForce: 0.9,
};

/* ------------------------------------------------------------------ */
/*  Deterministic RNG                                                 */
/*  Using a seeded PRNG keeps the initial layout stable across        */
/*  HMR reloads, which makes visual tuning far less maddening.        */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Field                                                             */
/* ------------------------------------------------------------------ */

export class ParticleField {
  particles: Particle[] = [];

  /** Projected positions, reused every frame to avoid per-frame allocation. */
  readonly projected: ProjectedParticle[] = [];

  /** Cached link pairs, reused to avoid per-frame array churn. */
  #linkScratch: number[] = [];

  config: FieldConfig;

  readonly #extent: number;

  constructor(config: Partial<FieldConfig> = {}, seed = 20260916) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.#extent = this.config.extent;

    const rand = mulberry32(seed);
    // Cubed density distribution biases particles toward mid-depth, which
    // reads more like a volumetric cloud than a uniform cube of points.
    const { count } = this.config;

    for (let i = 0; i < count; i += 1) {
      const t = rand();
      const bias = 0.35;

      this.particles.push({
        x: (rand() * 2 - 1) * this.#extent * t ** bias,
        y: (rand() * 2 - 1) * this.#extent * t ** bias,
        z: (rand() * 2 - 1) * this.#extent,
        vx: (rand() * 2 - 1) * this.config.speed,
        vy: (rand() * 2 - 1) * this.config.speed,
        vz: (rand() * 2 - 1) * this.config.speed * 0.55,
        size: 0.72 + rand() * 0.75,
        hue: rand(),
        phase: rand() * Math.PI * 2,
      });

      this.projected.push({
        sx: 0,
        sy: 0,
        scale: 1,
        depth: 0.5,
        radius: 1,
      });
    }
  }

  /**
   * Advance the simulation.
   *
   * @param dt      Delta time in seconds, already clamped by the caller.
   * @param time    Elapsed seconds, used for the per-particle pulse.
   * @param pointer Pointer position in unit-cube space, or null when idle.
   * @param aspect  Canvas width / height — needed so the magnetic field is
   *                circular on screen rather than elliptical.
   */
  update(
    dt: number,
    time: number,
    pointer: { x: number; y: number } | null,
    aspect: number,
  ): void {
    const { speed, magnetRadius, magnetForce } = this.config;
    const extent = this.#extent;
    // Normalised radius: 1 means "at the magnet radius"
    const radiusNorm = Math.max(magnetRadius, 1);

    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];

      /* --- Brownian drift --------------------------------------- */
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;

      /* --- Gentle swirling so motion never looks linear ---------- */
      const swirl = 0.14;
      p.vx += Math.sin(time * 0.35 + p.phase) * swirl * dt;
      p.vy += Math.cos(time * 0.29 + p.phase * 1.3) * swirl * dt;
      p.vz += Math.sin(time * 0.23 + p.phase * 0.7) * swirl * dt * 0.5;

      /* --- Magnetic attraction toward the pointer --------------- */
      if (pointer) {
        const dx = pointer.x - p.x;
        const dy = (pointer.y - p.y) / Math.max(aspect, 0.35);
        const dz = -p.z * 0.25; // pull slightly toward the z=0 plane
        const dist = Math.hypot(dx, dy, dz);

        if (dist > 0.0001 && dist < radiusNorm) {
          // Smooth quad falloff — strong at the core, zero at the edge.
          const falloff = 1 - dist / radiusNorm;
          const pull = falloff * falloff * magnetForce * dt;

          p.vx += (dx / dist) * pull;
          p.vy += (dy / dist) * pull;
          p.vz += (dz / dist) * pull * 0.8;
        }
      }

      /* --- Speed damping + clamp so nothing runs away ----------- */
      const damping = 1 - Math.min(dt * 0.85, 0.35);
      p.vx *= damping;
      p.vy *= damping;
      p.vz *= damping;

      const maxSpeed = speed * 3.4;
      const sp = Math.hypot(p.vx, p.vy, p.vz);
      if (sp > maxSpeed) {
        const k = maxSpeed / sp;
        p.vx *= k;
        p.vy *= k;
        p.vz *= k;
      } else if (sp < speed * 0.22) {
        // Nudge slow particles back up so the field never freezes
        const k = (speed * 0.22) / Math.max(sp, 1e-5);
        p.vx *= k;
        p.vy *= k;
        p.vz *= k;
      }

      /* --- Soft containment: bounce with a little energy loss ---- */
      const bound = extent * 1.12;
      if (p.x > bound || p.x < -bound) {
        p.x = Math.max(-bound, Math.min(bound, p.x));
        p.vx *= -0.82;
      }
      if (p.y > bound || p.y < -bound) {
        p.y = Math.max(-bound, Math.min(bound, p.y));
        p.vy *= -0.82;
      }
      if (p.z > extent || p.z < -extent) {
        p.z = Math.max(-extent, Math.min(extent, p.z));
        p.vz *= -0.82;
      }
    }
  }

  /**
   * Project every particle into canvas space.
   *
   * @param width   CSS pixels
   * @param height  CSS pixels
   * @param rotX    Camera pitch, radians
   * @param rotY    Camera yaw, radians
   */
  project(width: number, height: number, rotX: number, rotY: number): void {
    // Perspective parameters
    const cameraZ = 2.65;
    const fov = 1.32; // focal length multiplier
    const baseScale = Math.min(width, height) * 0.5 * fov;
    const cx = width * 0.5;
    const cy = height * 0.5;

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];
      const out = this.projected[i];

      /* Yaw around Y axis */
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;

      /* Pitch around X axis */
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      /* Perspective divide */
      const denom = cameraZ - z2;
      const safeDenom = denom < 0.28 ? 0.28 : denom;
      const scale = baseScale / safeDenom;

      out.sx = cx + x1 * scale;
      out.sy = cy + y1 * scale;
      out.scale = scale;

      // Normalise depth to 0..1 over the visible z range
      const depth = (z2 + 1.25) / 2.5;
      out.depth = depth < 0 ? 0 : depth > 1 ? 1 : depth;

      const r = p.size * scale * 0.021;
      out.radius = r < 0.5 ? 0.5 : r > 3.4 ? 3.4 : r;
    }
  }

  /**
   * Collect screen-space links between nearby particles.
   *
   * O(n²) over 100–140 particles is ~10k cheap comparisons per frame, which is
   * comfortably inside a 16.6 ms budget. A spatial hash would only start to pay
   * off past roughly 700 particles, so it would be premature complexity here.
   *
   * Returns a flat array of [aIndex, bIndex, alpha, depthAvg] quads, so the
   * caller can iterate without allocating sub-arrays.
   */
  collectLinks(cullDistance: number): number[] {
    const links = this.#linkScratch;
    links.length = 0;

    const proj = this.projected;
    const n = this.particles.length;
    const max2 = cullDistance * cullDistance;

    for (let i = 0; i < n; i += 1) {
      const a = proj[i];

      for (let j = i + 1; j < n; j += 1) {
        const b = proj[j];

        const dx = a.sx - b.sx;
        // Cheap reject on X before the squared-distance test
        if (dx > cullDistance || dx < -cullDistance) continue;

        const dy = a.sy - b.sy;
        if (dy > cullDistance || dy < -cullDistance) continue;

        const d2 = dx * dx + dy * dy;
        if (d2 > max2) continue;

        const dist = Math.sqrt(d2);
        // Fade with both proximity and depth — distant links read as haze.
        const proximity = 1 - dist / cullDistance;
        const alpha = proximity * proximity * (0.34 + a.depth * 0.5);

        links.push(i, j, alpha, (a.depth + b.depth) * 0.5);
      }
    }

    return links;
  }

  /** Resize-aware density control. Rebuilds the field at a sensible count. */
  setCount(count: number, seed = 20260916): void {
    if (count === this.particles.length) return;
    const next = new ParticleField({ ...this.config, count }, seed);
    this.particles = next.particles;
    this.projected.length = 0;
    for (const p of next.projected) this.projected.push(p);
  }

  /** Current animated radius for a particle, factoring in the pulse. */
  pulseRadius(index: number, time: number): number {
    const p = this.particles[index];
    const pulse = 0.72 + Math.sin(time * 1.5 + p.phase) * 0.28;
    return this.projected[index].radius * pulse;
  }
}
