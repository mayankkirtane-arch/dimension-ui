/**
 * Registry Connector for DimensionUI MCP Server.
 * 
 * Interacts with the DimensionUI registry as the canonical source of truth.
 * Supports natural language semantic keyword matching, template detail queries,
 * block discovery, compatibility matrix lookups, and installation guidance.
 */

const http = require("http");
const https = require("https");
const { URL } = require("url");

const DEFAULT_REGISTRY_URL = process.env.DIMENSIONUI_REGISTRY_URL || "http://localhost:3000";

function fetchJson(urlStr) {
  return new Promise((resolve, reject) => {
    let parsed;
    try {
      parsed = new URL(urlStr);
    } catch {
      return reject(new Error(`Invalid URL: ${urlStr}`));
    }

    const transport = parsed.protocol === "https:" ? https : http;
    const req = transport.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
        path: parsed.pathname + parsed.search,
        method: "GET",
        headers: {
          "Accept": "application/json",
          "User-Agent": "DimensionUI-MCP/1.0.0",
        },
        timeout: 5000,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve({ statusCode: res.statusCode, json });
          } catch {
            resolve({ statusCode: res.statusCode, json: null, text: data });
          }
        });
      }
    );

    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Request timed out at ${urlStr}`));
    });

    req.on("error", (err) => {
      reject(err);
    });

    req.end();
  });
}

class RegistryConnector {
  constructor(baseUrl = DEFAULT_REGISTRY_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  /**
   * Search templates with intelligent keyword scoring and facet filtering.
   */
  async searchTemplates({ query, category, tier, hasFigma, hasIntegration, limit = 5 }) {
    const res = await fetchJson(`${this.baseUrl}/api/registry?type=template`);
    if (res.statusCode !== 200 || !res.json || !res.json.items) {
      throw new Error(`Failed to query registry: HTTP ${res.statusCode}`);
    }

    let items = res.json.items;

    // Apply explicit facet filters
    if (category) {
      items = items.filter((i) => i.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (tier) {
      items = items.filter((i) => i.tier.toLowerCase() === tier.toLowerCase());
    }

    // Natural Language Scoring if query provided
    if (query && typeof query === "string" && query.trim()) {
      const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
      
      const scored = items.map((item) => {
        let score = 0;
        const text = `${item.name} ${item.title} ${item.description} ${item.category} ${item.tags.join(" ")}`.toLowerCase();
        
        for (const term of terms) {
          if (text.includes(term)) {
            score += 3;
          }
        }

        // Special semantic boosts
        if (terms.some((t) => ["dark", "darkmode", "obsidian"].includes(t)) && text.includes("dark")) {
          score += 4;
        }
        if (terms.some((t) => ["pricing", "billing", "subscriptions"].includes(t)) && (text.includes("pricing") || text.includes("billing"))) {
          score += 4;
        }
        if (terms.some((t) => ["dashboard", "analytics", "admin"].includes(t)) && (text.includes("dashboard") || text.includes("analytics"))) {
          score += 4;
        }
        if (terms.some((t) => ["free", "$0"].includes(t)) && item.tier === "free") {
          score += 5;
        }

        return { item, score };
      });

      scored.sort((a, b) => b.score - a.score);
      items = scored.filter((s) => s.score > 0).map((s) => s.item);
    }

    // Secondary filters: Figma & Integrations require full manifest check for matched subset
    const results = [];
    for (const item of items.slice(0, limit * 2)) {
      if (results.length >= limit) break;

      try {
        const manifestRes = await fetchJson(`${this.baseUrl}/api/registry/${item.name}`);
        if (manifestRes.statusCode === 200 && manifestRes.json) {
          const m = manifestRes.json;

          if (hasFigma !== undefined) {
            const isFigmaIncluded = m.metadata?.figma?.state === "Figma Included";
            if (hasFigma && !isFigmaIncluded) continue;
            if (!hasFigma && isFigmaIncluded) continue;
          }

          if (hasIntegration) {
            const hasIntg = m.metadata?.integrations?.some((intg) =>
              intg.name.toLowerCase().includes(hasIntegration.toLowerCase())
            );
            if (!hasIntg) continue;
          }

          results.push({
            name: m.name,
            title: m.title,
            description: m.description,
            category: m.metadata.category,
            tier: m.license.tier,
            price: m.license.price,
            access: m.access,
            features: m.metadata.features || [],
            figma: m.metadata.figma,
            integrations: m.metadata.integrations || [],
            installCommand: `npx dimensionui add ${m.name}`,
            previewUrl: `${this.baseUrl}${m.metadata.previewUrl}`,
          });
        }
      } catch {
        // Fallback to basic index item if manifest fetch fails
        results.push({
          name: item.name,
          title: item.title,
          description: item.description,
          category: item.category,
          tier: item.tier,
          price: item.price,
          access: item.access,
          installCommand: `npx dimensionui add ${item.name}`,
        });
      }
    }

    return {
      totalFound: results.length,
      templates: results,
    };
  }

  /**
   * Retrieve full manifest for a template.
   */
  async getTemplate(name) {
    if (!name || typeof name !== "string") {
      throw new Error("Parameter 'name' is required (e.g. 'aether-ai-saas').");
    }

    const normalized = name.toLowerCase().trim();
    const res = await fetchJson(`${this.baseUrl}/api/registry/${normalized}`);

    if (res.statusCode === 404) {
      throw new Error(`Template '${name}' not found in the DimensionUI registry.`);
    }
    if (res.statusCode !== 200 || !res.json) {
      throw new Error(`Failed to retrieve template '${name}': HTTP ${res.statusCode}`);
    }

    const manifest = res.json;

    // Strict security sanitization: ensure no internal passwords or server keys are returned
    delete manifest._internal;
    delete manifest.serverSecrets;

    return manifest;
  }

  /**
   * Search for modular UI blocks and interactive 3D components.
   */
  async searchBlocks({ query, market, tier, limit = 10 }) {
    const res = await fetchJson(`${this.baseUrl}/api/registry?type=block`);
    const compRes = await fetchJson(`${this.baseUrl}/api/registry?type=component`);

    const allBlocks = [
      ...(res.json?.items || []),
      ...(compRes.json?.items || []),
    ];

    let filtered = allBlocks;

    if (market) {
      filtered = filtered.filter((b) => b.category.toLowerCase().includes(market.toLowerCase()));
    }
    if (tier) {
      filtered = filtered.filter((b) => b.tags.some((t) => t.toLowerCase() === tier.toLowerCase()));
    }
    if (query) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return {
      totalFound: filtered.length,
      blocks: filtered.slice(0, limit).map((b) => ({
        name: b.name,
        title: b.title,
        type: b.type,
        market: b.category,
        description: b.description,
        installCommand: `npx dimensionui add ${b.name}`,
      })),
    };
  }

  /**
   * Get technical compatibility matrix for templates.
   */
  async getCompatibility(templateId) {
    if (templateId) {
      const manifest = await this.getTemplate(templateId);
      return {
        templateId: manifest.name,
        templateName: manifest.title,
        framework: manifest.framework,
        version: manifest.version,
        compatibilityMatrix: manifest.metadata.compatibility || [],
      };
    }

    // Default global stack baseline
    return {
      baseline: "DimensionUI Next.js 15 Baseline",
      frameworks: {
        "Next.js": { version: "15.1.6", status: "Supported", notes: "App Router default" },
        "React": { version: "19.0.0", status: "Supported", notes: "React Server Components & Server Actions" },
        "Tailwind CSS": { version: "4.0.0", status: "Supported", notes: "CSS-first @theme configuration" },
        "TypeScript": { version: "5.7.3", status: "Supported", notes: "Strict type checking enabled" },
      },
      platforms: {
        "Vercel": { status: "Supported", notes: "Zero-config deployment with optimized edge runtime" },
        "Netlify": { status: "Supported", notes: "Supported via @netlify/plugin-nextjs" },
        "Cloudflare": { status: "Not tested", notes: "Requires OpenNext adapter" },
      },
    };
  }

  /**
   * Provide exact CLI installation guidance and dependency list.
   */
  async getInstallationInfo(name, packageManager = "npm") {
    const manifest = await this.getTemplate(name);

    const pm = ["npm", "pnpm", "yarn", "bun"].includes(packageManager) ? packageManager : "npm";
    const depList = Object.keys(manifest.dependencies || {}).join(" ");
    const devDepList = Object.keys(manifest.devDependencies || {}).join(" ");

    let installDepsCmd = "";
    if (pm === "pnpm") {
      installDepsCmd = [depList ? `pnpm add ${depList}` : "", devDepList ? `pnpm add -D ${devDepList}` : ""]
        .filter(Boolean)
        .join(" && ");
    } else if (pm === "yarn") {
      installDepsCmd = [depList ? `yarn add ${depList}` : "", devDepList ? `yarn add -D ${devDepList}` : ""]
        .filter(Boolean)
        .join(" && ");
    } else if (pm === "bun") {
      installDepsCmd = [depList ? `bun add ${depList}` : "", devDepList ? `bun add -d ${devDepList}` : ""]
        .filter(Boolean)
        .join(" && ");
    } else {
      installDepsCmd = [depList ? `npm install ${depList}` : "", devDepList ? `npm install -D ${devDepList}` : ""]
        .filter(Boolean)
        .join(" && ");
    }

    const isFree = manifest.license.tier === "free";

    return {
      name: manifest.name,
      title: manifest.title,
      type: manifest.type,
      access: manifest.access,
      price: manifest.license.price,
      isFree,
      cliCommand: `npx dimensionui add ${manifest.name}`,
      requiredDependencies: manifest.dependencies || {},
      devDependencies: manifest.devDependencies || {},
      dependencyInstallCommand: installDepsCmd,
      targetFiles: (manifest.files || []).map((f) => ({
        destination: f.target || f.path,
        type: f.type,
        locked: f.locked,
      })),
      authorizationNote: isFree
        ? "Public resource: free to add without authentication."
        : `Commercial resource (${manifest.license.price}): requires license authorization before source code can be extracted.`,
    };
  }
}

module.exports = {
  RegistryConnector,
  DEFAULT_REGISTRY_URL,
};
